export interface SiteConfigLink {
  /** The display text for the link. */
  title: string;

  /** The URL or path the link points to. */
  href: string;
}

export interface SiteConfig {
  /** Links for the header. Will be hidden if left empty. */
  navigation?: Array<SiteConfigLink>;

  /** Links for the footer. Will be hidden if left empty. */
  footer?: Array<SiteConfigLink>;

  /** The date and time formatting options. */
  datetime: Intl.DateTimeFormatOptions;

  /** The locale identifier for internationalization. */
  locale: string;

  /** Description of the website. */
  description: string;

  /** Default image for the header and social sharing. */
  image?: ImageMetadata;

  /** Base URL of the website. */
  site: string;

  /** Title of the website. */
  title: string;
}
