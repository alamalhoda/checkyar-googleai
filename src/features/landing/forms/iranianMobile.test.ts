import { describe, it, expect } from 'vitest';
import { isValidIranianMobile } from './iranianMobile';

describe('isValidIranianMobile', () => {
  it('returns true for valid 11-digit Iranian mobile starting with 09 in English digits', () => {
    expect(isValidIranianMobile('09123456789')).toBe(true);
    expect(isValidIranianMobile('09351112233')).toBe(true);
  });

  it('returns true for valid 11-digit Iranian mobile in Persian digits', () => {
    expect(isValidIranianMobile('۰۹۱۲۳۴۵۶۷۸۹')).toBe(true);
    expect(isValidIranianMobile('۰۹۳۵۱۱۱۲۲۳۳')).toBe(true);
  });

  it('handles surrounding whitespace gracefully', () => {
    expect(isValidIranianMobile('  09123456789  ')).toBe(true);
    expect(isValidIranianMobile('  ۰۹۱۲۳۴۵۶۷۸۹  ')).toBe(true);
  });

  it('returns false for invalid cases: too short, empty, wrong prefix, non-digits', () => {
    expect(isValidIranianMobile('12345')).toBe(false);
    expect(isValidIranianMobile('')).toBe(false);
    expect(isValidIranianMobile('0901234567')).toBe(false); // 10 digits (too short)
    expect(isValidIranianMobile('091234567890')).toBe(false); // 12 digits (too long)
    expect(isValidIranianMobile('08123456789')).toBe(false); // Doesn't start with 09
    expect(isValidIranianMobile('0912345abcd')).toBe(false);
    expect(isValidIranianMobile(null as any)).toBe(false);
    expect(isValidIranianMobile(undefined as any)).toBe(false);
  });
});
