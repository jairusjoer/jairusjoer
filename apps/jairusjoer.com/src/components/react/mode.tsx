import { useLayoutEffect, useState } from 'react';

const modes = ['System', 'Dark', 'Light'] as const;

const applyMode = (mode: string) => {
  const root = document.documentElement;
  const className = `mode-${mode}`;

  if (!root.classList.contains(className)) {
    Array.from(root.classList)
      .filter((c) => c.startsWith('mode-'))
      .forEach((c) => root.classList.remove(c));

    root.classList.add(className.toLowerCase());
  }
};

const getIcon = (mode: string) => {
  switch (mode) {
    case 'Dark':
      return '🌙';
    case 'Light':
      return '☀️';
    default:
      return '🖥️';
  }
};

export const Mode = () => {
  const [mode, setMode] = useState((localStorage.getItem('mode') || 'System') as (typeof modes)[number]);
  const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];

  useLayoutEffect(() => applyMode(mode), [mode]);

  const onClick = () => {
    setMode((previous) => {
      console.log(modes.indexOf(previous));
      const next = modes[(modes.indexOf(previous) + 1) % modes.length];
      localStorage.setItem('mode', next);

      return next;
    });
  };

  return (
    <button
      className="rounded-inner size-6 cursor-pointer border leading-5"
      title="Toggle color mode"
      aria-label={`Toggle color mode. Current: ${mode}, Next: ${nextMode}.`}
      onClick={onClick}
    >
      <span aria-hidden>{getIcon(mode)}</span>
    </button>
  );
};
