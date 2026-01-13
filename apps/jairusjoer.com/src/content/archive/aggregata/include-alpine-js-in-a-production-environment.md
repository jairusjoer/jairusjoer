---
title: 'Include Alpine.js in a production environment'
date: 2022-10-09
description: 'To increase the interactivity of a production-ready PHP environment, I implemented Alpine.js for the first time. Here are my findings.'
---

## Reasons for using Alpine

[Alpine.js](https://alpinejs.dev/) describes itself as your new lightweight JavaScript framework and focuses on just that. With the features of Vue.js and an equally familiar syntax (thanks to [`@vue/reactivity`](https://www.npmjs.com/package/@vue/reactivity)), existing HTML code can be extended with a desired level of reactivity without greatly increasing the footprint of existing scripts.

## Integration & First Steps

The [integration of Alpine](https://alpinejs.dev/essentials/installation), taking into account data protection and current content security policies is as simple as it could be.

```sh
$ pnpm i alpinejs
```

> In most cases, the recommended implementation in the documentation is sufficient. For an increased level of security, Alpine provides a dedicated build with [`@alpinejs/csp`](https://alpinejs.dev/advanced/csp).

After installing the package, Alpine can be imported and initialized with the line `window.Alpine.start()`.

```js
import Alpine from 'alpinejs';

window.Alpine = Alpine; // Optional for feedback within DevTools
window.Alpine.start();
```

Theoretically, Alpine can be used fully inline from this point. In the following example, a dropdown element is controlled with Alpine attributes.

```html
<div
  class="dropdown"
  x-data="{open: false}"
>
  <button
    class="dropdown-head"
    x-on:click="open = !open"
  >
    Hello
  </button>
  <div
    class="dropdown-body"
    x-cloak
    x-show="open"
    x-transition
  >
    World
  </div>
</div>
```

> The [`x-cloak`](https://alpinejs.dev/directives/cloak) attribute for `.dropdown-body` is not mandatory, but prevents the component from flickering when the page is initially loaded.

Since elements such as dropdowns are often used multiple times on a page in the same context, the functionality can be optimized with global methods to the extent that the actual inline code turns out a bit leaner and clearer.

## More flexibility with `Alpine.data()`

The [`Alpine.data()`](https://alpinejs.dev/globals/alpine-data) method allows reuse of `x-data` contexts within the application. This allows the dropdown element already presented to be redesigned as follows.

```js
import Alpine from 'alpinejs';

document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', () => ({
    open: false,
    toggle() {
      this.open = !this.open;
    },
  }));
});

window.Alpine.start();
```

```html
<div
  class="dropdown"
  x-data="dropdown"
>
  <button
    class="dropdown-head"
    x-on:click="toggle"
  >
    Hello
  </button>
  <div
    class="dropdown-body"
    x-cloak
    x-show="open"
    x-transition
  >
    World
  </div>
</div>
```

In this scenario, the `open` state and the `onclick` function are offloaded to the global method so that changes to the code can be made centrally, within the dropdown object.

## Global and local scopes and `x-data` as utility

As illustrated by the dropdown example, global and local scopes can be used to create and manipulate context. This methodology can be established as a higher-level utility to control multiple elements simultaneously, or to define and order states in a uniform way.

In the aforementioned PHP environment, video content from a popular third-party provider was included, requiring user consent to share data. Using Alpine, I defined a method that loads and displays all of the user's videos within the `x-data` scope `videos` if users agree to the data exchange.

```js
Alpine.data('videos', () => ({
  show: false,
  embed: 'https://www.youtube-nocookie.com/embed/',
  accept: 'Allow YouTube content',
  decline: 'Hide YouTube content',
  toggle() {
    this.show = !this.show;
  },
  src(id) {
    return this.show && this.embed + id;
  },
  text() {
    return !this.show ? this.accept : this.decline;
  },
}));
```

```html
<div
  class="videos"
  x-data="videos"
>
  <!-- ... -->
  <div class="video">
    <div
      class="video-consent"
      x-show="!show"
      x-transition
    >
      ...
    </div>
    <iframe
      class="video-frame"
      title="Video-Player"
      x-cloak
      x-bind:src="src('dQw4w9WgXcQ')"
      x-show="show"
      x-transition
    ></iframe>
    <button
      class="video-button"
      x-on:click="toggle"
      x-text="text"
    ></button>
  </div>
  <!-- ... -->
</div>
```

In principle, this concept can be modularized and optimized for different third parties, so that one methodology can be applied to multiple cases.

## Findings

Complex and multi-used functions can be grouped into a context and made accessible to child elements through `x-data`. The ability to write and test scripts within Alpine attributes invites experimentation, but is unsuitable for a production environment. Functions and methods can instead be defined within the `'alpine:init'` EventListener to reduce HTML document load time and complexity.

Global events and elements can be managed excellently via a context in the `<html>` element, as this is due to all child elements.

```html
<html
  lang="en"
  x-data="utility"
></html>
```

However, the global context does not block the use of other contexts within the HTML structure. This allows two contexts to be available within one element.

```html
<html
  lang="en"
  x-data="utility"
>
  <!-- ... -->
  <div
    class="videos"
    x-data="videos"
  ></div>
  <!-- ... -->
</html>
```

Thus for each HTML component an own context with functions and data can be established, which has also access to superordinate context and is not excluded from global settings.

## TL;DR

Alpine allows the incremental extension with interactive and reactive elements by a reduced approach and a methodology, which - thanks to a clear documentation - can be quickly taken up and established.
