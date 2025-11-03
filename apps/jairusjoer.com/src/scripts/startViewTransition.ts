export const startViewTransition = async (callback: () => Promise<void> | void) => {
  if ('startViewTransition' in document) {
    return document.startViewTransition(callback);
  } else {
    return callback();
  }
};
