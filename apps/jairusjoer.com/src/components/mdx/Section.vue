<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="space-y-8">
    <h2
      v-if="title"
      class="text-foreground not-prose font-headings mb-4 font-medium"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
