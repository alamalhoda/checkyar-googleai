<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: string | number;
  unit?: string;
  changePercentage?: number;
  changeLabel?: string;
  icon?: any;
  variant?: 'emerald' | 'amber' | 'purple' | 'blue' | 'rose' | 'slate';
  subtext?: string;
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'amber':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      };
    case 'purple':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
      };
    case 'rose':
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
      };
    case 'slate':
      return {
        bg: 'bg-slate-800/40',
        border: 'border-slate-700/50',
        text: 'text-slate-300',
        badge: 'bg-slate-800 text-slate-300 border-slate-700'
      };
    case 'emerald':
    default:
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      };
  }
});
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-200">
    <!-- Top Header & Icon -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-xs font-medium text-slate-400 block mb-1">{{ title }}</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-black text-slate-100 tracking-tight font-mono">
            {{ typeof value === 'number' ? value.toLocaleString('fa-IR') : value }}
          </span>
          <span v-if="unit" class="text-xs font-bold text-slate-400">{{ unit }}</span>
        </div>
      </div>

      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
        :class="[variantClasses.bg, variantClasses.border, variantClasses.text]"
      >
        <component :is="icon" v-if="icon" class="w-5 h-5" />
        <span v-else class="text-sm font-bold">#</span>
      </div>
    </div>

    <!-- Bottom Change Badge or Subtext -->
    <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
      <div v-if="changePercentage !== undefined" class="flex items-center gap-1">
        <span
          class="px-2 py-0.5 rounded text-[11px] font-bold border"
          :class="changePercentage >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'"
        >
          {{ changePercentage >= 0 ? '+' : '' }}{{ changePercentage }}٪
        </span>
        <span class="text-[11px] text-slate-400">{{ changeLabel || 'نسبت به بازه قبل' }}</span>
      </div>

      <span v-else-if="subtext" class="text-[11px] text-slate-400 truncate">
        {{ subtext }}
      </span>
    </div>
  </div>
</template>
