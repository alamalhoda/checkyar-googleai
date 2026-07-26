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

    <!-- Simple Mode Layout -->
    <div v-if="!uiStore.isAdvancedModerator" class="max-w-2xl mx-auto space-y-6">
      <NCard title="مدارک ارسال‌شده کاربر" class="bg-slate-900/50 border-slate-800">
        <div class="space-y-4">
          <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div class="flex justify-between"><span>نام کامل:</span> <strong class="text-white">امیرحسین رضایی</strong></div>
            <div class="flex justify-between"><span>کد ملی:</span> <strong class="font-mono text-white">0012345678</strong></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-center text-xs">
              <span class="text-slate-300 font-medium block mb-2">کارت ملی رو</span>
              <img src="https://placehold.co/400x250/1e293b/fff?text=ID+Front" class="rounded-lg border border-slate-700" />
            </div>
            <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-center text-xs">
              <span class="text-slate-300 font-medium block mb-2">تصویر سلفی + تعهدنامه</span>
              <img src="https://placehold.co/400x250/1e293b/fff?text=Selfie+Doc" class="rounded-lg border border-slate-700" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <NButton type="error" secondary @click="handleDecision('reject')">رد مدارک</NButton>
            <NButton type="success" @click="handleDecision('approve')">تأیید احراز هویت</NButton>
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
              <span class="text-xs font-semibold text-slate-300">۱. تصوير اصلی کارت ملی:</span>
              <img src="https://placehold.co/600x400/1e293b/fff?text=ID+Card+Front" class="rounded-xl border border-slate-700 w-full" />
            </div>
            <div class="space-y-2">
              <span class="text-xs font-semibold text-slate-300">۲. تصوير سلفی با دست‌نوشته تعهد:</span>
              <img src="https://placehold.co/600x400/1e293b/fff?text=Selfie+Note" class="rounded-xl border border-slate-700 w-full" />
            </div>
          </div>
        </NCard>
      </div>

      <div class="lg:col-span-4 space-y-4">
        <NCard title="ارزیابی اعتباری و تصمیگیری" class="bg-slate-900/50 border-slate-800">
          <div class="space-y-4 text-xs">
            <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">ریسک تقلب:</span>
                <NTag size="small" type="success">پایین (۱۵٪)</NTag>
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
              <NButton type="success" block @click="handleDecision('approve')">
                تأیید سطح ۲ احراز هویت
              </NButton>
              <NButton type="error" secondary block @click="handleDecision('reject')">
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NSwitch, NTag, NButton, NFormItem, NInput } from 'naive-ui';
import { useUiStore } from '../../../stores/useUiStore';
import { createDiscreteApi, darkTheme } from 'naive-ui';

const { message } = createDiscreteApi(['message'], {
  configProviderProps: { theme: darkTheme }
});

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const id = computed(() => route.params.id);
const note = ref('');

function handleDecision(decision: 'approve' | 'reject') {
  if (decision === 'approve') {
    message.success('احراز هویت کاربر با موفقیت تأیید شد.');
  } else {
    message.info('درخواست احراز هویت رد شد.');
  }
  router.push('/moderation/kyc');
}
</script>
