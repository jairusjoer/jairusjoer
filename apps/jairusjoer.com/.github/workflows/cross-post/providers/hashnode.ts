export interface HashnodePostInput {
  contentMarkdown: string;
  coverImageOptions?: {
    coverImageURL: string;
  };
  metaTags?: {
    description?: string;
    image?: string;
    title?: string;
  };
  originalArticleURL: string;
  slug: string;
  title: string;
}

export interface HashnodePostRecord {
  canonicalUrl?: string | null;
  id: string;
  slug: string;
  url: string;
}

interface HashnodePostConnection {
  edges: Array<{ node: HashnodePostRecord }>;
  pageInfo: {
    endCursor?: string | null;
    hasNextPage: boolean;
  };
}

async function requestHashnode<T>(token: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch('https://gql.hashnode.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(`Hashnode error: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error('Hashnode response did not include data.');
  }

  return json.data;
}

export async function listHashnodePosts(token: string, publicationId: string): Promise<HashnodePostRecord[]> {
  const posts: HashnodePostRecord[] = [];
  let after: string | null = null;

  while (true) {
    const data: { publication?: { posts?: HashnodePostConnection | null } | null } = await requestHashnode(
      token,
      `
        query PublicationPosts($publicationId: ObjectId!, $first: Int!, $after: String) {
          publication(id: $publicationId) {
            posts(first: $first, after: $after) {
              edges {
                node {
                  canonicalUrl
                  id
                  slug
                  url
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      `,
      {
        after,
        first: 20,
        publicationId,
      },
    );

    const connection = data.publication?.posts;

    if (!connection) {
      return posts;
    }

    posts.push(...connection.edges.map((edge) => edge.node));

    if (!connection.pageInfo.hasNextPage) {
      return posts;
    }

    after = connection.pageInfo.endCursor ?? null;
  }
}

export async function createHashnodePost(
  token: string,
  publicationId: string,
  post: HashnodePostInput,
): Promise<Pick<HashnodePostRecord, 'id' | 'url'>> {
  const data = await requestHashnode<{ publishPost: { post: Pick<HashnodePostRecord, 'id' | 'url'> } }>(
    token,
    `
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            url
          }
        }
      }
    `,
    {
      input: {
        publicationId,
        ...post,
      },
    },
  );

  return data.publishPost.post;
}

export async function updateHashnodePost(
  token: string,
  id: string,
  post: HashnodePostInput,
): Promise<Pick<HashnodePostRecord, 'id' | 'url'>> {
  const data = await requestHashnode<{ updatePost: { post: Pick<HashnodePostRecord, 'id' | 'url'> } }>(
    token,
    `
      mutation UpdatePost($input: UpdatePostInput!) {
        updatePost(input: $input) {
          post {
            id
            url
          }
        }
      }
    `,
    {
      input: {
        id,
        ...post,
      },
    },
  );

  return data.updatePost.post;
}
