import { describe, it, expect } from 'vitest';
import {
  toPersianDigits,
  toEnglishDigits,
  validateSayadId,
  validateNationalId,
  amountToPersianWords,
  getCurrentJalaliYear,
  formatTomanFromRial,
  formatJalaliDate,
} from './persianUtils';

describe('persianUtils', () => {
  describe('toPersianDigits & toEnglishDigits', () => {
    it('converts English digits to Persian digits', () => {
      expect(toPersianDigits('1234567890')).toBe('۱۲۳۴۵۶۷۸۹۰');
      expect(toPersianDigits(123)).toBe('۱۲۳');
    });

    it('converts Persian and Arabic-Indic digits to English digits (round-trip)', () => {
      expect(toEnglishDigits('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890');
      expect(toEnglishDigits('١٢٣٤٥٦٧٨٩٠')).toBe('1234567890');
      
      const original = '1234567890';
      const roundTrip = toEnglishDigits(toPersianDigits(original));
      expect(roundTrip).toBe(original);
    });
  });

  describe('validateSayadId', () => {
    it('returns invalid for empty input', () => {
      const res = validateSayadId('');
      expect(res.isValid).toBe(false);
      expect(res.message).toContain('الزامی');
    });

    it('returns invalid for non-digit input', () => {
      const res = validateSayadId('1234abcd5678efgh');
      expect(res.isValid).toBe(false);
      expect(res.message).toContain('فقط شامل اعداد');
    });

    it('returns invalid when length is not 16', () => {
      const res = validateSayadId('1234567890');
      expect(res.isValid).toBe(false);
      expect(res.message).toContain('۱۶ رقم');
    });

    it('returns valid for exactly 16 digits, including Persian digits input', () => {
      const validEng = validateSayadId('1234567890123456');
      expect(validEng.isValid).toBe(true);

      const validPersian = validateSayadId('۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶');
      expect(validPersian.isValid).toBe(true);
    });
  });

  describe('validateNationalId', () => {
    describe('natural person', () => {
      it('returns invalid when length is not 10', () => {
        const res = validateNationalId('12345', 'natural');
        expect(res.isValid).toBe(false);
        expect(res.message).toContain('۱۰ رقم');
      });

      it('returns invalid when checksum fails', () => {
        const res = validateNationalId('1234567890', 'natural');
        expect(res.isValid).toBe(false);
        expect(res.message).toContain('معتبر نیست');
      });

      it('returns valid for known-valid Iranian national IDs', () => {
        const res1 = validateNationalId('1234567891', 'natural');
        expect(res1.isValid).toBe(true);

        const res2 = validateNationalId('0010000003', 'natural');
        expect(res2.isValid).toBe(true);
      });
    });

    describe('legal entity', () => {
      it('returns invalid when length is not 11', () => {
        const res = validateNationalId('1234567890', 'legal');
        expect(res.isValid).toBe(false);
        expect(res.message).toContain('۱۱ رقم');
      });

      it('returns valid when length is 11 digits', () => {
        const res = validateNationalId('10100000001', 'legal');
        expect(res.isValid).toBe(true);
      });
    });
  });

  describe('amountToPersianWords', () => {
    it('returns empty string for null, 0, or negative amounts', () => {
      expect(amountToPersianWords(null)).toBe('');
      expect(amountToPersianWords(0)).toBe('');
      expect(amountToPersianWords(-500)).toBe('');
    });

    it('returns deterministic non-empty Persian words ending with تومان for positive amounts', () => {
      const res1 = amountToPersianWords(1);
      expect(res1).not.toBe('');
      expect(res1.endsWith('تومان')).toBe(true);
      expect(res1).toBe('یک تومان');

      const res1000 = amountToPersianWords(1000);
      expect(res1000).not.toBe('');
      expect(res1000.endsWith('تومان')).toBe(true);
      expect(res1000).toBe('یک هزار تومان');

      const resMillion = amountToPersianWords(1_000_000);
      expect(resMillion).not.toBe('');
      expect(resMillion.endsWith('تومان')).toBe(true);
      expect(resMillion).toBe('یک میلیون تومان');
    });
  });

  describe('getCurrentJalaliYear', () => {
    it('returns a 4-digit Persian string for current or specified date', () => {
      const year = getCurrentJalaliYear();
      expect(year).toMatch(/^[۰-۹]{4}$/);

      // Verify specific date (e.g. 2026-03-21 which is Jalali 1405)
      const year2026 = getCurrentJalaliYear(new Date('2026-08-17T00:00:00Z'));
      expect(year2026).toBe('۱۴۰۵');

      // Verify 2025-05-01 which is Jalali 1404
      const year2025 = getCurrentJalaliYear(new Date('2025-05-01T00:00:00Z'));
      expect(year2025).toBe('۱۴۰۴');
    });
  });

  describe('formatTomanFromRial', () => {
    it('divides rials by 10 and formats with Persian locale separators', () => {
      // 500,000,000 Rials = 50,000,000 Tomans
      const formatted = formatTomanFromRial('500000000');
      expect(formatted).toBe((50000000).toLocaleString('fa-IR'));

      const formattedNum = formatTomanFromRial(1000000);
      expect(formattedNum).toBe((100000).toLocaleString('fa-IR'));
    });

    it('handles Persian digits in input string', () => {
      const formatted = formatTomanFromRial('۵۰۰۰۰۰۰۰۰');
      expect(formatted).toBe((50000000).toLocaleString('fa-IR'));
    });

    it('handles zero and invalid inputs gracefully', () => {
      expect(formatTomanFromRial(0)).toBe('۰');
      expect(formatTomanFromRial('invalid')).toBe('۰');
      expect(formatTomanFromRial(-100)).toBe('۰');
    });
  });

  describe('formatJalaliDate', () => {
    it('formats a valid ISO date to Jalali representation', () => {
      const jalali = formatJalaliDate('2026-03-21');
      expect(jalali).toBeTruthy();
      expect(jalali).toContain('۱۴۰۵');
    });

    it('returns empty string for invalid dates without throwing', () => {
      expect(formatJalaliDate('')).toBe('');
      expect(formatJalaliDate('not-a-date')).toBe('');
      expect(formatJalaliDate(null as any)).toBe('');
      expect(formatJalaliDate(undefined as any)).toBe('');
    });
  });
});
