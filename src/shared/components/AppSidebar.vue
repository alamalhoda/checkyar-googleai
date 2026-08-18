<script setup lang="ts">
import { computed, h, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NMenu, NBadge, NIcon, NDrawer, NDrawerContent } from 'naive-ui';
import {
  StorefrontOutline,
  AddCircleOutline,
  DocumentTextOutline,
  GitCompareOutline,
  NotificationsOutline,
  PersonOutline,
  WalletOutline,
  ShieldCheckmarkOutline,
  StatsChartOutline,
  BarChartOutline,
  PieChartOutline,
  KeyOutline,
  JournalOutline
} from '@vicons/ionicons5';
import { useAuthStore } from '../../stores/auth';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';
import { useUiStore } from '../../stores/useUiStore';
import { BREAKPOINT_MD } from '../utils/breakpoints';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const simulatorStore = useBackendSimulatorStore();
const uiStore = useUiStore();

let mediaQueryList: MediaQueryList | null = null;

const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
  if (e.matches && uiStore.isMobileMenuOpen) {
    uiStore.closeMobileMenu();
  }
};

onMounted(() => {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mediaQueryList = window.matchMedia(`(min-width: ${BREAKPOINT_MD}px)`);
    if (mediaQueryList.matches && uiStore.isMobileMenuOpen) {
      uiStore.closeMobileMenu();
    }
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleMediaChange);
    } else if (typeof (mediaQueryList as any).addListener === 'function') {
      (mediaQueryList as any).addListener(handleMediaChange);
    }
  }
});

onUnmounted(() => {
  if (mediaQueryList) {
    if (typeof mediaQueryList.removeEventListener === 'function') {
      mediaQueryList.removeEventListener('change', handleMediaChange);
    } else if (typeof (mediaQueryList as any).removeListener === 'function') {
      (mediaQueryList as any).removeListener(handleMediaChange);
    }
  }
});

const unreadCount = computed(() => {
  return (simulatorStore.notifications || []).filter(n => !n?.read_at).length;
});

const renderIcon = (icon: any) => {
  return () => h(NIcon, { size: 18 }, { default: () => h(icon) });
};

const menuOptions = computed(() => {
  const options: any[] = [
    {
      label: 'بازار معامله چک (مارکت‌پلیس)',
      key: '/marketplace',
      icon: renderIcon(StorefrontOutline)
    },
    {
      type: 'group',
      label: 'مدیریت چک و مطالبات',
      children: [
        {
          label: 'ثبت آگهی جدید چک',
          key: '/listings/create',
          icon: renderIcon(AddCircleOutline)
        },
        {
          label: 'آگهی‌های من',
          key: '/listings/my',
          icon: renderIcon(DocumentTextOutline)
        },
        {
          label: 'تطابق‌ها و توافقات من',
          key: '/matches',
          icon: renderIcon(GitCompareOutline)
        }
      ]
    },
    {
      type: 'group',
      label: 'حساب کاربری و اطلاعات',
      children: [
        {
          label: 'پروفایل هویت',
          key: '/me',
          icon: renderIcon(PersonOutline)
        },
        {
          label: 'کیف پول و حساب بانکی',
          key: '/account',
          icon: renderIcon(WalletOutline)
        },
        {
          label: 'گزارش‌ها و تحلیل‌ها',
          key: '/reports',
          icon: renderIcon(BarChartOutline)
        },
        {
          label: () => h('div', { class: 'flex items-center justify-between w-full' }, [
            h('span', 'اعلامیه‌ها و پیام‌ها'),
            unreadCount.value > 0 ? h(NBadge, { value: unreadCount.value, type: 'error' }) : null
          ]),
          key: '/notifications',
          icon: renderIcon(NotificationsOutline)
        }
      ]
    }
  ];

  if (authStore.canAccessModeration) {
    options.push({
      type: 'group',
      label: 'پنل نظارت و تطابق',
      children: [
        {
          label: 'صف بررسی آگهی‌ها',
          key: '/moderation',
          icon: renderIcon(ShieldCheckmarkOutline)
        },
        {
          label: 'صف احراز هویت (KYC)',
          key: '/moderation/kyc',
          icon: renderIcon(ShieldCheckmarkOutline)
        }
      ]
    });
  }

  if (authStore.canAccessAdmin) {
    options.push({
      type: 'group',
      label: 'مدیریت کل سیستم',
      children: [
        {
          label: 'آمار و گزارشات ارشد',
          key: '/admin/stats',
          icon: renderIcon(StatsChartOutline)
        },
        {
          label: 'فیچرفلگ‌ها و کلیدهای سامانه',
          key: '/admin/feature-flags',
          icon: renderIcon(KeyOutline)
        },
        {
          label: 'لاگ رویدادها و حسابرسی',
          key: '/admin/audit',
          icon: renderIcon(JournalOutline)
        }
      ]
    });
  }

  return options;
});

const activeKey = computed(() => route.path);

const handleMenuSelect = (key: string) => {
  router.push(key);
  uiStore.closeMobileMenu();
};
</script>

<template>
  <!-- Desktop Sidebar -->
  <aside
    data-testid="app-sidebar"
    :data-collapsed="uiStore.isSidebarCollapsed ? 'true' : 'false'"
    class="hidden md:flex bg-slate-900 border-l border-slate-800 flex-col shrink-0 h-screen sticky top-0 z-30 transition-[width] duration-200 ease-in-out"
    :class="uiStore.isSidebarCollapsed ? 'w-[72px]' : 'w-64'"
  >
    <!-- Brand Title -->
    <div
      class="p-4 border-b border-slate-800 flex items-center min-h-[73px] transition-all duration-200 overflow-hidden"
      :class="uiStore.isSidebarCollapsed ? 'justify-center' : 'gap-3'"
    >
      <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
        چک
      </div>
      <div v-if="!uiStore.isSidebarCollapsed" class="min-w-0">
        <h1 class="text-base font-bold text-slate-100 tracking-tight truncate">چک‌یار</h1>
        <p class="text-[11px] text-slate-400 truncate">سامانه معامله مطالبات و چک صیادی</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 py-3 px-2 overflow-y-auto overflow-x-hidden">
      <NMenu
        :options="menuOptions"
        :value="activeKey"
        :collapsed="uiStore.isSidebarCollapsed"
        :collapsed-width="56"
        :collapsed-icon-size="20"
        :indent="18"
        accordion
        @update:value="handleMenuSelect"
      />
    </div>

    <!-- User Role Badge Footer -->
    <div
      v-if="!uiStore.isSidebarCollapsed"
      class="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400"
    >
      <div class="flex items-center justify-between">
        <span>نقش فعلی کاربر:</span>
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {{ authStore.userRole === 'check_holder' ? 'دارنده چک' :
             authStore.userRole === 'investor' ? 'سرمایه‌گذار' :
             authStore.userRole === 'moderator' ? 'ناظر سیستم' : 'مدیر کل' }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="p-3 border-t border-slate-800 bg-slate-950/40 flex justify-center"
      :title="`نقش فعلی: ${authStore.userRole === 'check_holder' ? 'دارنده چک' : authStore.userRole === 'investor' ? 'سرمایه‌گذار' : authStore.userRole === 'moderator' ? 'ناظر سیستم' : 'مدیر کل'}`"
    >
      <span class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        {{ authStore.userRole === 'check_holder' ? 'دارنده' :
           authStore.userRole === 'investor' ? 'سرمایه' :
           authStore.userRole === 'moderator' ? 'ناظر' : 'مدیر' }}
      </span>
    </div>
  </aside>

  <!-- Mobile Drawer Sidebar -->
  <NDrawer
    v-model:show="uiStore.isMobileMenuOpen"
    :width="280"
    placement="right"
    class="bg-slate-900 text-slate-100"
  >
    <NDrawerContent
      closable
      body-content-style="padding: 0; display: flex; flex-direction: column; height: 100%; background-color: var(--theme-surface);"
      header-style="background-color: var(--theme-surface); border-bottom: 1px solid var(--theme-border); padding: 1rem;"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            چک
          </div>
          <div>
            <h1 class="text-sm font-bold text-slate-100 tracking-tight">چک‌یار</h1>
            <p class="text-[10px] text-slate-400">سامانه معامله مطالبات و چک صیادی</p>
          </div>
        </div>
      </template>

      <div class="flex-1 py-3 px-2 overflow-y-auto">
        <NMenu
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuSelect"
          :indent="18"
          accordion
        />
      </div>

      <div class="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 mt-auto">
        <div class="flex items-center justify-between">
          <span>نقش فعلی کاربر:</span>
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {{ authStore.userRole === 'check_holder' ? 'دارنده چک' :
               authStore.userRole === 'investor' ? 'سرمایه‌گذار' :
               authStore.userRole === 'moderator' ? 'ناظر سیستم' : 'مدیر کل' }}
          </span>
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
:deep(.n-menu-item-content) {
  border-radius: 0.5rem;
  margin-bottom: 2px;
}
</style>
