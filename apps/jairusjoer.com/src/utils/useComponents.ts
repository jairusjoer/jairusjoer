const components = import.meta.glob<{ default: object }>('/src/components/*.astro', { eager: true });

export const useComponents = () => {
  return Object.fromEntries(
    Object.entries(components).map(([path, component]) => {
      const name = path.split('/').pop()?.split('.')[0];
      const capitalizedName = name && name.charAt(0).toUpperCase() + name.slice(1);

      return [capitalizedName, component.default];
    }),
  );
};
