import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUiStore } from './useUiStore';

describe('useUiStore', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('initializes with default values when localStorage is empty', () => {
    const store = useUiStore();
    expect(store.isMobileMenuOpen).toBe(false);
    expect(store.isSidebarCollapsed).toBe(false);
    expect(store.wizardMode).toBe(true);
    expect(store.isPowerUser).toBe(false);
    expect(store.isAdvancedModerator).toBe(false);
  });

  it('rehydrates isSidebarCollapsed from localStorage when true', () => {
    localStorage.setItem('chequeyar_sidebar_collapsed', 'true');
    const store = useUiStore();
    expect(store.isSidebarCollapsed).toBe(true);
  });

  it('toggles isSidebarCollapsed and persists to localStorage', () => {
    const store = useUiStore();
    expect(store.isSidebarCollapsed).toBe(false);

    store.toggleSidebarCollapsed();
    expect(store.isSidebarCollapsed).toBe(true);
    expect(localStorage.getItem('chequeyar_sidebar_collapsed')).toBe('true');

    store.toggleSidebarCollapsed();
    expect(store.isSidebarCollapsed).toBe(false);
    expect(localStorage.getItem('chequeyar_sidebar_collapsed')).toBe('false');
  });

  it('sets isSidebarCollapsed explicitly and persists to localStorage', () => {
    const store = useUiStore();
    store.setSidebarCollapsed(true);
    expect(store.isSidebarCollapsed).toBe(true);
    expect(localStorage.getItem('chequeyar_sidebar_collapsed')).toBe('true');

    store.setSidebarCollapsed(false);
    expect(store.isSidebarCollapsed).toBe(false);
    expect(localStorage.getItem('chequeyar_sidebar_collapsed')).toBe('false');
  });

  it('controls mobile menu independently from sidebar collapsed state', () => {
    const store = useUiStore();
    store.setSidebarCollapsed(true);

    expect(store.isMobileMenuOpen).toBe(false);
    expect(store.isSidebarCollapsed).toBe(true);

    store.openMobileMenu();
    expect(store.isMobileMenuOpen).toBe(true);
    expect(store.isSidebarCollapsed).toBe(true);

    store.toggleMobileMenu();
    expect(store.isMobileMenuOpen).toBe(false);
    expect(store.isSidebarCollapsed).toBe(true);

    store.closeMobileMenu();
    expect(store.isMobileMenuOpen).toBe(false);
    expect(store.isSidebarCollapsed).toBe(true);
  });
});
