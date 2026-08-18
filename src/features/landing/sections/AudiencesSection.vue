<script setup lang="ts">
import { landingContent } from '../content/landingContent';

const content = landingContent.audiences;
</script>

<template>
  <section
    id="audiences"
    data-testid="landing-section-audiences"
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

      <!-- 2 Audiences Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <!-- Holders Card (Right in RTL) -->
        <div class="flex flex-col rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-6 sm:p-8">
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.holders.tag }}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-[var(--theme-text-primary)] mb-3">
            {{ content.holders.title }}
          </h3>

          <p class="text-sm leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.holders.description }}
          </p>

          <ul class="space-y-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-4 mt-auto">
            <li v-for="(point, idx) in content.holders.points" :key="idx" class="flex items-start gap-2.5">
              <span class="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>

        <!-- Investors Card (Left in RTL) -->
        <div class="flex flex-col rounded-2xl border border-[var(--theme-border-subtle)] bg-[var(--theme-bg)] p-6 sm:p-8">
          <div class="inline-flex items-center gap-2 mb-4">
            <span class="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
              {{ content.investors.tag }}
            </span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-[var(--theme-text-primary)] mb-3">
            {{ content.investors.title }}
          </h3>

          <p class="text-sm leading-relaxed text-[var(--theme-text-secondary)] mb-6">
            {{ content.investors.description }}
          </p>

          <ul class="space-y-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)] border-t border-[var(--theme-border)] pt-4 mt-auto">
            <li v-for="(point, idx) in content.investors.points" :key="idx" class="flex items-start gap-2.5">
              <span class="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
