<script setup lang="ts">
export interface Props {
  as?: string;
  href?: string;
  variant?: keyof typeof variants;
}

const { as = 'a', variant = 'accent' } = defineProps<Props>();

const variants = {
  accent: 'bg-accent text-accent-contrast',
  bold: 'bg-foreground text-background',
  subtle: 'bg-background-subtle text-foreground',
  outline: 'border',
  ghost: '',
};
</script>

<template>
  <component
    :is="as"
    :class="[
      'block rounded-md px-1.5 leading-6 font-semibold whitespace-nowrap motion-safe:transition-colors',
      variants[variant],
    ]"
  >
    <slot />
  </component>
</template>
