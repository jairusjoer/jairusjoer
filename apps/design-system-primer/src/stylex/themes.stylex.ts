import * as stylex from '@stylexjs/stylex';
import { colors as palette } from './primitives.stylex';
import { colors } from './semantics.stylex';

const DARK = '@media (prefers-color-scheme: dark)';

export const light = stylex.createTheme(colors, {
  background: palette.gray10,
  foreground: palette.gray90,
});

export const dark = stylex.createTheme(colors, {
  background: palette.gray100,
  foreground: palette.gray40,
});

export const system = stylex.createTheme(colors, {
  background: { default: palette.gray10, [DARK]: palette.gray100 },
  foreground: { default: palette.gray90, [DARK]: palette.gray40 },
});
