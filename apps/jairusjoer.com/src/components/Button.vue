<script setup lang="ts">
export interface Props {
  as?: string;
  href?: string;
  variant?: keyof typeof variants;
}

const { as = 'a', variant = 'accent', ...props } = defineProps<Props>();

const variants = {
  accent: 'bg-accent text-accent-contrast',
  bold: 'bg-foreground text-background',
  subtle: 'bg-background-subtle text-foreground',
  outline: 'text-foreground border',
  ghost: 'text-foreground',
};
</script>

<template>
  <component
    :is="as"
    :class="[
      'block rounded-md px-1.5 leading-6 font-semibold whitespace-nowrap motion-safe:transition-colors',
      variants[variant],
    ]"
    v-bind="props"
  >
    <slot />
  </component>
</template>
