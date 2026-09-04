import { page } from '@config';

const formatter = new Intl.DateTimeFormat(page.locale, page?.datetime);

export function formatDateTime(date: Date) {
  return formatter.format(date);
}
