import type {
  ReportsFilters,
  UserListingStatusReport,
  UserTransactionHistoryReport,
  UpcomingDueDateReport,
  ListingConversionReport,
  NotificationsAlertsReport,
  UserRiskAnalysisReport,
  MarketComparisonReport,
  DueDateTimelinePoint,
  ConversionFunnelStage,
  AmountDistributionBin,
  StatusDistributionItem,
  TransactionTrendPoint,
  RiskBubblePoint,
  AdminListingStatusReport,
  ModerationSlaReport,
  TradeRiskDistributionReport,
  RejectionReasonsReport,
  UserActivityRiskReport,
  GeographicalActivityReport,
  FinancialSettlementReport,
  SecurityAccessLogReport,
  TradeFlowPoint,
  RiskStackedBarItem,
  ModerationSlaPoint,
  RejectionReasonBarItem,
  UserActivityBubblePoint,
  GeoRegionItem,
  FinancialTrendPoint,
  SecurityHeatmapCell,
  DrilldownContext,
  DrilldownResult,
  DrilldownTableRow
} from '../types/reports.types';

// Helper for generating Persian dates or range labels
const daysOfWeek = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

// ================= USER REPORTS MOCK GENERATORS =================

export function generateUserReportsData(filters: ReportsFilters) {
  const listingStatus: UserListingStatusReport = {
    activeCount: 14,
    expiredCount: 3,
    pendingCount: 5,
    rejectedCount: 2,
    totalVolume: 4850000000,
    rejectionReasons: [
      { reason: 'نقص مدرک صیادی', count: 1 },
      { reason: 'عدم تطابق شماره صیاد با ملی', count: 1 }
    ]
  };

  const transactionHistory: UserTransactionHistoryReport = {
    totalCount: 18,
    settledVolume: 3200000000,
    pendingVolume: 1650000000,
    averageSettlementDays: 4.2,
    items: [
      { id: 'TX-101', listingTitle: 'چک بانک ملت - ۱۵۰ میلیون', counterparty: 'شرکت آریا تجارت', amount: 150000000, date: '1403/05/01', status: 'settled', settlementChannel: 'پایا' },
      { id: 'TX-102', listingTitle: 'چک بانک صادرات - ۳۰۰ میلیون', counterparty: 'سرمایه‌گذاری نوین', amount: 300000000, date: '1403/05/03', status: 'settled', settlementChannel: 'ساتنا' },
      { id: 'TX-103', listingTitle: 'چک بانک ملی - ۸۰ میلیون', counterparty: 'مهدی خسروی', amount: 80000000, date: '1403/05/05', status: 'pending', settlementChannel: 'درگاه شتاب' }
    ]
  };

  const upcomingDueDates: UpcomingDueDateReport = {
    dueIn7DaysCount: 3,
    dueIn7DaysAmount: 450000000,
    dueIn30DaysCount: 8,
    dueIn30DaysAmount: 1850000000,
    dueIn60DaysCount: 12,
    dueIn60DaysAmount: 2550000000,
    items: [
      { id: 'CHK-901', checkNumber: '8849201', bankName: 'بانک ملت', amount: 150000000, dueDate: '1403/05/12', daysRemaining: 3, riskScore: 18 },
      { id: 'CHK-902', checkNumber: '9920144', bankName: 'بانک پاسارگاد', amount: 200000000, dueDate: '1403/05/15', daysRemaining: 6, riskScore: 25 },
      { id: 'CHK-903', checkNumber: '1102938', bankName: 'بانک تجارت', amount: 100000000, dueDate: '1403/05/20', daysRemaining: 11, riskScore: 42 }
    ]
  };

  const conversion: ListingConversionReport = {
    totalViews: 1240,
    totalMatches: 86,
    totalDeals: 18,
    viewToMatchRate: 6.9,
    matchToDealRate: 20.9,
    overallConversionRate: 1.45
  };

  const notifications: NotificationsAlertsReport = {
    totalCount: 24,
    unreadCount: 4,
    byPriority: { low: 10, medium: 9, high: 5 },
    byType: [
      { type: 'تغییر وضعیت معامله', count: 12 },
      { type: 'تطابق جدید پیدا شد', count: 7 },
      { type: 'یادآوری سررسید', count: 5 }
    ]
  };

  const riskAnalysis: UserRiskAnalysisReport = {
    userOverallRiskLevel: 'low',
    riskScore: 22,
    riskFactors: [
      'سابقه تسویه منظم در ۱۰ معامله گذشته',
      'تاییدیه نهایی اعتبارسنجی صیادی (وضعیت سفید)',
      'عدم ثبت چک برگشتی در سامانه'
    ],
    riskAdvice: [
      'جهت کاهش بیشتر نرخ کارمزد می‌توانید حساب ضامن رسمی معرفی کنید.',
      'تکمیل کامل مدارک احراز هویت حقوقی امکان معامله چک تا ۵ میلیارد را فعال می‌کند.'
    ]
  };

  const marketComparison: MarketComparisonReport = {
    userAvgDiscountRate: 2.1,
    marketAvgDiscountRate: 2.6,
    userAvgSettlementTime: 3.8,
    marketAvgSettlementTime: 5.2,
    userDefaultRate: 0.0,
    marketDefaultRate: 1.8
  };

  return {
    listingStatus,
    transactionHistory,
    upcomingDueDates,
    conversion,
    notifications,
    riskAnalysis,
    marketComparison
  };
}

export function generateUserChartsData(filters: ReportsFilters) {
  // Chart 1: Due Date Timeline
  const dueDateTimeline: DueDateTimelinePoint[] = [
    { date: '1403/05/01', count: 2, totalAmount: 220000000 },
    { date: '1403/05/05', count: 4, totalAmount: 650000000 },
    { date: '1403/05/10', count: 3, totalAmount: 410000000 },
    { date: '1403/05/15', count: 6, totalAmount: 1200000000 },
    { date: '1403/05/20', count: 2, totalAmount: 380000000 },
    { date: '1403/05/25', count: 5, totalAmount: 950000000 },
    { date: '1403/05/30', count: 3, totalAmount: 500000000 }
  ];

  // Chart 2: Conversion Funnel
  const conversionFunnel: ConversionFunnelStage[] = [
    { stage: 'بازدید از آگهی‌ها', value: 1240 },
    { stage: 'درخواست ابراز تمایل', value: 310 },
    { stage: 'تطابق موقت (Match)', value: 86 },
    { stage: 'تبادل مدارک و نهایی‌سازی', value: 32 },
    { stage: 'معامله موفق (Deal)', value: 18 }
  ];

  // Chart 3: Amount Distribution
  const amountDistribution: AmountDistributionBin[] = [
    { rangeLabel: 'زیر ۵۰ میلیون', minVal: 0, maxVal: 50, count: 8 },
    { rangeLabel: '۵۰ تا ۱۰۰ میلیون', minVal: 50, maxVal: 100, count: 12 },
    { rangeLabel: '۱۰۰ تا ۲۵۰ میلیون', minVal: 100, maxVal: 250, count: 15 },
    { rangeLabel: '۲۵۰ تا ۵۰۰ میلیون', minVal: 250, maxVal: 500, count: 7 },
    { rangeLabel: 'بالای ۵۰۰ میلیون', minVal: 500, maxVal: 5000, count: 3 }
  ];

  // Chart 4: Listing Status
  const statusDistribution: StatusDistributionItem[] = [
    { status: 'active', label: 'فعال در بازار', count: 14, percentage: 58.3 },
    { status: 'pending', label: 'در انتظار بررسی', count: 5, percentage: 20.8 },
    { status: 'expired', label: 'منقضی شده', count: 3, percentage: 12.5 },
    { status: 'rejected', label: 'رد شده', count: 2, percentage: 8.4 }
  ];

  // Chart 5: Transaction Trend
  const transactionTrend: TransactionTrendPoint[] = [
    { date: 'فروردین', amount: 850000000, count: 4 },
    { date: 'اردیبهشت', amount: 1200000000, count: 6 },
    { date: 'خرداد', amount: 980000000, count: 5 },
    { date: 'تیر', amount: 1600000000, count: 9 },
    { date: 'مرداد', amount: 2100000000, count: 11 },
    { date: 'شهریور', amount: 1800000000, count: 8 }
  ];

  // Chart 6: Risk Bubble
  const riskBubbles: RiskBubblePoint[] = [
    { id: '1', checkNumber: '99812', daysToDue: 5, riskScore: 18, amount: 120000000, riskLevel: 'low' },
    { id: '2', checkNumber: '88102', daysToDue: 12, riskScore: 28, amount: 350000000, riskLevel: 'low' },
    { id: '3', checkNumber: '77291', daysToDue: 18, riskScore: 45, amount: 200000000, riskLevel: 'medium' },
    { id: '4', checkNumber: '66103', daysToDue: 25, riskScore: 68, amount: 500000000, riskLevel: 'high' },
    { id: '5', checkNumber: '55192', daysToDue: 32, riskScore: 32, amount: 150000000, riskLevel: 'low' },
    { id: '6', checkNumber: '44018', daysToDue: 45, riskScore: 78, amount: 800000000, riskLevel: 'high' }
  ];

  return {
    dueDateTimeline,
    conversionFunnel,
    amountDistribution,
    statusDistribution,
    transactionTrend,
    riskBubbles
  };
}

// ================= ADMIN REPORTS MOCK GENERATORS =================

export function generateAdminReportsData(filters: ReportsFilters) {
  const listingStatus: AdminListingStatusReport = {
    totalListings: 432,
    activeListings: 210,
    pendingListings: 38,
    tradedListings: 154,
    rejectedListings: 30,
    regionalBreakdown: [
      { province: 'تهران', count: 180, volume: 45000000000 },
      { province: 'اصفهان', count: 75, volume: 18000000000 },
      { province: 'خراسان رضوی', count: 60, volume: 14000000000 },
      { province: 'فارس', count: 45, volume: 11000000000 },
      { province: 'آذربایجان شرقی', count: 35, volume: 8500000000 }
    ]
  };

  const moderationSla: ModerationSlaReport = {
    totalReviews: 820,
    avgReviewTimeMinutes: 14.5,
    slaMetPercentage: 94.2,
    moderatorStats: [
      { moderatorId: 'MOD-1', name: 'علی رضایی', reviewedCount: 310, avgTimeMin: 11.2, slaMetRate: 97.5 },
      { moderatorId: 'MOD-2', name: 'مریم نوری', reviewedCount: 280, avgTimeMin: 14.8, slaMetRate: 94.1 },
      { moderatorId: 'MOD-3', name: 'سارا احمدی', reviewedCount: 230, avgTimeMin: 18.1, slaMetRate: 91.0 }
    ]
  };

  const tradeRiskDistribution: TradeRiskDistributionReport = {
    lowRiskCount: 285,
    mediumRiskCount: 112,
    highRiskCount: 35,
    byCity: [
      { city: 'تهران', highRiskCount: 14 },
      { city: 'اصفهان', highRiskCount: 7 },
      { city: 'مشهد', highRiskCount: 6 },
      { city: 'شیراز', highRiskCount: 4 }
    ]
  };

  const rejectionReasons: RejectionReasonsReport = {
    totalRejections: 64,
    reasons: [
      { category: 'مدارک صیادی', reasonText: 'تصویر استعلام صیادی نامفهوم یا فاقد بارکد', count: 28, percentage: 43.75 },
      { category: 'شناسه ملی/هویت', reasonText: 'عدم تطابق نام دارنده چک با حساب کاربر', count: 18, percentage: 28.1 },
      { category: 'ارزش و مبلغ', reasonText: 'ثبت مبلغ مغایر با تصویر برگ چک', count: 12, percentage: 18.75 },
      { category: 'امضا و اصالت', reasonText: 'ابهام در اثر انگشت یا امضای روی چک', count: 6, percentage: 9.4 }
    ]
  };

  const userActivityRisk: UserActivityRiskReport = {
    totalActiveUsers: 1240,
    highRiskUsersCount: 18,
    topTradedVolumeUsers: [
      { userId: 'USR-881', name: 'شرکت بازرگانی کاسپین', volume: 18500000000, riskScore: 12 },
      { userId: 'USR-442', name: 'حسین فاضلی (صرافی)', volume: 14200000000, riskScore: 24 },
      { userId: 'USR-109', name: 'تولیدی فولاد البرز', volume: 11000000000, riskScore: 18 }
    ]
  };

  const geographicalActivity: GeographicalActivityReport = {
    provincesCount: 28,
    topProvinces: [
      { province: 'تهران', userCount: 540, tradeVolume: 52000000000 },
      { province: 'اصفهان', userCount: 210, tradeVolume: 21000000000 },
      { province: 'خراسان رضوی', userCount: 180, tradeVolume: 16500000000 },
      { province: 'فارس', userCount: 120, tradeVolume: 12000000000 }
    ]
  };

  const financialSettlement: FinancialSettlementReport = {
    totalPlatformFees: 1850000000,
    settledVolume: 82000000000,
    unsettledVolume: 14500000000,
    channelBreakdown: [
      { channel: 'ساتنا (درگاه مستقیم)', volume: 48000000000, fee: 1080000000 },
      { channel: 'پایا (کیف پول)', volume: 24000000000, fee: 540000000 },
      { channel: 'درگاه پرداخت شتاب', volume: 10000000000, fee: 230000000 }
    ]
  };

  const securityAccessLog: SecurityAccessLogReport = {
    totalEvents: 3410,
    failedLoginsCount: 142,
    suspiciousAccessCount: 18,
    criticalAlertsCount: 3,
    recentEvents: [
      { id: 'SEC-901', timestamp: '1403/05/06 14:22', user: 'admin_audit', eventType: 'تلاش ورود ناموفق متوالی', severity: 'high', ip: '185.190.14.2' },
      { id: 'SEC-902', timestamp: '1403/05/06 13:05', user: 'USR-771', eventType: 'تغییر IP ناگهانی در جلسه فعال', severity: 'medium', ip: '5.160.22.109' },
      { id: 'SEC-903', timestamp: '1403/05/06 11:40', user: 'system', eventType: 'بررسی فیچرفلگ‌ها توسط مدیر', severity: 'low', ip: '10.0.4.12' }
    ]
  };

  return {
    listingStatus,
    moderationSla,
    tradeRiskDistribution,
    rejectionReasons,
    userActivityRisk,
    geographicalActivity,
    financialSettlement,
    securityAccessLog
  };
}

export function generateAdminChartsData(filters: ReportsFilters) {
  // Chart 1: Trade Flow (Count vs Value)
  const tradeFlow: TradeFlowPoint[] = [
    { date: '1403/05/01', count: 18, value: 4200 },
    { date: '1403/05/02', count: 24, value: 5800 },
    { date: '1403/05/03', count: 31, value: 7100 },
    { date: '1403/05/04', count: 22, value: 5100 },
    { date: '1403/05/05', count: 39, value: 9400 },
    { date: '1403/05/06', count: 45, value: 11200 },
    { date: '1403/05/07', count: 28, value: 6900 }
  ];

  // Chart 2: Risk Distribution Stacked Bar
  const riskStackedBars: RiskStackedBarItem[] = [
    { category: 'تهران', low: 120, medium: 45, high: 15 },
    { category: 'اصفهان', category_fa: 'اصفهان', low: 60, medium: 18, high: 7 } as any,
    { category: 'مشهد', low: 45, medium: 14, high: 6 },
    { category: 'شیراز', low: 35, medium: 10, high: 4 },
    { category: 'تبریز', low: 25, medium: 8, high: 3 }
  ];

  // Chart 3: Moderation SLA Performance (Mixed)
  const moderationSlaPoints: ModerationSlaPoint[] = [
    { date: 'شنبه', reviewVolume: 120, avgMinutes: 12 },
    { date: 'یکشنبه', reviewVolume: 150, avgMinutes: 14 },
    { date: 'دوشنبه', reviewVolume: 180, avgMinutes: 18 },
    { date: 'سه‌شنبه', reviewVolume: 140, avgMinutes: 11 },
    { date: 'چهارشنبه', reviewVolume: 165, avgMinutes: 13 },
    { date: 'پنج‌شنبه', reviewVolume: 90, avgMinutes: 9 }
  ];

  // Chart 4: Rejection Reasons Bar
  const rejectionReasonBars: RejectionReasonBarItem[] = [
    { reason: 'نقص تصویر صیادی', count: 28 },
    { reason: 'عدم تطابق نام با کدملی', count: 18 },
    { reason: 'مغایرت مبلغ چک', count: 12 },
    { reason: 'ابهام در امضا/اثر انگشت', count: 6 }
  ];

  // Chart 5: User Activity & Risk Scatter
  const userActivityBubbles: UserActivityBubblePoint[] = [
    { userId: 'U1', userName: 'کاسپین تجارت', tradeCount: 42, volume: 18500, riskScore: 12 },
    { userId: 'U2', userName: 'صرافی خسروی', tradeCount: 38, volume: 14200, riskScore: 24 },
    { userId: 'U3', userName: 'فولاد البرز', tradeCount: 29, volume: 11000, riskScore: 18 },
    { userId: 'U4', userName: 'پخش رازی', tradeCount: 18, volume: 6500, riskScore: 58 },
    { userId: 'U5', userName: 'جهان خودرو', tradeCount: 12, volume: 4200, riskScore: 72 },
    { userId: 'U6', userName: 'نیما عباسی', tradeCount: 8, volume: 2100, riskScore: 84 }
  ];

  // Chart 6: Geographical Activity
  const geoRegions: GeoRegionItem[] = [
    { region: 'تهران', volume: 52000, userCount: 540 },
    { region: 'اصفهان', volume: 21000, userCount: 210 },
    { region: 'خراسان رضوی', volume: 16500, userCount: 180 },
    { region: 'فارس', volume: 12000, userCount: 120 },
    { region: 'آذربایجان شرقی', volume: 8500, userCount: 95 },
    { region: 'مازندران', volume: 6200, userCount: 70 }
  ];

  // Chart 7: Financial Trend
  const financialTrends: FinancialTrendPoint[] = [
    { date: 'فروردین', settled: 12000, fees: 270 },
    { date: 'اردیبهشت', settled: 18000, fees: 410 },
    { date: 'خرداد', settled: 15000, fees: 340 },
    { date: 'تیر', settled: 22000, fees: 510 },
    { date: 'مرداد', settled: 28000, fees: 640 }
  ];

  // Chart 8: Security Heatmap (Day x Hour)
  const securityHeatmap: SecurityHeatmapCell[] = [];
  daysOfWeek.forEach((day) => {
    [0, 4, 8, 12, 16, 20].forEach((hour) => {
      // Simulate higher activity/logins around 8-16
      const base = (hour >= 8 && hour <= 16) ? Math.floor(Math.random() * 25) + 10 : Math.floor(Math.random() * 5);
      securityHeatmap.push({ day, hour, eventCount: base });
    });
  });

  return {
    tradeFlow,
    riskStackedBars,
    moderationSlaPoints,
    rejectionReasonBars,
    userActivityBubbles,
    geoRegions,
    financialTrends,
    securityHeatmap
  };
}

// ================= DRILLDOWN MOCK GENERATOR =================

export function generateDrilldownData(context: DrilldownContext): DrilldownResult {
  const mockRows: DrilldownTableRow[] = [];
  const count = 12;

  for (let i = 1; i <= count; i++) {
    mockRows.push({
      id: `REC-${1000 + i}`,
      title: `رکورد تفصیلی شماره ${i} (${context.filterKey}: ${context.filterValue})`,
      subtitle: `منبع تحلیل: ${context.sourceChart}`,
      category: context.filterValue || 'عمومی',
      amount: Math.floor(Math.random() * 400 + 50) * 1000000,
      date: `1403/05/${(i % 28) + 1}`,
      status: i % 3 === 0 ? 'موفق' : i % 3 === 1 ? 'در حال بررسی' : 'پایان یافته',
      riskScore: Math.floor(Math.random() * 80 + 10),
      details: `جزئیات کامل تراکنش مربوط به درخواست در بخش ${context.title}`
    });
  }

  return {
    context,
    totalRecords: count,
    summaryMetrics: [
      { label: 'تعداد کل موارد جزئیات', value: count },
      { label: 'کل حجم برآورد شده', value: '۱,850,000,000 تومان' },
      { label: 'میانگین ریسک محاسبه‌شده', value: '۲۶٪' }
    ],
    miniChartData: [
      { x: 'گروه ۱', y: 35 },
      { x: 'گروه ۲', y: 65 },
      { x: 'گروه ۳', y: 45 },
      { x: 'گروه ۴', y: 80 }
    ],
    rows: mockRows
  };
}
