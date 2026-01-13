# open.cv

**open.cv** is a document-driven static site theme built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/), crafted for clarity and purpose.

With a deliberately minimal design, this theme ensures your work remains the focal point. It offers a robust yet flexible foundation for your personal website, portfolio, or blog — honoring a clean aesthetic without sacrificing customization.

## Features

- **Document-Driven**: Write in Markdown, MDX, or Markdoc
- **Theming**: Built-in themes and customization via CSS variables
- **Print Friendly**: Optimized appearance for web to print
- **Feed & Sitemap**: Automatic feed and sitemap generation
- **Type Safe**: Fully typed configuration and content collections

## Getting Started

To help you get started, here are the essential commands you'll need to develop, build, and maintain your site. These scripts are defined in your `package.json` and streamline your workflow.

| Command            | Description                                       |
| :----------------- | :------------------------------------------------ |
| `pnpm dev`         | Start the development server                      |
| `pnpm build`       | Build the site for production                     |
| `pnpm preview`     | Preview the built site                            |
| `pnpm check-types` | Check TypeScript types                            |
| `pnpm format`      | Format code with [Prettier](https://prettier.io/) |
| `pnpm lint`        | Lint code with [ESLint](https://eslint.org/)      |

## Configuration

The main site configuration is located in `src/config.ts`. This file exports a `site` object that adheres to the `SiteConfig` interface, ensuring type safety and autocompletion.

```typescript
export const site: SiteConfig = {
  site: 'https://your-site.com',
  title: 'open.cv',
  description: 'Document-driven static site theme',
  locale: 'en-US',
  datetime: {
    month: 'short',
    year: 'numeric',
  },
  // ...
};
```

## Content Management

Content is the heart of your site. All your pages and posts are stored in `src/content/**`. The theme supports standard Markdown (`.md`), MDX (`.mdx`), and Markdoc (`.mdoc`), giving you the flexibility to write in the format you prefer.

### Components

To make your content more dynamic, the theme includes a set of custom components:

- `<PageList />`: Display a list of pages from your content collection
- `<PageHeader />`: Render the site header with title and navigation
- `<PageFooter />`: Render the site footer with configured links
- `<PageNavigation />`: Display navigation links
- `<PageMeta />`: Generate page metadata for SEO

These components are automatically available in your MDX files without manual imports.

## Theming

Your site should reflect your personality. open.cv makes it easy to customize the look and feel of your site through a powerful theming system based on CSS variables.

Switching between themes is as simple as changing a single line in `src/styles/tailwind.css`.

```css
/* src/styles/tailwind.css */

/* @import './themes/aggregata.css'; */
@import './themes/catppuccin.css';
/* @import './themes/read.css'; */
```
