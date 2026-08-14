import type { AppTheme } from '../../../stores/useUiStore';

export interface ChartThemeConfig {
  mode: 'dark' | 'light';
  foreColor: string;
  gridBorder: string;
  axisBorder: string;
  axisTicks: string;
  labelsColor: string;
  legendColor: string;
  tooltipTheme: 'dark' | 'light';
  palette: string[];
}

export function getApexChartThemeConfig(theme: AppTheme): ChartThemeConfig {
  if (theme === 'light') {
    return {
      mode: 'light',
      foreColor: '#475569',
      gridBorder: '#e2e8f0',
      axisBorder: '#cbd5e1',
      axisTicks: '#cbd5e1',
      labelsColor: '#64748b',
      legendColor: '#334155',
      tooltipTheme: 'light',
      palette: ['#059669', '#d97706', '#8b5cf6', '#2563eb', '#e11d48', '#0d9488', '#ca8a04']
    };
  }

  if (theme === 'warm') {
    return {
      mode: 'light',
      foreColor: '#57534e',
      gridBorder: '#e7e5e4',
      axisBorder: '#d6d3d1',
      axisTicks: '#d6d3d1',
      labelsColor: '#78716c',
      legendColor: '#44403c',
      tooltipTheme: 'light',
      palette: ['#d97706', '#b45309', '#9a3412', '#78350f', '#0284c7', '#16a34a', '#ca8a04']
    };
  }

  if (theme === 'navy') {
    return {
      mode: 'dark',
      foreColor: '#93c5fd',
      gridBorder: '#1f3463',
      axisBorder: '#2a437c',
      axisTicks: '#2a437c',
      labelsColor: '#93c5fd',
      legendColor: '#bfdbfe',
      tooltipTheme: 'dark',
      palette: ['#f59e0b', '#fbbf24', '#60a5fa', '#38bdf8', '#f43f5e', '#34d399', '#a78bfa']
    };
  }

  if (theme === 'violet') {
    return {
      mode: 'dark',
      foreColor: '#e9d5ff',
      gridBorder: '#38235a',
      axisBorder: '#4c3078',
      axisTicks: '#4c3078',
      labelsColor: '#d8b4fe',
      legendColor: '#e9d5ff',
      tooltipTheme: 'dark',
      palette: ['#a855f7', '#c084fc', '#e879f9', '#38bdf8', '#f43f5e', '#34d399', '#fbbf24']
    };
  }

  if (theme === 'emerald') {
    return {
      mode: 'dark',
      foreColor: '#99f6e4',
      gridBorder: '#0d5442',
      axisBorder: '#116952',
      axisTicks: '#116952',
      labelsColor: '#5eead4',
      legendColor: '#99f6e4',
      tooltipTheme: 'dark',
      palette: ['#14b8a6', '#2dd4bf', '#5eead4', '#38bdf8', '#f59e0b', '#f43f5e', '#a78bfa']
    };
  }

  // default 'dark'
  return {
    mode: 'dark',
    foreColor: '#94a3b8',
    gridBorder: '#1e293b',
    axisBorder: '#334155',
    axisTicks: '#334155',
    labelsColor: '#94a3b8',
    legendColor: '#cbd5e1',
    tooltipTheme: 'dark',
    palette: ['#10b981', '#f59e0b', '#a855f7', '#3b82f6', '#f43f5e', '#14b8a6', '#eab308']
  };
}
