<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';
import LandingIconBadge from '../components/LandingIconBadge.vue';

const content = landingContent.responsibilityBoundary;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="responsibility-boundary"
    testId="landing-section-responsibility-boundary"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="content.tag || visual.sectionEyebrows.responsibilityBoundary"
    variant="elevated"
    decorPattern="mesh"
    decorIntensity="medium"
    decorVector="abstractShield"
    decorVectorPosition="top-left"
  >
    <!-- 4 Distinct Regulatory Boundary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
      <LandingSurfaceCard
        v-for="(statement, index) in content.statements"
        :key="index"
        :hoverable="true"
        :glass="true"
        class="!p-5 flex-row items-center gap-4"
      >
        <LandingIconBadge variant="emerald" size="md">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </LandingIconBadge>
        <span class="text-sm sm:text-base font-bold text-[var(--theme-text-primary)] leading-snug">
          {{ statement }}
        </span>
      </LandingSurfaceCard>
    </div>

    <!-- Closing Sentence (Prominent Glass Banner) -->
    <div class="mx-auto max-w-2xl rounded-2xl border border-emerald-500/35 bg-emerald-500/10 backdrop-blur-md p-6 sm:p-8 text-center shadow-[0_16px_36px_-6px_rgba(16,185,129,0.20)] relative overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500"></div>
      <p class="text-base sm:text-xl font-black text-emerald-300">
        {{ content.closingSentence }}
      </p>
    </div>
  </LandingSectionShell>
</template>
