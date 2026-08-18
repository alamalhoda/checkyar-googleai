<script setup lang="ts">
import { landingContent } from '../content/landingContent';
import { toPersianDigits } from '../../../utils/persianUtils';

const content = landingContent.howItWorks;
</script>

<template>
  <section
    id="how-it-works"
    data-testid="landing-section-how-it-works"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] scroll-mt-16"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl text-center mb-12">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text-primary)]">
          {{ content.title }}
        </h2>
        <p class="mt-3 text-sm sm:text-base text-[var(--theme-text-secondary)]">
          {{ content.subtitle }}
        </p>
      </div>

      <!-- 6 Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="step in content.steps"
          :key="step.number"
          class="relative flex flex-col rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 transition-colors hover:border-emerald-500/30"
        >
          <!-- Step Number Pill -->
          <div class="flex items-center justify-between mb-4">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
              {{ toPersianDigits(step.number) }}
            </span>
            <span v-if="step.number === 6" class="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-300">
              تسویه مستقیم
            </span>
          </div>

          <h3 class="text-base font-bold text-[var(--theme-text-primary)] mb-2">
            {{ step.title }}
          </h3>

          <p class="text-xs sm:text-sm leading-relaxed text-[var(--theme-text-secondary)]">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
