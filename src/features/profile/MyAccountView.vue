<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  NCard, NForm, NFormItem, NInput, NSelect, NButton, NSpin, NAlert, NTag,
  NDescriptions, NDescriptionsItem, useMessage
} from 'naive-ui';
import ConfirmDialog from '../../shared/components/ConfirmDialog.vue';
import { usersApi } from '../../api';
import type { User, UserRole } from '../../types/api';
import { useUiStore, type AppTheme } from '../../stores/useUiStore';

const message = useMessage();
const uiStore = useUiStore();

const user = ref<User | null>(null);
const loading = ref(true);
const saving = ref(false);
const errorMsg = ref('');

// Form state
const name = ref('');
const email = ref('');
const phone = ref('');
const role = ref<'check_holder' | 'investor'>('check_holder');

const showConfirmModal = ref(false);

const roleOptions = [
  { label: 'دارنده چک (واگذارکننده)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (خریدار)', value: 'investor' }
];

const loadUserData = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await usersApi.getMe();
    user.value = res;
    name.value = res.name || '';
    email.value = res.email || '';
    phone.value = res.phone || '';
    if (res.role === 'check_holder' || res.role === 'investor') {
      role.value = res.role;
    }
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در دریافت اطلاعات حساب کاربری.';
  } finally {
    loading.value = false;
  }
};

const selectTheme = (theme: AppTheme) => {
  uiStore.setTheme(theme);
  const themeNames: Record<AppTheme, string> = {
    dark: 'تم تاریک (اسلیت)',
    light: 'تم روشن (سپید)',
    warm: 'تم گرم (کرم و آجر)',
    navy: 'تم سرمه‌ای (نیلی و طلایی)',
    violet: 'تم بنفش (ارغوانی)',
    emerald: 'تم یشمی (زمرد عمیق)'
  };
  message.success(`پوسته برنامه به ${themeNames[theme]} تغییر کرد.`);
};

const triggerSave = () => {
  showConfirmModal.value = true;
};

const handleSave = async () => {
  showConfirmModal.value = false;
  saving.value = true;
  errorMsg.value = '';
  try {
    const updated = await usersApi.updateMe({
      name: name.value,
      email: email.value,
      phone: phone.value,
      role: role.value
    });
    user.value = updated;
    message.success('اطلاعات حساب با موفقیت به روز گردید.');
  } catch (err: any) {
    const apiErr = err?.response?.data?.error || err?.error;
    errorMsg.value = apiErr?.message || err?.message || 'خطا در ویرایش حساب کاربری.';
    message.error(errorMsg.value);
  } finally {
    saving.value = false;
  }
};

const roleLabel = (roleStr?: UserRole) => {
  switch (roleStr) {
    case 'check_holder': return 'دارنده چک';
    case 'investor': return 'سرمایه‌گذار';
    case 'moderator': return 'ناظر سامانه';
    case 'admin': return 'مدیر ارشد';
    default: return roleStr || '-';
  }
};

onMounted(loadUserData);
</script>

<template>
  <div class="space-y-6 dir-rtl">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-black text-slate-100">مدیریت حساب کاربری و تنظیمات ظاهر</h1>
            <p class="text-xs text-slate-400 mt-1">مشاهده و ویرایش پارامترهای اصلی حساب و تغییر پوسته و رنگ سامانه</p>
          </div>
          <NButton size="small" quaternary @click="loadUserData" :loading="loading">
            بارگذاری مجدد
          </NButton>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <NSpin size="large" />
        </div>

        <!-- Error State -->
        <NAlert v-else-if="errorMsg && !user" type="error" class="my-4">
          {{ errorMsg }}
        </NAlert>

        <!-- Empty State -->
        <div v-else-if="!user" class="text-center py-16 text-slate-400">
          اطلاعات حساب کاربری یافت نشد.
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Overview Card -->
            <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
              <template #header>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-100">اطلاعات سیستمی</span>
                  <NTag :type="user.is_verified ? 'success' : 'warning'" size="small">
                    {{ user.is_verified ? 'تایید شده' : 'غیرفعال / در انتظار' }}
                  </NTag>
                </div>
              </template>

              <NDescriptions column="1" label-placement="left" class="text-xs">
                <NDescriptionsItem label="شناسه کاربری (ID)">
                  <span class="font-mono text-emerald-400">#{{ user.id }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="نام کاربری (Username)">
                  <span class="font-mono text-slate-200">@{{ user.username }}</span>
                </NDescriptionsItem>

                <NDescriptionsItem label="نقش سیستمی">
                  <NTag type="info" size="small">{{ roleLabel(user.role) }}</NTag>
                </NDescriptionsItem>

                <NDescriptionsItem label="وضعیت احراز هویت">
                  <span>{{ user.is_verified ? 'تایید هویت شده' : 'عدم تایید مدارک' }}</span>
                </NDescriptionsItem>
              </NDescriptions>
            </NCard>

            <!-- Edit Account Form -->
            <NCard class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="ویرایش اطلاعات اصلی">
              <NAlert v-if="errorMsg" type="error" class="mb-4 text-xs" closable @close="errorMsg = ''">
                {{ errorMsg }}
              </NAlert>

              <NForm class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NFormItem label="نام و نام خانوادگی">
                    <NInput v-model:value="name" placeholder="نام کامل" />
                  </NFormItem>

                  <NFormItem label="ایمیل">
                    <NInput v-model:value="email" placeholder="ایمیل کاربر" />
                  </NFormItem>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NFormItem label="شماره همراه">
                    <NInput v-model:value="phone" placeholder="09123456789" />
                  </NFormItem>

                  <NFormItem label="نقش کاربری">
                    <NSelect v-model:value="role" :options="roleOptions" />
                  </NFormItem>
                </div>

                <div class="flex justify-end pt-2">
                  <NButton
                    type="primary"
                    size="medium"
                    :loading="saving"
                    @click="triggerSave"
                    class="font-bold"
                  >
                    ذخیره تغییرات حساب
                  </NButton>
                </div>
              </NForm>
            </NCard>
          </div>

          <!-- Theme & Color Selector Card -->
          <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg" title="تنظیمات پوسته و ظاهر برنامه (6 Theme)">
            <p class="text-xs text-slate-400 -mt-2 mb-4">
              پوسته و رنگ‌بندی مورد علاقه خود را انتخاب کنید. با نگه‌داشتن نشانه موس روی جعبه‌ها، جلوه برجسته‌سازی فعال می‌شود و پوسته انتخابی به‌صورت خودکار روی دستگاه شما ذخیره می‌گردد.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- 1. Dark Theme Option -->
              <div
                @click="selectTheme('dark')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'dark' ? 'border-emerald-500 bg-slate-900 ring-2 ring-emerald-500/30' : 'border-slate-800 bg-slate-950 hover:border-emerald-500/50'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700"></div>
                    <span class="text-sm font-bold text-slate-100">۱. تاریک اسلیت (Dark)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'dark'" class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-slate-950 border border-slate-800"></div>
                  <div class="w-6 h-6 rounded bg-slate-900 border border-slate-800"></div>
                  <div class="w-6 h-6 rounded bg-emerald-500"></div>
                </div>
                <p class="text-[11px] text-slate-400">زمینه اسلیت مدرن با جزئیات سبز زمردی</p>
              </div>

              <!-- 2. Light Theme Option -->
              <div
                @click="selectTheme('light')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'light' ? 'border-emerald-500 bg-slate-100 ring-2 ring-emerald-500/30 text-slate-900' : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-emerald-400'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-white border border-slate-300"></div>
                    <span class="text-sm font-bold">۲. روشن سپید (Light)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'light'" class="text-[10px] bg-emerald-600/20 text-emerald-700 px-2 py-0.5 rounded border border-emerald-600/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-slate-50 border border-slate-300"></div>
                  <div class="w-6 h-6 rounded bg-white border border-slate-300"></div>
                  <div class="w-6 h-6 rounded bg-emerald-600"></div>
                </div>
                <p class="text-[11px] text-slate-400 group-hover:text-slate-200">زمینه سپید تمیز با خوانایی عالی</p>
              </div>

              <!-- 3. Warm Theme Option -->
              <div
                @click="selectTheme('warm')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'warm' ? 'border-amber-600 bg-stone-100 ring-2 ring-amber-600/30 text-stone-900' : 'border-slate-800 bg-slate-950 hover:border-amber-500/50'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-300"></div>
                    <span class="text-sm font-bold text-slate-100 group-hover:text-amber-300">۳. گرم کرم (Warm)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'warm'" class="text-[10px] bg-amber-600/20 text-amber-700 px-2 py-0.5 rounded border border-amber-600/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-amber-50 border border-amber-200"></div>
                  <div class="w-6 h-6 rounded bg-amber-100/50 border border-amber-300"></div>
                  <div class="w-6 h-6 rounded bg-amber-600"></div>
                </div>
                <p class="text-[11px] text-slate-400">زمینه نرم کرم با رنگ‌آمیزی گرم خاکی</p>
              </div>

              <!-- 4. Navy Theme Option -->
              <div
                @click="selectTheme('navy')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'navy' ? 'border-amber-500 bg-slate-900 ring-2 ring-amber-500/30' : 'border-slate-800 bg-slate-950 hover:border-amber-500/50'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-blue-900 border border-blue-700"></div>
                    <span class="text-sm font-bold text-slate-100">۴. سرمه‌ای طلایی (Navy)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'navy'" class="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-blue-950 border border-blue-900"></div>
                  <div class="w-6 h-6 rounded bg-blue-900 border border-blue-800"></div>
                  <div class="w-6 h-6 rounded bg-amber-500"></div>
                </div>
                <p class="text-[11px] text-slate-400">نیلی سلطنتی با جزئیات طلایی درخشان</p>
              </div>

              <!-- 5. Violet Theme Option -->
              <div
                @click="selectTheme('violet')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'violet' ? 'border-purple-500 bg-slate-900 ring-2 ring-purple-500/30' : 'border-slate-800 bg-slate-950 hover:border-purple-500/50'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-purple-900 border border-purple-700"></div>
                    <span class="text-sm font-bold text-slate-100">۵. بنفش ارغوانی (Violet)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'violet'" class="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-purple-950 border border-purple-900"></div>
                  <div class="w-6 h-6 rounded bg-purple-900/60 border border-purple-800"></div>
                  <div class="w-6 h-6 rounded bg-purple-500"></div>
                </div>
                <p class="text-[11px] text-slate-400">بنفش عمیق و یاقوتی با ظاهری لوکس</p>
              </div>

              <!-- 6. Emerald Theme Option -->
              <div
                @click="selectTheme('emerald')"
                class="cursor-pointer p-4 rounded-xl border transition-all flex flex-col justify-between h-36 relative overflow-hidden group hover:scale-[1.02]"
                :class="uiStore.currentTheme === 'emerald' ? 'border-teal-400 bg-slate-900 ring-2 ring-teal-400/30' : 'border-slate-800 bg-slate-950 hover:border-teal-400/50'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3.5 h-3.5 rounded-full bg-emerald-900 border border-teal-700"></div>
                    <span class="text-sm font-bold text-slate-100">۶. یشمی عمیق (Emerald)</span>
                  </div>
                  <span v-if="uiStore.currentTheme === 'emerald'" class="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-semibold">فعال</span>
                </div>
                <div class="flex items-center gap-2 my-2">
                  <div class="w-6 h-6 rounded bg-emerald-950 border border-emerald-900"></div>
                  <div class="w-6 h-6 rounded bg-emerald-900/80 border border-emerald-800"></div>
                  <div class="w-6 h-6 rounded bg-teal-400"></div>
                </div>
                <p class="text-[11px] text-slate-400">زمینه یشمی تیره با رنگ فیروزه‌ای نعنایی</p>
              </div>
            </div>
          </NCard>
        </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showConfirmModal"
      title="ویرایش حساب کاربری"
      message="آیا از ثبت تغییرات در حساب کاربری خود اطمینان دارید؟"
      confirm-text="تایید و ذخیره"
      :loading="saving"
      @confirm="handleSave"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>
