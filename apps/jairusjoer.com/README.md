# jairusjoer.com

Source for [jairusjoer.com](https://jairusjoer.com), a personal site built with [Astro](https://astro.build/), MDX, React islands, and Tailwind CSS.

The site is content-first and statically generated. It combines a small set of reusable components with document-driven pages for writing, reading, exploration, and legal content.

## Stack

- Astro 7
- TypeScript (strict)
- MDX via `@astrojs/mdx`
- React 19 islands with `nanostores` for shared client state
- Tailwind CSS 4 via `@tailwindcss/vite`
- Self-hosted fonts via the Astro Fonts API (`Inter`, `JetBrains Mono`)
- RSS and sitemap generation via `@astrojs/rss` and `@astrojs/sitemap`
- Playwright for accessibility testing and utility scripting

## Local Development

Install dependencies and start the Astro dev server:

```bash
pnpm install
pnpm dev
```

Available scripts:

| Command            | Description                                                         |
| :----------------- | :------------------------------------------------------------------ |
| `pnpm dev`         | Start the local development server                                  |
| `pnpm build`       | Create a production build                                           |
| `pnpm preview`     | Preview the production build locally                                |
| `pnpm open-graph`  | Generate Open Graph images (starts and stops its own dev server)    |
| `pnpm a11y`        | Run Playwright axe-core checks against the production build         |
| `pnpm lint-staged` | Run `astro check`, ESLint, and Prettier on staged files (via Husky) |

Formatting and linting use Prettier (with the Astro, Tailwind, and import-sorting plugins) and ESLint (with Astro, jsxA11y, Markdown, JSON, and CSS configs).

## Continuous Integration

GitHub Actions runs the checks defined in `.github/workflows/ci.yml` on pushes to `main` and on pull requests:

- **Verify** — Prettier format check, ESLint, root config type checking, and `nx affected` typecheck and build for the changed projects.
- **Accessibility** — `nx affected` Playwright axe-core checks against a production build (Chromium, cached between runs).

Affected detection uses [`nrwl/nx-set-shas`](https://github.com/nrwl/nx-set-shas) so only projects changed since the last successful run on `main` are verified. The workspace runs without Nx Cloud (`neverConnectToCloud`), so everything is computed on the runner.

This app plugs into CI through its Nx targets (`typecheck`, `build`, `a11y`, `install-browsers`), and its app-owned automation lives in `.github/workflows/jairusjoer-com-*.yml`. See the CI conventions in the repository root `AGENTS.md` for the full rules.

To run the same checks locally:

```bash
pnpm exec prettier --check .
pnpm lint
pnpm typecheck
pnpm nx affected -t typecheck build a11y
```

## Site Configuration

Primary site metadata lives in `src/config.ts`. That file defines the public URL, site title, description, locale, date format, navigation, footer links, and the shared site image used for icons and social previews.

Astro configuration lives in `astro.config.ts`, including:

- font providers and weights
- MDX, React, and sitemap integrations
- Shiki syntax highlighting themes
- prefetch behaviour
- the `site` URL used for canonical output
- the Tailwind CSS Vite plugin

Design tokens (colour scale, radii, spacing, prose width) live in `src/styles/tailwind/theme.css`; typography utilities live in `src/styles/tailwind/utility.css`; long-form styling lives in `src/styles/custom/prose.css`.

Path aliases (`@components`, `@config`, `@data`, `@layouts`, `@scripts`, `@styles`, …) are defined in `tsconfig.json`.

## Content Model

The site uses Astro content collections defined in `src/content.config.ts`:

- `pages`: Markdown and MDX files from `src/content/**`
- `books`: structured reading data from `src/content/books/index.json`
- `links`: structured link data from `src/content/links/index.json`

Content entries are routed through `src/pages/[...page].astro`, so every file in the `pages` collection becomes a page automatically — for example `/writing/about-personal-software` or `/legal`.

Section landing pages are dedicated routes instead of content files:

- `/` from `src/pages/index.astro`
- `/writing` from `src/pages/writing.astro`
- `/reading` from `src/pages/reading.astro`
- `/exploring` from `src/pages/exploring.astro`

Frontmatter for `pages` currently supports:

```ts
interface Frontmatter {
  title: string;
  description?: string;
  date?: Date;
  image?: ImageMetadata;
  status?: 'Draft';
}
```

Pages marked as `Draft` are treated as unpublished. In production they receive a `noindex` robots tag and are excluded from the static build, the RSS feed, and all lists. The development server still renders them for preview.

## Content Structure

Key content areas in `src/content`:

- `writing/`: first-party essays and posts
- `archive/aggregata/`: archived writing from Aggregata
- `books/`: books rendered from a JSON-backed collection
- `links/`: link lists rendered from a JSON-backed collection
- `legal.md`: legal notice

MDX content can use the shared components from `src/components`, including the theme showcase components in `src/components/content`.

## Generated Output

The repository includes a few generated or automation-backed outputs:

- `src/pages/rss.xml.ts` builds the site RSS feed from the `pages` collection
- `src/pages/open-graph.astro` renders the template used for social preview images
- `actions/open-graph.ts` captures Open Graph images into `public/og/**` from a local server environment
- `actions/open-graph.sh` orchestrates the full generation: starts the dev server, waits for it, then runs the script above

### Open Graph Generation

Open Graph images are generated from the local Astro app, not from static templates alone. The script reads the RSS feed, opens the Open Graph route for each entry, and writes screenshots to `public/og`.

The automated path is defined in `.github/workflows/jairusjoer-com-open-graph.yml` and runs on pushes to `main` when content or the Open Graph template changes.

To run it locally, use the same flow as the workflow:

```bash
pnpm install
pnpm build
pnpm exec playwright install chromium
pnpm open-graph
```

`pnpm open-graph` starts the dev server itself and shuts it down afterwards; port `4321` must be free. This will generate or update files in `public/og` for entries discovered via `/rss.xml`. Drafts are excluded because the production RSS feed omits them.

## Project Layout

```text
src/
  assets/          Images and icons
  components/      Shared Astro and React components
  config.ts        Site metadata and navigation
  content/         Markdown, MDX, and JSON content collections
  data/            Structured data used by components
  layouts/         Page layout wrappers
  pages/           Astro routes, including RSS and Open Graph endpoints
  scripts/         Small browser/runtime helpers used by pages
  stores/          Client-side state (nanostores)
  styles/          Global, token, and prose styling
tests/
  a11y.test.ts     Playwright axe-core checks
actions/
  open-graph.ts    Local Open Graph image generation utility
  open-graph.sh    Dev-server orchestration wrapper for the generator
public/
  assets/          Static media assets
  og/              Generated Open Graph images
```

## Notes

- Package management is handled with `pnpm`.
- The site URL is configured as `https://jairusjoer.com`.
- The current primary sections are About, Writing, Reading, and Exploring.
