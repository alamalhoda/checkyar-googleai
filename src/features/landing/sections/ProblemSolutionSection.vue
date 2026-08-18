<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';
import LandingIconBadge from '../components/LandingIconBadge.vue';

const content = landingContent.problemSolution;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="problem-and-solution"
    testId="landing-section-problem-and-solution"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="visual.sectionEyebrows.problemSolution"
    variant="muted"
    decorPattern="mesh"
    decorIntensity="low"
    decorVector="gridWave"
    decorVectorPosition="top-left"
  >
    <!-- Problem & Solution Cards (2 Columns) with Static Transition Indicator -->
    <div class="relative grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
      <!-- Ambient Center Flow Arrow (Desktop Only) -->
      <div
        class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--theme-surface)]/90 border border-emerald-500/30 items-center justify-center text-emerald-400 shadow-md backdrop-blur-md pointer-events-none"
        aria-hidden="true"
      >
        <svg class="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      <!-- Problem Card -->
      <LandingSurfaceCard bg="base" :glass="true" :hoverable="true" class="justify-between">
        <div>
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-[var(--theme-surface-muted)] border border-white/5 px-2.5 py-1 text-xs font-medium text-[var(--theme-text-muted)]">
              {{ content.problem.tag }}
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-3.5">
            {{ content.problem.title }}
          </h3>

          <p class="text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.problem.description }}
          </p>
        </div>

        <ul class="space-y-3 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-5 mt-4">
          <li v-for="(point, idx) in content.problem.points" :key="idx" class="flex items-start gap-3">
            <LandingIconBadge variant="muted" size="sm" class="mt-0.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </LandingIconBadge>
            <span class="leading-snug pt-0.5">{{ point }}</span>
          </li>
        </ul>
      </LandingSurfaceCard>

      <!-- Solution Card (Highlighted with Gradient Top Accent) -->
      <LandingSurfaceCard bg="base" :glass="true" :highlight="true" :accentTop="true" :hoverable="true" class="justify-between">
        <div>
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.solution.tag }}
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-3.5">
            {{ content.solution.title }}
          </h3>

          <p class="text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.solution.description }}
          </p>
        </div>

        <ul class="space-y-3 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-5 mt-4">
          <li v-for="(point, idx) in content.solution.points" :key="idx" class="flex items-start gap-3">
            <LandingIconBadge variant="emerald" size="sm" class="mt-0.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </LandingIconBadge>
            <span class="leading-snug pt-0.5 text-[var(--theme-text-primary)] font-medium">{{ point }}</span>
          </li>
        </ul>
      </LandingSurfaceCard>
    </div>
  </LandingSectionShell>
</template>
