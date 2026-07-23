<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NAlert, NSpin, useMessage } from 'naive-ui';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { matchesApi, marketplaceApi } from '../../api';
import { useAuthStore } from '../../stores/auth';
import type { SettlementType, MarketplaceListing } from '../../types/api';

const route = useRoute();
const router = useRouter();
const messageStore = useMessage();
const authStore = useAuthStore();

const listingId = computed(() => Number(route.params.listingId));
const listing = ref<MarketplaceListing | null>(null);

const settlementType = ref<SettlementType>('off_platform');
const message = ref('با سلام، اینجانب آماده خرید این چک صیادی با شرایط و نرخ تنزیل اعلامی هستم.');
const loading = ref(false);
const submitting = ref(false);
const errorMsg = ref('');
const showConfirmModal = ref(false);

const settlementOptions = [
  { label: 'تسویه خارج از پلتفرم و توافقی (Off-Platform Settlement)', value: 'off_platform' },
  { label: 'تسویه امانی پلتفرم (Escrow)', value: 'escrow' },
  { label: 'تسویه در دفتر اسناد رسمی (Principal Ledger)', value: 'principal_ledger' }
];

const isInvestor = computed(() => authStore.userRole === 'investor');

const formatTomans = (amountStr: string) => {
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return Math.floor(num / 10).toLocaleString('fa-IR');
};

const loadListing = async () => {
  if (!listingId.value) return;
  loading.value = true;
  errorMsg.value = '';
  try {
    listing.value = await marketplaceApi.getListingDetail(listingId.value);
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در بارگذاری مشخصات آگهی.';
  } finally {
    loading.value = false;
  }
};

const triggerSubmit = () => {
  if (!isInvestor.value) {
    errorMsg.value = 'تنها کاربران با نقش «سرمایه‌گذار» امکان ثبت پیشنهاد خرید را دارند. لطفاً نقش حساب خود را در پروفایل تغییر دهید.';
    return;
  }
  showConfirmModal.value = true;
};

const handleConfirmExpress = async () => {
  showConfirmModal.value = false;
  submitting.value = true;
  errorMsg.value = '';

  try {
    await matchesApi.createMatch({
      listing_id: listingId.value,
      message: message.value,
      settlement_type: settlementType.value
    });

    messageStore.success('ابراز تمایل و پیشنهاد خرید شما با موفقیت به دارنده چک ارسال شد.');
    router.push('/matches');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در ثبت ابراز تمایل.';
  } finally {
    submitting.value = false;
  }
};

onMounted(loadListing);
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <NButton secondary size="small" @click="router.back()">← انصراف</NButton>
            <div>
              <h1 class="text-2xl font-black text-slate-100">ثبت ابراز تمایل و پیشنهاد خرید</h1>
              <p class="text-xs text-slate-400 mt-1">ارسال پیام رسمی برای دارنده چک جهت شروع فرآیند انتقال و تسویه</p>
            </div>
          </div>
        </div>

        <!-- Role Warning if not investor -->
        <NAlert v-if="!isInvestor" type="warning" class="my-2">
          نقش فعلی شما در سامانه «دارنده چک» است. ابراز تمایل برای خرید چک مخصوص کاربران با نقش «سرمایه‌گذار» می‌باشد.
        </NAlert>

        <NSpin :show="loading">
          <div v-if="listing" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Listing Summary Card -->
            <NCard class="md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl h-fit">
              <div class="border-b border-slate-800 pb-3 mb-3">
                <span class="text-xs text-slate-400">خلاصه آگهی هدف:</span>
                <h3 class="text-lg font-bold text-slate-100 mt-1">{{ listing.bank_name }}</h3>
                <p class="text-xs text-slate-400 font-mono">صیاد: {{ listing.cheque_serial_number }}</p>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <span class="text-slate-400">مبلغ اسمی:</span>
                  <div class="text-lg font-black text-emerald-400">
                    {{ formatTomans(listing.face_amount) }} <span class="text-xs text-slate-400 font-normal">تومان</span>
                  </div>
                </div>

                <div class="flex justify-between border-t border-slate-800/80 pt-2">
                  <span class="text-slate-400">سررسید:</span>
                  <span class="font-bold text-slate-200">{{ listing.due_date }}</span>
                </div>

                <div class="flex justify-between border-t border-slate-800/80 pt-2">
                  <span class="text-slate-400">روز تا سررسید:</span>
                  <span class="font-bold text-amber-400">{{ listing.days_to_due }} روز</span>
                </div>

                <div class="flex justify-between border-t border-slate-800/80 pt-2">
                  <span class="text-slate-400">نرخ تنزیل پیشنهادی:</span>
                  <span class="font-bold text-indigo-400">{{ listing.suggested_discount_rate || '۲.۵' }}٪/ماه</span>
                </div>
              </div>
            </NCard>

            <!-- Proposal Form -->
            <NCard class="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
              <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
                {{ errorMsg }}
              </NAlert>

              <NForm @submit.prevent="triggerSubmit" class="space-y-5">
                <NFormItem label="روش تسویه پیشنهادی">
                  <NSelect v-model:value="settlementType" :options="settlementOptions" size="large" />
                </NFormItem>

                <NFormItem label="پیام و شرایط پیشنهادی شما به دارنده چک">
                  <NInput
                    v-model:value="message"
                    type="textarea"
                    placeholder="توضیحات مربوط به نحوه پرداخت، هماهنگی حضور یا انتقال صیادی..."
                    :rows="5"
                  />
                </NFormItem>

                <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  <span class="font-bold text-amber-400">تذکر مهم امنیتی:</span> تسویه مبالغ چک‌ها تماماً خارج از سیستم صرافی یا به روش‌های توافقی انجام پذیر است. پلتفرم چک‌ریار هیچ‌گونه درگاه پرداخت الکترونیکی یا کیف پول برخط جهت تسویه مالی ندارد.
                </div>

                <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <NButton secondary @click="router.back()">انصراف</NButton>
                  <NButton
                    type="primary"
                    size="large"
                    :loading="submitting"
                    :disabled="!isInvestor"
                    attr-type="submit"
                    class="font-bold px-8 bg-emerald-600 hover:bg-emerald-500"
                  >
                    ارسال پیشنهاد خرید به دارنده چک
                  </NButton>
                </div>
              </NForm>
            </NCard>
          </div>
        </NSpin>
      </main>
    </div>

    <ConfirmDialog
      :show="showConfirmModal"
      title="تأیید ارسال ابراز تمایل"
      message="آیا از ارسال درخواست ابراز تمایل برای خرید این چک اطمینان دارید؟ اطلاعات تماس شما پس از پذیرش توسط دارنده چک به ایشان نمایش داده خواهد شد."
      confirm-text="ارسال قطعی درخواست"
      :loading="submitting"
      @confirm="handleConfirmExpress"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
