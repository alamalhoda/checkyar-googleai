<script setup lang="ts">
import { computed } from 'vue';
import { useLandingLatestListings } from '../composables/useLandingLatestListings';
import { landingContent } from '../content/landingContent';
import { formatTomanFromRial, toPersianDigits } from '../../../utils/persianUtils';
import { LISTING_STATUS_LABELS } from '../../../types/api';
import { maskDisplayName } from '../utils/maskDisplayName';

const { listings, isLoading, hasError, refetch } = useLandingLatestListings();

const previewListings = computed(() => listings.value.slice(0, 2));

function scrollToListings() {
  const target = document.getElementById('live-listings');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<template>
  <div
    data-testid="landing-hero-listings-preview"
    class="w-full max-w-md rounded-2xl border border-white/10 landing-glass-card p-5 sm:p-6 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col"
  >
    <!-- Top Accent Gradient Line -->
    <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>

    <!-- Header / Live Tag -->
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
      <div class="flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <span class="text-xs font-semibold text-emerald-400">تابلوی زنده آگهی‌ها</span>
      </div>
      <button
        type="button"
        @click="scrollToListings"
        class="text-xs text-[var(--theme-text-muted)] hover:text-emerald-300 transition-colors cursor-pointer"
      >
        مشاهده همه
      </button>
    </div>

    <!-- 1. Loading State (Static skeleton, no pulse) -->
    <div v-if="isLoading" class="space-y-3 min-h-[190px]">
      <div
        v-for="i in 2"
        :key="i"
        class="p-3.5 rounded-xl bg-[var(--theme-surface)]/70 border border-white/5 space-y-2.5"
      >
        <div class="flex items-center justify-between">
          <div class="h-4 w-24 rounded bg-[var(--theme-border)]"></div>
          <div class="h-4 w-14 rounded-full bg-[var(--theme-border-subtle)]"></div>
        </div>
        <div class="flex items-center justify-between pt-1">
          <div class="h-5 w-28 rounded bg-[var(--theme-border)]"></div>
          <div class="h-3 w-16 rounded bg-[var(--theme-border-subtle)]"></div>
        </div>
      </div>
    </div>

    <!-- 2. Error State -->
    <div
      v-else-if="hasError"
      class="py-6 px-4 text-center rounded-xl bg-[var(--theme-surface)]/50 border border-white/5 space-y-3 min-h-[190px] flex flex-col justify-center items-center"
    >
      <p class="text-xs text-[var(--theme-text-muted)]">
        بارگذاری پیش‌نمایش با وقفه مواجه شد
      </p>
      <button
        type="button"
        @click="refetch"
        class="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
      >
        تلاش مجدد
      </button>
    </div>

    <!-- 3. Empty State -->
    <div
      v-else-if="previewListings.length === 0"
      class="py-6 px-4 text-center rounded-xl bg-[var(--theme-surface)]/50 border border-white/5 space-y-3 min-h-[190px] flex flex-col justify-center items-center"
    >
      <p class="text-xs text-[var(--theme-text-muted)]">
        {{ landingContent.hero.previewEmpty }}
      </p>
      <button
        type="button"
        @click="scrollToListings"
        class="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
      >
        <span>مشاهده بخش آگهی‌ها</span>
        <svg class="w-3 h-3 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- 4. Data State: Compact Display-Only Cards (Click scrolls to #live-listings) -->
    <div v-else class="space-y-3 min-h-[190px]">
      <a
        v-for="listing in previewListings"
        :key="listing.id"
        href="#live-listings"
        @click.prevent="scrollToListings"
        class="block p-3.5 rounded-xl bg-[var(--theme-surface)]/75 border border-white/10 hover:border-emerald-500/35 transition duration-200 shadow-sm cursor-pointer group"
      >
        <!-- Bank & Status / Rate -->
        <div class="flex items-center justify-between gap-2 mb-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[11px] shrink-0">
              {{ listing.bank_name ? listing.bank_name.charAt(0) : 'چ' }}
            </span>
            <span class="text-xs font-medium text-[var(--theme-text-primary)] truncate">
              {{ listing.bank_name }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <span
              v-if="listing.status === 'published'"
              class="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
            >
              {{ LISTING_STATUS_LABELS.published }}
            </span>
            <span
              v-if="listing.suggested_discount_rate"
              class="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 tabular-nums"
            >
              {{ toPersianDigits(listing.suggested_discount_rate) }}٪
            </span>
          </div>
        </div>

        <!-- Face Amount & Days to Due -->
        <div class="flex items-baseline justify-between pt-1 border-t border-white/5">
          <div class="flex items-baseline gap-1">
            <span class="text-sm font-extrabold text-[var(--theme-text-primary)] tabular-nums group-hover:text-emerald-300 transition-colors">
              {{ formatTomanFromRial(listing.face_amount) }}
            </span>
            <span class="text-[10px] text-[var(--theme-text-muted)]">تومان</span>
          </div>

          <div class="flex items-center gap-2 text-[10px] text-[var(--theme-text-muted)]">
            <span v-if="listing.issuer_profile?.name || listing.issuer_name" class="truncate max-w-[90px]">
              {{ maskDisplayName(listing.issuer_profile?.name || listing.issuer_name) }}
            </span>
            <span v-if="listing.days_to_due !== undefined && listing.days_to_due !== null" class="tabular-nums">
              {{ toPersianDigits(listing.days_to_due) }} روز
            </span>
          </div>
        </div>
      </a>
    </div>

    <!-- Caption -->
    <div class="mt-4 pt-3 border-t border-white/5 text-center">
      <span class="text-[11px] text-[var(--theme-text-muted)] font-medium">
        {{ landingContent.visual.heroPreviewCaption }}
      </span>
    </div>
  </div>
</template>
