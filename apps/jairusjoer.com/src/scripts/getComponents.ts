const astroComponents = import.meta.glob<{ default: object }>('/src/components/astro/**/*.astro', { eager: true });
const vueComponents = import.meta.glob<{ default: object }>('/src/components/vue/**/*.vue', { eager: true });

const components = [...Object.entries(astroComponents), ...Object.entries(vueComponents)];

const mapped = Object.fromEntries(
  components.map(([path, component]) => {
    const name = path.split('/').pop()?.split('.')[0];
    const capitalizedName = name && name.charAt(0).toUpperCase() + name.slice(1);

    return [capitalizedName, component.default];
  }),
);

export const getComponents = () => mapped;
