import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { vars } from '../tokens/tokens.stylex';

const styles = stylex.create({
  layout: {
    backgroundColor: vars.ColorBackgroundDefault,
    color: vars.ColorForegroundDefault,
    display: 'grid',
    minHeight: '100dvh',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': '16rem 1fr',
      '@media (min-width: 1280px)': '16rem 1fr 16rem',
    },
  },
  asideLeft: {
    padding: vars.Space4x,
    backgroundColor: vars.ColorBackgroundSubtle,
    position: {
      default: 'absolute',
      '@media (min-width: 640px)': 'initial',
    },
  },
  content: {
    margin: vars.Space4x,
    gridColumn: '2/-1',
    backgroundColor: 'red',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
  },
  main: {
    justifySelf: 'center',
    width: '100%',
    maxWidth: '65ch',
    padding: vars.Space4x,
  },
  asideRight: {
    padding: vars.Space4x,
    top: 0,
    right: 0,
    backgroundColor: vars.ColorBackgroundDefault,
    position: {
      default: 'absolute',
      '@media (min-width: 1280px)': 'initial',
    },
  },
});

export interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout(props: DocsLayoutProps) {
  return (
    <div {...stylex.props(styles.layout)}>
      <aside {...stylex.props(styles.asideLeft)}>Left</aside>

      <div {...stylex.props(styles.content)}>
        <main {...stylex.props(styles.main)}>{props.children}</main>

        <aside {...stylex.props(styles.asideRight)}>Right</aside>
      </div>
    </div>
  );
}
