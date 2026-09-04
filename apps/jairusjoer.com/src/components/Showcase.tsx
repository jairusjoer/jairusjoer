import { memo, type ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
  footer?: ReactNode;
  links?: Record<string, string>;
}

export default memo(function Showcase({ children, footer, links }: Props) {
  const hasLinks = links && Object.entries(links).length > 0;

  return (
    <section className="not-prose rounded-outer relative overflow-hidden border">
      {hasLinks && (
        <header className="flex justify-end gap-1.5 p-1.5 font-medium">
          {Object.entries(links).map(([label, path]) => (
            <a
              key={label}
              className="bg-background-subtle rounded-inner hover:text-foreground focus:text-foreground px-1.5"
              href={`https://github.com/jairusjoer/jairusjoer.com/blob/main/${path}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {label}
            </a>
          ))}
        </header>
      )}

      <div className="grid place-content-center overflow-hidden px-1.5 py-12">{children}</div>

      {footer && <footer className="bg-background-subtle rounded-inner m-1.5 space-y-1.5">{footer}</footer>}
    </section>
  );
});
