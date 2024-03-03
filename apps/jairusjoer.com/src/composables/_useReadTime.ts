export const useReadTime = (text: string, wpm: number = 225) => {
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const readTime = Math.round(wordCount / wpm);

  if (readTime <= 1) return '1 minute read';

  return `${readTime} minutes read`;
};
