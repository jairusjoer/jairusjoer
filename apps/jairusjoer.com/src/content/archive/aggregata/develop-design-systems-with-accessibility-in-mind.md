---
title: Develop design systems with accessibility in mind
description: Don't leave your users behind - Learn how to design accessible user interfaces with a design system that builds accessibility in from the start and eliminates potential barriers.
date: 2024-05-27
---

During my research for the next update of Aggregata, I came across the topics of design systems and the implementation of design tokens. In case you missed it, check out our recent article on [Why we are moving Aggregata from Astro to Ghost](/archive/aggregata/why-we-are-moving-aggregata-from-astro-to-ghost/) for future publishing.

Reading (again) through some amazing design systems documentation from the likes of [IBM](https://www.ibm.com/design/language/), [Nordhealth](https://nordhealth.design/) and [Atlassian](https://atlassian.design/), I was captivated by their commitment to accessibility and how they enable their developers to create inclusive and seamless experiences using design tokens.

Therefore, today we're going to delve into the intersection of design and development and bootstrap a small prototype design system using design tokens and accessible design features.

## Building an accessible foundation

Assuming the desired outcome is a fairly complex web application or site, you want to facilitate an extensible foundation that allows for quick design updates to the UI without requiring a major refactoring of the code base.

The ability to update, add and remove styles with relative ease can be achieved using design tokens. You will be using design tokens in the form of CSS variables to manage the typography and color of your site.

## Using design tokens to enhance accessibility

With CSS variables as your foundation, you can begin to build the foundation of design tokens needed to facilitate your UI requirements. While it might be tempting to assume that you can apply design tokens to all parameters of your design, you may want to return to this step later on.

First, you want to focus on two primary characteristics of your design: Typography and color. Both play a major role in the look and feel of your site and are the most likely candidates for change as the site evolves.

## Typography

Keep it simple. Define `font-size: 100%;` on the HTML root element, and optionally add a second font size setting in the `body` element to properly utilize `rem` units. Using units other than percentages will lead to accessibility issues regarding the scaling and readability of content.

```css
:root {
  font-size: 100%;
}

body {
  font-size: 1rem;
}
```

From here, you can use `rem` units to properly size your text within elements, or opt for fluid typography to seamlessly scale your text based on the screen it is being viewed on. Tools like the [Fluid Typography Tool](https://fluidtypography.com/#app-get-started) help you calculate the right font size for different resolutions.

```css
:root {
  --text-small: 0.875rem;
  --text-p: 1rem;
  --text-h6: 1.25rem;
  --text-h5: 1.625rem;
  --text-h4: 2.125rem;
  --text-h3: 2.75rem;
  --text-h2: 3.5rem;
  --text-h1: 4.375rem;
}

body {
  font-size: var(--text-p, 1rem);
}
```

If you're interested in learning more about accessible typography in the web, I recommend starting with two recent articles on accessible typography by Adrian Roselli and Mike Mai:

- [The Ultimate Ideal Bestest Base Font Size That Everyone Is Keeping a Secret, Especially Chet](https://adrianroselli.com/2024/03/the-ultimate-ideal-bestest-base-font-size-that-everyone-is-keeping-a-secret-especially-chet.html)
- [The Case for Defining Base Font-size](https://mikemai.net/blog/2024/03/25/the-case-for-defining-base-font-size.html)

### Respecting user font preferences

Accessible presentation of text can be improved by respecting users' font preferences. While headlines and other branded content may appear in a specially selected font for brand consistency, it is a good idea to display important or larger portions of text in a user-selected font.

```css
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

An added benefit of choosing `ui-sans-serif`, `system-ui`, or `sans-serif` as the default font family is that this change will reduce the initial transfer size of the site because the selected font is guaranteed to be installed on the user's device.

## Color

Colors can be quite extensive in their required definitions for pages and components. That's why this prototype uses the [shadcn/ui](https://ui.shadcn.com/docs/theming) convention when it comes to color tokens and relies on [Tailwind](https://tailwindcss.com/docs/customizing-colors)'s predefined CSS color palettes.

While the provided set of tokens is fairly compact, you may want to consider expanding the list of available tokens as you develop the site. For your purposes, the following list will be sufficient to render a satisfactory user interface.

```css
:root {
  --background: #fafafa;
  --foreground: #09090b;
  --muted: #f4f4f5;
  --muted-foreground: #52525b;
  --card: var(--background);
  --card-foreground: var(--foreground);
  --popover: var(--background);
  --popover-foreground: var(--foreground);
  --border: #e4e4e7;
  --input: var(--border);
  --primary: var(--foreground);
  --primary-foreground: var(--background);
  --secondary: var(--muted);
  --secondary-foreground: var(--foreground);
  --accent: #4f46e5;
  --accent-foreground: var(--background);
  --destructive: #e11d48;
  --destructive-foreground: var(--background);
  --ring: var(--accent);
  --radius: 0.75rem;
}
```

With this set of color tokens, you also want to limit the use of elevation in your user interface. Elevation itself serves a special purpose in highlighting crucial information and should not be overused or stacked.

Before you move on to theming using your defined color tokens, you might want to take a look at how you reused certain color tokens as a reference in tokens like `--primary` and `--primary-foreground`, since you will be building your theme on top of that approach.

### Adpative color themes using media queries

Media queries such as [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) and [`prefers-contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast) allow you to present your site in different color schemes, such as dark mode, and different contrast levels to accommodate visually impaired users.

`prefers-color-scheme` detects the user's preferred theme on their system and will override your previously defined tokens with customized tokens for a dark mode presentation of your site.

```css
@media (prefers-color-scheme: dark) {
  --background: #09090b;
  --foreground: #fafafa;
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
  --accent: #818cf8;
  --destructive: #fb7185;
}
```

Note that you are only redefining unreferenced values and not the entire set of your color tokens. This is appropriate for your initial set of color tokens. Since the reference values you passed earlier are themselves tokens, changing their value will affect all tokens that reference that value.

`prefers-contrast` detects the user's preferred contrast on their system and will override your previously defined tokens with customized tokens for a high contrast presentation of your site.

```css
@media (prefers-contrast: more) {
  --muted: #e4e4e7;
  --muted-foreground: #3f3f46;
  --border: #a1a1aa;
}
```

You can also nest media queries to simplify your theme handling. In this case, the Dark Mode and High Contrast options are paired and then overridden depending on the user device's system settings. With this approach, you only redefine the tokens you need and save on refactoring.

```css
@media (prefers-color-scheme: dark) {
  --background: #09090b;
  --foreground: #fafafa;
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
  --accent: #818cf8;
  --destructive: #fb7185;

  @media (prefers-contrast: more) {
    --muted: #27272a;
    --muted-foreground: #d4d4d8;
    --border: #52525b;
  }
}
```

> In this demonstration, the color values have been pre-tested to meet the expected contrast ratios as defined by the WCAG standard. For your own implementation, please refer to the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) for proper use of color and contrast.

## Implementing accessible design tokens

How you implement your new set of design tokens depends on many factors and usually requires utility classes and preliminary setup steps. Fortunately, the availability of CSS frameworks knows no bounds, and you have a plethora of options to choose from:

- [Tailwind CSS](https://tailwindcss.com/) offers a utility-first approach that can be composed to build any design
- [Open Props](https://open-props.style/) offers a modular configurable set of CSS variables to choose from
- [StyleX](https://stylexjs.com/) offers building optimized styles using collision-free atomic CSS

Check out [Awesome CSS Frameworks](https://github.com/troxler/awesome-css-frameworks) by [troxler](https://github.com/troxler) for more options regarding CSS frameworks or define your own strategy for implementing design tokens that suits your specific needs.

For a more practial approach, refer to our [Astro Boilerplate](https://github.com/aggregata/astro-boilerplate) which uses the demonstrated approach of handling tokens in a design system. In our article [Astro - An introduction to your next project](/archive/aggregata/astro-an-introduction-to-your-next-project/) we outline the use of our boilerplate project for you.

[Download Astro Boilerplate](https://github.com/aggregata/astro-boilerplate/archive/refs/heads/production.zip)

## Documenting decisions and processes

While the design and development of a design system and its tokens can be enjoyable, it is important to remember to document the steps taken to reach common ground on decisions and processes early on.

As a site or project grows, documentation becomes critical for new contributors, as well as for maintaining or reevaluating current policies that were established in the past. Well-maintained documentation keeps decisions clearly defined and accessible to everyone.

## TL;DR

Develop accessible design systems with design tokens for color and typography. Provide dark mode and high contrast options for users and improve the readability of content according to established web accessibility guidelines.
