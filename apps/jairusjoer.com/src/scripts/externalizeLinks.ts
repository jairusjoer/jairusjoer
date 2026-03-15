export const externalizeLinks = () => {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href');

    if (!href || href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    const url = new URL(href, window.location.href);

    if (url.origin !== window.location.origin && ['http:', 'https:'].includes(url.protocol)) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  });
};
