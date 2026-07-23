<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NButton, NDataTable, NModal, NSelect, NInput, NSpin, NTag,
  NForm, NFormItem, NAlert, useMessage, type DataTableColumns
} from 'naive-ui';
import {
  CheckmarkCircleOutline, CloseCircleOutline, EyeOutline,
  ShieldCheckmarkOutline, RefreshOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { moderationApi } from '../../api';
import type { ModerationQueueItem, RejectionCode } from '../../types/api';
import { REJECTION_CODE_LABELS } from '../../types/api';

const router = useRouter();
const message = useMessage();

const queueItems = ref<ModerationQueueItem[]>([]);
const loading = ref(false);
const submitting = ref(false);

// Detail Modal
const selectedDetailItem = ref<ModerationQueueItem | null>(null);
const showDetailModal = ref(false);

// Approve Confirm Modal
const showApproveConfirm = ref(false);
const itemToApprove = ref<ModerationQueueItem | null>(null);

// Reject Modal
const showRejectModal = ref(false);
const itemToReject = ref<ModerationQueueItem | null>(null);
const rejectionCode = ref<RejectionCode>('MOD_101');
const rejectionNote = ref('');

const rejectionOptions = Object.entries(REJECTION_CODE_LABELS).map(([code, label]) => ({
  label: `${code} - ${label}`,
  value: code as RejectionCode
}));

const formatTomans = (amountStr: string) => {
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return Math.floor(num / 10).toLocaleString('fa-IR');
};

const loadQueue = async () => {
  loading.value = true;
  try {
    queueItems.value = await moderationApi.getQueue();
  } catch (err: any) {
    message.error('خطا در دریافت صف آگهی‌های در انتظار بررسی.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadQueue);

// Modal Triggers
const openDetail = (item: ModerationQueueItem) => {
  selectedDetailItem.value = item;
  showDetailModal.value = true;
};

const openApprove = (item: ModerationQueueItem) => {
  itemToApprove.value = item;
  showApproveConfirm.value = true;
};

const confirmApprove = async () => {
  if (!itemToApprove.value) return;
  submitting.value = true;
  try {
    await moderationApi.submitDecision(itemToApprove.value.id, { decision: 'approve' });
    message.success(`آگهی #${itemToApprove.value.id} با موفقیت تایید و منتشر گردید.`);
    showApproveConfirm.value = false;
    await loadQueue();
  } catch (err: any) {
    message.error('خطا در تایید آگهی.');
  } finally {
    submitting.value = false;
  }
};

const openReject = (item: ModerationQueueItem) => {
  itemToReject.value = item;
  rejectionCode.value = 'MOD_101';
  rejectionNote.value = '';
  showRejectModal.value = true;
};

const submitReject = async () => {
  if (!itemToReject.value) return;
  if (!rejectionNote.value.trim()) {
    message.warning('لطفاً توضیحات علت رد را وارد نمایید.');
    return;
  }

  submitting.value = true;
  try {
    await moderationApi.submitDecision(itemToReject.value.id, {
      decision: 'reject',
      rejection_code: rejectionCode.value,
      rejection_note: rejectionNote.value
    });
    message.warning(`آگهی #${itemToReject.value.id} رد گردید و به کاربر اعلام شد.`);
    showRejectModal.value = false;
    await loadQueue();
  } catch (err: any) {
    message.error('خطا در رد آگهی.');
  } finally {
    submitting.value = false;
  }
};

const getRiskTagType = (risk: string | null) => {
  if (risk === 'low') return 'success';
  if (risk === 'medium') return 'warning';
  if (risk === 'high') return 'error';
  return 'default';
};

const getRiskLabel = (risk: string | null) => {
  if (risk === 'low') return 'کم ریسک';
  if (risk === 'medium') return 'ریسک متوسط';
  if (risk === 'high') return 'پر ریسک';
  return 'نامشخص';
};

// Data Table Columns definition
const columns: DataTableColumns<ModerationQueueItem> = [
  {
    title: 'شناسه',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'font-mono text-xs font-bold text-slate-300' }, `#${row.id}`)
  },
  {
    title: 'بانک صادرکننده',
    key: 'bank_name',
    width: 130,
    render: (row) => h('span', { class: 'font-bold text-slate-100' }, row.bank_name)
  },
  {
    title: 'مبلغ اسمی (تومان)',
    key: 'face_amount',
    width: 150,
    render: (row) => h('span', { class: 'font-mono font-bold text-emerald-400 text-xs' }, `${formatTomans(row.face_amount)} تومان`)
  },
  {
    title: 'نام صادرکننده',
    key: 'issuer_name',
    width: 170,
    render: (row) => h('div', { class: 'text-xs' }, [
      h('div', { class: 'font-semibold text-slate-200' }, row.issuer_name),
      h('div', { class: 'text-[10px] text-slate-400 font-mono' }, `شناسه: ${row.issuer_national_id}`)
    ])
  },
  {
    title: 'سطح ریسک',
    key: 'risk_tier',
    width: 110,
    render: (row) => h(NTag, { size: 'small', type: getRiskTagType(row.risk_tier), round: true }, { default: () => getRiskLabel(row.risk_tier) })
  },
  {
    title: 'ارسال مجدد',
    key: 'resubmit_count',
    width: 90,
    render: (row) => h('span', { class: 'font-mono text-xs text-amber-400' }, `${row.resubmit_count || 0} بار`)
  },
  {
    title: 'تاریخ ثبت',
    key: 'created_at',
    width: 110,
    render: (row) => h('span', { class: 'text-xs text-slate-400 font-mono' }, new Date(row.created_at).toLocaleDateString('fa-IR'))
  },
  {
    title: 'عملیات نظارت',
    key: 'actions',
    width: 210,
    fixed: 'left',
    render: (row) => h('div', { class: 'flex items-center gap-1.5' }, [
      h(NButton, {
        size: 'tiny',
        secondary: true,
        onClick: () => openDetail(row)
      }, { default: () => 'بررسی' }),
      h(NButton, {
        size: 'tiny',
        type: 'error',
        secondary: true,
        onClick: () => openReject(row)
      }, { default: () => 'رد آگهی' }),
      h(NButton, {
        size: 'tiny',
        type: 'primary',
        class: 'font-bold bg-emerald-600 hover:bg-emerald-500',
        onClick: () => openApprove(row)
      }, { default: () => 'تأیید' })
    ])
  }
];
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <!-- Page Title Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <ShieldCheckmarkOutline class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-100">صف بررسی و نظارت بر آگهی‌ها</h1>
              <p class="text-xs text-slate-400 mt-0.5">بررسی اعتبارسنجی صیادی و تصمیم‌گیری درباره انتشار آگهی‌های جدید</p>
            </div>
          </div>

          <NButton secondary size="small" :loading="loading" @click="loadQueue">
            <template #icon><RefreshOutline class="w-4 h-4" /></template>
            بروزرسانی لیست
          </NButton>
        </div>

        <!-- Table View -->
        <NSpin :show="loading">
          <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <NDataTable
              :columns="columns"
              :data="queueItems"
              :pagination="{ pageSize: 10 }"
              :bordered="false"
              class="custom-data-table"
            />
          </NCard>
        </NSpin>
      </main>
    </div>

    <!-- Detail View Modal -->
    <NModal
      v-model:show="showDetailModal"
      preset="card"
      title="جزئیات کامل آگهی چک صیادی"
      class="max-w-xl bg-slate-900 border border-slate-800 text-slate-100"
    >
      <div v-if="selectedDetailItem" class="space-y-4 text-xs">
        <div class="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div><span class="text-slate-400">بانک:</span> <strong class="text-slate-200">{{ selectedDetailItem.bank_name }}</strong></div>
          <div><span class="text-slate-400">سریال چک:</span> <strong class="font-mono text-slate-200">{{ selectedDetailItem.cheque_serial_number }}</strong></div>
          <div><span class="text-slate-400">مبلغ اسمی:</span> <strong class="text-emerald-400 font-mono">{{ formatTomans(selectedDetailItem.face_amount) }} تومان</strong></div>
          <div><span class="text-slate-400">سررسید:</span> <strong class="text-slate-200">{{ selectedDetailItem.due_date }}</strong></div>
          <div><span class="text-slate-400">صادرکننده:</span> <strong class="text-slate-200">{{ selectedDetailItem.issuer_name }}</strong></div>
          <div><span class="text-slate-400">شناسه ملی:</span> <strong class="font-mono text-slate-200">{{ selectedDetailItem.issuer_national_id }}</strong></div>
          <div><span class="text-slate-400">نرخ پیشنهادی:</span> <strong class="text-slate-200">{{ selectedDetailItem.suggested_discount_rate || '۲.۵' }}%</strong></div>
          <div><span class="text-slate-400">ارسال مجدد:</span> <strong class="text-amber-400 font-mono">{{ selectedDetailItem.resubmit_count }} بار</strong></div>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div class="text-slate-400 font-bold mb-1">توضیحات آگهی‌دهنده:</div>
          <p class="text-slate-300 leading-relaxed">«{{ selectedDetailItem.description || 'بدون توضیح' }}»</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2" v-if="selectedDetailItem">
          <NButton secondary @click="showDetailModal = false">بستن</NButton>

          <NButton type="error" secondary @click="() => { showDetailModal = false; openReject(selectedDetailItem!); }">
            رد آگهی
          </NButton>

          <NButton type="primary" class="bg-emerald-600 hover:bg-emerald-500 font-bold" @click="() => { showDetailModal = false; openApprove(selectedDetailItem!); }">
            تأیید و انتشار
          </NButton>
        </div>
      </template>
    </NModal>

    <!-- Approve Confirm Dialog -->
    <ConfirmDialog
      :show="showApproveConfirm"
      title="تأیید و انتشار آگهی چک"
      :message="`آیا از صحت مدارک و انتشار آگهی چک #${itemToApprove?.id} (${itemToApprove?.bank_name}) در بازار عمومی اطمینان دارید؟`"
      confirm-text="تأیید و انتشار"
      :loading="submitting"
      @confirm="confirmApprove"
      @cancel="showApproveConfirm = false"
    />

    <!-- Reject Modal -->
    <NModal
      v-model:show="showRejectModal"
      preset="card"
      title="ثبت علت رد آگهی چک"
      class="max-w-md bg-slate-900 border border-slate-800 text-slate-100"
    >
      <NForm @submit.prevent="submitReject" class="space-y-4">
        <NFormItem label="کد استاندارد علت عدم تأیید:">
          <NSelect v-model:value="rejectionCode" :options="rejectionOptions" />
        </NFormItem>

        <NFormItem label="توضیح کامل برای کاربر جهت اصلاح (الزامی):">
          <NInput
            v-model:value="rejectionNote"
            type="textarea"
            placeholder="علت دقیق رد آگهی مانند ناخوانا بودن اسکن، عدم تطابق کد ملی و..."
            :rows="3"
          />
        </NFormItem>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <NButton secondary @click="showRejectModal = false">انصراف</NButton>
          <NButton type="error" :loading="submitting" attr-type="submit" class="font-bold">
            ثبت رد آگهی
          </NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>
