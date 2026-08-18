<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { landingContent } from '../content/landingContent';

const router = useRouter();
const authStore = useAuthStore();
const content = landingContent.hero;
const visual = landingContent.visual;

function handlePrimaryClick() {
  if (authStore.isAuthenticated) {
    router.push('/marketplace');
  } else {
    router.push('/register');
  }
}

function handleSecondaryClick() {
  if (authStore.isAuthenticated) {
    const target = document.querySelector('#live-listings');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    router.push('/login');
  }
}

function handleTertiaryClick() {
  router.push('/login');
}
</script>

<template>
  <section
    id="hero"
    data-testid="landing-section-hero"
    class="relative w-full py-16 sm:py-24 lg:py-28 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] overflow-hidden"
  >
    <!-- Background Dot Pattern (CSS opacity <= 0.04) -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.035]"
      style="background-image: radial-gradient(var(--theme-primary) 1px, transparent 1px); background-size: 24px 24px;"
    ></div>

    <!-- Background Emerald Glow Accent -->
    <div class="pointer-events-none absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"></div>
    <div class="pointer-events-none absolute top-1/2 left-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Right Column (Text & CTAs in RTL) -->
        <div class="lg:col-span-7 flex flex-col text-right">
          <!-- Top Row: Brand Mark & Pilot Badge -->
          <div class="flex flex-wrap items-center gap-3.5 mb-6">
            <!-- Brand Mark (48x48 rounded-2xl with «چک») -->
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xl shadow-sm">
              چک
            </div>

            <!-- Pilot Status Badge -->
            <span
              data-testid="landing-hero-pilot-badge"
              class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {{ content.badge }}
            </span>
          </div>

          <!-- Headline Block with RTL Accent Bar -->
          <div class="border-r-4 border-emerald-500 pr-4 sm:pr-5">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--theme-text-primary)] leading-[1.25] sm:leading-[1.25]">
              <span class="text-emerald-400">{{ content.productName }}</span>
              <span class="text-[var(--theme-border-subtle)] mx-2 font-light">|</span>
              <span class="text-[var(--theme-text-primary)] text-2xl sm:text-3xl lg:text-4xl font-bold block sm:inline mt-2 sm:mt-0">
                {{ content.oneLiner }}
              </span>
            </h1>
          </div>

          <!-- Description -->
          <p class="mt-6 text-base sm:text-lg leading-[1.7] text-[var(--theme-text-secondary)] max-w-2xl">
            {{ content.description }}
          </p>

          <!-- CTAs -->
          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              data-testid="landing-hero-primary-cta"
              @click="handlePrimaryClick"
              class="inline-flex items-center justify-center min-h-[46px] px-7 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm sm:text-base shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
            >
              {{ authStore.isAuthenticated ? content.authenticated.primaryCta : content.guest.primaryCta }}
            </button>

            <button
              type="button"
              data-testid="landing-hero-secondary-cta"
              @click="handleSecondaryClick"
              class="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl border border-[var(--theme-border-subtle)] bg-[var(--theme-surface)] text-[var(--theme-text-primary)] font-medium text-sm sm:text-base hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-[var(--theme-surface-muted)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
            >
              {{ authStore.isAuthenticated ? content.authenticated.secondaryCta : content.guest.secondaryCta }}
            </button>
          </div>

          <!-- Guest-only Tertiary Text Link -->
          <div v-if="!authStore.isAuthenticated" class="mt-4">
            <button
              type="button"
              @click="handleTertiaryClick"
              class="text-xs text-[var(--theme-text-muted)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1 py-0.5 cursor-pointer"
            >
              {{ content.guest.tertiaryLink }}
            </button>
          </div>
        </div>

        <!-- Left Column (Decorative Schematic UI Preview in RTL) -->
        <div class="lg:col-span-5 flex flex-col items-center">
          <div class="w-full max-w-md rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <!-- Subtle Top Accent Line -->
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>

            <!-- Schematic Window Header -->
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-[var(--theme-border-subtle)]">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 rounded-full bg-emerald-500/40"></div>
                <div class="h-3 w-3 rounded-full bg-[var(--theme-border-subtle)]"></div>
                <div class="h-3 w-3 rounded-full bg-[var(--theme-border-subtle)]"></div>
              </div>
              <span class="text-[11px] text-[var(--theme-text-muted)] font-mono">chequeyar.ir/preview</span>
            </div>

            <!-- Schematic Content Mock (Abstract / Static Blocks) -->
            <div class="space-y-3.5 select-none" aria-hidden="true">
              <!-- Mock Search / Filter Bar -->
              <div class="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border-subtle)]">
                <div class="h-3 w-28 rounded bg-[var(--theme-border-subtle)]/70"></div>
                <div class="h-5 w-16 rounded bg-emerald-500/15 border border-emerald-500/30"></div>
              </div>

              <!-- Schematic Card 1 -->
              <div class="p-3.5 rounded-xl bg-[var(--theme-bg)] border border-emerald-500/25 space-y-2.5">
                <div class="flex items-center justify-between">
                  <div class="h-3.5 w-24 rounded bg-[var(--theme-text-secondary)]/40"></div>
                  <div class="h-4 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
                </div>
                <div class="flex items-center justify-between pt-1">
                  <div class="h-3 w-16 rounded bg-[var(--theme-border-subtle)]"></div>
                  <div class="h-3 w-20 rounded bg-[var(--theme-border-subtle)]"></div>
                </div>
              </div>

              <!-- Schematic Card 2 -->
              <div class="p-3.5 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] space-y-2.5 opacity-75">
                <div class="flex items-center justify-between">
                  <div class="h-3.5 w-20 rounded bg-[var(--theme-text-secondary)]/30"></div>
                  <div class="h-4 w-12 rounded-full bg-[var(--theme-surface-muted)]"></div>
                </div>
                <div class="flex items-center justify-between pt-1">
                  <div class="h-3 w-14 rounded bg-[var(--theme-border-subtle)]"></div>
                  <div class="h-3 w-18 rounded bg-[var(--theme-border-subtle)]"></div>
                </div>
              </div>

              <!-- Schematic Stat Row -->
              <div class="grid grid-cols-2 gap-2 pt-1">
                <div class="p-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-center">
                  <div class="h-2.5 w-12 mx-auto rounded bg-[var(--theme-text-muted)]/50 mb-1.5"></div>
                  <div class="h-3.5 w-16 mx-auto rounded bg-emerald-400/40"></div>
                </div>
                <div class="p-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-center">
                  <div class="h-2.5 w-12 mx-auto rounded bg-[var(--theme-text-muted)]/50 mb-1.5"></div>
                  <div class="h-3.5 w-16 mx-auto rounded bg-[var(--theme-text-secondary)]/40"></div>
                </div>
              </div>
            </div>

            <!-- Preview Caption -->
            <div class="mt-4 pt-3 border-t border-[var(--theme-border-subtle)] text-center">
              <span class="text-[11px] text-[var(--theme-text-muted)] font-medium">
                {{ visual.heroPreviewCaption }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
