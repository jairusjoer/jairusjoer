import { Effect, Schema } from 'effect';
import { run } from '../lib/exec.ts';

export class GitlabError extends Schema.TaggedError<GitlabError>()('GitlabError', { message: Schema.String }) {}

const glab = <T>(args: string[], body?: object) =>
  run('glab', ['api', ...args, ...(body ? ['--input', '-'] : [])], {
    input: body ? JSON.stringify(body) : undefined,
  }).pipe(
    Effect.flatMap((out) =>
      Effect.try({
        try: () => (out.trim() ? JSON.parse(out) : undefined) as T,
        catch: (e) => new GitlabError({ message: `Invalid JSON from glab: ${String(e)}` }),
      }),
    ),
  );

export const rest = <T>(method: string, path: string, body?: object) =>
  glab<T>(['-X', method, path, ...(method === 'GET' ? ['--paginate'] : [])], body);

export const graphql = <T>(query: string, variables: object = {}) =>
  glab<{ data: T; errors?: { message: string }[] }>(['graphql', '-X', 'POST'], { query, variables }).pipe(
    Effect.flatMap((res) =>
      res.errors?.length
        ? Effect.fail(new GitlabError({ message: `GraphQL: ${res.errors.map((e) => e.message).join('; ')}` }))
        : Effect.succeed(res.data),
    ),
  );

export const enc = encodeURIComponent;
