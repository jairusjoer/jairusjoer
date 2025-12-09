---
title: 'Temporary and persistent state management with Alpine.js'
date: 2023-07-24
description: "In this article, you'll learn how to use Alpine.js to manage both temporary and persistent states, and how to use it to optimize your user experience."
---

The texts in this article were partly composed with the help of artificial intelligence and corrected and revised by us.

In our first article on using [Alpine.js in a production environment](https://aggregata.de/en/blog/alpinejs/alpine-in-a-production-environment/), we outlined a scenario where Alpine's contexts can be used to map both local and global scopes over which data can be provided.

With this article, we would like to revisit and deepen this scenario. In this demonstration, we will implement a compliance solution for external content and store the user's decisions temporarily or persistently.

## Set up necessary utilities

Before we start designing the actual components, we need a simple function to read data from `localStorage` or write data to it.

`local()` returns either an object created from the locally stored JSON value of the specified `key`, or an empty object if no value for the specified `key` was found in local storage.

```ts
// scripts/utilities.ts
export const local = (key: string, value: any = null): object => {
  if (value != null) localStorage[key] = JSON.stringify(value);
  return localStorage?.[key] ? JSON.parse(localStorage[key]) : {};
};
```

## Set up the global scope with `app`

To be able to access the compliance state within the application, we design a new context for Alpine: `app`. In the context of `app` we store under `compliance` the object from the local storage, respectively the empty object, insofar as the local storage has to be configured for the first time:

> "The method used here differs from our previous articles on Alpine.js and relies on a later import of the context `app` in a global script file."

```ts
// scripts/alpine/app.ts
import { local } from '../utilities';

export const app = () => ({
  compliance: local('compliance'),
});
```

We then register our context `app` for an element that will encompass all subsequent implementations of compliance:

```html
<!-- index.html -->
<html x-data="app">
  ...
</html>
```

In our example, we register our global context using the `<html>` element, but `<body>` or root elements for apps like `<div id="root">` can also be used.

## Compliance structure

Now that we have completed the necessary preparations for the local store and the global scope, we can start with the actual compliance implementations:

In the new context `compliance` we declare the method `toggle()` with the parameter `type`, via which we want to capture the consent of the user:s in the future.

Our pre-declared method `local()` helps us - if the user preference is not `'single'`, i.e. temporary - to store the collected data in the form of an object in local memory.

```ts
// scripts/alpine/compliance.ts
import { local } from '../utilities';

export const compliance = (type: string) => ({
  toggle(preference: string) {
    if (preference == 'single') return (this.compliance[type] = !this.compliance?.[type]);

    this.compliance[type] = !this.compliance?.[type];
    local('compliance', this.compliance);
  },
});
```

The corresponding HTML snippet placed in the application may look like the following and consists mainly of two sections:

- the user dialog for consent, controlled by `x-show="!compliance?.youtube"`
- and the content in the form of an iframe, whose external content is controlled by `x-bind`.

```html
<!-- Compliance Snippet -->
<div x-data="compliance('youtube')">
  <div x-show="!compliance?.youtube" x-transition>
    <p>...</p>

    <button x-on:click="toggle('single')">...<button>
    <button x-on:click="toggle('always')">...<button>
  </div>

  <iframe frameborder="0" x-bind:src="compliance?.youtube && 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'" x-show="compliance?.youtube" x-transition></iframe>

  <button x-show="compliance?.youtube" x-on:click="toggle('always')">...</button>
</div>
```

## Indexing of the components

To simplify access to the declared methods, we create an `index.ts` in the Alpine directory and export the previously created files.

```ts
// scripts/alpine/index.ts
export { app } from './app';
export { compliance } from './compliance';
```

## Integration

To integrate our new compliance snippet, we simply import Alpine.js and our methods for Alpine and register them in the `addEventListener` callback for `alpine:init`.

```ts
// scripts/globals.ts
import Alpine from 'alpinejs';
import { app, compliance } from './alpine';

document.addEventListener('alpine:init', () => {
  Alpine.data('app', app);
  Alpine.data('compliance', compliance);
});

Alpine.start();
```

Finally, we import the compiled script as a module into our project:

```html
<!-- index.html -->
<body>
  ...
  <script
    src="scripts/globals.js"
    type="module"
  ></script>
</body>
```

## TL;DR

Alpine.js can be used to manage temporary and persistent states to implement a compliance solution for external content.
