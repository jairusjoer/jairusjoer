import { CROSSPOST_USER_AGENT } from '../config.ts';

export interface DevtoPostInput {
  body_markdown: string;
  canonical_url: string;
  description?: string;
  main_image?: string;
  published: true;
  series?: string;
  title: string;
}

export interface DevtoPostRecord {
  canonical_url?: string;
  id: number;
  url: string;
}

async function requestDevto<T>(
  token: string,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await fetch(`https://dev.to/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': CROSSPOST_USER_AGENT,
      'api-key': token,
      accept: 'application/vnd.forem.api-v1+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`dev.to ${method} ${endpoint} failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

export async function listDevtoPosts(token: string): Promise<DevtoPostRecord[]> {
  const posts: DevtoPostRecord[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await requestDevto<DevtoPostRecord[]>(token, `/articles/me/all?page=${page}&per_page=1000`);
    posts.push(...batch);

    if (batch.length < 1000) {
      return posts;
    }
  }
}

export function createDevtoPost(token: string, post: DevtoPostInput): Promise<Pick<DevtoPostRecord, 'id' | 'url'>> {
  return requestDevto(token, '/articles', 'POST', { article: post });
}

export function updateDevtoPost(
  token: string,
  id: number,
  post: DevtoPostInput,
): Promise<Pick<DevtoPostRecord, 'id' | 'url'>> {
  return requestDevto(token, `/articles/${id}`, 'PUT', { article: post });
}
