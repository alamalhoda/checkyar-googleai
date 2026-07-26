import { defineStore } from 'pinia';
import { ref, reactive, watch } from 'vue';
import type {
  ReportsFilters,
  UserListingStatusReport,
  UserTransactionHistoryReport,
  UpcomingDueDateReport,
  ListingConversionReport,
  NotificationsAlertsReport,
  UserRiskAnalysisReport,
  MarketComparisonReport,
  AdminListingStatusReport,
  ModerationSlaReport,
  TradeRiskDistributionReport,
  RejectionReasonsReport,
  UserActivityRiskReport,
  GeographicalActivityReport,
  FinancialSettlementReport,
  SecurityAccessLogReport,
  DrilldownContext,
  DrilldownResult
} from '../types/reports.types';
import { reportsApi } from '../api/reportsApi';

export const useReportsStore = defineStore('reports', () => {
  // 1. GLOBAL FILTERS STATE
  const defaultFilters: ReportsFilters = {
    bucket: 'day',
    riskLevel: 'all',
    severity: 'all'
  };

  const filters = reactive<ReportsFilters>({ ...defaultFilters });
  const autoRefresh = ref(true);

  // 2. DATA STATES
  const loading = ref(false);

  // User Reports & Charts
  const userReports = ref<{
    listingStatus?: UserListingStatusReport;
    transactionHistory?: UserTransactionHistoryReport;
    upcomingDueDates?: UpcomingDueDateReport;
    conversion?: ListingConversionReport;
    notifications?: NotificationsAlertsReport;
    riskAnalysis?: UserRiskAnalysisReport;
    marketComparison?: MarketComparisonReport;
  } | null>(null);

  const userCharts = ref<any | null>(null);

  // Admin Reports & Charts
  const adminReports = ref<{
    listingStatus?: AdminListingStatusReport;
    moderationSla?: ModerationSlaReport;
    tradeRiskDistribution?: TradeRiskDistributionReport;
    rejectionReasons?: RejectionReasonsReport;
    userActivityRisk?: UserActivityRiskReport;
    geographicalActivity?: GeographicalActivityReport;
    financialSettlement?: FinancialSettlementReport;
    securityAccessLog?: SecurityAccessLogReport;
  } | null>(null);

  const adminCharts = ref<any | null>(null);

  // 3. DRILLDOWN STATE
  const drilldownVisible = ref(false);
  const drilldownLoading = ref(false);
  const drilldownContext = ref<DrilldownContext | null>(null);
  const drilldownData = ref<DrilldownResult | null>(null);

  // Active dashboard view type: 'user' | 'admin'
  const activeDashboardMode = ref<'user' | 'admin'>('user');

  // 4. ACTIONS & METHODS

  function setFilters(newFilters: Partial<ReportsFilters>) {
    Object.assign(filters, newFilters);
    if (autoRefresh.value) {
      triggerDashboardFetch();
    }
  }

  function resetFilters() {
    Object.keys(filters).forEach((key) => {
      delete (filters as any)[key];
    });
    Object.assign(filters, defaultFilters);
    triggerDashboardFetch();
  }

  function triggerDashboardFetch() {
    if (activeDashboardMode.value === 'user') {
      fetchUserReportsAndCharts();
    } else {
      fetchAdminReportsAndCharts();
    }
  }

  async function fetchUserReportsAndCharts() {
    activeDashboardMode.value = 'user';
    loading.value = true;
    try {
      const [reportsRes, chartsRes] = await Promise.all([
        reportsApi.getUserReports(filters),
        reportsApi.getUserCharts(filters)
      ]);
      userReports.value = reportsRes;
      userCharts.value = chartsRes;
    } catch (err) {
      console.error('Error loading User reports:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdminReportsAndCharts() {
    activeDashboardMode.value = 'admin';
    loading.value = true;
    try {
      const [reportsRes, chartsRes] = await Promise.all([
        reportsApi.getAdminReports(filters),
        reportsApi.getAdminCharts(filters)
      ]);
      adminReports.value = reportsRes;
      adminCharts.value = chartsRes;
    } catch (err) {
      console.error('Error loading Admin reports:', err);
    } finally {
      loading.value = false;
    }
  }

  // DRILLDOWN ACTIONS
  async function openDrilldown(context: DrilldownContext) {
    drilldownContext.value = context;
    drilldownVisible.value = true;
    drilldownLoading.value = true;
    try {
      const result = await reportsApi.getDrilldown(context, filters);
      drilldownData.value = result;
    } catch (err) {
      console.error('Error fetching drilldown data:', err);
    } finally {
      drilldownLoading.value = false;
    }
  }

  function closeDrilldown() {
    drilldownVisible.value = false;
    drilldownContext.value = null;
    drilldownData.value = null;
  }

  return {
    filters,
    autoRefresh,
    loading,
    userReports,
    userCharts,
    adminReports,
    adminCharts,
    drilldownVisible,
    drilldownLoading,
    drilldownContext,
    drilldownData,
    activeDashboardMode,
    setFilters,
    resetFilters,
    fetchUserReportsAndCharts,
    fetchAdminReportsAndCharts,
    openDrilldown,
    closeDrilldown
  };
});
