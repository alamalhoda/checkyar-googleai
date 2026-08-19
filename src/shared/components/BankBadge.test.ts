import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BankBadge from './BankBadge.vue';
import { findBankByCode } from '../banks/lookup';

describe('BankBadge Component', () => {
  it('renders initial character with dark brand color by default for catalog bank', () => {
    const bank = findBankByCode('mellat');
    expect(bank).toBeDefined();

    const wrapper = mount(BankBadge, {
      props: {
        bank,
        theme: 'dark',
      },
    });

    expect(wrapper.attributes('data-testid')).toBe('bank-badge');
    const initialEl = wrapper.find('[data-testid="bank-badge-initial"]');
    expect(initialEl.exists()).toBe(true);
    expect(initialEl.text()).toBe('ب');
    expect(initialEl.attributes('style')).toContain('background-color: #C4112C'); // #C4112C
    expect(wrapper.text()).toContain('بانک ملت');
  });

  it('renders initial character with light brand color when theme="light"', () => {
    const bank = findBankByCode('mellat');
    expect(bank).toBeDefined();

    const wrapper = mount(BankBadge, {
      props: {
        bank,
        theme: 'light',
      },
    });

    const initialEl = wrapper.find('[data-testid="bank-badge-initial"]');
    expect(initialEl.exists()).toBe(true);
    expect(initialEl.attributes('style')).toContain('background-color: #E21836'); // #E21836
  });

  it('renders logo image when bank has non-null logo_url', () => {
    const bankWithLogo = {
      code: 'testbank',
      display_name: 'بانک آزمایشی',
      aliases: ['بانک آزمایشی'],
      logo_url: '/images/banks/testbank.svg',
      brand_color_light: '#112233',
      brand_color_dark: '#445566',
    };

    const wrapper = mount(BankBadge, {
      props: {
        bank: bankWithLogo,
      },
    });

    const logoEl = wrapper.find('[data-testid="bank-badge-logo"]');
    expect(logoEl.exists()).toBe(true);
    expect(logoEl.attributes('src')).toBe('/images/banks/testbank.svg');
    expect(wrapper.find('[data-testid="bank-badge-initial"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="bank-badge-unknown"]').exists()).toBe(false);
  });

  it('renders unknown state with neutral building icon and fallback name without brand color', () => {
    const wrapper = mount(BankBadge, {
      props: {
        bank: null,
        fallbackName: 'بانک قرض‌الحسنه رسالت',
      },
    });

    expect(wrapper.attributes('data-testid')).toBe('bank-badge');
    const unknownEl = wrapper.find('[data-testid="bank-badge-unknown"]');
    expect(unknownEl.exists()).toBe(true);
    expect(unknownEl.attributes('style')).toBeUndefined();
    expect(wrapper.find('[data-testid="bank-badge-initial"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="bank-badge-logo"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('بانک قرض‌الحسنه رسالت');
  });

  it('hides text label and provides accessible aria-label on root when showName is false', () => {
    const bank = findBankByCode('pasargad');
    expect(bank).toBeDefined();

    const wrapper = mount(BankBadge, {
      props: {
        bank,
        showName: false,
      },
    });

    expect(wrapper.attributes('aria-label')).toBe('بانک پاسارگاد');
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.text()).toBe('ب'); // Only mark initial rendered, no separate span
  });

  it('supports compact size modifier without crashing', () => {
    const bank = findBankByCode('tejarat');
    expect(bank).toBeDefined();

    const wrapper = mount(BankBadge, {
      props: {
        bank,
        size: 'compact',
      },
    });

    const initialEl = wrapper.find('[data-testid="bank-badge-initial"]');
    expect(initialEl.classes()).toContain('w-6');
    expect(initialEl.classes()).toContain('h-6');
  });
});
