import { describe, it, expect } from 'vitest';
import {
  calculateNetPrice,
  estimateDaysToSell,
  calculateDaysToDue,
} from './useSmartPricing';

describe('useSmartPricing pure helpers', () => {
  describe('calculateNetPrice', () => {
    it('returns zeroes when amount <= 0', () => {
      expect(calculateNetPrice(0, 20, 30)).toEqual({ netPrice: 0, discountAmount: 0 });
      expect(calculateNetPrice(-100, 20, 30)).toEqual({ netPrice: 0, discountAmount: 0 });
    });

    it('calculates correct net price and discount amount for known inputs', () => {
      // amount=365_000_000, annualRate=10, daysToDue=365 -> discountAmount = 36_500_000, netPrice = 328_500_000
      const result = calculateNetPrice(365_000_000, 10, 365);
      expect(result.discountAmount).toBe(36_500_000);
      expect(result.netPrice).toBe(328_500_000);
    });
  });

  describe('estimateDaysToSell', () => {
    it('returns fast selling message when userRate - suggestedRate >= 2.0', () => {
      expect(estimateDaysToSell(25.0, 22.5)).toBe('کمتر از ۲۴ ساعت (فروش بسیار سریع)');
    });

    it('returns ideal selling message when userRate - suggestedRate >= 0 and < 2.0', () => {
      expect(estimateDaysToSell(23.0, 22.5)).toBe('۱ تا ۳ روز (حالت ایده‌آل بازار)');
    });

    it('returns normal selling message when userRate - suggestedRate >= -2.0 and < 0', () => {
      expect(estimateDaysToSell(21.5, 22.5)).toBe('۳ تا ۷ روز (سرعت معمولی)');
    });

    it('returns slow selling message when userRate - suggestedRate < -2.0', () => {
      expect(estimateDaysToSell(19.5, 22.5)).toBe('بیش از ۷ روز (احتمال معامله کندتر)');
    });
  });

  describe('calculateDaysToDue', () => {
    it('returns default fallback of 30 days when dueDate is null or empty', () => {
      expect(calculateDaysToDue(null)).toBe(30);
    });

    it('returns positive integer >= 1 for a future date relative to today', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const days = calculateDaysToDue(futureDate);
      expect(days).toBe(10);
    });
  });
});
