<script setup lang="ts">
const props = defineProps<{
  equation: string;
}>();

const number = (value: string | number, type: string = 'neutral') => {
  const style = {
    positive: 'text-green-800 bg-green-100 dark:text-green-100 dark:bg-green-800',
    neutral: 'text-neutral-800 bg-neutral-100 dark:text-neutral-100 dark:bg-neutral-800',
    negative: 'text-red-800 bg-red-100 dark:text-red-100 dark:bg-red-800',
  };

  return `<span class="inline-block ${style[type as keyof typeof style]} rounded px-1">${value}</span>`;
};

const parts = props.equation.split(' ');

const render = parts.map((part, index) => {
  if (parseInt(part) || part == '0') {
    const initial = parseInt(parts[0]);
    const previous = parts[index - 1];
    const current = parseInt(part);

    switch (previous) {
      case '+':
      case 'x':
      case '*':
        if (current < 0) return number(current, 'negative');
        if (current == 0) return number(current);

        return number(current, 'positive');

      case '-':
      case '/':
      case ':':
        if (current == 0) return number(current);

        return number(current, 'negative');

      // Result
      case '=':
        if (initial > current) return number(current, 'negative');
        if (initial < current) return number(current, 'positive');

        return number(current);

      default:
        return number(current);
    }
  }

  return part;
});
</script>

<template>
  <div
    class="font-medium tabular-nums"
    style="font-feature-settings: 'case'"
    v-html="render.join(' ')"
  ></div>
</template>
