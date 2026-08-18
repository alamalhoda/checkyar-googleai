<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.productStatus;
</script>

<template>
  <section
    id="product-status"
    data-testid="landing-section-product-status"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-8 sm:p-12 text-center">
        <!-- Section Title -->
        <h2 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-6">
          {{ content.title }}
        </h2>

        <!-- Status String Badge / Banner -->
        <div class="inline-flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm sm:text-base font-bold text-emerald-300 mb-6">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ content.statusText }}</span>
        </div>

        <!-- Description Paragraph -->
        <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)] max-w-xl mx-auto">
          {{ content.description }}
        </p>
      </div>
    </div>
  </section>
</template>
