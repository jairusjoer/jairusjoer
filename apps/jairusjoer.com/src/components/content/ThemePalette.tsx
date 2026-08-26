import Showcase from '@components/Showcase';
import { useStore } from '@nanostores/react';
import { $theme } from '@stores/content/themeStore';
import { useMemo, type CSSProperties } from 'react';

export default function ThemePalette() {
  const theme = useStore($theme);

  const appliedTheme = useMemo(() => {
    const centerIndex = (theme.tokens - 1) / 2;

    return Object.fromEntries(
      Array.from({ length: theme.tokens }, (_, index) => {
        const token = index * 100;
        const chroma = getChroma(index, centerIndex, theme.tokens);

        return [
          token,
          `oklch(from var(--color-theme-raw) ${getLightness(index, theme.tokens)} ${getColorScale(chroma, theme.tokens)} h)`,
        ];
      }),
    );
  }, [theme.tokens]);

  const { cssVariables, style } = useMemo(() => {
    const entries = Object.entries(appliedTheme);
    return {
      cssVariables: entries.map(([token, value]) => `--color-theme-${token}: ${value};`).join('\n'),
      style: Object.fromEntries(entries.map(([token, value]) => [`--color-theme-${token}`, value])) as CSSProperties,
    };
  }, [appliedTheme]);

  return (
    <Showcase
      links={{ Code: 'src/components/content/ThemePalette.tsx' }}
      footer={
        <pre
          className="overflow-x-auto p-3"
          role="region"
          aria-label="Generated CSS custom properties"
          tabIndex={0}
        >
          <code>{cssVariables}</code>
        </pre>
      }
    >
      <div
        className="*:border-border/50 *:rounded-outer flex flex-wrap gap-1.5 text-center text-xs font-medium tabular-nums *:grid *:size-12 *:grow *:place-content-center *:border"
        style={style}
      >
        {Object.entries(appliedTheme).map(([token]) => (
          <div
            key={token}
            style={{
              background: `var(--color-theme-${token})`,
              color: `contrast-color(var(--color-theme-${token}))`,
            }}
          >
            {token}
          </div>
        ))}
      </div>
    </Showcase>
  );
}

function getChroma(index: number, centerIndex: number, tokens: number) {
  const distance = Math.abs(index - centerIndex);
  const maxDistance = Math.max(1, centerIndex);

  if (tokens % 2 === 0) {
    return 1 + tokens * (1 - distance / maxDistance);
  }

  return 1 + (tokens - 1) * (1 - distance / maxDistance);
}

function getLightness(index: number, tokens: number) {
  return ((tokens - index) / tokens).toFixed(2);
}

function getColorScale(chroma: number, tokens: number) {
  return `calc(c * ${(chroma / tokens).toFixed(2)})`;
}
