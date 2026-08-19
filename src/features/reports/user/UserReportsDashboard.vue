<script setup lang="ts">
import { onMounted, computed, h } from 'vue';
import {
  NCard,
  NGrid,
  NGridItem,
  NTabs,
  NTabPane,
  NTag,
  NDataTable,
  NAlert,
  NList,
  NListItem,
  NThing,
  NProgress,
  NDescriptions,
  NDescriptionsItem,
  NIcon,
  NButton
} from 'naive-ui';
import {
  StatsChartOutline,
  DocumentTextOutline,
  TimeOutline,
  SwapHorizontalOutline,
  ShieldCheckmarkOutline,
  NotificationsOutline,
  TrendingUpOutline,
  CheckmarkCircleOutline
} from '@vicons/ionicons5';
import BankBadge from '../../../shared/components/BankBadge.vue';
import { findBankByNameOrAlias } from '../../../shared/banks/lookup';
import { useReportsStore } from '../stores/reportsStore';
import GlobalFiltersPanel from '../components/GlobalFiltersPanel.vue';
import KpiCard from '../components/KpiCard.vue';
import ChartWrapper from '../components/ChartWrapper.vue';
import DrilldownModal from '../components/DrilldownModal.vue';

const store = useReportsStore();

onMounted(() => {
  store.fetchUserReportsAndCharts();
});

// ================= CHART DRILLDOWN HANDLERS =================

const handleDueDateClick = (payload: any) => {
  store.openDrilldown({
    title: 'چک‌های سررسید در تاریخ انتخاب‌شده',
    sourceChart: 'نمودار زمانی سررسید',
    filterKey: 'dueDate',
    filterValue: payload.selectedX || 'تاریخ انتخابی'
  });
};

const handleConversionClick = (payload: any) => {
  store.openDrilldown({
    title: 'تفکیک مرحله قیف تبدیل آگهی‌ها',
    sourceChart: 'قیف تبدیل',
    filterKey: 'funnelStage',
    filterValue: payload.selectedX || 'مرحله قیف'
  });
};

const handleAmountDistClick = (payload: any) => {
  store.openDrilldown({
    title: 'لیست چک‌ها در بازه مبلغی انتخاب‌شده',
    sourceChart: 'توزیع مبالغ چک',
    filterKey: 'amountRange',
    filterValue: payload.selectedX || 'بازه مبلغی'
  });
};

const handleStatusClick = (payload: any) => {
  store.openDrilldown({
    title: 'آگهی‌ها با وضعیت انتخاب‌شده',
    sourceChart: 'توزیع وضعیت آگهی‌ها',
    filterKey: 'status',
    filterValue: payload.selectedX || 'وضعیت'
  });
};

const handleTrendClick = (payload: any) => {
  store.openDrilldown({
    title: 'تراکنش‌های دوره زمانی انتخاب‌شده',
    sourceChart: 'روند حجم تراکنش‌ها',
    filterKey: 'period',
    filterValue: payload.selectedX || 'دوره زمانی'
  });
};

const handleRiskClick = (payload: any) => {
  store.openDrilldown({
    title: 'جزئیات ارزیابی ریسک چک انتخاب‌شده',
    sourceChart: 'نمودار ریسک و سررسید',
    filterKey: 'riskScore',
    filterValue: payload.selectedY?.y || 'امتیاز ریسک'
  });
};

// ================= CHART SERIES FORMATTING =================

const dueDateSeries = computed(() => [
  { name: 'حجم چک‌ها (میلیون تومان)', data: store.userCharts?.dueDateTimeline?.map((d: any) => Math.round(d.totalAmount / 1000000)) || [] }
]);
const dueDateCategories = computed(() => store.userCharts?.dueDateTimeline?.map((d: any) => d.date) || []);

const funnelSeries = computed(() => [
  { name: 'تعداد موارد', data: store.userCharts?.conversionFunnel?.map((d: any) => d.value) || [] }
]);
const funnelCategories = computed(() => store.userCharts?.conversionFunnel?.map((d: any) => d.stage) || []);

const amountDistSeries = computed(() => [
  { name: 'تعداد چک‌ها', data: store.userCharts?.amountDistribution?.map((d: any) => d.count) || [] }
]);
const amountDistCategories = computed(() => store.userCharts?.amountDistribution?.map((d: any) => d.rangeLabel) || []);

const statusSeries = computed(() => store.userCharts?.statusDistribution?.map((d: any) => d.count) || []);
const statusLabels = computed(() => store.userCharts?.statusDistribution?.map((d: any) => d.label) || []);

const trendSeries = computed(() => [
  { name: 'حجم معامله (میلیون تومان)', data: store.userCharts?.transactionTrend?.map((d: any) => Math.round(d.amount / 1000000)) || [] }
]);
const trendCategories = computed(() => store.userCharts?.transactionTrend?.map((d: any) => d.date) || []);

const riskSeries = computed(() => [
  {
    name: 'چک‌ها (X: روز تا سررسید، Y: امتیاز ریسک)',
    data: store.userCharts?.riskBubbles?.map((d: any) => ({
      x: d.daysToDue,
      y: d.riskScore
    })) || []
  }
]);

// Table Columns for Transaction History
const txColumns = [
  { title: 'شناسه', key: 'id', width: 90 },
  { title: 'عنوان آگهی', key: 'listingTitle' },
  { title: 'طرف مقابل', key: 'counterparty' },
  {
    title: 'مبلغ (ریال)',
    key: 'amount',
    render(row: any) {
      return row.amount.toLocaleString('fa-IR');
    }
  },
  { title: 'تاریخ', key: 'date', width: 100 },
  {
    title: 'کانال تسویه',
    key: 'settlementChannel',
    width: 120
  }
];

// Table Columns for Upcoming Due Dates
const dueColumns = [
  { title: 'شماره چک', key: 'checkNumber', width: 110 },
  {
    title: 'بانک صادرکننده',
    key: 'bankName',
    render(row: any) {
      return h(BankBadge, {
        bank: row.bank || findBankByNameOrAlias(row.bankName),
        fallbackName: row.bankName,
        size: 'compact',
        theme: 'dark'
      });
    }
  },
  {
    title: 'مبلغ (ریال)',
    key: 'amount',
    render(row: any) {
      return row.amount.toLocaleString('fa-IR');
    }
  },
  { title: 'تاریخ سررسید', key: 'dueDate', width: 110 },
  {
    title: 'روز مانده',
    key: 'daysRemaining',
    width: 100,
    render(row: any) {
      return `${row.daysRemaining} روز`;
    }
  }
];
</script>

<template>
  <div class="space-y-6 dir-rtl">
    <!-- Header Title Section -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <NIcon size="24" class="text-emerald-400"><StatsChartOutline /></NIcon>
          <h1 class="text-2xl font-black text-slate-100 tracking-tight">داشبورد گزارش‌ها و تحلیل‌های کاربری</h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          مشاهده جامع عملکرد آگهی‌ها، تراکنش‌ها، سررسیدها، تحلیل ریسک و مقایسه با میانگین بازار
        </p>
      </div>

      <NButton size="small" type="primary" secondary @click="store.fetchUserReportsAndCharts">
        بروزرسانی داده‌ها
      </NButton>
    </div>

    <!-- 1. Global Filters Panel -->
    <GlobalFiltersPanel />

    <!-- 2. KPI Summary Cards (Top Section) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="کل حجم آگهی‌های فعال"
        :value="store.userReports?.listingStatus?.totalVolume ? Math.round(store.userReports.listingStatus.totalVolume / 1000000) : 0"
        unit="میلیون تومان"
        :changePercentage="12.4"
        variant="emerald"
        :icon="DocumentTextOutline"
      />
      <KpiCard
        title="تراکنش‌های تسویه شده"
        :value="store.userReports?.transactionHistory?.settledVolume ? Math.round(store.userReports.transactionHistory.settledVolume / 1000000) : 0"
        unit="میلیون تومان"
        :changePercentage="8.1"
        variant="blue"
        :icon="SwapHorizontalOutline"
      />
      <KpiCard
        title="چک‌های سررسید زیر ۷ روز"
        :value="store.userReports?.upcomingDueDates?.dueIn7DaysCount || 0"
        unit="فقره"
        subtext="نیازمند پیگیری فوری نقدشوندگی"
        variant="amber"
        :icon="TimeOutline"
      />
      <KpiCard
        title="نرخ تبدیل کل (Conversion)"
        :value="store.userReports?.conversion?.overallConversionRate || 0"
        unit="درصد"
        :changePercentage="2.3"
        variant="purple"
        :icon="TrendingUpOutline"
      />
    </div>

    <!-- 3. Top Row Charts (Middle Section: Full & Medium Charts) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Due Date Timeline -->
      <ChartWrapper
        title="۱. نمودار زمان‌بندی سررسید چک‌ها (Due Date Timeline)"
        subtitle="حجم چک‌های سررسید شده در روزهای آینده جهت مدیریت جریان نقدینگی"
        type="area"
        :series="dueDateSeries"
        :categories="dueDateCategories"
        :loading="store.loading"
        @data-point-click="handleDueDateClick"
      />

      <!-- Chart 5: Transaction Trend -->
      <ChartWrapper
        title="۲. روند ماهانه ارزش معاملات (Transaction Trend)"
        subtitle="مجموع ارزش ریالی معاملات موفق انجام‌شده در ماه‌های اخیر"
        type="line"
        :series="trendSeries"
        :categories="trendCategories"
        :loading="store.loading"
        @data-point-click="handleTrendClick"
      />
    </div>

    <!-- 4. Bottom Grid Charts (Two-Column Responsive Grid) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Chart 2: Conversion Funnel -->
      <ChartWrapper
        title="۳. قیف تبدیل معامله"
        type="bar"
        :series="funnelSeries"
        :categories="funnelCategories"
        :loading="store.loading"
        @data-point-click="handleConversionClick"
      />

      <!-- Chart 3: Amount Distribution -->
      <ChartWrapper
        title="۴. توزیع مبالغ چک‌ها"
        type="bar"
        :series="amountDistSeries"
        :categories="amountDistCategories"
        :loading="store.loading"
        @data-point-click="handleAmountDistClick"
      />

      <!-- Chart 4: Listing Status Donut -->
      <ChartWrapper
        title="۵. تفکیک وضعیت آگهی‌ها"
        type="donut"
        :series="statusSeries"
        :categories="statusLabels"
        :loading="store.loading"
        @data-point-click="handleStatusClick"
      />

      <!-- Chart 6: Risk Scatter -->
      <ChartWrapper
        title="۶. پراکندگی ریسک چک‌ها"
        type="scatter"
        :series="riskSeries"
        :loading="store.loading"
        @data-point-click="handleRiskClick"
      />
    </div>

    <!-- 5. Detailed Tabbed Reports Section (7 Core Reports) -->
    <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg mt-8" title="گزارشات و جداول تفصیلی کاربری (7 Core Reports)">
      <NTabs type="line" animated>
        <!-- Report 1: Listing Status -->
        <NTabPane name="rep1" tab="۱. وضعیت آگهی‌ها">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-3">
            <div class="space-y-2">
              <span class="text-xs font-bold text-slate-300">خلاصه آماری آگهی‌ها</span>
              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div class="flex justify-between"><span>آگهی‌های فعال:</span><span class="font-bold text-emerald-400">{{ store.userReports?.listingStatus?.activeCount }}</span></div>
                <div class="flex justify-between"><span>در انتظار بررسی:</span><span class="font-bold text-amber-400">{{ store.userReports?.listingStatus?.pendingCount }}</span></div>
                <div class="flex justify-between"><span>منقضی شده:</span><span class="font-bold text-slate-400">{{ store.userReports?.listingStatus?.expiredCount }}</span></div>
                <div class="flex justify-between"><span>رد شده:</span><span class="font-bold text-rose-400">{{ store.userReports?.listingStatus?.rejectedCount }}</span></div>
              </div>
            </div>

            <div class="md:col-span-2 space-y-2">
              <span class="text-xs font-bold text-slate-300">علل رد آگهی‌ها</span>
              <NList class="bg-slate-950 rounded-xl border border-slate-800 p-2">
                <NListItem v-for="(rej, idx) in store.userReports?.listingStatus?.rejectionReasons" :key="idx">
                  <NThing :title="rej.reason">
                    <template #description>
                      <span class="text-xs text-slate-400">تعداد موارد رد شده: {{ rej.count }} فقره</span>
                    </template>
                  </NThing>
                </NListItem>
              </NList>
            </div>
          </div>
        </NTabPane>

        <!-- Report 2: Transaction History -->
        <NTabPane name="rep2" tab="۲. تاریخچه تراکنش‌ها">
          <div class="py-3 space-y-4">
            <NDataTable
              :columns="txColumns"
              :data="store.userReports?.transactionHistory?.items || []"
              size="small"
              bordered
            />
          </div>
        </NTabPane>

        <!-- Report 3: Upcoming Due Dates -->
        <NTabPane name="rep3" tab="۳. سررسیدهای نزدیک">
          <div class="py-3 space-y-4">
            <NDataTable
              :columns="dueColumns"
              :data="store.userReports?.upcomingDueDates?.items || []"
              size="small"
              bordered
            />
          </div>
        </NTabPane>

        <!-- Report 4: Listing Conversion -->
        <NTabPane name="rep4" tab="۴. نرخ تبدیل آگهی">
          <div class="py-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span class="text-xs text-slate-400 block mb-1">بازدید کل از آگهی‌ها</span>
              <span class="text-2xl font-black text-slate-100 font-mono">{{ store.userReports?.conversion?.totalViews }}</span>
            </div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span class="text-xs text-slate-400 block mb-1">تعداد تطابق‌ها (Matches)</span>
              <span class="text-2xl font-black text-emerald-400 font-mono">{{ store.userReports?.conversion?.totalMatches }}</span>
            </div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span class="text-xs text-slate-400 block mb-1">معاملات نهایی موفق (Deals)</span>
              <span class="text-2xl font-black text-purple-400 font-mono">{{ store.userReports?.conversion?.totalDeals }}</span>
            </div>
          </div>
        </NTabPane>

        <!-- Report 5: Notifications & Alerts -->
        <NTabPane name="rep5" tab="۵. هشدارها و پیام‌ها">
          <div class="py-3 space-y-3">
            <NAlert type="warning" title="هشدارهای اولویت بالا">
              شما {{ store.userReports?.notifications?.unreadCount }} پیام خوانده نشده در خصوص سررسید و تغییر وضعیت معامله دارید.
            </NAlert>
          </div>
        </NTabPane>

        <!-- Report 6: Risk Analysis -->
        <NTabPane name="rep6" tab="۶. تحلیل ریسک حساب">
          <div class="py-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-300">عوامل مثبت و منفی ریسک</h4>
              <ul class="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li v-for="(f, idx) in store.userReports?.riskAnalysis?.riskFactors" :key="idx">{{ f }}</li>
              </ul>
            </div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-300">توصیه‌های بهبود اعتبارسنجی</h4>
              <ul class="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li v-for="(a, idx) in store.userReports?.riskAnalysis?.riskAdvice" :key="idx">{{ a }}</li>
              </ul>
            </div>
          </div>
        </NTabPane>

        <!-- Report 7: Market Comparison -->
        <NTabPane name="rep7" tab="۷. مقایسه با بازار">
          <div class="py-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-2">میانگین نرخ تنزیل شما vs بازار</span>
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-emerald-400 text-lg font-mono">{{ store.userReports?.marketComparison?.userAvgDiscountRate }}٪</span>
                <span class="text-slate-500">بازار: {{ store.userReports?.marketComparison?.marketAvgDiscountRate }}٪</span>
              </div>
            </div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-2">زمان تسویه شما vs بازار</span>
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-purple-400 text-lg font-mono">{{ store.userReports?.marketComparison?.userAvgSettlementTime }} روز</span>
                <span class="text-slate-500">بازار: {{ store.userReports?.marketComparison?.marketAvgSettlementTime }} روز</span>
              </div>
            </div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span class="text-slate-400 block mb-2">نرخ نکول / نکول احتمالی</span>
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-emerald-400 text-lg font-mono">{{ store.userReports?.marketComparison?.userDefaultRate }}٪</span>
                <span class="text-slate-500">میانگین بازار: {{ store.userReports?.marketComparison?.marketDefaultRate }}٪</span>
              </div>
            </div>
          </div>
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- Drilldown Modal Component -->
    <DrilldownModal />
  </div>
</template>
