# jairusjoer.com

Source for [jairusjoer.com](https://jairusjoer.com), a personal site built with [Astro](https://astro.build/), MDX, and Tailwind CSS.

The site is content-first and statically generated. It combines a small set of reusable Astro components with document-driven pages for writing, reading, exploration, and legal content.

## Stack

- Astro 6
- TypeScript
- MDX via `@astrojs/mdx`
- Tailwind CSS via `@tailwindcss/vite`
- RSS and sitemap generation via `@astrojs/rss` and `@astrojs/sitemap`
- Playwright for local utility scripting

## Local Development

Install dependencies and start the Astro dev server:

```bash
pnpm install
pnpm dev
```

Available scripts:

| Command            | Description                                                  |
| :----------------- | :----------------------------------------------------------- |
| `pnpm dev`         | Start the local development server                           |
| `pnpm build`       | Create a production build                                    |
| `pnpm preview`     | Preview the production build locally                         |
| `pnpm check-types` | Run `astro check` for Astro and TypeScript diagnostics       |
| `pnpm format`      | Format Astro, CSS, JSON, Markdown, MDX, and TypeScript files |
| `pnpm lint`        | Run ESLint with autofix enabled                              |

## Site Configuration

Primary site metadata lives in `src/config.ts`. That file defines the public URL, site title, description, locale, navigation, footer links, and the shared site image used for icons and social previews.

Astro configuration lives in `astro.config.ts`, including:

- MDX support
- sitemap generation
- Shiki syntax highlighting themes
- the `site` URL used for canonical output
- Tailwind CSS integration

## Content Model

The site uses Astro content collections defined in `src/content.config.ts`:

- `pages`: Markdown, MDX, and Markdoc files from `src/content/**`
- `books`: structured reading data from `src/content/reading/books.json`
- `links`: structured link data from `src/content/reading/links.json`

All entries in the `pages` collection are routed through `src/pages/[...page].astro`. This means content files become pages automatically, including section landing pages such as:

- `/` from `src/content/index.mdx`
- `/writing` from `src/content/writing.mdx`
- `/reading` from `src/content/reading.mdx`
- `/exploring` from `src/content/exploring.mdx`
- `/legal` from `src/content/legal.md`

Frontmatter for `pages` currently supports:

```ts
{
  title: string;
  description?: string;
  date?: Date;
  image?: ImageMetadata;
  status?: 'Draft';
}
```

Pages marked as `Draft` are treated as unpublished. They receive a `noindex` robots tag and are excluded from the production RSS feed.

## Content Structure

Key content areas in `src/content`:

- `writing/`: first-party essays and posts
- `archive/aggregata/`: archived writing from Aggregata
- `reading/`: books and links rendered from JSON-backed collections
- `exploring.mdx`: experiments and interactive showcases
- `index.mdx`: home/about page

MDX content can use the shared Astro components from `src/components`, including list, badge, showcase, and more.

## Generated Output

The repository includes a few generated or automation-backed outputs:

- `src/pages/rss.xml.ts` builds the site RSS feed from the `pages` collection
- `src/pages/open-graph.astro` renders the template used for social preview images
- `actions/open-graph.ts` can capture Open Graph images into `public/og/**` from a local preview environment

### Open Graph Generation

Open Graph images are generated from the local Astro app, not from static templates alone. The script reads the RSS feed, opens the Open Graph route for each entry, and writes screenshots to `public/og`.

The automated path is defined in `.github/workflows/open-graph.yml` and runs on pushes to `main` when content or the Open Graph template changes.

To run it locally, use the same flow as the workflow:

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

With the dev server running on `http://localhost:4321`, execute:

```bash
node --experimental-strip-types actions/open-graph.ts
```

This will generate or update files in `public/og` for entries discovered via `/rss.xml`.

## Project Layout

```text
src/
  components/      Shared Astro components
  content/         Markdown, MDX, Markdoc, and JSON content
  layouts/         Page layout wrappers
  pages/           Astro routes, including RSS and Open Graph endpoints
  scripts/         Small browser/runtime helpers used by pages
  styles/          Global and custom styling
actions/
  open-graph.ts    Local Open Graph image generation utility
public/
  media/           Static media assets
  og/              Generated Open Graph images
cv/
  Resume-related assets and source material
```

## Notes

- Package management is handled with `pnpm`.
- The site URL is configured as `https://jairusjoer.com`.
- The current primary sections are About, Writing, Reading, and Exploring.
