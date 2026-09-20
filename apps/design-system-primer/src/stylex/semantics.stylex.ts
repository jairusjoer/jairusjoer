import * as stylex from '@stylexjs/stylex';
import { colors as palette } from './primitives.stylex';

export const colors = stylex.defineVars({
  background: palette.gray10,
  foreground: palette.gray90,
});

export type Colors = typeof colors;
