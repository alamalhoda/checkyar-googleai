import { defineStore } from 'pinia';
import { ref } from 'vue';

export type AppTheme = 'dark' | 'light' | 'navy' | 'violet' | 'emerald' | 'warm';

export const useUiStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false);
  const currentTheme = ref<AppTheme>('dark');

  // Hybrid UX Preferences
  const wizardMode = ref<boolean>(localStorage.getItem('chequeyar_wizard_mode') !== 'false'); // default true (wizard)
  const isPowerUser = ref<boolean>(localStorage.getItem('chequeyar_power_user') === 'true'); // default false
  const isAdvancedModerator = ref<boolean>(localStorage.getItem('chequeyar_advanced_mod') === 'true'); // default false

  function setWizardMode(val: boolean) {
    wizardMode.value = val;
    localStorage.setItem('chequeyar_wizard_mode', String(val));
  }

  function setPowerUser(val: boolean) {
    isPowerUser.value = val;
    localStorage.setItem('chequeyar_power_user', String(val));
  }

  function setAdvancedModerator(val: boolean) {
    isAdvancedModerator.value = val;
    localStorage.setItem('chequeyar_advanced_mod', String(val));
  }

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
    wizardMode,
    isPowerUser,
    isAdvancedModerator,
    setWizardMode,
    setPowerUser,
    setAdvancedModerator,
    initTheme,
    setTheme,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu
  };
});

