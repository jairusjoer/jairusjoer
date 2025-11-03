<script setup lang="ts">
import { startViewTransition } from '../../scripts/startViewTransition';
import { ref } from 'vue';

const open = ref(false);

const toggleOpen = () => {
  startViewTransition(() => {
    open.value = !open.value;
  });
};
</script>

<template>
  <div>
    <button
      class="flex w-full cursor-pointer items-start gap-1.25 text-left select-none"
      :aria-expanded="open"
      aria-controls="details-content"
      @click="toggleOpen"
    >
      <slot name="summary" />
      <span :class="['ml-auto w-5 text-center print:hidden', { 'rotate-180': open }]">▼</span>
    </button>
    <div
      id="details-content"
      v-show="open"
      class="print:!block"
      role="region"
      :aria-hidden="!open"
    >
      <slot />
    </div>
  </div>
</template>
