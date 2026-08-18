<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { MarketplaceListing } from '../../../types/api';
import { landingContent } from '../content/landingContent';
import { toPersianDigits, formatTomanFromRial, formatJalaliDate } from '../../../utils/persianUtils';
import { getLandingListingTarget } from '../utils/landingListingUtils';

const props = defineProps<{
  listing: MarketplaceListing;
  isAuthenticated: boolean;
  showRiskTier: boolean;
}>();

const router = useRouter();

const formattedAmount = computed(() => formatTomanFromRial(props.listing.face_amount));
const formattedDueDate = computed(() => formatJalaliDate(props.listing.due_date));

const daysToDueText = computed(() => {
  if (typeof props.listing.days_to_due === 'number' && Number.isFinite(props.listing.days_to_due)) {
    return `${toPersianDigits(props.listing.days_to_due)} ${landingContent.liveListings.daysToDueSuffix}`;
  }
  return null;
});

const discountRateText = computed(() => {
  const rate = props.listing.suggested_discount_rate;
  if (rate !== null && rate !== undefined && String(rate).trim() !== '') {
    return `${toPersianDigits(rate)}${landingContent.liveListings.rateUnit}`;
  }
  return null;
});

const riskTierLabel = computed(() => {
  if (!props.showRiskTier || !props.listing.risk_tier) return null;
  return landingContent.liveListings.riskLabels[props.listing.risk_tier] || null;
});

function handleActivate() {
  const target = getLandingListingTarget(props.isAuthenticated, props.listing.id);
  router.push(target);
}
</script>

<template>
  <button
    type="button"
    :data-testid="`landing-listing-card-${listing.id}`"
    class="w-full text-right bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] hover:border-emerald-500/50 rounded-xl p-5 transition duration-150 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
    @click="handleActivate"
    @keydown.enter.prevent="handleActivate"
    @keydown.space.prevent="handleActivate"
  >
    <!-- Card Header: Bank & Risk Tier Badge -->
    <div>
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="font-bold text-[var(--theme-text-primary)] text-base truncate">
          {{ listing.bank_name }}
        </span>
        <span
          v-if="showRiskTier && riskTierLabel"
          data-testid="landing-listing-risk-tier"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shrink-0"
        >
          {{ riskTierLabel }}
        </span>
      </div>

      <!-- Amount -->
      <div class="mb-3">
        <div class="text-xs text-[var(--theme-text-muted)] mb-0.5">مبلغ اسمی</div>
        <div class="text-lg font-bold text-emerald-400">
          {{ formattedAmount }} <span class="text-xs font-normal text-[var(--theme-text-secondary)]">{{ landingContent.liveListings.currencyUnit }}</span>
        </div>
      </div>

      <!-- Details List -->
      <div class="space-y-1.5 text-xs text-[var(--theme-text-secondary)]">
        <div v-if="formattedDueDate" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">سررسید:</span>
          <span>{{ formattedDueDate }}</span>
        </div>

        <div v-if="daysToDueText" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">مهلت:</span>
          <span>{{ daysToDueText }}</span>
        </div>

        <div v-if="discountRateText" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">{{ landingContent.liveListings.rateLabel }}</span>
          <span class="text-emerald-400 font-medium">{{ discountRateText }}</span>
        </div>

        <div v-if="listing.issuer_profile?.name" class="flex items-center justify-between truncate">
          <span class="text-[var(--theme-text-muted)]">صادرکننده:</span>
          <span class="truncate max-w-[150px]">{{ listing.issuer_profile.name }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Action hint -->
    <div class="mt-4 pt-3 border-t border-[var(--theme-border-subtle)] text-xs text-[var(--theme-text-muted)]">
      <span>{{ isAuthenticated ? landingContent.liveListings.authCardAction : landingContent.liveListings.guestCardAction }}</span>
    </div>
  </button>
</template>
