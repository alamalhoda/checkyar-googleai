<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { marketplaceApi } from '../../../api';
import type { MarketplaceListing } from '../../../types/api';
import { useAuthStore } from '../../../stores/auth';
import { useFeatureFlags } from '../../../shared/composables/useFeatureFlags';
import { landingContent } from '../content/landingContent';
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
  <section
    id="live-listings"
    data-testid="landing-section-live-listings"
    class="w-full py-16 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] scroll-mt-16"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--theme-text-primary)]">
          {{ landingContent.liveListings.title }}
        </h2>
        <p class="mt-3 text-sm text-[var(--theme-text-muted)]">
          {{ landingContent.liveListings.subtitle }}
        </p>
      </div>

      <!-- 1. Loading State -->
      <div
        v-if="isLoading"
        data-testid="landing-listings-loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[280px]"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 flex flex-col justify-between"
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
        class="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-8 sm:p-12 text-center max-w-xl mx-auto"
      >
        <p class="text-base text-[var(--theme-text-muted)] mb-6">
          {{ landingContent.liveListings.emptyText }}
        </p>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/register"
          data-testid="landing-listings-empty-cta"
          class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-sm"
        >
          {{ landingContent.liveListings.emptyGuestCta }}
        </RouterLink>
        <RouterLink
          v-else
          to="/marketplace"
          data-testid="landing-listings-empty-cta"
          class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg text-black bg-emerald-400 hover:bg-emerald-300 transition shadow-sm"
        >
          {{ landingContent.liveListings.emptyAuthCta }}
        </RouterLink>
      </div>

      <!-- 4. Data State -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <LandingListingCard
          v-for="item in listings"
          :key="item.id"
          :listing="item"
          :is-authenticated="authStore.isAuthenticated"
          :show-risk-tier="showRiskTier"
        />
      </div>
    </div>
  </section>
</template>
