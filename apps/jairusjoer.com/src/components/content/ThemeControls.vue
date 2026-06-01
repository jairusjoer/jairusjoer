<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { $theme } from '@stores/content/themeStore';
import { onMounted } from 'vue';

const theme = useStore($theme);

function onColorInput(event?: InputEvent) {
  if (event) {
    const value = (event.target as HTMLInputElement).value;

    $theme.setKey('color', value);
  }

  document.documentElement.style.setProperty('--color-accent-raw', theme.value.color);
  document.documentElement.style.setProperty(
    '--color-accent',
    `light-dark(
      oklch(from var(--color-accent-raw) 0.5 c h),
      oklch(from var(--color-accent-raw) 0.75 c h)
    )`,
  );
}

function onTokensInput(event: InputEvent) {
  const value = (event.target as HTMLInputElement).value;

  $theme.setKey('tokens', Number(value));
}

onMounted(() => onColorInput());
</script>

<template>
  <form class="not-prosa bg-background sticky top-6 z-10 flex gap-1.5 rounded-xl border p-1.5">
    <div class="bg-background-subtle flex gap-1.5 rounded-md p-1.5">
      <input
        type="color"
        id="color"
        :value="theme.color"
        @input="onColorInput"
      />
      <label for="color">
        <span class="text-foreground font-semibold">Colour:</span>{{ ' ' }}
        <small class="ml-auto font-mono">{{ theme.color }}</small>
      </label>
    </div>
    <div class="bg-background-subtle flex grow gap-1.5 rounded-md p-1.5">
      <label for="tokens">
        <span class="text-foreground font-semibold">Tokens:</span>{{ ' ' }}
        <small class="ml-auto inline-block min-w-6 text-center font-mono">{{ theme.tokens }}</small>
      </label>
      <input
        class="accent-accent grow"
        type="range"
        name="tokens"
        step="1"
        min="1"
        max="24"
        @input="onTokensInput"
      />
    </div>
  </form>
</template>
