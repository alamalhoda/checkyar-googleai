<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NDataTable, NButton, NTag, NAlert, NSpin, NSpace, NPagination, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { listingsApi } from '../../api';
import { LISTING_STATUS_LABELS, type ChequeListing, type ListingStatus } from '../../types/api';

const router = useRouter();
const message = useMessage();

const listings = ref<ChequeListing[]>([]);
const loading = ref(true);
const errorMsg = ref('');

// Resubmit modal state
const showResubmitModal = ref(false);
const selectedListingId = ref<number | null>(null);
const resubmitting = ref(false);

const loadMyListings = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await listingsApi.getMyListings();
    listings.value = Array.isArray(res) ? res : (res as any).results || [];
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت لیست آگهی‌های شما.';
  } finally {
    loading.value = false;
  }
};

const statusTagType = (status: ListingStatus) => {
  switch (status) {
    case 'published': return 'success';
    case 'pending_moderation': return 'warning';
    case 'rejected': return 'error';
    case 'matched': return 'info';
    default: return 'default';
  }
};

const openResubmitModal = (id: number) => {
  selectedListingId.value = id;
  showResubmitModal.value = true;
};

const handleResubmit = async () => {
  if (!selectedListingId.value) return;

  resubmitting.value = true;
  try {
    await listingsApi.resubmitListing(selectedListingId.value);
    message.success('آگهی با موفقیت جهت بررسی مجدد به ناظر ارسال گردید.');
    showResubmitModal.value = false;
    await loadMyListings();
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    const code = apiErr?.code || '';
    if (code === 'MOD_306') {
      message.error('حد مجاز ارسال مجدد (حداکثر ۳ بار) برای این آگهی تکمیل شده است.');
    } else {
      message.error(apiErr?.message || 'خطا در ارسال مجدد آگهی.');
    }
  } finally {
    resubmitting.value = false;
  }
};

const columns = [
  {
    title: 'شناسه',
    key: 'id',
    width: 80,
    render: (row: ChequeListing) => h('span', { class: 'font-mono text-xs text-slate-400' }, `#${row.id}`)
  },
  {
    title: 'بانک صادرکننده',
    key: 'bank_name',
    render: (row: ChequeListing) => h('div', { class: 'font-bold text-slate-100' }, row.bank_name)
  },
  {
    title: 'مبلغ اسمی (ریال)',
    key: 'face_amount',
    render: (row: ChequeListing) => h('span', { class: 'font-mono text-emerald-400 font-bold' }, Number(row.face_amount).toLocaleString('fa-IR'))
  },
  {
    title: 'سررسید',
    key: 'due_date',
    render: (row: ChequeListing) => h('span', { class: 'text-xs text-slate-300' }, new Date(row.due_date).toLocaleDateString('fa-IR'))
  },
  {
    title: 'وضعیت آگهی',
    key: 'status',
    render: (row: ChequeListing) => h(NTag, { type: statusTagType(row.status), size: 'small' }, { default: () => LISTING_STATUS_LABELS[row.status] || row.status })
  },
  {
    title: 'دفعات ویرایش',
    key: 'resubmit_count',
    width: 100,
    render: (row: ChequeListing) => h('span', { class: 'text-xs text-slate-400' }, `${row.resubmit_count || 0} / 3`)
  },
  {
    title: 'عملیات',
    key: 'actions',
    render: (row: ChequeListing) => {
      const isEditable = row.status === 'pending_moderation' || row.status === 'rejected';
      const isRejected = row.status === 'rejected';

      return h(NSpace, { size: 'small' }, () => [
        h(NButton, {
          size: 'tiny',
          secondary: true,
          onClick: () => router.push(`/listings/${row.id}`)
        }, { default: () => 'مشاهده' }),

        isEditable ? h(NButton, {
          size: 'tiny',
          type: 'warning',
          secondary: true,
          onClick: () => router.push(`/listings/${row.id}/edit`)
        }, { default: () => 'ویرایش' }) : null,

        h(NButton, {
          size: 'tiny',
          type: 'info',
          secondary: true,
          onClick: () => router.push(`/listings/${row.id}/upload`)
        }, { default: () => 'مدارک' }),

        isRejected ? h(NButton, {
          size: 'tiny',
          type: 'primary',
          onClick: () => openResubmitModal(row.id)
        }, { default: () => 'ارسال مجدد' }) : null
      ]);
    }
  }
];

onMounted(loadMyListings);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-black text-slate-100">آگهی‌های من</h1>
            <p class="text-xs text-slate-400 mt-1">میز کار مدیریت چک‌ها و پیگیری وضعیت بررسی و ارسال مجدد</p>
          </div>
          <NButton type="primary" size="medium" @click="router.push('/listings/create')" class="font-bold">
            + ثبت آگهی جدید
          </NButton>
        </div>

        <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
          {{ errorMsg }}
        </NAlert>

        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-16">
            <NSpin size="large" />
          </div>

          <!-- Empty State -->
          <div v-else-if="listings.length === 0" class="text-center py-16 space-y-3">
            <div class="text-slate-500 text-4xl">📄</div>
            <div class="text-slate-300 font-bold">هنوز هیچ آگهی چکی ثبت نکرده‌اید.</div>
            <p class="text-xs text-slate-500">جهت فروش چک صیادی خود، دکمه ثبت آگهی جدید را فشار دهید.</p>
            <NButton type="primary" size="small" @click="router.push('/listings/create')">
              ثبت اولین آگهی
            </NButton>
          </div>

          <!-- Data Table -->
          <div v-else class="overflow-x-auto">
            <NDataTable
              :columns="columns"
              :data="listings"
              :bordered="false"
              class="text-xs"
            />
          </div>
        </NCard>
      </main>
    </div>

    <!-- Confirm Resubmit Modal -->
    <ConfirmDialog
      :show="showResubmitModal"
      title="ارسال مجدد جهت بررسی ناظر"
      message="آیا از ارسال مجدد این آگهی پس از اصلاح مدارک و اطلاعات اطمینان دارید؟ توجه داشته باشید که حداکثر ۳ بار امکان ارسال مجدد وجود دارد."
      confirm-text="ارسال مجدد آگهی"
      :loading="resubmitting"
      @confirm="handleResubmit"
      @cancel="showResubmitModal = false"
    />
  </div>
</template>
