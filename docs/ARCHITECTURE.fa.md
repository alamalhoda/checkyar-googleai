# معماری سامانه (واسط کاربری چک‌یار)

این سند مرجع اصلی (SSOT) معماری بخش فرانت‌اند سامانه **چک‌یار (Cheque Yar)** است.

---

## ۱. هدف پروژه و جریان توسعه

این مخزن (`alamalhoda/checkyar-googleai`) شامل واسط کاربری فعال محصول چک‌یار است.

### جریان همگام‌سازی یک‌طرفه (One-Way Sync)

سورس‌کد UI فقط در محیط **Google AI Studio** توسعه می‌یابد و به گیت‌هاب ارسال می‌شود. کلون لوکال صرفاً برای `git pull` و تست‌های یکپارچه‌سازی با بک‌اند استفاده می‌گردد.

```text
[Google AI Studio]  --push-->  گیت‌هاب (checkyar-googleai)
                                       |
                                       v  (فقط git pull)
                               کلون لوکال / تست در کنار بک‌اند doion
```

> **قانون حیاتی:** هرگز کد سورس UI را از سیستم لوکال یا محیط‌های توسعه مانند Cursor تغییر نداده و push نکنید. سورس اصلی فقط در AI Studio ویرایش می‌شود.

---

## ۲. تکنولوژی‌های استفاده‌شده

- **فریم‌ورک:** Vue 3 (Composition API با `<script setup>`)
- **زبان:** TypeScript
- **کتابخانه کامپوننت:** Naive UI
- **استایل‌دهی:** Tailwind CSS v4
- **مدیریت وضعیت:** Pinia
- **مسیریابی:** Vue Router
- **ابزار ساخت:** Vite
- **مدیریت بسته‌ها:** **Bun** (فایل `bun.lock` فایل قفل رسمی است؛ `package-lock.json` نباید commit شود)

---

## ۳. ساختار پوشه‌ها و لایه‌ها

کد پروژه در مسیر `src/` بر اساس ویژگی‌ها (Features) و لایه‌بندی زیر سازمان‌دهی شده است:

```text
src/
├── api/                     # کلاینت HTTP (Axios)، اینترسپتورها و ماژول‌های API
│   ├── client.ts            # تنظیمات کلاینت Axios
│   └── index.ts             # ماژول‌های API (احراز، آگهی‌ها، پیشنهادها، اعلانات، نظارت، مدیریت)
├── features/                # ماژول‌های حوزه تجاری (Feature Modules)
│   ├── admin/               # پنل مدیریت (آمار، کلیدهای ویژگی، لاگ‌ها)
│   ├── auth/                # صفحات ورود و ثبت‌نام
│   ├── landing/             # صفحه معرفی عمومی سامانه (LandingView، LandingHeader، LandingFooter، گارد هدایت)
│   ├── listings/            # مدیریت آگهی‌ها (ویزارد ایجاد، ویرایش، جزئیات)
│   ├── marketplace/         # بازارچه عمومی و فیلترهای جستجو
│   ├── matches/             # ابراز تمایل، پیشنهادها و پیگیری تسویه
│   ├── moderation/          # صف بررسی آگهی‌ها و احراز هویت (KYC)
│   ├── notifications/       # مرکز اعلانات و تنظیمات پیام‌ها
│   └── profile/             # پروفایل کاربری و حساب من
├── router/                  # تعاریف Vue Router و گارد‌های دسترسی
├── shared/                  # کامپوننت‌های عمومی (AppHeader، AppSidebar، ConfirmDialog)
├── stores/                  # استورهای Pinia (احراز هویت و شبیه‌ساز بک‌اند)
├── types/                   # تعاریف تایپ‌های TypeScript و مدل‌های داده
├── utils/                   # توابع کمکی (تبدیل اعداد فارسی، اعتبارسنجی‌ها)
├── App.vue                  # کامپوننت ریشه
└── main.ts                  # نقطه ورود اصلی
```

---

## ۴. حالت‌های اجرایی (Live API در برابر Mock)

رفتار برنامه در زمان اجرا توسط متغیر محیطی `VITE_USE_MOCK` کنترل می‌شود:

| حالت | متغیرهای محیطی | توضیح |
|------|------------------|-------|
| **Live API** | `VITE_USE_MOCK=false`<br>`VITE_API_BASE_URL=http://localhost:8000/api/v1` | حالت کاملاً واقعی. تمام المان‌ها و ابزارهای شبیه‌ساز (سوییچر نقش تست در هدر، بنر و کلید شبیه‌ساز در صفحه ورود، کارت‌های ورود سریع و دکمه‌های دمو) کاملاً پنهان و غیرفعال می‌شوند. کلاینت API مستقیماً به سرور واقعی متصل است. |
| **Mock Mode** | `VITE_USE_MOCK=true` | فعال‌سازی شبیه‌ساز درون برنامه‌ای (`useBackendSimulatorStore`)، کنترل‌های نقش تست در هدر، کارت‌های کاراکتر دمو در صفحه ورود و قابلیت سوییچ در زمان اجرا. |

### سیاست محیطی حالت شبیه‌سازی (Mock Policy)

- **محدودیت زمانی کامپایل:** قابلیّت‌ها و عناصر UI شبیه‌ساز **تنها** در صورتی قابل مشاهده و استفاده هستند که `VITE_USE_MOCK=true` باشد.
- **تضمین حالت واقعی (Live):** زمانی که `VITE_USE_MOCK=false` (یا هر مقداری غیر از `'true'`) باشد، تابع `getMockMode()` دائماً `false` برمی‌گرداند و `setMockMode(true)` هیچ تاثیری ندارد (کلیدهای قبلی `localStorage` نادیده گرفته می‌شوند). رابط کاربری فرم‌های استاندارد و هدر تمیز حالت Live را ارائه می‌دهد.
- **تفکیک شخص حقیقی و حقوقی (`user_type`):**
  - در ثبت‌نام، مشخص‌کردن `user_type` (`"natural" | "legal"`) الزامی است. برای شخص حقوقی، وارد کردن `name` (نام رسمی شرکت) اجباری است.
  - نوع کاربر پس از ثبت‌نام ثابت و غیرقابل ویرایش است.
  - شیء احراز هویت (`Verification`) شامل فیلد خواندنی `user_type: "natural" | "legal"` صادر شده از API و شبیه‌ساز است.
  - قواعد اعتبارسنجی احراز هویت (KYC):
    - **شخص حقیقی (`natural`):** نام کامل الزامی، کد ملی دقیقاً ۱۰ رقم عددی، و نام شرکت باید خالی باشد.
    - **شخص حقوقی (`legal`):** نام رسمی شرکت الزامی، شناسه ملی شرکت دقیقاً ۱۱ رقم عددی، و نام نماینده قانونی / صاحب امضا الزامی است.
- **کاربران اولیه و صف احراز شبیه‌ساز:**
  - داده‌های اولیه کاربران شامل هر دو نوع حقیقی و حقوقی است: `holderkyc1` (حقیقی در انتظار احراز)، `holderkyclegal1` (حقوقی در انتظار احراز)، `holderlegal1` (صادرکننده حقوقی تأییدشده) در کنار کاربران اصلی `holder1`, `investor1`, `moderator1`, `admin1`.
  - لیست `seedVerifications` در `useBackendSimulatorStore` حداقل شامل یک جفت در انتظار است: یک حقیقی (کد ملی ۱۰ رقمی، نام شرکت خالی) و یک حقوقی (شناسه ملی ۱۱ رقمی، نام شرکت پر، نام نماینده).
  - رابط صف بررسی احراز هویت (`/moderation/kyc`) برچسب شفاف `user_type` (شخص حقیقی / شخصیت حقوقی) را نمایش می‌دهد.
- **جریان احراز هویت (KYC) واقعی:** مستقیم در پروفایل کاربری `/me` یکپارچه‌سازی شده (`POST /verifications/` و `GET /verifications/me/`). بررسی‌های ناظر (`/moderation/kyc/:id`) تصمیمات را از طریق `POST /moderation/kyc/:id/decision/` ثبت می‌کنند.
- **بارگذاری مدارک واقعی:** متد `listingsApi.uploadDocument` ورودی‌های باینری `File`/`Blob` را پذیرفته و در قالب `FormData` ارسال می‌کند (`POST /listings/:id/documents/`).
- **سطوح مدیریتی پشتیبانی‌شده (Admin Surfaces):** قابلیّت‌های مدیریتی بر سه بخش اصلی `/admin/stats` (آمار تطبیق)، `/admin/feature-flags` (کلیدهای فیچر) و `/admin/audit` (لاگ رویدادها) متمرکز است. مسیر بدون پشتیبانی `/admin/reports` به `/admin/stats` هدایت می‌شود.
- **کنترل نمایش سطح ریسک (`show_risk_tier`):** نمایش عمومی نشان‌ها و فیلترهای `risk_tier` در کارت‌های مارکت‌پلیس، جزئیات آگهی و ویجت‌ها توسط کلید فیچر `show_risk_tier` و کامپوزبل `useFeatureFlags` مدیریت می‌شود. در شبیه‌ساز ماک (`useBackendSimulatorStore`)، کلیدهای جدید اضافه شده به داده‌های اولیه (مانند `show_risk_tier`) به صورت خودکار با اطلاعات ذخیره‌شده قدیمی در `localStorage` ادغام شده و بدون پاک شدن اطلاعات کاربر ذخیره می‌شوند. همچنین تغییر وضعیت کلید فیچر بلافاصله کش `useFeatureFlags` را به‌روزرسانی می‌کند (`fetchFlags(true)`) تا تغییرات بدون نیاز به رفرش صفحه در کل واسط کاربری منعکس گردند. ناظران فارغ از وضعیت این کلید همواره به کنترل‌های تعیین سطح ریسک دسترسی دارند.
- **قرارداد تصمیم نظارتی:** در زمان تأیید آگهی (`POST /api/v1/moderation/{id}/decision/`) امکان تعیین سطح ریسک اختیاری (`'low' | 'medium' | 'high'`) وجود دارد. در حالت رد آگهی، `risk_tier` ارسال نمی‌شود.
- **پوسته عمومی و ماژول صفحه فرود (`src/features/landing/`):**
  - مسیرهای دارای مشخصه `meta: { publicChrome: true }` (مانند `/landing`) به شکل مستقل و بدون سایدبار (`AppSidebar`) یا هدر داخلی (`AppHeader`) رندر می‌شوند.
  - صفحه فرود همواره با تم بصری تیره برند (`data-theme="dark"` و تم تیره اختصاصی Naive UI) نمایش داده می‌شود، بدون آن‌که تم انتخابی ذخیره‌شده کاربر در `localStorage` دستخوش تغییر شود.
  - مرجع واحد محتوا (SSOT) در فایل `src/features/landing/content/landingContent.ts` با رعایت دقیق نیم‌فاصله‌ها (`\u200c` / ZWNJ) نگهداری می‌شود.
  - ساختار ۱۲ گانه صفحه توسط کامپوننت‌های مجزا در مسیر `src/features/landing/sections/` تشکیل شده است:
    - **بخش‌های کامل و غنی از محتوا:** `HeroSection.vue` (`#hero`)، `ProblemSolutionSection.vue` (`#problem-and-solution`)، `HowItWorksSection.vue` (`#how-it-works`)، `AudiencesSection.vue` (`#audiences`)، `ResponsibilityBoundarySection.vue` (`#responsibility-boundary`)، `ProductStatusSection.vue` (`#product-status`)، `PricingSection.vue` (`#pricing`)، `FaqSection.vue` (`#faq`)، و `InvestingSection.vue` (`#investing-in-cheque-yar`).
    - **بخش‌های جانمایی (جهت اتصال به API و فرم‌ها در فاز بعد):** `#live-listings` (`landing-section-live-listings`)، `#contact-us` (`landing-section-contact-us`) و `#lead-capture-form` (`landing-section-lead-capture-form`).
  - این صفحه شامل پیوندهای پرشی به بخش‌ها (`#how-it-works`، `#live-listings`، `#faq`، `#contact-us`) و دکمه‌های اقدام هدر برای کاربران مهمان (`landing-nav-login`, `landing-nav-register`, `landing-nav-login-mobile`, `landing-nav-register-mobile`) و کاربران وارد شده (`landing-nav-marketplace`, `landing-nav-marketplace-mobile`) است.
- **گارد هدایت امن مسیر فرود (`show_landing_page`):**
  - این گارد با استفاده از تابع کمکی `getLandingRedirect(flagEnabled, targetPath)` به صورت ناهمگام در سطح مسیرهای `/` و `/landing` اعمال می‌گردد.
  - در صورت فعال بودن کلید (`true`)، مسیر `/` به `/landing` هدایت شده و کاربران (اعم از مهمان یا لاگین کرده) مستقیماً صفحه فرود را مشاهده می‌کنند.
  - در صورت غیرفعال بودن کلید (`false`)، عدم وجود آن در پاسخ سرور یا بروز خطا در فراخوانی، هر دو مسیر `/` و `/landing` به شکل امن (Fail-Closed) به `/marketplace` هدایت می‌شوند بدون آن‌که چرخه بازگشتی (Redirect Loop) رخ دهد.
- **نشانگر خروج در حالت شبیه‌ساز (`chequeyar_mock_signed_out`):**
  - در حالت شبیه‌ساز (`VITE_USE_MOCK=true`)، خروج صریح کاربر نشانگر `chequeyar_mock_signed_out = 'true'` را در `localStorage` ثبت می‌کند.
  - در بارگذاری‌های مجدد، این نشانگر از ایجاد یا لاگین خودکار کاربر دمو (`holder1`) جلوگیری می‌کند تا تجربه کاربر مهمان در صفحه فرود به درستی قابل ارزیابی باشد.
  - ورود یا ثبت‌نام مجدد این نشانگر را پاک می‌کند. در حالت Live API (`VITE_USE_MOCK=false`) این نشانگر هیچ تاثیری ندارد و ورود خودکار انجام نمی‌شود.
- **وضعیت استعلام صیادی:** استعلام‌های صیادی در UI به عنوان استعلام آزمایشی/مشورتی برچسب‌گذاری شده‌اند.
- **منوی تغییر نقش تست:** در صورت `VITE_USE_MOCK=true` منوی «نقش تست» در هدر فعال خواهد بود. در حالت Live API سطوح دسترسی کاملاً توسط توکن JWT صادر شده توسط سرور واقعی مدیریت می‌شوند.

### پیش‌نمایش در GitHub Codespaces (حالت شبیه‌ساز)

- **پیش‌نمایش با یک کلیک:** ایجاد یک Codespace از این مخزن به طور خودکار Bun را نصب، فایل `.env` را با `VITE_USE_MOCK=true` تنظیم و سرور Vite را روی پورت 3000 اجرا می‌کند.
- **محیط غیرعملیاتی:** پیش‌نمایش در Codespaces کاملاً در حالت شبیه‌ساز فرانت‌اند بدون نیاز به دیتابیس یا بک‌اند اجرا می‌شود.
- **چرخه حیات و آدرس‌ها:** با توقف Codespace به دلیل عدم فعالیت، آدرس پیش‌نمایش غیرفعال می‌شود. ایجاد Codespace جدید، آدرس جدیدی تولید می‌کند.
- **برای تست Live API:** برای تست با بک‌اند واقعی، مخزن را به صورت لوکال در کنار سرور `doion` با تنظیم `VITE_USE_MOCK=false` اجرا کنید.

### نسخه دموی هاست‌شده شبیه‌ساز (Chabokan Static)

- **دموی آنلاین ماک:** به عنوان سرویس استاتیک چابکان (`chequeyar-front-demo`) در آدرس [https://chequeyar-front-demo.chbkn.dev/](https://chequeyar-front-demo.chbkn.dev/) در دسترس است.
- **استقرار خودکار:** توسط ورک‌فلو گیت‌هاب اکشنز (`.github/workflows/cd-demo.yml`) با متغیر `VITE_USE_MOCK=true` در زمان کامپایل ساخته و مستقر می‌شود.
- **پیکربندی وب‌سرور:** از طریق فایل ریشه `nginx.conf` با مسیر ریشه `/usr/share/nginx/html/dist` (فایل‌های بیلدشده SPA) و دستور `try_files $uri $uri/ /index.html` برای پشتیبانی کامل از مسیریابی Vue Router تنظیم شده است.
- **محیط و وضعیت داده‌ها:** هیچ بک‌اند یا دیتابیس واقعی متصل نیست. داده‌های شبیه‌ساز در `localStorage` مرورگر هر کاربر ذخیره می‌شوند و پایگاه‌داده اشتراکی وجود ندارد.
- **دامنه کاربرد:** این محیط صرفاً دموی نمایشی است و نسخه عملیاتی (Production) یا استیجینگ زنده (Live Staging) **نیست**. پیش‌نمایش در Codespaces نیز به عنوان محیط دوم توسعه/پیش‌نمایش ابری فعال است.

---

## ۵. مرزهای معماری

- **بک‌اند و قرارداد API:** معماری بک‌اند و انpointهای Django DRF در مخزن [alamalhoda/doion](https://github.com/alamalhoda/doion) نگهداری می‌شوند.
- **مستند قرارداد API:** سند رسمی در [MASTER_API_CONTRACT.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/MASTER_API_CONTRACT.md) در مسیر `docs/development/MASTER_API_CONTRACT.md` در پروژه doion قرار دارد.
- **وضعیت توسعه فرانت‌اند:** مستند [FRONTEND_DEVELOPMENT_STATUS.md](https://github.com/alamalhoda/doion/blob/develop/docs/development/FRONTEND_DEVELOPMENT_STATUS.md) در پروژه doion.

---

## ۶. مدیریت بسته‌ها

- **Bun** مدیریت‌کننده رسمی بسته‌ها است.
- نصب بسته‌ها فقط با `bun install` انجام می‌شود.
- فایل `bun.lock` تحت گیت است و `package-lock.json` نادیده گرفته می‌شود.

---

## ۷. عدم وابستگی به CDNهای خارجی و میزبانی شبکه ملی (Offline Assets)

جهت تضمین عملکرد کامل سامانه بر روی شبکه ملی اطلاعات (اینترانت) و سرورهای داخلی:
- **فونت وزیرمتن:** فایل‌های WOFF2 فونت وزیرمتن (وزن‌های ۳۰۰ تا ۸۰۰) به طور مستقیم در مسیر `public/fonts/vazirmatn/` ذخیره و در Git قرار گرفته‌اند. قوانین `@font-face` با `font-display: swap` از طریق CSS اجرا می‌شوند و تمام لینک‌های Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) حذف گردیده‌اند.
- **آیکون‌ها:** آیکون‌های برنامه از طریق بسته‌های `@vicons/ionicons5` و `@vicons/utils` به صورت کامپوننت‌های SVG درون فایل‌های باندل Vite قرار می‌گیرند و هیچ CDN آیکون خارجی استفاده نمیشود.
- **تصاویر جایگزین و دمو:** تصاویر نمونه چک، کارت ملی و مدارک از مسیر لوکال `public/images/placeholders/` (`/images/placeholders/*.svg`) بارگذاری می‌شوند و سرویس‌های خارجی مانند `placehold.co`، `via.placeholder.com` و `unsplash.com` کاملاً حذف شده‌اند.
- **ارتباط با ای‌پای:** تمام فراخوانی‌ها به سرور بک‌اند `doion` متصل می‌باشند.

---

## ۸. معماری پوسته‌ها و تم‌های پویای واسط کاربری

واسط کاربری سامانه چک‌یار از ۶ پوسته مجزا پشتیبانی می‌کند: `dark` (تاریک - پیش‌فرض)، `light` (روشن)، `warm` (گرم)، `navy` (سرمه‌ای)، `violet` (بنفش) و `emerald` (زمردی).

### مرجع واحد حقیقت (Single Source of Truth)
- **توکن‌های متغیر CSS:** در `src/index.css` ذیل `:root` و اتریبیوت‌های `[data-theme="..."]` تعریف شده‌اند:
  - پس‌زمینه و سطوح: `--theme-bg`, `--theme-surface`, `--theme-surface-muted`, `--theme-input`
  - کادرها و خطوط مرزی: `--theme-border`, `--theme-border-subtle`
  - تایپوگرافی و متن: `--theme-text-primary`, `--theme-text-on-surface`, `--theme-text-secondary`, `--theme-text-muted`
  - رنگ سازمانی و لهجه‌ها: `--theme-primary`, `--theme-primary-hover`, `--theme-primary-pressed`, `--theme-primary-soft`, `--theme-selection-bg`, `--theme-selection-text`
  - انحنای گوشه‌ها: `--radius-control` (۸ پیکسل), `--radius-card` (۱۶ پیکسل)
  - اسکرول‌بار: `--theme-scrollbar-track`, `--theme-scrollbar-thumb`, `--theme-scrollbar-thumb-hover`
- **ارتباط Naive UI و متغیرهای CSS:**
  - کامپوننت‌های Naive UI مقادیر هگزادسیمال خود را از `src/utils/themeOverrides.ts` دریافت می‌کنند (که از طریق `<NConfigProvider :theme="naiveTheme" :theme-overrides="naiveThemeOverrides">` در `src/App.vue` اعمال می‌شود).
  - قالب‌های اختصاصی Vue، استایل‌های درون‌خطی (مانند `NDrawerContent`) و کلاس‌های کمکی Tailwind از متغیرهای CSS در `src/index.css` استفاده می‌کنند.
  - این دو منبع در تمام ۶ پوسته همواره همگام‌سازی شده‌اند.
- **یکپارچه‌سازی با Tailwind v4:** کلاس‌های کمکی Tailwind مستقیماً به متغیرهای CSS نگاشت شده‌اند (`--color-slate-900: var(--theme-bg)`, `--color-slate-800: var(--theme-surface)`).
- **سازگاری با Discrete API:** برای اعلان‌ها، پیام‌ها و دیالوگ‌هایی که خارج از درخت رندر Vue فراخوانی می‌شوند، ماژول `src/utils/discreteApi.ts` پوسته فعال را در زمان فراخوانی اعمال می‌کند.
- **پوسته‌بندی نمودارهای ApexCharts:** ماژول `src/features/reports/utils/chartTheming.ts` پالت رنگ، مرزها، برچسب‌ها و تولتیپ‌های نمودارها را با پوسته فعال هماهنگ می‌سازد.


