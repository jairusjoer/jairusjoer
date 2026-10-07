import * as stylex from '@stylexjs/stylex';
import { Space } from '../stylex/tokens.stylex';

const styles = stylex.create({
  button: {
    backgroundColor: 'blue',
    padding: Space['4x'],
  },
});

export function Example() {
  return <div {...stylex.props(styles.button)}>Hello from Stylex</div>;
}
