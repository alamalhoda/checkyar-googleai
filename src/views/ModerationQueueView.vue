<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard,
  NButton,
  NSelect,
  NInput,
  NModal,
  NSpin,
  NEmpty,
  NTag
} from 'naive-ui';
import { moderationApi } from '../api';
import type { ModerationQueueItem, RejectionCode } from '../types/api';
import { REJECTION_CODE_LABELS } from '../types/api';

const queueItems = ref<ModerationQueueItem[]>([]);
const loading = ref(false);
const submitting = ref(false);

const selectedItem = ref<ModerationQueueItem | null>(null);

// Reject Modal State
const showRejectModal = ref(false);
const rejectionCode = ref<RejectionCode>('MOD_101');
const rejectionNote = ref('');

// Approve Modal State
const showApproveModal = ref(false);
const selectedApproveRiskTier = ref<'low' | 'medium' | 'high'>('low');

const riskTierOptions = [
  { label: 'کم‌ریسک (low)', value: 'low' },
  { label: 'ریسک متوسط (medium)', value: 'medium' },
  { label: 'پرریسک (high)', value: 'high' }
];

const rejectionOptions = Object.entries(REJECTION_CODE_LABELS).map(([code, label]) => ({
  label: `${code} - ${label}`,
  value: code as RejectionCode
}));

const loadQueue = async () => {
  loading.value = true;
  try {
    const res = await moderationApi.getQueue();
    queueItems.value = Array.isArray(res) ? res : [];
  } catch (err) {
    console.error('Failed to load moderation queue', err);
    queueItems.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadQueue);

const openApproveModal = (item: ModerationQueueItem) => {
  selectedItem.value = item;
  selectedApproveRiskTier.value = item.risk_tier || 'low';
  showApproveModal.value = true;
};

const submitApprove = async () => {
  if (!selectedItem.value) return;
  submitting.value = true;
  try {
    await moderationApi.submitDecision(selectedItem.value.id, {
      decision: 'approve',
      risk_tier: selectedApproveRiskTier.value
    });
    const list = Array.isArray(queueItems.value) ? queueItems.value : [];
    queueItems.value = list.filter(q => q.id !== selectedItem.value?.id);
    showApproveModal.value = false;
  } catch (err) {
    console.error('Failed to approve listing', err);
  } finally {
    submitting.value = false;
  }
};

const openRejectModal = (item: ModerationQueueItem) => {
  selectedItem.value = item;
  rejectionCode.value = 'MOD_101';
  rejectionNote.value = '';
  showRejectModal.value = true;
};

const submitReject = async () => {
  if (!selectedItem.value) return;
  submitting.value = true;
  try {
    await moderationApi.submitDecision(selectedItem.value.id, {
      decision: 'reject',
      rejection_code: rejectionCode.value,
      rejection_note: rejectionNote.value
    });
    queueItems.value = queueItems.value.filter(q => q.id !== selectedItem.value?.id);
    showRejectModal.value = false;
  } catch (err) {
    console.error('Failed to reject listing', err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">صف بررسی و نظارت بر آگهی‌های جدید (Moderation)</h1>
      <p class="text-xs text-slate-400">تایید یا رد آگهی‌های چک بر اساس ضوابط بانک مرکزی و صیاد</p>
    </div>

    <NSpin :show="loading">
      <div v-if="queueItems && queueItems.length > 0" class="space-y-4">
        <NCard v-for="item in queueItems" :key="item.id" class="bg-slate-900 border border-slate-800 rounded-xl">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-slate-100">{{ item.bank_name }}</span>
                <span class="text-xs font-mono text-slate-400">سریال: {{ item.cheque_serial_number }}</span>
                <NTag size="small" type="warning">در انتظار بررسی</NTag>
              </div>

              <div class="text-xs text-slate-300 space-y-1">
                <div>مبلغ: <strong class="text-emerald-400">{{ Math.floor(Number(item.face_amount) / 10).toLocaleString('fa-IR') }} تومان</strong></div>
                <div>صادرکننده: <strong>{{ item.issuer_name }}</strong> (شناسه ملی: {{ item.issuer_national_id }})</div>
                <div>سطح ریسک کنونی: <strong>{{ item.risk_tier || 'نامشخص' }}</strong></div>
                <div>توضیحات: {{ item.description || 'بدون توضیح' }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <NButton type="error" secondary size="small" :loading="submitting" @click="openRejectModal(item)">
                رد آگهی
              </NButton>

              <NButton type="primary" size="small" :loading="submitting" @click="openApproveModal(item)">
                تایید و انتشار آگهی
              </NButton>
            </div>
          </div>
        </NCard>
      </div>

      <NEmpty v-else description="صف بررسی آگهی‌ها در حال حاضر خالی است." class="py-16" />
    </NSpin>

    <!-- Approve Modal with Risk Tier selection -->
    <NModal
      v-model:show="showApproveModal"
      preset="card"
      title="تأیید و تعیین سطح ریسک آگهی"
      class="max-w-md w-full bg-slate-900 border border-slate-800 text-slate-100"
    >
      <div class="space-y-4 text-xs">
        <p class="text-slate-300">
          لطفاً سطح ریسک نهایی آگهی را جهت انتشار انتخاب کنید:
        </p>

        <div>
          <label class="block text-slate-400 mb-1">سطح ریسک (Risk Tier):</label>
          <NSelect v-model:value="selectedApproveRiskTier" :options="riskTierOptions" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton quaternary @click="showApproveModal = false">انصراف</NButton>
          <NButton type="primary" :loading="submitting" @click="submitApprove">تأیید و انتشار</NButton>
        </div>
      </template>
    </NModal>

    <!-- Reject Modal -->
    <NModal
      v-model:show="showRejectModal"
      preset="card"
      title="ثبت علت رد آگهی"
      class="max-w-md w-full bg-slate-900 border border-slate-800 text-slate-100"
    >
      <div class="space-y-4 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">کد استاندارد علت رد:</label>
          <NSelect v-model:value="rejectionCode" :options="rejectionOptions" />
        </div>

        <div>
          <label class="block text-slate-400 mb-1">توضیح برای کاربر جهت اصلاح:</label>
          <NInput v-model:value="rejectionNote" type="textarea" placeholder="علت عدم تایید را بنویسید..." :rows="3" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton quaternary @click="showRejectModal = false">انصراف</NButton>
          <NButton type="error" :loading="submitting" @click="submitReject">ثبت رد آگهی</NButton>
        </div>
      </template>
    </NModal>
  </div>
</template>
