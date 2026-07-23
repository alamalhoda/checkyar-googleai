<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NStatistic, NSpin } from 'naive-ui';
import { adminApi } from '../api';
import type { AdminDashboardStats } from '../types/api';

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
  <div class="space-y-6">
    <div>
      <h1 class="text-base font-bold text-slate-100">آمار و شاخص‌های کلیدی سامانه چک‌یار</h1>
      <p class="text-xs text-slate-400">گزارشات ارشد از وضعیت معاملات، کاربران و صف‌های نظارت</p>
    </div>

    <NSpin :show="loading">
      <div v-if="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NCard class="bg-slate-900 border border-slate-800 rounded-xl">
          <NStatistic label="کل آگهی‌های ثبت شده" :value="stats.listings.total">
            <template #suffix><span class="text-xs text-slate-400 mr-1">فقره</span></template>
          </NStatistic>
        </NCard>

        <NCard class="bg-slate-900 border border-slate-800 rounded-xl">
          <NStatistic label="آگهی‌های فعال در بازار" :value="stats.listings.published">
            <template #suffix><span class="text-xs text-emerald-400 mr-1">منتشر شده</span></template>
          </NStatistic>
        </NCard>

        <NCard class="bg-slate-900 border border-slate-800 rounded-xl">
          <NStatistic label="در انتظار بررسی نظارت" :value="stats.listings.pending_moderation">
            <template #suffix><span class="text-xs text-amber-400 mr-1">در صف</span></template>
          </NStatistic>
        </NCard>

        <NCard class="bg-slate-900 border border-slate-800 rounded-xl">
          <NStatistic label="کل کاربران ثبت شده" :value="stats.users.total">
            <template #suffix><span class="text-xs text-indigo-400 mr-1">کاربر</span></template>
          </NStatistic>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
