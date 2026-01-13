---
title: Cross-Document View Transitions for Multi-Page Applications
description: Learn how to implement cross-document view transitions to create seamless page navigations and enhance user experience in multi-page web applications of any stack.
date: 2025-03-03
---

## Taking View Transitions to the Next Level

In our article [_Leverage the View Transition API in any Project_](https://aggregata.de/leverage-the-view-transition-api-in-any-project/), we explored the View Transition API within the context of a single document. Now, let’s take this a step further and implement transitions across different documents.

[Cross-document view transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document) bridge the gap between traditional multi-page applications and single-page applications in terms of user experience. This allows developers to easily access the smooth navigation experience typically associated with single-page applications.

## Browser Support

As mentioned in our previous article, browser support for the View Transition API is still evolving. Cross-document view transitions currently are supported by Chromium and Safari. However, we can still implement these transitions as progressive enhancements.

## Implementing Cross-Document Transitions

Implementing cross-document view transitions requires setting the CSS query [`@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition). Supporting browsers will apply transitions during navigation, while non-supporting browsers will navigate normally without visual effects.

```css
@view-transition {
  navigation: auto;
}
```

Once you’ve set the CSS query, you can use the [`view-transition-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name) CSS property to apply simple crossfade transitions to pages in your application, just like you’re used to with same-document transitions.

```html
<main>
  <article style="view-transition-name: article-41;"></article>
  <article style="view-transition-name: article-42;"></article>
  <article style="view-transition-name: article-43;"></article>
</main>
```

> Remember that the `view-transition-name` CSS property, as seen above, must be unique for each element to be transitioned.

## Styling Cross-Document Transitions

As with same-document transitions, we can use CSS to control the appearance of cross-document transitions. By default, view transitions use a crossfade to transition between the element snapshots captured by the browser.

```css
::view-transition-old(root) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both fade-out;
}

::view-transition-new(root) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both fade-in;
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

While `root` affects the entire page, we can also target specific elements for transitions by using the `view-transition-name` CSS property more selectively. This gives us the ability to animate multiple elements individually and simultaneously in a single transition.

```css
.page-transition-element {
  view-transition-name: page-element;
}

::view-transition-old(page-element) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-out;
}

::view-transition-new(page-element) {
  animation: 300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-in;
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

## Practical Example: Continuity

A common use case for cross-document view transitions is to maintain the continuity of elements between pages. For example, when a user clicks on an article thumbnail in a list to view the article’s content on a detail page.

> This very example is used throughout our website to provide a seamless experience between the home page and the article details page.

```html
<article>
  <a
    href="/en/blog/web/article-42"
    style="view-transition-name: article-42;"
  >
    <img
      src="/almas-salakhov-oAL2kADlRTk-unsplash.jpg"
      alt="3D render by Almas Salakhov"
    />
    <h2>Article 42 – The answer to everything</h2>
  </a>
</article>
```

```html
<main>
  <header style="view-transition-name: article-42;">
    <img
      src="/almas-salakhov-oAL2kADlRTk-unsplash.jpg"
      alt="3D render by Almas Salakhov"
    />
    <h1>Article 42 – The answer to everything</h1>
  </header>
</main>
```

With the appropriate view transition styles, the thumbnail animates smoothly from its position on the home page to its position on the article detail page, creating a seamless and engaging user experience.

## Limitations and Considerations

Cross-document view transitions offer easy-to-apply benefits, but come with some limitations and considerations. Currently, browser support is limited to Chromium and Safari, which can affect a consistent implementation strategy.

Complex transitions with large DOM changes may impact performance, and JavaScript state isn’t automatically preserved between pages. Server-rendered applications require additional implementation considerations.

Despite these challenges, the improved user experience makes view transitions worth implementing as progressive enhancements. As the View Transition API evolves, we can expect expanded capabilities, better performance, and broader browser support in the future.

---

## TL;DR

Cross-document view transitions enable smooth animations between pages in multi-page applications. They maintain element continuity across page loads, enhancing user experience while preserving multi-page architecture benefits, despite limited browser support.
