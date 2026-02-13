---
title: 'Colophon: How we build Aggregata'
date: 2023-06-12
description: "Today we'll give you an inside look at the design and technical implementation decisions behind Aggregata."
---

> "You can find a current version of our colophon [here](https://archive.aggregata.de/en/meta/colophon/)"

Aggregata has undergone numerous changes since its launch in August 2022 to provide our content in a more reliable and comprehensive way. From big changes like multilingualism to small details like the interactive plots, the table of contents and the RSS feed.

Accessibility and richness of content are always in the foreground and influence not only our content, but also the platform on which we want to present it.

In this article, we would like to share with you the decisions we have made in design and technical implementation in order to meet this requirement.

## Design decisions

### Typography

The [IBM Plex](https://www.ibm.com/plex/) font family is used for all text content. Its technical nature distinguishes it from traditional surface font families, but without compromising the legibility of the characters.

Also, to comply with the [WCAG 2.1](https://www.w3.org/TR/WCAG21/) AA, we generally use a contrast ratio of 4.5:1 for fonts on a background.

Headings, bulk text, and general text are set in IBM Plex Sans. For UI elements, this can be combined with our preferred [icon library](#icons).

Inline code, code blocks and selected decorative elements are set in IBM Plex Mono.

### Colors

A sorted color palette allows us to present our content in different ways without deviating too much from the core of our design philosophy. To this end, we have chosen to use the two palettes Zinc and Indigo from [Tailwind CSS](#tailwind-css).

**Zinc:** Not quite gray, but neutral enough to allow for more flexible use of colors, Zinc is our primary color palette for the surface of Aggregata.

**Indigo:** Highlights and interactive elements, respectively, use Indigo to subtly stand out against the neutral surface.

### Icons

In order to achieve a uniform appearance, we decided on an icon library that fits in with the style of our typography.

The [IBM Design Language UI icons](https://www.ibm.com/design/language/iconography/ui-icons/library/) were developed in parallel with IBM's house font and complement the font family pixel-perfectly with a comprehensive selection of icons.

### Images

The image material for the article preview - preferably 3D renderings - is obtained from [Unsplash](https://unsplash.com/). In the future, the article preview will be generated dynamically and content-based, so that abstract image content can be dispensed with here.

## Technical decisions

### Markdown

Markdown allows us to use our content independently of a proprietary format in a wide variety of frameworks. In combination with Frontmatter, we can provide important metadata about the content and access it via framework-specific functions.

For the representation of formulas, we rely on [rehype-katex](https://github.com/remarkjs/remark-math/tree/main) and remark-math.

Pages and articles with interactive content use [MDX](https://mdxjs.com/) and [@astrojs/mdx](https://github.com/withastro/astro/tree/main/packages/integrations/mdx) to render custom elements.

### Astro

[Astro](https://astro.build/) supports all the features we need to make our content performant and easily accessible.

We use Astro as a static page generator and generate all pages as static HTML. Our pages are managed using Astro's own collection feature, with each collection representing a language we support.

### Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) provides us with a token-based design system for CSS that allows us to flexibly design our pages.

In special cases where complex or specific effects need to be achieved, we fall back on Astro's Components features and supplement them with [SCSS](https://sass-lang.com/).

### Alpine.js

A large part of the interactivity in the client is handled for us by [Alpine.js](https://alpinejs.dev/).

We have already shared our positive experiences with Alpine.js in the past, an introduction to Alpine.js can be found in our first [article on this topic](/archive/aggregata/include-alpine-js-in-a-production-environment).

### Cloudflare

With [Cloudflare](https://www.cloudflare.com/), we host our static pages on a global edge network.

In addition to reduced response time and improved site accessibility, Cloudflare also protects our site from uninvited visitors.
