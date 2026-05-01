export interface SiteConfigLink {
  title: string;
  href: string;
}

export interface SiteConfig {
  datetime: Intl.DateTimeFormatOptions;
  description: string;
  footer?: Array<SiteConfigLink>;
  image?: () => Promise<ImageMetadata>;
  locale: string;
  navigation?: Array<SiteConfigLink>;
  title: string;
  url: string;
}

export const site: SiteConfig = {
  url: 'https://jairusjoer.com',
  image: async () => (await import('./assets/image.png')).default,
  title: 'Jairus Joer',
  description: 'Senior Software Engineer & Designer',
  locale: 'en-US',
  datetime: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  navigation: [
    { title: 'About', href: '/' },
    { title: 'Writing', href: '/writing' },
    { title: 'Reading', href: '/reading' },
    { title: 'Exploring', href: '/exploring' },
  ],
  footer: [
    { title: 'Legal', href: '/legal' },
    { title: 'Privacy', href: 'https://www.iubenda.com/privacy-policy/41205652' },
    { title: 'Cookies', href: 'https://www.iubenda.com/privacy-policy/41205652/cookie-policy' },
    { title: 'Source', href: 'https://github.com/jairusjoer/jairusjoer.com' },
  ],
};
