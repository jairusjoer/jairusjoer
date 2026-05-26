<script setup lang="ts">
import Showcase from '@components/Showcase.vue';
</script>

<template>
  <Showcase>
    <div class="flex gap-1 text-center leading-12 font-semibold">
      <div class="w-12 rounded-md border bg-(--color-theme)">
        <span style="color: contrast-color(var(--color-theme))">Aa</span>
      </div>
      <div
        class="w-12 rounded-md border"
        style="background: contrast-color(var(--color-theme))"
      >
        <span class="text-(--color-theme)">Aa</span>
      </div>
    </div>
  </Showcase>
</template>
