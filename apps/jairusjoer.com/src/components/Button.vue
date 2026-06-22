<script setup lang="ts">
export interface Props {
  as?: string;
  href?: string;
  variant?: keyof typeof variants;
}

const { as = 'a', variant = 'bold', ...props } = defineProps<Props>();

const variants = {
  bold: 'bg-accent text-accent-contrast',
  subtle: 'bg-accent/10 text-accent',
  outline: 'text-accent border',
  ghost: 'text-accent',
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
