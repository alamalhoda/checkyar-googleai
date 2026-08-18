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

    it('has the correct product status description without rejected claims', () => {
      expect(landingContent.productStatus.description).toBe(
        'چک\u200cیار در لایه ۱ آماده پایلوت کنترل\u200cشده است؛ نه در حال ساخت MVP، و نه عرضه عمومی. مسیر کشف و اتصال پیاده\u200cسازی شده است.'
      );
    });

    it('preserves U+200C in product status', () => {
      expect(landingContent.productStatus.statusText.includes('\u200c')).toBe(true);
      expect(landingContent.productStatus.description.includes('\u200c')).toBe(true);
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

  describe('SSOT compliance and copy sanity', () => {
    it('contains centralized tags for boundary, direct settlement, and pricing model', () => {
      expect(landingContent.responsibilityBoundary.tag).toBe('مرز مسئولیت رگولاتوری');
      expect(landingContent.howItWorks.directSettlementTag).toBe('تسویه مستقیم');
      expect(landingContent.pricing.modelTag).toBe('مدل آتی');
    });

    it('has complete liveListings, leadCapture, and contactUs content definitions', () => {
      expect(landingContent.liveListings.title).toBe('تابلوی آگهی\u200cهای زنده');
      expect(landingContent.liveListings.emptyText).toBe('هنوز آگهی منتشرشده\u200cای وجود ندارد');
      expect(landingContent.liveListings.emptyGuestCta).toBe('ثبت\u200cنام');
      expect(landingContent.liveListings.emptyAuthCta).toBe('ورود به بازارچه');
      expect(landingContent.liveListings.guestCardAction).toBe('ورود برای مشاهده');
      expect(landingContent.liveListings.authCardAction).toBe('مشاهده جزئیات');

      expect(landingContent.leadCapture.title).toBe('درخواست مشاوره و ثبت تقاضا');
      expect(landingContent.leadCapture.successMessage).toBe(
        'درخواست شما روی همین صفحه ثبت شد؛ در محصول فعلی به سرور ارسال نمی\u200cشود.'
      );

      expect(landingContent.contactUs.title).toBe('تماس با ما');
      expect(landingContent.contactUs.successMessage).toBe(
        'درخواست شما روی همین صفحه ثبت شد؛ در محصول فعلی به سرور ارسال نمی\u200cشود.'
      );
    });

    it('has updated audience investor copy', () => {
      expect(landingContent.audiences.investors.description).toBe(
        'سرمایه\u200cگذاران و شرکت\u200cهایی که به دنبال فرصت\u200cهای شفاف خرید چک مدت\u200cدار هستند.'
      );
      expect(landingContent.audiences.investors.points[2]).toBe('پشتیبانی یکپارچه از اشخاص حقیقی و حقوقی');
    });

    it('contains no forbidden or rejected terms anywhere in landingContent', () => {
      const serialized = JSON.stringify(landingContent);
      expect(serialized).not.toContain('مطالبات');
      expect(serialized).not.toContain('پذیرش شرکای پایلوت');
      expect(serialized).not.toContain('user_type');
    });

    it('has visual decorative strings and section eyebrows configured', () => {
      expect(landingContent.visual.heroPreviewCaption).toBe('پیش\u200cنمایش آگهی\u200cهای منتشرشده');
      expect(landingContent.visual.sectionEyebrows.problemSolution).toBe('چالش و راهکار');
      expect(landingContent.visual.sectionEyebrows.howItWorks).toBe('فرآیند گام\u200cبه\u200cگام');
      expect(landingContent.visual.sectionEyebrows.audiences).toBe('مخاطبان هدف');
      expect(landingContent.visual.sectionEyebrows.liveListings).toBe('فرصت\u200cهای فعال');
      expect(landingContent.visual.sectionEyebrows.responsibilityBoundary).toBe('انطباق رگولاتوری');
      expect(landingContent.visual.sectionEyebrows.productStatus).toBe('شفافیت توسعه');
      expect(landingContent.visual.sectionEyebrows.pricing).toBe('مدل\u200cهای آتی');
      expect(landingContent.visual.sectionEyebrows.faq).toBe('راهنمای کاربری');
      expect(landingContent.visual.sectionEyebrows.contactUs).toBe('ارتباط مستقیم');
      expect(landingContent.visual.sectionEyebrows.leadCapture).toBe('درخواست همکاری');
      expect(landingContent.visual.sectionEyebrows.investing).toBe('توسعه پایلوت');
    });

    it('has trustStrip scannable items and detailsLink aligned with responsibility boundary', () => {
      expect(landingContent.trustStrip.items).toHaveLength(4);
      expect(landingContent.trustStrip.items[0]).toBe('بدون جابه\u200cجایی وجه');
      expect(landingContent.trustStrip.items[1]).toBe('بدون نگه\u200cداری چک');
      expect(landingContent.trustStrip.items[2]).toBe('بدون ضمانت وصول');
      expect(landingContent.trustStrip.items[3]).toBe('نرخ پیشنهادی غیرالزام\u200cآور');
      expect(landingContent.trustStrip.detailsLink).toBe('جزئیات مسئولیت\u200cها');

      expect(landingContent.trustStrip.items[0].includes('\u200c')).toBe(true);
      expect(landingContent.trustStrip.items[1].includes('\u200c')).toBe(true);
      expect(landingContent.trustStrip.items[3].includes('\u200c')).toBe(true);
      expect(landingContent.trustStrip.detailsLink.includes('\u200c')).toBe(true);
    });

    it('has hero previewEmpty copy configured with ZWNJ', () => {
      expect(landingContent.hero.previewEmpty).toBe('فعلاً آگهی منتشرشده\u200cای برای پیش\u200cنمایش نیست');
      expect(landingContent.hero.previewEmpty.includes('\u200c')).toBe(true);
    });
  });
});
