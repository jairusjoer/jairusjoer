import { setTimeout as sleep } from 'node:timers/promises';
import { styleText } from 'node:util';
import { config } from '../config/config.ts';
import { failedJobLogs, isPending, pipelinesFor } from '../gitlab/pipelines.ts';
import { type Issue, type Project } from '../gitlab/types.ts';
import { log } from '../lib/log.ts';

/** Wait until every pipeline for the commit has finished. No pipeline within 3 minutes means "no CI". */
export const waitForPipelines = async (issue: Issue, project: Project, sha: string, signal: AbortSignal) => {
  const started = Date.now();
  log('CI', `awaiting ${styleText('yellow', sha.slice(0, 8))}`, issue);
  for (;;) {
    const pipelines = await pipelinesFor(project.id, sha);
    const elapsed = Date.now() - started;
    if (!pipelines.length && elapsed > 3 * 60_000) return { status: 'none' as const, logs: '', urls: '' };
    if (pipelines.length && !pipelines.some(isPending)) {
      const urls = pipelines.map((p) => `- ${p.status}: ${p.web_url}`).join('\n');
      if (!pipelines.some((p) => p.status === 'failed')) return { status: 'success' as const, logs: '', urls };
      return { status: 'failed' as const, logs: await failedJobLogs(project.id, pipelines), urls };
    }
    if (elapsed > config.pipelineTimeoutMs) {
      throw new Error(`CI did not finish within ${config.pipelineTimeoutMs / 60_000} min for ${sha}`);
    }
    await sleep(20_000, undefined, { signal });
  }
};
