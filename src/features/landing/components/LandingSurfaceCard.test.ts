import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LandingSurfaceCard from './LandingSurfaceCard.vue';

describe('LandingSurfaceCard.vue', () => {
  it('renders default props without error', () => {
    const wrapper = mount(LandingSurfaceCard, {
      slots: {
        default: 'Card Content',
      },
    });

    expect(wrapper.text()).toContain('Card Content');
    expect(wrapper.classes()).toContain('bg-[var(--theme-surface)]');
    expect(wrapper.classes()).toContain('border-[var(--theme-border)]');
    expect(wrapper.classes()).toContain('rounded-2xl');
  });

  it('applies glass classes and backdrop-blur when glass is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        glass: true,
      },
    });

    expect(wrapper.classes()).toContain('landing-glass-card');
    expect(wrapper.classes()).toContain('backdrop-blur-md');
    expect(wrapper.classes()).toContain('border-white/10');
  });

  it('applies base background glass classes when bg is base and glass is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        bg: 'base',
        glass: true,
      },
    });

    expect(wrapper.classes()).toContain('landing-glass-card-base');
    expect(wrapper.classes()).toContain('backdrop-blur-md');
    expect(wrapper.classes()).toContain('border-white/10');
  });

  it('applies gradientBorder classes when gradientBorder is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        gradientBorder: true,
      },
    });

    expect(wrapper.classes()).toContain('landing-gradient-border');
  });

  it('applies glass gradientBorder classes when both glass and gradientBorder are true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        glass: true,
        gradientBorder: true,
      },
    });

    expect(wrapper.classes()).toContain('landing-gradient-border-glass');
    expect(wrapper.classes()).toContain('backdrop-blur-md');
  });

  it('applies accentTop bar when accentTop is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        accentTop: true,
      },
    });

    expect(wrapper.find('.bg-gradient-to-r').exists()).toBe(true);
  });

  it('applies highlight border and shadow when highlight is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        highlight: true,
      },
    });

    expect(wrapper.classes()).toContain('border-emerald-500/35');
  });

  it('applies hoverable transition classes when hoverable is true', () => {
    const wrapper = mount(LandingSurfaceCard, {
      props: {
        hoverable: true,
      },
    });

    const classString = wrapper.classes().join(' ');
    expect(classString).toContain('hover:-translate-y-[3px]');
    expect(classString).toContain('hover:border-emerald-500/40');
  });
});
