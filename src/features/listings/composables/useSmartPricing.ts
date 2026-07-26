import { ref, computed } from 'vue';

export interface PricingComponents {
  baseRate: number; // e.g. 22.0 (% per annum)
  timePremium: number; // e.g. 1.2 (% time risk/value factor)
  bankPremium: number; // e.g. 0.8 (% bank risk)
  amountPremium: number; // e.g. 1.0 (% amount scale factor)
  marketAdjustment: number; // e.g. 0.5 (% supply/demand factor)
}

export interface SmartPricingSuggestion {
  suggestedRate: number; // Total annual discount rate percentage (e.g. 25.5%)
  suggestedNetPrice: number; // FaceValue - DiscountAmount
  discountAmount: number; // Amount deducted
  daysToDue: number; // Days until cheque maturity
  estimatedDaysToSell: string; // e.g. "۱ تا ۳ روز"
  pricingComponents: PricingComponents;
}

export interface FetchSmartPricingParams {
  amount: number | null;
  bankId: string;
  dueDate: string | Date | number | null;
}

/**
 * Calculates days to due date from today.
 */
export function calculateDaysToDue(dueDate: string | Date | number | null): number {
  if (!dueDate) return 30; // Default fallback to 30 days
  const due = new Date(dueDate);
  const now = new Date();
  // Strip time part for clean day calculation
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

/**
 * Helper to compute net price based on face amount, annual discount rate, and days to due.
 * Formula: DiscountAmount = FaceValue * SuggestedRate * DaysToDue / 365 / 100
 * NetPrice = FaceValue - DiscountAmount
 */
export function calculateNetPrice(amount: number, annualRatePercentage: number, daysToDue: number): { netPrice: number; discountAmount: number } {
  if (!amount || amount <= 0) return { netPrice: 0, discountAmount: 0 };
  const rate = Math.max(0, annualRatePercentage) / 100;
  const discountAmount = Math.round((amount * rate * daysToDue) / 365);
  const netPrice = Math.max(0, amount - discountAmount);
  return { netPrice, discountAmount };
}

/**
 * Estimates sales velocity based on user selected rate vs market suggested rate.
 */
export function estimateDaysToSell(userRate: number, suggestedRate: number): string {
  const diff = userRate - suggestedRate;
  if (diff >= 2.0) {
    return 'کمتر از ۲۴ ساعت (فروش بسیار سریع)';
  } else if (diff >= 0) {
    return '۱ تا ۳ روز (حالت ایده‌آل بازار)';
  } else if (diff >= -2.0) {
    return '۳ تا ۷ روز (سرعت معمولی)';
  } else {
    return 'بیش از ۷ روز (احتمال معامله کندتر)';
  }
}

/**
 * Helper to fetch/calculate smart pricing suggestions from API or backend model.
 */
export async function fetchSmartPricingSuggestion(params: FetchSmartPricingParams): Promise<SmartPricingSuggestion> {
  // Simulate network latent call to GET /api/pricing/smart-suggest
  await new Promise((resolve) => setTimeout(resolve, 250));

  const amount = params.amount || 100_000_000;
  const daysToDue = calculateDaysToDue(params.dueDate);
  const bank = params.bankId || '';

  // 1. Base Rate (Annual rate benchmark e.g., 22.0%)
  const baseRate = 22.0;

  // 2. Time Premium based on duration (Longer maturity = slightly higher risk premium)
  const timePremium = Number((daysToDue > 90 ? 2.0 : daysToDue > 45 ? 1.2 : 0.5).toFixed(1));

  // 3. Bank Risk Premium
  let bankPremium = 1.0;
  if (bank.includes('ملی') || bank.includes('ملت')) {
    bankPremium = 0.5;
  } else if (bank.includes('صادرات') || bank.includes('تجارت')) {
    bankPremium = 0.8;
  } else if (bank.includes('پاسارگاد') || bank.includes('سامان')) {
    bankPremium = 1.2;
  } else if (bank) {
    bankPremium = 1.5;
  }

  // 4. Amount Premium (Higher amount = higher liquidity risk)
  let amountPremium = 1.0;
  if (amount < 50_000_000) {
    amountPremium = 0.5;
  } else if (amount <= 200_000_000) {
    amountPremium = 1.0;
  } else {
    amountPremium = 1.8;
  }

  // 5. Market Adjustment Factor
  const marketAdjustment = 0.5;

  // Total Suggested Rate = BaseRate + TimePremium + BankPremium + AmountPremium + MarketAdjustment
  const suggestedRate = Number(
    (baseRate + timePremium + bankPremium + amountPremium + marketAdjustment).toFixed(1)
  );

  const { netPrice: suggestedNetPrice, discountAmount } = calculateNetPrice(amount, suggestedRate, daysToDue);
  const estimatedDays = estimateDaysToSell(suggestedRate, suggestedRate);

  return {
    suggestedRate,
    suggestedNetPrice,
    discountAmount,
    daysToDue,
    estimatedDaysToSell: estimatedDays,
    pricingComponents: {
      baseRate,
      timePremium,
      bankPremium,
      amountPremium,
      marketAdjustment,
    },
  };
}

/**
 * Vue 3 Composable wrapper for Smart Pricing Engine
 */
export function useSmartPricing() {
  const loading = ref(false);
  const pricingComponents = ref<PricingComponents>({
    baseRate: 22.0,
    timePremium: 1.0,
    bankPremium: 0.8,
    amountPremium: 1.0,
    marketAdjustment: 0.5,
  });
  const suggestedRate = ref<number>(25.3);
  const suggestedNetPrice = ref<number>(0);
  const discountAmount = ref<number>(0);
  const daysToDue = ref<number>(30);
  const estimatedDaysToSell = ref<string>('۱ تا ۳ روز');

  async function loadPricingSuggestion(params: FetchSmartPricingParams) {
    loading.value = true;
    try {
      const res = await fetchSmartPricingSuggestion(params);
      suggestedRate.value = res.suggestedRate;
      suggestedNetPrice.value = res.suggestedNetPrice;
      discountAmount.value = res.discountAmount;
      daysToDue.value = res.daysToDue;
      estimatedDaysToSell.value = res.estimatedDaysToSell;
      pricingComponents.value = res.pricingComponents;
      return res;
    } catch (error) {
      console.error('Error fetching smart pricing suggestion:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    pricingComponents,
    suggestedRate,
    suggestedNetPrice,
    discountAmount,
    daysToDue,
    estimatedDaysToSell,
    loadPricingSuggestion,
    calculateNetPrice,
    estimateDaysToSell,
  };
}
