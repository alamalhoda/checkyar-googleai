<script setup lang="ts">
import { onMounted } from 'vue';
import LandingHeader from './LandingHeader.vue';
import LandingFooter from './LandingFooter.vue';
import { DOCUMENT_TITLE, META_DESCRIPTION } from './constants';

import HeroSection from './sections/HeroSection.vue';
import ProblemSolutionSection from './sections/ProblemSolutionSection.vue';
import HowItWorksSection from './sections/HowItWorksSection.vue';
import AudiencesSection from './sections/AudiencesSection.vue';
import LiveListingsSection from './sections/LiveListingsSection.vue';
import ResponsibilityBoundarySection from './sections/ResponsibilityBoundarySection.vue';
import ProductStatusSection from './sections/ProductStatusSection.vue';
import PricingSection from './sections/PricingSection.vue';
import FaqSection from './sections/FaqSection.vue';
import ContactSection from './sections/ContactSection.vue';
import LeadCaptureSection from './sections/LeadCaptureSection.vue';
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

      <!-- 5. Live Listings Section -->
      <LiveListingsSection />

      <!-- 6. Responsibility Boundary Section -->
      <ResponsibilityBoundarySection />

      <!-- 7. Product Status Section -->
      <ProductStatusSection />

      <!-- 8. Pricing Section -->
      <PricingSection />

      <!-- 9. FAQ Section -->
      <FaqSection />

      <!-- 10. Contact Us Section -->
      <ContactSection />

      <!-- 11. Lead Capture Form Section -->
      <LeadCaptureSection />

      <!-- 12. Investing in Cheque Yar Section -->
      <InvestingSection />
    </main>

    <LandingFooter />
  </div>
</template>
