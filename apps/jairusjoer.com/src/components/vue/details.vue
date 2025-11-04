<script setup lang="ts">
import { startViewTransition } from '../../scripts/startViewTransition';
import { ref, useId } from 'vue';

const open = ref(false);
const uniqueId = useId();

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
      :aria-controls="uniqueId"
      @click="toggleOpen"
      title="Click to toggle details"
    >
      <slot name="summary" />
      <span
        :class="['ml-auto w-6 text-center print:hidden', { 'rotate-180': open }]"
        aria-hidden="true"
      >
        ▼
      </span>
    </button>
    <div
      :id="uniqueId"
      v-show="open"
      class="print:!block"
      role="region"
      :aria-hidden="!open"
    >
      <slot />
    </div>
  </div>
</template>
