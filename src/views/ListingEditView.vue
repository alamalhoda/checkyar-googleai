<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NRadioGroup,
  NRadio,
  NDatePicker,
  NButton,
  NAlert,
  NSpin
} from 'naive-ui';
import { listingsApi } from '../api';

const route = useRoute();
const router = useRouter();

const listingId = Number(route.params.id);
const loading = ref(false);
const submitting = ref(false);
const errorMsg = ref('');

const bankName = ref('بانک ملت');
const chequeSerial = ref('');
const faceAmount = ref<number | null>(0);
const dueDate = ref<number | null>(Date.now());
const issuerType = ref<'legal' | 'natural'>('legal');
const issuerName = ref('');
const issuerNationalId = ref('');
const description = ref('');
const suggestedDiscountRate = ref('2.5');

const bankOptions = [
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک ملی ایران', value: 'بانک ملی ایران' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک صادرات ایران', value: 'بانک صادرات ایران' },
  { label: 'بانک سامان', value: 'بانک سامان' },
  { label: 'بانک پارسیان', value: 'بانک پارسیان' },
  { label: 'بانک سپه', value: 'بانک سپه' }
];

const loadListing = async () => {
  if (!listingId) return;
  loading.value = true;
  try {
    const l = await listingsApi.getListing(listingId);
    bankName.value = l.bank_name;
    chequeSerial.value = l.cheque_serial_number;
    faceAmount.value = Number(l.face_amount);
    dueDate.value = new Date(l.due_date).getTime();
    issuerType.value = l.issuer_type;
    issuerName.value = l.issuer_name;
    issuerNationalId.value = l.issuer_national_id;
    description.value = l.description;
    suggestedDiscountRate.value = l.suggested_discount_rate || '2.5';
  } catch (err) {
    console.error('Error loading listing to edit', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadListing);

const handleUpdate = async () => {
  errorMsg.value = '';
  submitting.value = true;
  try {
    const dateObj = new Date(dueDate.value || Date.now());
    const dateStr = dateObj.toISOString().split('T')[0];

    await listingsApi.updateListing(listingId, {
      bank_name: bankName.value,
      cheque_serial_number: chequeSerial.value,
      face_amount: faceAmount.value || 0,
      due_date: dateStr,
      issuer_type: issuerType.value,
      issuer_name: issuerName.value,
      issuer_national_id: issuerNationalId.value,
      description: description.value,
      suggested_discount_rate: suggestedDiscountRate.value
    });

    router.push('/listings/my');
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error?.message || err?.message || 'خطا در بروزرسانی آگهی.';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <NSpin :show="loading">
      <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div class="border-b border-slate-800 pb-4 mb-6">
          <h1 class="text-base font-bold text-slate-100">اصلاح و ارسال مجدد آگهی چک</h1>
          <p class="text-xs text-slate-400 mt-1">تغییرات لازمه را بر طبق بازخورد ناظر اعمال کنید.</p>
        </div>

        <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
          {{ errorMsg }}
        </NAlert>

        <NForm @submit.prevent="handleUpdate" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="بانک صادرکننده">
              <NSelect v-model:value="bankName" :options="bankOptions" />
            </NFormItem>

            <NFormItem label="سریال صیادی چک">
              <NInput v-model:value="chequeSerial" />
            </NFormItem>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="مبلغ اسمی (ریال)">
              <NInputNumber v-model:value="faceAmount" :step="100000000" class="w-full" />
            </NFormItem>

            <NFormItem label="تاریخ سررسید">
              <NDatePicker v-model:value="dueDate" type="date" class="w-full" />
            </NFormItem>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="نام صادرکننده">
              <NInput v-model:value="issuerName" />
            </NFormItem>

            <NFormItem label="شناسه ملی صادرکننده">
              <NInput v-model:value="issuerNationalId" />
            </NFormItem>
          </div>

          <NFormItem label="توضیحات">
            <NInput v-model:value="description" type="textarea" :rows="3" />
          </NFormItem>

          <div class="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <NButton quaternary @click="router.back()">انصراف</NButton>
            <NButton type="primary" size="large" attr-type="submit" :loading="submitting" class="font-bold">
              ذخیره تغییرات و ارسال مجدد
            </NButton>
          </div>
        </NForm>
      </NCard>
    </NSpin>
  </div>
</template>
