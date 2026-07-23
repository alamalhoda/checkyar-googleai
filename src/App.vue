<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  faIR,
  dateFaIR,
  darkTheme
} from 'naive-ui';
import AppSidebar from './shared/components/AppSidebar.vue';
import AppHeader from './shared/components/AppHeader.vue';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const authStore = useAuthStore();

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

// Custom theme overrides for dark slate aesthetic
const themeOverrides = {
  common: {
    primaryColor: '#10b981',
    primaryColorHover: '#059669',
    primaryColorPressed: '#047857',
    primaryColorSuppl: '#10b981',
    borderRadius: '8px'
  },
  Card: {
    color: '#0f172a',
    borderColor: '#1e293b'
  }
};
</script>

<template>
  <NConfigProvider
    :locale="faIR"
    :date-locale="dateFaIR"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NDialogProvider>
        <div class="min-h-screen bg-slate-950 text-slate-100 flex font-['Vazirmatn',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
          <!-- Main App Shell -->
          <template v-if="!isAuthPage && authStore.isAuthenticated">
            <AppSidebar />
            <div class="flex-1 flex flex-col min-w-0 min-h-screen">
              <AppHeader />
              <main class="flex-1 p-6 overflow-y-auto max-w-[1400px] w-full mx-auto">
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

<style>
/* Global scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #090d16;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
