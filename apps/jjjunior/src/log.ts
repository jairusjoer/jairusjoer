import { styleText } from 'node:util';
import pkg from '../package.json' with { type: 'json' };
import { config } from './config.ts';

/** Steps run as a rainbow, magenta → green; outcomes use the terminal's own colours. */
const tones = {
  START: '#e963e9',
  IMPLEMENT: '#8463e9',
  CI: '#63a6e9',
  REVIEW: '#63e9c7',
  DONE: '#63e963',
  CLEANUP: 'gray',
  ABORT: 'yellow',
  FAIL: 'red',
  POLL: 'red',
} as const;
type State = keyof typeof tones;

/** styleText decides whether colour is on (TTY, NO_COLOR, FORCE_COLOR); reuse that for truecolour. */
const colour = styleText('bold', 'x') !== 'x';
const paint = (tone: (typeof tones)[State], text: string) => {
  if (!tone.startsWith('#')) return styleText(['bold', tone as 'red'], text);
  if (!colour) return text;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(tone.slice(i, i + 2), 16));
  return '\x1b[1;38;2;' + [r, g, b].join(';') + 'm' + text + '\x1b[22;39m';
};

const width = Math.max(...Object.keys(tones).map((s) => s.length)) + 2;
const time = () => new Date().toLocaleTimeString('en-GB');
/** The group is in the banner; `my-group/web/app#42` → `web/app#42`. */
const short = (key: string) => (key.startsWith(config.group + '/') ? key.slice(config.group.length + 1) : key);

/** `10:32:15 [REVIEW]    web/app#42 round 1`, Vite style. */
export const log = (state: State, message: string, key?: string) => {
  const tag = paint(tones[state], `[${state}]`.padEnd(width));
  const subject = key ? styleText('bold', short(key)) + ' ' : '';
  console.log(`${styleText('dim', time())} ${tag} ${subject}${message}`);
};

export const logError = (state: State, error: unknown, key?: string) => {
  log(state, error instanceof Error ? error.message : String(error), key);
  if (error instanceof Error && error.stack) {
    console.log(styleText('dim', error.stack.split('\n').slice(1).join('\n')));
  }
};

export const banner = () => {
  const bold = (s: string) => styleText('bold', s);
  const arrow = styleText('green', '➜');
  const row = (label: string, value: string) => `  ${arrow}  ${styleText('dim', (label + ':').padEnd(10))} ${value}`;
  const name = styleText(['bold', 'green'], 'JJJUNIOR');
  const version = styleText('green', 'v' + pkg.version);
  const ready = bold(Math.round(performance.now()) + ' ms');
  const link = (s: string) => styleText(['bold', 'cyan'], s);
  console.log(
    [
      '',
      `  ${name} ${version}  ${styleText('dim', 'ready in')} ${ready}`,
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
