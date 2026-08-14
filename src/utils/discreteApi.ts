import { computed } from 'vue';
import { createDiscreteApi, type ConfigProviderProps } from 'naive-ui';
import { useUiStore, type AppTheme } from '../stores/useUiStore';
import { getNaiveTheme, getThemeOverrides } from './themeOverrides';

const configProviderProps = computed<ConfigProviderProps>(() => {
  let theme: AppTheme = 'dark';
  try {
    const uiStore = useUiStore();
    if (uiStore && uiStore.currentTheme) {
      theme = uiStore.currentTheme;
    }
  } catch {
    // Pinia not active yet, check document attribute or fallback
    if (typeof document !== 'undefined') {
      const docTheme = document.documentElement.getAttribute('data-theme') as AppTheme;
      if (docTheme) theme = docTheme;
    }
  }

  return {
    theme: getNaiveTheme(theme),
    themeOverrides: getThemeOverrides(theme)
  };
});

export const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'notification', 'dialog', 'loadingBar'],
  { configProviderProps }
);
