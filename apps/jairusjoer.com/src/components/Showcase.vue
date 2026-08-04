<script setup lang="ts">
import Button from './Button.vue';

export interface Props {
  links?: Record<string, string>;
}

const { links } = defineProps<Props>();
</script>

<template>
  <section class="not-prose relative overflow-hidden rounded-lg border">
    <header v-if="links && Object.entries(links).length > 0">
      <small class="flex justify-end gap-1 px-1 pt-1">
        <Button
          v-for="(path, label) in links"
          variant="subtle"
          :href="`https://github.com/jairusjoer/jairusjoer.com/blob/main/${path}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ label }}
        </Button>
      </small>
    </header>

    <div class="grid place-content-center overflow-hidden px-1 py-12">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="bg-background-subtle m-1 space-y-1 rounded-sm"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
