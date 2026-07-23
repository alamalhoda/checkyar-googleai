<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NForm, NFormItem, NInput, NSelect, NInputNumber, NDatePicker,
  NButton, NAlert, NSpin, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { listingsApi } from '../../api';
import type { ChequeListing, IssuerType } from '../../types/api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const listingId = computed(() => Number(route.params.id));
const listing = ref<ChequeListing | null>(null);

const loading = ref(true);
const saving = ref(false);
const errorMsg = ref('');
const showConfirmModal = ref(false);

// Form fields
const bankName = ref('بانک سامان');
const chequeSerialNumber = ref('');
const faceAmount = ref<number | null>(0);
const dueDateTimestamp = ref<number | null>(Date.now());
const issuerType = ref<IssuerType>('legal');
const issuerName = ref('');
const issuerNationalId = ref('');
const description = ref('');
const suggestedDiscountRate = ref('2.5');

const bankOptions = [
  { label: 'بانک سامان', value: 'بانک سامان' },
  { label: 'بانک ملی ایران', value: 'بانک ملی ایران' },
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک صادرات ایران', value: 'بانک صادرات ایران' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک پارسیان', value: 'بانک پارسیان' },
  { label: 'بانک آینده', value: 'بانک آینده' },
  { label: 'بانک سپه', value: 'بانک سپه' }
];

const issuerTypeOptions = [
  { label: 'شخص حقوقی (شرکت / سازمان)', value: 'legal' },
  { label: 'شخص حقیقی', value: 'natural' }
];

const loadListing = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await listingsApi.getListing(listingId.value);
    listing.value = res;

    // Check permissions / editable status
    if (res.status !== 'pending_moderation' && res.status !== 'rejected') {
      errorMsg.value = 'ویرایش آگهی تنها در وضعیت «در انتظار بررسی» یا «رد شده» امکان‌پذیر است.';
      return;
    }

    bankName.value = res.bank_name;
    chequeSerialNumber.value = res.cheque_serial_number;
    faceAmount.value = Number(res.face_amount);
    dueDateTimestamp.value = new Date(res.due_date).getTime();
    issuerType.value = res.issuer_type;
    issuerName.value = res.issuer_name;
    issuerNationalId.value = res.issuer_national_id;
    description.value = res.description;
    suggestedDiscountRate.value = res.suggested_discount_rate || '2.5';
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت اطلاعات آگهی.';
  } finally {
    loading.value = false;
  }
};

const triggerSave = () => {
  errorMsg.value = '';
  // Validate
  if (!chequeSerialNumber.value || chequeSerialNumber.value.trim().length !== 16) {
    errorMsg.value = 'شماره صیادی باید دقیقاً ۱۶ رقم عددی باشد.';
    return;
  }
  if (!faceAmount.value || faceAmount.value <= 0) {
    errorMsg.value = 'مبلغ اسمی چک باید بزرگتر از صفر باشد.';
    return;
  }
  showConfirmModal.value = true;
};

const handleSave = async () => {
  showConfirmModal.value = false;
  saving.value = true;
  errorMsg.value = '';

  try {
    const formattedDueDate = dueDateTimestamp.value
      ? new Date(dueDateTimestamp.value).toISOString().split('T')[0]
      : undefined;

    await listingsApi.updateListing(listingId.value, {
      bank_name: bankName.value,
      cheque_serial_number: chequeSerialNumber.value,
      face_amount: faceAmount.value || 0,
      due_date: formattedDueDate,
      issuer_type: issuerType.value,
      issuer_name: issuerName.value,
      issuer_national_id: issuerNationalId.value,
      description: description.value,
      suggested_discount_rate: suggestedDiscountRate.value
    });

    message.success('اصلاحات آگهی با موفقیت ثبت شد.');
    router.push(`/listings/${listingId.value}`);
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در بروزرسانی آگهی.';
  } finally {
    saving.value = false;
  }
};

onMounted(loadListing);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <NButton secondary size="small" @click="router.back()">← انصراف</NButton>
            <div>
              <h1 class="text-2xl font-black text-slate-100">ویرایش آگهی چک</h1>
              <p class="text-xs text-slate-400 mt-1">شناسه آگهی: #{{ listingId }}</p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <!-- Non-editable or Error State -->
        <NAlert v-else-if="errorMsg" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <NCard v-else class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <NForm label-placement="top" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="نوع صادرکننده">
                <NSelect v-model:value="issuerType" :options="issuerTypeOptions" />
              </NFormItem>

              <NFormItem label="نام صادرکننده">
                <NInput v-model:value="issuerName" placeholder="نام یا عنوان صادرکننده" />
              </NFormItem>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="شناسه/کد ملی صادرکننده">
                <NInput v-model:value="issuerNationalId" placeholder="کد ملی ۱۰ رقمی یا شناسه ۱۱ رقمی" />
              </NFormItem>

              <NFormItem label="بانک صادرکننده">
                <NSelect v-model:value="bankName" :options="bankOptions" />
              </NFormItem>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="شماره صیادی (۱۶ رقم)">
                <NInput v-model:value="chequeSerialNumber" maxlength="16" placeholder="1234567890123456" />
              </NFormItem>

              <NFormItem label="مبلغ اسمی چک (ریال)">
                <NInputNumber v-model:value="faceAmount" :min="100000" class="w-full" />
              </NFormItem>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NFormItem label="تاریخ سررسید">
                <NDatePicker v-model:value="dueDateTimestamp" type="date" class="w-full" />
              </NFormItem>

              <NFormItem label="نرخ تنزیل پیشنهادی (٪)">
                <NInput v-model:value="suggestedDiscountRate" placeholder="مثلا: 2.5" />
              </NFormItem>
            </div>

            <NFormItem label="توضیحات آگهی">
              <NInput v-model:value="description" type="textarea" :rows="3" />
            </NFormItem>

            <div class="flex justify-end pt-4 border-t border-slate-800 gap-3">
              <NButton secondary @click="router.back()">انصراف</NButton>
              <NButton type="primary" :loading="saving" @click="triggerSave" class="font-bold">
                ذخیره تغییرات آگهی
              </NButton>
            </div>
          </NForm>
        </NCard>
      </main>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showConfirmModal"
      title="ویرایش آگهی چک"
      message="آیا از ثبت اصلاحات بر روی این آگهی اطمینان دارید؟ با ویرایش آگهی، وضعیت آن مجدداً به «در انتظار بررسی» تغییر خواهد یافت."
      confirm-text="ذخیره و ارسال"
      :loading="saving"
      @confirm="handleSave"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
