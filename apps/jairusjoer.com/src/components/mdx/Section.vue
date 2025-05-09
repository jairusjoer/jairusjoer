<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <section class="break-inside-avoid space-y-8">
    <h2
      v-if="title"
      class="text-foreground not-prose mb-4 font-medium"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>
