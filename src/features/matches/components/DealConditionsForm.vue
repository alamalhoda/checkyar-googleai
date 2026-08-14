<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between pb-2 border-b border-slate-800">
      <h3 class="text-sm font-semibold text-slate-100 flex items-center gap-2">
        <span>فرم تنظیم شرایط معامله</span>
        <NTag size="small" type="primary">پیشرفته</NTag>
      </h3>
    </div>

    <NFormItem label="مبلغ پیشنهادی (تومان)" required>
      <NInputNumber
        v-model:value="state.amount"
        :min="1000000"
        :step="1000000"
        placeholder="مبلغ مورد نظر"
        class="w-full"
      />
    </NFormItem>

    <NFormItem label="نرخ تنزیل (درصد)">
      <NInputNumber
        v-model:value="state.discountRate"
        :min="0"
        :max="50"
        placeholder="درصد تخفیف"
        class="w-full"
      />
    </NFormItem>

    <NFormItem label="روش تسویه">
      <NSelect
        v-model:value="state.settlementMethod"
        :options="settlementOptions"
      />
    </NFormItem>

    <NFormItem label="یادداشت / پیام همراه">
      <NInput
        v-model:value="state.note"
        type="textarea"
        placeholder="توضیحات اختصاصی پیشنهاد برای طرف مقابل..."
        rows="3"
      />
    </NFormItem>

    <div class="pt-2">
      <NButton
        type="primary"
        block
        :loading="loading"
        :disabled="!state.amount"
        @click="$emit('submit')"
      >
        ارسال مستقیم پیشنهاد معامله
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NFormItem, NInputNumber, NSelect, NInput, NButton, NTag } from 'naive-ui';

defineProps<{
  state: {
    amount: number | null;
    discountRate: number;
    settlementMethod: string;
    note: string;
  };
  loading?: boolean;
}>();

defineEmits<{
  (e: 'submit'): void;
}>();

const settlementOptions = [
  { label: 'پرداخت امن (Escrow)', value: 'escrow' },
  { label: 'نقدی حضوری', value: 'cash' },
  { label: 'حواله پایا / ساتنا', value: 'bank_transfer' },
  { label: 'توافقی و شناور', value: 'flexible' }
];
</script>
