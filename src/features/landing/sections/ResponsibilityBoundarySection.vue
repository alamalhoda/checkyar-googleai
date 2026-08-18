<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.responsibilityBoundary;
</script>

<template>
  <section
    id="responsibility-boundary"
    data-testid="landing-section-responsibility-boundary"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] scroll-mt-16"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-12">
        <div class="inline-flex items-center justify-center mb-3">
          <span class="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
            مرز مسئولیت رگولاتوری
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)]">
          {{ content.title }}
        </h2>
        <p class="mt-3 text-sm sm:text-base text-[var(--theme-text-secondary)]">
          {{ content.subtitle }}
        </p>
      </div>

      <!-- 4 Distinct Regulatory Boundary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div
          v-for="(statement, index) in content.statements"
          :key="index"
          class="flex items-center gap-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 transition-colors hover:border-amber-500/30"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <span class="text-sm font-bold text-[var(--theme-text-primary)] leading-snug">
            {{ statement }}
          </span>
        </div>
      </div>

      <!-- Closing Sentence (Separate, Prominent Banner) -->
      <div class="mx-auto max-w-2xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center shadow-sm shadow-emerald-950/20">
        <p class="text-base sm:text-lg font-bold text-emerald-300">
          {{ content.closingSentence }}
        </p>
      </div>
    </div>
  </section>
</template>
