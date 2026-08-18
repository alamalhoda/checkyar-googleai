<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';

const content = landingContent.investing;
const visual = landingContent.visual;

function handleCtaClick() {
  const target = document.querySelector('#contact-us');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <LandingSectionShell
    id="investing-in-cheque-yar"
    testId="landing-section-investing-in-cheque-yar"
    :title="content.title"
    :eyebrow="visual.sectionEyebrows.investing"
    variant="muted"
    :narrow="true"
  >
    <LandingSurfaceCard bg="base" :accentTop="true" class="p-8 sm:p-12 text-center shadow-xl shadow-black/30 items-center">
      <!-- Description -->
      <p class="text-sm sm:text-base leading-[1.7] text-[var(--theme-text-secondary)] max-w-xl mx-auto mb-8">
        {{ content.description }}
      </p>

      <!-- CTA Button -->
      <div>
        <button
          type="button"
          data-testid="landing-investing-cta"
          @click="handleCtaClick"
          class="inline-flex items-center justify-center min-h-[46px] px-8 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 text-sm sm:text-base cursor-pointer shadow-sm"
        >
          {{ content.ctaLabel }}
        </button>
      </div>
    </LandingSurfaceCard>
  </LandingSectionShell>
</template>
