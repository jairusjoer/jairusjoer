<script setup lang="ts">
import { computed, ref } from 'vue';

const options = [
  {
    type: 'solid',
    title: 'hello@jairusjoer.com',
    href: 'mailto:hello@jairusjoer.com',
  },
  {
    type: 'subtle',
    title: 'LinkedIn',
    href: 'https://linkedin.com/in/jairusjoer',
  },
  {
    type: 'outlined',
    title: 'GitHub',
    href: 'https://github.com/jairusjoer',
  },
];

const buttonTypes = {
  solid: 'bg-theme-background text-theme-foreground border-r',
  subtle: 'bg-background-subtle',
  outlined: '',
};

const copyState = ref<boolean | null>(null);

const copyEmail = async () => {
  await navigator.clipboard.writeText('hello@jairusjoer.com');
  try {
    copyState.value = true;
  } catch (error) {
    copyState.value = false;
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    copyState.value = null;
  }
};

const copyIcon = computed(() => {
  switch (copyState.value) {
    case true:
      return '✅';
    case false:
      return '❌';
    default:
      return '📋';
  }
});
</script>

<template>
  <section class="flex flex-wrap gap-1 font-medium">
    <div
      v-for="{ type, title, href } in options"
      class="flex rounded border"
    >
      <a
        :key="title"
        :class="['block rounded px-1 leading-6', buttonTypes[type as keyof typeof buttonTypes]]"
        :href="href"
      >
        {{ title }}
      </a>
      <button
        v-if="type === 'solid'"
        class="size-6 cursor-pointer"
        title="Copy E-Mail"
        @click="copyEmail"
      >
        {{ copyIcon }}
      </button>
    </div>
  </section>
</template>
