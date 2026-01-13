---
title: Set up a new project with Tailwind CSS 4.0
description: Tailwind CSS version 4.0 has just been released as a beta. In this article, you will learn how to take advantage of the new features in the latest version and how to set up a new project using Vite as a build tool.Portrait of Jairus JoerWebDec 23, 2024
date: 2024-12-23
---

Before we begin, please keep in mind that we’re approaching the bleeding edge here. Tailwind CSS 4.0 is still in beta and subject to change. If you’re okay with that, enjoy this brief introduction to setting up your next project.

This guide will use the freshly released [Vite 6.0](https://vite.dev/blog/announcing-vite6.html) and the latest [Tailwind CSS 4.0 Beta](https://tailwindcss.com/docs/v4-beta). While we’ll introduce Tailwind into the mix, we’ve made sure not to touch much of Vite’s original scaffolding. This way you can easily adapt the setup to your needs.

## Set up a new project with Vite

[Getting started with Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project) is as easy as running the following command in your terminal. When prompted during setup, preferrably select `Vanilla` and `TypeScript` as options. Once the setup is complete, navigate to the project directory or open it in your code editor of choice.

```sh
npm create vite@latest
```

## Install Tailwind CSS

Next up is the star of the show, Tailwind CSS 4.0. With version 4, Tailwind’s installation has been simplified and its configuration has been moved to a CSS file. All we need to do to enable Tailwind in our project is install the packages and add a few lines to our configuration to load it.

```sh
npm install tailwindcss@next @tailwindcss/vite@next
```

```ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

```css
@import 'tailwindcss';
```

> Also, don’t forget to load your new CSS file either from `main.ts` or from `index.html`.

```ts
import './tailwind.css';
```

## Configure a theme for the project

For a custom theme, we’ll use the [`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) property and [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) of CSS to automatically detect and apply the user’s preferred color scheme. Since Tailwind injects its modernized P3 color palette as CSS variables, we can easily define a light and dark theme.

```css
@theme {
  --color-background: light-dark(var(--color-zinc-100), var(--color-zinc-950));
  --color-foreground: light-dark(var(--color-zinc-950), var(--color-zinc-100));

  --color-muted: light-dark(var(--color-zinc-50), var(--color-zinc-900));
  --color-muted-foreground: light-dark(var(--color-zinc-600), var(--color-zinc-400));

  --color-card: var(--background);
  --color-card-foreground: var(--foreground);

  --color-popover: var(--background);
  --color-popover-foreground: var(--foreground);

  --color-border: light-dark(var(--color-zinc-200), var(--color-zinc-800));

  --color-input: var(--border);

  --color-primary: var(--foreground);
  --color-primary-foreground: var(--background);

  --color-secondary: var(--muted);
  --color-secondary-foreground: var(--foreground);

  --color-accent: light-dark(var(--color-indigo-600), var(--color-indigo-400));
  --color-accent-foreground: var(--background);

  --color-destructive: light-dark(var(--color-red-600), var(--color-red-400));
  --color-destructive-foreground: var(--background);

  --color-ring: var(--accent);

  --radius-radius: 0.5rem;
}
```

_To enable support for `light-dark()`, set the root `color-scheme` to `light dark`._

```css
@layer base {
  :root {
    color-scheme: light dark;
  }
}
```

## Use the Typography plugin

To ease the introduction of rich text content, whether in the form of pages or blog posts, we’ll use [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) and configure it using its built-in CSS variables to add our own custom rich text theme.

```sh
npm install -D @tailwindcss/typography
```

```css
@plugin "@tailwindcss/typography";
```

As in the previous steps, once you have installed the plugin, simply add it to your `tailwind.css` file. Since the typography plugin uses CSS variables for its theme, we can easily define our own theme by setting the variables to our custom colors in the [`utilities` CSS layer](https://tailwindcss.com/docs/v4-beta#native-css-cascade-layers).

```css
@layer utilities {
  .prose-accent {
    --tw-prose-body: var(--color-muted-foreground);
    --tw-prose-headings: var(--color-foreground);
    --tw-prose-lead: var(--color-muted-foreground);
    --tw-prose-links: var(--color-accent);
    --tw-prose-bold: var(--color-foreground);
    --tw-prose-counters: var(--color-accent);
    --tw-prose-bullets: var(--color-accent);
    --tw-prose-hr: var(--color-border);
    --tw-prose-quotes: var(--color-foreground);
    --tw-prose-quote-borders: var(--color-accent);
    --tw-prose-captions: var(--color-muted-foreground);
    --tw-prose-kbd: var(--color-foreground);
    --tw-prose-kbd-shadows: from var(--color-foreground) r g b;
    --tw-prose-code: var(--color-foreground);
    --tw-prose-pre-code: var(--color-foreground);
    --tw-prose-pre-bg: var(--color-muted);
    --tw-prose-th-borders: var(--color-border);
    --tw-prose-td-borders: var(--color-border);
  }
}
```

And that’s it! You’ve created a new project with Tailwind CSS 4.0. You can now start building your project with the latest features and improvements of Tailwind CSS. Feel free to customize the configuration to suit your needs.

---

## TL:DR

To configure a responsive web project, set up your environment with Vite and add Tailwind CSS 4.0 dependencies. Then, implement theme customization via CSS variables and color-scheme options, and enable typography enhancements with plugins.
