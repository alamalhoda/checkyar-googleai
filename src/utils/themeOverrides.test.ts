import { describe, it, expect } from 'vitest';
import { getNaiveTheme, getThemeOverrides } from './themeOverrides';
import type { AppTheme } from '../stores/useUiStore';
import { darkTheme } from 'naive-ui';

describe('themeOverrides', () => {
  const themes: AppTheme[] = ['dark', 'light', 'warm', 'navy', 'violet', 'emerald'];

  describe('getNaiveTheme', () => {
    it('returns null for light and warm themes', () => {
      expect(getNaiveTheme('light')).toBeNull();
      expect(getNaiveTheme('warm')).toBeNull();
    });

    it('returns darkTheme for dark, navy, violet, and emerald themes', () => {
      expect(getNaiveTheme('dark')).toBe(darkTheme);
      expect(getNaiveTheme('navy')).toBe(darkTheme);
      expect(getNaiveTheme('violet')).toBe(darkTheme);
      expect(getNaiveTheme('emerald')).toBe(darkTheme);
    });
  });

  describe('getThemeOverrides', () => {
    it('returns valid overrides with common and component tokens for every theme', () => {
      for (const theme of themes) {
        const overrides = getThemeOverrides(theme);
        expect(overrides).toBeDefined();
        expect(overrides.common).toBeDefined();
        expect(overrides.common?.primaryColor).toBeDefined();
        expect(overrides.common?.fontFamily).toContain('Vazirmatn');
        expect(overrides.Card).toBeDefined();
        expect(overrides.DataTable).toBeDefined();
        expect(overrides.Menu).toBeDefined();
      }
    });

    it('sets appropriate primary and background colors for light theme', () => {
      const overrides = getThemeOverrides('light');
      expect(overrides.common?.primaryColor).toBe('#059669');
      expect(overrides.common?.bodyColor).toBe('#f8fafc');
      expect(overrides.common?.cardColor).toBe('#ffffff');
      expect(overrides.Card?.color).toBe('#ffffff');
    });

    it('sets appropriate warm amber colors for warm theme', () => {
      const overrides = getThemeOverrides('warm');
      expect(overrides.common?.primaryColor).toBe('#d97706');
      expect(overrides.common?.bodyColor).toBe('#fcf8f2');
      expect(overrides.common?.cardColor).toBe('#fffdfa');
    });

    it('sets navy background and accent colors for navy theme', () => {
      const overrides = getThemeOverrides('navy');
      expect(overrides.common?.bodyColor).toBe('#060c1d');
      expect(overrides.common?.cardColor).toBe('#111e3f');
      expect(overrides.common?.primaryColor).toBe('#f59e0b');
    });

    it('sets violet background and purple accents for violet theme', () => {
      const overrides = getThemeOverrides('violet');
      expect(overrides.common?.bodyColor).toBe('#0d0818');
      expect(overrides.common?.cardColor).toBe('#1e1333');
      expect(overrides.common?.primaryColor).toBe('#a855f7');
    });

    it('sets emerald background and teal accents for emerald theme', () => {
      const overrides = getThemeOverrides('emerald');
      expect(overrides.common?.bodyColor).toBe('#021a14');
      expect(overrides.common?.cardColor).toBe('#062e24');
      expect(overrides.common?.primaryColor).toBe('#14b8a6');
    });

    it('sets default dark colors for dark theme', () => {
      const overrides = getThemeOverrides('dark');
      expect(overrides.common?.bodyColor).toBe('#020617');
      expect(overrides.common?.cardColor).toBe('#0f172a');
      expect(overrides.common?.primaryColor).toBe('#10b981');
    });
  });
});
