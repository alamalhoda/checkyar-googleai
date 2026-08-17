<script setup lang="ts">
import { onMounted } from 'vue';
import LandingHeader from './LandingHeader.vue';
import LandingFooter from './LandingFooter.vue';

const DOCUMENT_TITLE = 'چکیار | سکوی دیجیتال کشف و اتصال در بازار نقدشوندگی چکهای مدتدار';
const META_DESCRIPTION = 'چکیار سکوی دیجیتال کشف و اتصال در بازار نقدشوندگی چکهای مدتدار است؛ واسط فناورانه، نه نهاد مالی.';

onMounted(() => {
  document.title = DOCUMENT_TITLE;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', META_DESCRIPTION);
});
</script>

<template>
  <div
    id="landing-page"
    data-testid="landing-page"
    data-theme="dark"
    class="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-primary)] flex flex-col font-['Vazirmatn',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300"
  >
    <LandingHeader />

    <main class="flex-1 w-full flex flex-col">
      <!-- 1. Hero Section -->
      <section
        id="hero"
        data-testid="landing-section-hero"
        class="w-full py-16 sm:py-24 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)]">
              معرفی سکوی دیجیتال چک‌یار
            </h1>
            <p class="mt-4 text-sm sm:text-base text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              [بخش معرفی اصلی و اتصال بازار نقدشوندگی چک‌های صیادی]
            </p>
          </div>
        </div>
      </section>

      <!-- 2. Problem and Solution Section -->
      <section
        id="problem-and-solution"
        data-testid="landing-section-problem-and-solution"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              مسئله و راهکار
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [تحلیل چالش‌های نقدشوندگی بازار چک و راهکار فناورانه پلتفرم]
            </p>
          </div>
        </div>
      </section>

      <!-- 3. How It Works Section -->
      <section
        id="how-it-works"
        data-testid="landing-section-how-it-works"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              نحوه کار سامانه
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [مراحل ثبت، اعتبارسنجی صیادی، کشف قیمت و اتصال طرفین]
            </p>
          </div>
        </div>
      </section>

      <!-- 4. Audiences Section -->
      <section
        id="audiences"
        data-testid="landing-section-audiences"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              مخاطبان و ذی‌نفعان
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [دارندگان چک، خریداران و سرمایه‌گذاران، کسب‌وکارهای زنجیره تامین]
            </p>
          </div>
        </div>
      </section>

      <!-- 5. Live Listings Section -->
      <section
        id="live-listings"
        data-testid="landing-section-live-listings"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              تابلوی آگهی‌های زنده
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [نمای زنده از آخرین آگهی‌های تاییدشده و فرصت‌های معاملاتی]
            </p>
          </div>
        </div>
      </section>

      <!-- 6. Responsibility Boundary Section -->
      <section
        id="responsibility-boundary"
        data-testid="landing-section-responsibility-boundary"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              مرز مسئولیت‌ها و عدم ماهیت مالی
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [شفاف‌سازی جایگاه فناورانه سکو، سلب مسئولیت اعتباری و حدود قانونی]
            </p>
          </div>
        </div>
      </section>

      <!-- 7. Product Status Section -->
      <section
        id="product-status"
        data-testid="landing-section-product-status"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              وضعیت توسعه و دسترسی محصول
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [نقشه راه، فاز عملیاتی آزمایشی و وضعیت سرویس‌های فعال]
            </p>
          </div>
        </div>
      </section>

      <!-- 8. Pricing Section -->
      <section
        id="pricing"
        data-testid="landing-section-pricing"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              کارمزدها و تعرفه خدمات
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [مدل کارمزد اتصال، استعلامات و خدمات تکمیلی]
            </p>
          </div>
        </div>
      </section>

      <!-- 9. FAQ Section -->
      <section
        id="faq"
        data-testid="landing-section-faq"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              پرسش‌های متداول
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [پاسخ به سوالات پرتکرار پیرامون امنیت، فرآیند انتقال و الزامات سامانه صیاد]
            </p>
          </div>
        </div>
      </section>

      <!-- 10. Contact Us Section -->
      <section
        id="contact-us"
        data-testid="landing-section-contact-us"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              تماس با ما
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [کانال‌های ارتباطی، پشتیبانی کاربری و اطلاعات تماس]
            </p>
          </div>
        </div>
      </section>

      <!-- 11. Lead Capture Form Section -->
      <section
        id="lead-capture-form"
        data-testid="landing-section-lead-capture-form"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              درخواست مشاوره و ثبت تقاضا
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [فرم جذب سرنخ و دریافت مشاوره اختصاصی]
            </p>
          </div>
        </div>
      </section>

      <!-- 12. Investing in Cheque Yar Section -->
      <section
        id="investing-in-cheque-yar"
        data-testid="landing-section-investing-in-cheque-yar"
        class="w-full py-16 bg-[var(--theme-surface)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] text-center">
              سرمایه‌گذاری در توسعه چک‌یار
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] text-center max-w-2xl mx-auto">
              [فرصت‌های همکاری راهبردی و سرمایه‌گذاری در توسعه پلتفرم]
            </p>
          </div>
        </div>
      </section>
    </main>

    <LandingFooter />
  </div>
</template>
