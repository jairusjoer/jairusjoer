import { Effect } from 'effect';
import { AppConfig } from '../config/config.ts';
import { enc, GitlabError, graphql, rest } from './client.ts';
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

type Page = { group: null | { workItems: { nodes: Node[]; pageInfo: { hasNextPage: boolean; endCursor: string } } } };

/** Every open, assigned, labelled, current-iteration issue across the group's projects. */
export const listIssues = Effect.gen(function* () {
  const config = yield* AppConfig;
  const nodes: Node[] = [];
  let after: string | null = null;
  do {
    const data: Page = yield* graphql<Page>(ITEMS, {
      group: config.group,
      assignee: config.assignee,
      labels: config.triggerLabel ? [config.triggerLabel] : null,
      iteration: config.currentIterationOnly ? 'CURRENT' : null,
      after,
    });
    if (!data.group) return yield* new GitlabError({ message: `Group "${config.group}" not found or not accessible` });
    const { nodes: page, pageInfo } = data.group.workItems;
    nodes.push(...page);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  return nodes.map((n): Issue => ({
    gid: n.id,
    iid: Number(n.iid),
    project: n.namespace.fullPath,
    title: n.title,
    description: n.widgets.find((w) => 'description' in w)?.description ?? '',
    status: n.widgets.find((w) => 'status' in w)?.status?.name ?? null,
    webUrl: n.webUrl,
  }));
});

const issuePath = (issue: Issue) => `projects/${enc(issue.project)}/issues/${issue.iid}`;

export const isClosed = (issue: Issue) =>
  rest<{ state: string }>('GET', issuePath(issue)).pipe(Effect.map((i) => i.state === 'closed'));

export const setStatus = (issue: Issue, name: string) =>
  graphql<{ workItemUpdate: { errors: string[] } }>(
    `
      mutation ($id: WorkItemID!, $name: String!) {
        workItemUpdate(input: { id: $id, statusWidget: { name: $name } }) {
          errors
        }
      }
    `,
    { id: issue.gid, name },
  ).pipe(
    Effect.flatMap(({ workItemUpdate: { errors } }) =>
      errors.length ? Effect.fail(new GitlabError({ message: `setStatus: ${errors.join('; ')}` })) : Effect.void,
    ),
  );

export const getNotes = (issue: Issue) =>
  rest<Note[]>('GET', `${issuePath(issue)}/notes?sort=asc&per_page=100`).pipe(
    Effect.map((notes) => notes.filter((n) => !n.system)),
  );

export const comment = (issue: Issue, body: string) => rest('POST', `${issuePath(issue)}/notes`, { body });
