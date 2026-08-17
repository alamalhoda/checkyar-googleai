import { describe, it, expect } from 'vitest';
import { getLandingRedirect } from './guard';

describe('getLandingRedirect guard pure helper', () => {
  it('redirects / to /landing when flag is enabled (true)', () => {
    const result = getLandingRedirect(true, '/');
    expect(result).toBe('/landing');
  });

  it('redirects / to /marketplace when flag is disabled (false)', () => {
    const result = getLandingRedirect(false, '/');
    expect(result).toBe('/marketplace');
  });

  it('allows navigation to proceed on /landing when flag is enabled (returns null)', () => {
    const result = getLandingRedirect(true, '/landing');
    expect(result).toBeNull();
  });

  it('redirects /landing to /marketplace when flag is disabled (false / fail-closed)', () => {
    const result = getLandingRedirect(false, '/landing');
    expect(result).toBe('/marketplace');
  });

  it('does not interfere with other routes (e.g. /marketplace or /login)', () => {
    expect(getLandingRedirect(true, '/marketplace')).toBeNull();
    expect(getLandingRedirect(false, '/marketplace')).toBeNull();
    expect(getLandingRedirect(true, '/login')).toBeNull();
    expect(getLandingRedirect(false, '/login')).toBeNull();
  });

  it('consistently collapses all disabled/absent/error states into false without loops', () => {
    // Flag absent / error represented as false
    const flagAbsent = false;
    const flagError = false;
    const flagOff = false;
    const flagOn = true;

    // Direct / request in all states
    expect(getLandingRedirect(flagOn, '/')).toBe('/landing');
    expect(getLandingRedirect(flagOff, '/')).toBe('/marketplace');
    expect(getLandingRedirect(flagAbsent, '/')).toBe('/marketplace');
    expect(getLandingRedirect(flagError, '/')).toBe('/marketplace');

    // Direct /landing request in all states
    expect(getLandingRedirect(flagOn, '/landing')).toBeNull();
    expect(getLandingRedirect(flagOff, '/landing')).toBe('/marketplace');
    expect(getLandingRedirect(flagAbsent, '/landing')).toBe('/marketplace');
    expect(getLandingRedirect(flagError, '/landing')).toBe('/marketplace');
  });
});
