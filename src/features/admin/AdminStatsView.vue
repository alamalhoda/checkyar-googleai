<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NStatistic, NSpin, NButton } from 'naive-ui';
import {
  DocumentTextOutline, PeopleOutline, ShieldCheckmarkOutline,
  NotificationsOutline, RefreshOutline
} from '@vicons/ionicons5';
import { adminApi } from '../../api';
import type { AdminDashboardStats } from '../../types/api';

const stats = ref<AdminDashboardStats | null>(null);
const loading = ref(false);

const loadStats = async () => {
  loading.value = true;
  try {
    stats.value = await adminApi.getStats();
  } catch (err) {
    console.error('Failed to load admin stats', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadStats);
</script>

<template>
  <div class="space-y-6 dir-rtl">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
          <ShieldCheckmarkOutline class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-100">آمار و شاخص‌های کلیدی سامانه چک‌یار</h1>
          <p class="text-xs text-slate-400 mt-0.5">داشبورد مدیریتی و نظارتی ارشد پلتفرم معامله چک صیادی</p>
        </div>
      </div>

      <NButton secondary size="small" :loading="loading" @click="loadStats">
        <template #icon><RefreshOutline class="w-4 h-4" /></template>
        بروزرسانی آمار
      </NButton>
    </div>

    <!-- Main Statistics Cards Grid -->
    <NSpin :show="loading">
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 1. Listings Group Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <template #header>
            <div class="flex items-center gap-2 text-slate-100 font-bold text-base">
              <DocumentTextOutline class="w-5 h-5 text-emerald-400" />
              <span>وضعیت آگهی‌های چک صیادی</span>
            </div>
          </template>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="کل آگهی‌ها" :value="stats.listings.total">
                <template #suffix><span class="text-xs text-slate-400">فقره</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="منتشر شده" :value="stats.listings.published">
                <template #suffix><span class="text-xs text-emerald-400 font-bold">فعال</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="در انتظار نظارت" :value="stats.listings.pending_moderation">
                <template #suffix><span class="text-xs text-amber-400 font-bold">در صف</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="تطابق یافته" :value="stats.listings.matched || 0">
                <template #suffix><span class="text-xs text-indigo-400 font-bold">معامله</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="عدم تأیید (رد شده)" :value="stats.listings.rejected || 0">
                <template #suffix><span class="text-xs text-rose-400">فقره</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="منقضی شده" :value="stats.listings.expired || 0">
                <template #suffix><span class="text-xs text-slate-500">فقره</span></template>
              </NStatistic>
            </div>
          </div>
        </NCard>

        <!-- 2. Users Group Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <template #header>
            <div class="flex items-center gap-2 text-slate-100 font-bold text-base">
              <PeopleOutline class="w-5 h-5 text-indigo-400" />
              <span>وضعیت کاربران و حساب‌های کاربری</span>
            </div>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="کل کاربران" :value="stats.users.total">
                <template #suffix><span class="text-xs text-slate-400">نفر</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="تأیید هویت شده" :value="stats.users.kyc_approved">
                <template #suffix><span class="text-xs text-emerald-400 font-bold">احراز شده</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="در انتظار احراز" :value="stats.users.kyc_pending">
                <template #suffix><span class="text-xs text-amber-400 font-bold">در صف</span></template>
              </NStatistic>
            </div>
          </div>
        </NCard>

        <!-- 3. Verifications Group Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <template #header>
            <div class="flex items-center gap-2 text-slate-100 font-bold text-base">
              <ShieldCheckmarkOutline class="w-5 h-5 text-amber-400" />
              <span>صف بررسی احراز هویت (KYC)</span>
            </div>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="پرونده‌های در انتظار بررسی" :value="stats.verifications.pending">
                <template #suffix><span class="text-xs text-amber-400 font-bold">پرونده</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div class="text-xs text-slate-400">وضعیت صف:</div>
                <div class="text-sm font-bold text-emerald-400 mt-1">فعال و بدون گلوگاه</div>
              </div>
            </div>
          </div>
        </NCard>

        <!-- 4. Notifications Group Card -->
        <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <template #header>
            <div class="flex items-center gap-2 text-slate-100 font-bold text-base">
              <NotificationsOutline class="w-5 h-5 text-rose-400" />
              <span>اطلاع‌رسانی‌ها و پیام‌ها</span>
            </div>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <NStatistic label="پیام‌های خوانده‌نشده مدیران" :value="stats.notifications.unread">
                <template #suffix><span class="text-xs text-rose-400 font-bold">اعلامیه</span></template>
              </NStatistic>
            </div>
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div class="text-xs text-slate-400">سرویس پیامک و ای‌پای:</div>
                <div class="text-sm font-bold text-emerald-400 mt-1">برقرار (Normal)</div>
              </div>
            </div>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
