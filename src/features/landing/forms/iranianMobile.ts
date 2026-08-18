import { toEnglishDigits } from '../../../utils/persianUtils';

/**
 * Validates whether a raw string is a valid Iranian 11-digit mobile number starting with 09.
 * Accepts both English and Persian digits.
 */
export function isValidIranianMobile(raw: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const cleaned = toEnglishDigits(raw.trim());
  return /^09\d{9}$/.test(cleaned);
}
