/// <reference types="node" />
import fs from 'node:fs';
import { MAP_FILE, readCrosspostEnvironment, RELEASE_INTERVAL_MS, REQUEST_DELAY_MS } from './config.ts';
import { readLocalPosts, type LocalPost } from './content.ts';
import {
  createDevtoPost,
  listDevtoPosts,
  updateDevtoPost,
  type DevtoPostInput,
  type DevtoPostRecord,
} from './providers/devto.ts';
import {
  createHashnodePost,
  listHashnodePosts,
  updateHashnodePost,
  type HashnodePostInput,
  type HashnodePostRecord,
} from './providers/hashnode.ts';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CrosspostMapEntry {
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

type CrosspostMap = Record<string, CrosspostMapEntry>;

interface MatchedPostState {
  devtoId?: number;
  devtoUrl?: string;
  hashnodePostId?: string;
  hashnodeUrl?: string;
  post: LocalPost;
  previousEntry?: CrosspostMapEntry;
  wasReleasedBeforeRun: boolean;
}

type SyncAction = 'none' | 'would-create' | 'would-update' | 'created' | 'updated';

function pauseAfterWrite(): Promise<void> {
  if (REQUEST_DELAY_MS <= 0) {
    return Promise.resolve();
  }

  return sleep(REQUEST_DELAY_MS);
}

function readCrosspostMap(filePath: string): CrosspostMap {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CrosspostMap;
}

function writeCrosspostMap(filePath: string, map: CrosspostMap): void {
  const sortedMap = Object.fromEntries(
    Object.entries(map).sort(([leftId, leftEntry], [rightId, rightEntry]) => {
      const leftTimestamp = Date.parse(leftEntry.scheduledFor ?? '');
      const rightTimestamp = Date.parse(rightEntry.scheduledFor ?? '');
      const leftHasScheduledDate = !Number.isNaN(leftTimestamp);
      const rightHasScheduledDate = !Number.isNaN(rightTimestamp);

      if (leftHasScheduledDate && rightHasScheduledDate && leftTimestamp !== rightTimestamp) {
        return leftTimestamp - rightTimestamp;
      }

      if (leftHasScheduledDate !== rightHasScheduledDate) {
        return leftHasScheduledDate ? -1 : 1;
      }

      return leftId.localeCompare(rightId);
    }),
  );

  fs.writeFileSync(filePath, JSON.stringify(sortedMap, null, 2) + '\n');
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

function comparePostsByDate(a: LocalPost, b: LocalPost): number {
  const aDateMs = a.dateMs ?? Number.POSITIVE_INFINITY;
  const bDateMs = b.dateMs ?? Number.POSITIVE_INFINITY;

  if (aDateMs !== bDateMs) {
    return aDateMs - bDateMs;
  }

  return a.id.localeCompare(b.id);
}

function matchPosts(params: {
  devtoPosts: DevtoPostRecord[];
  hashnodePosts: HashnodePostRecord[];
  localPosts: LocalPost[];
  previousMap: CrosspostMap;
}): MatchedPostState[] {
  const devtoByCanonical = indexBy(params.devtoPosts, (post) => normalizeLookupUrl(post.canonical_url));
  const hashnodeByCanonical = indexBy(params.hashnodePosts, (post) => normalizeLookupUrl(post.canonicalUrl));
  const hashnodeBySlug = indexBy(params.hashnodePosts, (post) => post.slug);

  return params.localPosts.map((post) => {
    const previousEntry = params.previousMap[post.id];
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
    .filter((entry) => !entry.wasReleasedBeforeRun)
    .sort((left, right) => comparePostsByDate(left.post, right.post))) {
    scheduledFor.set(state.post.id, nextReleaseAt.toISOString());
    nextReleaseAt = new Date(nextReleaseAt.getTime() + RELEASE_INTERVAL_MS);
  }

  return scheduledFor;
}

function buildDevtoPost(post: LocalPost): DevtoPostInput {
  return {
    body_markdown: post.contentMarkdown,
    canonical_url: post.canonicalUrl,
    description: post.data.description ?? undefined,
    main_image: post.coverImage,
    published: true,
    series: post.data.series ?? undefined,
    title: post.data.title,
  };
}

function buildHashnodePost(post: LocalPost): HashnodePostInput {
  return {
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
}

async function syncProviderPost<TId, TPost>(params: {
  create: (post: TPost) => Promise<{ id: TId; url: string }>;
  currentId?: TId;
  currentUrl?: string;
  hasChanged: boolean;
  isDryRun: boolean;
  isForceUpdate: boolean;
  post: TPost;
  shouldPublish: boolean;
  update: (id: TId, post: TPost) => Promise<{ id: TId; url: string }>;
}): Promise<{ action: SyncAction; id?: TId; url?: string }> {
  const { create, currentId, currentUrl, hasChanged, isDryRun, isForceUpdate, post, shouldPublish, update } = params;

  if (!shouldPublish) {
    return { action: 'none', id: currentId, url: currentUrl };
  }

  if (currentId === undefined) {
    if (isDryRun) {
      return { action: 'would-create', id: currentId, url: currentUrl };
    }

    const created = await create(post);
    await pauseAfterWrite();

    return { action: 'created', id: created.id, url: created.url };
  }

  if (!hasChanged && !isForceUpdate) {
    return { action: 'none', id: currentId, url: currentUrl };
  }

  if (isDryRun) {
    return { action: 'would-update', id: currentId, url: currentUrl };
  }

  const updated = await update(currentId, post);
  await pauseAfterWrite();

  return { action: 'updated', id: updated.id, url: updated.url };
}

function logSummary(
  summary: {
    devto: { created: number; matched: number; updated: number; wouldCreate: number; wouldUpdate: number };
    hashnode: { created: number; matched: number; updated: number; wouldCreate: number; wouldUpdate: number };
    queued: number;
    scheduled: number;
    skipped: number;
  },
  isDryRun: boolean,
): void {
  const providerLabel = isDryRun ? 'would create' : 'created';
  const updateLabel = isDryRun ? 'would update' : 'updated';
  const modeLabel = isDryRun ? 'Dry-run' : 'Cross-post';

  console.log(
    '[✓]',
    `${modeLabel} complete: queued ${summary.queued}, skipped ${summary.skipped}, scheduled ${summary.scheduled}.`,
  );
  console.log(
    '[i]',
    `dev.to matched ${summary.devto.matched}, ${providerLabel} ${isDryRun ? summary.devto.wouldCreate : summary.devto.created}, ${updateLabel} ${isDryRun ? summary.devto.wouldUpdate : summary.devto.updated}`,
  );
  console.log(
    '[i]',
    `Hashnode matched ${summary.hashnode.matched}, ${providerLabel} ${isDryRun ? summary.hashnode.wouldCreate : summary.hashnode.created}, ${updateLabel} ${isDryRun ? summary.hashnode.wouldUpdate : summary.hashnode.updated}`,
  );
}

async function main(): Promise<void> {
  const args = new Set(process.argv.slice(2));
  const isDryRun = args.has('--dry-run');
  const isForceUpdate = args.has('--force-update');
  const environment = readCrosspostEnvironment();
  const previousMap = readCrosspostMap(MAP_FILE);
  const localPosts = readLocalPosts(environment);
  const updatedAt = new Date().toISOString();
  const now = new Date(updatedAt);
  const summary = {
    devto: { created: 0, matched: 0, updated: 0, wouldCreate: 0, wouldUpdate: 0 },
    hashnode: { created: 0, matched: 0, updated: 0, wouldCreate: 0, wouldUpdate: 0 },
    queued: 0,
    scheduled: 0,
    skipped: 0,
  };

  if (isDryRun) {
    console.log('[i]', 'Running in dry-run mode');
  }

  if (isForceUpdate) {
    console.log('[i]', 'Running in force-update mode');
  }

  const [devtoPosts, hashnodePosts] = await Promise.all([
    listDevtoPosts(environment.devtoToken),
    listHashnodePosts(environment.hashnodeToken, environment.hashnodePublicationId),
  ]);

  const matchedPosts = matchPosts({
    devtoPosts,
    hashnodePosts,
    localPosts,
    previousMap,
  });
  const releaseSchedule = buildReleaseSchedule(matchedPosts, now);

  const nextMap: CrosspostMap = {};

  for (const state of matchedPosts) {
    const { post, previousEntry, wasReleasedBeforeRun } = state;
    const scheduledFor = releaseSchedule.get(post.id) ?? previousEntry?.scheduledFor;
    const scheduledDate = parseStoredDate(scheduledFor);
    const shouldPublish = wasReleasedBeforeRun || Boolean(scheduledDate && scheduledDate.getTime() <= now.getTime());
    const hasChanged = previousEntry?.contentHash ? previousEntry.contentHash !== post.contentHash : false;

    let { devtoId, devtoUrl, hashnodePostId, hashnodeUrl } = state;
    let publishedAt = previousEntry?.publishedAt;
    let releasedThisRun = false;

    if (devtoId) {
      summary.devto.matched += 1;
    }

    if (hashnodePostId) {
      summary.hashnode.matched += 1;
    }

    if (!wasReleasedBeforeRun && scheduledFor) {
      summary.scheduled += 1;
    }

    if (!shouldPublish && scheduledFor) {
      summary.queued += 1;
      console.log('[i]', `Queued ${post.id} for ${scheduledFor}`);
    }

    const devtoResult = await syncProviderPost({
      create: (payload) => createDevtoPost(environment.devtoToken, payload),
      currentId: devtoId,
      currentUrl: devtoUrl,
      hasChanged,
      isDryRun,
      isForceUpdate,
      post: buildDevtoPost(post),
      shouldPublish,
      update: (id, payload) => updateDevtoPost(environment.devtoToken, id, payload),
    });

    devtoId = devtoResult.id;
    devtoUrl = devtoResult.url;

    if (devtoResult.action === 'would-create') {
      summary.devto.wouldCreate += 1;
    } else if (devtoResult.action === 'would-update') {
      summary.devto.wouldUpdate += 1;
    } else if (devtoResult.action === 'created') {
      summary.devto.created += 1;
      releasedThisRun = true;
      console.log('[d]', `Created ${post.id}`);
    } else if (devtoResult.action === 'updated') {
      summary.devto.updated += 1;
      console.log('[d]', `Updated ${post.id}`);
    }

    const hashnodeResult = await syncProviderPost({
      create: (payload) => createHashnodePost(environment.hashnodeToken, environment.hashnodePublicationId, payload),
      currentId: hashnodePostId,
      currentUrl: hashnodeUrl,
      hasChanged,
      isDryRun,
      isForceUpdate,
      post: buildHashnodePost(post),
      shouldPublish,
      update: (id, payload) => updateHashnodePost(environment.hashnodeToken, id, payload),
    });

    hashnodePostId = hashnodeResult.id;
    hashnodeUrl = hashnodeResult.url;

    if (hashnodeResult.action === 'would-create') {
      summary.hashnode.wouldCreate += 1;
    } else if (hashnodeResult.action === 'would-update') {
      summary.hashnode.wouldUpdate += 1;
    } else if (hashnodeResult.action === 'created') {
      summary.hashnode.created += 1;
      releasedThisRun = true;
      console.log('[h]', `Created ${post.id}`);
    } else if (hashnodeResult.action === 'updated') {
      summary.hashnode.updated += 1;
      console.log('[h]', `Updated ${post.id}`);
    }

    if (!isDryRun && shouldPublish && !hasChanged && !isForceUpdate && devtoId && hashnodePostId && !releasedThisRun) {
      summary.skipped += 1;
      console.log('[i]', `Skipped ${post.id}`);
    }

    if (!isDryRun && !publishedAt && (releasedThisRun || (wasReleasedBeforeRun && scheduledFor))) {
      publishedAt = releasedThisRun ? updatedAt : scheduledFor;
    }

    nextMap[post.id] = {
      contentHash: post.contentHash,
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

  if (!isDryRun) {
    writeCrosspostMap(MAP_FILE, nextMap);
  }

  logSummary(summary, isDryRun);
}

await main();
