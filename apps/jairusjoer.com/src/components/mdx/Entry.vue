<script setup lang="ts">
defineProps<{
  meta: string;
  title: string;
  subtitle?: string;
  url?: string;
}>();
</script>

<template>
  <div class="relative grid sm:grid-cols-[6rem_1fr] sm:gap-8">
    <span>{{ meta }}</span>
    <article>
      <h3 class="not-prose text-foreground font-medium">
        <a
          v-if="url"
          class="underline"
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
