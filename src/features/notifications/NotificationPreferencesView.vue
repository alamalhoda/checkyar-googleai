<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NCard, NSwitch, NButton, NAlert, NSpin, useMessage
} from 'naive-ui';
import {
  ArrowBackOutline, SettingsOutline, NotificationsOutline,
  CallOutline, MailOutline, SaveOutline
} from '@vicons/ionicons5';
import AppHeader from '../../shared/components/AppHeader.vue';
import AppSidebar from '../../shared/components/AppSidebar.vue';
import { notificationsApi } from '../../api';
import type { NotificationPreferences } from '../../types/api';

const router = useRouter();
const message = useMessage();

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
  } catch (err: any) {
    message.error('خطا در دریافت تنظیمات اعلانات.');
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
    message.success('تنظیمات کانال‌های اطلاع‌رسانی با موفقیت ذخیره شد.');
    setTimeout(() => success.value = false, 4000);
  } catch (err: any) {
    message.error('خطا در بروزرسانی تنظیمات.');
  } finally {
    saving.value = false;
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
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <SettingsOutline class="w-6 h-6" />
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-100">تنظیمات کانال‌های دریافت پیام</h1>
              <p class="text-xs text-slate-400 mt-0.5">انتخاب روش‌های آگاهی‌رسانی سیستم از طریق پیامک، ایمیل و درون برنامه‌ای</p>
            </div>
          </div>

          <NButton secondary size="small" @click="router.push('/notifications')">
            <template #icon><ArrowBackOutline class="w-4 h-4" /></template>
            بازگشت به اعلامیه‌ها
          </NButton>
        </div>

        <NSpin :show="loading">
          <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl max-w-3xl">
            <NAlert v-if="success" type="success" class="mb-6 text-xs" closable @close="success = false">
              تغییرات کانال‌های دریافت اطلاع‌رسانی با موفقیت روی حساب کاربری شما اعمال گردید.
            </NAlert>

            <div class="space-y-4">
              <!-- In App -->
              <div class="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <NotificationsOutline class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-100 text-sm">اعلان‌های درون‌برنامه‌ای (In-App)</div>
                    <div class="text-xs text-slate-400 mt-0.5">نمایش اعلامیه‌ها در منوی بالا و بخش پیام‌ها در زمان آنلاین بودن</div>
                  </div>
                </div>
                <NSwitch v-model:value="prefs.in_app_enabled" size="medium" />
              </div>

              <!-- SMS -->
              <div class="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <CallOutline class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-100 text-sm">پیامک اطلاع‌رسانی فوری (SMS)</div>
                    <div class="text-xs text-slate-400 mt-0.5">ارسال پیامک آنی جهت پذیرش آگهی، ابراز تمایل جدید و تغییرات وضعیت تسویه</div>
                  </div>
                </div>
                <NSwitch v-model:value="prefs.sms_enabled" size="medium" />
              </div>

              <!-- Email -->
              <div class="flex items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <MailOutline class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-100 text-sm">گزارشات ایمیلی (Email)</div>
                    <div class="text-xs text-slate-400 mt-0.5">دریافت خلاصه‌وضعیت هفتگی، فاکتورهای تسویه و اطلاعیه‌های مهم</div>
                  </div>
                </div>
                <NSwitch v-model:value="prefs.email_enabled" size="medium" />
              </div>
            </div>

            <div class="pt-6 border-t border-slate-800 flex justify-end mt-6">
              <NButton type="primary" :loading="saving" class="font-bold bg-emerald-600 hover:bg-emerald-500" @click="handleSave">
                <template #icon><SaveOutline class="w-4 h-4" /></template>
                ذخیره تغییرات کانال‌ها
              </NButton>
            </div>
          </NCard>
        </NSpin>
      </main>
    </div>
  </div>
</template>
