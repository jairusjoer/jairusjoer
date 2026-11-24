import { styleText } from 'node:util';
import pkg from '../../package.json' with { type: 'json' };
import { config } from '../config/config.ts';

type Colour = Extract<Parameters<typeof styleText>[0], string>;

type State = 'START' | 'IMPLEMENT' | 'CI' | 'REVIEW' | 'DONE' | 'CLEANUP' | 'ABORT' | 'FAIL' | 'POLL' | 'STATS';
const errors: State[] = ['FAIL', 'POLL'];

/** Steps run as a rainbow, magenta → green (named fallback first); outcomes use the terminal's own colours. */
const tones: Record<State, readonly [Colour, string?]> = {
  START: ['magenta', '#e963e9'],
  IMPLEMENT: ['blue', '#8463e9'],
  CI: ['cyan', '#63a6e9'],
  REVIEW: ['cyan', '#63e9c7'],
  DONE: ['green', '#63e963'],
  STATS: ['gray'],
  CLEANUP: ['gray'],
  ABORT: ['yellow'],
  FAIL: ['red'],
  POLL: ['red'],
};

/** styleText decides whether colour is on (TTY, NO_COLOR, FORCE_COLOR); truecolour also needs a 24-bit terminal. */
const truecolour = styleText('bold', 'x') !== 'x' && (process.stdout.getColorDepth?.() ?? 0) >= 24;
const paint = (state: State, text: string) => {
  const [named, hex] = tones[state];
  if (!hex || !truecolour) return styleText(['bold', named], text);
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `\x1b[1;38;2;${rgb.join(';')}m${text}\x1b[22;39m`;
};

const width = Math.max(...Object.keys(tones).map((s) => s.length)) + 2;
/** UTC, to the second: sortable across days and comparable with GitLab's timestamps. */
const time = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
/** The group is in the banner; `my-group/web/app#42` → `web/app#42`. */
const short = (project: string) =>
  project.startsWith(config.group + '/') ? project.slice(config.group.length + 1) : project;

/** `2026-11-23T10:32:15Z [review]    web/app#42 round 1`, Vite style. Failures go to stderr. */
export const log = (state: State, message: string, issue?: { project: string; iid: number }) => {
  const tag = paint(state, `[${state.toLowerCase()}]`.padEnd(width));
  const subject = issue ? styleText('bold', `${short(issue.project)}#${issue.iid}`) + ' ' : '';
  const write = errors.includes(state) ? console.error : console.log;
  write(`${styleText('dim', time())} ${tag} ${subject}${message}`);
};

export const logError = (state: State, error: unknown, issue?: { project: string; iid: number }) => {
  log(state, error instanceof Error ? error.message : String(error), issue);
  if (error instanceof Error && error.stack) {
    console.error(styleText('dim', error.stack.split('\n').slice(1).join('\n')));
  }
};

export const banner = () => {
  const bold = (s: string) => styleText('bold', s);
  const arrow = styleText('green', '➜');
  const row = (label: string, value: string) => `  ${arrow}  ${styleText('dim', (label + ':').padEnd(10))} ${value}`;
  const name = styleText(['bold', 'green'], 'JJJUNIOR');
  const version = styleText('green', 'v' + pkg.version);
  const link = (s: string) => styleText(['bold', 'cyan'], s);
  console.log(
    [
      '',
      `  ${name} ${version}`,
      '',
      row('Group', link(config.group)),
      row('Assignee', link(`@${config.assignee}`)),
      row('Label', config.triggerLabel ? bold(config.triggerLabel) : styleText('dim', 'none (every assigned issue)')),
      row(
        'Polling',
        [
          `every ${config.pollIntervalMs / 1000}s`,
          `${config.maxParallel} parallel`,
          `${config.maxRounds} rounds`,
          config.model,
        ]
          .map(bold)
          .join(styleText('dim', ' · ')),
      ),
      '',
    ].join('\n'),
  );
};
