---
title: Leverage the View Transition API in any Project
description: Explore the View Transition API and learn how to use it to create smooth transitions between views and pages in a web application.
date: 2025-01-06
---

## Progressive Enhancements

The [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) is fairly new to most browsers and hasn’t quite reached the defined baseline. While Chromium-based browsers and Safari have either fully or partially implemented the API, it’s still in the process of being adopted by browsers like Firefox.

Fortunately, View Transitions can be treated as a [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). This means that we can use the API in our applications and provide a fallback for browsers that don’t support it. In this article, we’ll explore exactly how to do that.

You may have already seen the view transitions in action on Aggregata, especially the cross-document view transitions that allow for smooth transitions between the home page and across article pages.

## Getting Started

In order to properly utilize view transitions where possible while preserving the core functionality of the application, we set up a fallback behavior for unsupported browsers and implemented a new default behavior for browsers that support the API.

```ts
const useViewTransition = (method: Function) => {
  if (!document.startViewTransition) {
    // Fallback behavior
    method();
    return;
  }

  // Default behavior
  document.startViewTransition(() => method());
};
```

```ts
useViewTransition(() => customMethodToUpdateDOM());
```

## Custom Transitions

Now that we’ve established a simple method to pick up our DOM manipulations, we can start customizing the transitions to our liking. By default, view transitions use a crossfade to transition between the element snapshots captured by the browser.

In this case, we use CSS to target our elements and use animations and transitions to create a more engaging experience. The View Transition API provides several pseudo-elements that can be targeted to apply styles. For this demonstration, we’ll use the following:

- `::view-transition-old()`: *Captured snapshot of the old view.*
- `::view-transition-new()`: *Live represntation of the new view.*

```css
::view-transition-old(root) {
  animation: 150ms ease-out both fade-out;
}

::view-transition-new(root) {
  animation: 150ms ease-in 150ms both fade-in;
}
```

`root` refers to the [`:root` pseudo class](https://developer.mozilla.org/de/docs/Web/CSS/:root), which selects the document root element (`<html>` by default) to animate the entire document on each DOM manipulation. We’ll learn how to target specific elements in the next section.

## Multiple Transitions

By default, view transitions animate the whole document and add a `::view-transition` overlay. Since we don’t want users to wait for each transition, we can exclude the root element from transitions and allow further pointer interaction.

```css
:root {
  view-transition-name: none;
}

::view-transition {
  pointer-events: none;
}
```

The `view-transition-name` CSS property, as seen above, must be **unique** for each element to be transitioned. While this works wonders for singular and/or unique elements on a page, it becomes a bit more complex when dealing with multiple elements of the same type.

```html
<main>
  <article style="view-transition-name: article-41;"></article>
  <article style="view-transition-name: article-42;"></article>
  <article style="view-transition-name: article-43;"></article>
</main>
```

```css
::view-transition-old(article-41),
::view-transition-old(article-42),
::view-transition-old(article-43) {
  animation: 150ms ease-out both fade-out;
}

::view-transition-new(article-41),
::view-transition-new(article-42),
::view-transition-new(article-43) {
  animation: 150ms ease-in 150ms both fade-in;
}
```

Instead, we may want to use `view-transition-class` to apply the transition to all elements with the same class, rather than repeating the properties for each unique name respectively. The above example can thus be reduced to the following selectors:

```css
main > article {
  view-transition-class: article;
}

::view-transition-old(.article) {
  animation: 150ms ease-out both fade-out;
}

::view-transition-new(.article) {
  animation: 150ms ease-in 150ms both fade-in;
}
```

## Next up

In the next article, we’ll explore cross-document view transitions and how multi-page applications can benefit from the View Transition API. We’ll cover how to set up the transitions and how to customize them to create an enhanced experience for users across browsers.

---

## TL;DR

Learn how to leverage the View Transition API to create smooth animations for seamless view transitions in your web applications. This article covers setting up fallbacks for unsupported browsers and customizing transitions for one or multiple elements with CSS.
