import { describe, it, expect } from 'vitest';
import { BREAKPOINT_MD, isDesktopBreakpoint, matchDesktopMedia } from './breakpoints';

describe('breakpoints helper', () => {
  it('defines BREAKPOINT_MD as 768', () => {
    expect(BREAKPOINT_MD).toBe(768);
  });

  it('correctly evaluates width parameters against 768px', () => {
    expect(isDesktopBreakpoint(768)).toBe(true);
    expect(isDesktopBreakpoint(1024)).toBe(true);
    expect(isDesktopBreakpoint(1920)).toBe(true);
    expect(isDesktopBreakpoint(767)).toBe(false);
    expect(isDesktopBreakpoint(375)).toBe(false);
    expect(isDesktopBreakpoint(0)).toBe(false);
  });

  it('evaluates matchDesktopMedia safely in test environment', () => {
    expect(typeof matchDesktopMedia()).toBe('boolean');
  });
});
