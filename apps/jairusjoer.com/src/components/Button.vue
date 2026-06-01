<script setup lang="ts">
export interface Props {
  as?: string;
  variant?: keyof typeof variants;
  [key: string]: any;
}

const { as = 'a', class: className, variant = 'accent', ...rest } = defineProps<Props>();

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
      className,
    ]"
    v-bind="rest"
  >
    <slot />
  </component>
</template>
