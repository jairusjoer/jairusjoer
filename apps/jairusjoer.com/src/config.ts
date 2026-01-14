import type { SiteConfig } from './types';

export const site: SiteConfig = {
  site: 'https://jairusjoer.com',
  title: 'Jairus Joer',
  description: 'Senior Developer & Designer',
  locale: 'en-US',
  datetime: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  navigation: [
    { title: 'About', href: '/' },
    { title: 'Writing', href: '/writing' },
    { title: 'Archive', href: '/archive' },
    { title: 'Links', href: '/links' },
  ],
  footer: [
    { title: 'Imprint', href: '/imprint' },
    { title: 'Privacy', href: 'https://www.iubenda.com/privacy-policy/41205652' },
    { title: 'Cookies', href: 'https://www.iubenda.com/privacy-policy/41205652/cookie-policy' },
    { title: 'Source', href: 'https://github.com/jairusjoer/jairusjoer.com' },
  ],
};
