<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NSteps, NStep, NForm, NFormItem, NInput, NSelect, NInputNumber,
  NDatePicker, NButton, NAlert, NUpload, NUploadDragger, NIcon, NText, NDivider,
  useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import { listingsApi } from '../../api';
import type { IssuerType } from '../../types/api';

const router = useRouter();
const message = useMessage();

const currentStep = ref(1);
const loading = ref(false);
const errorMsg = ref('');

// Step 1: Issuer Profile
const issuerType = ref<IssuerType>('legal');
const issuerName = ref('');
const issuerNationalId = ref('');

// Step 2: Cheque & Facility Details
const bankName = ref('بانک سامان');
const chequeSerialNumber = ref('');
const faceAmount = ref<number | null>(500000000);
const dueDateTimestamp = ref<number | null>(Date.now() + 30 * 24 * 3600 * 1000);
const description = ref('');
const suggestedDiscountRate = ref('2.5');

// Step 3: Documents
const uploadedFiles = ref<any[]>([]);

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

const validateStep1 = (): boolean => {
  errorMsg.value = '';
  if (!issuerName.value.trim()) {
    errorMsg.value = 'لطفاً نام صادرکننده چک را وارد نمایید.';
    return false;
  }
  if (!issuerNationalId.value.trim()) {
    errorMsg.value = 'لطفاً شناسه/کد ملی صادرکننده را وارد کنید.';
    return false;
  }
  return true;
};

const validateStep2 = (): boolean => {
  errorMsg.value = '';
  if (!bankName.value) {
    errorMsg.value = 'لطفاً بانک صادرکننده را انتخاب کنید.';
    return false;
  }

  // Validate cheque serial number: exactly 16 digits
  const cleanSerial = chequeSerialNumber.value.trim();
  if (!/^\d{16}$/.test(cleanSerial)) {
    errorMsg.value = 'شماره صیادی چک باید دقیقاً ۱۶ رقم عددی باشد.';
    return false;
  }

  // Validate face_amount > 0
  if (!faceAmount.value || faceAmount.value <= 0) {
    errorMsg.value = 'مبلغ اسمی چک باید بزرگتر از صفر باشد.';
    return false;
  }

  // Validate due_date in future
  if (!dueDateTimestamp.value || dueDateTimestamp.value <= Date.now()) {
    errorMsg.value = 'تاریخ سررسید چک باید در آینده باشد.';
    return false;
  }

  return true;
};

const goToNextStep = () => {
  if (currentStep.value === 1) {
    if (validateStep1()) currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (validateStep2()) currentStep.value = 3;
  }
};

const goToPrevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = async () => {
  if (!validateStep1() || !validateStep2()) return;

  errorMsg.value = '';
  loading.value = true;

  try {
    const formattedDueDate = new Date(dueDateTimestamp.value!).toISOString().split('T')[0];

    const created = await listingsApi.createListing({
      issuer_type: issuerType.value,
      issuer_name: issuerName.value,
      issuer_national_id: issuerNationalId.value,
      bank_name: bankName.value,
      cheque_serial_number: chequeSerialNumber.value.trim(),
      face_amount: String(faceAmount.value),
      due_date: formattedDueDate,
      description: description.value,
      suggested_discount_rate: suggestedDiscountRate.value
    });

    // Upload documents if any provided
    for (const fileItem of uploadedFiles.value) {
      await listingsApi.uploadDocument(created.id, 'cheque_image', fileItem.name || 'cheque.pdf');
    }

    message.success('آگهی چک با موفقیت ثبت شد و در صف بررسی ناظر قرار گرفت.');
    router.push(`/listings/${created.id}`);
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در ثبت آگهی چک.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="border-b border-slate-800 pb-4">
          <h1 class="text-2xl font-black text-slate-100">ثبت آگهی جدید چک صیادی</h1>
          <p class="text-xs text-slate-400 mt-1">فرآیند ۳ مرحله‌ای ثبت مشخصات، اطلاعات صیادی و مدارک جهت فروش چک</p>
        </div>

        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-2">
          <!-- Naive UI Steps Wizard -->
          <NSteps :current="currentStep" class="mb-8">
            <NStep title="مشخصات صادرکننده" description="نوع و شناسه صادرکننده" />
            <NStep title="اطلاعات چک و تسهیلات" description="مبلغ، سررسید و شماره صیادی" />
            <NStep title="مدارک و تایید نهایی" description="تصویر چک و ثبت نهایی" />
          </NSteps>

          <NAlert v-if="errorMsg" type="error" class="mb-6 text-xs" closable @close="errorMsg = ''">
            {{ errorMsg }}
          </NAlert>

          <!-- Step 1: Issuer Profile -->
          <div v-if="currentStep === 1" class="space-y-4 max-w-2xl mx-auto">
            <h2 class="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">
              گام اول: انتخاب / ایجاد مشخصات صادرکننده
            </h2>

            <NForm label-placement="top" class="space-y-4">
              <NFormItem label="نوع صادرکننده چک">
                <NSelect v-model:value="issuerType" :options="issuerTypeOptions" size="large" />
              </NFormItem>

              <NFormItem label="نام / عنوان صادرکننده (شرکت یا شخص)">
                <NInput v-model:value="issuerName" placeholder="مثلا: شرکت صنایع کاشی کاوه یا رضا صبوری" size="large" />
              </NFormItem>

              <NFormItem label="شناسه ملی / کد ملی صادرکننده">
                <NInput v-model:value="issuerNationalId" placeholder="۱۰ رقم کد ملی یا ۱۱ رقم شناسه ملی" size="large" />
              </NFormItem>
            </NForm>

            <div class="flex justify-end pt-6">
              <NButton type="primary" size="large" @click="goToNextStep" class="font-bold">
                مرحله بعد: مشخصات چک ←
              </NButton>
            </div>
          </div>

          <!-- Step 2: Facility & Cheque Details -->
          <div v-else-if="currentStep === 2" class="space-y-4 max-w-2xl mx-auto">
            <h2 class="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">
              گام دوم: مشخصات اسمی و صیادی چک
            </h2>

            <NForm label-placement="top" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="بانک صادرکننده">
                  <NSelect v-model:value="bankName" :options="bankOptions" size="large" />
                </NFormItem>

                <NFormItem label="شماره صیادی ۱۶ رقمی چک">
                  <NInput
                    v-model:value="chequeSerialNumber"
                    placeholder="مثلا: 1234567890123456"
                    maxlength="16"
                    size="large"
                  />
                  <template #feedback>
                    <span class="text-xs text-slate-500">شماره صیادی باید دقیقا ۱۶ رقم باشد.</span>
                  </template>
                </NFormItem>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="مبلغ اسمی چک (ریال)">
                  <NInputNumber
                    v-model:value="faceAmount"
                    :min="100000"
                    :step="10000000"
                    class="w-full"
                    size="large"
                  />
                </NFormItem>

                <NFormItem label="تاریخ سررسید چک">
                  <NDatePicker
                    v-model:value="dueDateTimestamp"
                    type="date"
                    class="w-full"
                    size="large"
                  />
                </NFormItem>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NFormItem label="نرخ تنزیل پیشنهادی (درصد ماهانه)">
                  <NInput v-model:value="suggestedDiscountRate" placeholder="مثلا: 2.5" size="large" />
                </NFormItem>

                <NFormItem label="توضیحات تکمیلی">
                  <NInput v-model:value="description" placeholder="توضیحات کیفیت اعتبار صادرکننده..." size="large" />
                </NFormItem>
              </div>
            </NForm>

            <div class="flex items-center justify-between pt-6">
              <NButton secondary size="large" @click="goToPrevStep">
                → مرحله قبل
              </NButton>
              <NButton type="primary" size="large" @click="goToNextStep" class="font-bold">
                مرحله بعد: مدارک و نهایی‌سازی ←
              </NButton>
            </div>
          </div>

          <!-- Step 3: Documents & Submit -->
          <div v-else-if="currentStep === 3" class="space-y-6 max-w-2xl mx-auto">
            <h2 class="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">
              گام سوم: بارگذاری تصویر چک و مدارک مکمل
            </h2>

            <!-- Review Summary -->
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div class="font-bold text-emerald-400 mb-2">خلاصه مشخصات آگهی:</div>
              <div class="grid grid-cols-2 gap-2">
                <div><span class="text-slate-400">صادرکننده:</span> {{ issuerName }} ({{ issuerNationalId }})</div>
                <div><span class="text-slate-400">بانک:</span> {{ bankName }}</div>
                <div><span class="text-slate-400">شماره صیادی:</span> {{ chequeSerialNumber }}</div>
                <div><span class="text-slate-400">مبلغ:</span> {{ Number(faceAmount).toLocaleString('fa-IR') }} ریال</div>
                <div><span class="text-slate-400">تاریخ سررسید:</span> {{ dueDateTimestamp ? new Date(dueDateTimestamp).toLocaleDateString('fa-IR') : '' }}</div>
                <div><span class="text-slate-400">نرخ پیشنهادی:</span> {{ suggestedDiscountRate }}٪</div>
              </div>
            </div>

            <!-- Upload Zone -->
            <div class="space-y-2">
              <label class="text-xs text-slate-300 font-bold">تصویر چک صیادی / مدارک پشتیبان:</label>
              <NUpload
                v-model:file-list="uploadedFiles"
                multiple
                directory-dnd
                :max="3"
              >
                <NUploadDragger class="bg-slate-950/60 border-dashed border-slate-700 hover:border-emerald-500 p-6">
                  <div class="text-center space-y-2">
                    <p class="text-sm font-bold text-slate-200">جهت آپلود، فایل‌ها را اینجا رها کنید یا کلیک کنید</p>
                    <p class="text-xs text-slate-400">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر ۵ مگابایت)</p>
                  </div>
                </NUploadDragger>
              </NUpload>
            </div>

            <div class="flex items-center justify-between pt-6 border-t border-slate-800">
              <NButton secondary size="large" @click="goToPrevStep">
                → مرحله قبل
              </NButton>
              <NButton
                type="primary"
                size="large"
                :loading="loading"
                @click="handleSubmit"
                class="font-bold px-8 bg-emerald-600 hover:bg-emerald-500"
              >
                ثبت و ارسال آگهی جهت بررسی
              </NButton>
            </div>
          </div>
        </NCard>
      </main>
    </div>
  </div>
</template>
