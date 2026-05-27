<script setup lang="ts">
import { onMounted, ref } from 'vue';

const color = ref('#00bc7d');

function onColorInput(value: string = color.value) {
  document.documentElement.style.setProperty('--color-accent-raw', value);
  document.documentElement.style.setProperty(
    '--color-accent',
    `light-dark(
      oklch(from var(--color-accent-raw) 0.5 c h),
      oklch(from var(--color-accent-raw) 0.75 c h)
    )`,
  );
}

onMounted(() => {
  onColorInput();
});
</script>

<template>
  <section class="not-prosa bg-background-subtle sticky top-6 z-10 flex items-center gap-1.5 rounded-xl border p-3">
    <input
      type="color"
      id="color"
      v-model="color"
      @input="() => onColorInput()"
    />
    <label
      class="text-foreground font-semibold"
      for="color"
    >
      Theme colour
    </label>
    <small class="ml-auto font-mono">{{ color }}</small>
  </section>
</template>
