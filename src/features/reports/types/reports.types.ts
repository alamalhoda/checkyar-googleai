export type DateBucket = 'day' | 'week' | 'month';

export interface ReportsFilters {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  bucket: DateBucket;
  province?: string;
  city?: string;
  bank?: string;
  riskLevel?: 'all' | 'low' | 'medium' | 'high';
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  moderatorId?: string;
  eventType?: string;
  severity?: 'all' | 'low' | 'medium' | 'high' | 'critical';
}

// ==================== USER REPORT & CHART TYPES ====================

export interface UserListingStatusReport {
  activeCount: number;
  expiredCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalVolume: number;
  rejectionReasons: { reason: string; count: number }[];
}

export interface UserTransactionHistoryReport {
  totalCount: number;
  settledVolume: number;
  pendingVolume: number;
  averageSettlementDays: number;
  items: {
    id: string;
    listingTitle: string;
    counterparty: string;
    amount: number;
    date: string;
    status: 'settled' | 'pending' | 'cancelled';
    settlementChannel: string;
  }[];
}

export interface UpcomingDueDateReport {
  dueIn7DaysCount: number;
  dueIn7DaysAmount: number;
  dueIn30DaysCount: number;
  dueIn30DaysAmount: number;
  dueIn60DaysCount: number;
  dueIn60DaysAmount: number;
  items: {
    id: string;
    checkNumber: string;
    bankName: string;
    amount: number;
    dueDate: string;
    daysRemaining: number;
    riskScore: number;
  }[];
}

export interface ListingConversionReport {
  totalViews: number;
  totalMatches: number;
  totalDeals: number;
  viewToMatchRate: number;
  matchToDealRate: number;
  overallConversionRate: number;
}

export interface NotificationsAlertsReport {
  totalCount: number;
  unreadCount: number;
  byPriority: { low: number; medium: number; high: number };
  byType: { type: string; count: number }[];
}

export interface UserRiskAnalysisReport {
  userOverallRiskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  riskFactors: string[];
  riskAdvice: string[];
}

export interface MarketComparisonReport {
  userAvgDiscountRate: number;
  marketAvgDiscountRate: number;
  userAvgSettlementTime: number; // days
  marketAvgSettlementTime: number;
  userDefaultRate: number; // %
  marketDefaultRate: number;
}

// User Chart Points
export interface DueDateTimelinePoint {
  date: string;
  count: number;
  totalAmount: number;
}

export interface ConversionFunnelStage {
  stage: string;
  value: number;
}

export interface AmountDistributionBin {
  rangeLabel: string;
  minVal: number;
  maxVal: number;
  count: number;
}

export interface StatusDistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TransactionTrendPoint {
  date: string;
  amount: number;
  count: number;
}

export interface RiskBubblePoint {
  id: string;
  checkNumber: string;
  daysToDue: number; // X axis
  riskScore: number; // Y axis
  amount: number;    // Z/Size
  riskLevel: 'low' | 'medium' | 'high';
}

// ==================== ADMIN REPORT & CHART TYPES ====================

export interface AdminListingStatusReport {
  totalListings: number;
  activeListings: number;
  pendingListings: number;
  tradedListings: number;
  rejectedListings: number;
  regionalBreakdown: { province: string; count: number; volume: number }[];
}

export interface ModerationSlaReport {
  totalReviews: number;
  avgReviewTimeMinutes: number;
  slaMetPercentage: number;
  moderatorStats: {
    moderatorId: string;
    name: string;
    reviewedCount: number;
    avgTimeMin: number;
    slaMetRate: number;
  }[];
}

export interface TradeRiskDistributionReport {
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  byCity: { city: string; highRiskCount: number }[];
}

export interface RejectionReasonsReport {
  totalRejections: number;
  reasons: { category: string; reasonText: string; count: number; percentage: number }[];
}

export interface UserActivityRiskReport {
  totalActiveUsers: number;
  highRiskUsersCount: number;
  topTradedVolumeUsers: { userId: string; name: string; volume: number; riskScore: number }[];
}

export interface GeographicalActivityReport {
  provincesCount: number;
  topProvinces: { province: string; userCount: number; tradeVolume: number }[];
}

export interface FinancialSettlementReport {
  totalPlatformFees: number;
  settledVolume: number;
  unsettledVolume: number;
  channelBreakdown: { channel: string; volume: number; fee: number }[];
}

export interface SecurityAccessLogReport {
  totalEvents: number;
  failedLoginsCount: number;
  suspiciousAccessCount: number;
  criticalAlertsCount: number;
  recentEvents: { id: string; timestamp: string; user: string; eventType: string; severity: string; ip: string }[];
}

// Admin Chart Points
export interface TradeFlowPoint {
  date: string;
  count: number;
  value: number; // In Million IRR
}

export interface RiskStackedBarItem {
  category: string;
  low: number;
  medium: number;
  high: number;
}

export interface ModerationSlaPoint {
  date: string;
  reviewVolume: number;
  avgMinutes: number;
}

export interface RejectionReasonBarItem {
  reason: string;
  count: number;
}

export interface UserActivityBubblePoint {
  userId: string;
  userName: string;
  tradeCount: number; // X
  volume: number;     // Y
  riskScore: number;  // Size
}

export interface GeoRegionItem {
  region: string;
  volume: number;
  userCount: number;
}

export interface FinancialTrendPoint {
  date: string;
  settled: number;
  fees: number;
}

export interface SecurityHeatmapCell {
  day: string; // e.g., 'شنبه', 'یکشنبه'...
  hour: number; // 0-23
  eventCount: number;
}

// ==================== DRILLDOWN CONTEXT & RESULT ====================

export interface DrilldownContext {
  title: string;
  sourceChart: string;
  filterKey: string;
  filterValue: any;
  extraMeta?: Record<string, any>;
}

export interface DrilldownTableRow {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  amount?: number;
  date?: string;
  status?: string;
  riskScore?: number;
  details?: string;
  [key: string]: any;
}

export interface DrilldownResult {
  context: DrilldownContext;
  totalRecords: number;
  summaryMetrics?: { label: string; value: string | number }[];
  miniChartData?: { x: string; y: number }[];
  rows: DrilldownTableRow[];
}
