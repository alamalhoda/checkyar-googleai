<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard, NButton, NSpin, NEmpty, NTag, NModal, NInput, NSelect,
  NForm, NFormItem, NAlert, useMessage
} from 'naive-ui';
import {
  PersonOutline, CheckmarkCircleOutline, CloseCircleOutline,
  DocumentTextOutline, RefreshOutline, EyeOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { moderationApi } from '../../api';
import type { Verification, RejectionCode } from '../../types/api';
import { REJECTION_CODE_LABELS } from '../../types/api';

const message = useMessage();

const kycItems = ref<Verification[]>([]);
const loading = ref(false);
const submitting = ref(false);

// Approve confirm modal
const showApproveModal = ref(false);
const itemToApprove = ref<Verification | null>(null);

// Reject modal
const showRejectModal = ref(false);
const itemToReject = ref<Verification | null>(null);
const rejectionCode = ref<RejectionCode>('MOD_101');
const rejectionNote = ref('');

// Document preview modal
const showDocPreviewModal = ref(false);
const selectedDocUrl = ref('');
const selectedDocTitle = ref('');

const rejectionOptions = Object.entries(REJECTION_CODE_LABELS).map(([code, label]) => ({
  label: `${code} - ${label}`,
  value: code as RejectionCode
}));

const loadKycQueue = async () => {
  loading.value = true;
  try {
    kycItems.value = await moderationApi.getKycQueue();
  } catch (err: any) {
    message.error('خطا در دریافت لیست احراز هویت در انتظار.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadKycQueue);

const triggerApprove = (item: Verification) => {
  itemToApprove.value = item;
  showApproveModal.value = true;
};

const handleConfirmApprove = async () => {
  if (!itemToApprove.value) return;
  submitting.value = true;
  try {
    await moderationApi.submitKycDecision(itemToApprove.value.id, { decision: 'approve' });
    message.success(`احراز هویت ${itemToApprove.value.full_name} با موفقیت تایید شد.`);
    showApproveModal.value = false;
    await loadKycQueue();
  } catch (err: any) {
    message.error('خطا در تایید احراز هویت.');
  } finally {
    submitting.value = false;
  }
};

const triggerReject = (item: Verification) => {
  itemToReject.value = item;
  rejectionCode.value = 'MOD_101';
  rejectionNote.value = '';
  showRejectModal.value = true;
};

const handleConfirmReject = async () => {
  if (!itemToReject.value) return;
  if (!rejectionNote.value.trim()) {
    message.warning('لطفاً علت رد مدارک را وارد نمایید.');
    return;
  }

  submitting.value = true;
  try {
    await moderationApi.submitKycDecision(itemToReject.value.id, {
      decision: 'reject',
      rejection_code: rejectionCode.value,
      rejection_note: rejectionNote.value
    });
    message.warning(`مدارک ${itemToReject.value.full_name} رد شد.`);
    showRejectModal.value = false;
    await loadKycQueue();
  } catch (err: any) {
    message.error('خطا در ثبت عدم تایید مدارک.');
  } finally {
    submitting.value = false;
  }
};

const openDocPreview = (docType: string, fileUrl: string) => {
  selectedDocTitle.value = getDocumentTypeLabel(docType);
  selectedDocUrl.value = fileUrl || 'https://via.placeholder.com/600x400?text=Scan+Document';
  showDocPreviewModal.value = true;
};

const getDocumentTypeLabel = (type: string) => {
  switch (type) {
    case 'national_id_front':
      return 'روی کارت ملی';
    case 'national_id_back':
      return 'پشت کارت ملی';
    case 'selfie':
      return 'تصویر سلفی و تعهدنامه';
    case 'id_document':
      return 'روزنامه رسمی / مدارک ثبتی';
    default:
      return 'مدرک پیوست';
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <PersonOutline class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-100">صف بررسی احراز هویت (KYC)</h1>
              <p class="text-xs text-slate-400 mt-0.5">بررسی اسناد هویتی، تصاویر کارت ملی و استعلام کد ملی کاربران</p>
            </div>
          </div>

          <NButton secondary size="small" :loading="loading" @click="loadKycQueue">
            <template #icon><RefreshOutline class="w-4 h-4" /></template>
            بروزرسانی صف
          </NButton>
        </div>

        <NSpin :show="loading">
          <div v-if="kycItems.length > 0" class="space-y-4">
            <NCard
              v-for="item in kycItems"
              :key="item.id"
              class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all"
            >
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <!-- User Details -->
                <div class="space-y-3 flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <h3 class="text-base font-bold text-slate-100">{{ item.full_name }}</h3>
                    <NTag size="small" type="warning" round class="font-bold">
                      در انتظار بررسی
                    </NTag>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span class="text-slate-400">کد ملی / شناسه:</span>
                      <strong class="font-mono text-slate-200 mr-1">{{ item.national_id }}</strong>
                    </div>
                    <div v-if="item.company_name">
                      <span class="text-slate-400">نام مجموعه/شرکت:</span>
                      <strong class="text-slate-200 mr-1">{{ item.company_name }}</strong>
                    </div>
                  </div>

                  <!-- Submitted Documents Links -->
                  <div class="space-y-1.5">
                    <div class="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <DocumentTextOutline class="w-4 h-4 text-indigo-400" />
                      مدارک بارگذاری‌شده:
                    </div>
                    <div v-if="item.documents && item.documents.length > 0" class="flex flex-wrap gap-2">
                      <NButton
                        v-for="doc in item.documents"
                        :key="doc.id"
                        size="small"
                        secondary
                        class="text-xs"
                        @click="openDocPreview(doc.document_type, doc.file)"
                      >
                        <template #icon><EyeOutline class="w-3.5 h-3.5 text-emerald-400" /></template>
                        {{ getDocumentTypeLabel(doc.document_type) }}
                      </NButton>
                    </div>
                    <div v-else class="text-xs text-slate-500 italic">
                      هیچ مدرک تصوری پیوست نشده است.
                    </div>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
                  <NButton
                    size="small"
                    type="error"
                    secondary
                    :loading="submitting"
                    @click="triggerReject(item)"
                  >
                    <template #icon><CloseCircleOutline class="w-4 h-4" /></template>
                    رد مدارک
                  </NButton>

                  <NButton
                    size="small"
                    type="primary"
                    class="font-bold bg-emerald-600 hover:bg-emerald-500"
                    :loading="submitting"
                    @click="triggerApprove(item)"
                  >
                    <template #icon><CheckmarkCircleOutline class="w-4 h-4" /></template>
                    تأیید احراز هویت
                  </NButton>
                </div>
              </div>
            </NCard>
          </div>

          <NEmpty
            v-else
            description="در حال حاضر هیچ پرونده احراز هویتی در انتظار بررسی وجود ندارد."
            class="py-20 bg-slate-900 border border-slate-800 rounded-2xl"
          />
        </NSpin>
      </main>
    </div>

    <!-- Document Preview Modal -->
    <NModal
      v-model:show="showDocPreviewModal"
      preset="card"
      :title="`پیش‌نمایش مدرک: ${selectedDocTitle}`"
      class="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100"
    >
      <div class="flex justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
        <img
          :src="selectedDocUrl"
          alt="اسکن مدرک"
          class="max-h-[70vh] object-contain rounded-lg shadow-lg"
          @error="(e: any) => { e.target.src = 'https://via.placeholder.com/600x400?text=%D8%AA%D8%B5%D romantic%D8%B1+%D9%85%D8%AF%D8%B1%DA%A9'; }"
        />
      </div>
      <template #footer>
        <div class="flex justify-end">
          <NButton secondary @click="showDocPreviewModal = false">بستن</NButton>
        </div>
      </template>
    </NModal>

    <!-- Approve Confirm Dialog -->
    <ConfirmDialog
      :show="showApproveModal"
      title="تأیید نهایی احراز هویت"
      :message="`آیا از صحت مدارک و تأیید هویت کاربری «${itemToApprove?.full_name}» (کد ملی ${itemToApprove?.national_id}) اطمینان دارید؟`"
      confirm-text="تأیید و ارتقا حساب"
      :loading="submitting"
      @confirm="handleConfirmApprove"
      @cancel="showApproveModal = false"
    />

    <!-- Reject Modal -->
    <NModal
      v-model:show="showRejectModal"
      preset="card"
      title="رد مدارک احراز هویت"
      class="max-w-md bg-slate-900 border border-slate-800 text-slate-100"
    >
      <NForm @submit.prevent="handleConfirmReject" class="space-y-4">
        <NFormItem label="کد علت رد مدارک:">
          <NSelect v-model:value="rejectionCode" :options="rejectionOptions" />
        </NFormItem>

        <NFormItem label="توضیحات و راهنمایی جهت بارگذاری مجدد:">
          <NInput
            v-model:value="rejectionNote"
            type="textarea"
            placeholder="مثلاً: تصویر پشت کارت ملی تار و ناخوانا است..."
            :rows="3"
          />
        </NFormItem>

        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <NButton secondary @click="showRejectModal = false">انصراف</NButton>
          <NButton type="error" :loading="submitting" attr-type="submit" class="font-bold">
            ثبت عدم تأیید
          </NButton>
        </div>
      </NForm>
    </NModal>
  </div>
</template>
