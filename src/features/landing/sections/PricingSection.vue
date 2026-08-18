<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.pricing;
</script>

<template>
  <section
    id="pricing"
    data-testid="landing-section-pricing"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)]">
          {{ content.title }}
        </h2>
        <p class="mt-3 text-sm sm:text-base text-[var(--theme-text-secondary)]">
          {{ content.subtitle }}
        </p>

        <!-- Prominent No-Fee Disclaimer -->
        <div class="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-300">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ content.disclaimer }}</span>
        </div>
      </div>

      <!-- 3 Revenue Model Cards (No numbers) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="model in content.models"
          :key="model.id"
          class="flex flex-col rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6"
        >
          <div class="inline-flex items-center gap-2 mb-3">
            <span class="rounded-md bg-[var(--theme-surface-muted)] border border-[var(--theme-border-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--theme-text-muted)]">
              {{ content.modelTag }}
            </span>
          </div>

          <h3 class="text-base font-bold text-[var(--theme-text-primary)] mb-2">
            {{ model.title }}
          </h3>

          <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)]">
            {{ model.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
