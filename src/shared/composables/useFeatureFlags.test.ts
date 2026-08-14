import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFeatureFlags } from './useFeatureFlags';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';
import { adminApi } from '../../api';

describe('useFeatureFlags', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
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
});

