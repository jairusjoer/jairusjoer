export function Stylex() {
  if (!import.meta.env.DEV) return;

  return (
    <>
      <link
        rel="stylesheet"
        href="/virtual:stylex.css"
      />
      <script type="module">import('/@id/virtual:stylex:runtime');</script>
    </>
  );
}
