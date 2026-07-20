import { map } from 'nanostores';

function matchMode(light: string, dark: string) {
  if (import.meta.env.SSR) return light;

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) return dark;

  return light;
}

export const $theme = map({
  color: matchMode('#8839ef', '#cba6f7'),
  tokens: 11,
});
