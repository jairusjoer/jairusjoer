# jairusjoer.com

Personal website built with [Astro 5](https://astro.build), MDX content collections, React islands, and Tailwind CSS 4.

## Features

- **Astro 5 + Islands Architecture**: Fast static-first site with selective hydration
- **Content Collections**: `src/content/pages` managed via `astro:content` + Zod schema
- **MD & MDX Support**: Create and publish pages in Markdown / MDX
- **Vue Components**: Interactive UI islands under `src/components/vue`
- **Astro Components**: Layout + structural components in `src/components/astro`
- **Tailwind CSS v4** with Typography plugin and custom theme layers
- **Shiki Code Highlighting** with light/dark themes
- **SEO & Structured Data**: Meta component + JSON-LD schema on index page
- **Sitemap Generation** via `@astrojs/sitemap`
- **Prettier Formatting** with Astro + Tailwind plugins

## Tech Stack

| Layer      | Tools                                    |
| ---------- | ---------------------------------------- |
| Framework  | Astro 5                                  |
| Styling    | Tailwind CSS 4, Typography plugin        |
| Content    | `astro:content`, MDX                     |
| UI Islands | Vue 3                                    |
| Tooling    | TypeScript 5, Vite (via Astro), Prettier |
| Deploy     | Static (deployed to Cloudflare Pages)    |

## Project Structure (excerpt)

```
src/
  components/
    astro/        # Pure Astro components
    vue/          # Vue islands
  composables/    # Helper/composition functions
  content/
    pages/        # Markdown files registered as a collection
  layouts/
    default.astro # Base layout wrapper
  pages/          # Astro route entries
  styles/         # Tailwind entry + theme layers
public/           # Static assets
```

## Getting Started

Prerequisites:

- Node.js 20+
- pnpm 10+

**Install dependencies**:

```sh
pnpm install
```

**Start development server**:

```sh
pnpm dev
```

**Build for production**:

```sh
pnpm build
```

**Preview the production build locally**:

```sh
pnpm preview
```

## Content Editing

Add or edit Markdown/MDX files under `src/content/pages`. Each file becomes available via its corresponding Astro route. Consider the following Frontmatter fields:

```yaml
---
title: 'Page Title'
description: 'Optional description'
draft: true # Optional (omit or set false to publish)
image: ./relative-or-imported.png # Optional
---
```

Use MDX for Vue components inline:

```mdx
import Details from '../../components/vue/details.vue';

<Details client:load>
  <p>Content here</p>
</Details>
```

## Tailwind & Theming

Tailwind is configured via the new `@import 'tailwindcss'` entry in `src/styles/tailwind.css` plus custom layer imports and plugins. Theme overrides live in `styles/themes/*.css`.

## Structured Data / SEO

`src/pages/index.astro` builds a `metadata` object with JSON-LD. Reuse this pattern by passing a similar `metadata` prop into `layouts/default.astro` and the `meta.astro` component.

## Formatting

Run Prettier across Astro, CSS, and TS(X):

```
pnpm run format
```

## Deployment

The site builds static assets to `dist/`. Deploy that folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.). Ensure the canonical `site` URL in `astro.config.ts` matches the deployed domain for correct sitemap + structured data.

## Custom Components

Register new framework components by extending the map returned from `useComponents()` inside `src/composables/useComponents.ts` so they are available to MDX render calls (`render(entry)` usage).
