import { defineStore } from 'pinia';
import { ref } from 'vue';

export type AppTheme = 'dark' | 'light' | 'navy' | 'violet' | 'emerald' | 'warm';

export const useUiStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false);
  const currentTheme = ref<AppTheme>('dark');

  function initTheme() {
    const saved = localStorage.getItem('chequeyar_app_theme') as AppTheme | null;
    if (saved && ['dark', 'light', 'navy', 'violet', 'emerald', 'warm'].includes(saved)) {
      currentTheme.value = saved;
    } else {
      currentTheme.value = 'dark';
    }
    applyThemeToDocument(currentTheme.value);
  }

  function setTheme(theme: AppTheme) {
    currentTheme.value = theme;
    localStorage.setItem('chequeyar_app_theme', theme);
    applyThemeToDocument(theme);
  }

  function applyThemeToDocument(theme: AppTheme) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light' || theme === 'warm') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false;
  }

  function openMobileMenu() {
    isMobileMenuOpen.value = true;
  }

  return {
    isMobileMenuOpen,
    currentTheme,
    initTheme,
    setTheme,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu
  };
});

