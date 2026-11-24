import { runAgent } from '../agent/run.ts';
import { implementationSchema, type Implementation } from '../agent/schemas.ts';
import { config } from '../config/config.ts';
import { branchName, hasCommits, headSha, push } from '../git/workspace.ts';
import { comment } from '../gitlab/issues.ts';
import { ensureMergeRequest } from '../gitlab/merge-requests.ts';
import { type Issue } from '../gitlab/types.ts';
import { log } from '../lib/log.ts';
import { waitForPipelines } from './ci.ts';
import { IMPLEMENTER } from './prompts.ts';
import { moveTo } from './state.ts';
import type { ImplementResult, Run } from './types.ts';

const { todo, review } = config.status;

/** Hand the issue to a human: comment and move it to "In Review". */
const stop = async (issue: Issue, message: string) => {
  await comment(issue, message);
  await moveTo(issue, review);
};

/** implement → push → CI; failed CI goes straight back to the implementer. Anything but 'ok' means the run stopped. */
export const implement = async (run: Run, round: number): Promise<ImplementResult> => {
  const { issue, project, dir } = run;
  for (let attempt = 1; ; attempt++) {
    const ciFix = attempt > 1 ? ` · CI fix ${attempt - 1}` : '';
    log('IMPLEMENT', `round ${round}${ciFix}`, issue);
    const impl = await runAgent<Implementation>({
      cwd: dir,
      prompt: run.prompt,
      schema: implementationSchema,
      systemPrompt: IMPLEMENTER,
      resume: run.session,
      signal: run.signal,
    });
    run.calls.push({ role: 'implementer', ...impl.usage });
    run.session = impl.sessionId;
    run.summary = impl.output.summary;

    if (impl.output.status === 'blocked') {
      await stop(
        issue,
        `❓ **Claude Code needs input** before continuing:\n\n${impl.output.question ?? run.summary}\n\n_Answer in a comment and move the issue back to **${todo}** to resume._`,
      );
      return 'blocked';
    }
    if (!(await hasCommits(dir, project))) {
      await stop(issue, `⚠️ The agent reported done but produced no commits.\n\n${run.summary}`);
      return 'no-commits';
    }
    await push(dir, issue);
    run.mrUrl = await ensureMergeRequest(issue, project, branchName(issue));

    const ci = await waitForPipelines(issue, project, await headSha(dir), run.signal);
    if (ci.status !== 'failed') {
      await moveTo(issue, review);
      return 'ok';
    }
    if (attempt >= config.maxRounds) {
      await stop(
        issue,
        `⚠️ CI still failing after ${attempt} attempts — needs a human.\n\n${ci.urls}\n\nMerge request: ${run.mrUrl}`,
      );
      return 'ci-failed';
    }
    await comment(
      issue,
      `🔧 **CI failed** (attempt ${attempt}/${config.maxRounds}) — feeding the job logs back to the implementer.\n\n${ci.urls}`,
    );
    run.prompt = `The CI pipeline failed for your last commit. Failed job logs (tail):\n\n${ci.logs}\n\nFind the root cause and fix it. Reproduce locally where possible. Do not skip, disable or weaken tests or CI jobs to make them pass. If the failure is unrelated to your change (flaky test, infrastructure, missing secret), report status "blocked" and explain. Commit and report again.`;
  }
};
