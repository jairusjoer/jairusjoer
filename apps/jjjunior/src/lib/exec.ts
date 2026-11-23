import { spawn } from 'node:child_process';

/** Run a command, resolve stdout, reject with stderr on non-zero exit or abort. */
export const run = (
  cmd: string,
  args: string[],
  opts: { cwd?: string; input?: string; signal?: AbortSignal } = {},
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, signal: opts.signal, stdio: 'pipe' });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', reject);
    child.stdin.on('error', () => {}); // child gone before reading input; close/error report it
    child.on('close', (code) =>
      code === 0
        ? resolve(out)
        : reject(new Error(`${cmd} ${args[0]} exited ${code}: ${err.trim() || out.trim()}`.slice(0, 2000))),
    );
    child.stdin.end(opts.input ?? '');
  });
