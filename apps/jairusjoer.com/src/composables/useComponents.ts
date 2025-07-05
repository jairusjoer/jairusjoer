const components = import.meta.glob<{ default: object }>('/src/components/*.astro', { eager: true });

export const useComponents = () => {
  return Object.fromEntries(
    Object.entries(components).map(([path, component]) => [path.split('/').pop()?.split('.')[0], component.default]),
  );
};
