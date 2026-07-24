<script setup lang="ts">
import { computed, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  NButton,
  NDropdown,
  NAvatar,
  NBadge,
  NSelect,
  NSwitch,
  NIcon,
  useMessage
} from 'naive-ui';
import {
  NotificationsOutline,
  PersonOutline,
  LogOutOutline,
  SwapHorizontalOutline,
  ConstructOutline,
  MenuOutline,
  SunnyOutline,
  MoonOutline,
  ColorPaletteOutline
} from '@vicons/ionicons5';
import { useAuthStore } from '../../stores/auth';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';
import { useUiStore, type AppTheme } from '../../stores/useUiStore';
import { getMockMode, setMockMode } from '../../api';
import type { UserRole } from '../../types/api';

const router = useRouter();
const route = useRoute();
const message = useMessage();
const authStore = useAuthStore();
const simulatorStore = useBackendSimulatorStore();
const uiStore = useUiStore();

const isSimulatorMode = computed({
  get: () => getMockMode(),
  set: (val: boolean) => {
    setMockMode(val);
    message.info(`حالت شبیه‌ساز ${val ? 'فعال' : 'غیرفعال (ارسال به سرور واقعی)'} شد.`);
  }
});

const unreadCount = computed(() => {
  return (simulatorStore.notifications || []).filter(n => !n?.read_at).length;
});

const roleOptions = [
  { label: 'دارنده چک (Holder)', value: 'check_holder' },
  { label: 'سرمایه‌گذار (Investor)', value: 'investor' },
  { label: 'ناظر سیستم (Moderator)', value: 'moderator' },
  { label: 'مدیر ارشد (Admin)', value: 'admin' }
];

const selectedRole = computed({
  get: () => authStore.userRole,
  set: (val: UserRole) => {
    authStore.switchRole(val);
  }
});

const themeOptions = [
  {
    label: '🌙 تم تاریک (اسلیت)',
    key: 'dark',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(MoonOutline) })
  },
  {
    label: '☀️ تم روشن (سپید)',
    key: 'light',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(SunnyOutline) })
  },
  {
    label: '🍯 تم گرم (کرم و آجر)',
    key: 'warm',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(SunnyOutline) })
  },
  {
    label: '🎨 تم سرمه‌ای (نیلی و طلایی)',
    key: 'navy',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(ColorPaletteOutline) })
  },
  {
    label: '🔮 تم بنفش (ارغوانی)',
    key: 'violet',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(ColorPaletteOutline) })
  },
  {
    label: '🌲 تم یشمی (زمرد عمیق)',
    key: 'emerald',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(ColorPaletteOutline) })
  }
];

const handleThemeSelect = (key: string) => {
  const theme = key as AppTheme;
  uiStore.setTheme(theme);
  const themeNames: Record<AppTheme, string> = {
    dark: 'تم تاریک (اسلیت)',
    light: 'تم روشن (سپید)',
    warm: 'تم گرم (کرم)',
    navy: 'تم سرمه‌ای',
    violet: 'تم بنفش',
    emerald: 'تم یشمی'
  };
  message.success(`پوسته برنامه به ${themeNames[theme]} تغییر یافت.`);
};

const userDropdownOptions = [
  {
    label: 'پروفایل و هویت',
    key: 'profile',
    icon: () => h(NIcon, { size: 16 }, { default: () => h(PersonOutline) })
  },
  {
    label: 'خروج از حساب',
    key: 'logout',
    icon: () => h(NIcon, { size: 16, class: 'text-rose-400' }, { default: () => h(LogOutOutline) })
  }
];

const handleDropdownSelect = (key: string) => {
  if (key === 'profile') {
    router.push('/me');
  } else if (key === 'logout') {
    authStore.logout();
    router.push('/login');
  }
};

const pageTitle = computed(() => {
  const path = route.path;
  if (path === '/marketplace') return 'بازار معامله چک‌های صیادی';
  if (path === '/listings/create') return 'ثبت و واگذاری آگهی جدید چک';
  if (path === '/listings/my') return 'لیست آگهی‌های ثبت شده من';
  if (path.startsWith('/listings/')) return 'جزئیات آگهی چک';
  if (path === '/matches') return 'مدیریت تطابق‌ها و ابراز تمایل‌ها';
  if (path === '/me') return 'شناسنامه و وضعیت احراز هویت';
  if (path === '/account') return 'مدیریت حساب کاربری و تسویه';
  if (path === '/notifications') return 'اعلامیه‌ها و پیام‌های سیستم';
  if (path === '/moderation') return 'صف بررسی و تایید آگهی‌ها';
  if (path === '/moderation/kyc') return 'صف بررسی احراز هویت (KYC)';
  if (path === '/admin/stats') return 'آمار و گزارشات مدیریتی ارشد';
  if (path === '/admin/feature-flags') return 'مدیریت کلیدهای ویژگی سامانه';
  if (path === '/admin/audit') return 'دفتر لایو رویدادها و حسابرسی';
  return 'سامانه چک‌یار';
});
</script>

<template>
  <header class="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
    <!-- Page Title & Mobile Menu Toggle -->
    <div class="flex items-center gap-3 min-w-0">
      <NButton
        quaternary
        circle
        size="small"
        class="md:hidden text-slate-300 shrink-0"
        @click="uiStore.toggleMobileMenu"
        aria-label="باز کردن منو"
      >
        <template #icon>
          <MenuOutline class="w-5 h-5 text-slate-200" />
        </template>
      </NButton>

      <h2 class="text-sm font-semibold text-slate-100 tracking-tight truncate">{{ pageTitle }}</h2>
    </div>

    <!-- Actions Right -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Dev Role Switcher & Simulator Toggle -->
      <div class="hidden lg:flex items-center gap-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg px-2.5 py-1 text-[11px] text-slate-300">
        <div class="flex items-center gap-1.5">
          <SwapHorizontalOutline class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span class="text-slate-400">نقش تست:</span>
          <NSelect
            v-model:value="selectedRole"
            :options="roleOptions"
            size="small"
            class="w-36"
          />
        </div>

        <div class="h-3.5 w-px bg-slate-800"></div>

        <div class="flex items-center gap-1.5">
          <span class="text-slate-400">شبیه‌ساز:</span>
          <NSwitch v-model:value="isSimulatorMode" size="small">
            <template #checked>فعال</template>
            <template #unchecked>خاموش</template>
          </NSwitch>
        </div>
      </div>

      <!-- Theme Selector Dropdown -->
      <NDropdown
        :options="themeOptions"
        @select="handleThemeSelect"
        trigger="click"
      >
        <NButton
          quaternary
          circle
          size="small"
          aria-label="تغییر پوسته برنامه"
          title="تغییر پوسته و رنگ برنامه"
        >
          <template #icon>
            <SunnyOutline v-if="uiStore.currentTheme === 'light'" class="w-4 h-4 text-amber-500" />
            <ColorPaletteOutline v-else-if="uiStore.currentTheme === 'navy'" class="w-4 h-4 text-amber-400" />
            <MoonOutline v-else class="w-4 h-4 text-slate-300" />
          </template>
        </NButton>
      </NDropdown>

      <!-- Notification Bell Button -->
      <NButton
        quaternary
        circle
        size="small"
        @click="router.push('/notifications')"
        aria-label="اعلامیه‌ها"
      >
        <template #icon>
          <NBadge :value="unreadCount" :max="99">
            <NotificationsOutline class="w-4 h-4 text-slate-300" />
          </NBadge>
        </template>
      </NButton>

      <!-- User Profile Dropdown -->
      <NDropdown
        :options="userDropdownOptions"
        @select="handleDropdownSelect"
        trigger="click"
      >
        <div class="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <NAvatar
            round
            size="small"
            class="bg-emerald-500 text-slate-950 font-bold"
          >
            {{ authStore.user?.name ? authStore.user.name.charAt(0) : 'چ' }}
          </NAvatar>
          <div class="hidden sm:block text-right">
            <div class="text-xs font-semibold text-slate-200">{{ authStore.user?.name || 'کاربر چک‌یار' }}</div>
            <div class="text-[10px] text-slate-400 font-mono">{{ authStore.user?.username || 'user' }}</div>
          </div>
        </div>
      </NDropdown>
    </div>
  </header>
</template>
