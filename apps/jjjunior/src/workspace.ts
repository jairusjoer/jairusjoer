import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { config } from './config.ts';
import { run } from './exec.ts';
import type { Issue, Project } from './gitlab.ts';

const git = (cwd: string, ...args: string[]) => run('git', args, { cwd });

const repoDir = (project: Project) => join(config.reposDir, project.path_with_namespace);
const worktreeDir = (project: Project, issue: Issue) => {
  const legacy = join(config.worktreesDir, `${basename(project.path_with_namespace)}-${issue.iid}`);
  if (existsSync(legacy)) return legacy; // worktrees created before namespaced names
  return join(config.worktreesDir, `${project.path_with_namespace.replaceAll('/', '__')}-${issue.iid}`);
};

export const branchName = (issue: Issue) => `issue-${issue.iid}`;

/** Ensure a clone and an issue worktree exist; reuse the branch on re-runs. */
export const prepareWorktree = (project: Project, issue: Issue) =>
  withLock(repoDir(project), () => prepare(project, issue, repoDir(project)));

/** Serialises clone/fetch/worktree operations per repository. */
const locks = new Map<string, Promise<unknown>>();
const withLock = <T>(repo: string, fn: () => Promise<T>): Promise<T> => {
  const result = (locks.get(repo) ?? Promise.resolve()).then(fn);
  locks.set(
    repo,
    result.catch(() => {}),
  );
  return result;
};

const prepare = async (project: Project, issue: Issue, repo: string) => {
  if (!existsSync(repo)) {
    await mkdir(join(repo, '..'), { recursive: true });
    await run('git', ['clone', project.ssh_url_to_repo, repo]);
  }
  await git(repo, 'fetch', '--prune', 'origin');

  const dir = worktreeDir(project, issue);
  if (!existsSync(dir)) {
    await addWorktree(repo, project, issue, dir);
  } else {
    // Pick up commits a human pushed meanwhile; fails loudly if the histories diverged.
    const remote = `origin/${branchName(issue)}`;
    if (
      await git(dir, 'rev-parse', '--verify', '--quiet', remote).then(
        () => true,
        () => false,
      )
    ) {
      if ((await git(dir, 'status', '--porcelain')).trim()) await git(dir, 'stash', 'push', '-u', '-m', 'jjjunior');
      await git(dir, 'merge', '--ff-only', remote).catch((e) => {
        throw new Error(`${e.message}\nBranch diverged from ${remote}; reset or delete ${dir} manually.`);
      });
    }
  }
  return dir;
};

const addWorktree = async (repo: string, project: Project, issue: Issue, dir: string) => {
  const branch = branchName(issue);
  const remoteExists = await git(repo, 'ls-remote', '--heads', 'origin', branch).then((o) => o.trim() !== '');
  const base = remoteExists ? `origin/${branch}` : `origin/${project.default_branch}`;
  await mkdir(config.worktreesDir, { recursive: true });
  await git(repo, 'worktree', 'add', '-B', branch, dir, base);
};

export const headSha = async (dir: string) => (await git(dir, 'rev-parse', 'HEAD')).trim();

export const push = (dir: string, issue: Issue) => git(dir, 'push', '-u', 'origin', branchName(issue));

export const hasCommits = async (dir: string, project: Project) =>
  (await git(dir, 'rev-list', '--count', `origin/${project.default_branch}..HEAD`)).trim() !== '0';

export const removeWorktree = (project: Project, issue: Issue) =>
  withLock(repoDir(project), () => remove(project, issue));

const remove = async (project: Project, issue: Issue) => {
  const dir = worktreeDir(project, issue);
  if (!existsSync(dir)) return;
  await git(repoDir(project), 'worktree', 'remove', '--force', dir).catch(() =>
    rm(dir, { recursive: true, force: true }),
  );
  await git(repoDir(project), 'worktree', 'prune');
};
