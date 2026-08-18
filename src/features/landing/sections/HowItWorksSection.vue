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
    decorPattern="grid"
    decorIntensity="low"
  >
    <!-- 6 Steps Grid with Flow Connectors -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      <LandingSurfaceCard
        v-for="(step, index) in content.steps"
        :key="step.number"
        :hoverable="true"
        :glass="true"
        :highlight="step.number === 6"
        class="justify-between relative z-10"
      >
        <!-- Step Header: Number Badge & Optional Tag -->
        <div class="flex items-center justify-between mb-4">
          <LandingIconBadge variant="emerald" size="md">
            {{ toPersianDigits(step.number) }}
          </LandingIconBadge>

          <!-- Step flow connector hint (RTL) -->
          <span
            v-if="index % 3 !== 2 && index < 5"
            class="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500/40"
            aria-hidden="true"
          >
            <span class="w-6 h-px bg-emerald-500/30 border-t border-dashed border-emerald-400/40"></span>
          </span>

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
