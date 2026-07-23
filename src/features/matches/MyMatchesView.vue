<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NTabs, NTabPane, NTag, NButton, NSpin, NEmpty, NModal, NInput,
  NForm, NFormItem, NAlert, useMessage
} from 'naive-ui';
import {
  CheckmarkCircleOutline, CloseCircleOutline, BanOutline,
  CallOutline, MailOutline, PersonOutline, BusinessOutline,
  CalendarOutline, CashOutline, SwapHorizontalOutline, DocumentTextOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { matchesApi } from '../../api';
import { useAuthStore } from '../../stores/auth';
import type { Match, MatchStatus } from '../../types/api';
import { MATCH_STATUS_LABELS } from '../../types/api';

const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();

const matches = ref<Match[]>([]);
const loading = ref(true);
const actionLoading = ref(false);
const activeTab = ref<'received' | 'sent'>('received');

// Modal states
const showDeclineModal = ref(false);
const selectedMatchForDecline = ref<number | null>(null);
const declineNote = ref('');

const showConfirmModal = ref(false);
const confirmTitle = ref('');
const confirmMessageText = ref('');
const confirmActionType = ref<'accept' | 'cancel' | 'confirm_off_platform'>('accept');
const selectedMatchForConfirm = ref<number | null>(null);

const formatTomans = (amountStr: string) => {
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return Math.floor(num / 10).toLocaleString('fa-IR');
};

const currentUserId = computed(() => authStore.user?.id || 1);

// Filter matches into Received (check_holder is me) and Sent (investor is me)
const receivedMatches = computed(() => {
  return matches.value.filter(m => m.check_holder.id === currentUserId.value || authStore.userRole === 'check_holder');
});

const sentMatches = computed(() => {
  return matches.value.filter(m => m.investor.id === currentUserId.value || authStore.userRole === 'investor');
});

const loadMatches = async () => {
  loading.value = true;
  try {
    const res = await matchesApi.getMyMatches();
    matches.value = res;
  } catch (err: any) {
    message.error('خطا در دریافت لیست پیشنهادها و تطابق‌ها.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (authStore.userRole === 'investor') {
    activeTab.value = 'sent';
  } else {
    activeTab.value = 'received';
  }
  loadMatches();
});

const getStatusTagType = (status: MatchStatus) => {
  switch (status) {
    case 'accepted':
    case 'settled':
      return 'success';
    case 'pending':
      return 'warning';
    case 'declined':
    case 'cancelled':
      return 'error';
    case 'off_platform_confirmed':
      return 'info';
    default:
      return 'default';
  }
};

// --- Match Actions ---

const triggerAccept = (matchId: number) => {
  selectedMatchForConfirm.value = matchId;
  confirmActionType.value = 'accept';
  confirmTitle.value = 'پذیرش درخواست پیشنهاد خرید';
  confirmMessageText.value = 'با پذیرش این پیشنهاد، آگهی به حالت «تطابق یافته» تغییر کرده و اطلاعات تماس شما برای سرمایه‌گذار نمایان می‌گردد.';
  showConfirmModal.value = true;
};

const triggerCancel = (matchId: number) => {
  selectedMatchForConfirm.value = matchId;
  confirmActionType.value = 'cancel';
  confirmTitle.value = 'لغو فرآیند تطابق';
  confirmMessageText.value = 'آیا از لغو این درخواست اطمینان دارید؟ این عملیات قابل بازگشت نیست.';
  showConfirmModal.value = true;
};

const triggerConfirmOffPlatform = (matchId: number) => {
  selectedMatchForConfirm.value = matchId;
  confirmActionType.value = 'confirm_off_platform';
  confirmTitle.value = 'تأیید تسویه و انتقال خارج از پلتفرم';
  confirmMessageText.value = 'با تأیید نهایی، چک صیادی تسویه شده تلقی گردیده و پرونده تطابق مختومه می‌گردد.';
  showConfirmModal.value = true;
};

const handleConfirmAction = async () => {
  if (!selectedMatchForConfirm.value) return;
  showConfirmModal.value = false;
  actionLoading.value = true;

  try {
    const matchId = selectedMatchForConfirm.value;
    if (confirmActionType.value === 'accept') {
      await matchesApi.acceptMatch(matchId);
      message.success('درخواست خرید با موفقیت پذیرفته شد.');
    } else if (confirmActionType.value === 'cancel') {
      await matchesApi.cancelMatch(matchId);
      message.warning('درخواست با موفقیت لغو گردید.');
    } else if (confirmActionType.value === 'confirm_off_platform') {
      await matchesApi.confirmOffPlatform(matchId);
      message.success('تسویه نهایی چک خارج از پلتفرم ثبت گردید.');
    }
    await loadMatches();
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    message.error(apiErr?.message || err?.message || 'خطا در اجرای عملیات.');
  } finally {
    actionLoading.value = false;
  }
};

const openDeclineModal = (matchId: number) => {
  selectedMatchForDecline.value = matchId;
  declineNote.value = '';
  showDeclineModal.value = true;
};

const handleDeclineSubmit = async () => {
  if (!selectedMatchForDecline.value) return;
  actionLoading.value = true;
  try {
    await matchesApi.declineMatch(selectedMatchForDecline.value, declineNote.value);
    message.info('پیشنهاد خرید رد شد.');
    showDeclineModal.value = false;
    await loadMatches();
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    message.error(apiErr?.message || err?.message || 'خطا در رد پیشنهاد.');
  } finally {
    actionLoading.value = false;
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
          <div>
            <h1 class="text-2xl font-black text-slate-100">مدیریت پیشنهادها و تطابق‌ها</h1>
            <p class="text-xs text-slate-400 mt-1">مشاهده، پذیرش و پیگیری فرآیند تسویه چک‌های صیادی</p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <NTabs v-model:value="activeTab" type="line" animated class="custom-tabs">
          <NTabPane name="received" :tab="`پیشنهادهای دریافتی (دارنده چک) [${receivedMatches.length}]`" />
          <NTabPane name="sent" :tab="`پیشنهادهای ارسالی (سرمایه‌گذار) [${sentMatches.length}]`" />
        </NTabs>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <div v-else class="space-y-4">
          <!-- Received Matches Tab -->
          <template v-if="activeTab === 'received'">
            <div v-if="receivedMatches.length > 0" class="space-y-4">
              <NCard
                v-for="item in receivedMatches"
                :key="item.id"
                class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all"
              >
                <!-- Card Header -->
                <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                      <SwapHorizontalOutline class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="text-base font-bold text-slate-100">{{ item.listing.bank_name }}</h3>
                      <p class="text-xs text-slate-400">شناسه آگهی: #{{ item.listing.id }} | تاریخ ثبت پیشنهاد: {{ new Date(item.created_at).toLocaleDateString('fa-IR') }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <NTag :type="getStatusTagType(item.status)" size="medium" round class="font-bold">
                      {{ MATCH_STATUS_LABELS[item.status] || item.status }}
                    </NTag>
                  </div>
                </div>

                <!-- Main Body Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <!-- Listing Info -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold">مشخصات چک صیادی:</div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">مبلغ اسمی:</span>
                      <span class="font-black text-emerald-400">{{ formatTomans(item.listing.face_amount) }} تومان</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">تاریخ سررسید:</span>
                      <span class="text-slate-200">{{ item.listing.due_date }}</span>
                    </div>
                  </div>

                  <!-- Investor Info -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold flex items-center gap-1">
                      <PersonOutline class="w-4 h-4 text-indigo-400" />
                      متقاضی خرید (سرمایه‌گذار):
                    </div>
                    <div class="font-bold text-slate-100 text-sm">{{ item.investor.name }}</div>

                    <!-- Show contact info IF status is accepted or completed -->
                    <div v-if="item.status === 'accepted' || item.status === 'settled' || item.status === 'off_platform_confirmed'" class="mt-2 pt-2 border-t border-slate-800 text-emerald-400 font-mono space-y-1">
                      <div class="flex items-center gap-1">
                        <CallOutline class="w-3.5 h-3.5" />
                        <span>تلفن تماس: {{ item.investor.phone || '۰۹۱۲۳۴۵۶۷۸۹' }}</span>
                      </div>
                      <div v-if="item.investor.email" class="flex items-center gap-1 text-[11px] text-slate-300">
                        <MailOutline class="w-3.5 h-3.5" />
                        <span>ایمیل: {{ item.investor.email }}</span>
                      </div>
                    </div>
                    <div v-else class="text-[11px] text-slate-500 italic mt-1">
                      (اطلاعات تماس پس از پذیرش پیشنهاد نمایان می‌شود)
                    </div>
                  </div>

                  <!-- Message & Terms -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold">پیام متقاضی:</div>
                    <p class="text-slate-300 leading-relaxed italic line-clamp-3">«{{ item.message || 'بدون پیام اولیه' }}»</p>
                  </div>
                </div>

                <!-- Unmasked Contact Card Banner for Accepted Matches -->
                <NAlert v-if="item.status === 'accepted'" type="success" class="mb-4 text-xs">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong class="font-bold">پیشنهاد پذیرفته شده است!</strong>
                      <p class="mt-0.5">جهت هماهنگی انتقال صیادی و تسویه وجه چک، با سرمایه‌گذار با شماره <span class="font-mono font-bold dir-ltr inline-block">{{ item.investor.phone || '۰۹۱۲۳۴۵۶۷۸۹' }}</span> تماس حاصل فرمایید.</p>
                    </div>
                    <NButton size="small" type="primary" class="shrink-0 font-bold" @click="triggerConfirmOffPlatform(item.id)">
                      ثبت و تأیید تسویه کامل
                    </NButton>
                  </div>
                </NAlert>

                <!-- Actions Footer -->
                <div class="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 gap-2">
                  <NButton text size="small" class="text-slate-400" @click="router.push(`/listings/${item.listing.id}`)">
                    مشاهده جزئیات آگهی چک
                  </NButton>

                  <div class="flex items-center gap-2">
                    <!-- Pending Actions for Check Holder -->
                    <template v-if="item.status === 'pending'">
                      <NButton size="small" type="error" secondary @click="openDeclineModal(item.id)">
                        <template #icon><CloseCircleOutline class="w-4 h-4" /></template>
                        رد پیشنهاد
                      </NButton>
                      <NButton size="small" type="primary" class="font-bold bg-emerald-600 hover:bg-emerald-500" @click="triggerAccept(item.id)">
                        <template #icon><CheckmarkCircleOutline class="w-4 h-4" /></template>
                        پذیرش پیشنهاد خرید
                      </NButton>
                    </template>

                    <NButton
                      v-if="item.status === 'pending' || item.status === 'accepted'"
                      size="small"
                      tertiary
                      @click="triggerCancel(item.id)"
                    >
                      لغو درخواست
                    </NButton>
                  </div>
                </div>
              </NCard>
            </div>

            <NEmpty v-else description="هیچ پیشنهاد دریافتی در این بخش وجود ندارد." class="py-20 bg-slate-900 border border-slate-800 rounded-2xl" />
          </template>

          <!-- Sent Matches Tab -->
          <template v-if="activeTab === 'sent'">
            <div v-if="sentMatches.length > 0" class="space-y-4">
              <NCard
                v-for="item in sentMatches"
                :key="item.id"
                class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition-all"
              >
                <!-- Card Header -->
                <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                      <CashOutline class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="text-base font-bold text-slate-100">{{ item.listing.bank_name }}</h3>
                      <p class="text-xs text-slate-400">شناسه آگهی: #{{ item.listing.id }} | تاریخ ارسال پیشنهاد: {{ new Date(item.created_at).toLocaleDateString('fa-IR') }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <NTag :type="getStatusTagType(item.status)" size="medium" round class="font-bold">
                      {{ MATCH_STATUS_LABELS[item.status] || item.status }}
                    </NTag>
                  </div>
                </div>

                <!-- Body Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <!-- Listing Info -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold">مشخصات چک صیادی:</div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">مبلغ اسمی:</span>
                      <span class="font-black text-emerald-400">{{ formatTomans(item.listing.face_amount) }} تومان</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">تاریخ سررسید:</span>
                      <span class="text-slate-200">{{ item.listing.due_date }}</span>
                    </div>
                  </div>

                  <!-- Check Holder Info -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold flex items-center gap-1">
                      <PersonOutline class="w-4 h-4 text-emerald-400" />
                      دارنده و فروشنده چک:
                    </div>
                    <div class="font-bold text-slate-100 text-sm">{{ item.check_holder.name }}</div>

                    <!-- Show contact info IF status is accepted or completed -->
                    <div v-if="item.status === 'accepted' || item.status === 'settled' || item.status === 'off_platform_confirmed'" class="mt-2 pt-2 border-t border-slate-800 text-emerald-400 font-mono space-y-1">
                      <div class="flex items-center gap-1">
                        <CallOutline class="w-3.5 h-3.5" />
                        <span>تلفن تماس: {{ item.check_holder.phone || '۰۹۱۲۹۸۷۶۵۴۳' }}</span>
                      </div>
                      <div v-if="item.check_holder.email" class="flex items-center gap-1 text-[11px] text-slate-300">
                        <MailOutline class="w-3.5 h-3.5" />
                        <span>ایمیل: {{ item.check_holder.email }}</span>
                      </div>
                    </div>
                    <div v-else class="text-[11px] text-slate-500 italic mt-1">
                      (اطلاعات تماس پس از پذیرش توسط فروشنده نمایش داده می‌شود)
                    </div>
                  </div>

                  <!-- Sent Message -->
                  <div class="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div class="text-slate-400 font-bold">پیام ارسالی شما:</div>
                    <p class="text-slate-300 leading-relaxed italic line-clamp-3">«{{ item.message }}»</p>
                  </div>
                </div>

                <!-- Unmasked Banner for Accepted Match -->
                <NAlert v-if="item.status === 'accepted'" type="success" class="mb-4 text-xs">
                  <strong class="font-bold">پیشنهاد شما توسط دارنده چک پذیرفته شد!</strong>
                  <p class="mt-1">می‌توانید جهت هماهنگی تحویل فیزیکی/انتقال صیادی و تسویه مالی با شماره تلفن <span class="font-mono font-bold dir-ltr inline-block text-slate-900 bg-emerald-200 px-1.5 py-0.5 rounded">{{ item.check_holder.phone || '۰۹۱۲۹۸۷۶۵۴۳' }}</span> تماس برقرار نمایید.</p>
                </NAlert>

                <!-- Actions Footer -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-800">
                  <NButton text size="small" class="text-slate-400" @click="router.push(`/listings/${item.listing.id}`)">
                    مشاهده جزئیات آگهی
                  </NButton>

                  <NButton
                    v-if="item.status === 'pending'"
                    size="small"
                    type="error"
                    secondary
                    @click="triggerCancel(item.id)"
                  >
                    انصراف و لغو پیشنهاد
                  </NButton>
                </div>
              </NCard>
            </div>

            <NEmpty v-else description="شما هنوز هیچ پیشنهاد خریدی ارسال نکرده‌اید." class="py-20 bg-slate-900 border border-slate-800 rounded-2xl" />
          </template>
        </div>
      </main>
    </div>

    <!-- Decline Modal -->
    <NModal v-model:show="showDeclineModal" preset="card" title="رد پیشنهاد خرید" class="max-w-md bg-slate-900 border border-slate-800">
      <NForm @submit.prevent="handleDeclineSubmit" class="space-y-4">
        <NFormItem label="توضیحات و دلیل رد پیشنهاد (اختیاری)">
          <NInput
            v-model:value="declineNote"
            type="textarea"
            placeholder="مثلاً: مبلغ پیشنهادی پایین‌تر از حد مد نظر است..."
            :rows="3"
          />
        </NFormItem>
        <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <NButton secondary @click="showDeclineModal = false">انصراف</NButton>
          <NButton type="error" :loading="actionLoading" attr-type="submit" class="font-bold">
            ثبت و رد پیشنهاد
          </NButton>
        </div>
      </NForm>
    </NModal>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      :show="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessageText"
      confirm-text="تأیید و ادامه"
      :loading="actionLoading"
      @confirm="handleConfirmAction"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
