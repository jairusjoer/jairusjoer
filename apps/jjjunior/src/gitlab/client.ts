import { run } from '../lib/exec.ts';

const glab = async <T>(args: string[], body?: object): Promise<T> => {
  if (body) args.push('--input', '-');
  const out = await run('glab', ['api', ...args], { input: body ? JSON.stringify(body) : undefined });
  return (out.trim() ? JSON.parse(out) : undefined) as T;
};

export const rest = <T>(method: string, path: string, body?: object) =>
  glab<T>(['-X', method, path, ...(method === 'GET' ? ['--paginate'] : [])], body);

export const graphql = async <T>(query: string, variables: object = {}): Promise<T> => {
  const res = await glab<{ data: T; errors?: { message: string }[] }>(['graphql', '-X', 'POST'], { query, variables });
  if (res.errors?.length) throw new Error(`GraphQL: ${res.errors.map((e) => e.message).join('; ')}`);
  return res.data;
};

export const enc = encodeURIComponent;
