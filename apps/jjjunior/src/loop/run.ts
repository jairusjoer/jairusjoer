import { Cause, Effect, Exit } from 'effect';
import { AppConfig } from '../config/config.ts';
import { branchName, hasCommits, prepareWorktree } from '../git/workspace.ts';
import { comment, getNotes } from '../gitlab/issues.ts';
import { ensureMergeRequest, getMergeRequestNotes } from '../gitlab/merge-requests.ts';
import { getProject } from '../gitlab/projects.ts';
import type { Issue } from '../gitlab/types.ts';
import { log, logError } from '../lib/log.ts';
import { cost, record, tokens, type Call, type Outcome } from '../lib/stats.ts';
import { implement } from './implement.ts';
import { implementPrompt, issueContext } from './prompts.ts';
import { reviewRound } from './review.ts';
import { keyOf, moveTo, State, type Mode, type Run } from './state.ts';

/** One run for an issue. Interrupting the fiber aborts the agent and the run is recorded as 'aborted'. */
export const work = (issue: Issue, mode: Mode) =>
  Effect.gen(function* () {
    const config = yield* AppConfig;
    const started = Date.now();
    const calls: Call[] = [];

    const finish = (exit: Exit.Exit<Outcome, unknown>) =>
      Effect.gen(function* () {
        let outcome: Outcome;
        if (Exit.isSuccess(exit)) outcome = exit.value;
        else if (Cause.hasInterrupts(exit.cause)) {
          outcome = 'aborted'; // the poller already logged the reason
          yield* comment(issue, '⏹️ Claude Code run aborted because the issue left the workflow.').pipe(Effect.ignore);
        } else {
          outcome = 'failed';
          yield* handleFailure(issue, Cause.squash(exit.cause));
        }
        const durationMs = Date.now() - started;
        yield* record({
          at: new Date().toISOString(),
          project: issue.project,
          iid: issue.iid,
          mode,
          model: config.model,
          outcome,
          durationMs,
          calls,
        }).pipe(Effect.catch((e) => logError('FAIL', e, issue)));
        yield* log(
          'STATS',
          `${outcome} · ${Math.round(tokens(calls) / 1000)}k tokens · $${cost(calls).toFixed(2)} · ${(durationMs / 60_000).toFixed(1)} min`,
          issue,
        );
      });

    yield* runLoop(issue, mode, calls).pipe(Effect.onExit(finish), Effect.ignore);
  });

const runLoop = (issue: Issue, mode: Mode, calls: Call[]) =>
  Effect.gen(function* () {
    const { status, maxRounds } = yield* AppConfig;
    yield* log('START', mode, issue);
    if (mode === 'implement') {
      yield* moveTo(issue, status.doing);
      yield* comment(issue, '🤖 Picked up by Claude Code — implementing.');
    } else {
      yield* comment(issue, '🤖 Moved to review — starting adversarial review by Claude Code.');
    }

    const project = yield* getProject(issue.project);
    const dir = yield* prepareWorktree(project, issue);
    const notes = [...(yield* getNotes(issue)), ...(yield* getMergeRequestNotes(project, branchName(issue)))];
    const context = issueContext(issue, notes);

    if (mode === 'review' && !(yield* hasCommits(dir, project))) {
      yield* comment(
        issue,
        `⚠️ Nothing to review: branch \`${branchName(issue)}\` has no commits ahead of \`${project.default_branch}\`.`,
      );
      return 'no-commits' as Outcome;
    }

    const run: Run = {
      issue,
      project,
      dir,
      context,
      prompt: implementPrompt(context, project),
      summary: '(review triggered by a manual move; no implementer summary)',
      mrUrl: '',
      calls,
    };

    for (let round = 1; round <= maxRounds; round++) {
      if (mode === 'review' && round === 1) {
        run.mrUrl = yield* ensureMergeRequest(issue, project, branchName(issue));
      } else {
        const result = yield* implement(run, round);
        if (result !== 'ok') return result;
      }
      const outcome = yield* reviewRound(run, round);
      if (outcome) return outcome;
    }
    return 'rounds-exhausted' as Outcome;
  });

const handleFailure = (issue: Issue, error: unknown) =>
  Effect.gen(function* () {
    const { status } = yield* AppConfig;
    const state = yield* State;
    const message = error instanceof Error ? error.message : String(error);
    yield* logError('FAIL', error, issue);
    yield* comment(
      issue,
      `❌ **Claude Code run failed**\n\n\`\`\`\n${message}\n\`\`\`\n\n_Move the issue back to **${status.todo}** to retry._`,
    ).pipe(Effect.ignore);
    yield* moveTo(issue, status.review).pipe(Effect.catch(() => Effect.sync(() => state.failed.add(keyOf(issue)))));
  });
