import { Effect } from 'effect';
import { runAgent } from '../agent/run.ts';
import { Implementation } from '../agent/schemas.ts';
import { AppConfig } from '../config/config.ts';
import { branchName, hasCommits, headSha, push } from '../git/workspace.ts';
import { comment } from '../gitlab/issues.ts';
import { ensureMergeRequest } from '../gitlab/merge-requests.ts';
import type { Issue } from '../gitlab/types.ts';
import { log } from '../lib/log.ts';
import { waitForPipelines } from './ci.ts';
import { Prompts } from './prompts.ts';
import { moveTo, type ImplementResult, type Run } from './state.ts';

/** Hand the issue to a human: comment and move it to "In Review". */
const stop = (issue: Issue, message: string) =>
  Effect.gen(function* () {
    const { status } = yield* AppConfig;
    yield* comment(issue, message);
    yield* moveTo(issue, status.review);
  });

/** implement → push → CI; failed CI goes straight back to the implementer. Anything but 'ok' means the run stopped. */
export const implement = (run: Run, round: number) =>
  Effect.gen(function* () {
    const { issue, project, dir } = run;
    const { status, maxRounds } = yield* AppConfig;
    const prompts = yield* Prompts;
    for (let attempt = 1; ; attempt++) {
      const ciFix = attempt > 1 ? ` · CI fix ${attempt - 1}` : '';
      yield* log('IMPLEMENT', `attempt ${round}${ciFix}`, issue);
      const impl = yield* runAgent({
        cwd: dir,
        prompt: run.prompt,
        schema: Implementation,
        systemPrompt: prompts.implementer,
        resume: run.session,
      });
      run.calls.push({ role: 'implementer', ...impl.usage });
      run.session = impl.sessionId;
      run.summary = impl.output.summary;

      if (impl.output.status === 'blocked') {
        yield* stop(
          issue,
          `❓ **Claude Code needs input** before continuing:\n\n${impl.output.question ?? run.summary}\n\n_Answer in a comment and move the issue back to **${status.todo}** to resume._`,
        );
        return 'blocked' as ImplementResult;
      }
      if (!(yield* hasCommits(dir, project))) {
        yield* stop(issue, `⚠️ The agent reported done but produced no commits.\n\n${run.summary}`);
        return 'no-commits' as ImplementResult;
      }
      yield* push(dir, issue);
      run.mrUrl = yield* ensureMergeRequest(issue, project, branchName(issue));

      const ci = yield* waitForPipelines(issue, project, yield* headSha(dir));
      if (ci.status !== 'failed') {
        yield* moveTo(issue, status.review);
        return 'ok' as ImplementResult;
      }
      if (attempt >= maxRounds) {
        yield* stop(
          issue,
          `⚠️ CI still failing after ${attempt} attempts — needs a human.\n\n${ci.urls}\n\nMerge request: ${run.mrUrl}`,
        );
        return 'ci-failed' as ImplementResult;
      }
      yield* comment(
        issue,
        `🔧 **CI failed** (attempt ${attempt}/${maxRounds}) — feeding the job logs back to the implementer.\n\n${ci.urls}`,
      );
      run.prompt = `The CI pipeline failed for your last commit. Failed job logs (tail):\n\n${ci.logs}\n\nFind the root cause and fix it. Reproduce locally where possible. Do not skip, disable or weaken tests or CI jobs to make them pass. If the failure is unrelated to your change (flaky test, infrastructure, missing secret), report status "blocked" and explain. Commit and report again.`;
    }
  });
