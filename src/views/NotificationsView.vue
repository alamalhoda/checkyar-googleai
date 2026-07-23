<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NCard, NButton, NSpin, NEmpty, NTag } from 'naive-ui';
import { notificationsApi } from '../api';
import type { Notification } from '../types/api';
import { NOTIFICATION_TYPE_LABELS } from '../types/api';

const router = useRouter();

const notificationsList = ref<Notification[]>([]);
const loading = ref(false);

const loadNotifications = async () => {
  loading.value = true;
  try {
    notificationsList.value = await notificationsApi.getNotifications();
  } catch (err) {
    console.error('Failed to load notifications', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadNotifications);

const markRead = async (item: Notification) => {
  try {
    await notificationsApi.markAsRead(item.id);
    item.read_at = new Date().toISOString();
  } catch (e) {
    console.error('Failed to mark read', e);
  }
};

const goToPreferences = () => {
  router.push('/notifications/preferences');
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-base font-bold text-slate-100">اعلامیه‌ها و اعلانات سیستم</h1>
        <p class="text-xs text-slate-400">اطلاع‌رسانی‌های وضعیت آگهی، تطابق‌ها و نظارت</p>
      </div>

      <NButton secondary size="small" @click="goToPreferences">
        تنظیمات دریافت پیامک و اعلانات
      </NButton>
    </div>

    <NSpin :show="loading">
      <div v-if="notificationsList.length > 0" class="space-y-3">
        <NCard
          v-for="item in notificationsList"
          :key="item.id"
          class="bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          :class="{ 'border-emerald-500/30 bg-slate-900/90': !item.read_at }"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-100">{{ item.title }}</span>
                <NTag size="small" :type="item.read_at ? 'default' : 'error'" round>
                  {{ NOTIFICATION_TYPE_LABELS[item.type] || item.type }}
                </NTag>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">{{ item.message }}</p>
              <span class="text-[10px] text-slate-500 block font-mono">{{ item.created_at.split('T')[0] }}</span>
            </div>

            <NButton v-if="!item.read_at" size="tiny" secondary type="primary" @click="markRead(item)">
              علامت به عنوان خوانده شده
            </NButton>
          </div>
        </NCard>
      </div>

      <NEmpty v-else description="هیچ پیام یا اعلامیه‌ای وجود ندارد." class="py-16" />
    </NSpin>
  </div>
</template>
