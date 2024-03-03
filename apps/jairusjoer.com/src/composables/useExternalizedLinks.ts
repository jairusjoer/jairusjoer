export const useExternalizedLinks = () => {
  document.addEventListener('astro:page-load', () => {
    const links = document.querySelectorAll<HTMLAnchorElement>('.prose a');
    links.forEach((link) => {
      if (!link.href.startsWith(location.origin)) {
        link.setAttribute('target', '_blank');
      }
    });
  });
};
