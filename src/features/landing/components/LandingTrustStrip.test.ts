import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LandingTrustStrip from './LandingTrustStrip.vue';
import { landingContent } from '../content/landingContent';

describe('LandingTrustStrip.vue', () => {
  it('renders the trust strip root and data-testids correctly', () => {
    const wrapper = mount(LandingTrustStrip);

    expect(wrapper.find('[data-testid="landing-trust-strip"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="landing-trust-item-1"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="landing-trust-item-2"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="landing-trust-item-3"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="landing-trust-item-4"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="landing-trust-details-link"]').exists()).toBe(true);
  });

  it('renders the 4 trust items matching landingContent.trustStrip', () => {
    const wrapper = mount(LandingTrustStrip);

    expect(wrapper.find('[data-testid="landing-trust-item-1"]').text()).toContain(landingContent.trustStrip.items[0]);
    expect(wrapper.find('[data-testid="landing-trust-item-2"]').text()).toContain(landingContent.trustStrip.items[1]);
    expect(wrapper.find('[data-testid="landing-trust-item-3"]').text()).toContain(landingContent.trustStrip.items[2]);
    expect(wrapper.find('[data-testid="landing-trust-item-4"]').text()).toContain(landingContent.trustStrip.items[3]);
    expect(wrapper.find('[data-testid="landing-trust-details-link"]').text()).toContain(landingContent.trustStrip.detailsLink);
  });
});
