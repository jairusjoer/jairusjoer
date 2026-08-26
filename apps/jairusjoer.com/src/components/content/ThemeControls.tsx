import { useStore } from '@nanostores/react';
import { $theme } from '@stores/content/themeStore';
import { useCallback, useEffect, type ChangeEvent } from 'react';

export interface Props {
  className?: string;
}

export default function ThemeControls({ className }: Props) {
  const theme = useStore($theme);

  const applyColor = useCallback((color: string) => {
    document.documentElement.style.setProperty('--color-theme-raw', color);
    document.documentElement.style.setProperty(
      '--color-theme',
      `light-dark(
        oklch(from var(--color-theme-raw) 0.5 c h),
        oklch(from var(--color-theme-raw) 0.75 c h)
      )`,
    );
  }, []);

  useEffect(() => {
    applyColor(theme.color);
  }, [applyColor]);

  const onColorInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      $theme.setKey('color', color);
      applyColor(color);
    },
    [applyColor],
  );

  const onTokensInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    $theme.setKey('tokens', Number(event.target.value));
  }, []);

  return (
    <form className={`not-prose bg-background rounded-outer flex gap-1.5 border p-1.5 ${className ?? ''}`}>
      <div className="rounded-inner bg-background-subtle flex gap-1.5 p-1.5">
        <input
          id="color"
          type="color"
          value={theme.color}
          onChange={onColorInput}
        />
        <label htmlFor="color">
          <span className="text-heading">Colour:</span> <span className="font-mono">{theme.color}</span>
        </label>
      </div>
      <div className="bg-background-subtle rounded-inner flex grow gap-1.5 p-1.5">
        <label htmlFor="tokens">
          <span className="text-heading">Tokens:</span>{' '}
          <span className="inline-block min-w-6 text-center font-mono">{theme.tokens}</span>
        </label>
        <input
          className="grow accent-(--color-theme)"
          type="range"
          id="tokens"
          name="tokens"
          step="1"
          min="1"
          max="24"
          onChange={onTokensInput}
        />
      </div>
    </form>
  );
}
