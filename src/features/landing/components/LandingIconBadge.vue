<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'emerald' | 'muted' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    variant: 'emerald',
    size: 'md',
  }
);
</script>

<template>
  <div
    class="shrink-0 flex items-center justify-center font-bold"
    :class="[
      size === 'sm' ? 'h-7 w-7 rounded-lg text-xs' : size === 'lg' ? 'h-12 w-12 rounded-2xl text-base' : 'h-10 w-10 rounded-xl text-sm',
      variant === 'emerald'
        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
        : variant === 'danger'
        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        : 'bg-[var(--theme-surface-muted)] border border-[var(--theme-border-subtle)] text-[var(--theme-text-muted)]',
    ]"
  >
    <slot />
  </div>
</template>
