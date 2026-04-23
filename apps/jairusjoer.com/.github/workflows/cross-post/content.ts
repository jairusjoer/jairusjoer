import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT, type CrosspostEnvironment } from './config.ts';

export interface ParsedCrosspostFrontmatter {
  date?: Date | string;
  description?: string;
  image?: string;
  series?: string;
  status?: 'Draft';
  title?: string;
}

export interface CrosspostFrontmatter extends ParsedCrosspostFrontmatter {
  title: string;
}

export interface LocalPost {
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

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function parseMarkdownFile(file: string): { content: string; data: ParsedCrosspostFrontmatter } {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);

  return {
    content: parsed.content,
    data: parsed.data as ParsedCrosspostFrontmatter,
  };
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

function resolveRepositoryAssetUrl(file: string, target: string, environment: CrosspostEnvironment): string {
  if (!environment.githubRepository || !environment.githubSha) {
    return target;
  }

  const resolvedFile = path.resolve(path.dirname(file), target);
  const relativeFile = path.relative(process.cwd(), resolvedFile);

  if (relativeFile.startsWith('..')) {
    return target;
  }

  return `https://raw.githubusercontent.com/${environment.githubRepository}/${environment.githubSha}/${toPosixPath(relativeFile)}`;
}

function absolutizeContentUrls(content: string, file: string, environment: CrosspostEnvironment): string {
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
      return `${environment.siteUrl}${normalizedValue}`;
    }

    if (normalizedValue.startsWith('./') || normalizedValue.startsWith('../')) {
      return resolveRepositoryAssetUrl(file, normalizedValue, environment);
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

function resolveMetadataImage(id: string, environment: CrosspostEnvironment): string | undefined {
  const generatedFile = path.join('public', 'og', `${id}.png`);

  if (!fs.existsSync(generatedFile)) {
    return undefined;
  }

  const relativeFile = toPosixPath(path.relative('public', generatedFile));

  if (environment.githubRepository && environment.githubSha) {
    return `https://raw.githubusercontent.com/${environment.githubRepository}/${environment.githubSha}/public/${relativeFile}`;
  }

  return `${environment.siteUrl}/${relativeFile}`;
}

function resolveCoverImage(
  file: string,
  data: CrosspostFrontmatter,
  environment: CrosspostEnvironment,
): string | undefined {
  const candidate = data.image;

  if (!candidate) {
    return undefined;
  }

  if (/^(?:[a-z]+:)?\/\//i.test(candidate)) {
    return candidate;
  }

  if (candidate.startsWith('/')) {
    return `${environment.siteUrl}${candidate}`;
  }

  if (candidate.startsWith('./') || candidate.startsWith('../')) {
    return resolveRepositoryAssetUrl(file, candidate, environment);
  }

  return undefined;
}

export function readLocalPosts(environment: CrosspostEnvironment): LocalPost[] {
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
    const canonicalUrl = `${environment.siteUrl}/${id}`;
    const contentMarkdown = `${absolutizeContentUrls(content, file, environment).trim()}\n`;
    const coverImage = resolveCoverImage(file, data, environment);
    const metadataImage = resolveMetadataImage(id, environment);

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
        dateMs: parseFrontmatterDate(data.date, file)?.getTime(),
        file,
        id,
        metadataImage,
      },
    ];
  });
}
