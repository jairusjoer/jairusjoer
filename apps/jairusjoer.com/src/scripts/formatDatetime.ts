import { site } from '../config';

const formatter = new Intl.DateTimeFormat(site.locale, site?.datetime);

export const formatDatetime = (date: Date) => formatter.format(new Date(date));
