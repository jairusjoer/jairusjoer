import { useLayoutEffect, useState } from 'react';

const themes = ['Read', 'Lara', 'Mono'] as const;

const applyTheme = (theme: string) => {
  const root = document.documentElement;
  const className = `theme-${theme}`;

  if (!root.classList.contains(className)) {
    Array.from(root.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => root.classList.remove(c));

    root.classList.add(className.toLowerCase());
  }
};

export const Theme = () => {
  const [theme, setTheme] = useState<string>((localStorage.getItem('theme') || 'Read') as (typeof themes)[number]);

  useLayoutEffect(() => applyTheme(theme), [theme]);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.currentTarget.value as (typeof themes)[number];

    setTheme(key);
    localStorage.setItem('theme', key);
  };

  return (
    <label className="flex items-center gap-1 text-xs font-medium">
      <span>Theme</span>
      <select
        className="text-foreground rounded-inner h-6 border px-1"
        name="theme"
        id="theme"
        value={theme}
        onChange={onChange}
        title="Set site theme"
      >
        {themes.map((theme) => (
          <option
            key={theme}
            value={theme}
          >
            {theme}
          </option>
        ))}
      </select>
    </label>
  );
};
