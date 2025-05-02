export const useViewTransition = (method: Function) => {
  if (!document.startViewTransition) {
    return method();
  }

  return document.startViewTransition(() => method());
};
