<script setup lang="ts">
import Button from './Button.vue';

export interface Props {
  links?: Record<string, string>;
}

const { links } = defineProps<Props>();
</script>

<template>
  <section class="not-prosa relative overflow-hidden rounded-xl border">
    <header v-if="links && Object.entries(links).length > 0">
      <small class="flex justify-end gap-1 px-1.5 pt-1.5">
        <Button
          v-for="(path, label) in links"
          :href="`https://github.com/jairusjoer/jairusjoer.com/blob/main/${path}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ label }}
        </Button>
      </small>
    </header>

    <div class="grid place-content-center overflow-hidden px-3 py-12">
      <slot />
    </div>

    <footer
      v-if="$slots.footer"
      class="bg-background-subtle border-t p-3"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
