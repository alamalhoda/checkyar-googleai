<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { landingContent } from '../content/landingContent';

const router = useRouter();
const authStore = useAuthStore();
const content = landingContent.hero;

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
    class="relative w-full py-16 sm:py-24 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] overflow-hidden"
  >
    <!-- Background Glow Accent (Subtle Emerald) -->
    <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 blur-3xl">
      <div class="h-64 w-96 rounded-full bg-emerald-500/20"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <!-- Pilot Status Badge -->
        <div class="inline-flex items-center justify-center mb-6">
          <span
            data-testid="landing-hero-pilot-badge"
            class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            {{ content.badge }}
          </span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--theme-text-primary)] leading-tight sm:leading-tight">
          <span class="text-emerald-400">{{ content.productName }}</span>
          <span class="text-[var(--theme-border-subtle)] mx-2 font-normal">|</span>
          <span class="text-[var(--theme-text-primary)] text-2xl sm:text-3xl md:text-4xl block mt-2 sm:inline sm:mt-0 font-bold">{{ content.oneLiner }}</span>
        </h1>

        <!-- Supporting Blurb -->
        <p class="mt-6 text-sm sm:text-base leading-relaxed text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
          {{ content.description }}
        </p>

        <!-- CTAs -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            data-testid="landing-hero-primary-cta"
            @click="handlePrimaryClick"
            class="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 font-medium text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-sm sm:text-base"
          >
            {{ authStore.isAuthenticated ? content.authenticated.primaryCta : content.guest.primaryCta }}
          </button>

          <button
            type="button"
            data-testid="landing-hero-secondary-cta"
            @click="handleSecondaryClick"
            class="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl border border-[var(--theme-border-subtle)] bg-[var(--theme-surface)] font-medium text-[var(--theme-text-primary)] hover:border-emerald-500/40 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-sm sm:text-base"
          >
            {{ authStore.isAuthenticated ? content.authenticated.secondaryCta : content.guest.secondaryCta }}
          </button>
        </div>

        <!-- Guest-only Tertiary Text Link -->
        <div v-if="!authStore.isAuthenticated" class="mt-4">
          <button
            type="button"
            @click="handleTertiaryClick"
            class="text-xs text-[var(--theme-text-muted)] hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-2 py-1"
          >
            {{ content.guest.tertiaryLink }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
