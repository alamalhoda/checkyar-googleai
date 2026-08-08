<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <span>بررسی مدارک احراز هویت (KYC)</span>
          <NTag type="info" round size="small">شناسه درخواست #{{ id }}</NTag>
        </h1>
        <p class="text-xs text-slate-400 mt-1">ارزیابی صحت تصاویر کارت ملی و مطابقت با شناسه صیادی</p>
      </div>

      <div class="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
        <span class="text-xs font-medium text-slate-300">ساده</span>
        <NSwitch
          :value="uiStore.isAdvancedModerator"
          @update:value="(val) => uiStore.setAdvancedModerator(val)"
          size="medium"
        />
        <span class="text-xs font-medium text-slate-300">پیشرفته</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <NSpin size="large" />
    </div>

    <!-- Simple Mode Layout -->
    <div v-else-if="!uiStore.isAdvancedModerator" class="max-w-2xl mx-auto space-y-6">
      <NCard title="مدارک ارسال‌شده کاربر" class="bg-slate-900/50 border-slate-800">
        <div class="space-y-4">
          <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div class="flex justify-between"><span>نام کامل:</span> <strong class="text-white">{{ verification?.full_name || 'امیرحسین رضایی' }}</strong></div>
            <div class="flex justify-between"><span>کد ملی:</span> <strong class="font-mono text-white">{{ verification?.national_id || '0012345678' }}</strong></div>
            <div v-if="verification?.company_name" class="flex justify-between"><span>شرکت / مجموعه:</span> <strong class="text-slate-200">{{ verification.company_name }}</strong></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-center text-xs">
              <span class="text-slate-300 font-medium block mb-2">کارت ملی رو</span>
              <img :src="getDocUrl('national_card') || '/images/placeholders/id_card.svg'" class="rounded-lg border border-slate-700 max-h-48 mx-auto object-cover" />
            </div>
            <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-center text-xs">
              <span class="text-slate-300 font-medium block mb-2">تصویر سلفی + تعهدنامه</span>
              <img :src="getDocUrl('selfie') || '/images/placeholders/selfie.svg'" class="rounded-lg border border-slate-700 max-h-48 mx-auto object-cover" />
            </div>
          </div>

          <NFormItem label="علت یا یادداشت ناظر (اختیاری در صورت رد)">
            <NInput v-model:value="note" placeholder="علت عدم تایید یا ملاحظات..." />
          </NFormItem>

          <div class="flex justify-end gap-3 pt-2">
            <NButton data-testid="kyc-reject-btn" type="error" secondary :loading="submitting" @click="handleDecision('reject')">رد مدارک</NButton>
            <NButton data-testid="kyc-approve-btn" type="success" :loading="submitting" @click="handleDecision('approve')">تأیید احراز هویت</NButton>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Advanced Mode Layout (Multi-Panel) -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 space-y-4">
        <NCard title="مدارک تصویری کاربر" class="bg-slate-900/50 border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <span class="text-xs font-semibold text-slate-300">۱. تصوير اصلی کارت ملی ({{ verification?.full_name }}):</span>
              <img :src="getDocUrl('national_card') || '/images/placeholders/id_card.svg'" class="rounded-xl border border-slate-700 w-full object-cover max-h-64" />
            </div>
            <div class="space-y-2">
              <span class="text-xs font-semibold text-slate-300">۲. تصوير سلفی با دست‌نوشته تعهد:</span>
              <img :src="getDocUrl('selfie') || '/images/placeholders/selfie.svg'" class="rounded-xl border border-slate-700 w-full object-cover max-h-64" />
            </div>
          </div>
        </NCard>
      </div>

      <div class="lg:col-span-4 space-y-4">
        <NCard title="ارزیابی اعتباری و تصمیگیری" class="bg-slate-900/50 border-slate-800">
          <div class="space-y-4 text-xs">
            <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">نام متقاضی:</span>
                <span class="text-slate-100 font-bold">{{ verification?.full_name || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">کد ملی:</span>
                <span class="text-slate-100 font-mono">{{ verification?.national_id || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">استعلام شاهکار:</span>
                <span class="text-emerald-400 font-bold">مطابقت کامل کد ملی و سیم‌کارت</span>
              </div>
            </div>

            <NFormItem label="توضیحات / کد عدم تایید">
              <NInput v-model:value="note" type="textarea" placeholder="یادداشت ناظر..." rows="3" />
            </NFormItem>

            <div class="space-y-2">
              <NButton data-testid="kyc-approve-btn" type="success" block :loading="submitting" @click="handleDecision('approve')">
                تأیید سطح ۲ احراز هویت
              </NButton>
              <NButton data-testid="kyc-reject-btn" type="error" secondary block :loading="submitting" @click="handleDecision('reject')">
                رد درخواست
              </NButton>
            </div>
          </div>
        </NCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NSwitch, NTag, NButton, NFormItem, NInput, NSpin } from 'naive-ui';
import { useUiStore } from '../../../stores/useUiStore';
import { moderationApi } from '../../../api';
import type { Verification } from '../../../types/api';
import { createDiscreteApi, darkTheme } from 'naive-ui';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const id = computed(() => route.params.id);
const note = ref('');
const loading = ref(true);
const submitting = ref(false);
const verification = ref<Verification | null>(null);

const loadKyc = async () => {
  loading.value = true;
  try {
    const data = await moderationApi.getKycDetail(Number(id.value));
    verification.value = data;
  } catch (err: any) {
    message.error('خطا در بارگذاری اطلاعات احراز هویت.');
  } finally {
    loading.value = false;
  }
};

const getDocUrl = (type: string) => {
  if (!verification.value?.documents) return null;
  const found = verification.value.documents.find(d => d.document_type === type);
  return found?.file_url || found?.file || null;
};

async function handleDecision(decision: 'approve' | 'reject') {
  submitting.value = true;
  try {
    await moderationApi.submitKycDecision(Number(id.value), {
      decision,
      rejection_code: note.value || undefined,
      rejection_note: note.value || undefined
    });
    if (decision === 'approve') {
      message.success('احراز هویت کاربر با موفقیت تأیید شد.');
    } else {
      message.info('درخواست احراز هویت رد شد.');
    }
    router.push('/moderation/kyc');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    message.error(apiErr?.message || err?.message || 'خطا در ثبت تصمیم احراز هویت.');
  } finally {
    submitting.value = false;
  }
}

onMounted(loadKyc);
</script>
