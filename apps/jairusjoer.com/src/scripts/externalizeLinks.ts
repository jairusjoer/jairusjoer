export const externalizeLinks = () => {
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href')!;

    if (!href.startsWith(window.location.origin) && !href.startsWith('/') && !href.startsWith('#')) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    }
  });
};
