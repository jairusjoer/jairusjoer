import type { GetImageResult } from 'astro';

export interface Metadata {
  description?: string;
  image?: GetImageResult;
  schema?: Record<string, unknown>;
  title?: string;
}
