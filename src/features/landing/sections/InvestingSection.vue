<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.investing;

function handleCtaClick() {
  const target = document.querySelector('#contact-us');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <section
    id="investing-in-cheque-yar"
    data-testid="landing-section-investing-in-cheque-yar"
    class="w-full py-16 sm:py-20 bg-[var(--theme-surface)]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12 text-center shadow-lg shadow-black/20">
        <!-- Title -->
        <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-4">
          {{ content.title }}
        </h2>

        <!-- Description -->
        <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)] max-w-xl mx-auto mb-8">
          {{ content.description }}
        </p>

        <!-- CTA Button -->
        <div>
          <button
            type="button"
            data-testid="landing-investing-cta"
            @click="handleCtaClick"
            class="min-h-[44px] px-8 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 font-medium text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-sm sm:text-base"
          >
            {{ content.ctaLabel }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
