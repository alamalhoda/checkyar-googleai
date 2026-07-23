<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton, NTag, NAlert } from 'naive-ui';
import { WalletOutline, CardOutline, CheckmarkCircleOutline } from '@vicons/ionicons5';

const iban = ref('IR980120000000001234567890');
const bankName = ref('بانک پاسارگاد');
const walletBalance = ref('۱,۲۵۰,۰۰۰,۰۰۰');
const saved = ref(false);

const handleSaveBank = () => {
  saved.value = true;
  setTimeout(() => saved.value = false, 3000);
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <NAlert v-if="saved" type="success" class="text-xs" closable>
      اطلاعات حساب بانکی شبا با موفقیت بروزرسانی شد.
    </NAlert>

    <!-- Wallet Balance Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NCard class="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-2">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <WalletOutline class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-slate-300">اعتبار امانی کیف پول</span>
        </div>
        <div class="text-2xl font-black text-slate-100 tracking-tight">{{ walletBalance }} <span class="text-xs font-normal text-slate-400">ریال</span></div>
        <span class="text-[10px] text-emerald-400 mt-1 block">آماده تخصیص تسویه امن</span>
      </NCard>

      <NCard class="bg-slate-900 border border-slate-800 rounded-2xl p-2">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CardOutline class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-slate-300">وضعیت استعلام صیادی</span>
        </div>
        <div class="text-base font-bold text-emerald-400">سفید (فاقد چک برگشتی)</div>
        <span class="text-[10px] text-slate-400 mt-1 block">بروزرسانی شده با سامانه آچارهای بانک مرکزی</span>
      </NCard>
    </div>

    <!-- IBAN & Bank Settings -->
    <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div class="border-b border-slate-800 pb-3 mb-4">
        <h2 class="text-sm font-bold text-slate-100">تنظیمات حساب بانکی و واریز و تسویه</h2>
      </div>

      <NForm @submit.prevent="handleSaveBank" class="space-y-4">
        <NFormItem label="بانک مقصد واریز">
          <NInput v-model:value="bankName" />
        </NFormItem>

        <NFormItem label="شماره شبا (IBAN)">
          <NInput v-model:value="iban" class="font-mono" />
        </NFormItem>

        <NButton type="primary" attr-type="submit" class="font-bold">
          ذخیره تغییرات حساب
        </NButton>
      </NForm>
    </NCard>
  </div>
</template>
