<script setup lang="ts">
import { computed, h } from 'vue';
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const simulatorStore = useBackendSimulatorStore();
const uiStore = useUiStore();

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
  <aside class="hidden md:flex w-64 bg-slate-900 border-l border-slate-800 flex-col shrink-0 h-screen sticky top-0 z-30">
    <!-- Brand Title -->
    <div class="p-5 border-b border-slate-800 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
        چک
      </div>
      <div>
        <h1 class="text-base font-bold text-slate-100 tracking-tight">چک‌یار</h1>
        <p class="text-[11px] text-slate-400">سامانه معامله مطالبات و چک صیادی</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 py-3 px-2 overflow-y-auto">
      <NMenu
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuSelect"
        :indent="18"
        accordion
      />
    </div>

    <!-- User Role Badge Footer -->
    <div class="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
      <div class="flex items-center justify-between">
        <span>نقش فعلی کاربر:</span>
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          {{ authStore.userRole === 'check_holder' ? 'دارنده چک' :
             authStore.userRole === 'investor' ? 'سرمایه‌گذار' :
             authStore.userRole === 'moderator' ? 'ناظر سیستم' : 'مدیر کل' }}
        </span>
      </div>
    </div>
  </aside>

  <!-- Mobile Drawer Sidebar -->
  <NDrawer
    v-model:show="uiStore.isMobileMenuOpen"
    :width="280"
    placement="right"
    class="bg-slate-900 text-slate-100 md:hidden"
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
