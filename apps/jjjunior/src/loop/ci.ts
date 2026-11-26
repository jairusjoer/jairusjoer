import { styleText } from 'node:util';
import { Effect } from 'effect';
import { AppConfig } from '../config/config.ts';
import { failedJobLogs, isPending, pipelinesFor } from '../gitlab/pipelines.ts';
import type { Issue, Project } from '../gitlab/types.ts';
import { ExecError } from '../lib/exec.ts';
import { log } from '../lib/log.ts';

/** Wait until every pipeline for the commit has finished. No pipeline within 3 minutes means "no CI". */
export const waitForPipelines = (issue: Issue, project: Project, sha: string) =>
  Effect.gen(function* () {
    const { pipelineTimeoutMs } = yield* AppConfig;
    const started = Date.now();
    yield* log('CI', `awaiting ${styleText('yellow', sha.slice(0, 8))}`, issue);
    for (;;) {
      const pipelines = yield* pipelinesFor(project.id, sha);
      const elapsed = Date.now() - started;
      if (!pipelines.length && elapsed > 3 * 60_000) return { status: 'none' as const, logs: '', urls: '' };
      if (pipelines.length && !pipelines.some(isPending)) {
        const urls = pipelines.map((p) => `- ${p.status}: ${p.web_url}`).join('\n');
        if (!pipelines.some((p) => p.status === 'failed')) return { status: 'success' as const, logs: '', urls };
        return { status: 'failed' as const, logs: yield* failedJobLogs(project.id, pipelines), urls };
      }
      if (elapsed > pipelineTimeoutMs) {
        return yield* new ExecError({
          message: `CI did not finish within ${pipelineTimeoutMs / 60_000} min for ${sha}`,
        });
      }
      yield* Effect.sleep('20 seconds');
    }
  });
