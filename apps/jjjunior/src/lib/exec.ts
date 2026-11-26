import { Effect, Schema, Stream } from 'effect';
import { ChildProcess, ChildProcessSpawner } from 'effect/process';

export class ExecError extends Schema.TaggedError<ExecError>()('ExecError', { message: Schema.String }) {}

const text = <E>(stream: Stream.Stream<Uint8Array, E>) => stream.pipe(Stream.decodeText(), Stream.mkString);

/** Run a command and return stdout; fails with stderr on a non-zero exit. Interrupting kills the process. */
export const run = (cmd: string, args: string[], opts: { cwd?: string; input?: string } = {}) =>
  Effect.gen(function* () {
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner;
    const handle = yield* spawner.spawn(
      ChildProcess.make(cmd, args, {
        cwd: opts.cwd,
        stdin: opts.input === undefined ? 'ignore' : Stream.make(new TextEncoder().encode(opts.input)),
      }),
    );
    return yield* Effect.all([text(handle.stdout), text(handle.stderr), handle.exitCode], { concurrency: 'unbounded' });
  }).pipe(
    Effect.scoped,
    Effect.mapError((e) => new ExecError({ message: `${cmd} ${args[0]}: ${e.message}` })),
    Effect.flatMap(([out, err, code]) =>
      code === 0
        ? Effect.succeed(out)
        : Effect.fail(
            new ExecError({ message: `${cmd} ${args[0]} exited ${code}: ${err.trim() || out.trim()}`.slice(0, 2000) }),
          ),
    ),
  );
