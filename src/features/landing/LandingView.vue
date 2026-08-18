<script setup lang="ts">
import { onMounted } from 'vue';
import LandingHeader from './LandingHeader.vue';
import LandingFooter from './LandingFooter.vue';
import { DOCUMENT_TITLE, META_DESCRIPTION } from './constants';

import HeroSection from './sections/HeroSection.vue';
import ProblemSolutionSection from './sections/ProblemSolutionSection.vue';
import HowItWorksSection from './sections/HowItWorksSection.vue';
import AudiencesSection from './sections/AudiencesSection.vue';
import ResponsibilityBoundarySection from './sections/ResponsibilityBoundarySection.vue';
import ProductStatusSection from './sections/ProductStatusSection.vue';
import PricingSection from './sections/PricingSection.vue';
import FaqSection from './sections/FaqSection.vue';
import InvestingSection from './sections/InvestingSection.vue';

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
      <HeroSection />

      <!-- 2. Problem and Solution Section -->
      <ProblemSolutionSection />

      <!-- 3. How It Works Section -->
      <HowItWorksSection />

      <!-- 4. Audiences Section -->
      <AudiencesSection />

      <!-- 5. Live Listings Section (Placeholder) -->
      <section
        id="live-listings"
        data-testid="landing-section-live-listings"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] scroll-mt-16"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">
              تابلوی آگهی‌های زنده
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              [نمای زنده از آخرین آگهی‌های تاییدشده و فرصت‌های معاملاتی]
            </p>
          </div>
        </div>
      </section>

      <!-- 6. Responsibility Boundary Section -->
      <ResponsibilityBoundarySection />

      <!-- 7. Product Status Section -->
      <ProductStatusSection />

      <!-- 8. Pricing Section -->
      <PricingSection />

      <!-- 9. FAQ Section -->
      <FaqSection />

      <!-- 10. Contact Us Section (Placeholder) -->
      <section
        id="contact-us"
        data-testid="landing-section-contact-us"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] scroll-mt-16"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12 text-center">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">
              تماس با ما
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              [کانال‌های ارتباطی، پشتیبانی کاربری و اطلاعات تماس]
            </p>
          </div>
        </div>
      </section>

      <!-- 11. Lead Capture Form Section (Placeholder) -->
      <section
        id="lead-capture-form"
        data-testid="landing-section-lead-capture-form"
        class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center">
            <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">
              درخواست مشاوره و ثبت تقاضا
            </h2>
            <p class="mt-3 text-sm text-[var(--theme-text-muted)] max-w-2xl mx-auto">
              [فرم جذب سرنخ و دریافت مشاوره اختصاصی]
            </p>
          </div>
        </div>
      </section>

      <!-- 12. Investing in Cheque Yar Section -->
      <InvestingSection />
    </main>

    <LandingFooter />
  </div>
</template>
