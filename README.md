# سامانه معامله چک صیادی (چک‌یار - Cheque Yar)

چک‌یار یک پلتفرم پیشرفته، مدرن و امن مبتنی بر **Vue 3** و **TypeScript** جهت تسهیل معامله، خرید، فروش و اعتبارسنجی چک‌های صیادی است. این سامانه با رعایت کامل الزامات رابط و تجربه کاربری (UI/UX) و منطبق بر سند قرارداد ای‌پای (API Contract) طراحی و پیاده‌سازی شده است.

---

## 📌 وضعیت توسعه و نقش‌ها (مهم)

این repository **واسط کاربری فعال** محصول است. بک‌اند و قرارداد API در مونورپوی جداگانه نگه داشته می‌شوند.

| نقش | مکان | توضیح |
|-----|------|--------|
| **UI فعال (این repo)** | [alamalhoda/checkyar-googleai](https://github.com/alamalhoda/checkyar-googleai) | توسعه محصول UI |
| **منبع نگارش UI** | [Google AI Studio](https://aistudio.google.com/) | تنها محل مجاز برای تغییر سورس UI تا نسخه پایدار |
| **Backend + API contract (SSOT)** | [alamalhoda/doion](https://github.com/alamalhoda/doion) | Django/DRF؛ `docs/development/MASTER_API_CONTRACT.md` |
| **UI آرشیو (قدیمی)** | `frontend-legacy/` داخل [doion](https://github.com/alamalhoda/doion) | فقط مستندات و مرجع تاریخی — نگهداری نمی‌شود |

سیاست کامل در doion: [`docs/development/FRONTEND_DEVELOPMENT_STATUS.md`](https://github.com/alamalhoda/doion/blob/develop/docs/development/FRONTEND_DEVELOPMENT_STATUS.md)

### قانون یک‌طرفه (One-way sync)

AI Studio می‌تواند تغییرات را به GitHub **پوش** کند، اما تغییرات را از GitHub **دریافت نمی‌کند**.

```text
[Google AI Studio]  --push-->  this GitHub repo (checkyar-googleai)
                                        |
                                        v  (git pull only)
                                 local clone / test against doion backend
```

**انجام دهید**

- همهٔ تغییرات کد UI را فقط در AI Studio اعمال کنید تا به GitHub پوش شوند.
- روی کلون لوکال فقط `git pull` کنید؛ وابستگی‌ها را با **Bun** نصب کنید (`bun install` — نه `npm install`).
- برای اتصال به بک‌اند واقعی از `.env` لوکال استفاده کنید (فایل را commit نکنید):

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

- تغییرات API/backend را فقط در [doion](https://github.com/alamalhoda/doion) با GitFlow انجام دهید؛ هم‌ترازی کلاینت را در AI Studio بازتاب دهید.

**انجام ندهید**

- از لوکال / Cursor روی این repo برای سورس UI، `commit`/`push` نکنید (AI Studio آن را نمی‌بیند → واگرایی).
- از `npm install` استفاده نکنید و `package-lock.json` را commit نکنید (در `.gitignore` است؛ lockfile رسمی: `bun.lock`).
- این repo را با `frontend-legacy` در doion اشتباه نگیرید؛ آن درخت آرشیو است.

پس از پذیرش نسخه پایدار UI، کد به `doion/frontend` مهاجرت می‌شود و این repo آرشیو خواهد شد.

---

## 🌟 ویژگی‌های کلیدی سامانه

1. **بازارچه آنلاین و جستجوی چک (Marketplace):**
   - مشاهده آگهی‌های چک صیادی با امکان فیلتر بر اساس بانک، مبلغ، تاریخ سررسید و نرخ تنزیل.
   - جستجوی پیشرفته و قابلیت مرتب‌سازی.

2. **مدیریت آگهی‌ها (Listing Management):**
   - ثبت آگهی جدید چک صیادی با استعلام شماره صیادی و ثبت اطلاعات کامل صادرکننده.
   - ویرایش و مدیریت وضعیت آگهی‌ها (فعال، معامله‌شده، منقضی و...).

3. **مدیریت معامله و پیشنهادها (Matches & Trades):**
   - ثبت پیشنهاد خرید (Express Interest) و پذیرش/رد پیشنهادها توسط خریدار و فروشنده.
   - پیگیری روند تسویه و معامله چک با حفظ شفافیت مالی.

4. **سیستم اعلامیه‌ها و اعلانات (Notifications):**
   - اطلاع‌رسانی آنی تغییرات وضعیت آگهی، پیشنهادها و مراحل معامله.
   - علامت‌گذاری پیام‌ها به عنوان خوانده‌شده و تنظیم کانال‌های دریافتی (درون‌برنامه‌ای، پیامک، ایمیل).

5. **پایگاه نظارت و احراز هویت (Moderation & KYC):**
   - صف بررسی و نظارت بر آگهی‌های چک توسط ناظرین با قابلیت ثبت کدهای استاندارد رد/تأیید.
   - صف بررسی اسناد احراز هویت کاربران (KYC) و پیش‌نمایش مدارک ثبتی و کارت ملی.

6. **پنل مدیریت ارشد و مطابقت (Admin & Compliance):**
   - داشبورد آمار و شاخص‌های کلیدی عملکردی سیستم.
   - مدیریت کلیدهای ویژگی (Feature Flags) به صورت آنی.
   - دفتر لاگ رویدادها و حسابرسی سیستم (Audit Logs).

7. **شبیه‌ساز اختصاصی سرور (Backend Simulator):**
   - قابلیت فعال‌سازی حالت Mock Mode جهت تست تمامی سناریوها و جریان‌های کاری بدون نیاز به سرور واقعی.

---

## 🛠 تکنولوژی‌های استفاده‌شده

- **فریم‌ورک:** [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
- **زبان:** [TypeScript](https://www.typescriptlang.org/)
- **کتابخانه کامپوننت:** [Naive UI](https://www.naiveui.com/)
- **استایل‌دهی:** [Tailwind CSS v4](https://tailwindcss.com/)
- **مدیریت وضعیت:** [Pinia](https://pinia.vuejs.org/)
- **مسیریابی:** [Vue Router](https://router.vuejs.org/)
- **بسته‌بندی و ابزار توسعه:** [Vite](https://vitejs.dev/)
- **آیکون‌ها:** [Ionicons 5 (@vicons/ionicons5)](https://www.vicons.dev/)

---

## 📁 ساختار پوشه‌ها و پروژه‌ها

```text
cheque-yar/
├── src/
│   ├── api/                     # لایه ارتباط با API و Axios client
│   │   ├── client.ts            # تنظیمات Axios و Interceptorها
│   │   └── index.ts             # ماژول‌های API (Auth, Listings, Matches, Notifications, Moderation, Admin)
│   ├── features/                # ماژول‌های اصلی برنامه
│   │   ├── admin/               # صفحات مدیریت (Stats, Feature Flags, Audit)
│   │   ├── auth/                # ماژول ورود و ثبت نام
│   │   ├── listings/            # مدیریت آگهی‌ها (ایجاد، ویرایش، جزئیات)
│   │   ├── marketplace/         # بازارچه عمومی چک‌ها
│   │   ├── matches/             # پیشنهادها و معاملات
│   │   ├── moderation/          # صف نظارت آگهی‌ها و KYC
│   │   ├── notifications/       # اعلامیه‌ها و تنظیمات پیام
│   │   └── profile/             # پروفایل کاربری و حساب من
│   ├── router/                  # تنظیماتVue Router و گارد‌های دسترسی
│   ├── shared/                  # کامپوننت‌های عمومی (AppHeader, AppSidebar, ConfirmDialog)
│   ├── stores/                  # استورهای Pinia (Auth, BackendSimulator)
│   ├── types/                   # تایپ‌های TypeScript و تعاریف API
│   ├── App.vue                  # کامپوننت اصلی ریشه
│   └── main.ts                  # نقطه ورود اصلی برنامه
├── package.json                 # بسته‌ها و اسکریپت‌های اجرایی
├── vite.config.ts               # تنظیمات Vite
└── README.md                    # مستندات پروژه
```

---

## 🚀 نحوه نصب و راه‌اندازی

### پیش‌نیازها
- **[Bun](https://bun.sh/)** (package manager رسمی این repo؛ هم‌تراز با Google AI Studio)
- **Node.js** نسخه 18 یا بالاتر (در صورت نیاز ابزارهای جانبی)

Lockfile تحت git: **`bun.lock`**. فایل `package-lock.json` عمداً در `.gitignore` است.

### ۱. دریافت پروژه و نصب بسته‌ها

```bash
git pull
bun install
```

### ۲. تنظیم متغیرهای محیطی

یک فایل `.env` بر اساس نیاز خود در ریشه پروژه ایجاد کنید (این فایل را commit نکنید):

```env
# اتصال به بک‌اند واقعی doion (پیشنهادی برای تست یکپارچه)
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000/api/v1

# یا حالت شبیه‌ساز بدون بک‌اند:
# VITE_USE_MOCK=true
# VITE_API_BASE_URL=/api/v1
```

---

## 💻 نحوه اجرا و توسعه

### اجرای سرور توسعه (Development)

```bash
bun run dev
```

برنامه به صورت پیش‌فرض در آدرس `http://localhost:3000` قابل دسترسی خواهد بود.

---

### بررسی تایپ‌ها و اعتبار کد (Linting)

```bash
bun run lint
```

---

### ساخت نسخه نهایی (Production Build)

```bash
bun run build
```

خروجی کامپایل‌شده در پوشه `dist` قرار خواهد گرفت.

---

## 🔑 حساب‌های تست در حالت شبیه‌ساز (Simulator / Mock)

در بالای صفحه (AppHeader) می‌توانید از طریق منوی **«نقش تست»** سریعاً بین نقش‌های زیر جابه‌جا شوید:
- **کاربر عادی (User):** امکان ثبت آگهی، ثبت پیشنهاد خرید و مشاهده اعلانات.
- **ناظر (Moderator):** دسترسی به صف نظارت آگهی‌ها و صف بررسی احراز هویت.
- **مدیر ارشد (Admin):** دسترسی به آمار، کلیدهای ویژگی و لاگ رویدادها.

---

## 🧪 آزمون‌های واحد (Unit Tests)

برای اجرای آزمون‌های واحد سبک (Vitest) مربوط به توابع منطق تجاری (پارس ارقام، الگوریتم‌های اعتبارسنجی کد ملی/صیادی، محاسبات قیمت‌گذاری هوشمند و سطوح دسترسی استور Auth):

```bash
bun run test
```

جهت اجرای آزمون‌ها در حالت مشاهده تغییرات (Watch mode):

```bash
bun run test:watch
```

> **نکته:** حالت شبیه‌ساز درون برنامه‌ای (Mock Mode / Simulator) صرفاً برای دموی فرانت‌اند در محیط AI Studio و تست‌های دستی سناریوهاست و جایگزین آزمون‌های اتوماتیک API یا قرارداد با بک‌اند واقعی نمی‌باشد.

