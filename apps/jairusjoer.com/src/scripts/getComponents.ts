const contentComponents = import.meta.glob<{ default: object }>('/src/components/**/*', { eager: true });

const mapped = Object.fromEntries(
  Object.entries(contentComponents).map(([path, component]) => {
    const name = path.split('/').pop()?.split('.')[0];
    const capitalizedName = name && name.charAt(0).toUpperCase() + name.slice(1);

    return [capitalizedName, component.default];
  }),
);

export const getComponents = () => mapped;
