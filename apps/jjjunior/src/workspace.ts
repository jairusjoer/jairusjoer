import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { config } from './config.ts';
import { run } from './exec.ts';
import type { Issue, Project } from './gitlab.ts';

const git = (cwd: string, ...args: string[]) => run('git', args, { cwd });

const repoDir = (project: Project) => join(config.reposDir, project.path_with_namespace);
const worktreeDir = (project: Project, issue: Issue) =>
  join(config.worktreesDir, `${basename(project.path_with_namespace)}-${issue.iid}`);

export const branchName = (issue: Issue) => `issue-${issue.iid}`;

/** Ensure a clone and an issue worktree exist; reuse the branch on re-runs. */
export const prepareWorktree = async (project: Project, issue: Issue) => {
  const repo = repoDir(project);
  if (!existsSync(repo)) {
    await mkdir(join(repo, '..'), { recursive: true });
    await run('git', ['clone', project.ssh_url_to_repo, repo]);
  }
  await git(repo, 'fetch', '--prune', 'origin');

  const dir = worktreeDir(project, issue);
  if (!existsSync(dir)) await addWorktree(repo, project, issue, dir);
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

export const removeWorktree = async (project: Project, issue: Issue) => {
  const dir = worktreeDir(project, issue);
  if (!existsSync(dir)) return;
  await git(repoDir(project), 'worktree', 'remove', '--force', dir).catch(() =>
    rm(dir, { recursive: true, force: true }),
  );
  await git(repoDir(project), 'worktree', 'prune');
};
