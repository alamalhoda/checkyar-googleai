import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFeatureFlags } from './useFeatureFlags';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';

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

  it('updates showRiskTier to true when show_risk_tier flag is toggled on', async () => {
    const store = useBackendSimulatorStore();
    store.init();

    // Toggle show_risk_tier flag to true
    const flag = store.featureFlags.find(f => f.key === 'show_risk_tier');
    if (flag) {
      flag.is_enabled = true;
    }

    const { showRiskTier, fetchFlags } = useFeatureFlags();
    await fetchFlags(true);
    expect(showRiskTier.value).toBe(true);
  });
});
