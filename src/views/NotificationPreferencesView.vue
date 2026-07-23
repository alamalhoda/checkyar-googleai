<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard, NSwitch, NButton, NAlert, NSpin } from 'naive-ui';
import { notificationsApi } from '../api';
import type { NotificationPreferences } from '../types/api';

const prefs = ref<NotificationPreferences>({
  in_app_enabled: true,
  sms_enabled: true,
  email_enabled: false
});

const loading = ref(false);
const saving = ref(false);
const success = ref(false);

const loadPrefs = async () => {
  loading.value = true;
  try {
    prefs.value = await notificationsApi.getPreferences();
  } catch (err) {
    console.error('Failed to load preferences', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadPrefs);

const handleSave = async () => {
  saving.value = true;
  try {
    await notificationsApi.updatePreferences(prefs.value);
    success.value = true;
    setTimeout(() => success.value = false, 3000);
  } catch (err) {
    console.error('Failed to update notification preferences', err);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <NSpin :show="loading">
      <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6">
        <div class="border-b border-slate-800 pb-3">
          <h1 class="text-base font-bold text-slate-100">تنظیمات کانال‌های اطلاع‌رسانی</h1>
          <p class="text-xs text-slate-400 mt-0.5">مدیریت کانال‌های دریافت پیامک و اعلانات برنامه‌ای</p>
        </div>

        <NAlert v-if="success" type="success" class="text-xs" closable>
          تنظیمات کانال‌های اطلاع‌رسانی با موفقیت بروزرسانی شد.
        </NAlert>

        <div class="space-y-4 text-xs">
          <div class="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div class="font-semibold text-slate-200">اعلانات درون‌برنامه‌ای (In-App)</div>
              <div class="text-[11px] text-slate-400">نمایش پیام‌ها در بخش اعلانات و منوی بالایی</div>
            </div>
            <NSwitch v-model:value="prefs.in_app_enabled" />
          </div>

          <div class="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div class="font-semibold text-slate-200">پیامک اطلاع‌رسانی (SMS)</div>
              <div class="text-[11px] text-slate-400">ارسال پیامک تغییر وضعیت آگهی و درخواست معامله فوری</div>
            </div>
            <NSwitch v-model:value="prefs.sms_enabled" />
          </div>

          <div class="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div class="font-semibold text-slate-200">ایمیل (Email)</div>
              <div class="text-[11px] text-slate-400">ارسال گزارش دوره‌ای و فاکتورها به آدرس ایمیل</div>
            </div>
            <NSwitch v-model:value="prefs.email_enabled" />
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex justify-end">
          <NButton type="primary" :loading="saving" class="font-bold" @click="handleSave">
            ذخیره تنظیمات
          </NButton>
        </div>
      </NCard>
    </NSpin>
  </div>
</template>
