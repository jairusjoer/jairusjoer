import { join } from 'node:path';
import { Context, Effect, FileSystem, Layer } from 'effect';
import { AppConfig } from '../config/config.ts';
import type { Issue, Note, Project } from '../gitlab/types.ts';

/** System prompts live in `prompts/*.md` (override the directory with PROMPTS_DIR), read once at startup. */
export class Prompts extends Context.Service<Prompts, { readonly implementer: string; readonly reviewer: string }>()(
  'jjjunior/Prompts',
) {
  static readonly layer = Layer.effect(
    Prompts,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const { promptsDir } = yield* AppConfig;
      const read = (name: string) =>
        fs.readFileString(join(promptsDir, `${name}.md`)).pipe(Effect.map((s) => s.trim()));
      return { implementer: yield* read('implementer'), reviewer: yield* read('reviewer') };
    }),
  );
}

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
