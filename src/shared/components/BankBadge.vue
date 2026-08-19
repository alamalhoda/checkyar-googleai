<script setup lang="ts">
import { computed } from 'vue';
import { BusinessOutline } from '@vicons/ionicons5';
import type { Bank, BankSummary } from '../../types/api';
import { getBankBrandColor } from '../banks/lookup';

interface Props {
  bank?: BankSummary | Bank | null;
  fallbackName?: string | null;
  theme?: 'dark' | 'light';
  size?: 'default' | 'compact';
  showName?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  bank: null,
  fallbackName: '',
  theme: 'dark',
  size: 'default',
  showName: true,
});

const isCatalogBank = computed(() => Boolean(props.bank));
const hasLogo = computed(() => Boolean(props.bank?.logo_url));

const displayName = computed(() => {
  if (props.bank?.display_name) {
    return props.bank.display_name;
  }
  return props.fallbackName?.trim() || '';
});

const bankInitial = computed(() => {
  if (props.bank?.display_name) {
    return props.bank.display_name.trim().charAt(0);
  }
  return '';
});

const brandColor = computed(() => {
  if (!props.bank) return undefined;
  return getBankBrandColor(props.bank, props.theme);
});

const fallbackInitial = computed(() => {
  const trimmed = props.fallbackName?.trim() || '';
  return trimmed ? trimmed.charAt(0) : '';
});

const markSizeClass = computed(() => {
  return props.size === 'compact'
    ? 'w-6 h-6 text-xs rounded-md'
    : 'w-9 h-9 text-sm rounded-lg';
});

const iconSizeClass = computed(() => {
  return props.size === 'compact' ? 'w-3.5 h-3.5' : 'w-5 h-5';
});

const gapClass = computed(() => {
  return props.size === 'compact' ? 'gap-1.5' : 'gap-2.5';
});

const textSizeClass = computed(() => {
  return props.size === 'compact'
    ? 'text-xs font-normal text-slate-200'
    : 'text-sm font-bold text-slate-100';
});
</script>

<template>
  <div
    class="inline-flex items-center"
    :class="gapClass"
    data-testid="bank-badge"
    :aria-label="!showName && displayName ? displayName : undefined"
    :role="!showName ? 'img' : undefined"
  >
    <!-- State 1: Catalog bank with non-null logo_url -->
    <img
      v-if="isCatalogBank && hasLogo"
      :src="props.bank?.logo_url || ''"
      :alt="showName ? '' : displayName"
      :aria-hidden="showName ? 'true' : undefined"
      :class="[markSizeClass, 'object-contain shrink-0']"
      data-testid="bank-badge-logo"
    />

    <!-- State 2: Catalog bank with logo_url === null (Initial character on brand color surface) -->
    <div
      v-else-if="isCatalogBank"
      :style="{ backgroundColor: brandColor }"
      :class="[
        markSizeClass,
        'flex items-center justify-center text-white font-bold select-none shrink-0 shadow-sm leading-none'
      ]"
      :aria-hidden="showName ? 'true' : undefined"
      data-testid="bank-badge-initial"
    >
      {{ bankInitial }}
    </div>

    <!-- State 3: Unknown / no catalog match (Neutral building icon + optional initial, no brand color) -->
    <div
      v-else
      :class="[
        markSizeClass,
        'flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 gap-0.5 select-none'
      ]"
      :aria-hidden="showName ? 'true' : undefined"
      data-testid="bank-badge-unknown"
    >
      <BusinessOutline :class="iconSizeClass" />
      <span v-if="fallbackInitial" class="text-[10px] font-bold leading-none" data-testid="bank-badge-unknown-initial">{{ fallbackInitial }}</span>
    </div>

    <!-- Display Name Label -->
    <span
      v-if="showName && displayName"
      :class="textSizeClass"
    >
      {{ displayName }}
    </span>
  </div>
</template>
