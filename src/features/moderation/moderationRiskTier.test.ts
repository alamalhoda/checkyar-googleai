import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';

describe('Moderation Decision with risk_tier', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('updates listing risk_tier when approved with explicit risk_tier parameter', () => {
    const store = useBackendSimulatorStore();
    store.init();

    const queue = store.getModerationQueue();
    expect(queue.length).toBeGreaterThan(0);
    const targetItem = queue[0];

    // Approve with explicit risk_tier = 'high'
    store.handleModerationDecision(targetItem.id, 1, {
      decision: 'approve',
      risk_tier: 'high'
    });

    const updatedListing = store.getListingById(targetItem.id);
    expect(updatedListing.status).toBe('published');
    expect(updatedListing.risk_tier).toBe('high');
  });

  it('retains existing risk_tier when approved without explicit risk_tier parameter', () => {
    const store = useBackendSimulatorStore();
    store.init();

    const queue = store.getModerationQueue();
    expect(queue.length).toBeGreaterThan(0);
    const targetItem = queue[0];
    const initialRiskTier = targetItem.risk_tier;

    // Approve omitting risk_tier
    store.handleModerationDecision(targetItem.id, 1, {
      decision: 'approve'
    });

    const updatedListing = store.getListingById(targetItem.id);
    expect(updatedListing.status).toBe('published');
    expect(updatedListing.risk_tier).toBe(initialRiskTier);
  });
});
