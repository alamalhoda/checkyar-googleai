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
    <!-- Timeline Container (Vertical on Mobile, 2-Row Horizontal Flow on Desktop) -->
    <div class="relative max-w-6xl mx-auto">
      <!-- Mobile Vertical Connecting Spine -->
      <div
        class="lg:hidden absolute top-6 bottom-6 right-7 sm:right-9 w-0.5 bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-emerald-500/40 pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- 6 Steps Grid with Flow Connectors -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        <LandingSurfaceCard
          v-for="(step, index) in content.steps"
          :key="step.number"
          :data-testid="`landing-step-${step.number}`"
          :hoverable="true"
          :glass="true"
          :highlight="step.number === 6"
          :gradientBorder="step.number === 6"
          class="justify-between relative z-10 transition-all duration-200"
        >
          <!-- Step Header: Number Badge & Timeline Connector Node -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <LandingIconBadge variant="emerald" size="md">
                {{ toPersianDigits(step.number) }}
              </LandingIconBadge>
              <span class="text-xs font-semibold text-emerald-400/80">
                مرحله {{ toPersianDigits(step.number) }}
              </span>
            </div>

            <!-- Horizontal flow connector hint on desktop (RTL: steps 1,2 and 4,5 connect to next) -->
            <span
              v-if="(index % 3 !== 2) && index < 5"
              class="hidden lg:flex items-center gap-1 text-[11px] font-mono text-emerald-500/40"
              aria-hidden="true"
            >
              <span class="w-8 h-px bg-gradient-to-l from-emerald-400/40 to-transparent"></span>
              <svg class="w-3 h-3 text-emerald-400/60 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </span>

            <span
              v-if="step.number === 6"
              class="rounded-full bg-emerald-500/15 border border-emerald-500/35 px-3 py-0.5 text-xs font-bold text-emerald-300 shadow-sm"
            >
              {{ content.directSettlementTag }}
            </span>
          </div>

          <!-- Step Title & Description -->
          <div class="flex-1 flex flex-col justify-start">
            <h3 class="text-base sm:text-lg font-bold text-[var(--theme-text-primary)] mb-2.5">
              {{ step.title }}
            </h3>

            <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)]">
              {{ step.description }}
            </p>
          </div>
        </LandingSurfaceCard>
      </div>
    </div>
  </LandingSectionShell>
</template>
