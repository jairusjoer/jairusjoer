<script setup lang="ts">
const props = defineProps<{
  title: string;
  open?: boolean;
}>();
</script>

<template>
  <details
    class="group mt-4 overflow-hidden rounded border"
    :open
  >
    <summary class="group-open:bg-background-subtle text-foreground flex cursor-pointer gap-4 p-4 leading-4 select-none">
      <span
        class="text-foreground font-headings grow truncate font-medium"
        :title="props.title"
      >
        {{ props.title }}
      </span>
      <span
        class="text-center group-open:rotate-180"
        aria-hidden="true"
      >
        ▼
      </span>
    </summary>
    <div class="px-4">
      <slot />
    </div>
  </details>
</template>
