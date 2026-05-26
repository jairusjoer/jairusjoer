<script setup lang="ts">
import Button from '@components/Button.vue';
import Showcase from '@components/Showcase.vue';
import { computed, ref } from 'vue';

const length = ref(11);

const appliedTheme = computed(() => {
  const count = length.value;
  const isEven = count % 2 === 0;
  const centerIndex = (count - 1) / 2;
  const half = count / 2;

  const baseTokens = getBaseTokens(centerIndex, isEven);

  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const token = index * 100;
      const sourceToken = getSourceToken(token, index, centerIndex, isEven, baseTokens);
      const chroma = getChroma(index, centerIndex, half, isEven);

      return [token, `oklch(from var(${sourceToken}) ${getLightness(index, count)} ${getColorScale(chroma, half)} h)`];
    }),
  );
});

function getBaseTokens(centerIndex: number, isEven: boolean) {
  const left = Math.floor(centerIndex) * 100;

  return isEven ? [left, left + 100] : [left || 0];
}

function getSourceToken(token: number, index: number, centerIndex: number, isEven: boolean, baseTokens: number[]) {
  if (baseTokens.includes(token)) {
    return '--color-theme';
  }

  const nearestBase = isEven ? (index < centerIndex ? baseTokens[0] : baseTokens[1]) : baseTokens[0];

  return `--color-theme-${nearestBase}`;
}

function getChroma(index: number, centerIndex: number, half: number, isEven: boolean) {
  if (isEven) {
    return half - Math.abs(index - centerIndex) + 0.5;
  }

  const distance = Math.abs(index - centerIndex);
  const maxDistance = Math.max(1, centerIndex);

  return 1 + (half - 1) * (1 - distance / maxDistance);
}

function getLightness(index: number, count: number) {
  return `calc(${count - index} / ${count + 1})`;
}

function getColorScale(chroma: number, half: number) {
  return `calc(c * ${chroma} / ${half})`;
}

const cssVariables = computed(() => {
  return Object.entries(appliedTheme.value)
    .map(([token, value]) => `--color-theme-${token}: ${value};`)
    .join('\n');
});

async function onCopyClick() {
  await navigator.clipboard.writeText(cssVariables.value);
}
</script>

<template>
  <Showcase
    ref="theme"
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
        :style="{ background: `var(--color-theme-${key})`, color: `contrast-color(var(--color-theme-${key}))` }"
      >
        <div
          v-if="getBaseTokens((length - 1) / 2, length % 2 === 0).includes(Number(key))"
          class="mx-auto -mb-2 size-2 rounded-full bg-current"
        />
        <span class="mt-2">{{ key }}</span>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <label
          class="text-foreground font-semibold"
          for="length"
        >
          Tokens
        </label>
        <small class="font-mono">{{ length }}</small>
      </div>
      <div class="flex gap-3">
        <input
          class="accent-accent w-full"
          type="range"
          id="length"
          step="1"
          min="1"
          max="24"
          v-model.number="length"
        />
        <Button
          class="border whitespace-nowrap"
          @click="onCopyClick"
        >
          Copy Palette
        </Button>
      </div>
    </template>
  </Showcase>
</template>
