import * as stylex from '@stylexjs/stylex';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { Media } from '../stylex/consts.stylex';
import { Color, Space } from '../stylex/tokens.stylex';

const styles = stylex.create({
  button: {
    position: 'absolute',
    top: '24px',
    zIndex: 20,
  },
  buttonOpen: {
    left: Space['6x'],
  },
  buttonClose: {
    left: '216px',
  },
  aside: {
    paddingInline: Space['4x'],
    width: '16rem',
    zIndex: 10,
    backgroundColor: Color.BackgroundDefault,
    top: Space['2x'],
    left: Space['2x'],
    position: {
      default: 'absolute',
      [Media.Tablet]: 'initial',
    },
  },
  header: {
    paddingBlock: Space['4x'],
    borderBottomWidth: 1,
  },
  content: {
    paddingBlock: Space['4x'],
  },
});

export function AsideLeft() {
  const [hidden, setHidden] = useState(false);

  function toggleHidden() {
    setHidden(!hidden);
  }

  return (
    <>
      <button
        {...stylex.props(styles.button, hidden ? styles.buttonOpen : styles.buttonClose)}
        title="Toggle left sidebar"
        onClick={() => toggleHidden()}
      >
        {hidden ? <PanelLeftOpen /> : <PanelLeftClose />}
      </button>
      <aside
        {...stylex.props(styles.aside)}
        hidden={hidden}
      >
        <header {...stylex.props(styles.header)}>logo</header>

        <div {...stylex.props(styles.content)}>content</div>
      </aside>
    </>
  );
}
