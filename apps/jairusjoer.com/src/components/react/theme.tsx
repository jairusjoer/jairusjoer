import { useLayoutEffect, useState } from 'react';

const themes = ['Read', 'Lara'];

export const Theme = () => {
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'Read');

  useLayoutEffect(() => {
    const root = document.documentElement;
    const className = `theme-${theme.toLowerCase()}`;

    if (!root.classList.contains(className)) {
      Array.from(root.classList)
        .filter((c) => c.startsWith('theme-'))
        .forEach((c) => root.classList.remove(c));

      root.classList.add(className);
    }
  }, [theme]);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const key = event.currentTarget.value;

    if (themes.includes(key)) {
      setTheme(key);
      localStorage.setItem('theme', key);
    }
  };

  return (
    <label className="flex items-center gap-1 text-xs font-medium">
      <span>Theme</span>
      <select
        className="text-foreground h-6 rounded border px-1"
        name="theme"
        id="theme"
        value={theme}
        onChange={onChange}
        aria-label="Set site theme"
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
