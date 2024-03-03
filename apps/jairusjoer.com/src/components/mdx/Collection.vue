<script setup lang="ts">
import { getCollection, type CollectionKey } from 'astro:content';
import Artifact from './Artifact.vue';
import { computed, ref } from 'vue';

const { collection } = defineProps<{
  collection: CollectionKey;
}>();

const entries = ref(await getCollection(collection));

const sortedEntries = computed(() => {
  if (collection === 'blog') {
    return entries.value.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  }

  return entries.value.sort((a, b) => a.id.localeCompare(b.id));
});
</script>

<template>
  <section class="space-y-4">
    <Artifact
      v-for="entry in sortedEntries"
      :key="entry.id"
      :collection
      :id="entry.id"
    />
  </section>
</template>
