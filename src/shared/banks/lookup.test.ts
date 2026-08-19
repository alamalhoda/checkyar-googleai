import { describe, it, expect } from 'vitest';
import { LOCAL_BANKS } from './catalog';
import {
  findBankByCode,
  findBankByNameOrAlias,
  getBankBrandColor,
} from './lookup';

describe('Bank Catalog & Lookup', () => {
  it('contains exactly 14 banks in stable ascending Persian order', () => {
    expect(LOCAL_BANKS).toHaveLength(14);
    
    // Check that display_name is ascending
    const names = LOCAL_BANKS.map((b) => b.display_name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b, 'fa'));
    expect(names).toEqual(sortedNames);
  });

  it('initializes all rows with null logo_url and aliases containing display_name', () => {
    for (const bank of LOCAL_BANKS) {
      expect(bank.logo_url).toBeNull();
      expect(bank.aliases).toContain(bank.display_name);
      expect(bank.code).toBeTruthy();
      expect(bank.brand_color_light).toMatch(/^#[0-9A-F]{6}$/i);
      expect(bank.brand_color_dark).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('finds bank by exact code (with trimming)', () => {
    const mellat = findBankByCode('mellat');
    expect(mellat).toBeDefined();
    expect(mellat?.display_name).toBe('بانک ملت');
    expect(mellat?.code).toBe('mellat');

    const melli = findBankByCode('  melli  ');
    expect(melli).toBeDefined();
    expect(melli?.display_name).toBe('بانک ملی ایران');
  });

  it('returns undefined for unknown or empty codes', () => {
    expect(findBankByCode('unknown_bank')).toBeUndefined();
    expect(findBankByCode('')).toBeUndefined();
    expect(findBankByCode(null)).toBeUndefined();
    expect(findBankByCode(undefined)).toBeUndefined();
  });

  it('finds bank by exact display_name or alias (with trimming)', () => {
    // Exact match on display_name
    const mellat = findBankByNameOrAlias('بانک ملت');
    expect(mellat).toBeDefined();
    expect(mellat?.code).toBe('mellat');

    // Match on alias with leading/trailing whitespace
    const melli = findBankByNameOrAlias('  بانک ملی  ');
    expect(melli).toBeDefined();
    expect(melli?.code).toBe('melli');
    expect(melli?.display_name).toBe('بانک ملی ایران');

    // Match on saderat alias
    const saderat = findBankByNameOrAlias('بانک صادرات');
    expect(saderat).toBeDefined();
    expect(saderat?.code).toBe('saderat');
  });

  it('returns undefined for unknown or non-exact names without fuzzy matching', () => {
    expect(findBankByNameOrAlias('بانک نامشخص')).toBeUndefined();
    expect(findBankByNameOrAlias('ملت')).toBeUndefined(); // Substring must not match
    expect(findBankByNameOrAlias('صادرات')).toBeUndefined();
    expect(findBankByNameOrAlias('')).toBeUndefined();
    expect(findBankByNameOrAlias(null)).toBeUndefined();
    expect(findBankByNameOrAlias(undefined)).toBeUndefined();
  });

  it('resolves theme brand color correctly (dark -> dark, light -> light)', () => {
    const mellat = findBankByCode('mellat');
    expect(mellat).toBeDefined();

    expect(getBankBrandColor(mellat, 'dark')).toBe('#C4112C');
    expect(getBankBrandColor(mellat, 'light')).toBe('#E21836');
    // Default theme should be dark
    expect(getBankBrandColor(mellat)).toBe('#C4112C');
  });

  it('returns undefined brand color for null or undefined bank', () => {
    expect(getBankBrandColor(null, 'dark')).toBeUndefined();
    expect(getBankBrandColor(undefined, 'light')).toBeUndefined();
  });
});
