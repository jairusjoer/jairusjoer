<script setup lang="ts">
import Showcase from '@components/Showcase.vue';
import { computed } from 'vue';
import { $theme } from '@stores/content/themeStore';
import { useStore } from '@nanostores/vue';

const theme = useStore($theme);

const appliedTheme = computed(() => {
  const centerIndex = (theme.value.tokens - 1) / 2;

  return Object.fromEntries(
    Array.from({ length: theme.value.tokens }, (_, index) => {
      const token = index * 100;

      const chroma = getChroma(index, centerIndex, theme.value.tokens);

      return [
        token,
        `oklch(from var(--color-theme-raw) ${getLightness(index, theme.value.tokens)} ${getColorScale(chroma, theme.value.tokens)} h)`,
      ];
    }),
  );
});

function getChroma(index: number, centerIndex: number, tokens: number) {
  const distance = Math.abs(index - centerIndex);
  const maxDistance = Math.max(1, centerIndex);

  if (theme.value.tokens % 2 === 0) {
    return 1 + tokens * (1 - distance / maxDistance);
  }

  return 1 + (tokens - 1) * (1 - distance / maxDistance);
}

function getLightness(index: number, tokens: number) {
  return ((tokens - index) / tokens).toFixed(2);
}

function getColorScale(chroma: number, tokens: number) {
  return `calc(c * ${(chroma / tokens).toFixed(2)})`;
}

const cssVariables = computed(() => {
  return Object.entries(appliedTheme.value)
    .map(([token, value]) => `--color-theme-${token}: ${value};`)
    .join('\n');
});
</script>

<template>
  <Showcase
    :links="{
      Code: 'src/components/content/ThemePalette.vue',
    }"
  >
    <div
      :class="[
        'flex flex-wrap gap-1.5 text-center text-xs font-medium tabular-nums',
        '*:grid *:size-12 *:grow *:border *:rounded-md *:place-content-center *:px-1.5',
      ]"
      :style="cssVariables"
    >
      <div
        v-for="(_, key) in appliedTheme"
        :style="{ background: `var(--color-theme-${key})`, color: `contrast-color(var(--color-theme-${key}))` }"
      >
        {{ key }}
      </div>
    </div>
    <template #footer>
      <small class="bg-background-subtle block overflow-x-auto rounded-md">
        <pre class="overflow-x-auto p-1.5"><code>{{ cssVariables }}</code></pre>
      </small>
    </template>
  </Showcase>
</template>
