import * as stylex from '@stylexjs/stylex';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useState } from 'react';
import { Media } from '../stylex/consts.stylex';
import { Space } from '../stylex/tokens.stylex';

const styles = stylex.create({
  button: {
    position: 'absolute',
    top: Space['4x'],
    right: Space['4x'],
    zIndex: 20,
  },
  aside: {
    zIndex: 10,
    padding: Space['4x'],
    top: 0,
    right: 0,
    width: '16rem',
    backgroundColor: 'red',
    position: {
      default: 'absolute',
      [Media.Desktop]: 'initial',
    },
  },
});

export function AsideRight() {
  const [hidden, setHidden] = useState(false);

  function toggleHidden() {
    setHidden(!hidden);
  }

  return (
    <>
      <button
        {...stylex.props(styles.button)}
        onClick={() => toggleHidden()}
      >
        {hidden ? <PanelRightOpen /> : <PanelRightClose />}
      </button>
      <aside
        {...stylex.props(styles.aside)}
        hidden={hidden}
      >
        Right
      </aside>
    </>
  );
}
