export interface PageConfig {
  datetime: Intl.DateTimeFormatOptions;
  description: string;
  footer?: {
    top?: Record<string, string>;
    bottom?: Record<string, string>;
  };
  image?: () => Promise<ImageMetadata>;
  locale: string;
  navigation?: Record<string, string>;
  title: string;
  url: string;
}

export const page: PageConfig = {
  url: 'https://jairusjoer.com',
  image: async () => (await import('./assets/image.png')).default,
  title: 'Jairus Joer',
  description: 'Senior Software Engineer & Designer',
  locale: 'en-US',
  datetime: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
  navigation: {
    About: '/',
    Writing: '/writing',
    Reading: '/reading',
    Exploring: '/exploring',
  },
  footer: {
    top: {
      LinkedIn: 'https://www.linkedin.com/in/jairusjoer',
      GitHub: 'https://github.com/jairusjoer',
      Email: 'mailto:hello@jairusjoer.com',
    },
    bottom: {
      Legal: '/legal',
      Privacy: 'https://www.iubenda.com/privacy-policy/41205652',
      Cookies: 'https://www.iubenda.com/privacy-policy/41205652/cookie-policy',
      Source: 'https://github.com/jairusjoer/jairusjoer/tree/main/apps/jairusjoer.com',
    },
  },
};
