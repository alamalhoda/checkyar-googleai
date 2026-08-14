<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  faIR,
  dateFaIR,
  unstableSelectRtl,
  unstablePopoverRtl,
  unstableButtonRtl,
  unstableInputRtl,
  unstableDataTableRtl,
  unstableDialogRtl,
  unstableMessageRtl,
  unstableNotificationRtl,
  unstableCardRtl,
  unstableTagRtl,
  unstablePaginationRtl,
  unstableListRtl
} from 'naive-ui';
import AppSidebar from './shared/components/AppSidebar.vue';
import AppHeader from './shared/components/AppHeader.vue';
import { useAuthStore } from './stores/auth';
import { useUiStore } from './stores/useUiStore';
import { getNaiveTheme, getThemeOverrides } from './utils/themeOverrides';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();

onMounted(() => {
  uiStore.initTheme();
});

const rtlPlugins = [
  unstableSelectRtl,
  unstablePopoverRtl,
  unstableButtonRtl,
  unstableInputRtl,
  unstableDataTableRtl,
  unstableDialogRtl,
  unstableMessageRtl,
  unstableNotificationRtl,
  unstableCardRtl,
  unstableTagRtl,
  unstablePaginationRtl,
  unstableListRtl
];

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

const currentNaiveTheme = computed(() => {
  return getNaiveTheme(uiStore.currentTheme);
});

// Custom theme overrides for active theme (SSOT from themeOverrides utility)
const themeOverrides = computed(() => {
  return getThemeOverrides(uiStore.currentTheme);
});
</script>

<template>
  <NConfigProvider
    :locale="faIR"
    :date-locale="dateFaIR"
    :theme="currentNaiveTheme"
    :theme-overrides="themeOverrides"
    :rtl-plugins="rtlPlugins"
  >
    <NMessageProvider>
      <NDialogProvider>
        <div class="min-h-screen bg-slate-950 text-slate-100 flex font-['Vazirmatn',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
          <!-- Main App Shell -->
          <template v-if="!isAuthPage && authStore.isAuthenticated">
            <AppSidebar />
            <div class="flex-1 flex flex-col min-w-0 min-h-screen">
              <AppHeader />
              <main class="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto max-w-[1400px] w-full mx-auto">
                <router-view />
              </main>
            </div>
          </template>

          <!-- Full Screen Auth Pages -->
          <template v-else>
            <div class="flex-1">
              <router-view />
            </div>
          </template>
        </div>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
