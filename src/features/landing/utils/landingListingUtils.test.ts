import { describe, it, expect } from 'vitest';
import { getLandingListingTarget } from './landingListingUtils';

describe('getLandingListingTarget', () => {
  it('returns /login for guests regardless of listingId', () => {
    expect(getLandingListingTarget(false, 1)).toBe('/login');
    expect(getLandingListingTarget(false, 42)).toBe('/login');
    expect(getLandingListingTarget(false, 100)).toBe('/login');
  });

  it('returns /listings/:id for authenticated users', () => {
    expect(getLandingListingTarget(true, 1)).toBe('/listings/1');
    expect(getLandingListingTarget(true, 42)).toBe('/listings/42');
    expect(getLandingListingTarget(true, 100)).toBe('/listings/100');
  });
});
