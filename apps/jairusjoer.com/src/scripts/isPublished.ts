const UNPUBLISHED_STATUSES = new Set(['Draft', 'Unpublished']);

export const isPublished = (status?: string) => {
  return !status || !UNPUBLISHED_STATUSES.has(status);
};
