import { config } from '../config/config.ts';
import { enc, graphql, rest } from './client.ts';
import type { Issue, Note } from './types.ts';

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

export const getNotes = async (issue: Issue) =>
  (await rest<Note[]>('GET', `${issuePath(issue)}/notes?sort=asc&per_page=100`)).filter((n) => !n.system);

export const comment = (issue: Issue, body: string) => rest('POST', `${issuePath(issue)}/notes`, { body });
