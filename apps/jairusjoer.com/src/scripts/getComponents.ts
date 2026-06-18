const contentComponents = import.meta.glob('/src/components/**/*.{astro,vue}', { eager: true });

type AstroComponent = () => unknown;

type Components = Record<string, AstroComponent>;

const mapped: Components = Object.fromEntries(
  Object.entries(contentComponents).map(([path, mod]) => {
    const name = path.split('/').pop()?.split('.')[0];
    const capitalizedName = name && name.charAt(0).toUpperCase() + name.slice(1);

    return [capitalizedName, (mod as { default: AstroComponent }).default];
  }),
);

export const getComponents = (): Components => mapped;
