<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
import { ShieldCheckmarkOutline, CheckmarkCircleOutline } from '@vicons/ionicons5';
import { listingsApi, complianceApi } from '../api';

const router = useRouter();

const bankName = ref('بانک ملت');
const chequeSerial = ref('');
const faceAmount = ref<number | null>(500000000);
const dueDate = ref<number | null>(Date.now() + 90 * 24 * 3600 * 1000);
const issuerType = ref<'legal' | 'natural'>('legal');
const issuerName = ref('');
const issuerNationalId = ref('');
const description = ref('');
const suggestedDiscountRate = ref('2.5');

const sayadVerified = ref(false);
const sayadStatusText = ref('');
const checkingSayad = ref(false);
const submitting = ref(false);
const errorMsg = ref('');

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

const checkSayadInquiry = async () => {
  if (!chequeSerial.value || chequeSerial.value.length < 8) {
    errorMsg.value = 'لطفا کد ۱۶ رقمی یا سریال صحیح صیاد را وارد کنید.';
    return;
  }
  checkingSayad.value = true;
  errorMsg.value = '';
  try {
    const res = await complianceApi.inquireSayadStatus(chequeSerial.value);
    sayadVerified.value = true;
    sayadStatusText.value = res.status_display;
  } catch (e) {
    errorMsg.value = 'خطا در استعلام صیادی از بانک مرکزی';
  } finally {
    checkingSayad.value = false;
  }
};

const handleSubmit = async () => {
  errorMsg.value = '';
  if (!chequeSerial.value || !faceAmount.value || !dueDate.value || !issuerName.value || !issuerNationalId.value) {
    errorMsg.value = 'لطفاً تمامی فیلدهای الزامی را تکمیل کنید.';
    return;
  }

  submitting.value = true;
  try {
    const dateObj = new Date(dueDate.value);
    const dateStr = dateObj.toISOString().split('T')[0];

    await listingsApi.createListing({
      bank_name: bankName.value,
      cheque_serial_number: chequeSerial.value,
      face_amount: faceAmount.value,
      due_date: dateStr,
      issuer_type: issuerType.value,
      issuer_name: issuerName.value,
      issuer_national_id: issuerNationalId.value,
      description: description.value,
      suggested_discount_rate: suggestedDiscountRate.value
    });

    router.push('/listings/my');
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error?.message || err?.message || 'خطا در ثبت آگهی چک.';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div class="border-b border-slate-800 pb-4 mb-6">
        <h1 class="text-base font-bold text-slate-100">فرم واگذاری و ثبت آگهی چک صیادی</h1>
        <p class="text-xs text-slate-400 mt-1">پس از ثبت، آگهی توسط ناظر بررسی و جهت خریداران منتشر می‌گردد.</p>
      </div>

      <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
        {{ errorMsg }}
      </NAlert>

      <NForm @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Sayad Inquiry Bar -->
        <div class="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
          <label class="text-xs font-bold text-slate-200 block">شناسه/سریال ۱۶ رقمی چک صیادی:</label>
          <div class="flex gap-2">
            <NInput
              v-model:value="chequeSerial"
              placeholder="مثلا: ۷۴۱۰۲۹۳۸۴۱"
              size="medium"
              class="font-mono"
            />
            <NButton
              secondary
              type="info"
              :loading="checkingSayad"
              @click="checkSayadInquiry"
            >
              <template #icon><ShieldCheckmarkOutline class="w-4 h-4" /></template>
              استعلام صیاد
            </NButton>
          </div>

          <div v-if="sayadVerified" class="text-xs text-emerald-400 flex items-center gap-1.5 pt-1">
            <CheckmarkCircleOutline class="w-4 h-4 shrink-0" />
            <span>{{ sayadStatusText }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="بانک صادرکننده چک *">
            <NSelect v-model:value="bankName" :options="bankOptions" />
          </NFormItem>

          <NFormItem label="مبلغ اسمی چک (ریال) *">
            <NInputNumber v-model:value="faceAmount" :step="100000000" class="w-full" />
          </NFormItem>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="تاریخ سررسید چک *">
            <NDatePicker v-model:value="dueDate" type="date" class="w-full" />
          </NFormItem>

          <NFormItem label="نرخ تنزیل پیشنهادی (ماهیانه)٪">
            <NInput v-model:value="suggestedDiscountRate" placeholder="مثال: ۲.۵" />
          </NFormItem>
        </div>

        <!-- Issuer Info -->
        <div class="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
          <div class="text-xs font-bold text-slate-200">اطلاعات صادرکننده اصلی چک</div>
          <NFormItem label="نوع صادرکننده">
            <NRadioGroup v-model:value="issuerType" class="flex gap-4">
              <NRadio value="legal">حقوقی (شرکت)</NRadio>
              <NRadio value="natural">حقیقی (شخص)</NRadio>
            </NRadioGroup>
          </NFormItem>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NFormItem label="نام صادرکننده *">
              <NInput v-model:value="issuerName" placeholder="نام شرکت یا شخص" />
            </NFormItem>

            <NFormItem label="شناسه ملی / کد ملی صادرکننده *">
              <NInput v-model:value="issuerNationalId" placeholder="۱۰ یا ۱۱ رقم" />
            </NFormItem>
          </div>
        </div>

        <NFormItem label="توضیحات و بابت فاکتور/قرارداد">
          <NInput
            v-model:value="description"
            type="textarea"
            placeholder="توضیحات تکمیلی بابت محل صدور چک، نوع معامله و ضمانت‌ها..."
            :rows="3"
          />
        </NFormItem>

        <div class="pt-2 flex justify-end gap-3 border-t border-slate-800">
          <NButton quaternary @click="router.push('/listings/my')">انصراف</NButton>
          <NButton type="primary" size="large" attr-type="submit" :loading="submitting" class="font-bold">
            ارسال جهت تایید ناظر و انتشار
          </NButton>
        </div>
      </NForm>
    </NCard>
  </div>
</template>
