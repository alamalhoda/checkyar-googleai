import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HowItWorksSection from './HowItWorksSection.vue';

describe('HowItWorksSection.vue', () => {
  it('renders section shell and all 6 step cards with data-testids', () => {
    const wrapper = mount(HowItWorksSection);

    expect(wrapper.find('[data-testid="landing-section-how-it-works"]').exists()).toBe(true);

    for (let i = 1; i <= 6; i++) {
      expect(wrapper.find(`[data-testid="landing-step-${i}"]`).exists()).toBe(true);
    }
  });

  it('renders step 6 with direct settlement tag', () => {
    const wrapper = mount(HowItWorksSection);
    const step6 = wrapper.find('[data-testid="landing-step-6"]');

    expect(step6.exists()).toBe(true);
    expect(step6.text()).toContain('تسویه مستقیم');
  });
});
