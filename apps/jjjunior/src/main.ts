import { config } from './config.ts';
import { poll } from './loop.ts';

console.log(
  `Polling ${config.group} every ${config.pollIntervalMs / 1000}s for @${config.assignee}` +
    (config.triggerLabel ? ` issues labelled "${config.triggerLabel}"` : ''),
);

let first = true;
const tick = async () => {
  await poll(first).catch((e) => console.error(`[${new Date().toISOString()}] poll failed:`, e));
  first = false;
  setTimeout(tick, config.pollIntervalMs);
};
tick();
