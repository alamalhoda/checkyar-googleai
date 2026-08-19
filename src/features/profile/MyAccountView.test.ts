import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, h, defineComponent } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { NMessageProvider } from 'naive-ui';
import MyAccountView from './MyAccountView.vue';
import { usersApi } from '../../api';
import { useBackendSimulatorStore } from '../../stores/useBackendSimulatorStore';

vi.mock('../../api', () => ({
  usersApi: {
    getMe: vi.fn(),
    updateMe: vi.fn(),
  },
}));

vi.mock('../../api/client', () => ({
  getMockMode: vi.fn().mockReturnValue(true),
}));

const TestWrapper = defineComponent({
  setup() {
    return () => h(NMessageProvider, () => h(MyAccountView));
  },
});

describe('MyAccountView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders payout bank select with data-testid account-payout-bank', async () => {
    vi.mocked(usersApi.getMe).mockResolvedValue({
      id: 1,
      username: 'holder1',
      email: 'holder@chequeyar.ir',
      name: 'رضا صبوری',
      role: 'check_holder',
      user_type: 'natural',
      phone: '09121111111',
      is_verified: true,
    });

    const wrapper = mount(TestWrapper);

    await nextTick();
    await nextTick();

    const bankSelect = wrapper.findComponent({ name: 'BankSelect' });
    expect(bankSelect.exists()).toBe(true);
    expect(bankSelect.props('allowAll')).toBe(false);
  });

  it('restores payout bank code from simulator store in mock mode', async () => {
    const simulatorStore = useBackendSimulatorStore();
    simulatorStore.resetToSeed();
    simulatorStore.setPayoutBankCode(1, 'tejarat');

    vi.mocked(usersApi.getMe).mockResolvedValue({
      id: 1,
      username: 'holder1',
      email: 'holder@chequeyar.ir',
      name: 'رضا صبوری',
      role: 'check_holder',
      user_type: 'natural',
      phone: '09121111111',
      is_verified: true,
    });

    const wrapper = mount(TestWrapper);

    await nextTick();
    await nextTick();

    const accountView = wrapper.findComponent(MyAccountView);
    const vm = accountView.vm as any;
    expect(vm.payoutBank).toBe('tejarat');
  });

  it('updates simulator payout bank on save in mock mode without sending bank to updateMe API', async () => {
    const simulatorStore = useBackendSimulatorStore();
    simulatorStore.resetToSeed();

    vi.mocked(usersApi.getMe).mockResolvedValue({
      id: 1,
      username: 'holder1',
      email: 'holder@chequeyar.ir',
      name: 'رضا صبوری',
      role: 'check_holder',
      user_type: 'natural',
      phone: '09121111111',
      is_verified: true,
    });

    vi.mocked(usersApi.updateMe).mockResolvedValue({
      id: 1,
      username: 'holder1',
      email: 'holder@chequeyar.ir',
      name: 'رضا صبوری جدید',
      role: 'check_holder',
      user_type: 'natural',
      phone: '09121111111',
      is_verified: true,
    });

    const wrapper = mount(TestWrapper);

    await nextTick();
    await nextTick();

    const accountView = wrapper.findComponent(MyAccountView);
    const vm = accountView.vm as any;
    vm.name = 'رضا صبوری جدید';
    vm.payoutBank = 'melli';

    await vm.handleSave();

    expect(usersApi.updateMe).toHaveBeenCalledWith({
      name: 'رضا صبوری جدید',
      email: 'holder@chequeyar.ir',
      phone: '09121111111',
      role: 'check_holder',
    });

    const lastCallArg = vi.mocked(usersApi.updateMe).mock.calls.at(-1)?.[0];
    expect(lastCallArg).not.toHaveProperty('bank');

    expect(simulatorStore.getPayoutBankCode(1)).toBe('melli');
  });
});
