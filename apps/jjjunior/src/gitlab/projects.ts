import { enc, rest } from './client.ts';
import type { Project } from './types.ts';

export const getProject = (fullPath: string) => rest<Project>('GET', `projects/${enc(fullPath)}`);
