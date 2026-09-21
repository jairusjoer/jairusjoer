import * as stylex from '@stylexjs/stylex';
import { vars } from '../tokens/generated/tokens.stylex';

const styles = stylex.create({
  base: {
    backgroundColor: vars.ColorBackground,
    color: vars.ColorForeground,
  },
});

export function Example() {
  return <div {...stylex.props(styles.base)}>Example</div>;
}
