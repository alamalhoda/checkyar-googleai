import type { GlobalThemeOverrides } from 'naive-ui';
import { darkTheme } from 'naive-ui';
import type { AppTheme } from '../stores/useUiStore';

export function getNaiveTheme(theme: AppTheme) {
  if (theme === 'light' || theme === 'warm') {
    return null;
  }
  return darkTheme;
}

export function getThemeOverrides(theme: AppTheme): GlobalThemeOverrides {
  const baseCommon = {
    fontFamily: "'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilyMono: "'Vazirmatn', monospace"
  };

  if (theme === 'light') {
    return {
      common: {
        ...baseCommon,
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
        textColor3: '#64748b',
        borderColor: '#e2e8f0',
        dividerColor: '#e2e8f0',
        inputColor: '#f8fafc',
        actionColor: '#f1f5f9',
        hoverColor: '#f1f5f9'
      },
      Card: {
        color: '#ffffff',
        borderColor: '#e2e8f0',
        textColor: '#0f172a',
        titleTextColor: '#0f172a'
      },
      Modal: {
        color: '#ffffff',
        textColor: '#0f172a'
      },
      DataTable: {
        thColor: '#f1f5f9',
        tdColor: '#ffffff',
        tdColorHover: '#f8fafc',
        borderColor: '#e2e8f0'
      },
      Menu: {
        itemTextColor: '#475569',
        itemTextColorHover: '#059669',
        itemTextColorActive: '#059669',
        itemIconColor: '#64748b',
        itemIconColorHover: '#059669',
        itemIconColorActive: '#059669',
        itemColorActive: 'rgba(5, 150, 105, 0.1)',
        itemColorHover: '#f1f5f9'
      }
    };
  } else if (theme === 'warm') {
    return {
      common: {
        ...baseCommon,
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
        textColor3: '#78716c',
        borderColor: '#e7e5e4',
        dividerColor: '#e7e5e4',
        inputColor: '#fcf8f2',
        actionColor: '#f5efe6',
        hoverColor: '#f5efe6'
      },
      Card: {
        color: '#fffdfa',
        borderColor: '#e7e5e4',
        textColor: '#292524',
        titleTextColor: '#292524'
      },
      Modal: {
        color: '#fffdfa',
        textColor: '#292524'
      },
      DataTable: {
        thColor: '#f5efe6',
        tdColor: '#fffdfa',
        tdColorHover: '#fcf8f2',
        borderColor: '#e7e5e4'
      },
      Menu: {
        itemTextColor: '#57534e',
        itemTextColorHover: '#d97706',
        itemTextColorActive: '#d97706',
        itemIconColor: '#78716c',
        itemIconColorHover: '#d97706',
        itemIconColorActive: '#d97706',
        itemColorActive: 'rgba(217, 119, 6, 0.12)',
        itemColorHover: '#f5efe6'
      }
    };
  } else if (theme === 'navy') {
    return {
      common: {
        ...baseCommon,
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
        textColor3: '#60a5fa',
        borderColor: '#1f3463',
        dividerColor: '#1f3463',
        inputColor: '#0d1630',
        actionColor: '#192a54',
        hoverColor: '#192a54'
      },
      Card: {
        color: '#111e3f',
        borderColor: '#1f3463',
        textColor: '#f8fafc',
        titleTextColor: '#f8fafc'
      },
      Modal: {
        color: '#111e3f',
        textColor: '#f8fafc'
      },
      DataTable: {
        thColor: '#0d1630',
        tdColor: '#111e3f',
        tdColorHover: '#192a54',
        borderColor: '#1f3463'
      },
      Menu: {
        itemTextColor: '#93c5fd',
        itemTextColorHover: '#fbbf24',
        itemTextColorActive: '#fbbf24',
        itemIconColor: '#60a5fa',
        itemIconColorHover: '#fbbf24',
        itemIconColorActive: '#fbbf24',
        itemColorActive: 'rgba(245, 158, 11, 0.15)',
        itemColorHover: '#192a54'
      }
    };
  } else if (theme === 'violet') {
    return {
      common: {
        ...baseCommon,
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
        textColor3: '#c084fc',
        borderColor: '#38235a',
        dividerColor: '#38235a',
        inputColor: '#160d29',
        actionColor: '#2b1b47',
        hoverColor: '#2b1b47'
      },
      Card: {
        color: '#1e1333',
        borderColor: '#38235a',
        textColor: '#f8fafc',
        titleTextColor: '#f8fafc'
      },
      Modal: {
        color: '#1e1333',
        textColor: '#f8fafc'
      },
      DataTable: {
        thColor: '#160d29',
        tdColor: '#1e1333',
        tdColorHover: '#2b1b47',
        borderColor: '#38235a'
      },
      Menu: {
        itemTextColor: '#e9d5ff',
        itemTextColorHover: '#c084fc',
        itemTextColorActive: '#c084fc',
        itemIconColor: '#c084fc',
        itemIconColorHover: '#c084fc',
        itemIconColorActive: '#c084fc',
        itemColorActive: 'rgba(168, 85, 247, 0.15)',
        itemColorHover: '#2b1b47'
      }
    };
  } else if (theme === 'emerald') {
    return {
      common: {
        ...baseCommon,
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
        textColor3: '#5eead4',
        borderColor: '#0d5442',
        dividerColor: '#0d5442',
        inputColor: '#04241c',
        actionColor: '#0a4032',
        hoverColor: '#0a4032'
      },
      Card: {
        color: '#062e24',
        borderColor: '#0d5442',
        textColor: '#f8fafc',
        titleTextColor: '#f8fafc'
      },
      Modal: {
        color: '#062e24',
        textColor: '#f8fafc'
      },
      DataTable: {
        thColor: '#04241c',
        tdColor: '#062e24',
        tdColorHover: '#0a4032',
        borderColor: '#0d5442'
      },
      Menu: {
        itemTextColor: '#99f6e4',
        itemTextColorHover: '#2dd4bf',
        itemTextColorActive: '#2dd4bf',
        itemIconColor: '#5eead4',
        itemIconColorHover: '#2dd4bf',
        itemIconColorActive: '#2dd4bf',
        itemColorActive: 'rgba(20, 184, 166, 0.15)',
        itemColorHover: '#0a4032'
      }
    };
  } else {
    // dark theme (default)
    return {
      common: {
        ...baseCommon,
        primaryColor: '#10b981',
        primaryColorHover: '#059669',
        primaryColorPressed: '#047857',
        primaryColorSuppl: '#10b981',
        borderRadius: '8px',
        cardColor: '#0f172a',
        modalColor: '#0f172a',
        popoverColor: '#0f172a',
        tableColor: '#0f172a',
        bodyColor: '#020617',
        textColorBase: '#f8fafc',
        textColor1: '#f8fafc',
        textColor2: '#cbd5e1',
        textColor3: '#94a3b8',
        borderColor: '#1e293b',
        dividerColor: '#1e293b',
        inputColor: '#090d16',
        actionColor: '#1e293b',
        hoverColor: '#1e293b'
      },
      Card: {
        color: '#0f172a',
        borderColor: '#1e293b',
        textColor: '#f8fafc',
        titleTextColor: '#f8fafc'
      },
      Modal: {
        color: '#0f172a',
        textColor: '#f8fafc'
      },
      DataTable: {
        thColor: '#090d16',
        tdColor: '#0f172a',
        tdColorHover: '#1e293b',
        borderColor: '#1e293b'
      },
      Menu: {
        itemTextColor: '#cbd5e1',
        itemTextColorHover: '#10b981',
        itemTextColorActive: '#10b981',
        itemIconColor: '#94a3b8',
        itemIconColorHover: '#10b981',
        itemIconColorActive: '#10b981',
        itemColorActive: 'rgba(16, 185, 129, 0.15)',
        itemColorHover: '#1e293b'
      }
    };
  }
}
