<script setup lang="ts">
const options = [
  {
    type: 'solid',
    title: 'hello@jairusjoer.com',
    href: 'mailto:hello@jairusjoer.com',
  },
  {
    type: 'subtle',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/jairusjoer',
  },
  {
    type: 'outlined',
    title: 'GitHub',
    href: 'https://github.com/jairusjoer',
  },
];

const buttonTypes = {
  solid: 'border bg-theme-background text-theme-foreground',
  subtle: 'border bg-background-subtle',
  outlined: 'border',
};
</script>

<template>
  <section class="flex flex-wrap gap-1 font-medium">
    <a
      v-for="{ type, title, href } in options"
      :key="title"
      :class="['rounded px-1', buttonTypes[type as keyof typeof buttonTypes]]"
      :href="href"
    >
      {{ title }}
    </a>
  </section>
</template>
