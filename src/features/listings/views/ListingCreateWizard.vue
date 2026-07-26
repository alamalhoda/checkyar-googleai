<template>
  <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
    <!-- Header with Hybrid UX Mode Toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>ثبت آگهی جدید چک صیادی</span>
          <NTag type="info" size="small" round>نسخه هوشمند</NTag>
        </h1>
        <p class="text-xs text-slate-400 mt-1">
          اطلاعات چک و شرایط معامله را وارد کنید تا معامله‌گران پیشنهادهای خود را ارسال نمایند.
        </p>
      </div>

      <!-- Mode Switcher -->
      <div class="flex items-center gap-3 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
        <span class="text-xs font-medium text-slate-300">نمایش یکپارچه (تک‌صفحه‌ای)</span>
        <NSwitch
          :value="!form.wizardMode.value"
          @update:value="(val) => form.toggleWizardMode(!val)"
          size="medium"
        />
        <span class="text-xs font-medium text-slate-300">مرحله‌به‌مرحله (ویزارد)</span>
      </div>
    </div>

    <!-- Domain Warnings Banner -->
    <div v-if="form.warnings.value.length > 0" class="space-y-2">
      <NAlert
        v-for="(warn, idx) in form.warnings.value"
        :key="idx"
        type="warning"
        closable
        title="هشدار هوشمند دامنه"
      >
        {{ warn }}
      </NAlert>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- WIZARD MODE -->
    <!-- ---------------------------------------------------- -->
    <div v-if="form.wizardMode.value" class="space-y-6">
      <!-- Steps Indicator -->
      <NCard class="bg-slate-900/50 border-slate-800">
        <NSteps :current="currentStep" status="process">
          <NStep title="اطلاعات پایه چک" description="شناسه صیادی، مبلغ و تاریخ" />
          <NStep title="شرایط معامله" description="نرخ تنزیل و تسویه" />
          <NStep title="تأیید و انتشار" description="مرور نهایی آگهی" />
        </NSteps>
      </NCard>

      <!-- Step 1: Cheque Basics -->
      <NCard v-if="currentStep === 1" title="مرحله ۱: مشخصات چک صیادی" class="bg-slate-900/50 border-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="شماره ۱۶ رقمی صیادی (الزامی)" required>
            <NInput
              v-model:value="form.formData.serialNumber"
              placeholder="مثال: 1234567890123456"
              maxlength="16"
              show-count
            />
          </NFormItem>

          <NFormItem label="مبلغ چک (تومان)" required>
            <NInputNumber
              v-model:value="form.formData.amount"
              :min="1000000"
              :step="1000000"
              placeholder="مبلغ به تومان"
              class="w-full"
            />
          </NFormItem>

          <NFormItem label="تاریخ سررسید" required>
            <NDatePicker
              v-model:value="form.formData.dueDate"
              type="date"
              clearable
              class="w-full"
              placeholder="انتخاب تاریخ"
            />
          </NFormItem>

          <NFormItem label="بانک صادرکننده" required>
            <NSelect
              v-model:value="form.formData.bank"
              :options="bankOptions"
              placeholder="انتخاب بانک"
            />
          </NFormItem>

          <NFormItem label="شهر چک">
            <NInput v-model:value="form.formData.city" placeholder="مثال: تهران" />
          </NFormItem>
        </div>

        <div class="flex justify-end mt-6">
          <NButton
            type="primary"
            :disabled="!form.isValidStep1.value"
            @click="currentStep = 2"
          >
            مرحله بعد: شرایط معامله
          </NButton>
        </div>
      </NCard>

      <!-- Step 2: Deal Conditions -->
      <NCard v-if="currentStep === 2" title="مرحله ۲: شرایط پیشنهاد و تسویه" class="bg-slate-900/50 border-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="نرخ تنزیل پیشنهادی (درصد)">
            <NInputNumber
              v-model:value="form.formData.discountRate"
              :min="0"
              :max="50"
              placeholder="مثال: 5"
              class="w-full"
            />
          </NFormItem>

          <NFormItem label="روش تسویه مورد نظر">
            <NSelect
              v-model:value="form.formData.settlementMethod"
              :options="settlementOptions"
            />
          </NFormItem>

          <NFormItem label="محدودیت طرف معامله (اختیاری)" class="col-span-full">
            <NInput
              v-model:value="form.formData.counterpartyRestrictions"
              placeholder="مثال: فقط خریداران با رتبه اعتباری الف یا دارای وثیقه معتبر"
            />
          </NFormItem>

          <NFormItem label="توضیحات تکمیلی" class="col-span-full">
            <NInput
              v-model:value="form.formData.description"
              type="textarea"
              placeholder="توضیحات بیشتر در مورد علت واگذاری یا شرایط تحویل چک..."
            />
          </NFormItem>
        </div>

        <div class="flex justify-between mt-6">
          <NButton @click="currentStep = 1">مرحله قبل</NButton>
          <NButton
            type="primary"
            :disabled="!form.isValidStep2.value"
            @click="currentStep = 3"
          >
            مرحله بعد: مرور و انتشار
          </NButton>
        </div>
      </NCard>

      <!-- Step 3: Summary & Confirmation -->
      <NCard v-if="currentStep === 3" title="مرحله ۳: بررسی نهایی و انتشار آگهی" class="bg-slate-900/50 border-slate-800">
        <div class="bg-slate-800/40 p-4 rounded-xl space-y-3 text-sm text-slate-300">
          <div class="flex justify-between border-b border-slate-700/60 pb-2">
            <span class="text-slate-400">شناسه صیادی:</span>
            <span class="font-mono text-white">{{ form.formData.serialNumber }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-700/60 pb-2">
            <span class="text-slate-400">مبلغ اسمی:</span>
            <span class="font-bold text-emerald-400">{{ (form.formData.amount || 0).toLocaleString('fa-IR') }} تومان</span>
          </div>
          <div class="flex justify-between border-b border-slate-700/60 pb-2">
            <span class="text-slate-400">بانک صادرکننده:</span>
            <span class="text-white">{{ form.formData.bank }} - {{ form.formData.city }}</span>
          </div>
          <div class="flex justify-between border-b border-slate-700/60 pb-2">
            <span class="text-slate-400">نرخ تنزیل پیشنهادی:</span>
            <span class="text-amber-400">{{ form.formData.discountRate }}٪</span>
          </div>
          <div class="flex justify-between border-b border-slate-700/60 pb-2">
            <span class="text-slate-400">روش تسویه:</span>
            <span class="text-white">{{ settlementLabel(form.formData.settlementMethod) }}</span>
          </div>
        </div>

        <div class="flex justify-between items-center mt-6">
          <NButton @click="currentStep = 2">بازگشت و ویرایش</NButton>
          <div class="flex items-center gap-3">
            <NButton secondary :loading="form.loading.value" @click="handleSaveDraft">
              ذخیره به عنوان پیش‌نویس
            </NButton>
            <NButton type="primary" :loading="form.loading.value" @click="handlePublish">
              تأیید و ارسال به ناظر
            </NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- ---------------------------------------------------- -->
    <!-- FLAT MODE (All fields at a glance) -->
    <!-- ---------------------------------------------------- -->
    <div v-else class="space-y-6">
      <!-- Section 1: Cheque Details -->
      <NCard title="۱. مشخصات و پایه چک" class="bg-slate-900/50 border-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="شماره ۱۶ رقمی صیادی (الزامی)" required>
            <NInput
              v-model:value="form.formData.serialNumber"
              placeholder="مثال: 1234567890123456"
              maxlength="16"
              show-count
            />
          </NFormItem>

          <NFormItem label="مبلغ چک (تومان)" required>
            <NInputNumber
              v-model:value="form.formData.amount"
              :min="1000000"
              :step="1000000"
              placeholder="مبلغ به تومان"
              class="w-full"
            />
          </NFormItem>

          <NFormItem label="تاریخ سررسید" required>
            <NDatePicker
              v-model:value="form.formData.dueDate"
              type="date"
              clearable
              class="w-full"
            />
          </NFormItem>

          <NFormItem label="بانک صادرکننده" required>
            <NSelect
              v-model:value="form.formData.bank"
              :options="bankOptions"
            />
          </NFormItem>

          <NFormItem label="شهر چک">
            <NInput v-model:value="form.formData.city" placeholder="مثال: تهران" />
          </NFormItem>
        </div>
      </NCard>

      <!-- Section 2: Deal Conditions -->
      <NCard title="۲. شرایط واگذاری و تسویه" class="bg-slate-900/50 border-slate-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NFormItem label="نرخ تنزیل پیشنهادی (درصد)">
            <NInputNumber
              v-model:value="form.formData.discountRate"
              :min="0"
              :max="50"
              class="w-full"
            />
          </NFormItem>

          <NFormItem label="روش تسویه">
            <NSelect
              v-model:value="form.formData.settlementMethod"
              :options="settlementOptions"
            />
          </NFormItem>

          <NFormItem label="محدودیت‌های طرف معامله" class="col-span-full">
            <NInput
              v-model:value="form.formData.counterpartyRestrictions"
              placeholder="شرایط پذیرش خریدار..."
            />
          </NFormItem>

          <NFormItem label="توضیحات تکمیلی" class="col-span-full">
            <NInput
              v-model:value="form.formData.description"
              type="textarea"
              placeholder="توضیحات کامل آگهی..."
            />
          </NFormItem>
        </div>
      </NCard>

      <!-- Global Actions for Flat Mode -->
      <NCard class="bg-slate-900/50 border-slate-800">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-xs text-slate-400">
            با کلیک روی «تأیید و ارسال»، آگهی شما جهت بررسی به بخش نظارت ارجاع داده می‌شود.
          </p>

          <div class="flex items-center gap-3">
            <NButton secondary :loading="form.loading.value" @click="handleSaveDraft">
              ذخیره پیش‌نویس
            </NButton>
            <NButton
              type="primary"
              :loading="form.loading.value"
              :disabled="!form.isFormValid.value"
              @click="handlePublish"
            >
              تأیید و ارسال نهایی
            </NButton>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NSwitch, NSteps, NStep, NFormItem, NInput, NInputNumber,
  NDatePicker, NSelect, NButton, NAlert, NTag
} from 'naive-ui';
import { useListingForm } from '../composables/useListingForm';

const router = useRouter();
const currentStep = ref(1);

const form = useListingForm();

const bankOptions = [
  { label: 'بانک ملی ایران', value: 'بانک ملی' },
  { label: 'بانک ملت', value: 'بانک ملت' },
  { label: 'بانک صادرات', value: 'بانک صادرات' },
  { label: 'بانک پاسارگاد', value: 'بانک پاسارگاد' },
  { label: 'بانک تجارت', value: 'بانک تجارت' },
  { label: 'بانک سامان', value: 'بانک سامان' }
];

const settlementOptions = [
  { label: 'پرداخت امن (Escrow)', value: 'escrow' },
  { label: 'نقدی حضوری', value: 'cash' },
  { label: 'حواله پایا/ساتنا', value: 'bank_transfer' },
  { label: 'توافقی و شناور', value: 'flexible' }
];

function settlementLabel(val: string) {
  const map: Record<string, string> = {
    escrow: 'پرداخت امن (Escrow)',
    cash: 'نقدی حضوری',
    bank_transfer: 'حواله پایا/ساتنا',
    flexible: 'توافقی'
  };
  return map[val] || val;
}

async function handleSaveDraft() {
  const ok = await form.saveDraft();
  if (ok) {
    router.push('/listings/my');
  }
}

async function handlePublish() {
  const ok = await form.publishListing();
  if (ok) {
    router.push('/listings/my');
  }
}
</script>
