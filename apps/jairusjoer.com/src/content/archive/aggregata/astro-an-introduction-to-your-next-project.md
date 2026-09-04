---
title: 'Astro - An introduction to your next project'
date: 2023-10-30
description: 'Learn how to use Astro as a flexible base for your next project in this article that takes you from setup to deployment.'
---

That we are enthusiastic about [Astro](https://astro.build/) and its features is known at least since our colophon. As a static page generator (SSG), Astro makes our content available to our visitors via the integrated Collections feature, and its ease of use allows us to focus on our content.

In this article we will show you - [as announced](/archive/aggregata/one-year-of-aggregata-a-review-and-outlook/) - how to set up and publish your own project with Astro.

> This article assumes a certain level of knowledge in the areas of HTML, CSS and JavaScript and is therefore not necessarily suitable for beginners.

---

## Installation

Before we start the installation, we need [Node.js 20 or higher](https://nodejs.org/) and the code editor of your choice. Once these requirements are met, you have a choice of two installation paths:

- Our own [Astro Boilerplate](https://github.com/aggregata/astro-boilerplate.git) with out-of-the-box support for TypeScript, [TailwindCSS](https://tailwindcss.com/) and many more features, or…
- … a manual installation via the [Astro Setup Wizard](https://docs.astro.build/en/install/auto/).

For this article, we will use our boilerplate, whose features we will discuss in more detail below.

### Astro Boilerplate

You have decided in favor of our boilerplate? Great. Click the button below to download and unzip the project.

[Download Astro Boilerplate](https://github.com/aggregata/astro-boilerplate/archive/refs/heads/production.zip)

_You prefer an installation according to your wishes? Then follow the manual installation._

### Manual installation

**If you have already downloaded the boilerplate, skip this step.**

Run the following `create` command in the terminal to start Astro’s handy setup wizard and begin configuring your project:

```sh
npm create astro@latest
```

### Installation of required packages

If you chose to use boilerplate or skipped the installation step for npm in the setup wizard, you will need to install the required packages in the project directory before proceeding:

```sh
npm install
```

### Launch Astro

To start Astro, execute the following `dev` command in the project directory:

```sh
npm run dev
```

Under the URL displayed in the terminal - typically [http://localhost:4321/](http://localhost:4321/) - you will find your new website. On our boilerplate, you will be greeted by the following welcome page:

![Astro Boilerplate homepage](./assets/astro-boilerplate.png)

_If you have chosen the manual installation step, the initial appearance of the home page will depend on the template you have chosen._

---

The following sections refer exclusively to the boilerplate we provide. If you chose to install manually, the excellent [Documentation of Astro](https://docs.astro.build/en/getting-started/) is available, or you can jump directly to the [Deployment](#deployment) section if you are already familiar with Astro.

---

## Configuration

Our boilerplate offers several configuration options by default and already provides some preconfigured options for the following tools.

### Astro

`astro.config.ts` is preconfigured with support for [MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/) and [TailwindCSS](https://docs.astro.build/en/guides/integrations-guide/tailwind/).

```ts
export default defineConfig({
  srcDir: '.',
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
```

astro.config.ts

More integrations and frameworks can be added via [`astro add`](https://docs.astro.build/en/guides/integrations-guide/). More about this in the section [Interactivity](#interactivity).

### Alpine.js

For basic interactivity, [Alpine.js](https://alpinejs.dev/) is installed and follows our configuration presented earlier in the article [_Temporary and Persistent State Management with Alpine.js_](/archive/aggregata/temporary-and-persistent-state-management-with-alpine-js/).

```ts
export const app = () => ({
  // ...
  // init() {
  //   console.log('Hello World')
  // }
});
```

scripts/alpine/app.ts

`app` is imported into the file `scripts/globals.ts`, initiated and globally included via the `<root>` layout.

### TailwindCSS

Styles can be defined with two tools: TailwindCSS and [SCSS](https://sass-lang.com/).

`tailwind.config.ts` uses the theming of [shadcn/ui](https://ui.shadcn.com/docs/theming) and a preconfigured theme for [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin).

The CSS variables of the styles are defined in the file `styles/globals.scss` and provide a preset for dark or light mode via the CSS media query `prefers-color-scheme`.

---

## Pages, Components and Layouts

We already provide the `pages/index.astro` page. It uses the `<Root>` layout and contains the `<Welcome />` component.

### Pages

pages/index.astro` is your start page and contains besides the welcome page only the layout of your future page.

With the constant `meta` you can manage the metadata of the corresponding page and pass this information to the layout `<root>`. The following metadata is available:

```ts
interface Props {
  meta: {
    title?: string;
    description?: string;
    image?: {
      src: string;
      alt?: string;
    };
  };
}
```

### Components

The boilerplate comes with some handy components to get you started:

- `<Footer />` - \*Empty component for binding your own footer.
- `<Meta>` - *Represents common metadata. Allows expansion with* [_`<slot />`_](https://docs.astro.build/en/core-concepts/astro-components/#slots).
- `<Navigation>` - *Empty component for binding custom navigation*.
- `<Welcome />` - *Example component reflecting the changes made to the project*.

### Layouts

The `<Root>` layout is essential for any page and also includes Alpine.js and the `<Navigation />` and `<Footer />` components.

In addition, the layout contains the `<Meta>` component, which receives our metadata defined in the pages. This component also contains the default title of the page.

---

## Interactivity

As already introduced in the [Configuration](#alpinejs) section, our boilerplate uses Alpine.js for a basic level of interactivity.

For more sophisticated applications, we recommend the solutions integrated by [Astro](https://docs.astro.build/en/core-concepts/framework-components/) for various frameworks such as [React](https://react.dev/), [Vue](https://vuejs.org/) or [Svelte](https://svelte.dev/).

### Frontend Frameworks

Based on our configuration, the following two frameworks and components are particularly suited for use in our boilerplate:

- [**Pines**](https://devdojo.com/pines) - *a UI library based on Alpine and Tailwind*.
- [**shadcn/ui**](https://ui.shadcn.com/) -_a UI library based on React, Radix and Tailwind_.

> When using shadcn/ui, follow Astro’s rules for [hydrating components](https://docs.astro.build/en/core-concepts/framework-components/#can-i-hydrate-astro-components).

---

## Deployment

Wenn du deine eigene Seite erstellt hast, musst du sie nur noch veröffentlichen. Am einfachsten geht das mit einer statisch generierten Seite.

Grundsätzlich bist du an keinen Hosting-Provider gebunden und hast die Wahl, wie du deine Seite veröffentlichen möchtest.

### Local

Many providers offer services for the deployment of your site. However, you can also [compile your page locally](https://docs.astro.build/en/guides/deploy/#building-your-site-locally). For this you use the common `build` command:

```sh
npm run build
```

By default you will find your compiled page in the directory `dist/`. Now you just have to upload your page to your provider and your first project is online.

### Services

Astro supports many providers out of the box and without further configuration. Prominent examples are [Cloudflare](https://www.cloudflare.com/) and [Vercel](https://vercel.com/home), which explain and execute the deployment process in a simple dialog.

In addition to static page generation, many providers also support [Server-side Rendering (SSR)](https://docs.astro.build/en/guides/server-side-rendering/) for Astro. According to Astro’s own documentation, SSR provides access to the following features:

- _Implement sessions for login state in your app._
- _Render data from an API called dynamically with fetch._
- _Deploy your site to a host using an adapter._

For simple and manageable projects that do not rely on external resources, it is recommended to use SSG. If the project is more sophisticated, it is advisable to look into SSR to integrate the required resources as you see fit.

---

## TL;DR

Astro in combination with our boilerplate gives you the tools and flexibility to approach your next project the way you want. From setup to deployment, we’ll walk you through it in this article.
