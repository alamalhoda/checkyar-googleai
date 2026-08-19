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
- `src/features/auth/userTypeKyc.test.ts`: سنجش قوانین ثبت‌نام بر اساس `user_type` ("natural" | "legal")، منطق شرطی اعتبارسنجی احراز هویت (کد ملی ۱۰ رقمی برای حقیقی در برابر شناسه ملی ۱۱ رقمی + نام شرکت برای حقوقی)، و تست `getKycQueue()` برای بازگرداندن درخواست‌های حقیقی و حقوقی در انتظار همراه با `user_type`.
- `src/utils/persianUtils.test.ts`: تبدیل اعداد فارسی، اعتبارسنجی کد ملی، فرمت پول و تاریخ.
- `src/stores/auth.permissions.test.ts`: بررسی سطح دسترسی‌ها و نقش‌ها در استور احراز هویت.
- `src/stores/auth.mockSignout.test.ts`: بررسی حالات نشانگر خروج در شبیه‌ساز (ایجاد کاربر اولیه، حفظ حالت خروج پس از بارگذاری مجدد بدون لاگین خودکار، پاکسازی با ورود مجدد، و عدم تاثیر در حالت واقعی).
- `src/features/landing/guard.test.ts`: بررسی منطق هدایت مسیر فرود (`getLandingRedirect`) در تمام حالات فعال، غیرفعال، ناموجود و خطای سرور برای مسیرهای `/` و `/landing`.
- `src/features/landing/landingConstants.test.ts`: اعتبارسنجی یکپارچگی کاراکترهای نیم‌فاصله (ZWNJ / U+200C) و تایپوگرافی فارسی در عنوان و توضیحات متا صفحه فرود.
- `src/features/landing/content/landingContent.test.ts`: اعتبارسنجی یکپارچگی مرجع واحد محتوا (SSOT) برای متون قفل‌شده رگولاتوری (۴ عبارت مرز مسئولیت و جمله پایانی، متن وضعیت محصول، ۶ پرسش و پاسخ متداول، سلب مسئولیت کارمزد و ساختار نیم‌فاصله‌ها).
- `src/features/landing/forms/iranianMobile.test.ts`: اعتبارسنجی مستقل فرمت شماره موبایل‌های ایرانی با ارقام انگلیسی و فارسی.
- `src/features/landing/forms/leadCaptureValidator.test.ts`: اعتبارسنجی مستقل فیلدهای فرم جذب سرنخ (نام، شماره تماس، نقش و محدودیت یادداشت).
- `src/features/landing/forms/contactValidator.test.ts`: اعتبارسنجی مستقل فیلدهای فرم تماس با ما (نام، فرمت ایمیل و طول پیام).
- `src/features/landing/utils/landingListingUtils.test.ts`: ارزیابی منطق مسیردهی کارت‌های آگهی به `/login` برای مهمان و `/listings/:id` برای کاربر وارد شده.
- `src/features/listings/composables/useSmartPricing.test.ts`: محاسبات نرخ تنزیل و قیمت‌گذاری هوشمند.
- `src/shared/composables/useFeatureFlags.test.ts`: بارگذاری کلیدهای فیچر، ادغام مقادیر اولیه در `localStorage` قدیمی برای `show_risk_tier` و `show_landing_page` بدون حذف داده‌های کاربر، و ارزیابی پویای کلیدها و مدیریت امن خطا (Fail-Closed).
- `src/features/moderation/moderationRiskTier.test.ts`: بررسی منطق تصمیم‌گیری ناظر همراه با تخصیص `risk_tier`.
- `src/api/client.test.ts`: بررسی گارد محیط شبیه‌ساز (Mock mode).
- `src/api/liveFixes.test.ts`: بررسی عملکرد Live API برای وضعیت احراز هویت و آپلود مدارک.
- `src/utils/offlineAssets.test.ts`: گارد تست عدم استفاده از CDNهای خارجی و لینک‌های فونت یا تصاویر غیرلوکال.
- `src/utils/themeOverrides.test.ts`: ارزیابی تعیین تم و توکن‌های اختصاصی Naive UI برای تمامی پوسته‌ها.
- `src/stores/useUiStore.test.ts`: اعتبارسنجی مقادیر پیش‌فرض استور، تغییر وضعیت و متدهای `isSidebarCollapsed`، ماندگاری در `localStorage` با کلید `chequeyar_sidebar_collapsed` و تفکیک از وضعیت دراور موبایل.
- `src/shared/utils/breakpoints.test.ts`: اعتبارسنجی توابع خالص کمکی ابعاد و بریک‌پوینت دسکتاپ (`768px` / `md`).
- `src/shared/utils/menuOptions.test.ts`: اعتبارسنجی تابع خالص مسطح‌سازی عناوین گروه‌های منو، استخراج فرزندان، حفظ آیتم‌های مستقل، عدم جهش در آرایه ورودی و تطابق با ساختار سایدبار در حالت ریل فشرده.
- `src/shared/banks/lookup.test.ts`: بررسی کاتالوگ ۱۴ بانک محلی، مرتب‌سازی صعودی الفبایی فارسی، جستجوی دقیق بر اساس کد با فاصله‌زدایی، جستجو بر اساس نام نمایشی و نام‌های مستعار (بدون تطابق فازی یا زیررشته)، و استخراج رنگ سازمانی بر اساس تم.
- `src/shared/components/BankBadge.test.ts`: ارزیابی کامپوننت BankBadge در حالات رندر لوگو، نمایش حرف اول با رنگ سازمانی تم، حالت بانک نامشخص با آیکون خنثی ساختمان، دسترسی‌پذیری و حالت اندازه فشرده.
- `src/features/reports/utils/chartTheming.test.ts`: اعتبارسنجی تنظیمات پویا، پالت رنگ و تولتیپ نمودارهای ApexCharts.

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

### نحوه تست صف احراز هویت حقیقی و حقوقی

- **تست در حالت شبیه‌ساز (`VITE_USE_MOCK=true`):**
  ۱. با حساب `moderator1` وارد شوید یا نقش تست را به ناظر (Moderator) تغییر دهید.
  ۲. به مسیر `/moderation/kyc` بروید.
  ۳. اطمینان حاصل کنید صف حداقل شامل یک **شخص حقیقی** (کد ملی ۱۰ رقمی) و یک **شخصیت حقوقی** (نام شرکت + شناسه ملی ۱۱ رقمی + نام نماینده) همراه با نشان برچسبی نوع شخص (`data-testid="kyc-queue-user-type"`) می‌باشد.
- **تست در حالت واقعی (`VITE_USE_MOCK=false`):**
  - در بک‌اند واقعی (`doion`)، کاربران سید اولیه شامل `holderkyc1` (حقیقی در انتظار احراز) و `holderkyclegal1` (حقوقی در انتظار احراز) می‌باشند. جهت اطلاعات بیشتر به مستندات سید و [MASTER_API_CONTRACT.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/MASTER_API_CONTRACT.md) مراجعه کنید.
  - پاسخ‌های API احراز هویت فیلد فقط-خواندنی `user_type: "natural" | "legal"` را برمی‌گردانند.

### بررسی و تست صفحه فرود به عنوان کاربر مهمان در شبیه‌ساز

جهت بررسی ظاهر و عملکرد صفحه فرود از دید کاربر مهمان (وارد نشده):
۱. در حالت شبیه‌ساز (`VITE_USE_MOCK=true`)، از طریق منوی کاربر در هدر روی دکمه **خروج** کلیک کنید. این کار نشانگر `chequeyar_mock_signed_out = 'true'` را در `localStorage` ثبت می‌کند.
۲. صفحه را رفرش کنید یا به آدرس `/` یا `/landing` بروید. کاربر دمو به صورت خودکار لاگین نخواهد شد و در حالت مهمان باقی می‌مانید.
۳. موارد زیر را بررسی کنید:
   - هدر دکمه‌های **ورود** (`landing-nav-login`، در موبایل: `landing-nav-login-mobile`) و **ثبت‌نام** (`landing-nav-register`، در موبایل: `landing-nav-register-mobile`) را نمایش می‌دهد. برای کاربر وارد شده، دکمه **ورود به بازارچه** (`landing-nav-marketplace`، در موبایل: `landing-nav-marketplace-mobile`) نمایش می‌یابد.
   - بخش معرفی (Hero) نشان وضعیت پایلوت (`landing-hero-pilot-badge`) را دقیقاً با متن `v1 لایه ۱ آماده پایلوت — نه در حال ساخت MVP، نه لانچ‌شده` نمایش می‌دهد.
   - دکمه‌های فراخوان بخش معرفی شامل دکمه اصلی `landing-hero-primary-cta` («ثبت‌نام» -> `/register`)، دکمه ثانویه `landing-hero-secondary-cta` («ورود» -> `/login`) برای مهمان و پیوند متنی «مشاهده بازارچه» است.
   - بخش مرز مسئولیت‌ها (`#responsibility-boundary`) هر ۴ عبارت قفل‌شده را در قالب کارت‌های تفکیک‌شده به همراه جمله پایانی «چک‌یار واسط فناورانه است، نه نهاد مالی.» نمایش می‌دهد.
   - بخش تعرفه (`#pricing`) ۳ مدل درآمدی آتی را بدون عدد و همراه با سلب مسئولیت برجسته «در محصول فعلی کارمزدی دریافت نمی‌شود.» نمایش می‌دهد.
   - بخش تابلوی آگهی‌های زنده (`#live-listings`) تا ۴ آگهی را با مبالغ تومانی، تاریخ سررسید جلالی و روزهای مانده نمایش می‌دهد. کلیک روی هر کارت کاربر مهمان را به صفحه `/login` هدایت می‌کند و هیچ درخواست احراز هویت شده به سرور فرستاده نمی‌شود.
   - تست کلید سطح ریسک: در داده‌های اولیه شبیه‌ساز `show_risk_tier` غیرفعال است (نشان ریسک مخفی). با نقش مدیر در `/admin/feature-flags` کلید را فعال کرده و صفحه فرود را مجدد باز کنید تا نشان سطح ریسک (`data-testid="landing-listing-risk-tier"`) روی آگهی‌های مربوطه ظاهر شود.
   - فرم‌های تماس با ما (`#contact-us`) و ثبت تقاضا (`#lead-capture-form`): با مقادیر نامعتبر خطاهای مربوطه را نمایش می‌دهند و با اطلاعات معتبر اعلان موفقیت را ظاهر کرده و فیلدها را بدون ارسال ریکوئست به سرور پاکسازی می‌کنند.
   - بخش پرسش‌های متداول (`#faq`) تمام ۶ پرسش قفل‌شده (`landing-faq-item-1` تا `landing-faq-item-6`) را نمایش داده که با کلیک روی هر یک، پاسخ قفل‌شده متناظر باز می‌شود.
   - لینک‌های لنگری هدر (`#how-it-works`، `#live-listings`، `#faq`، `#contact-us`) به آرامی به بخش‌های مربوطه اسکرول می‌کنند.
   - پیوندهای فوتر پیام «به‌زودی» را نمایش داده و هدایت شکسته به ۴۰۴ ندارند.
۴. جهت بازگشت به حالت کاربر وارد شده، روی دکمه ورود کلیک کرده و با یکی از کاربران نمایشی وارد شوید یا `localStorage` را پاک نمایید.

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

### استقرار مداوم دموی ماک (CD)

استقرار نسخه دموی ماک به صورت مجزا از CI آزمون‌ها مدیریت می‌شود. پس از هر push به شاخه `main`، ورک‌فلو [.github/workflows/cd-demo.yml](../.github/workflows/cd-demo.yml) تست‌های واحد و lint را اجرا کرده، نسخه ماک SPA را با `VITE_USE_MOCK=true` بیلد می‌کند و در سرویس استاتیک چابکان (`chequeyar-front-demo`) مستقر می‌سازد. ورک‌فلو اصلی CI (`ci.yml`) همچنان اعتبارسنجی بیلد پیش‌فرض و تست‌ها را بر عهده دارد و آزمون‌های E2E در مخزن `doion` (پوشه `e2e/`) نگهداری می‌شوند.

---

## ۸. اعتبارسنجی پوسته‌ها و استایل‌های پویا

### بررسی یکپارچگی پوسته‌های چندگانه
هنگام ایجاد یا ویرایش کامپوننت‌های واسط کاربری:
۱. اطمینان حاصل کنید که استایل‌ها از توکن‌های استاندارد Tailwind (`bg-slate-900`, `bg-slate-800`, `text-slate-100`, `text-slate-400`, `border-slate-800`) نگاشت‌شده به متغیرهای CSS استفاده می‌کنند و رنگ ثابت و هاردکد شده ندارند.
۲. هر ۶ پوسته (`dark`, `light`, `warm`, `navy`, `violet`, `emerald`) را از طریق منوی هدر یا صفحه تنظیمات حساب کاربری تست و ارزیابی بصری نمایید.
۳. در بخش گزارش‌ها (`/reports`) عملکرد صحیح پالت رنگی و تولتیپ‌های نمودارهای ApexCharts را در هر دو حالت تیره و روشن بررسی کنید.
۴. دستورات `bun run lint` و `bun run test` را جهت تایید عدم وجود رگرسیون اجرا نمایید.


