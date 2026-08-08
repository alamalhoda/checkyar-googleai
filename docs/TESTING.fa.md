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
- `src/shared/composables/useFeatureFlags.test.ts`: بارگذاری کلیدهای فیچر و ارزیابی کلید `show_risk_tier`.
- `src/features/moderation/moderationRiskTier.test.ts`: بررسی منطق تصمیم‌گیری ناظر همراه با تخصیص `risk_tier`.
- `src/api/client.test.ts`: بررسی گارد محیط شبیه‌ساز (Mock mode).
- `src/api/liveFixes.test.ts`: بررسی عملکرد Live API برای وضعیت احراز هویت و آپلود مدارک.
- `src/utils/offlineAssets.test.ts`: گارد تست عدم استفاده از CDNهای خارجی و لینک‌های فونت یا تصاویر غیرلوکال.

---

## ۲. بررسی تایپ‌ها و کیفیت کد (Type Checking)

اعتبارسنجی تایپ‌های TypeScript با دستور زیر انجام می‌شود:

```bash
bun run lint
```

این دستور اسکریپت `tsc --noEmit` را اجرا می‌کند.

---

## ۳. تست یکپارچه‌سازی و مساحات کاری Live API

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

### قابلیت‌ها و مسیرهای Live API فاز A

- **احراز هویت واقعی در پروفایل (`/me`):** ثبت درخواست‌های احراز هویت از طریق `POST /verifications/` و دریافت وضعیت جاری از طریق `GET /verifications/me/`.
- **بررسی صف نظارت و احراز هویت (KYC Review):** بررسی درخواست‌های احراز هویت در مسیر `/moderation/kyc/:id` و ثبت تصمیمات ناظر از طریق `POST /moderation/kyc/:id/decision/`.
- **ارسال واقعی مدارک با `FormData`:** متد `listingsApi.uploadDocument` داده‌های باینری `File` و `Blob` را در قالب `FormData` ارسال می‌کند (`POST /listings/:id/documents/`).
- **بخش‌های مدیریتی پشتیبانی‌شده (Admin Surfaces):** قابلیت‌های مدیریتی شامل `/admin/stats` (آمار تطبیق)، `/admin/feature-flags` (کلیدهای فیچر) و `/admin/audit` (لاگ رویدادها) می‌باشد. مسیر `/admin/reports` به `/admin/stats` هدایت می‌شود.

### تفکیک حالت شبیه‌ساز (Mock) و Live

> **نکته مهم:** حالت شبیه‌ساز (`VITE_USE_MOCK=true`) و پیش‌نمایش GitHub Codespaces صرفاً جهت دمو و مرور بصری فرانت‌اند است و جایگزین آزمون‌های واحد اتوماتیک (`bun run test`) یا تست‌های یکپارچه‌سازی و Playwright با بک‌اند واقعی نمی‌باشد.

---

## ۴. آزمون‌های سرتاسری (E2E Testing - Playwright)

تست‌های سرتاسری مرورگر (Playwright) در **مخزن `doion`** و تحت پوشه `e2e/` نگهداری می‌شوند.

- **مکان تست‌های E2E:** مخزن `alamalhoda/doion` (پوشه `e2e/`).
- **راهنما:** سند [E2E_LOCAL_RUNBOOK.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/E2E_LOCAL_RUNBOOK.md) در مسیر `docs/development/E2E_LOCAL_RUNBOOK.md` در پروژه `doion`.
- **وضعیت توسعه فرانت‌اند و تست‌ها:** مستند [FRONTEND_DEVELOPMENT_STATUS.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/FRONTEND_DEVELOPMENT_STATUS.md) در پروژه `doion`.
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

---

## ۷. یکپارچه‌سازی مداوم - CI (GitHub Actions) و سیاست محیط شبیه‌ساز

فرآیند تست و ساخت اتوماتیک در فایل [.github/workflows/ci.yml](../.github/workflows/ci.yml) پیکربندی شده است. با هر push یا pull_request روی شاخه `main`، اکشن‌های زیر در GitHub اجرا می‌شوند:
- `bun run lint` (بررسی تایپ‌ها و اعتبار کد)
- `bun run test` (اجرای آزمون‌های واحد Vitest در محیط `happy-dom` با دسترسی ایمن به `localStorage` در کلاینت API)
- `bun run build` (بررسی کامپایل و ساخت نسخه نهایی)

### سیاست محیطی حالت شبیه‌سازی در تست‌ها
- **وابسته به محیط (Env Gated):** تمام المان‌ها و کلیدهای شبیه‌ساز تنها زمانی فعال هستند که `VITE_USE_MOCK=true` باشد.
- **رابط کاربری خالص Live:** در صورت `VITE_USE_MOCK=false` کنترل‌های هدر، بنرهای دمو، کلید `data-testid="mock-mode-switch"`، کارت‌های کاراکتر دمو و دکمه‌های پرکردن سریع کاملاً پنهان می‌شوند.
- آزمون‌های واحد در `src/api/client.test.ts` تایید می‌کنند که با `VITE_USE_MOCK=false` تابع `getMockMode()` دائماً `false` داده و `setMockMode(true)` هیچ عملی انجام نمی‌دهد.

> نکته: تست‌های سرتاسری Playwright همچنان در مخزن `doion` (پوشه `e2e/`) اجرا می‌شوند.

