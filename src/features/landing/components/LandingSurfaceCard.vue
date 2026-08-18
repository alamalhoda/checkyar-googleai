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
    if (props.glass) return 'landing-gradient-border-glass landing-glass-card backdrop-blur-md';
    return props.bg === 'base' ? 'landing-gradient-border-base bg-[var(--theme-bg)]' : 'landing-gradient-border bg-[var(--theme-surface)]';
  }
  if (props.glass) {
    return props.bg === 'base' ? 'landing-glass-card-base backdrop-blur-md' : 'landing-glass-card backdrop-blur-md';
  }
  return props.bg === 'base' ? 'bg-[var(--theme-bg)]' : 'bg-[var(--theme-surface)]';
});

const borderClasses = computed(() => {
  if (props.highlight) {
    return 'border-emerald-500/35 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.30)]';
  }
  if (props.glass || props.gradientBorder) {
    return 'border-white/10';
  }
  return 'border-[var(--theme-border)]';
});
</script>

<template>
  <div
    class="relative flex flex-col rounded-2xl border overflow-hidden"
    :class="[
      surfaceClasses,
      borderClasses,
      hoverable
        ? 'transition duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[3px] hover:border-emerald-500/40 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)]'
        : '',
    ]"
  >
    <!-- Top Accent Bar (3px) spanning full width -->
    <div
      v-if="accentTop"
      class="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-emerald-500 via-emerald-400/80 to-transparent z-10"
    ></div>

    <!-- Inner content wrapper with padding -->
    <div class="flex-1 flex flex-col p-6 sm:p-8">
      <slot />
    </div>
  </div>
</template>
