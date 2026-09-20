import * as stylex from '@stylexjs/stylex';
import { colors } from '../stylex/semantics.stylex';
import { dark } from '../stylex/themes.stylex';

const styles = stylex.create({
  base: {
    backgroundColor: colors.background,
    color: colors.foreground,
  },
});

export function Example() {
  return (
    <div {...stylex.props(dark)}>
      <div {...stylex.props(styles.base)}>Example</div>
    </div>
  );
}
