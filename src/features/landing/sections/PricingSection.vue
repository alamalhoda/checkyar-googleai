<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';

const content = landingContent.pricing;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="pricing"
    testId="landing-section-pricing"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="visual.sectionEyebrows.pricing"
    variant="default"
  >
    <!-- Prominent No-Fee Disclaimer -->
    <div class="mb-10 text-center">
      <div class="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-300 shadow-sm">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ content.disclaimer }}</span>
      </div>
    </div>

    <!-- 3 Revenue Model Cards (No numbers) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LandingSurfaceCard
        v-for="model in content.models"
        :key="model.id"
        :hoverable="true"
        class="justify-between"
      >
        <div>
          <div class="inline-flex items-center gap-2 mb-3.5">
            <span class="rounded-md bg-[var(--theme-surface-muted)] border border-[var(--theme-border-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--theme-text-muted)]">
              {{ content.modelTag }}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-[var(--theme-text-primary)] mb-2.5">
            {{ model.title }}
          </h3>

          <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)]">
            {{ model.description }}
          </p>
        </div>
      </LandingSurfaceCard>
    </div>
  </LandingSectionShell>
</template>
