export const env = (key: string, fallback: string): string => process.env[key] || fallback;

export const int = (key: string, fallback: string): number => {
  const n = Number(env(key, fallback));
  if (!Number.isInteger(n) || n < 1 || n > 10_000) throw new Error(`${key} must be an integer between 1 and 10000`);
  return n;
};

export const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var ${key} (see .env.example)`);
  return value;
};
