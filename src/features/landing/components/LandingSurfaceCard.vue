<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    highlight?: boolean;
    hoverable?: boolean;
    accentTop?: boolean;
    bg?: 'surface' | 'base';
    glass?: boolean;
    gradientBorder?: boolean;
  }>(),
  {
    highlight: false,
    hoverable: false,
    accentTop: false,
    bg: 'surface',
    glass: false,
    gradientBorder: false,
  }
);

const surfaceClasses = computed(() => {
  if (props.gradientBorder) {
    if (props.glass) return 'landing-gradient-border-glass backdrop-blur-md';
    return props.bg === 'base' ? 'landing-gradient-border-base' : 'landing-gradient-border';
  }
  if (props.glass) {
    return props.bg === 'base' ? 'landing-glass-card-base backdrop-blur-md' : 'landing-glass-card backdrop-blur-md';
  }
  return props.bg === 'base' ? 'bg-[var(--theme-bg)]' : 'bg-[var(--theme-surface)]';
});

const borderClasses = computed(() => {
  if (props.gradientBorder) return ''; // Managed by gradient border background
  if (props.highlight) {
    return 'border-emerald-500/35 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.30)]';
  }
  if (props.glass) {
    return 'border-white/10';
  }
  return 'border-[var(--theme-border)]';
});
</script>

<template>
  <div
    class="relative flex flex-col rounded-2xl border p-6 sm:p-8"
    :class="[
      surfaceClasses,
      borderClasses,
      hoverable
        ? 'transition duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[3px] hover:border-emerald-500/40 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)]'
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
