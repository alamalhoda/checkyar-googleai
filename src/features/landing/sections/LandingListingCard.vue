<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { MarketplaceListing } from '../../../types/api';
import { LISTING_STATUS_LABELS } from '../../../types/api';
import { landingContent } from '../content/landingContent';
import { toPersianDigits, formatTomanFromRial, formatJalaliDate } from '../../../utils/persianUtils';
import { getLandingListingTarget } from '../utils/landingListingUtils';
import { maskDisplayName } from '../utils/maskDisplayName';

const props = defineProps<{
  listing: MarketplaceListing;
  isAuthenticated: boolean;
  showRiskTier: boolean;
}>();

const router = useRouter();

const formattedAmount = computed(() => formatTomanFromRial(props.listing.face_amount));
const formattedDueDate = computed(() => formatJalaliDate(props.listing.due_date));

const maskedIssuer = computed(() => {
  const raw = props.listing.issuer_profile?.name || props.listing.issuer_name;
  return maskDisplayName(raw);
});

const statusLabel = computed(() => {
  if (props.listing.status && LISTING_STATUS_LABELS[props.listing.status]) {
    return LISTING_STATUS_LABELS[props.listing.status];
  }
  return null;
});

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
    class="w-full text-right landing-glass-card landing-gradient-border-hover border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-[3px] shadow-sm hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)] flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 relative overflow-hidden"
    @click="handleActivate"
    @keydown.enter.prevent="handleActivate"
    @keydown.space.prevent="handleActivate"
  >
    <!-- Card Header: Bank & Status / Risk Badges -->
    <div>
      <div class="flex items-center justify-between gap-2 mb-3.5">
        <span class="font-bold text-[var(--theme-text-primary)] text-base truncate">
          {{ listing.bank_name }}
        </span>
        <div class="flex items-center gap-1.5 shrink-0">
          <span
            v-if="statusLabel"
            class="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
          >
            {{ statusLabel }}
          </span>
          <span
            v-if="showRiskTier && riskTierLabel"
            data-testid="landing-listing-risk-tier"
            class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shrink-0"
          >
            {{ riskTierLabel }}
          </span>
        </div>
      </div>

      <!-- Amount Block with Subtle Gradient Glow -->
      <div class="mb-4 p-3 rounded-xl bg-[var(--theme-bg)]/80 border border-white/5 relative">
        <div class="text-[11px] text-[var(--theme-text-muted)] mb-1">مبلغ اسمی چک</div>
        <div class="text-xl font-extrabold text-emerald-400 tabular-nums">
          {{ formattedAmount }} <span class="text-xs font-normal text-[var(--theme-text-secondary)]">{{ landingContent.liveListings.currencyUnit }}</span>
        </div>
      </div>

      <!-- Details List -->
      <div class="space-y-2 text-xs text-[var(--theme-text-secondary)]">
        <div v-if="formattedDueDate" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">سررسید:</span>
          <span class="font-medium text-[var(--theme-text-primary)]">{{ formattedDueDate }}</span>
        </div>

        <div v-if="daysToDueText" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">مهلت:</span>
          <span class="font-medium text-[var(--theme-text-primary)] tabular-nums">{{ daysToDueText }}</span>
        </div>

        <div v-if="discountRateText" class="flex items-center justify-between">
          <span class="text-[var(--theme-text-muted)]">{{ landingContent.liveListings.rateLabel }}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold tabular-nums">
            {{ discountRateText }}
          </span>
        </div>

        <div v-if="maskedIssuer" class="flex items-center justify-between truncate">
          <span class="text-[var(--theme-text-muted)]">صادرکننده:</span>
          <span class="truncate max-w-[140px] text-[var(--theme-text-primary)]">{{ maskedIssuer }}</span>
        </div>
      </div>
    </div>

    <!-- Action Hint Footer (No LTR arrows) -->
    <div class="mt-5 pt-3.5 border-t border-[var(--theme-border-subtle)]/70 flex items-center justify-between text-xs">
      <span class="text-emerald-400 font-medium">
        {{ isAuthenticated ? landingContent.liveListings.authCardAction : landingContent.liveListings.guestCardAction }}
      </span>
      <span class="text-[11px] text-[var(--theme-text-muted)] font-medium">
        {{ isAuthenticated ? 'مشاهده' : 'ورود' }}
      </span>
    </div>
  </button>
</template>
