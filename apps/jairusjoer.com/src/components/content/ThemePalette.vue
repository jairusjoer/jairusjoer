<script setup lang="ts">
import Showcase from '@components/Showcase.vue';
import { computed, ref } from 'vue';
import { $theme } from '@stores/content/themeStore';
import { useStore } from '@nanostores/vue';
import Button from '@components/Button.vue';

const theme = useStore($theme);

const verbose = ref(true);

const appliedTheme = computed(() => {
  const isEven = theme.value.tokens % 2 === 0;
  const centerIndex = (theme.value.tokens - 1) / 2;
  const half = theme.value.tokens / 2;

  return Object.fromEntries(
    Array.from({ length: theme.value.tokens }, (_, index) => {
      const token = index * 100;

      const chroma = getChroma(index, centerIndex, half, isEven);

      return [
        token,
        `oklch(from var(--color-accent-raw) ${getLightness(index, theme.value.tokens)} ${getColorScale(chroma, half)} h)`,
      ];
    }),
  );
});

function getChroma(index: number, centerIndex: number, half: number, isEven: boolean) {
  if (isEven) {
    return half - Math.abs(index - centerIndex) + 0.5;
  }

  const distance = Math.abs(index - centerIndex);
  const maxDistance = Math.max(1, centerIndex);

  return 1 + (half - 1) * (1 - distance / maxDistance);
}

function getLightness(index: number, tokens: number) {
  if (verbose.value) {
    return `calc(${tokens - index} / ${tokens})`;
  }

  return ((tokens - index) / tokens).toFixed(3);
}

function getColorScale(chroma: number, half: number) {
  if (verbose.value) {
    return `calc(c * ${chroma.toFixed(3)} / ${half})`;
  }

  return `calc(c * ${(chroma / half).toFixed(3)})`;
}

const cssVariables = computed(() => {
  return Object.entries(appliedTheme.value)
    .map(([token, value]) => `--color-accent-${token}: ${value};`)
    .join('\n');
});

async function onCopyClick() {
  await navigator.clipboard.writeText(cssVariables.value);
}
</script>

<template>
  <Showcase
    :links="{
      Code: 'src/components/content/ThemePalette.vue',
    }"
  >
    <div
      :class="[
        'flex flex-wrap overflow-hidden rounded-md border text-center text-xs font-semibold tabular-nums',
        '*:grid *:size-12 *:grow *:place-content-center *:px-1.5',
      ]"
      :style="cssVariables"
    >
      <div
        v-for="(_, key) in appliedTheme"
        :style="{ background: `var(--color-accent-${key})`, color: `contrast-color(var(--color-accent-${key}))` }"
      >
        {{ key }}
      </div>
    </div>
    <template #footer>
      <div class="bg-background-subtle flex justify-between rounded-md p-1.5">
        <label class="text-foreground flex gap-1.5 font-semibold">
          <input
            class="border"
            type="checkbox"
            name="verbose"
            v-model="verbose"
          />
          <span>Verbose</span>
        </label>
        <Button @click="onCopyClick">Copy</Button>
      </div>
      <small class="bg-background-subtle block overflow-x-auto rounded-md">
        <pre class="overflow-x-auto p-1.5"><code>{{ cssVariables }}</code></pre>
      </small>
    </template>
  </Showcase>
</template>
