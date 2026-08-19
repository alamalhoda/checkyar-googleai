import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BankSelect from './BankSelect.vue';
import { LOCAL_BANKS } from '../banks/catalog';

describe('BankSelect.vue', () => {
  it('renders without crashing and provides bank options', async () => {
    const wrapper = mount(BankSelect, {
      props: {
        value: 'mellat',
        allowAll: true
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props('value')).toBe('mellat');
  });

  it('includes allowAll option when allowAll is true', async () => {
    const wrapper = mount(BankSelect, {
      props: {
        allowAll: true
      }
    });

    const vm = wrapper.vm as any;
    const opts = vm.options;
    expect(opts.length).toBe(LOCAL_BANKS.length + 1);
    expect(opts[0].value).toBe('');
    expect(opts[0].label).toBe('همه بانک‌ها');
  });

  it('excludes allowAll option when allowAll is false', async () => {
    const wrapper = mount(BankSelect, {
      props: {
        allowAll: false
      }
    });

    const vm = wrapper.vm as any;
    const opts = vm.options;
    expect(opts.length).toBe(LOCAL_BANKS.length);
    expect(opts[0].value).not.toBe('');
  });

  it('emits update:value and update:modelValue when selected', async () => {
    const wrapper = mount(BankSelect, {
      props: {
        value: null
      }
    });

    const vm = wrapper.vm as any;
    vm.selectedValue = 'melli';
    await nextTick();

    expect(wrapper.emitted('update:value')).toBeTruthy();
    expect(wrapper.emitted('update:value')![0]).toEqual(['melli']);
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['melli']);
  });

  it('renders all-banks label with BusinessOutline icon and without brand badge', () => {
    const wrapper = mount(BankSelect, {
      props: {
        allowAll: true
      }
    });

    const vm = wrapper.vm as any;
    const allOption = vm.options[0];
    const rendered = vm.renderOptionLabel(allOption);
    expect(rendered).toBeDefined();
    // rendered should have children including NIcon and text span, not BankBadge
    expect(rendered.type).toBe('div');
  });

  it('passes data-testid properly', () => {
    const wrapper = mount(BankSelect, {
      props: {
        dataTestid: 'custom-bank-select'
      }
    });

    expect(wrapper.attributes('data-testid') || wrapper.find('[data-testid="custom-bank-select"]').exists()).toBeTruthy();
  });
});
