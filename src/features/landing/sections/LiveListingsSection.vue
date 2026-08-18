<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { marketplaceApi } from '../../../api';
import type { MarketplaceListing } from '../../../types/api';
import { useAuthStore } from '../../../stores/auth';
import { useFeatureFlags } from '../../../shared/composables/useFeatureFlags';
import { landingContent } from '../content/landingContent';
import LandingSectionShell from '../components/LandingSectionShell.vue';
import LandingListingCard from './LandingListingCard.vue';

const authStore = useAuthStore();
const { showRiskTier } = useFeatureFlags();

const listings = ref<MarketplaceListing[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

async function fetchListings() {
  isLoading.value = true;
  hasError.value = false;
  try {
    const data = await marketplaceApi.getLatestListings();
    listings.value = (Array.isArray(data) ? data : []).slice(0, 4);
  } catch (err) {
    console.error('Failed to load latest listings:', err);
    hasError.value = true;
    listings.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchListings();
});
</script>

<template>
  <LandingSectionShell
    id="live-listings"
    testId="landing-section-live-listings"
    :title="landingContent.liveListings.title"
    :subtitle="landingContent.liveListings.subtitle"
    :eyebrow="landingContent.visual.sectionEyebrows.liveListings"
    variant="default"
    decorPattern="mesh"
    decorIntensity="low"
    decorPosition="bottom-left"
  >
    <!-- 1. Loading State -->
    <div
      v-if="isLoading"
      data-testid="landing-listings-loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[280px]"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-2xl border border-white/5 bg-[var(--theme-surface)]/60 backdrop-blur-md p-6 flex flex-col justify-between"
      >
        <div>
          <div class="h-5 bg-[var(--theme-border)] rounded w-2/3 mb-4"></div>
          <div class="h-4 bg-[var(--theme-border-subtle)] rounded w-1/3 mb-2"></div>
          <div class="h-6 bg-[var(--theme-border)] rounded w-3/4 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-[var(--theme-border-subtle)] rounded w-full"></div>
            <div class="h-3 bg-[var(--theme-border-subtle)] rounded w-4/5"></div>
          </div>
        </div>
        <div class="h-4 bg-[var(--theme-border-subtle)] rounded w-1/2 mt-4 pt-3 border-t border-[var(--theme-border-subtle)]"></div>
      </div>
    </div>

    <!-- 2. Error State -->
    <div
      v-else-if="hasError"
      data-testid="landing-listings-error"
      class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center max-w-xl mx-auto"
    >
      <p class="text-sm font-medium text-[var(--theme-text-secondary)] mb-4">
        {{ landingContent.liveListings.errorText }}
      </p>
      <button
        type="button"
        data-testid="landing-listings-retry"
        class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer"
        @click="fetchListings"
      >
        {{ landingContent.liveListings.retryLabel }}
      </button>
    </div>

    <!-- 3. Empty State -->
    <div
      v-else-if="listings.length === 0"
      data-testid="landing-listings-empty"
      class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm"
    >
      <p class="text-base text-[var(--theme-text-muted)] mb-6">
        {{ landingContent.liveListings.emptyText }}
      </p>
      <RouterLink
        v-if="!authStore.isAuthenticated"
        data-testid="landing-listings-empty-guest-cta"
        to="/register"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm shadow-sm hover:bg-emerald-300 transition"
      >
        {{ landingContent.liveListings.emptyGuestCta }}
      </RouterLink>
      <RouterLink
        v-else
        data-testid="landing-listings-empty-auth-cta"
        to="/marketplace"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-sm shadow-sm hover:bg-emerald-300 transition"
      >
        {{ landingContent.liveListings.emptyAuthCta }}
      </RouterLink>
    </div>

    <!-- 4. Data State -->
    <div
      v-else
      data-testid="landing-listings-grid"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
    >
      <LandingListingCard
        v-for="listing in listings"
        :key="listing.id"
        :listing="listing"
        :isAuthenticated="authStore.isAuthenticated"
        :showRiskTier="showRiskTier"
      />
    </div>
  </LandingSectionShell>
</template>
