<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  faIR,
  dateFaIR,
  darkTheme,
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
  if (uiStore.currentTheme === 'light' || uiStore.currentTheme === 'warm') {
    return null;
  }
  return darkTheme;
});

// Custom theme overrides for active theme
const themeOverrides = computed(() => {
  if (uiStore.currentTheme === 'light') {
    return {
      common: {
        primaryColor: '#059669',
        primaryColorHover: '#047857',
        primaryColorPressed: '#065f46',
        primaryColorSuppl: '#10b981',
        borderRadius: '8px',
        cardColor: '#ffffff',
        modalColor: '#ffffff',
        popoverColor: '#ffffff',
        tableColor: '#ffffff',
        bodyColor: '#f8fafc',
        textColorBase: '#0f172a',
        textColor1: '#0f172a',
        textColor2: '#334155',
        textColor3: '#64748b'
      },
      Card: {
        color: '#ffffff',
        borderColor: '#e2e8f0'
      }
    };
  } else if (uiStore.currentTheme === 'warm') {
    return {
      common: {
        primaryColor: '#d97706',
        primaryColorHover: '#b45309',
        primaryColorPressed: '#92400e',
        primaryColorSuppl: '#f59e0b',
        borderRadius: '8px',
        cardColor: '#fffdfa',
        modalColor: '#fffdfa',
        popoverColor: '#fffdfa',
        tableColor: '#fffdfa',
        bodyColor: '#fcf8f2',
        textColorBase: '#292524',
        textColor1: '#292524',
        textColor2: '#57534e',
        textColor3: '#78716c'
      },
      Card: {
        color: '#fffdfa',
        borderColor: '#e7e5e4'
      }
    };
  } else if (uiStore.currentTheme === 'navy') {
    return {
      common: {
        primaryColor: '#f59e0b',
        primaryColorHover: '#d97706',
        primaryColorPressed: '#b45309',
        primaryColorSuppl: '#fbbf24',
        borderRadius: '8px',
        cardColor: '#111e3f',
        modalColor: '#111e3f',
        popoverColor: '#111e3f',
        tableColor: '#111e3f',
        bodyColor: '#060c1d',
        textColorBase: '#f8fafc',
        textColor1: '#f8fafc',
        textColor2: '#93c5fd',
        textColor3: '#60a5fa'
      },
      Card: {
        color: '#111e3f',
        borderColor: '#1f3463'
      }
    };
  } else if (uiStore.currentTheme === 'violet') {
    return {
      common: {
        primaryColor: '#a855f7',
        primaryColorHover: '#9333ea',
        primaryColorPressed: '#7e22ce',
        primaryColorSuppl: '#c084fc',
        borderRadius: '8px',
        cardColor: '#1e1333',
        modalColor: '#1e1333',
        popoverColor: '#1e1333',
        tableColor: '#1e1333',
        bodyColor: '#0d0818',
        textColorBase: '#f8fafc',
        textColor1: '#f8fafc',
        textColor2: '#e9d5ff',
        textColor3: '#c084fc'
      },
      Card: {
        color: '#1e1333',
        borderColor: '#322050'
      }
    };
  } else if (uiStore.currentTheme === 'emerald') {
    return {
      common: {
        primaryColor: '#14b8a6',
        primaryColorHover: '#0d9488',
        primaryColorPressed: '#0f766e',
        primaryColorSuppl: '#2dd4bf',
        borderRadius: '8px',
        cardColor: '#062e24',
        modalColor: '#062e24',
        popoverColor: '#062e24',
        tableColor: '#062e24',
        bodyColor: '#021a14',
        textColorBase: '#f8fafc',
        textColor1: '#f8fafc',
        textColor2: '#99f6e4',
        textColor3: '#5eead4'
      },
      Card: {
        color: '#062e24',
        borderColor: '#0c4a3b'
      }
    };
  } else {
    // dark theme (default)
    return {
      common: {
        primaryColor: '#10b981',
        primaryColorHover: '#059669',
        primaryColorPressed: '#047857',
        primaryColorSuppl: '#10b981',
        borderRadius: '8px',
        cardColor: '#0f172a',
        borderColor: '#1e293b'
      },
      Card: {
        color: '#0f172a',
        borderColor: '#1e293b'
      }
    };
  }
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
