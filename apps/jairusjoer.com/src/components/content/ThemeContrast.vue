<script setup lang="ts">
import Showcase from '@components/Showcase.vue';
</script>

<template>
  <Showcase>
    <div class="flex gap-1.5 text-center leading-12 font-medium">
      <div class="w-12 rounded-md border bg-(--color-accent-raw)">
        <span style="color: contrast-color(var(--color-accent-raw))">Aa</span>
      </div>
      <div
        class="w-12 rounded-md border"
        style="background: contrast-color(var(--color-accent-raw))"
      >
        <span class="text-(--color-accent-raw)">Aa</span>
      </div>
    </div>

    <template #footer>
      <p class="bg-background-subtle rounded-md p-1.5 text-center">
        <small>
          <em>Changing the theme colour will automatically apply an appropriate contrast color</em>
        </small>
      </p>
    </template>
  </Showcase>
</template>
