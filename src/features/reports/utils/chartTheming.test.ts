import { describe, it, expect } from 'vitest';
import { getApexChartThemeConfig } from './chartTheming';
import type { AppTheme } from '../../../stores/useUiStore';

describe('chartTheming', () => {
  const themes: AppTheme[] = ['dark', 'light', 'warm', 'navy', 'violet', 'emerald'];

  it('returns valid chart configuration for all supported themes', () => {
    for (const theme of themes) {
      const config = getApexChartThemeConfig(theme);
      expect(config).toBeDefined();
      expect(['dark', 'light']).toContain(config.mode);
      expect(['dark', 'light']).toContain(config.tooltipTheme);
      expect(config.foreColor).toBeTruthy();
      expect(config.gridBorder).toBeTruthy();
      expect(config.axisBorder).toBeTruthy();
      expect(config.axisTicks).toBeTruthy();
      expect(config.labelsColor).toBeTruthy();
      expect(config.legendColor).toBeTruthy();
      expect(Array.isArray(config.palette)).toBe(true);
      expect(config.palette.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('uses light mode and light tooltip for light and warm themes', () => {
    const lightConfig = getApexChartThemeConfig('light');
    expect(lightConfig.mode).toBe('light');
    expect(lightConfig.tooltipTheme).toBe('light');

    const warmConfig = getApexChartThemeConfig('warm');
    expect(warmConfig.mode).toBe('light');
    expect(warmConfig.tooltipTheme).toBe('light');
  });

  it('uses dark mode and dark tooltip for dark, navy, violet, and emerald themes', () => {
    for (const theme of ['dark', 'navy', 'violet', 'emerald'] as AppTheme[]) {
      const config = getApexChartThemeConfig(theme);
      expect(config.mode).toBe('dark');
      expect(config.tooltipTheme).toBe('dark');
    }
  });

  it('uses navy-specific palette and foreColor for navy theme', () => {
    const config = getApexChartThemeConfig('navy');
    expect(config.foreColor).toBe('#93c5fd');
    expect(config.gridBorder).toBe('#1f3463');
  });

  it('uses violet-specific palette and foreColor for violet theme', () => {
    const config = getApexChartThemeConfig('violet');
    expect(config.foreColor).toBe('#e9d5ff');
    expect(config.gridBorder).toBe('#38235a');
  });

  it('uses emerald-specific palette and foreColor for emerald theme', () => {
    const config = getApexChartThemeConfig('emerald');
    expect(config.foreColor).toBe('#99f6e4');
    expect(config.gridBorder).toBe('#0d5442');
  });
});
