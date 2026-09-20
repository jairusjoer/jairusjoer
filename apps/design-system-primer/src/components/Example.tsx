import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

const styles = stylex.create({
  base: {
    fontSize: 16,
    lineHeight: 1.5,
    color: 'red',
  },
  highlight: {
    color: 'rebeccapurple',
  },
});

export function Example() {
  const [highlight, setHighlight] = useState(false);

  function toggleHighlight() {
    setHighlight((prev) => !prev);
  }

  return (
    <button
      onClick={toggleHighlight}
      {...stylex.props(styles.base, highlight && styles.highlight)}
    >
      Example
    </button>
  );
}
