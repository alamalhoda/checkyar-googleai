import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import MarketplaceView from './MarketplaceView.vue';
import { marketplaceApi } from '../../api';

vi.mock('../../api', () => ({
  marketplaceApi: {
    getListings: vi.fn().mockResolvedValue({ count: 0, results: [] }),
    expressInterest: vi.fn(),
  },
  adminApi: {
    getFeatureFlags: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../../stores/useBackendSimulatorStore', () => ({
  useBackendSimulatorStore: () => ({
    featureFlags: [],
  }),
}));

describe('MarketplaceView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('calls getListings with bank code and strips bank_name when bank is selected', async () => {
    const wrapper = mount(MarketplaceView, {
      global: {
        stubs: {
          BankSelect: true,
          NButton: true,
          NInputNumber: true,
          NSelect: true,
          NEmpty: true,
          NPagination: true,
          NDataTable: true,
          NIcon: true,
          NTag: true,
          ConfirmDialog: true,
        },
      },
    });

    await nextTick();
    const vm = wrapper.vm as any;

    // Set bank filter to 'mellat'
    vm.filters.bank = 'mellat';
    await vm.loadListings();

    expect(marketplaceApi.getListings).toHaveBeenCalledWith(
      expect.objectContaining({
        bank: 'mellat',
      })
    );

    const lastCallArg = vi.mocked(marketplaceApi.getListings).mock.calls.at(-1)?.[0];
    expect(lastCallArg).not.toHaveProperty('bank_name');
  });

  it('deletes both bank and bank_name when bank filter is cleared or empty', async () => {
    const wrapper = mount(MarketplaceView, {
      global: {
        stubs: {
          BankSelect: true,
          NButton: true,
          NInputNumber: true,
          NSelect: true,
          NEmpty: true,
          NPagination: true,
          NDataTable: true,
          NIcon: true,
          NTag: true,
          ConfirmDialog: true,
        },
      },
    });

    await nextTick();
    const vm = wrapper.vm as any;

    // Set bank filter to ''
    vm.filters.bank = '';
    await vm.loadListings();

    const lastCallArg = vi.mocked(marketplaceApi.getListings).mock.calls.at(-1)?.[0];
    expect(lastCallArg).not.toHaveProperty('bank');
    expect(lastCallArg).not.toHaveProperty('bank_name');
  });
});
