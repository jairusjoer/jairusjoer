import { config } from './config.ts';
import { banner, logError } from './log.ts';
import { poll } from './loop.ts';

banner();

let first = true;
const tick = async () => {
  await poll(first).catch((e) => logError('POLL', e));
  first = false;
  setTimeout(tick, config.pollIntervalMs);
};
tick();
