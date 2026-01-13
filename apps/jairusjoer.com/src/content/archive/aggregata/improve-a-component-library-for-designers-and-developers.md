---
title: Improve a Component Library for Designers and Developers
description: Learn how to improve a component library by implementing interaction states for your components and improving the overall user experience.
date: 2025-02-17
---

## Where we left off

In the [previous article](https://aggregata.de/expand-a-component-library-for-designers-and-developers/), we expanded our button component by implementing design tokens and color variants. We established a system of primitive and semantic tokens that allowed us to manage colors consistently across both design and development.

In this article we’re going to enhance the button component by adding interaction states. This change will extend our designer requirements and ensure that our component provides a smoother user experience.

### New Requirement: States

- `:hover`: *Visual feedback when hovering over the button*
- `:focus`: *Clear indication when the button is focused*
- `:active`: *Visual feedback when the button is clicked*
- `:disabled`: *Distinct appearance when the button is disabled*

## Extending the Button Component

First, let’s update our button component to support the new `disabled` state and prepare it for the interaction states we’ll implement. We’ll add a new `disabled` property and ensure it’s properly passed to both the main button and selector components.

```vue
<script setup lang="ts">
import Icon from './Icon.vue';

defineOptions({ inheritAttrs: false });

const {
  variant = 'bold',
  color = 'brand',
  is = 'button',
  selector = false,
  disabled = false,
} = defineProps<{
  variant?: 'bold' | 'subtle' | 'outline' | 'ghost';
  color?: 'brand' | 'neutral' | 'informative' | 'successful' | 'cautionary' | 'destructive';
  is?: string;
  selector?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <div
    :class="['button', variant, color]"
    :aria-disabled="disabled"
  >
    <component
      class="center"
      :is
      v-bind="$attrs"
      :disabled
    >
      <slot />
    </component>
    <span
      class="separator"
      v-if="selector"
      aria-hidden="true"
    ></span>
    <button
      v-if="selector"
      class="selector"
      :disabled
      aria-label="Toggle options"
    >
      <Suspense>
        <Icon variant="NavArrowDown" />
      </Suspense>
    </button>
  </div>
</template>

<!-- ... -->
```

## Adding Interaction States

To implement our interaction states, we’ll first define semantic tokens for our state colors. These will be used consistently across all button variants and colors to provide visual feedback for different interactions, and will also be globally available to other components.

```css
:root {
  /* ... */

  --color-state-hover: rgb(from var(--primitive-zinc-950) r g b / 0.04);
  --color-state-focus: rgb(from var(--primitive-zinc-950) r g b / 0.08);
  --color-state-active: rgb(from var(--primitive-zinc-950) r g b / 0.12);
}
```

### Implementing States with Colors and Variants

Now we’ll update the styles of our button component to handle all interaction states. We’ll use a pseudo-element to apply state overlays that will work consistently across all of our colors and variants.

```vue
<style scoped lang="scss">
.button {
  overflow: hidden;
  position: relative;
  display: inline-flex;
  gap: 0.25rem;
  line-height: 1rem;
  padding: 0.25rem;
  align-items: center;
  border-radius: 0.75rem;
  transition: filter 150ms ease-in-out;

  /* State overlay */
  &::before {
    content: '';
    display: block;
    inset: 0;
    mix-blend-mode: color-burn;
    pointer-events: none;
    position: absolute;
    transition: background-color 150ms ease-in-out;
  }

  /* Interaction states */
  &:hover:not([aria-disabled='true'])::before {
    background: var(--color-state-hover);
  }

  &:focus-within:not([aria-disabled='true'])::before {
    background: var(--color-state-focus);
  }

  &:active:not([aria-disabled='true'])::before {
    background: var(--color-state-active);
  }

  /* Disabled state */
  &[aria-disabled='true'] {
    filter: grayscale(0.25) opacity(0.75);
    pointer-events: none;
  }
}

// ...
</style>
```

## Updating the Documentation

Last but not least, let’s update the documentation to showcase the new interaction states and provide access to the new `disabled` property and state. Since we’re already using [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs), we can easily add the new `disabled` property to the component’s individual stories.

```ts
// ...

export const Bold: Story = {
  args: {
    variant: 'bold',
    color: 'brand',
    is: 'button',
    selector: true,
    disabled: false,
    default: 'Bold Button',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    color: 'brand',
    is: 'button',
    selector: true,
    disabled: false,
    default: 'Subtle Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    color: 'brand',
    is: 'button',
    selector: true,
    disabled: false,
    default: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    color: 'brand',
    is: 'button',
    selector: true,
    disabled: false,
    default: 'Ghost Button',
  },
};
```

---

## TL;DR

We’ve enhanced our component library’s button component by adding interaction states and accessibility features. Implementing hover, focus, active, and disabled states consistently across all variants and colors creates a more robust, user-friendly, and accessible component.
