import { describe, it, expect } from 'vitest';
import { landingContent } from './landingContent';

describe('landingContent SSOT', () => {
  describe('Responsibility Boundary (Spec §2.5)', () => {
    it('contains exactly the 4 locked statements in canonical order', () => {
      expect(landingContent.responsibilityBoundary.statements).toHaveLength(4);
      expect(landingContent.responsibilityBoundary.statements[0]).toBe('پول را لمس نمی\u200cکند');
      expect(landingContent.responsibilityBoundary.statements[1]).toBe('چک را نگه نمی\u200cدارد');
      expect(landingContent.responsibilityBoundary.statements[2]).toBe('ضمانت وصول نمی\u200cدهد');
      expect(landingContent.responsibilityBoundary.statements[3]).toBe('نرخ پیشنهادی غیرالزام\u200cآور است');
    });

    it('contains the locked closing sentence', () => {
      expect(landingContent.responsibilityBoundary.closingSentence).toBe('چک\u200cیار واسط فناورانه است، نه نهاد مالی.');
    });

    it('preserves U+200C in responsibility statements and closing sentence', () => {
      expect(landingContent.responsibilityBoundary.statements[0].includes('\u200c')).toBe(true);
      expect(landingContent.responsibilityBoundary.statements[1].includes('\u200c')).toBe(true);
      expect(landingContent.responsibilityBoundary.statements[2].includes('\u200c')).toBe(true);
      expect(landingContent.responsibilityBoundary.statements[3].includes('\u200c')).toBe(true);
      expect(landingContent.responsibilityBoundary.closingSentence.includes('\u200c')).toBe(true);
    });
  });

  describe('Product Status (Spec §2.6)', () => {
    it('matches the locked status string character-for-character', () => {
      const expectedStatus = 'v1 لایه ۱ آماده پایلوت — نه در حال ساخت MVP، نه لانچ\u200cشده';
      expect(landingContent.productStatus.statusText).toBe(expectedStatus);
      expect(landingContent.hero.badge).toBe(expectedStatus);
    });

    it('preserves U+200C in product status', () => {
      expect(landingContent.productStatus.statusText.includes('\u200c')).toBe(true);
    });
  });

  describe('Pricing Disclaimer', () => {
    it('contains the exact locked no-fee disclaimer', () => {
      expect(landingContent.pricing.disclaimer).toBe('در محصول فعلی کارمزدی دریافت نمی\u200cشود.');
      expect(landingContent.pricing.disclaimer.includes('\u200c')).toBe(true);
    });

    it('contains 3 future revenue models with no hardcoded numbers', () => {
      expect(landingContent.pricing.models).toHaveLength(3);
      for (const model of landingContent.pricing.models) {
        expect(model.title).toBeTruthy();
        expect(model.description).toBeTruthy();
        // Ensure no currency or percentage figures are included
        expect(model.description).not.toMatch(/[0-9۰-۹]/);
      }
    });
  });

  describe('FAQ Q&A (Spec §2.8)', () => {
    const lockedQuestions = [
      'آیا پول در پلتفرم جابه\u200cجا می\u200cشود؟',
      'آیا نرخ پیشنهادی الزام\u200cآور است؟',
      'تسویه و انتقال چک کجا انجام می\u200cشود؟',
      'برای شروع چه چیزی لازم است (KYC)؟',
      'آیا استفاده هزینه دارد؟',
      'آیا چک\u200cیار وصول چک را ضمانت می\u200cکند؟',
    ];

    const lockedAnswers = [
      'خیر. چک\u200cیار هیچ وجهی را دریافت، نگه\u200cداری یا جابه\u200cجا نمی\u200cکند. تسویه مالی مستقیماً بین طرفین و بیرون از پلتفرم انجام می\u200cشود.',
      'خیر. نرخ تنزیل نمایش\u200cداده\u200cشده در آگهی\u200cها پیشنهادی و غیرالزام\u200cآور است. توافق نهایی بین دارنده چک و سرمایه\u200cگذار بیرون از پلتفرم صورت می\u200cگیرد.',
      'انتقال مالکیت چک (از جمله در سامانه صیاد) و تسویه وجه مستقیماً بین طرفین و بیرون از پلتفرم انجام می\u200cشود. چک\u200cیار در این فرآیندها دخالت اجرایی ندارد.',
      'ثبت\u200cنام، تکمیل احراز هویت (KYC)، و تأیید مدارک توسط ناظر. پس از تأیید، می\u200cتوانید آگهی ثبت کنید یا در بازارچه فرصت\u200cها را ببینید.',
      'در محصول فعلی هیچ کارمزدی دریافت نمی\u200cشود. مدل\u200cهای درآمدی آینده (بدون عدد) در بخش تعرفه همین صفحه توضیح داده شده\u200cاند.',
      'خیر. چک\u200cیار هیچ ضمانتی برای وصول چک ارائه نمی\u200cدهد. ریسک اعتباری بر عهده طرفین معامله است.',
    ];

    it('has exactly 6 FAQ items', () => {
      expect(landingContent.faq.items).toHaveLength(6);
    });

    it('matches all 6 locked questions verbatim', () => {
      landingContent.faq.items.forEach((item, index) => {
        expect(item.question).toBe(lockedQuestions[index]);
      });
    });

    it('matches all 6 locked answers verbatim (including نگه\u200cداری in A1)', () => {
      landingContent.faq.items.forEach((item, index) => {
        expect(item.answer).toBe(lockedAnswers[index]);
        expect(item.answer.includes('\u200c')).toBe(true);
      });
    });
  });

  describe('Hero and Typography Integrity', () => {
    it('preserves U+200C in hero product name, one-liner, and headline', () => {
      expect(landingContent.hero.productName.includes('\u200c')).toBe(true);
      expect(landingContent.hero.oneLiner.includes('\u200c')).toBe(true);
      expect(landingContent.hero.headline.includes('\u200c')).toBe(true);
    });
  });
});
