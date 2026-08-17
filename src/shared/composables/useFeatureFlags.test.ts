import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFeatureFlags } from './useFeatureFlags';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';
import { adminApi, setMockMode } from '../../api';

describe('useFeatureFlags', () => {
  let storage: Record<string, string> = {};

  beforeEach(() => {
    storage = {};
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { storage = {}; },
    };
    globalThis.localStorage = mockLocalStorage as any;
    vi.stubEnv('VITE_USE_MOCK', 'true');
    setMockMode(true);
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('provides showRiskTier computed defaulting to false initially when flag is disabled', async () => {
    const store = useBackendSimulatorStore();
    store.init();
    
    // Ensure show_risk_tier is present and false
    const flag = store.featureFlags.find(f => f.key === 'show_risk_tier');
    expect(flag).toBeDefined();
    expect(flag?.is_enabled).toBe(false);

    const { showRiskTier, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showRiskTier.value).toBe(false);
  });

  it('merges missing show_risk_tier seed flag from stale localStorage (defaulting to disabled) and persists', async () => {
    // Simulate stale storage that was saved before show_risk_tier was introduced
    const staleStorage = {
      users: [{ id: 1, username: 'holder1', name: 'رضا صبوری' }],
      listings: [{ id: 101, bank_name: 'بانک ملت' }],
      featureFlags: [
        { key: 'ENABLE_ESCROW_SETTLEMENT', description: 'تسویه امن امانی', is_enabled: true, is_system: true },
        { key: 'ENABLE_SMS_NOTIFICATIONS', description: 'ارسال پیامک', is_enabled: true, is_system: false }
      ]
    };
    localStorage.setItem('chequeyar_simulator_v1', JSON.stringify(staleStorage));

    const store = useBackendSimulatorStore();
    store.init();

    // Verify show_risk_tier was merged in, defaulting to disabled
    const riskFlag = store.featureFlags.find(f => f.key === 'show_risk_tier');
    expect(riskFlag).toBeDefined();
    expect(riskFlag?.is_enabled).toBe(false);

    // Verify existing user data was preserved without being reset
    expect(store.users.length).toBeGreaterThanOrEqual(1);
    expect(store.users[0].username).toBe('holder1');

    // Verify local storage was updated with the merged flag
    const stored = JSON.parse(localStorage.getItem('chequeyar_simulator_v1') || '{}');
    expect(stored.featureFlags.some((f: any) => f.key === 'show_risk_tier')).toBe(true);

    const { showRiskTier, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showRiskTier.value).toBe(false);
  });

  it('updates showRiskTier to true when show_risk_tier flag is toggled on and refreshed', async () => {
    const store = useBackendSimulatorStore();
    store.init();

    await adminApi.updateFeatureFlag('show_risk_tier', true);

    const { showRiskTier, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showRiskTier.value).toBe(true);

    // Verify persistence across reloads
    const persisted = JSON.parse(localStorage.getItem('chequeyar_simulator_v1') || '{}');
    const persistedFlag = persisted.featureFlags.find((f: any) => f.key === 'show_risk_tier');
    expect(persistedFlag?.is_enabled).toBe(true);

    // Toggle back to false
    await adminApi.updateFeatureFlag('show_risk_tier', false);
    await fetchFlags(true);
    expect(showRiskTier.value).toBe(false);
  });

  it('provides showLandingPage computed defaulting to true in simulator mock mode', async () => {
    const store = useBackendSimulatorStore();
    store.init();

    const flag = store.featureFlags.find(f => f.key === 'show_landing_page');
    expect(flag).toBeDefined();
    expect(flag?.is_enabled).toBe(true);

    const { showLandingPage, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showLandingPage.value).toBe(true);
  });

  it('updates showLandingPage to false when toggled off in simulator and refreshed', async () => {
    const store = useBackendSimulatorStore();
    store.init();

    await adminApi.updateFeatureFlag('show_landing_page', false);

    const { showLandingPage, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showLandingPage.value).toBe(false);

    // Verify persistence
    const persisted = JSON.parse(localStorage.getItem('chequeyar_simulator_v1') || '{}');
    const persistedFlag = persisted.featureFlags.find((f: any) => f.key === 'show_landing_page');
    expect(persistedFlag?.is_enabled).toBe(false);
  });

  it('merges missing show_landing_page seed flag into stored simulator state without reset', async () => {
    const staleStorage = {
      users: [{ id: 1, username: 'holder1', name: 'رضا صبوری' }],
      listings: [{ id: 101, bank_name: 'بانک ملت' }],
      featureFlags: [
        { key: 'ENABLE_ESCROW_SETTLEMENT', description: 'تسویه امن امانی', is_enabled: true, is_system: true },
        { key: 'show_risk_tier', description: 'سطح ریسک', is_enabled: false, is_system: false }
      ]
    };
    localStorage.setItem('chequeyar_simulator_v1', JSON.stringify(staleStorage));

    const store = useBackendSimulatorStore();
    store.init();

    const landingFlag = store.featureFlags.find(f => f.key === 'show_landing_page');
    expect(landingFlag).toBeDefined();
    expect(landingFlag?.is_enabled).toBe(true);

    // User data intact
    expect(store.users.length).toBeGreaterThanOrEqual(1);
    expect(store.users[0].username).toBe('holder1');

    const stored = JSON.parse(localStorage.getItem('chequeyar_simulator_v1') || '{}');
    expect(stored.featureFlags.some((f: any) => f.key === 'show_landing_page')).toBe(true);

    const { showLandingPage, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showLandingPage.value).toBe(true);
  });

  it('fails closed (showLandingPage=false) when flag is absent or request fails', async () => {
    const { showLandingPage, fetchFlags, flags } = useFeatureFlags();

    // 1. Flag absent from API response
    vi.spyOn(adminApi, 'getFeatureFlags').mockResolvedValueOnce([
      { key: 'show_risk_tier', description: 'risk tier', is_enabled: true, is_system: false }
    ] as any);
    await fetchFlags(true);
    expect(showLandingPage.value).toBe(false);

    // 2. Request failure (swallowed error, empty fallback)
    vi.spyOn(adminApi, 'getFeatureFlags').mockRejectedValueOnce(new Error('Network error'));
    flags.value = [];
    await fetchFlags(true);
    expect(showLandingPage.value).toBe(false);
  });
});


