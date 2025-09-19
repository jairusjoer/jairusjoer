import { useEffect, useState } from 'react';

const themes = ['Read', 'Lara'];

const get = () => {
  return localStorage.getItem('theme') || 'Read';
};

export const Theme = () => {
  const [theme, setTheme] = useState<string>(get());

  useEffect(() => {
    Array.from(document.documentElement.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => document.documentElement.classList.remove(className));

    document.documentElement.classList.add(`theme-${theme.toLowerCase()}`);
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
