<script setup lang="ts">
withDefaults(
  defineProps<{
    highlight?: boolean;
    hoverable?: boolean;
    accentTop?: boolean;
    bg?: 'surface' | 'base';
  }>(),
  {
    highlight: false,
    hoverable: false,
    accentTop: false,
    bg: 'surface',
  }
);
</script>

<template>
  <div
    class="relative flex flex-col rounded-2xl border p-6 sm:p-8"
    :class="[
      bg === 'base' ? 'bg-[var(--theme-bg)]' : 'bg-[var(--theme-surface)]',
      highlight
        ? 'border-emerald-500/30 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.25)]'
        : 'border-[var(--theme-border)]',
      hoverable
        ? 'transition duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[3px] hover:border-emerald-500/40'
        : '',
    ]"
  >
    <!-- Top Accent Bar (3px) -->
    <div
      v-if="accentTop"
      class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-t-2xl"
    ></div>

    <slot />
  </div>
</template>
