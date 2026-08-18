<script setup lang="ts">
import { landingContent } from '../content/landingContent';

function scrollToBoundary() {
  const el = document.getElementById('responsibility-boundary');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <aside
    id="landing-trust-strip"
    data-testid="landing-trust-strip"
    aria-label="خلاصه مرز مسئولیت‌ها و انطباق رگولاتوری"
    class="w-full border-y border-white/10 bg-[var(--theme-surface)]/60 backdrop-blur-md relative z-20 py-3 sm:py-4 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
      <!-- Scannable 4 Trust Items -->
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2.5 sm:gap-x-8 text-xs sm:text-sm font-medium text-[var(--theme-text)]">
        <!-- Item 1: بدون جابه‌جایی وجه -->
        <div
          data-testid="landing-trust-item-1"
          class="flex items-center gap-2"
        >
          <div class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <span>{{ landingContent.trustStrip.items[0] }}</span>
        </div>

        <!-- Item 2: بدون نگهداری چک -->
        <div
          data-testid="landing-trust-item-2"
          class="flex items-center gap-2"
        >
          <div class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span>{{ landingContent.trustStrip.items[1] }}</span>
        </div>

        <!-- Item 3: بدون ضمانت وصول -->
        <div
          data-testid="landing-trust-item-3"
          class="flex items-center gap-2"
        >
          <div class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span>{{ landingContent.trustStrip.items[2] }}</span>
        </div>

        <!-- Item 4: نرخ پیشنهادی غیرالزام‌آور -->
        <div
          data-testid="landing-trust-item-4"
          class="flex items-center gap-2"
        >
          <div class="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <span>{{ landingContent.trustStrip.items[3] }}</span>
        </div>
      </div>

      <!-- Link to Responsibility Section -->
      <a
        href="#responsibility-boundary"
        data-testid="landing-trust-details-link"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition duration-200 shrink-0 cursor-pointer"
        @click.prevent="scrollToBoundary"
      >
        <span>{{ landingContent.trustStrip.detailsLink }}</span>
        <svg class="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  </aside>
</template>
