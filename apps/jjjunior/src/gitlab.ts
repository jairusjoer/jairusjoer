import { stripVTControlCharacters } from 'node:util';
import { config } from './config.ts';
import { run } from './exec.ts';

/** A board card. Board lists are work item statuses, not labels. */
export type Issue = {
  gid: string;
  iid: number;
  project: string; // full path, e.g. my-group/subgroup/my-project
  title: string;
  description: string;
  status: string | null;
  webUrl: string;
};

export type Project = {
  id: number;
  path_with_namespace: string;
  ssh_url_to_repo: string;
  default_branch: string;
};

export type Note = {
  body: string;
  system: boolean;
  author: { username: string };
  created_at: string;
  resolved?: boolean;
  position?: { new_path: string; new_line: number | null; old_path: string; old_line: number | null };
  /** Where the note was left, e.g. "MR src/a.ts:12"; unset for issue comments. */
  where?: string;
};

const glab = async <T>(args: string[], body?: object): Promise<T> => {
  if (body) args.push('--input', '-');
  const out = await run('glab', ['api', ...args], { input: body ? JSON.stringify(body) : undefined });
  return (out.trim() ? JSON.parse(out) : undefined) as T;
};

const rest = <T>(method: string, path: string, body?: object) =>
  glab<T>(['-X', method, path, ...(method === 'GET' ? ['--paginate'] : [])], body);

const graphql = async <T>(query: string, variables: object = {}): Promise<T> => {
  const res = await glab<{ data: T; errors?: { message: string }[] }>(['graphql', '-X', 'POST'], { query, variables });
  if (res.errors?.length) throw new Error(`GraphQL: ${res.errors.map((e) => e.message).join('; ')}`);
  return res.data;
};

const ITEMS = `query($group: ID!, $assignee: String!, $labels: [String!], $iteration: IterationWildcardId, $after: String) {
  group(fullPath: $group) {
    workItems(includeDescendants: true, state: opened, assigneeUsernames: [$assignee],
              labelName: $labels, iterationWildcardId: $iteration, types: [ISSUE], first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id iid title webUrl namespace { fullPath }
        widgets {
          ... on WorkItemWidgetDescription { description }
          ... on WorkItemWidgetStatus { status { name } }
        }
      }
    }
  }
}`;

type Node = {
  id: string;
  iid: string;
  title: string;
  webUrl: string;
  namespace: { fullPath: string };
  widgets: { description?: string | null; status?: { name: string } | null }[];
};

/** Every open, assigned, labelled, current-iteration issue across the group's projects. */
export const listIssues = async (): Promise<Issue[]> => {
  const nodes: Node[] = [];
  let after: string | null = null;
  do {
    const data: { group: { workItems: { nodes: Node[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } } =
      await graphql(ITEMS, {
        group: config.group,
        assignee: config.assignee,
        labels: config.triggerLabel ? [config.triggerLabel] : null,
        iteration: config.currentIterationOnly ? 'CURRENT' : null,
        after,
      });
    const { nodes: page, pageInfo } = data.group.workItems;
    nodes.push(...page);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  return nodes.map((n) => ({
    gid: n.id,
    iid: Number(n.iid),
    project: n.namespace.fullPath,
    title: n.title,
    description: n.widgets.find((w) => 'description' in w)?.description ?? '',
    status: n.widgets.find((w) => 'status' in w)?.status?.name ?? null,
    webUrl: n.webUrl,
  }));
};

const enc = encodeURIComponent;
const issuePath = (issue: Issue) => `projects/${enc(issue.project)}/issues/${issue.iid}`;

export const isClosed = async (issue: Issue) =>
  (await rest<{ state: string }>('GET', issuePath(issue))).state === 'closed';

export const setStatus = async (issue: Issue, name: string) => {
  const data = await graphql<{ workItemUpdate: { errors: string[] } }>(
    `
      mutation ($id: WorkItemID!, $name: String!) {
        workItemUpdate(input: { id: $id, statusWidget: { name: $name } }) {
          errors
        }
      }
    `,
    { id: issue.gid, name },
  );
  if (data.workItemUpdate.errors.length) throw new Error(`setStatus: ${data.workItemUpdate.errors.join('; ')}`);
};

export const getProject = (fullPath: string) => rest<Project>('GET', `projects/${enc(fullPath)}`);

export const getNotes = async (issue: Issue) =>
  (await rest<Note[]>('GET', `${issuePath(issue)}/notes?sort=asc&per_page=100`)).filter((n) => !n.system);

/** Unresolved, non-system notes from the open MR of `branch`, including inline diff comments. */
export const getMergeRequestNotes = async (project: Project, branch: string) => {
  const mr = await findMergeRequest(project, branch);
  if (!mr) return [];
  const discussions = await rest<{ notes: Note[] }[]>(
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
};

export const comment = (issue: Issue, body: string) => rest('POST', `${issuePath(issue)}/notes`, { body });

let myId: Promise<number> | undefined;
const me = () => (myId ??= rest<{ id: number }>('GET', 'user').then((u) => u.id));

const findMergeRequest = async (project: Project, branch: string) =>
  (
    await rest<{ iid: number; web_url: string }[]>(
      'GET',
      `projects/${project.id}/merge_requests?state=opened&source_branch=${enc(branch)}`,
    )
  )[0];

/** Create a draft MR assigned to the token's user unless one is already open; return its URL. */
export const ensureMergeRequest = async (issue: Issue, project: Project, branch: string) => {
  const existing = await findMergeRequest(project, branch);
  if (existing) return existing.web_url;
  const mr = await rest<{ web_url: string }>('POST', `projects/${project.id}/merge_requests`, {
    source_branch: branch,
    target_branch: project.default_branch,
    title: `Draft: Resolve "${issue.title}"`,
    description: `Closes #${issue.iid}`,
    assignee_ids: [await me()],
    remove_source_branch: true,
  });
  return mr.web_url;
};

// --- CI ----------------------------------------------------------------------
const PENDING = ['created', 'waiting_for_resource', 'preparing', 'pending', 'running', 'scheduled'];

export type Pipeline = { id: number; status: string; web_url: string };

/** All pipelines for a commit (push and merge request pipelines). */
export const pipelinesFor = (projectId: number, sha: string) =>
  rest<Pipeline[]>('GET', `projects/${projectId}/pipelines?sha=${sha}`);

export const isPending = (p: Pipeline) => PENDING.includes(p.status);

/** Tail of each failed job's log, ANSI codes and section markers stripped. */
export const failedJobLogs = async (projectId: number, pipelines: Pipeline[], linesPerJob = 150) => {
  const logs: string[] = [];
  for (const p of pipelines.filter((p) => p.status === 'failed')) {
    const jobs = await rest<{ id: number; name: string; stage: string; web_url: string }[]>(
      'GET',
      `projects/${projectId}/pipelines/${p.id}/jobs?scope[]=failed`,
    );
    for (const job of jobs) {
      const trace = await run('glab', ['api', `projects/${projectId}/jobs/${job.id}/trace`]);
      const clean = stripVTControlCharacters(trace)
        .replace(/section_(start|end):\d+:[^\r\n]*\r?/g, '')
        .split('\n')
        .map((line) => line.replace(/^\S+Z [0-9a-f]{2}[OE]\+? ?/, ''))
        .slice(-linesPerJob)
        .join('\n');
      logs.push(`### Job "${job.name}" (stage ${job.stage}) ${job.web_url}\n\n\`\`\`\n${clean}\n\`\`\``);
    }
  }
  return logs.join('\n\n');
};
