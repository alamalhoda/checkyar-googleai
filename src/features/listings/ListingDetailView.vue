<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard, NTag, NButton, NSpin, NAlert, NDescriptions, NDescriptionsItem, NDivider, useMessage
} from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { listingsApi, complianceApi } from '../../api';
import { useAuthStore } from '../../stores/auth';
import { LISTING_STATUS_LABELS, type ChequeListing, type ListingStatus } from '../../types/api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const listingId = computed(() => Number(route.params.id));
const listing = ref<ChequeListing | null>(null);
const loading = ref(true);
const errorMsg = ref('');

// Sayad Inquiry State
const sayadInquiring = ref(false);
const sayadStatus = ref<any>(null);

// Resubmit modal
const showResubmitModal = ref(false);
const resubmitting = ref(false);

const isOwner = computed(() => {
  if (!listing.value || !authStore.user) return false;
  return listing.value.owner_id === authStore.user.id;
});

const isInvestor = computed(() => {
  return authStore.user?.role === 'investor';
});

const loadListingDetail = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await listingsApi.getListing(listingId.value);
    listing.value = res;
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت جزئیات آگهی.';
  } finally {
    loading.value = false;
  }
};

const handleSayadInquiry = async () => {
  if (!listing.value?.cheque_serial_number) return;
  sayadInquiring.value = true;
  try {
    const res = await complianceApi.inquireSayadStatus(listing.value.cheque_serial_number);
    sayadStatus.value = res;
    message.success('استعلام وضعیت صیاد از بانک مرکزی با موفقیت انجام شد.');
  } catch (err: any) {
    message.error('خطا در دریافت وضعیت صیاد.');
  } finally {
    sayadInquiring.value = false;
  }
};

const handleResubmit = async () => {
  if (!listing.value) return;
  resubmitting.value = true;
  try {
    const updated = await listingsApi.resubmitListing(listing.value.id);
    listing.value = updated;
    message.success('آگهی مجددا ارسال شد.');
    showResubmitModal.value = false;
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    if (apiErr?.code === 'MOD_306') {
      message.error('حد مجاز ارسال مجدد (حداکثر ۳ بار) برای این آگهی تکمیل شده است.');
    } else {
      message.error(apiErr?.message || 'خطا در ارسال مجدد.');
    }
  } finally {
    resubmitting.value = false;
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

onMounted(loadListingDetail);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <NButton secondary size="small" @click="router.back()">← بازگشت</NButton>
            <div>
              <h1 class="text-2xl font-black text-slate-100">جزئیات آگهی چک صیادی</h1>
              <p class="text-xs text-slate-400 mt-1">شناسه آگهی: #{{ listingId }}</p>
            </div>
          </div>

          <NTag v-if="listing" :type="statusTagType(listing.status)" size="large">
            {{ LISTING_STATUS_LABELS[listing.status] || listing.status }}
          </NTag>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <!-- Error State -->
        <NAlert v-else-if="errorMsg && !listing" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <!-- Empty State -->
        <div v-else-if="!listing" class="text-center py-16 text-slate-400">
          آگهی مورد نظر یافت نشد.
        </div>

        <!-- Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Details Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Cheque Overview Card -->
            <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <template #header>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-100 text-lg">{{ listing.bank_name }}</span>
                  <span class="text-emerald-400 font-extrabold text-xl">
                    {{ Number(listing.face_amount).toLocaleString('fa-IR') }} ریال
                  </span>
                </div>
              </template>

              <!-- Rejection Notice Banner -->
              <NAlert v-if="listing.status === 'rejected'" type="error" class="mb-6 text-xs" title="دلایل رد آگهی توسط ناظر">
                <p>{{ listing.rejection_reason || 'آگهی مطابق با دستورالعمل‌های انتظامی/اعتباری تشخیص داده نشد.' }}</p>
                <p v-if="listing.rejection_code" class="mt-1 font-mono">کد خطا: {{ listing.rejection_code }}</p>
                <p class="mt-2 text-slate-300">دفعات ارسال مجدد انجام شده: {{ listing.resubmit_count }} از ۳</p>
              </NAlert>

              <NDescriptions column="2" label-placement="left" class="text-xs space-y-2">
                <NDescriptionsItem label="شماره صیادی ۱۶ رقمی">
                  <span class="font-mono text-slate-200 font-bold tracking-wider">{{ listing.cheque_serial_number }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="تاریخ سررسید">
                  <span class="text-slate-200 font-bold">{{ new Date(listing.due_date).toLocaleDateString('fa-IR') }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="نوع صادرکننده">
                  <span>{{ listing.issuer_type === 'legal' ? 'شخص حقوقی (شرکت)' : 'شخص حقیقی' }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="عنوان صادرکننده">
                  <span class="font-bold text-slate-200">{{ listing.issuer_name }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="شناسه/کد ملی صادرکننده">
                  <span class="font-mono text-slate-300">{{ listing.issuer_national_id }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="نرخ تنزیل پیشنهادی">
                  <span class="text-emerald-400 font-bold">{{ listing.suggested_discount_rate || '-' }}٪ ماهانه</span>
                </NDescriptionsItem>
              </NDescriptions>

              <NDivider class="my-4" />

              <div class="text-xs text-slate-300 leading-relaxed">
                <span class="font-bold text-slate-400 block mb-1">توضیحات آگهی:</span>
                {{ listing.description || 'توضیحات بیشتری ثبت نشده است.' }}
              </div>
            </NCard>

            <!-- Documents List Card -->
            <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl" title="مدارک و تصاویر مربوطه">
              <div v-if="!listing.documents || listing.documents.length === 0" class="text-xs text-slate-500 py-4 text-center">
                هنوز هیچ مدرکی برای این آگهی بارگذاری نشده است.
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="doc in listing.documents"
                  :key="doc.id"
                  class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div class="font-bold text-slate-200">{{ doc.document_type }}</div>
                    <div class="text-slate-500 text-[10px]">{{ doc.file_name || 'document.pdf' }}</div>
                  </div>
                  <NTag type="success" size="tiny">ضمیمه شده</NTag>
                </div>
              </div>
            </NCard>
          </div>

          <!-- Actions Sidebar Column -->
          <div class="space-y-6">
            <!-- Owner Actions Card -->
            <NCard v-if="isOwner" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl" title="عملیات دارنده چک">
              <div class="space-y-3">
                <NButton
                  v-if="listing.status === 'pending_moderation' || listing.status === 'rejected'"
                  type="warning"
                  block
                  @click="router.push(`/listings/${listing.id}/edit`)"
                >
                  ✏️ ویرایش مشخصات آگهی
                </NButton>

                <NButton
                  type="info"
                  secondary
                  block
                  @click="router.push(`/listings/${listing.id}/upload`)"
                >
                  📁 آپلود مدرک مکمل
                </NButton>

                <NButton
                  v-if="listing.status === 'rejected'"
                  type="primary"
                  block
                  @click="showResubmitModal = true"
                >
                  🔄 ارسال مجدد جهت بررسی ناظر
                </NButton>
              </div>
            </NCard>

            <!-- Investor Actions Card -->
            <NCard v-if="isInvestor && listing.status === 'published'" class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl" title="عملیات سرمایه‌گذار">
              <div class="space-y-3">
                <p class="text-xs text-slate-400">
                  اگر به خرید این چک تمایل دارید، دکمه ابراز تمایل را برای شروع فرآیند معامله بفشارید.
                </p>
                <NButton
                  type="primary"
                  block
                  size="large"
                  class="font-bold bg-emerald-600 hover:bg-emerald-500"
                  @click="router.push(`/matches/express-interest/${listing.id}`)"
                >
                  🤝 ابراز تمایل خرید چک
                </NButton>
              </div>
            </NCard>

            <!-- Sayad Compliance Inquiry Card -->
            <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl" title="استعلام صیاد بانک مرکزی">
              <div class="space-y-3">
                <p class="text-xs text-slate-400">
                  بررسی وضعیت سفید/چک‌های برگشتی صادرکننده از سامانه صیاد.
                </p>

                <NButton
                  secondary
                  block
                  size="medium"
                  :loading="sayadInquiring"
                  @click="handleSayadInquiry"
                >
                  🔍 استعلام آنلاین صیاد
                </NButton>

                <div v-if="sayadStatus" class="bg-emerald-950/40 border border-emerald-800 p-3 rounded-xl text-xs space-y-1">
                  <div class="font-bold text-emerald-400">{{ sayadStatus.status_display }}</div>
                  <div class="text-[10px] text-slate-400">تاریخ استعلام: {{ new Date(sayadStatus.inquiry_time).toLocaleTimeString('fa-IR') }}</div>
                </div>
              </div>
            </NCard>
          </div>
        </div>
      </main>
    </div>

    <!-- Confirm Resubmit Dialog -->
    <ConfirmDialog
      :show="showResubmitModal"
      title="ارسال مجدد آگهی"
      message="آیا از ارسال مجدد این آگهی جهت بررسی ناظر اطمینان دارید؟"
      confirm-text="ارسال مجدد"
      :loading="resubmitting"
      @confirm="handleResubmit"
      @cancel="showResubmitModal = false"
    />
  </div>
</template>
