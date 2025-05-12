<script setup lang="ts">
import { ref } from 'vue';
import { useViewTransition } from '../composables/useViewTransition';

const { file } = defineProps<{
  title: string;
  meta?: string;
  file?: string;
}>();

const code = ref<string>('');

const tabs = ['Live', 'Code'];
const selectedTab = ref<string>(tabs[0]);

const selectTab = async (selected: string) => {
  if (selected === 'Code' && !code.value) {
    await renderCode();
  }

  useViewTransition(() => (selectedTab.value = selected));
};

const renderCode = async () => {
  if (code.value || !file) return;

  const { codeToHtml } = await import('shiki/bundle/web');
  code.value = await codeToHtml((await import(`./experiments/${file}.vue?raw`)).default, {
    lang: 'vue',
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  });
};
</script>

<template>
  <section class="bg-background-subtle grid gap-1 overflow-hidden rounded-lg border p-1">
    <header class="bg-background flex gap-4 overflow-hidden rounded px-4 py-3">
      <span class="text-foreground font-headings shrink truncate font-medium">{{ title }}</span>
      <span
        v-if="meta"
        class="whitespace-nowrap"
      >
        {{ meta }}
      </span>
      <div
        v-if="file"
        class="ml-auto flex gap-1 font-medium"
      >
        <button
          v-for="tab in tabs"
          :class="{ 'cursor-pointer rounded px-1': true, 'bg-background-subtle text-foreground': selectedTab === tab }"
          @click="() => selectTab(tab)"
        >
          {{ tab }}
        </button>
      </div>
    </header>
    <div
      v-show="selectedTab === 'Live'"
      class="relative z-10 grid aspect-video place-content-center gap-4 p-4"
    >
      <div class="dots absolute inset-0 -z-10" />
      <slot />
    </div>
    <div
      v-if="file"
      v-show="selectedTab === 'Code'"
      class="relative overflow-hidden"
    >
      <div
        v-html="code"
        class="prose prose-sm prose-theme !max-w-none"
      />
    </div>
  </section>
</template>

<style scoped>
.dots {
  background-image: radial-gradient(var(--color-border) 0.0625rem, transparent 0rem);
  background-size: 1rem 1rem;
  background-position: center;
  mask-image: radial-gradient(white, transparent);
  opacity: 0.5;
}
</style>
