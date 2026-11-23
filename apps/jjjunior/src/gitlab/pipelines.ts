import { stripVTControlCharacters } from 'node:util';
import { run } from '../lib/exec.ts';
import { rest } from './client.ts';
import type { Pipeline } from './types.ts';

const PENDING = ['created', 'waiting_for_resource', 'preparing', 'pending', 'running', 'scheduled'];

/** All pipelines for a commit (push and merge request pipelines). */
export const pipelinesFor = (projectId: number, sha: string) =>
  rest<Pipeline[]>('GET', `projects/${projectId}/pipelines?sha=${sha}`);

export const isPending = (p: Pipeline) => PENDING.includes(p.status);

/** Tail of each failed job's log, ANSI codes and section markers stripped. */
export const failedJobLogs = async (projectId: number, pipelines: Pipeline[], linesPerJob = 150) => {
  const logs: string[] = [];
  for (const p of pipelines.filter((p) => p.status === 'failed')) {
    const jobs = await rest<{ id: number; name: string; stage: string; web_url: string }[]>(
      'GET',
      `projects/${projectId}/pipelines/${p.id}/jobs?scope[]=failed`,
    );
    for (const job of jobs) {
      const trace = await run('glab', ['api', `projects/${projectId}/jobs/${job.id}/trace`]);
      const clean = stripVTControlCharacters(trace)
        .replace(/section_(start|end):\d+:[^\r\n]*\r?/g, '')
        .split('\n')
        .map((line) => line.replace(/^\S+Z [0-9a-f]{2}[OE]\+? ?/, ''))
        .slice(-linesPerJob)
        .join('\n');
      logs.push(`### Job "${job.name}" (stage ${job.stage}) ${job.web_url}\n\n\`\`\`\n${clean}\n\`\`\``);
    }
  }
  return logs.join('\n\n');
};
