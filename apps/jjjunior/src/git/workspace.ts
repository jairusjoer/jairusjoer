import { basename, join } from 'node:path';
import { Effect, FileSystem, Semaphore } from 'effect';
import { AppConfig } from '../config/config.ts';
import type { Issue, Project } from '../gitlab/types.ts';
import { ExecError, run } from '../lib/exec.ts';

const git = (cwd: string, ...args: string[]) => run('git', args, { cwd });

export const branchName = (issue: Issue) => `issue-${issue.iid}`;

const repoDir = (project: Project) => AppConfig.useSync((c) => join(c.reposDir, project.path_with_namespace));

const worktreeDir = (project: Project, issue: Issue) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const { worktreesDir } = yield* AppConfig;
    const legacy = join(worktreesDir, `${basename(project.path_with_namespace)}-${issue.iid}`);
    if (yield* fs.exists(legacy)) return legacy; // worktrees created before namespaced names
    return join(worktreesDir, `${project.path_with_namespace.replaceAll('/', '__')}-${issue.iid}`);
  });

/** Serialises clone/fetch/worktree operations per repository. */
const locks = new Map<string, Semaphore.Semaphore>();
const withLock = <A, E, R>(repo: string, self: Effect.Effect<A, E, R>) => {
  const lock = locks.get(repo) ?? Semaphore.makeUnsafe(1);
  locks.set(repo, lock);
  return lock.withPermits(1)(self);
};

/** Ensure a clone and an issue worktree exist; reuse the branch on re-runs. */
export const prepareWorktree = (project: Project, issue: Issue) =>
  Effect.gen(function* () {
    const repo = yield* repoDir(project);
    return yield* withLock(repo, prepare(project, issue, repo));
  });

const prepare = (project: Project, issue: Issue, repo: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    if (!(yield* fs.exists(repo))) {
      yield* fs.makeDirectory(join(repo, '..'), { recursive: true });
      yield* run('git', ['clone', project.ssh_url_to_repo, repo]);
    }
    yield* git(repo, 'fetch', '--prune', 'origin');

    const dir = yield* worktreeDir(project, issue);
    if (!(yield* fs.exists(dir))) {
      yield* addWorktree(repo, project, issue, dir);
      return dir;
    }
    // Pick up commits a human pushed meanwhile; fails loudly if the histories diverged.
    const remote = `origin/${branchName(issue)}`;
    const remoteExists = yield* git(dir, 'rev-parse', '--verify', '--quiet', remote).pipe(
      Effect.as(true),
      Effect.catch(() => Effect.succeed(false)),
    );
    if (remoteExists) {
      if ((yield* git(dir, 'status', '--porcelain')).trim()) yield* git(dir, 'stash', 'push', '-u', '-m', 'jjjunior');
      yield* git(dir, 'merge', '--ff-only', remote).pipe(
        Effect.mapError(
          (e) =>
            new ExecError({
              message: `${e.message}\nBranch diverged from ${remote}; reset or delete ${dir} manually.`,
            }),
        ),
      );
    }
    return dir;
  });

const addWorktree = (repo: string, project: Project, issue: Issue, dir: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const { worktreesDir } = yield* AppConfig;
    const branch = branchName(issue);
    const remoteExists = (yield* git(repo, 'ls-remote', '--heads', 'origin', branch)).trim() !== '';
    const base = remoteExists ? `origin/${branch}` : `origin/${project.default_branch}`;
    yield* fs.makeDirectory(worktreesDir, { recursive: true });
    yield* git(repo, 'worktree', 'add', '-B', branch, dir, base);
  });

export const headSha = (dir: string) => git(dir, 'rev-parse', 'HEAD').pipe(Effect.map((s) => s.trim()));

export const push = (dir: string, issue: Issue) => git(dir, 'push', '-u', 'origin', branchName(issue));

export const hasCommits = (dir: string, project: Project) =>
  git(dir, 'rev-list', '--count', `origin/${project.default_branch}..HEAD`).pipe(Effect.map((s) => s.trim() !== '0'));

export const removeWorktree = (project: Project, issue: Issue) =>
  Effect.gen(function* () {
    const repo = yield* repoDir(project);
    yield* withLock(repo, remove(project, issue, repo));
  });

const remove = (project: Project, issue: Issue, repo: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const dir = yield* worktreeDir(project, issue);
    if (!(yield* fs.exists(dir))) return;
    yield* git(repo, 'worktree', 'remove', '--force', dir).pipe(
      Effect.catch(() => fs.remove(dir, { recursive: true, force: true })),
    );
    yield* git(repo, 'worktree', 'prune');
  });
