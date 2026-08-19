import { LOCAL_BANKS, type Bank, type BankSummary } from './catalog';

export { LOCAL_BANKS, type Bank, type BankSummary };

/**
 * Finds a bank in the local catalog by its exact code (trimmed).
 */
export function findBankByCode(code?: string | null): Bank | undefined {
  if (!code) return undefined;
  const trimmed = code.trim();
  if (!trimmed) return undefined;
  return LOCAL_BANKS.find((bank) => bank.code === trimmed);
}

/**
 * Finds a bank in the local catalog by exact match against its display_name or any alias (trimmed).
 * Does not perform fuzzy or substring matching.
 */
export function findBankByNameOrAlias(name?: string | null): Bank | undefined {
  if (!name) return undefined;
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return LOCAL_BANKS.find(
    (bank) => bank.display_name === trimmed || bank.aliases.includes(trimmed)
  );
}

/**
 * Converts a Bank object to a BankSummary object (stripping aliases).
 */
export function toBankSummary(bank: Bank): BankSummary {
  return {
    code: bank.code,
    display_name: bank.display_name,
    brand_color_light: bank.brand_color_light,
    brand_color_dark: bank.brand_color_dark,
    logo_url: bank.logo_url,
  };
}

/**
 * Returns the theme-appropriate brand color hex string for a catalog bank or summary.
 * Returns undefined if bank is null or undefined.
 */
export function getBankBrandColor(
  bank?: BankSummary | Bank | null,
  theme: 'dark' | 'light' = 'dark'
): string | undefined {
  if (!bank) return undefined;
  return theme === 'light' ? bank.brand_color_light : bank.brand_color_dark;
}
