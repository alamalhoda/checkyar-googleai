<script setup lang="ts">
import { onMounted, computed } from 'vue';
import {
  NCard,
  NTabs,
  NTabPane,
  NTag,
  NDataTable,
  NAlert,
  NList,
  NListItem,
  NThing,
  NIcon,
  NButton
} from 'naive-ui';
import {
  StatsChartOutline,
  ShieldCheckmarkOutline,
  AlertCircleOutline,
  PersonOutline,
  CashOutline,
  MapOutline,
  KeyOutline,
  FlameOutline
} from '@vicons/ionicons5';
import { useReportsStore } from '../stores/reportsStore';
import GlobalFiltersPanel from '../components/GlobalFiltersPanel.vue';
import KpiCard from '../components/KpiCard.vue';
import ChartWrapper from '../components/ChartWrapper.vue';
import DrilldownModal from '../components/DrilldownModal.vue';

const store = useReportsStore();

onMounted(() => {
  store.fetchAdminReportsAndCharts();
});

// ================= ADMIN CHART DRILLDOWN HANDLERS =================

const handleTradeFlowClick = (payload: any) => {
  store.openDrilldown({
    title: 'ترافیک کل معاملات در تاریخ انتخاب‌شده',
    sourceChart: 'نمودار جریان کل معاملات',
    filterKey: 'tradeDate',
    filterValue: payload.selectedX || 'تاریخ معامله'
  });
};

const handleRiskBarClick = (payload: any) => {
  store.openDrilldown({
    title: 'توزیع ریسک معاملات در منطقه انتخاب‌شده',
    sourceChart: 'توزیع ریسک مناطق',
    filterKey: 'region',
    filterValue: payload.selectedX || 'منطقه'
  });
};

const handleModerationSlaClick = (payload: any) => {
  store.openDrilldown({
    title: 'عملکرد بررسی آگهی‌ها در روز انتخاب‌شده',
    sourceChart: 'عملکرد نظارت و SLA',
    filterKey: 'day',
    filterValue: payload.selectedX || 'روز بررسی'
  });
};

const handleRejectionClick = (payload: any) => {
  store.openDrilldown({
    title: 'لیست آگهی‌های ردشده به علت انتخاب‌شده',
    sourceChart: 'علل رد آگهی‌ها',
    filterKey: 'rejectionReason',
    filterValue: payload.selectedX || 'علت رد'
  });
};

const handleUserRiskClick = (payload: any) => {
  store.openDrilldown({
    title: 'پرونده ریسک و حجم معاملات کاربر',
    sourceChart: 'فعالیت و ریسک کاربران',
    filterKey: 'userVolume',
    filterValue: payload.selectedY?.y || 'حجم معامله'
  });
};

const handleGeoClick = (payload: any) => {
  store.openDrilldown({
    title: 'آمار تفکیکی کاربران و معاملات استان',
    sourceChart: 'توزیع جغرافیایی',
    filterKey: 'province',
    filterValue: payload.selectedX || 'استان'
  });
};

const handleFinancialClick = (payload: any) => {
  store.openDrilldown({
    title: 'تراکنش‌های مالی و کارمزد در دوره زمانی',
    sourceChart: 'روند مالی و کارمزدها',
    filterKey: 'period',
    filterValue: payload.selectedX || 'دوره زمانی'
  });
};

const handleSecurityClick = (payload: any) => {
  store.openDrilldown({
    title: 'لاگ رویدادهای امنیتی در ساعت انتخاب‌شده',
    sourceChart: 'نقشه حرارتی امنیت',
    filterKey: 'timeSlot',
    filterValue: payload.selectedX || 'ساعت رویداد'
  });
};

// ================= CHART SERIES FORMATTING =================

const tradeFlowSeries = computed(() => [
  { name: 'تعداد معامله', type: 'column', data: store.adminCharts?.tradeFlow?.map((d: any) => d.count) || [] },
  { name: 'حجم معامله (میلیون تومان)', type: 'line', data: store.adminCharts?.tradeFlow?.map((d: any) => d.value) || [] }
]);
const tradeFlowCategories = computed(() => store.adminCharts?.tradeFlow?.map((d: any) => d.date) || []);

const riskStackedSeries = computed(() => [
  { name: 'کم ریسک', data: store.adminCharts?.riskStackedBars?.map((d: any) => d.low) || [] },
  { name: 'ریسک متوسط', data: store.adminCharts?.riskStackedBars?.map((d: any) => d.medium) || [] },
  { name: 'پرریسک', data: store.adminCharts?.riskStackedBars?.map((d: any) => d.high) || [] }
]);
const riskStackedCategories = computed(() => store.adminCharts?.riskStackedBars?.map((d: any) => d.category) || []);

const moderationSlaSeries = computed(() => [
  { name: 'تعداد بررسی', type: 'column', data: store.adminCharts?.moderationSlaPoints?.map((d: any) => d.reviewVolume) || [] },
  { name: 'میانگین زمان (دقیقه)', type: 'line', data: store.adminCharts?.moderationSlaPoints?.map((d: any) => d.avgMinutes) || [] }
]);
const moderationSlaCategories = computed(() => store.adminCharts?.moderationSlaPoints?.map((d: any) => d.date) || []);

const rejectionSeries = computed(() => [
  { name: 'تعداد رد شده', data: store.adminCharts?.rejectionReasonBars?.map((d: any) => d.count) || [] }
]);
const rejectionCategories = computed(() => store.adminCharts?.rejectionReasonBars?.map((d: any) => d.reason) || []);

const userActivitySeries = computed(() => [
  {
    name: 'کاربران (X: تعداد معامله، Y: حجم به میلیون تومان)',
    data: store.adminCharts?.userActivityBubbles?.map((d: any) => ({
      x: d.tradeCount,
      y: d.volume
    })) || []
  }
]);

const geoSeries = computed(() => [
  { name: 'حجم معاملات (میلیون تومان)', data: store.adminCharts?.geoRegions?.map((d: any) => d.volume) || [] }
]);
const geoCategories = computed(() => store.adminCharts?.geoRegions?.map((d: any) => d.region) || []);

const financialSeries = computed(() => [
  { name: 'تسویه شده (میلیون تومان)', type: 'area', data: store.adminCharts?.financialTrends?.map((d: any) => d.settled) || [] },
  { name: 'درآمد کارمزد (میلیون تومان)', type: 'column', data: store.adminCharts?.financialTrends?.map((d: any) => d.fees) || [] }
]);
const financialCategories = computed(() => store.adminCharts?.financialTrends?.map((d: any) => d.date) || []);

const heatmapSeries = computed(() => {
  // Format data for ApexCharts Heatmap
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
  return days.map((day) => ({
    name: day,
    data: [0, 4, 8, 12, 16, 20].map((hour) => {
      const match = store.adminCharts?.securityHeatmap?.find((h: any) => h.day === day && h.hour === hour);
      return { x: `${hour}:00`, y: match ? match.eventCount : 0 };
    })
  }));
});

// Admin Tables Columns
const modColumns = [
  { title: 'شناسه ناظر', key: 'moderatorId', width: 110 },
  { title: 'نام ناظر', key: 'name' },
  { title: 'تعداد بررسی', key: 'reviewedCount', width: 110 },
  { title: 'میانگین زمان (دقیقه)', key: 'avgTimeMin', width: 140 },
  {
    title: 'نرخ رعایت SLA',
    key: 'slaMetRate',
    width: 120,
    render(row: any) {
      return `${row.slaMetRate}٪`;
    }
  }
];

const secColumns = [
  { title: 'شناسه', key: 'id', width: 90 },
  { title: 'زمان', key: 'timestamp', width: 140 },
  { title: 'کاربر / سیستم', key: 'user' },
  { title: 'نوع رویداد امنیتی', key: 'eventType' },
  {
    title: 'اولویت',
    key: 'severity',
    width: 100,
    render(row: any) {
      return row.severity === 'high' ? 'مهم' : row.severity === 'medium' ? 'متوسط' : 'عادی';
    }
  },
  { title: 'IP کاربر', key: 'ip', width: 120 }
];
</script>

<template>
  <div class="space-y-6 dir-rtl">
    <!-- Header Title Section -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <NIcon size="24" class="text-amber-400"><StatsChartOutline /></NIcon>
          <h1 class="text-2xl font-black text-slate-100 tracking-tight">داشبورد گزارش‌های مدیریتی و نظارت کل سیستم (Admin)</h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          پایش ارشد جریان کل معاملات، عملکرد ناظرین (SLA)، ریسک اعتباری، توزیع استانی، درآمدهای کل و رویدادهای امنیتی
        </p>
      </div>

      <NButton size="small" type="primary" class="font-bold" @click="store.fetchAdminReportsAndCharts">
        بروزرسانی داده‌های مدیریتی
      </NButton>
    </div>

    <!-- 1. Global Filters Panel -->
    <GlobalFiltersPanel />

    <!-- 2. Admin KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        title="کل آگهی‌های ثبت شده"
        :value="store.adminReports?.listingStatus?.totalListings || 0"
        unit="آگهی"
        :changePercentage="15.8"
        variant="amber"
        :icon="ShieldCheckmarkOutline"
      />
      <KpiCard
        title="حجم کل تسویه‌شده کل سیستم"
        :value="store.adminReports?.financialSettlement?.settledVolume ? Math.round(store.adminReports.financialSettlement.settledVolume / 1000000000) : 0"
        unit="میلیارد تومان"
        :changePercentage="21.4"
        variant="emerald"
        :icon="CashOutline"
      />
      <KpiCard
        title="نرخ رعایت SLA ناظرین"
        :value="store.adminReports?.moderationSla?.slaMetPercentage || 0"
        unit="درصد"
        subtext="میانگین زمان بررسی: ۱۴.۵ دقیقه"
        variant="purple"
        :icon="ShieldCheckmarkOutline"
      />
      <KpiCard
        title="هشدارها و لاگ‌های امنیتی"
        :value="store.adminReports?.securityAccessLog?.suspiciousAccessCount || 0"
        unit="مورد مشکوک"
        subtext="نیازمند بررسی تیم امنیت"
        variant="rose"
        :icon="AlertCircleOutline"
      />
    </div>

    <!-- 3. Top Row Charts (Overall Flow & Risk Distribution) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 1: Trade Flow -->
      <ChartWrapper
        title="۱. جریان کل معاملات (Trade Flow - Dual Axis)"
        subtitle="مقایسه تعداد معاملات و ارزش ریالی آن‌ها در بازه انتخابی"
        type="line"
        :series="tradeFlowSeries"
        :categories="tradeFlowCategories"
        :loading="store.loading"
        @data-point-click="handleTradeFlowClick"
      />

      <!-- Chart 2: Risk Stacked Bar -->
      <ChartWrapper
        title="۲. توزیع سطح ریسک بر اساس استان‌ها (Risk Stacked Bar)"
        subtitle="تفکیک معاملات کم‌ریسک، متوسط و پرریسک در کل مناطق کشور"
        type="bar"
        :series="riskStackedSeries"
        :categories="riskStackedCategories"
        :loading="store.loading"
        @data-point-click="handleRiskBarClick"
      />
    </div>

    <!-- 4. Middle Grid Charts (SLA Performance & Rejection Reasons) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 3: Moderation SLA -->
      <ChartWrapper
        title="۳. عملکرد ناظرین و رعایت SLA (Moderation SLA)"
        subtitle="حجم بررسی آگهی‌ها در کنار میانگین زمان تایید/رد بر حسب دقیقه"
        type="line"
        :series="moderationSlaSeries"
        :categories="moderationSlaCategories"
        :loading="store.loading"
        @data-point-click="handleModerationSlaClick"
      />

      <!-- Chart 4: Rejection Reasons -->
      <ChartWrapper
        title="۴. علل اصلی رد آگهی‌ها توسط ناظرین (Rejection Reasons)"
        subtitle="تحلیل فراوانی دلایل رد آگهی جهت بهبود آموزش کاربران"
        type="bar"
        :series="rejectionSeries"
        :categories="rejectionCategories"
        :loading="store.loading"
        @data-point-click="handleRejectionClick"
      />
    </div>

    <!-- 5. Bottom Grid Charts (User Activity, Geo, Financial & Security Heatmap) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Chart 5: User Activity Scatter -->
      <ChartWrapper
        title="۵. فعالیت و حجم کاربران"
        type="scatter"
        :series="userActivitySeries"
        :loading="store.loading"
        @data-point-click="handleUserRiskClick"
      />

      <!-- Chart 6: Geo Activity -->
      <ChartWrapper
        title="۶. توزیع استانی معاملات"
        type="bar"
        :series="geoSeries"
        :categories="geoCategories"
        :loading="store.loading"
        @data-point-click="handleGeoClick"
      />

      <!-- Chart 7: Financial Trend -->
      <ChartWrapper
        title="۷. درآمد کارمزد و تسویه‌ها"
        type="area"
        :series="financialSeries"
        :categories="financialCategories"
        :loading="store.loading"
        @data-point-click="handleFinancialClick"
      />

      <!-- Chart 8: Security Heatmap -->
      <ChartWrapper
        title="۸. نقشه حرارتی لاگ‌های امنیتی"
        type="heatmap"
        :series="heatmapSeries"
        :loading="store.loading"
        @data-point-click="handleSecurityClick"
      />
    </div>

    <!-- 6. Admin Tabbed Reports & Detail Tables (8 Core Reports) -->
    <NCard class="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg mt-8" title="گزارشات و جداول تفصیلی مدیریتی (8 Core Reports)">
      <NTabs type="line" animated>
        <!-- Admin Rep 1: Overall Listing Status -->
        <NTabPane name="arep1" tab="۱. وضعیت کل آگهی‌ها">
          <div class="py-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>کل آگهی‌ها:</span> <b class="text-amber-400 font-mono">{{ store.adminReports?.listingStatus?.totalListings }}</b></div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>فعال:</span> <b class="text-emerald-400 font-mono">{{ store.adminReports?.listingStatus?.activeListings }}</b></div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>در انتظار بررسی:</span> <b class="text-blue-400 font-mono">{{ store.adminReports?.listingStatus?.pendingListings }}</b></div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>معامله‌شده:</span> <b class="text-purple-400 font-mono">{{ store.adminReports?.listingStatus?.tradedListings }}</b></div>
          </div>
        </NTabPane>

        <!-- Admin Rep 2: Moderation & SLA -->
        <NTabPane name="arep2" tab="۲. عملکرد ناظرین (SLA)">
          <div class="py-3 space-y-4">
            <NDataTable
              :columns="modColumns"
              :data="store.adminReports?.moderationSla?.moderatorStats || []"
              size="small"
              bordered
            />
          </div>
        </NTabPane>

        <!-- Admin Rep 3: Trade Risk Distribution -->
        <NTabPane name="arep3" tab="۳. توزیع ریسک معامله">
          <div class="py-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>معاملات کم‌ریسک:</span> <b class="text-emerald-400 font-mono">{{ store.adminReports?.tradeRiskDistribution?.lowRiskCount }}</b></div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>معاملات با ریسک متوسط:</span> <b class="text-amber-400 font-mono">{{ store.adminReports?.tradeRiskDistribution?.mediumRiskCount }}</b></div>
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800"><span>معاملات پرریسک:</span> <b class="text-rose-400 font-mono">{{ store.adminReports?.tradeRiskDistribution?.highRiskCount }}</b></div>
          </div>
        </NTabPane>

        <!-- Admin Rep 4: Rejection Reasons -->
        <NTabPane name="arep4" tab="۴. علل رد آگهی‌ها">
          <div class="py-3 space-y-2">
            <NList class="bg-slate-950 rounded-xl border border-slate-800 p-2">
              <NListItem v-for="(rr, idx) in store.adminReports?.rejectionReasons?.reasons" :key="idx">
                <NThing :title="`${rr.category}: ${rr.reasonText}`">
                  <template #description>
                    <span class="text-xs text-slate-400">تعداد ردشده: {{ rr.count }} مورد ({{ rr.percentage }}٪ کل)</span>
                  </template>
                </NThing>
              </NListItem>
            </NList>
          </div>
        </NTabPane>

        <!-- Admin Rep 5: User Activity & Risk -->
        <NTabPane name="arep5" tab="۵. فعالیت و ریسک کاربران">
          <div class="py-3 space-y-3">
            <span class="text-xs font-bold text-slate-300">برترین کاربران از نظر حجم معامله</span>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div v-for="(usr, idx) in store.adminReports?.userActivityRisk?.topTradedVolumeUsers" :key="idx" class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span class="font-bold text-slate-100">{{ usr.name }}</span>
                <div class="text-slate-400">حجم: {{ Math.round(usr.volume / 1000000000) }} میلیارد تومان</div>
                <div class="text-emerald-400">امتیاز ریسک: {{ usr.riskScore }}</div>
              </div>
            </div>
          </div>
        </NTabPane>

        <!-- Admin Rep 6: Geographical Activity -->
        <NTabPane name="arep6" tab="۶. فعالیت استانی">
          <div class="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div v-for="(prov, idx) in store.adminReports?.geographicalActivity?.topProvinces" :key="idx" class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between">
              <span>استان {{ prov.province }} ({{ prov.userCount }} کاربر)</span>
              <span class="font-bold text-amber-400 font-mono">{{ Math.round(prov.tradeVolume / 1000000000) }} میلیارد تومان</span>
            </div>
          </div>
        </NTabPane>

        <!-- Admin Rep 7: Financial & Settlement -->
        <NTabPane name="arep7" tab="۷. مالی و کارمزدها">
          <div class="py-3 space-y-4">
            <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex justify-between">
              <span>مجموع درآمد کارمزد پلتفرم:</span>
              <span class="font-bold text-emerald-400 text-base font-mono">{{ store.adminReports?.financialSettlement?.totalPlatformFees ? (store.adminReports.financialSettlement.totalPlatformFees / 1000000).toLocaleString('fa-IR') : 0 }} میلیون تومان</span>
            </div>
          </div>
        </NTabPane>

        <!-- Admin Rep 8: Security & Access Logs -->
        <NTabPane name="arep8" tab="۸. لاگ‌های امنیتی">
          <div class="py-3 space-y-4">
            <NDataTable
              :columns="secColumns"
              :data="store.adminReports?.securityAccessLog?.recentEvents || []"
              size="small"
              bordered
            />
          </div>
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- Drilldown Modal Component -->
    <DrilldownModal />
  </div>
</template>
