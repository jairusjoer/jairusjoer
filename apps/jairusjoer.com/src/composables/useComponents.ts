const astroComponents = import.meta.glob<{ default: object }>('/src/components/astro/*.astro', { eager: true });
const reactComponents = import.meta.glob<{ default: object }>('/src/components/react/*.tsx', { eager: true });

export const useComponents = () => {
  const set = [...Object.entries(astroComponents), ...Object.entries(reactComponents)];

  return Object.fromEntries(
    set.map(([path, component]) => {
      const name = path.split('/').pop()?.split('.')[0];
      const capitalizedName = name && name.charAt(0).toUpperCase() + name.slice(1);

      return [capitalizedName, component.default];
    }),
  );
};
