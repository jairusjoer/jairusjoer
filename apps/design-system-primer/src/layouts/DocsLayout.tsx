import * as stylex from '@stylexjs/stylex';
import { LucideProvider } from 'lucide-react';
import type { ReactNode } from 'react';
import { AsideLeft } from '../components/AsideLeft';
import { AsideRight } from '../components/AsideRight';
import { Media } from '../stylex/consts.stylex';
import { Color, Space } from '../stylex/tokens.stylex';

const styles = stylex.create({
  layout: {
    backgroundColor: Color.BackgroundDefault,
    color: Color.ForegroundDefault,
    display: 'flex',
    gap: Space['2x'],
    minHeight: '100dvh',
    padding: Space['2x'],
    gridTemplateColumns: {
      default: '1fr',
      [Media.Tablet]: '16rem 1fr',
      [Media.Desktop]: '16rem 1fr 16rem',
    },
  },
  asideLeft: {
    width: '16rem',
    padding: Space['4x'],
    position: {
      default: 'absolute',
      [Media.Tablet]: 'initial',
    },
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Color.BackgroundSubtle,
    borderRadius: Space['2x'],
    display: 'flex',
  },
  main: {
    padding: Space['4x'],
    flexGrow: 1,
  },
  asideRight: {
    padding: Space['4x'],
    top: 0,
    right: 0,
    width: '16rem',
    position: {
      default: 'absolute',
      [Media.Desktop]: 'initial',
    },
  },
});

export interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout(props: DocsLayoutProps) {
  return (
    <LucideProvider size={20}>
      <div {...stylex.props(styles.layout)}>
        <AsideLeft />

        <div {...stylex.props(styles.content)}>
          <main {...stylex.props(styles.main)}>{props.children}</main>

          <AsideRight />
        </div>
      </div>
    </LucideProvider>
  );
}
