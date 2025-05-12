<script setup lang="ts">
defineProps<{
  meta: string;
  title: string;
  subtitle?: string;
  url?: string;
}>();
</script>

<template>
  <div class="relative grid break-inside-avoid sm:grid-cols-[auto_1fr] sm:gap-8">
    <div class="tabular-nums">
      <span class="absolute">{{ meta }}</span>
      <span class="invisible whitespace-nowrap">0000 — 0000</span>
    </div>
    <article>
      <h3 class="not-prose text-foreground font-headings font-medium">
        <a
          v-if="url"
          :href="url"
          target="_blank"
        >
          {{ title }}
        </a>
        <template v-else>{{ title }}</template>
      </h3>
      <span
        v-if="subtitle"
        :class="{ 'mb-4 block': $slots.default }"
      >
        {{ subtitle }}
      </span>
      <div
        v-if="$slots.default"
        class="prose prose-sm prose-theme"
      >
        <slot />
      </div>
    </article>
  </div>
</template>
