<script setup lang="ts">
import { computed } from 'vue';
import { NCard, NTag, NButton } from 'naive-ui';
import {
  CalendarOutline,
  ShieldCheckmarkOutline,
  AlertCircleOutline,
  TrendingDownOutline,
  BusinessOutline,
  PersonOutline
} from '@vicons/ionicons5';
import type { MarketplaceListing, ChequeListing, ListingStatus } from '../../types/api';
import { LISTING_STATUS_LABELS } from '../../types/api';

const props = defineProps<{
  listing: MarketplaceListing | ChequeListing;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'viewDetail', id: number): void;
  (e: 'expressInterest', id: number): void;
  (e: 'edit', id: number): void;
}>();

// Helper to format currency in Iranian Rials & Tomans
const formattedAmount = computed(() => {
  const num = Number(props.listing.face_amount);
  if (isNaN(num)) return props.listing.face_amount;

  const rials = num.toLocaleString('fa-IR');
  const tomans = Math.floor(num / 10).toLocaleString('fa-IR');
  return { rials, tomans };
});

const isMarketplace = computed(() => 'days_to_due' in props.listing);

const riskTagType = computed(() => {
  if (props.listing.risk_tier === 'low') return 'success';
  if (props.listing.risk_tier === 'medium') return 'warning';
  return 'error';
});

const riskText = computed(() => {
  if (props.listing.risk_tier === 'low') return 'ریسک پایین (A+)';
  if (props.listing.risk_tier === 'medium') return 'ریسک متوسط (B)';
  if (props.listing.risk_tier === 'high') return 'ریسک بالا (C)';
  return 'اعتبارسنجی نشده';
});

const statusTagType = (status: ListingStatus) => {
  switch (status) {
    case 'published': return 'success';
    case 'pending_moderation': return 'warning';
    case 'rejected': return 'error';
    case 'matched': return 'info';
    default: return 'default';
  }
};

const maskedIssuerId = computed(() => {
  const id = props.listing.issuer_national_id;
  if (!id || id.length < 5) return '***';
  return id.substring(0, 3) + '****' + id.substring(id.length - 2);
});
</script>

<template>
  <NCard
    hoverable
    class="bg-slate-900 border border-slate-800 rounded-xl transition-all duration-300 hover:border-slate-700 hover:shadow-xl"
  >
    <!-- Header: Bank & Status / Risk -->
    <div class="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <BusinessOutline class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-100">{{ props.listing.bank_name }}</h3>
          <p class="text-[11px] text-slate-400 font-mono mt-0.5">سریال صیادی: {{ props.listing.cheque_serial_number }}</p>
        </div>
      </div>

      <div class="flex flex-col items-end gap-1">
        <NTag :type="riskTagType" size="small" round>
          {{ riskText }}
        </NTag>
        <span class="text-[10px] text-slate-400">
          {{ LISTING_STATUS_LABELS[props.listing.status] }}
        </span>
      </div>
    </div>

    <!-- Amount & Discount Box -->
    <div class="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-2">
      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-400">مبلغ اسمی چک:</span>
        <div class="text-left">
          <span class="text-base font-black text-emerald-400 tracking-tight">{{ formattedAmount.tomans }}</span>
          <span class="text-[11px] text-slate-400 mr-1">تومان</span>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
        <span class="text-slate-400">نرخ تنزیل پیشنهادی:</span>
        <span class="font-bold text-indigo-400 flex items-center gap-1">
          <TrendingDownOutline class="w-3.5 h-3.5" />
          {{ props.listing.suggested_discount_rate || '۲.۵' }}٪ ماهیانه
        </span>
      </div>
    </div>

    <!-- Issuer & Due Date Details -->
    <div class="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
      <div class="flex items-center gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
        <PersonOutline class="w-4 h-4 text-slate-400 shrink-0" />
        <div class="truncate">
          <div class="text-[10px] text-slate-500">صادرکننده ({{ props.listing.issuer_type === 'legal' ? 'حقوقی' : 'حقیقی' }}):</div>
          <div class="font-medium text-slate-200 truncate">{{ props.listing.issuer_name }}</div>
        </div>
      </div>

      <div class="flex items-center gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
        <CalendarOutline class="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <div class="text-[10px] text-slate-500">تاریخ سررسید:</div>
          <div class="font-semibold text-slate-200">{{ props.listing.due_date }}</div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p v-if="props.listing.description" class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
      {{ props.listing.description }}
    </p>

    <!-- Card Action Footer -->
    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
      <NButton
        size="small"
        secondary
        @click="emit('viewDetail', props.listing.id)"
      >
        مشاهده جزئیات
      </NButton>

      <NButton
        v-if="props.listing.status === 'published'"
        size="small"
        type="primary"
        @click="emit('expressInterest', props.listing.id)"
      >
        ابراز تمایل / پیشنهاد
      </NButton>

      <NButton
        v-if="props.listing.status === 'rejected'"
        size="small"
        type="warning"
        @click="emit('edit', props.listing.id)"
      >
        اصلاح آگهی
      </NButton>
    </div>
  </NCard>
</template>
