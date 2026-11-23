import { config } from './config/config.ts';
import { banner, logError } from './lib/log.ts';
import { poll } from './loop/poll.ts';

banner();

let first = true;
const tick = async () => {
  await poll(first).catch((e) => logError('POLL', e));
  first = false;
  setTimeout(tick, config.pollIntervalMs);
};
tick();
