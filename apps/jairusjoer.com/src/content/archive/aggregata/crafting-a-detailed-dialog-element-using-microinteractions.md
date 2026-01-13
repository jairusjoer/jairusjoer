---
title: Crafting a detailed Dialog element using Microinteractions
description: Over the past few weeks I've been experimenting with the Dialog element and the new Popover API and dabbled with some microinteractions to make every click a little more engaging.
date: 2024-09-02
---

In this article and the steps that follow, we'll create a detailed dialog modal using various CSS animation and transition properties to create more engaging microinteractions.

## The basics

In its most basic form, triggering a dialog necessitates only two elements: a button to open the dialog and the [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) itself. The button is linked to the dialog by using the [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method, which is a built-in method of the dialog element.

```html
<div id="app">
  <div id="content">
    <button>Open Dialog</button>
    <dialog>
      <p>Hello World</p>
    </dialog>
  </div>
</div>
```

```js
const button = document.querySelector('button');
const dialog = document.querySelector('dialog');

button.addEventListener('click', () => dialog.showModal());
```

## Styling the dialog

To make our dialog modal pop a little more, we'll remove the default border, add a border radius, and apply a drop shadow. Otherwise, you can treat your dialog element like any other element and style it accordingly.

```css
dialog {
  border: unset;
  border-radius: 0.375rem;
  filter: drop-shadow(0 0.75rem 0.75rem #00000020);
}
```

### Styling the backdrop

The backdrop is the standard overlay that appears behind the dialog. You'll also encounter it when working with popovers. We can style it using the [`::backdrop`](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop) pseudo-element. In this example, we'll set the background color to a semi-transparent black.

```css
dialog::backdrop {
  background-color: #00000020;
}
```

## Adding microinteractions

Now we've added a simple but very plain implementation of a dialog modal. To spice things up, we add the aforementioned microinteractions using CSS animation and transition properties to give the dialog a more engaging feel and some depth.

### Setting root variables

Define a [CSS variable](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for the duration of the animation and set it to 150ms or a value of your choice. If the user prefers reduced motion, respect their preference and set the duration to a less eye-straining value or 0ms.

```css
:root {
  --animation-duration: 150ms;

  @media (prefers-reduced-motion) {
    --animation-duration: 0ms;
  }
}
```

### Defining the animation

For this example, we'll use one of the simplest animations available and fade in the dialog. We'll define a keyframe animation called `fade-in` that will fade the dialog in from 0% to 100% opacity.

```css
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opactiy: 1;
  }
}

dialog {
  animation: fade-in var(--animation-duration) ease-out both;

  &::backdrop {
    animation: fade-in var(--animation-duration) ease-out both;
  }
}
```

### Adding depth with transformations

To give the dialog a sense of depth, we'll apply a perspective transformation to the `#app` element. This will bring the dialog into the foreground, while the `#app` element will fade into the background and its `#content` will become blurred.

> Note, that we've employed [`@media (prefers-reduced-motion: no-preference)`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) to only apply the perspective change, if the user has not set their preference to reduced motion.

```css
body {
  background: #eee;

  &:has(dialog[open]) {
    overflow: hidden;

    @media (prefers-reduced-motion: no-preference) {
      #app {
        border-radius: 0.75rem;
        filter: drop-shadow(0 0.75rem 0.75rem #00000020);
        overflow: hidden;
        transform: perspective(100vw) translateZ(-3rem);
      }
    }

    #content {
      filter: blur(0.125rem);
    }
  }
}
```

### Applying transitions

All that's left now is to apply the appropriate transition properties to the `#app` and `#content` elements to animate the transformation and filter properties accordingly. To distinguish `#app` as a layer, consider also using a dimmed background color for the `<body>`.

```css
#app,
#content {
  transition-property: transform, filter, border-radius;
  transition-duration: var(--animation-duration);
  transition-timing-function: ease-out;
}

#app {
  background: #fff;
}
```

## Result

And that's it 🎉 You've just implemented a nicely animated dialog modal into your page, respecting user preferences and using standard and common techniques and tools.

## TL;DR

Learn how to create a detailed dialog modal using microinteractions. We'll cover the basics, styling the dialog, adding microinteractions, and applying transitions properly.
