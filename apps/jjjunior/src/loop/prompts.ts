import type { Issue, Note, Project } from '../gitlab/types.ts';

export const IMPLEMENTER = `You are an autonomous engineer implementing a GitLab issue in a dedicated git worktree.
- Follow the repository's conventions (read CLAUDE.md/README/CONTRIBUTING if present). Prefer simple, minimal changes.
- Verify your work: run the relevant tests, linters and type checks. Add tests for new behaviour.
- Make sure the project's CI checks would pass (run the same commands CI runs, see .gitlab-ci.yml).
- Commit your work on the current branch with clear messages. Do NOT push, do NOT create merge requests, do NOT change the issue status — the orchestrator does that.
- If requirements are ambiguous or contradictory such that you would have to guess at product decisions, stop and report status "blocked" with a precise question instead of guessing.`;

export const REVIEWER = `You are an adversarial code reviewer. Your job is to find reasons this change should NOT ship.
- You must NOT modify files, commit, or push. Read, run tests, and inspect only.
- Check: does it fully satisfy the issue and any human comments? Correctness and edge cases, regressions, missing or weak tests, security, scope creep, needless complexity.
- Before deciding, you MUST run the test suite, type check and linter yourself (install dependencies if needed) and report the exact commands and results. Never trust the implementer's summary. If you could not run them, do not approve.
- Approve only if there are no blocking issues. Nitpicks and style preferences are not blocking — omit them.
- If rejecting, list each blocking finding concretely (file, line, what is wrong, what is expected).`;

/** Issue description plus issue comments and unresolved MR review comments, merged chronologically. */
export const issueContext = (issue: Issue, notes: Note[]) => {
  const discussion = notes
    .toSorted((a, b) => a.created_at.localeCompare(b.created_at))
    .map((n) => `**@${n.author.username}** (${[n.created_at, n.where].filter(Boolean).join(', ')}):\n${n.body}`)
    .join('\n\n---\n\n');
  return `# Issue #${issue.iid}: ${issue.title}\n${issue.webUrl}\n\n${issue.description || '(no description)'}\n\n## Discussion (oldest first; issue comments and unresolved merge request review comments; later human comments override earlier requirements)\n\n${discussion || '(none)'}`;
};

export const implementPrompt = (context: string, project: Project) =>
  `${context}\n\n---\n\nImplement this issue in ${project.path_with_namespace}. If this branch already contains earlier work, build on it and address the latest feedback in the discussion.`;

export const reviewPrompt = (context: string, project: Project, summary: string) =>
  `${context}\n\n---\n\nReview the changes on the current branch: \`git diff origin/${project.default_branch}...HEAD\`.\n\nImplementer's summary (do not trust blindly):\n\n${summary}`;
