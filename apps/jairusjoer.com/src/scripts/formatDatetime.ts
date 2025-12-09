const formatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const formatDatetime = (date?: Date | string | string[]) => {
  if (!date) return formatter.format(new Date());

  const dateArray = Array.isArray(date) ? date : [date];
  const formatted: string[] = [];

  for (const date of dateArray) {
    try {
      formatted.push(formatter.format(new Date(date)));
    } catch {
      formatted.push(date as string);
    }
  }

  return formatted.join(' — ');
};
