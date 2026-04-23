import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { site } from '../../src/config.ts';

const CONTENT_ROOT = path.join('src', 'content');

const MAP_FILE = path.join('src', 'content.map.json');

const RELEASE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

const GITHUB_REPOSITORY = requireEnv('GITHUB_REPOSITORY');
const GITHUB_SHA = requireEnv('GITHUB_SHA');

const DEVTO_TOKEN = requireEnv('DEVTO_TOKEN');

const HASHNODE_PUBLICATION_ID = requireEnv('HASHNODE_PUBLICATION_ID');
const HASHNODE_TOKEN = requireEnv('HASHNODE_TOKEN');

const previousMap: CrosspostMap = fs.existsSync(MAP_FILE)
  ? (JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) as CrosspostMap)
  : {};

interface ParsedCrosspostFrontmatter {
  date?: Date | string;
  description?: string;
  image?: string;
  series?: string;
  status?: 'Draft';
  title?: string;
}

interface CrosspostFrontmatter extends ParsedCrosspostFrontmatter {
  title: string;
}

interface LocalPost {
  canonicalUrl: string;
  contentHash: string;
  contentMarkdown: string;
  coverImage?: string;
  data: CrosspostFrontmatter;
  dateMs?: number;
  file: string;
  id: string;
  metadataImage?: string;
}

export interface CrosspostMapEntry {
  contentHash?: string;
  devtoId?: number;
  devtoUrl?: string;
  file: string;
  hashnodePostId?: string;
  hashnodeUrl?: string;
  publishedAt?: string;
  scheduledFor?: string;
  updatedAt: string;
}

export type CrosspostMap = Record<string, CrosspostMapEntry>;

interface DevtoPostInput {
  body_markdown: string;
  canonical_url: string;
  description?: string;
  main_image?: string;
  published: true;
  series?: string;
  title: string;
}

interface DevtoPostRecord {
  canonical_url?: string;
  id: number;
  url: string;
}

interface HashnodePostInput {
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

interface HashnodePostRecord {
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

interface MatchedPostState {
  devtoId?: number;
  devtoUrl?: string;
  hashnodePostId?: string;
  hashnodeUrl?: string;
  post: LocalPost;
  previousEntry?: CrosspostMapEntry;
  wasReleasedBeforeRun: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function parseStoredDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function parseFrontmatterDate(value: Date | string | undefined, file: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${file}: invalid date ${JSON.stringify(value)}`);
    }

    return value;
  }

  if (typeof value !== 'string') {
    throw new Error(`${file}: invalid date ${JSON.stringify(value)}`);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)
    ? new Date(`${normalizedValue}T00:00:00.000Z`)
    : new Date(normalizedValue);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${file}: invalid date ${JSON.stringify(value)}`);
  }

  return parsed;
}

function assertCrosspostFrontmatter(
  data: ParsedCrosspostFrontmatter,
  file: string,
): asserts data is CrosspostFrontmatter {
  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error(`${file}: missing title`);
  }
}

function comparePostsByDate(a: LocalPost, b: LocalPost): number {
  const aDateMs = a.dateMs ?? Number.POSITIVE_INFINITY;
  const bDateMs = b.dateMs ?? Number.POSITIVE_INFINITY;

  if (aDateMs !== bDateMs) {
    return aDateMs - bDateMs;
  }

  return a.id.localeCompare(b.id);
}

function buildReleaseSchedule(posts: MatchedPostState[], now: Date): Map<string, string> {
  const scheduledFor = new Map<string, string>();

  const latestReleasedAt = posts.reduce<Date | undefined>((latest, state) => {
    if (!state.wasReleasedBeforeRun) {
      return latest;
    }

    const releasedAt =
      parseStoredDate(state.previousEntry?.publishedAt) ?? parseStoredDate(state.previousEntry?.scheduledFor);

    if (!releasedAt) {
      return latest;
    }

    if (!latest || releasedAt.getTime() > latest.getTime()) {
      return releasedAt;
    }

    return latest;
  }, undefined);

  let nextReleaseAt = latestReleasedAt
    ? new Date(Math.max(now.getTime(), latestReleasedAt.getTime() + RELEASE_INTERVAL_MS))
    : now;

  for (const state of posts
    .filter((state) => !state.wasReleasedBeforeRun)
    .sort((a, b) => comparePostsByDate(a.post, b.post))) {
    scheduledFor.set(state.post.id, nextReleaseAt.toISOString());
    nextReleaseAt = new Date(nextReleaseAt.getTime() + RELEASE_INTERVAL_MS);
  }

  return scheduledFor;
}

function normalizeLookupUrl(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  try {
    return new URL(normalizedValue).toString().replace(/\/$/, '');
  } catch {
    return normalizedValue.replace(/\/$/, '');
  }
}

function indexBy<T>(items: T[], selectKey: (item: T) => string | undefined): Map<string, T> {
  const index = new Map<string, T>();

  for (const item of items) {
    const key = selectKey(item);

    if (key && !index.has(key)) {
      index.set(key, item);
    }
  }

  return index;
}

function parseMarkdownFile(file: string): { content: string; data: ParsedCrosspostFrontmatter } {
  const raw = fs.readFileSync(file, 'utf8');

  const parsed = matter(raw);

  return {
    content: parsed.content,
    data: parsed.data as ParsedCrosspostFrontmatter,
  };
}

function resolveRepositoryAssetUrl(file: string, target: string): string {
  if (!GITHUB_REPOSITORY || !GITHUB_SHA) {
    return target;
  }

  const resolvedFile = path.resolve(path.dirname(file), target);
  const relativeFile = path.relative(process.cwd(), resolvedFile);

  if (relativeFile.startsWith('..')) {
    return target;
  }

  return `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${GITHUB_SHA}/${toPosixPath(relativeFile)}`;
}

function absolutizeContentUrls(content: string, file: string): string {
  const rewriteUrl = (value: string): string => {
    const normalizedValue = value.trim();

    if (
      !normalizedValue ||
      /^(?:#|mailto:|tel:|data:)/i.test(normalizedValue) ||
      /^(?:[a-z]+:)?\/\//i.test(normalizedValue)
    ) {
      return value;
    }

    if (normalizedValue.startsWith('/')) {
      return `${site.url}${normalizedValue}`;
    }

    if (normalizedValue.startsWith('./') || normalizedValue.startsWith('../')) {
      return resolveRepositoryAssetUrl(file, normalizedValue);
    }

    return value;
  };

  return content
    .replace(/(!?\[[^\]]*\]\()([^)\s]+)(\))/g, (_match, prefix: string, value: string, suffix: string) => {
      return `${prefix}${rewriteUrl(value)}${suffix}`;
    })
    .replace(/(href|src)=(['"])([^'"]+)(\2)/g, (_match, attribute: string, quote: string, value: string) => {
      return `${attribute}=${quote}${rewriteUrl(value)}${quote}`;
    });
}

function resolveMetadataImage(id: string): string | undefined {
  const generatedFile = path.join('public', 'og', `${id}.png`);

  if (!fs.existsSync(generatedFile)) {
    return undefined;
  }

  const relativeFile = toPosixPath(path.relative('public', generatedFile));

  if (GITHUB_REPOSITORY && GITHUB_SHA) {
    return `https://raw.githubusercontent.com/${GITHUB_REPOSITORY}/${GITHUB_SHA}/public/${relativeFile}`;
  }

  return `${site.url}/${relativeFile}`;
}

function resolveCoverImage(file: string, data: CrosspostFrontmatter): string | undefined {
  const candidate = data.image;

  if (!candidate) {
    return undefined;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(candidate)) {
    return candidate;
  }

  if (candidate.startsWith('/')) {
    return `${site.url}${candidate}`;
  }

  if (candidate.startsWith('./') || candidate.startsWith('../')) {
    return resolveRepositoryAssetUrl(file, candidate);
  }

  return undefined;
}

function readLocalPosts(): LocalPost[] {
  const files: string[] = [];

  const walk = (directory: string) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (['.md', '.mdoc', '.mdx'].includes(path.extname(entry.name))) {
        files.push(absolutePath);
      }
    }
  };

  walk(path.join(CONTENT_ROOT, 'writing'));
  walk(path.join(CONTENT_ROOT, 'archive'));

  return files.sort().flatMap((file) => {
    const { content, data } = parseMarkdownFile(file);

    if (data.status === 'Draft') {
      return [];
    }

    assertCrosspostFrontmatter(data, file);

    const relativeFile = path.relative(CONTENT_ROOT, file);
    const id = toPosixPath(relativeFile.slice(0, -path.extname(relativeFile).length));
    const dateMs = parseFrontmatterDate(data.date, file)?.getTime();
    const canonicalUrl = `${site.url}/${id}`;
    const contentMarkdown = `${absolutizeContentUrls(content, file).trim()}\n`;
    const coverImage = resolveCoverImage(file, data);
    const metadataImage = resolveMetadataImage(id);

    return [
      {
        canonicalUrl,
        contentHash: crypto
          .createHash('sha256')
          .update(
            JSON.stringify({
              canonicalUrl,
              content: contentMarkdown,
              coverImage: coverImage ?? null,
              description: data.description ?? '',
              metadataImage: metadataImage ?? null,
              series: data.series ?? null,
              title: data.title,
            }),
          )
          .digest('hex'),
        contentMarkdown,
        coverImage,
        data,
        dateMs,
        file,
        id,
        metadataImage,
      },
    ];
  });
}

async function requestDevto<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`https://dev.to/api${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'jairusjoer.com cross-post workflow',
      'api-key': DEVTO_TOKEN,
      accept: 'application/vnd.forem.api-v1+json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`dev.to ${method} ${endpoint} failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

async function listDevtoPosts(): Promise<DevtoPostRecord[]> {
  const posts: DevtoPostRecord[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await requestDevto<DevtoPostRecord[]>(`/articles/me/all?page=${page}&per_page=1000`);
    posts.push(...batch);

    if (batch.length < 1000) {
      return posts;
    }
  }
}

async function createDevtoPost(post: DevtoPostInput): Promise<Pick<DevtoPostRecord, 'id' | 'url'>> {
  return requestDevto('/articles', 'POST', { article: post });
}

async function updateDevtoPost(id: number, post: DevtoPostInput): Promise<Pick<DevtoPostRecord, 'id' | 'url'>> {
  return requestDevto(`/articles/${id}`, 'PUT', { article: post });
}

async function requestHashnode<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch('https://gql.hashnode.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: HASHNODE_TOKEN,
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

async function listHashnodePosts(): Promise<HashnodePostRecord[]> {
  const posts: HashnodePostRecord[] = [];
  let after: string | null = null;

  while (true) {
    const data: { publication?: { posts?: HashnodePostConnection | null } | null } = await requestHashnode(
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
        publicationId: HASHNODE_PUBLICATION_ID,
      },
    );

    const connection: HashnodePostConnection | null | undefined = data.publication?.posts;

    if (!connection) {
      return posts;
    }

    posts.push(...connection.edges.map((edge: { node: HashnodePostRecord }) => edge.node));

    if (!connection.pageInfo.hasNextPage) {
      return posts;
    }

    after = connection.pageInfo.endCursor ?? null;
  }
}

async function createHashnodePost(post: HashnodePostInput): Promise<Pick<HashnodePostRecord, 'id' | 'url'>> {
  const data = await requestHashnode<{ publishPost: { post: Pick<HashnodePostRecord, 'id' | 'url'> } }>(
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
        publicationId: HASHNODE_PUBLICATION_ID,
        ...post,
      },
    },
  );

  return data.publishPost.post;
}

async function updateHashnodePost(
  id: string,
  post: HashnodePostInput,
): Promise<Pick<HashnodePostRecord, 'id' | 'url'>> {
  const data = await requestHashnode<{ updatePost: { post: Pick<HashnodePostRecord, 'id' | 'url'> } }>(
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

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const isDryRun = args.has('--dry-run');
  const isForceUpdate = args.has('--force-update');
  const localPosts = readLocalPosts();
  const updatedAt = new Date().toISOString();
  const now = new Date(updatedAt);

  if (isDryRun) {
    console.log('[i]', 'Running in dry-run mode');
  }

  if (isForceUpdate) {
    console.log('[i]', 'Running in force-update mode');
  }

  const [devtoPosts, hashnodePosts] = await Promise.all([listDevtoPosts(), listHashnodePosts()]);

  const devtoByCanonical = indexBy(devtoPosts, (post) => normalizeLookupUrl(post.canonical_url));
  const hashnodeByCanonical = indexBy(hashnodePosts, (post) => normalizeLookupUrl(post.canonicalUrl));
  const hashnodeBySlug = indexBy(hashnodePosts, (post) => post.slug);

  const matchedPosts: MatchedPostState[] = localPosts.map((post) => {
    const previousEntry = previousMap[post.id];
    const normalizedCanonicalUrl = normalizeLookupUrl(post.canonicalUrl);
    const hashnodeSlug = post.id.replace(/\//g, '-');

    const devtoMatch = normalizedCanonicalUrl ? devtoByCanonical.get(normalizedCanonicalUrl) : undefined;
    const hashnodeMatch = normalizedCanonicalUrl
      ? (hashnodeByCanonical.get(normalizedCanonicalUrl) ?? hashnodeBySlug.get(hashnodeSlug))
      : hashnodeBySlug.get(hashnodeSlug);

    const devtoId = devtoMatch?.id ?? previousEntry?.devtoId;
    const devtoUrl = devtoMatch?.url ?? previousEntry?.devtoUrl;
    const hashnodePostId = hashnodeMatch?.id ?? previousEntry?.hashnodePostId;
    const hashnodeUrl = hashnodeMatch?.url ?? previousEntry?.hashnodeUrl;

    return {
      devtoId,
      devtoUrl,
      hashnodePostId,
      hashnodeUrl,
      post,
      previousEntry,
      wasReleasedBeforeRun: Boolean(devtoId || hashnodePostId),
    };
  });

  const releaseSchedule = buildReleaseSchedule(matchedPosts, now);

  const nextMap: CrosspostMap = {};
  let matchedDevtoPosts = 0;
  let matchedHashnodePosts = 0;

  for (const state of matchedPosts) {
    const { post, previousEntry, wasReleasedBeforeRun } = state;
    const scheduledFor = releaseSchedule.get(post.id) ?? previousEntry?.scheduledFor;
    const scheduledDate = parseStoredDate(scheduledFor);
    const isScheduledForNow = scheduledDate ? scheduledDate.getTime() <= now.getTime() : false;
    const shouldPublish = wasReleasedBeforeRun || isScheduledForNow;

    let { devtoId, devtoUrl, hashnodePostId, hashnodeUrl } = state;
    let publishedAt = previousEntry?.publishedAt;
    let releasedThisRun = false;

    if (isDryRun) {
      if (devtoId) {
        matchedDevtoPosts += 1;
      }

      if (hashnodePostId) {
        matchedHashnodePosts += 1;
      }
    } else {
      const hasChanged = previousEntry?.contentHash ? previousEntry.contentHash !== post.contentHash : false;

      if (!shouldPublish) {
        console.log('[i]', `Queued ${post.id} for ${scheduledFor}`);
      }

      const devtoPost: DevtoPostInput = {
        body_markdown: post.contentMarkdown,
        canonical_url: post.canonicalUrl,
        description: post.data.description ?? undefined,
        main_image: post.coverImage,
        published: true,
        series: post.data.series ?? undefined,
        title: post.data.title,
      };

      if (shouldPublish && !devtoId) {
        const created = await createDevtoPost(devtoPost);
        devtoId = created.id;
        devtoUrl = created.url;
        releasedThisRun = true;
        console.log('[d]', `Created ${post.id}`);
        await sleep(1000);
      } else if (shouldPublish && (hasChanged || isForceUpdate) && devtoId) {
        const updated = await updateDevtoPost(devtoId, devtoPost);
        devtoId = updated.id;
        devtoUrl = updated.url;
        console.log('[d]', `Updated ${post.id}`);
        await sleep(1000);
      }

      const hashnodePost: HashnodePostInput = {
        contentMarkdown: post.contentMarkdown,
        metaTags: {
          description: post.data.description ?? undefined,
          image: post.metadataImage,
          title: post.data.title,
        },
        originalArticleURL: post.canonicalUrl,
        slug: post.id.replace(/\//g, '-'),
        title: post.data.title,
        ...(post.coverImage ? { coverImageOptions: { coverImageURL: post.coverImage } } : {}),
      };

      if (shouldPublish && !hashnodePostId) {
        const created = await createHashnodePost(hashnodePost);
        hashnodePostId = created.id;
        hashnodeUrl = created.url;
        releasedThisRun = true;
        console.log('[h]', `Created ${post.id}`);
        await sleep(1000);
      } else if (shouldPublish && (hasChanged || isForceUpdate) && hashnodePostId) {
        const updated = await updateHashnodePost(hashnodePostId, hashnodePost);
        hashnodePostId = updated.id;
        hashnodeUrl = updated.url;
        console.log('[h]', `Updated ${post.id}`);
        await sleep(1000);
      }

      if (shouldPublish && !hasChanged && !isForceUpdate && devtoId && hashnodePostId && !releasedThisRun) {
        console.log('[i]', `Skipped ${post.id}`);
      }

      if (!publishedAt && (releasedThisRun || (wasReleasedBeforeRun && scheduledFor))) {
        publishedAt = releasedThisRun ? updatedAt : scheduledFor;
      }
    }

    nextMap[post.id] = {
      ...(isDryRun ? {} : { contentHash: post.contentHash }),
      devtoId,
      devtoUrl,
      file: post.file,
      hashnodePostId,
      hashnodeUrl,
      ...(publishedAt ? { publishedAt } : {}),
      ...(scheduledFor ? { scheduledFor } : {}),
      updatedAt,
    };
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify(nextMap, null, 2) + '\n');

  if (isDryRun) {
    console.log(
      '[✓]',
      `Dry-run complete: mapped ${matchedDevtoPosts} dev.to posts and ${matchedHashnodePosts} Hashnode posts.`,
    );
  }
}

await main();
