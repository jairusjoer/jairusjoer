export const toggleDetails = () => {
  const details = document.querySelectorAll('details');

  window.addEventListener('beforeprint', () => {
    details.forEach((detail) => {
      if (!detail.open) {
        detail.setAttribute('data-was-closed', 'true');
        detail.open = true;
      }
    });
  });

  window.addEventListener('afterprint', () => {
    details.forEach((detail) => {
      if (detail.getAttribute('data-was-closed')) {
        detail.open = false;
        detail.removeAttribute('data-was-closed');
      }
    });
  });
};
