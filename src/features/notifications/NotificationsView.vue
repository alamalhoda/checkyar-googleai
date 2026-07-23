<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NButton, NSpin, NEmpty, NSelect, NPagination, NBadge, NAlert, useMessage
} from 'naive-ui';
import {
  NotificationsOutline, CheckmarkDoneOutline, SettingsOutline, FilterOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import NotificationItem from './NotificationItem.vue';
import { notificationsApi } from '../../api';
import type { Notification, NotificationType, NotificationStatus } from '../../types/api';
import { NOTIFICATION_TYPE_LABELS } from '../../types/api';

const router = useRouter();
const message = useMessage();

const notifications = ref<Notification[]>([]);
const totalCount = ref(0);
const loading = ref(false);
const actionLoading = ref(false);

// Filters & Pagination
const selectedType = ref<string>('all');
const selectedStatus = ref<string>('all');
const currentPage = ref(1);
const pageSize = ref(10);

const typeOptions = [
  { label: 'همه موضوعات', value: 'all' },
  ...Object.entries(NOTIFICATION_TYPE_LABELS).map(([val, label]) => ({
    label,
    value: val
  }))
];

const statusOptions = [
  { label: 'همه وضعیت‌ها', value: 'all' },
  { label: 'خوانده نشده', value: 'sent' },
  { label: 'خوانده شده', value: 'read' }
];

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read_at).length;
});

const loadNotifications = async () => {
  loading.value = true;
  try {
    const filters: { type?: string; status?: string; page?: number; page_size?: number } = {
      page: currentPage.value,
      page_size: pageSize.value
    };
    if (selectedType.value !== 'all') filters.type = selectedType.value;
    if (selectedStatus.value !== 'all') filters.status = selectedStatus.value;

    const res = await notificationsApi.getNotifications(filters);
    if (Array.isArray(res)) {
      notifications.value = res;
      totalCount.value = res.length;
    } else {
      notifications.value = res.results || [];
      totalCount.value = res.count || 0;
    }
  } catch (err: any) {
    message.error('خطا در دریافت لیست اعلامیه‌ها.');
  } finally {
    loading.value = false;
  }
};

onMounted(loadNotifications);

watch([selectedType, selectedStatus, currentPage], () => {
  loadNotifications();
});

const handleMarkSingleRead = async (id: number) => {
  try {
    await notificationsApi.markAsRead(id);
    const item = notifications.value.find(n => n.id === id);
    if (item) {
      item.read_at = new Date().toISOString();
      item.status = 'read';
    }
    message.success('اعلامیه به عنوان خوانده‌شده علامت‌گذاری شد.');
  } catch (err: any) {
    message.error('خطا در تغییر وضعیت اعلامیه.');
  }
};

const handleMarkAllRead = async () => {
  actionLoading.value = true;
  try {
    await notificationsApi.markAllRead();
    notifications.value.forEach(n => {
      n.read_at = new Date().toISOString();
      n.status = 'read';
    });
    message.success('تمام اعلامیه‌ها به عنوان خوانده‌شده ثبت شدند.');
  } catch (err: any) {
    message.error('خطا در علامت‌گذاری تمام اعلامیه‌ها.');
  } finally {
    actionLoading.value = false;
  }
};

const goToPreferences = () => {
  router.push('/notifications/preferences');
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col dir-rtl">
    <AppHeader />

    <div class="flex-1 flex max-w-7xl w-full mx-auto p-4 gap-6">
      <AppSidebar />

      <main class="flex-1 min-w-0 space-y-6">
        <!-- Header bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <NotificationsOutline class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-black text-slate-100">اعلامیه‌ها و اعلانات سیستم</h1>
                <NBadge v-if="unreadCount > 0" :value="unreadCount" type="error" />
              </div>
              <p class="text-xs text-slate-400 mt-0.5">اطلاع‌رسانی‌های وضعیت آگهی‌ها، پیشنهادهای خرید و پیام‌های نظارتی</p>
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <NButton
              secondary
              type="primary"
              size="small"
              :loading="actionLoading"
              class="font-bold"
              @click="handleMarkAllRead"
            >
              <template #icon><CheckmarkDoneOutline class="w-4 h-4" /></template>
              خوانده‌شدن همه
            </NButton>

            <NButton
              secondary
              size="small"
              class="font-semibold"
              @click="goToPreferences"
            >
              <template #icon><SettingsOutline class="w-4 h-4" /></template>
              تنظیمات دریافتی
            </NButton>
          </div>
        </div>

        <!-- Filters Bar -->
        <div class="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
          <div class="flex items-center gap-2 text-slate-400 font-bold shrink-0">
            <FilterOutline class="w-4 h-4 text-emerald-400" />
            فیلترها:
          </div>

          <div class="flex items-center gap-2 min-w-[200px]">
            <span class="text-slate-400">موضوع:</span>
            <NSelect
              v-model:value="selectedType"
              :options="typeOptions"
              size="small"
              class="flex-1"
            />
          </div>

          <div class="flex items-center gap-2 min-w-[160px]">
            <span class="text-slate-400">وضعیت:</span>
            <NSelect
              v-model:value="selectedStatus"
              :options="statusOptions"
              size="small"
              class="flex-1"
            />
          </div>
        </div>

        <!-- Content list -->
        <NSpin :show="loading">
          <div v-if="notifications.length > 0" class="space-y-3">
            <NotificationItem
              v-for="item in notifications"
              :key="item.id"
              :notification="item"
              @mark-read="handleMarkSingleRead"
            />

            <!-- Pagination -->
            <div v-if="totalCount > pageSize" class="flex justify-center pt-6">
              <NPagination
                v-model:page="currentPage"
                :page-size="pageSize"
                :item-count="totalCount"
              />
            </div>
          </div>

          <NEmpty
            v-else
            description="هیچ پیام یا اعلامیه‌ای با فیلترهای انتخابی یافت نشد."
            class="py-20 bg-slate-900 border border-slate-800 rounded-2xl"
          />
        </NSpin>
      </main>
    </div>
  </div>
</template>
