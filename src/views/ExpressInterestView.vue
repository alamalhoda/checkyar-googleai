<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert, NSpin } from 'naive-ui';
import { matchesApi, marketplaceApi } from '../api';
import type { SettlementType, MarketplaceListing } from '../types/api';

const route = useRoute();
const router = useRouter();

const listingId = Number(route.params.listingId);
const listing = ref<MarketplaceListing | null>(null);

const settlementType = ref<SettlementType>('escrow');
const message = ref('با سلام، اینجانب آماده خرید این چک صیادی با شرایط اعلامی هستم.');
const loading = ref(false);
const submitting = ref(false);
const errorMsg = ref('');

const settlementOptions = [
  { label: 'تسویه امانی (Escrow) - امن‌ترین روش پلتفرم', value: 'off_platform' ? 'escrow' : 'escrow' },
  { label: 'تسویه حضوری و خارج از پلتفرم (Off Platform)', value: 'off_platform' },
  { label: 'دفتر کل دفتر اسناد رسمی (Principal Ledger)', value: 'principal_ledger' }
];

const loadListing = async () => {
  if (!listingId) return;
  loading.value = true;
  try {
    listing.value = await marketplaceApi.getListingDetail(listingId);
  } catch (err) {
    console.error('Failed to load listing for match', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadListing);

const handleSubmit = async () => {
  errorMsg.value = '';
  submitting.value = true;
  try {
    await matchesApi.createMatch({
      listing_id: listingId,
      message: message.value,
      settlement_type: settlementType.value
    });
    router.push('/matches');
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error?.message || err?.message || 'خطا در ثبت ابراز تمایل.';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <NSpin :show="loading">
      <NCard v-if="listing" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div class="border-b border-slate-800 pb-4 mb-6">
          <h1 class="text-base font-bold text-slate-100">فرم ابراز تمایل و پیشنهاد خرید چک</h1>
          <p class="text-xs text-slate-400 mt-1">
            ارسال درخواست خرید برای چک {{ listing.bank_name }} به مبلغ {{ listing.face_amount }} ریال
          </p>
        </div>

        <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
          {{ errorMsg }}
        </NAlert>

        <NForm @submit.prevent="handleSubmit" class="space-y-4">
          <NFormItem label="روش تسویه پیشنهادی">
            <NSelect v-model:value="settlementType" :options="settlementOptions" />
          </NFormItem>

          <NFormItem label="پیام و شرایط پیشنهادی شما به دارنده چک">
            <NInput
              v-model:value="message"
              type="textarea"
              placeholder="توضیحات مربوط به نحوه پرداخت و هماهنگی انتقال صیاد..."
              :rows="4"
            />
          </NFormItem>

          <div class="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <NButton quaternary @click="router.back()">انصراف</NButton>
            <NButton type="primary" size="large" attr-type="submit" :loading="submitting" class="font-bold">
              ارسال پیشنهاد برای دارنده چک
            </NButton>
          </div>
        </NForm>
      </NCard>
    </NSpin>
  </div>
</template>
