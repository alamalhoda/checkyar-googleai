<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingSurfaceCard from '../components/LandingSurfaceCard.vue';
import LandingIconBadge from '../components/LandingIconBadge.vue';

const content = landingContent.audiences;
const visual = landingContent.visual;
</script>

<template>
  <LandingSectionShell
    id="audiences"
    testId="landing-section-audiences"
    :title="content.title"
    :subtitle="content.subtitle"
    :eyebrow="visual.sectionEyebrows.audiences"
    variant="muted"
  >
    <!-- 2 Audiences Columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
      <!-- Holders Card (Right in RTL) -->
      <LandingSurfaceCard bg="base" :hoverable="true" class="justify-between">
        <div>
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.holders.tag }}
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-3.5">
            {{ content.holders.title }}
          </h3>

          <p class="text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.holders.description }}
          </p>
        </div>

        <ul class="space-y-3 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-5 mt-auto">
          <li v-for="(point, idx) in content.holders.points" :key="idx" class="flex items-start gap-3">
            <LandingIconBadge variant="emerald" size="sm" class="mt-0.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </LandingIconBadge>
            <span class="leading-snug pt-0.5">{{ point }}</span>
          </li>
        </ul>
      </LandingSurfaceCard>

      <!-- Investors Card (Left in RTL) -->
      <LandingSurfaceCard bg="base" :hoverable="true" class="justify-between">
        <div>
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.investors.tag }}
            </span>
          </div>

          <h3 class="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] mb-3.5">
            {{ content.investors.title }}
          </h3>

          <p class="text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.investors.description }}
          </p>
        </div>

        <ul class="space-y-3 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-5 mt-auto">
          <li v-for="(point, idx) in content.investors.points" :key="idx" class="flex items-start gap-3">
            <LandingIconBadge variant="emerald" size="sm" class="mt-0.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </LandingIconBadge>
            <span class="leading-snug pt-0.5">{{ point }}</span>
          </li>
        </ul>
      </LandingSurfaceCard>
    </div>
  </LandingSectionShell>
</template>
