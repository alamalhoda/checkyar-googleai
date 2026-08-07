<template>
  <div class="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
    <!-- Header with Review Mode Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-white">بررسی و ارزیابی آگهی چک صیادی</h1>
          <NTag type="warning" round size="small">در انتظار تصمیم ناظر</NTag>
        </div>
        <p class="text-xs text-slate-400 mt-1">کد بررسی: #{{ itemId }}</p>
      </div>

      <!-- Mode Switcher -->
      <div class="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
        <span class="text-xs font-medium text-slate-300">حالت ساده (فشرده)</span>
        <NSwitch
          :value="uiStore.isAdvancedModerator"
          @update:value="(val) => uiStore.setAdvancedModerator(val)"
          size="medium"
        />
        <span class="text-xs font-medium text-slate-300">حالت ارشد (۳ پنله پیشرفته)</span>
      </div>
    </div>

    <NSpin :show="store.loading">
      <!-- ---------------------------------------------------- -->
      <!-- SIMPLE MODE (Single Panel) -->
      <!-- ---------------------------------------------------- -->
      <div v-if="!uiStore.isAdvancedModerator" class="max-w-3xl mx-auto space-y-6">
        <NCard title="اطلاعات اصلی آگهی" class="bg-slate-900/50 border-slate-800">
          <div v-if="store.currentReviewItem" class="space-y-4 text-xs text-slate-300">
            <div class="grid grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div>
                <span class="text-slate-500">شناسه صیادی:</span>
                <div class="font-mono text-white text-sm font-bold">{{ store.currentReviewItem.sayadId }}</div>
              </div>
              <div>
                <span class="text-slate-500">مبلغ اسمی:</span>
                <div class="text-emerald-400 text-sm font-bold">{{ store.currentReviewItem.amount.toLocaleString('fa-IR') }} تومان</div>
              </div>
              <div>
                <span class="text-slate-500">بانک صادرکننده:</span>
                <div class="text-white">{{ store.currentReviewItem.bank }} ({{ store.currentReviewItem.city }})</div>
              </div>
              <div>
                <span class="text-slate-500">تاریخ سررسید:</span>
                <div class="text-white">{{ store.currentReviewItem.dueDate }}</div>
              </div>
            </div>

            <!-- Decision Form -->
            <div class="space-y-3 pt-2">
              <NFormItem label="علت رد / یادداشت ناظر">
                <NSelect v-model:value="reasonCode" :options="reasonOptions" placeholder="انتخاب دلیل استاندارد" class="mb-2" />
                <NInput v-model:value="internalNote" type="textarea" placeholder="توضیحات تکمیلی ناظر..." rows="2" />
              </NFormItem>

              <div class="flex justify-end gap-3 pt-2">
                <NButton type="error" secondary data-testid="moderation-reject-btn" :loading="store.loading" @click="handleDecision('reject')">
                  رد آگهی
                </NButton>
                <NButton type="success" data-testid="moderation-approve-btn" :loading="store.loading" @click="handleDecision('approve')">
                  تأیید و انتشار آگهی
                </NButton>
              </div>
            </div>
          </div>
        </NCard>
      </div>

      <!-- ---------------------------------------------------- -->
      <!-- ADVANCED MODE (3 Panels Side-by-Side) -->
      <!-- ---------------------------------------------------- -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Panel 1: Listing Details (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <NCard title="۱. جزئیات چک و مدارک" class="bg-slate-900/50 border-slate-800 h-full">
            <div v-if="store.currentReviewItem" class="space-y-4 text-xs text-slate-300">
              <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">صیادی:</span>
                  <span class="font-mono text-white font-bold">{{ store.currentReviewItem.sayadId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">مبلغ:</span>
                  <span class="text-emerald-400 font-bold">{{ store.currentReviewItem.amount.toLocaleString('fa-IR') }} تومان</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">بانک:</span>
                  <span class="text-white">{{ store.currentReviewItem.bank }}</span>
                </div>
              </div>

              <div>
                <span class="text-slate-400 font-medium block mb-2">تصاویر مدارک ضمیمه شده:</span>
                <div class="space-y-2">
                  <div
                    v-for="(doc, idx) in store.currentReviewItem.documents"
                    :key="idx"
                    class="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex items-center justify-between"
                  >
                    <span>{{ doc.title }}</span>
                    <NTag size="small" type="info">مشاهده</NTag>
                  </div>
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- Panel 2: User Context & History (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <NCard title="۲. سوابق و پروفایل آگهی‌دهنده" class="bg-slate-900/50 border-slate-800 h-full">
            <div v-if="store.currentReviewItem" class="space-y-4 text-xs text-slate-300">
              <div class="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">نام کاربر:</span>
                  <span class="text-white font-bold">{{ store.currentReviewItem.userName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">امتیاز اعتباری:</span>
                  <span class="text-amber-400 font-bold">{{ store.currentReviewItem.userTrustScore }} / ۱۰۰</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">تعداد معاملات موفق:</span>
                  <span class="text-white font-mono">{{ store.currentReviewItem.userTradeCount }} معامله</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">وضعیت KYC:</span>
                  <NTag size="small" type="success">احراز هویت شده</NTag>
                </div>
              </div>

              <div>
                <span class="text-slate-400 font-medium block mb-2">رویدادهای اخیر کاربر:</span>
                <div class="space-y-2">
                  <div
                    v-for="(evt, idx) in store.currentReviewItem.historyEvents"
                    :key="idx"
                    class="p-2 bg-slate-950/40 rounded-lg border border-slate-800 text-[11px] flex justify-between"
                  >
                    <span>{{ evt.title }}</span>
                    <span class="text-slate-500 font-mono">{{ evt.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </NCard>
        </div>

        <!-- Panel 3: Action & Internal Notes (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <NCard title="۳. پانل صدور رای و ثبت نظرات" class="bg-slate-900/50 border-slate-800 h-full">
            <div class="space-y-4">
              <NFormItem label="کد علت رد آگهی (در صورت رد)">
                <NSelect v-model:value="reasonCode" :options="reasonOptions" placeholder="انتخاب کد استاندار" />
              </NFormItem>

              <NFormItem label="یادداشت محرمانه ناظر ارشد">
                <NInput
                  v-model:value="internalNote"
                  type="textarea"
                  placeholder="این یادداشت فقط برای کادر مدیریت قابل مشاهده است..."
                  rows="4"
                />
              </NFormItem>

              <div class="space-y-2 pt-4">
                <NButton type="success" block data-testid="moderation-approve-btn" :loading="store.loading" @click="handleDecision('approve')">
                  تأیید نهایی آگهی
                </NButton>
                <NButton type="error" secondary block data-testid="moderation-reject-btn" :loading="store.loading" @click="handleDecision('reject')">
                  رد آگهی و اطلاع به کاربر
                </NButton>
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NSwitch, NFormItem, NSelect, NInput, NButton, NSpin, NTag, useMessage } from 'naive-ui';
import { useModerationStore } from '../stores/moderationStore';
import { useUiStore } from '../../../stores/useUiStore';
import { REJECTION_CODE_LABELS, type RejectionCode } from '../../../types/api';

const route = useRoute();
const router = useRouter();
const store = useModerationStore();
const uiStore = useUiStore();
const message = useMessage();

const itemId = computed(() => Number(route.params.id) || 1);
const reasonCode = ref<string | null>('MOD_101');
const internalNote = ref('');

const reasonOptions = Object.entries(REJECTION_CODE_LABELS).map(([code, label]) => ({
  label: `${code} - ${label}`,
  value: code as RejectionCode
}));

onMounted(() => {
  store.fetchReviewDetails(itemId.value);
});

async function handleDecision(decision: 'approve' | 'reject') {
  if (decision === 'reject' && !reasonCode.value) {
    message.warning('لطفاً کد علت رد آگهی را انتخاب کنید.');
    return;
  }
  const ok = await store.submitDecision(itemId.value, decision, reasonCode.value || undefined, internalNote.value);
  if (ok) {
    router.push('/moderation');
  }
}
</script>
