<script setup lang="ts">
import type { GetImageResult } from 'astro';
import { getImage } from 'astro:assets';
import { getEntry, type CollectionKey } from 'astro:content';
import { ref } from 'vue';

const { collection, id } = defineProps<{
  collection: Exclude<CollectionKey, 'site'>;
  id: string;
}>();

const entry = ref(await getEntry(collection, id));
const image = ref<GetImageResult>();

if (entry.value?.data.image) {
  image.value = await getImage({
    src: entry.value.data.image,
    width: 256,
    height: 144,
    format: 'avif',
  });
}
</script>

<template>
  <article
    v-if="entry"
    class="group not-prose relative"
  >
    <div class="border-background-subtle flex overflow-hidden rounded border">
      <div class="relative hidden w-32 shrink-0 sm:block">
        <img
          v-if="image"
          class="absolute inset-0 size-full object-cover"
          :src="image.src"
          alt=""
          width="256"
          height="144"
        />
        <div
          v-else
          class="pointer-events-none h-18.5 p-2 select-none"
        >
          <div
            class="space-y-2 font-mono text-[0.5rem] leading-4 italic"
            v-html="entry.body?.substring(0, 150)"
          ></div>
        </div>
      </div>
      <div class="bg-background-subtle grow overflow-hidden p-4">
        <h4 class="text-foreground font-headings truncate font-medium">{{ entry.data.title }}</h4>
        <time
          v-if="'date' in entry.data"
          :datetime="entry.data.date.toISOString()"
        >
          {{ entry.data.date.toLocaleDateString(undefined, { dateStyle: 'long' }) }}
        </time>
      </div>
    </div>
    <a
      class="absolute inset-0 rounded"
      :href="`/${entry.id}`"
      :title="entry.data.title"
      :aria-label="entry.data.title"
    />
  </article>
</template>

<style scoped>
article :deep(p:first-child img) {
  height: 5rem;
  object-fit: cover;
  min-width: calc(100% + 1rem);
  margin: -0.5rem;
}

article :deep(p:not(:first-child) img) {
  border-radius: 0.25rem;
}
</style>
