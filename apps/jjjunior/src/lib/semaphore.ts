/** Limit concurrent async work to `max` slots. */
export const semaphore = (max: number) => {
  let slots = max;
  const waiting: (() => void)[] = [];
  return {
    acquire: () => (slots > 0 ? (slots--, Promise.resolve()) : new Promise<void>((r) => waiting.push(r))),
    release: () => (waiting.length ? waiting.shift()!() : slots++),
  };
};
