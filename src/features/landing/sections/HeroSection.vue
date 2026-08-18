<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { landingContent } from '../content/landingContent';
import LandingDecorLayer from '../components/LandingDecorLayer.vue';
import LandingHeroListingsPreview from '../components/LandingHeroListingsPreview.vue';

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
    class="relative w-full py-16 sm:py-24 lg:py-28 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] overflow-hidden"
  >
    <!-- Background Decor Layer 1: Static Mesh Glows -->
    <div class="pointer-events-none absolute inset-0 landing-bg-mesh-emerald opacity-90" aria-hidden="true"></div>

    <!-- Background Decor Layer 2: Grid & Dots -->
    <LandingDecorLayer pattern="dots" intensity="medium" position="full" />
    <LandingDecorLayer pattern="grid" intensity="low" position="top-right" />

    <!-- Ambient Inline SVG Vector Elements (Static, <= 0.35 opacity) -->
    <div class="pointer-events-none absolute top-8 left-8 sm:top-12 sm:left-16 w-56 h-40 opacity-70 hidden sm:block" aria-hidden="true">
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-400">
        <circle cx="30" cy="60" r="6" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3" fill="currentColor" fill-opacity="0.05" />
        <circle cx="100" cy="30" r="8" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4" fill="currentColor" fill-opacity="0.08" />
        <circle cx="170" cy="70" r="6" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3" fill="currentColor" fill-opacity="0.05" />
        <circle cx="110" cy="95" r="4" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" />
        <line x1="36" y1="57" x2="92" y2="34" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="3 3" />
        <line x1="108" y1="34" x2="164" y2="67" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="3 3" />
        <line x1="100" y1="38" x2="110" y2="91" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.2" stroke-dasharray="3 3" />
      </svg>
    </div>

    <div class="pointer-events-none absolute bottom-4 right-6 sm:bottom-10 sm:right-12 w-48 h-48 opacity-50 hidden lg:block" aria-hidden="true">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-emerald-500">
        <circle cx="100" cy="100" r="90" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="6 6" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" stroke-width="1" stroke-opacity="0.18" />
        <path d="M 100 10 A 90 90 0 0 1 190 100" stroke="currentColor" stroke-width="2" stroke-opacity="0.35" stroke-linecap="round" />
      </svg>
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              {{ content.badge }}
            </span>
          </div>

          <!-- Headline Block with RTL Accent Bar -->
          <div class="relative border-r-4 border-emerald-500 pr-4 sm:pr-5">
            <!-- Soft ambient radial behind headline -->
            <div class="pointer-events-none absolute -inset-y-4 right-0 w-72 bg-emerald-500/10 blur-2xl rounded-full" aria-hidden="true"></div>

            <h1 class="relative text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--theme-text-primary)] leading-[1.25] sm:leading-[1.25]">
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
              class="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-xl border border-white/10 bg-[var(--theme-surface)]/80 backdrop-blur text-[var(--theme-text-primary)] font-medium text-sm sm:text-base hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-[var(--theme-surface-muted)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer"
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

        <!-- Left Column (Real Listings UI Preview in RTL) -->
        <div class="lg:col-span-5 flex flex-col items-center">
          <LandingHeroListingsPreview />
        </div>
      </div>
    </div>
  </section>
</template>
