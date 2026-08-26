import Showcase from '@components/Showcase';

export default function ThemeContrast() {
  return (
    <Showcase
      footer={
        <p className="p-1.5 text-center">
          <em>Changing the theme colour will automatically apply an appropriate contrast color</em>
        </p>
      }
    >
      <div className="flex gap-1.5 text-center font-medium">
        <div className="border-border/50 rounded-outer grid size-12 place-content-center border bg-(--color-theme-raw)">
          <span style={{ color: 'contrast-color(var(--color-theme-raw))' }}>Aa</span>
        </div>
        <div
          className="border-border/50 rounded-outer grid size-12 place-content-center border"
          style={{ background: 'contrast-color(var(--color-theme-raw))' }}
        >
          <span style={{ color: 'var(--color-theme-raw)' }}>Aa</span>
        </div>
      </div>
    </Showcase>
  );
}
