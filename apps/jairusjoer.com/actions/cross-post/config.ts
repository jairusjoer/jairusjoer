import path from 'node:path';

export const CONTENT_ROOT = path.join('src', 'content');
export const MAP_FILE = path.join('src', 'content.map.json');
export const RELEASE_HOUR = 9;
export const RELEASE_INTERVAL_DAYS = 7;
export const RELEASE_TIMEZONE = 'America/New_York';
export const REQUEST_DELAY_MS = 1000;
export const CROSSPOST_USER_AGENT = 'jairusjoer.com cross-post workflow';

export interface CrosspostEnvironment {
  devtoToken: string;
  githubRepository?: string;
  githubSha?: string;
  hashnodePublicationId: string;
  hashnodeToken: string;
  siteUrl: string;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value || undefined;
}

export function readCrosspostEnvironment(): CrosspostEnvironment {
  return {
    devtoToken: requireEnv('DEVTO_TOKEN'),
    githubRepository: readOptionalEnv('GITHUB_REPOSITORY'),
    githubSha: readOptionalEnv('GITHUB_SHA'),
    hashnodePublicationId: requireEnv('HASHNODE_PUBLICATION_ID'),
    hashnodeToken: requireEnv('HASHNODE_TOKEN'),
    siteUrl: 'https://jairusjoer.com',
  };
}
