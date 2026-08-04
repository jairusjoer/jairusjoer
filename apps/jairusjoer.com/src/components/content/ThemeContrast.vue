<script setup lang="ts">
import Showcase from '@components/Showcase.vue';
</script>

<template>
  <Showcase>
    <div class="flex gap-1 text-center leading-12 font-medium">
      <div class="border-border/50 w-12 rounded-xl border bg-(--color-theme-raw)">
        <span style="color: contrast-color(var(--color-theme-raw))">Aa</span>
      </div>
      <div
        class="border-border/50 w-12 rounded-xl border"
        style="background: contrast-color(var(--color-theme-raw))"
      >
        <span class="text-(--color-theme-raw)">Aa</span>
      </div>
    </div>

    <template #footer>
      <p class="p-2 text-center">
        <small>
          <em>Changing the theme colour will automatically apply an appropriate contrast color</em>
        </small>
      </p>
    </template>
  </Showcase>
</template>
