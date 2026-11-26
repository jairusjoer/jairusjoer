import { Effect } from 'effect';
import { enc, rest } from './client.ts';
import type { Issue, Note, Project } from './types.ts';

const findMergeRequest = (project: Project, branch: string) =>
  rest<{ iid: number; web_url: string }[]>(
    'GET',
    `projects/${project.id}/merge_requests?state=opened&source_branch=${enc(branch)}`,
  ).pipe(Effect.map((mrs) => mrs[0]));

/** Unresolved, non-system notes from the open MR of `branch`, including inline diff comments. */
export const getMergeRequestNotes = (project: Project, branch: string) =>
  Effect.gen(function* () {
    const mr = yield* findMergeRequest(project, branch);
    if (!mr) return [];
    const discussions = yield* rest<{ notes: Note[] }[]>(
      'GET',
      `projects/${project.id}/merge_requests/${mr.iid}/discussions?per_page=100`,
    );
    return discussions
      .flatMap((d) => d.notes)
      .filter((n) => !n.system && !n.resolved)
      .map((n): Note => {
        const p = n.position;
        const line = p && (p.new_line ? `${p.new_path}:${p.new_line}` : `${p.old_path}:${p.old_line} (removed)`);
        return { ...n, where: line ? `MR ${line}` : 'MR' };
      });
  });

/** Create a draft MR assigned to the token's user unless one is already open; return its URL. */
export const ensureMergeRequest = (issue: Issue, project: Project, branch: string) =>
  Effect.gen(function* () {
    const existing = yield* findMergeRequest(project, branch);
    if (existing) return existing.web_url;
    const me = yield* rest<{ id: number }>('GET', 'user');
    const mr = yield* rest<{ web_url: string }>('POST', `projects/${project.id}/merge_requests`, {
      source_branch: branch,
      target_branch: project.default_branch,
      title: `Draft: Resolve "${issue.title}"`,
      description: `Closes #${issue.iid}`,
      assignee_ids: [me.id],
      remove_source_branch: true,
    });
    return mr.web_url;
  });
