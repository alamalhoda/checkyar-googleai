<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.problemSolution;
</script>

<template>
  <section
    id="problem-and-solution"
    data-testid="landing-section-problem-and-solution"
    class="w-full py-16 sm:py-20 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]"
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

      <!-- Problem & Solution Cards (2 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <!-- Problem Card -->
        <div class="flex flex-col rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-6 sm:p-8">
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--theme-text-muted)]">
              {{ content.problem.tag }}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-[var(--theme-text-primary)] mb-3">
            {{ content.problem.title }}
          </h3>

          <p class="text-sm leading-relaxed text-[var(--theme-text-secondary)] mb-6 flex-1">
            {{ content.problem.description }}
          </p>

          <ul class="space-y-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-4">
            <li v-for="(point, idx) in content.problem.points" :key="idx" class="flex items-start gap-2.5">
              <span class="text-[var(--theme-text-muted)] font-bold mt-0.5">&times;</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <!-- Solution Card -->
        <div class="flex flex-col rounded-2xl border border-emerald-500/30 bg-[var(--theme-bg)] p-6 sm:p-8 shadow-sm shadow-emerald-950/20">
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.solution.tag }}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-[var(--theme-text-primary)] mb-3">
            {{ content.solution.title }}
          </h3>

          <p class="text-sm leading-relaxed text-[var(--theme-text-secondary)] mb-6 flex-1">
            {{ content.solution.description }}
          </p>

          <ul class="space-y-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-4">
            <li v-for="(point, idx) in content.solution.points" :key="idx" class="flex items-start gap-2.5">
              <span class="text-emerald-400 font-bold mt-0.5">&check;</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
