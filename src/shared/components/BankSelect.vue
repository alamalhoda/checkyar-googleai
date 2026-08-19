<script setup lang="ts">
import { computed, onMounted, h } from 'vue';
import { NSelect, NIcon, type SelectOption } from 'naive-ui';
import { BusinessOutline } from '@vicons/ionicons5';
import { useBanksCatalog } from '../banks/useBanksCatalog';
import { findBankByCode } from '../banks/lookup';
import BankBadge from './BankBadge.vue';

interface Props {
  value?: string | null;
  modelValue?: string | null;
  allowAll?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
  filterable?: boolean;
  clearable?: boolean;
  dataTestid?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  modelValue: null,
  allowAll: false,
  disabled: false,
  size: 'medium',
  placeholder: 'انتخاب بانک',
  filterable: true,
  clearable: true,
  dataTestid: 'bank-select'
});

const emit = defineEmits<{
  (e: 'update:value', value: string | null): void;
  (e: 'update:modelValue', value: string | null): void;
  (e: 'change', value: string | null): void;
}>();

const { banks, loading, fetchBanks } = useBanksCatalog();

onMounted(() => {
  fetchBanks();
});

const selectedValue = computed({
  get: () => (props.value !== undefined && props.value !== null ? props.value : (props.modelValue !== undefined ? props.modelValue : null)),
  set: (val: string | null) => {
    emit('update:value', val);
    emit('update:modelValue', val);
    emit('change', val);
  }
});

const options = computed<SelectOption[]>(() => {
  const list: SelectOption[] = [];
  if (props.allowAll) {
    list.push({
      label: 'همه بانک‌ها',
      value: ''
    });
  }

  for (const b of banks.value) {
    list.push({
      label: b.display_name,
      value: b.code
    });
  }

  return list;
});

function renderOptionLabel(option: SelectOption) {
  if (!option.value) {
    return h('div', { class: 'flex items-center gap-2 py-0.5 text-slate-300 text-xs font-sans' }, [
      h(NIcon, { size: 16, class: 'text-slate-400 shrink-0' }, { default: () => h(BusinessOutline) }),
      h('span', null, option.label as string)
    ]);
  }

  const bankSummary = findBankByCode(option.value as string);
  return h('div', { class: 'flex items-center gap-2 py-0.5' }, [
    h(BankBadge, {
      bank: bankSummary || null,
      fallbackName: option.label as string,
      size: 'compact',
      theme: 'dark'
    })
  ]);
}
</script>

<template>
  <NSelect
    v-model:value="selectedValue"
    :options="options"
    :loading="loading"
    :disabled="disabled || loading"
    :size="size"
    :placeholder="placeholder"
    :filterable="filterable"
    :clearable="clearable"
    :render-label="renderOptionLabel"
    :data-testid="($attrs['data-testid'] as string) || props.dataTestid || 'bank-select'"
    class="font-sans"
  />
</template>
