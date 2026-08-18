<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';

const content = landingContent.productStatus;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="product-status"
    testId="landing-section-product-status"
    :title="content.title"
    :eyebrow="visual.sectionEyebrows.productStatus"
    variant="muted"
    :narrow="true"
    decorPattern="dots"
    decorIntensity="medium"
  >
    <LandingSurfaceCard bg="base" :glass="true" :gradientBorder="true" :accentTop="true" class="text-center p-8 sm:p-12 items-center">
      <!-- Status String Badge / Banner -->
      <div class="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm px-4 sm:px-5 py-2 text-sm sm:text-base font-bold text-emerald-300 mb-6 shadow-sm">
        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>{{ content.statusText }}</span>
      </div>

      <!-- Description Paragraph -->
      <p class="text-sm sm:text-base leading-[1.7] text-[var(--theme-text-secondary)] max-w-xl mx-auto">
        {{ content.description }}
      </p>
    </LandingSurfaceCard>
  </LandingSectionShell>
</template>
