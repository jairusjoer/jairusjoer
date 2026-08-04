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

  document.documentElement.style.setProperty('--color-theme-raw', theme.value.color);
  document.documentElement.style.setProperty(
    '--color-theme',
    `light-dark(
      oklch(from var(--color-theme-raw) 0.5 c h),
      oklch(from var(--color-theme-raw) 0.75 c h)
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
  <form class="not-prose bg-background flex gap-1 rounded-lg border p-1">
    <div class="bg-background-subtle flex gap-1 rounded-sm p-2">
      <input
        type="color"
        id="color"
        :value="theme.color"
        @input="onColorInput"
      />
      <label for="color">
        <span class="text-foreground font-medium">Colour:</span>{{ ' ' }}
        <small class="ml-auto font-mono">{{ theme.color }}</small>
      </label>
    </div>
    <div class="bg-background-subtle flex grow gap-1 rounded-sm p-2">
      <label for="tokens">
        <span class="text-foreground font-medium">Tokens:</span>{{ ' ' }}
        <small class="ml-auto inline-block min-w-6 text-center font-mono">{{ theme.tokens }}</small>
      </label>
      <input
        class="grow accent-(--color-theme)"
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
