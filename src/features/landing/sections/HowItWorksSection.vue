<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import { toPersianDigits } from '../../../utils/persianUtils';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';
import LandingIconBadge from '../components/LandingIconBadge.vue';

const content = landingContent.howItWorks;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="how-it-works"
    testId="landing-section-how-it-works"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="visual.sectionEyebrows.howItWorks"
    variant="default"
  >
    <!-- 6 Steps Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      <LandingSurfaceCard
        v-for="step in content.steps"
        :key="step.number"
        :hoverable="true"
        class="justify-between"
      >
        <!-- Step Header: Number Badge & Optional Tag -->
        <div class="flex items-center justify-between mb-4">
          <LandingIconBadge variant="emerald" size="md">
            {{ toPersianDigits(step.number) }}
          </LandingIconBadge>

          <span
            v-if="step.number === 6"
            class="rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-xs font-semibold text-emerald-300"
          >
            {{ content.directSettlementTag }}
          </span>
        </div>

        <!-- Step Title & Description -->
        <div>
          <h3 class="text-base sm:text-lg font-bold text-[var(--theme-text-primary)] mb-2.5">
            {{ step.title }}
          </h3>

          <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)]">
            {{ step.description }}
          </p>
        </div>
      </LandingSurfaceCard>
    </div>
  </LandingSectionShell>
</template>
