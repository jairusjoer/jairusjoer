import { Effect } from 'effect';
import { runAgent } from '../agent/run.ts';
import { Review } from '../agent/schemas.ts';
import { AppConfig } from '../config/config.ts';
import { comment } from '../gitlab/issues.ts';
import { log } from '../lib/log.ts';
import type { Outcome } from '../lib/stats.ts';
import { implementPrompt, Prompts, reviewPrompt } from './prompts.ts';
import { moveTo, type Run } from './state.ts';

/** One adversarial review. Returns the final outcome, or undefined when the implementer should go again. */
export const reviewRound = (run: Run, round: number) =>
  Effect.gen(function* () {
    const { issue, project, context } = run;
    const { status, maxRounds } = yield* AppConfig;
    const prompts = yield* Prompts;
    yield* log('REVIEW', `round ${round}`, issue);
    const rev = yield* runAgent({
      cwd: run.dir,
      prompt: reviewPrompt(context, project, run.summary),
      schema: Review,
      systemPrompt: prompts.reviewer,
      readOnly: true,
    });

    run.calls.push({ role: 'reviewer', ...rev.usage });

    if (rev.output.approved) {
      yield* log('DONE', 'approved', issue);
      yield* comment(
        issue,
        `✅ Loop completed\n\nMerge request: ${run.mrUrl}\n\n**Summary**\n\n${run.summary}\n\n**Reviewer verification**\n\n${rev.output.verification}\n\n_Ready for human review._`,
      );
      return 'approved' as Outcome | undefined;
    }

    yield* comment(
      issue,
      `🔁 **Review round ${round}/${maxRounds}: changes requested**\n\n${rev.output.findings}\n\n**Reviewer verification**\n\n${rev.output.verification}`,
    );
    if (round === maxRounds) {
      yield* comment(
        issue,
        `⚠️ Stopped after ${maxRounds} rounds without approval — needs a human decision.\n\nMerge request: ${run.mrUrl}`,
      );
      return 'rounds-exhausted' as Outcome | undefined;
    }

    yield* moveTo(issue, status.doing);
    // Fresh session: the branch and the findings carry everything needed, and a resumed transcript is costly to re-read.
    run.session = undefined;
    run.prompt = `${implementPrompt(context, project)}\n\nAn adversarial reviewer rejected the current state of this branch. Findings:\n\n${rev.output.findings}\n\nAddress every finding (or explain in your summary why one is invalid), commit, and report again.`;
    return undefined as Outcome | undefined;
  });
