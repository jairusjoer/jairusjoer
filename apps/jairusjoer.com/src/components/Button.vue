<script setup lang="ts">
export interface Props {
  as?: string;
  [key: string]: any;
}

const { as = 'a', class: className, ...rest } = defineProps<Props>();
</script>

<template>
  <component
    :is="as"
    :class="[
      'hover:bg-accent hover:text-accent-contrast bg-background-subtle block rounded-md px-1.5 leading-6 font-semibold motion-safe:transition-colors',
      className,
    ]"
    v-bind="rest"
  >
    <slot />
  </component>
</template>
