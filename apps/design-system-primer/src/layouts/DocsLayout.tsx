import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { vars } from '../tokens/generated/tokens.stylex';

const styles = stylex.create({
  layout: {
    backgroundColor: vars.ColorBackground,
    color: vars.ColorForeground,
    display: 'grid',
    minHeight: '100dvh',
    gap: vars.SpaceWide,
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': '16rem 1fr',
      '@media (min-width: 1280px)': '16rem 1fr 16rem',
    },
  },
  main: {
    justifySelf: 'center',
    width: '100%',
    maxWidth: '65ch',
  },
  asideLeft: {
    padding: vars.SpaceWide,
    backgroundColor: vars.ColorBackgroundSubtle,
    position: {
      default: 'absolute',
      '@media (min-width: 640px)': 'initial',
    },
  },
  asideRight: {
    padding: vars.SpaceWide,
    top: 0,
    right: 0,
    backgroundColor: vars.ColorBackground,
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

      <main {...stylex.props(styles.main)}>{props.children}</main>

      <aside {...stylex.props(styles.asideRight)}>Right</aside>
    </div>
  );
}
