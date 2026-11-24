import { runAgent } from '../agent/run.ts';
import { reviewSchema, type Review } from '../agent/schemas.ts';
import { config } from '../config/config.ts';
import { comment } from '../gitlab/issues.ts';
import { log } from '../lib/log.ts';
import type { Outcome } from '../lib/stats.ts';
import { implementPrompt, REVIEWER, reviewPrompt } from './prompts.ts';
import { moveTo } from './state.ts';
import type { Run } from './types.ts';

const { doing } = config.status;

/** One adversarial review. Returns the final outcome, or undefined when the implementer should go again. */
export const reviewRound = async (run: Run, round: number): Promise<Outcome | undefined> => {
  const { issue, project, context } = run;
  log('REVIEW', `round ${round}`, issue);
  const rev = await runAgent<Review>({
    cwd: run.dir,
    prompt: reviewPrompt(context, project, run.summary),
    schema: reviewSchema,
    systemPrompt: REVIEWER,
    readOnly: true,
    signal: run.signal,
  });

  run.calls.push({ role: 'reviewer', ...rev.usage });

  if (rev.output.approved) {
    log('DONE', 'approved', issue);
    await comment(
      issue,
      `✅ Loop completed\n\nMerge request: ${run.mrUrl}\n\n**Summary**\n\n${run.summary}\n\n**Reviewer verification**\n\n${rev.output.verification}\n\n_Ready for human review._`,
    );
    return 'approved';
  }

  await comment(
    issue,
    `🔁 **Review round ${round}/${config.maxRounds}: changes requested**\n\n${rev.output.findings}\n\n**Reviewer verification**\n\n${rev.output.verification}`,
  );
  if (round === config.maxRounds) {
    await comment(
      issue,
      `⚠️ Stopped after ${config.maxRounds} rounds without approval — needs a human decision.\n\nMerge request: ${run.mrUrl}`,
    );
    return 'rounds-exhausted';
  }

  await moveTo(issue, doing);
  run.prompt = run.session
    ? `An adversarial reviewer rejected your implementation. Findings:\n\n${rev.output.findings}\n\nAddress every finding (or explain in your summary why one is invalid), commit, and report again.`
    : `${implementPrompt(context, project)}\n\nAn adversarial reviewer rejected the current state of this branch. Findings:\n\n${rev.output.findings}\n\nAddress every finding (or explain in your summary why one is invalid).`;
};
