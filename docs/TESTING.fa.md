# راهنمای آزمون و تست (واسط کاربری چک‌یار)

این سند استراتژی تست، دستورات اجرایی و استانداردهای تست در فرانت‌اند **چک‌یار** را تشریح می‌کند.

---

## ۱. آزمون‌های واحد (Unit Testing - Vitest)

آزمون‌های واحد برای سنجش منطق‌های محاسباتی، توابع تبدیل اعداد/تواریخ، الگوریتم‌های قیمت‌گذاری و گارد‌های دسترسی استفاده می‌شوند.

### دستورات اجرا

```bash
# اجرای یک‌باره آزمون‌های واحد
bun run test

# اجرای آزمون‌ها در حالت مشاهده تغییرات (Watch mode)
bun run test:watch
```

### بخش‌های تحت پوشش

مجموعه تست‌های موجود در `src/`:
- `src/utils/persianUtils.test.ts`: تبدیل اعداد فارسی، اعتبارسنجی کد ملی، فرمت پول و تاریخ.
- `src/stores/auth.permissions.test.ts`: بررسی سطح دسترسی‌ها و نقش‌ها در استور احراز هویت.
- `src/features/listings/composables/useSmartPricing.test.ts`: محاسبات نرخ تنزیل و قیمت‌گذاری هوشمند.

---

## ۲. بررسی تایپ‌ها و کیفیت کد (Type Checking)

اعتبارسنجی تایپ‌های TypeScript با دستور زیر انجام می‌شود:

```bash
bun run lint
```

این دستور اسکریپت `tsc --noEmit` را اجرا می‌کند.

---

## ۳. تست دستی با بک‌اند واقعی (Live API)

جهت تست دستی فرانت‌اند در کنار بک‌اند واقعی (`doion`):

۱. تنظیم فایل `.env`:
   ```env
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
۲. اجرای سرور توسعه:
   ```bash
   bun run dev
   ```
۳. ورود با حساب‌های تست نمونه (مانند `holder1`، `investor1`، `moderator1`).

### تفکیک حالت شبیه‌ساز (Mock) و Live

> **نکته مهم:** حالت شبیه‌ساز (`VITE_USE_MOCK=true`) صرفاً جهت دمو و توسعه اولیه در Google AI Studio است و جایگزین تست یکپارچه‌سازی با بک‌اند واقعی نمی‌باشد.

---

## ۴. آزمون‌های سرتاسری (E2E Testing - Playwright)

تست‌های سرتاسری مرورگر (Playwright) در **مخزن `doion`** و تحت پوشه `e2e/` نگهداری می‌شوند.

- **مکان تست‌های E2E:** مخزن `alamalhoda/doion` (پوشه `e2e/`).
- **راهنما:** سند `docs/testing/E2E_LOCAL_RUNBOOK.md` در پروژه `doion`.
- از کپی کردن یا اضافه کردن فایل‌های Playwright به این repo خودداری کنید.

---

## ۵. استانداردهای `data-testid`

برای پایداری تست‌های E2E از قواعد زیر پیروی کنید:

- استفاده از **kebab-case** (مانند `express-interest-page` ، `match-accept-btn` ، `notifications-pagination`).
- **نحوه اعمال روی Naive UI (`NInput`):** با توجه به اینکه Naive UI ویژگی‌ها را روی `div` بیرونی می‌گذارد، از `:input-props` استفاده کنید:
  ```html
  <NInput
    v-model:value="message"
    :input-props="{ 'data-testid': 'express-interest-message' }"
  />
  ```
- **دیالوگ‌های مشترک (`ConfirmDialog`):** استفاده از propهای `confirmTestId` و `cancelTestId`:
  ```html
  <ConfirmDialog
    :show="showConfirm"
    confirm-test-id="match-accept-confirm"
    @confirm="handleAccept"
  />
  ```

---

## ۶. گردش کار توسعه و تست

هنگام تغییر منطق یا ویژگی‌های برنامه:
۱. تست‌های واحد مربوطه (`*.test.ts`) را بروزرسانی کنید.
۲. دستورات `bun run lint` و `bun run test` را اجرا کنید.
۳. در صورت تغییر در جریان‌های اصلی UI، سناریوهای Playwright را در مخزن `doion` بروزرسانی نمایید.
