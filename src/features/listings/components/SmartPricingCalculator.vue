<template>
  <div class="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-6 text-slate-200">
    <!-- Header with AI Badge -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
          💡
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            موتور قیمت‌گذاری هوشمند چک
            <NTag size="small" type="warning" round class="font-sans">پیشنـهاد بازار</NTag>
          </h3>
          <p class="text-xs text-slate-400">
            محاسبه خودکار نرخ تنزیل بر اساس ارزش زمانی، ریسک بانک صادرکننده و حجم بازار
          </p>
        </div>
      </div>

      <!-- Quick Days to Due Badge -->
      <div v-if="daysToDue" class="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5 self-start sm:self-center">
        <span class="text-slate-400">زمان باقی‌مانده تا سررسید:</span>
        <span class="font-bold font-mono text-amber-400">{{ daysToDue }} روز</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-8 text-center space-y-3">
      <NSpin size="medium" />
      <p class="text-xs text-slate-400">در حال آنالیز داده‌های بازار و محاسبه نرخ پیشنهادی...</p>
    </div>

    <!-- Main Pricing Dashboard -->
    <div v-else class="space-y-6">
      <!-- Comparative Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Face Amount -->
        <div class="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span class="text-xs text-slate-400">مبلغ اسمی چک</span>
          <div class="text-lg font-bold text-slate-100 font-mono">
            {{ (amount || 0).toLocaleString('fa-IR') }}
            <span class="text-xs text-slate-400 font-sans font-normal">تومان</span>
          </div>
        </div>

        <!-- AI Suggested Net Price -->
        <div class="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-xs text-emerald-400 font-medium">خالص پیشنهادی هوش‌مصنوعی</span>
            <span class="text-[11px] text-emerald-300 font-mono">({{ suggestedDiscountRate }}٪ سالانه)</span>
          </div>
          <div class="text-lg font-bold text-emerald-400 font-mono">
            {{ suggestedNetPrice.toLocaleString('fa-IR') }}
            <span class="text-xs text-emerald-500/80 font-sans font-normal">تومان</span>
          </div>
        </div>

        <!-- User Selected Net Price -->
        <div class="bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/30 space-y-1">
          <div class="flex justify-between items-center">
            <span class="text-xs text-indigo-300 font-medium">خالص دریافتی با نرخ انتخابی</span>
            <span class="text-[11px] font-bold text-indigo-400 font-mono">({{ userSelectedRate }}٪ سالانه)</span>
          </div>
          <div class="text-lg font-bold text-indigo-300 font-mono">
            {{ userSelectedPrice.toLocaleString('fa-IR') }}
            <span class="text-xs text-indigo-400/80 font-sans font-normal">تومان</span>
          </div>
        </div>
      </div>

      <!-- Helper Text Banner -->
      <div class="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs leading-relaxed space-y-1 text-slate-300">
        <div class="flex items-start gap-2">
          <span class="text-amber-400 mt-0.5">💬</span>
          <div class="flex items-center flex-wrap gap-1.5">
            <span>بر اساس شرایط فعلی بازار و</span>
            <BankBadge v-if="currentBank" :bank="currentBank" size="compact" theme="dark" />
            <strong v-else class="text-slate-100">{{ bankId || 'بانک نامشخص' }}</strong>
            <span>، نرخ پیشنهادی الگوریتم <strong class="text-amber-300 font-mono">{{ suggestedDiscountRate }}٪ سالانه</strong> (معادل مبلغ خالص <strong class="text-emerald-400 font-mono">{{ suggestedNetPrice.toLocaleString('fa-IR') }} تومان</strong>) می‌باشد.</span>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-1.5 border-t border-slate-700/40 text-slate-400">
          <span class="text-indigo-400">⚡</span>
          <span>
            سرعت تخمینی فروش با نرخ انتخابی شما ({{ userSelectedRate }}٪):
            <strong class="text-indigo-300">{{ currentEstimatedDaysToSell }}</strong>
          </span>
        </div>
      </div>

      <!-- Slider Control -->
      <div class="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
        <div class="flex justify-between items-center">
          <label class="text-xs font-bold text-slate-100 flex items-center gap-2">
            <span>تنظیم نرخ تنزیل انتخابی (سالانه)</span>
            <NTooltip trigger="hover">
              <template #trigger>
                <span class="cursor-help text-slate-400 text-xs">ℹ️</span>
              </template>
              با افزایش نرخ تنزیل، قیمت خالص چک کاهش یافته ولی سرعت پیدا شدن خریدار افزایش می‌یابد.
            </NTooltip>
          </label>
          <div class="flex items-center gap-2">
            <NButton
              size="tiny"
              secondary
              type="warning"
              @click="applySuggestedRate"
            >
              اعمال نرخ پیشنهادی ({{ suggestedDiscountRate }}٪)
            </NButton>
            <span class="text-sm font-bold text-amber-400 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {{ userSelectedRate }}٪
            </span>
          </div>
        </div>

        <NSlider
          v-model:value="userSelectedRate"
          :min="10"
          :max="40"
          :step="0.5"
          :marks="sliderMarks"
          class="py-2"
          @update:value="onSliderChange"
        />

        <div class="flex justify-between items-center text-[11px] text-slate-400 pt-2">
          <span>کاهش ریسک (فروش کندتر)</span>
          <span class="text-slate-300 font-medium">کسر تنزیل: {{ userDiscountAmount.toLocaleString('fa-IR') }} تومان</span>
          <span>جذابیت بالاتر برای خریدار (فروش سریع‌تر)</span>
        </div>
      </div>

      <!-- Pricing Breakdown Collapsible -->
      <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
        <button
          type="button"
          class="w-full px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 text-right text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors"
          @click="showBreakdown = !showBreakdown"
        >
          <span class="flex items-center gap-2">
            <span class="text-slate-400">📊</span>
            جزئیات مؤلفه‌های نرخ پیشنهادی (تککیک فرمول)
          </span>
          <span class="text-slate-400 text-xs">{{ showBreakdown ? '▲ بستن' : '▼ مشاهده جزئیات' }}</span>
        </button>

        <div v-if="showBreakdown" class="p-4 space-y-3 border-t border-slate-800 text-xs text-slate-300 bg-slate-950/30">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-center">
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span class="text-[11px] text-slate-400 block">نرخ پایه بازار (BaseRate)</span>
              <span class="font-bold text-amber-400 font-mono text-sm">{{ pricingComponents.baseRate }}٪</span>
            </div>
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span class="text-[11px] text-slate-400 block">پریمیوم زمان (Time)</span>
              <span class="font-bold text-amber-400 font-mono text-sm">+{{ pricingComponents.timePremium }}٪</span>
            </div>
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span class="text-[11px] text-slate-400 block">ریسک بانک صادرکننده</span>
              <span class="font-bold text-amber-400 font-mono text-sm">+{{ pricingComponents.bankPremium }}٪</span>
            </div>
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span class="text-[11px] text-slate-400 block">پریمیوم حجم چک</span>
              <span class="font-bold text-amber-400 font-mono text-sm">+{{ pricingComponents.amountPremium }}٪</span>
            </div>
            <div class="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span class="text-[11px] text-slate-400 block">تعدیل عرضه/تقاضا</span>
              <span class="font-bold text-amber-400 font-mono text-sm">+{{ pricingComponents.marketAdjustment }}٪</span>
            </div>
          </div>

          <div class="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-mono">
            SuggestedRate = BaseRate ({{ pricingComponents.baseRate }}%) + Time ({{ pricingComponents.timePremium }}%) + Bank ({{ pricingComponents.bankPremium }}%) + Amount ({{ pricingComponents.amountPremium }}%) + Market ({{ pricingComponents.marketAdjustment }}%) = <strong class="text-amber-300 font-bold">{{ suggestedDiscountRate }}%</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { NTag, NSlider, NButton, NSpin, NTooltip } from 'naive-ui';
import BankBadge from '../../../shared/components/BankBadge.vue';
import { findBankByCode, findBankByNameOrAlias } from '../../../shared/banks/lookup';
import {
  useSmartPricing,
  calculateNetPrice,
  estimateDaysToSell,
  type PricingComponents
} from '../composables/useSmartPricing';

const props = withDefaults(
  defineProps<{
    amount: number | null;
    bankId: string;
    dueDate: string | Date | number | null;
    initialDiscountRate?: number;
  }>(),
  {
    amount: 100_000_000,
    bankId: '',
    dueDate: null,
    initialDiscountRate: undefined,
  }
);

const emit = defineEmits<{
  (e: 'update:discountRate', rate: number): void;
  (e: 'update:netPrice', price: number): void;
  (e: 'update:pricingMetaData', data: {
    suggestedRate: number;
    suggestedPrice: number;
    finalRate: number;
    finalPrice: number;
    daysToDue: number;
  }): void;
}>();

const {
  loading,
  pricingComponents,
  suggestedRate: suggestedDiscountRate,
  suggestedNetPrice,
  daysToDue,
  loadPricingSuggestion,
} = useSmartPricing();

const currentBank = computed(() => {
  if (!props.bankId) return null;
  return findBankByCode(props.bankId) || findBankByNameOrAlias(props.bankId);
});

const userSelectedRate = ref<number>(props.initialDiscountRate ?? 25.0);
const showBreakdown = ref<boolean>(false);

// Calculate user net price dynamically
const userPriceResult = computed(() => {
  const faceVal = props.amount || 0;
  return calculateNetPrice(faceVal, userSelectedRate.value, daysToDue.value);
});

const userSelectedPrice = computed(() => userPriceResult.value.netPrice);
const userDiscountAmount = computed(() => userPriceResult.value.discountAmount);

// Estimated days to sell for user selected rate
const currentEstimatedDaysToSell = computed(() => {
  return estimateDaysToSell(userSelectedRate.value, suggestedDiscountRate.value);
});

// Slider Markers
const sliderMarks = computed(() => {
  const marks: Record<number, string> = {
    10: '۱۰٪',
    20: '۲۰٪',
    30: '۳۰٪',
    40: '۴۰٪'
  };
  if (suggestedDiscountRate.value >= 10 && suggestedDiscountRate.value <= 40) {
    marks[suggestedDiscountRate.value] = `پیشنهادی (${suggestedDiscountRate.value}٪)`;
  }
  return marks;
});

async function refreshPricingEngine() {
  try {
    const suggestion = await loadPricingSuggestion({
      amount: props.amount,
      bankId: props.bankId,
      dueDate: props.dueDate,
    });

    // If initial discount rate was not explicitly passed by user, use suggested
    if (props.initialDiscountRate === undefined) {
      userSelectedRate.value = suggestion.suggestedRate;
    } else {
      userSelectedRate.value = props.initialDiscountRate;
    }

    emitUpdates();
  } catch (err) {
    console.error('Failed to load smart pricing:', err);
  }
}

function applySuggestedRate() {
  userSelectedRate.value = suggestedDiscountRate.value;
  onSliderChange(suggestedDiscountRate.value);
}

function onSliderChange(val: number) {
  userSelectedRate.value = val;
  emitUpdates();
}

function emitUpdates() {
  emit('update:discountRate', userSelectedRate.value);
  emit('update:netPrice', userSelectedPrice.value);
  emit('update:pricingMetaData', {
    suggestedRate: suggestedDiscountRate.value,
    suggestedPrice: suggestedNetPrice.value,
    finalRate: userSelectedRate.value,
    finalPrice: userSelectedPrice.value,
    daysToDue: daysToDue.value,
  });
}

// Watchers for inputs
watch(
  () => [props.amount, props.bankId, props.dueDate],
  () => {
    refreshPricingEngine();
  },
  { deep: true }
);

onMounted(() => {
  refreshPricingEngine();
});
</script>
