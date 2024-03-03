const mdxComponents = import.meta.glob<{ default: object }>('/src/components/mdx/*.{vue,astro}', { eager: true });

export const useMDXComponents = () => {
  return Object.fromEntries(
    Object.entries(mdxComponents).map(([path, component]) => [path.split('/').pop()?.split('.')[0], component.default]),
  );
};
