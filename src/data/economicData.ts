import {
  SectorPerformance,
  EconomicIndicator,
  GdpQuarterData,
  GlobalGdpComparison,
  TradeBalanceData
} from '../types/terminal';

// 11 S&P 500 GICS Sectors with Performance & Weights
export const SECTOR_PERFORMANCE_DATA: SectorPerformance[] = [
  {
    name: 'Information Technology',
    code: 'XLK',
    change1D: 1.42,
    change1W: 3.15,
    change1M: 6.80,
    changeYTD: 24.50,
    marketWeightPct: 32.4,
    topStock: 'NVDA (+0.9%)',
    sentiment: 'BULLISH'
  },
  {
    name: 'Communication Services',
    code: 'XLC',
    change1D: 0.88,
    change1W: 2.40,
    change1M: 5.10,
    changeYTD: 21.20,
    marketWeightPct: 9.2,
    topStock: 'GOOGL (+1.3%)',
    sentiment: 'BULLISH'
  },
  {
    name: 'Financials',
    code: 'XLF',
    change1D: 0.65,
    change1W: 1.80,
    change1M: 4.25,
    changeYTD: 18.90,
    marketWeightPct: 13.1,
    topStock: 'JPM (+0.8%)',
    sentiment: 'BULLISH'
  },
  {
    name: 'Consumer Discretionary',
    code: 'XLY',
    change1D: 1.25,
    change1W: 2.90,
    change1M: 4.60,
    changeYTD: 16.40,
    marketWeightPct: 10.3,
    topStock: 'TSLA (+4.0%)',
    sentiment: 'BULLISH'
  },
  {
    name: 'Industrials',
    code: 'XLI',
    change1D: 0.35,
    change1W: 0.95,
    change1M: 2.80,
    changeYTD: 14.10,
    marketWeightPct: 8.5,
    topStock: 'CAT (+0.4%)',
    sentiment: 'NEUTRAL'
  },
  {
    name: 'Health Care',
    code: 'XLV',
    change1D: -0.15,
    change1W: 0.40,
    change1M: 1.90,
    changeYTD: 11.20,
    marketWeightPct: 11.6,
    topStock: 'LLY (+0.5%)',
    sentiment: 'NEUTRAL'
  },
  {
    name: 'Energy',
    code: 'XLE',
    change1D: 1.10,
    change1W: 1.65,
    change1M: -0.80,
    changeYTD: 8.40,
    marketWeightPct: 3.8,
    topStock: 'XOM (+1.2%)',
    sentiment: 'NEUTRAL'
  },
  {
    name: 'Materials',
    code: 'XLB',
    change1D: 0.20,
    change1W: 0.60,
    change1M: 1.40,
    changeYTD: 7.90,
    marketWeightPct: 2.4,
    topStock: 'LIN (+0.3%)',
    sentiment: 'NEUTRAL'
  },
  {
    name: 'Utilities',
    code: 'XLU',
    change1D: -0.45,
    change1W: -1.10,
    change1M: 2.10,
    changeYTD: 15.60,
    marketWeightPct: 2.5,
    topStock: 'NEE (-0.6%)',
    sentiment: 'BEARISH'
  },
  {
    name: 'Consumer Staples',
    code: 'XLP',
    change1D: -0.25,
    change1W: -0.50,
    change1M: 0.90,
    changeYTD: 6.20,
    marketWeightPct: 5.7,
    topStock: 'PG (-0.2%)',
    sentiment: 'BEARISH'
  },
  {
    name: 'Real Estate',
    code: 'XLRE',
    change1D: -0.70,
    change1W: -1.85,
    change1M: -1.20,
    changeYTD: 3.40,
    marketWeightPct: 2.1,
    topStock: 'PLD (-0.8%)',
    sentiment: 'BEARISH'
  }
];

// Major Domestic & Global Economic Indicator Reports (Calendar & Actuals)
export const ECONOMIC_INDICATORS: EconomicIndicator[] = [
  {
    id: 'eco-001',
    name: 'US Consumer Price Index (CPI YoY)',
    country: 'US',
    category: 'INFLATION',
    period: 'Sep 2026',
    actual: '2.7%',
    forecast: '2.8%',
    prior: '2.9%',
    unit: '% YoY',
    impact: 'CRITICAL',
    trend: 'DOWN',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-002',
    name: 'Core PCE Price Index (Fed Target Gauge)',
    country: 'US',
    category: 'INFLATION',
    period: 'Aug 2026',
    actual: '2.6%',
    forecast: '2.6%',
    prior: '2.7%',
    unit: '% YoY',
    impact: 'CRITICAL',
    trend: 'DOWN',
    surprise: 'IN_LINE',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-003',
    name: 'Non-Farm Payrolls (Employment)',
    country: 'US',
    category: 'LABOR',
    period: 'Sep 2026',
    actual: '+185K',
    forecast: '+160K',
    prior: '+152K',
    unit: 'Jobs Net',
    impact: 'CRITICAL',
    trend: 'UP',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-004',
    name: 'US Unemployment Rate (U-3)',
    country: 'US',
    category: 'LABOR',
    period: 'Sep 2026',
    actual: '4.1%',
    forecast: '4.2%',
    prior: '4.2%',
    unit: '%',
    impact: 'HIGH',
    trend: 'DOWN',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-005',
    name: 'Real GDP Annualized Growth (Q3 Adv)',
    country: 'US',
    category: 'GROWTH',
    period: 'Q3 2026',
    actual: '2.8%',
    forecast: '2.6%',
    prior: '3.0%',
    unit: '% QoQ Ann',
    impact: 'CRITICAL',
    trend: 'STABLE',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-006',
    name: 'US Retail Sales (MoM Advance)',
    country: 'US',
    category: 'GROWTH',
    period: 'Sep 2026',
    actual: '+0.4%',
    forecast: '+0.3%',
    prior: '+0.1%',
    unit: '% MoM',
    impact: 'HIGH',
    trend: 'UP',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-007',
    name: 'ISM Services PMI (Non-Manufacturing)',
    country: 'US',
    category: 'SURVEY',
    period: 'Sep 2026',
    actual: '53.4',
    forecast: '52.0',
    prior: '51.5',
    unit: 'Index (50=Neutral)',
    impact: 'HIGH',
    trend: 'UP',
    surprise: 'BEAT',
    releaseTime: '10:00 EDT'
  },
  {
    id: 'eco-008',
    name: 'ISM Manufacturing PMI (Factory Output)',
    country: 'US',
    category: 'SURVEY',
    period: 'Sep 2026',
    actual: '49.8',
    forecast: '49.2',
    prior: '48.6',
    unit: 'Index (50=Neutral)',
    impact: 'HIGH',
    trend: 'UP',
    surprise: 'BEAT',
    releaseTime: '10:00 EDT'
  },
  {
    id: 'eco-009',
    name: 'Federal Funds Target Rate (Upper Bound)',
    country: 'US',
    category: 'CENTRAL_BANK',
    period: 'Current',
    actual: '4.75%',
    forecast: '4.75%',
    prior: '5.00%',
    unit: '%',
    impact: 'CRITICAL',
    trend: 'DOWN',
    surprise: 'IN_LINE',
    releaseTime: '14:00 EDT'
  },
  {
    id: 'eco-010',
    name: 'US Trade Deficit (Goods & Services)',
    country: 'US',
    category: 'TRADE',
    period: 'Aug 2026',
    actual: '-$67.8B',
    forecast: '-$70.2B',
    prior: '-$71.5B',
    unit: '$ Billions',
    impact: 'HIGH',
    trend: 'UP',
    surprise: 'BEAT',
    releaseTime: '08:30 EDT'
  },
  {
    id: 'eco-011',
    name: 'Eurozone Harmonised CPI (HICP YoY)',
    country: 'EZ',
    category: 'INFLATION',
    period: 'Sep 2026',
    actual: '2.1%',
    forecast: '2.2%',
    prior: '2.2%',
    unit: '% YoY',
    impact: 'HIGH',
    trend: 'DOWN',
    surprise: 'BEAT',
    releaseTime: '05:00 EDT'
  },
  {
    id: 'eco-012',
    name: 'ECB Deposit Facility Rate',
    country: 'EZ',
    category: 'CENTRAL_BANK',
    period: 'Current',
    actual: '3.25%',
    forecast: '3.25%',
    prior: '3.50%',
    unit: '%',
    impact: 'HIGH',
    trend: 'DOWN',
    surprise: 'IN_LINE',
    releaseTime: '08:15 EDT'
  }
];

// US Real GDP Quarterly Historical Series (Past 5 Quarters) & Component Contributions
export const US_GDP_QUARTERLY_SERIES: GdpQuarterData[] = [
  {
    quarter: 'Q3 2026 (Adv)',
    realGdpGrowthPct: 2.8,
    personalConsumptionPct: 2.2,
    privateInvestmentPct: 0.5,
    governmentSpendingPct: 0.4,
    netExportsPct: -0.3
  },
  {
    quarter: 'Q2 2026',
    realGdpGrowthPct: 3.0,
    personalConsumptionPct: 2.4,
    privateInvestmentPct: 0.7,
    governmentSpendingPct: 0.3,
    netExportsPct: -0.4
  },
  {
    quarter: 'Q1 2026',
    realGdpGrowthPct: 1.9,
    personalConsumptionPct: 1.5,
    privateInvestmentPct: 0.2,
    governmentSpendingPct: 0.5,
    netExportsPct: -0.3
  },
  {
    quarter: 'Q4 2025',
    realGdpGrowthPct: 3.4,
    personalConsumptionPct: 2.6,
    privateInvestmentPct: 0.8,
    governmentSpendingPct: 0.4,
    netExportsPct: -0.4
  },
  {
    quarter: 'Q3 2025',
    realGdpGrowthPct: 2.6,
    personalConsumptionPct: 1.9,
    privateInvestmentPct: 0.6,
    governmentSpendingPct: 0.4,
    netExportsPct: -0.3
  }
];

// Global GDP Comparison Across G7 and Major Economies
export const GLOBAL_GDP_COMPARISON: GlobalGdpComparison[] = [
  {
    country: 'United States',
    flag: '🇺🇸',
    nominalGdpUsdTrillion: 29.8,
    annualGrowthPct: 2.8,
    inflationPct: 2.7,
    policyRatePct: 4.75
  },
  {
    country: 'China',
    flag: '🇨🇳',
    nominalGdpUsdTrillion: 19.4,
    annualGrowthPct: 4.9,
    inflationPct: 0.5,
    policyRatePct: 3.10
  },
  {
    country: 'Eurozone',
    flag: '🇪🇺',
    nominalGdpUsdTrillion: 16.5,
    annualGrowthPct: 1.1,
    inflationPct: 2.1,
    policyRatePct: 3.25
  },
  {
    country: 'Germany',
    flag: '🇩🇪',
    nominalGdpUsdTrillion: 4.8,
    annualGrowthPct: 0.4,
    inflationPct: 2.0,
    policyRatePct: 3.25
  },
  {
    country: 'Japan',
    flag: '🇯🇵',
    nominalGdpUsdTrillion: 4.4,
    annualGrowthPct: 0.9,
    inflationPct: 2.5,
    policyRatePct: 0.25
  },
  {
    country: 'India',
    flag: '🇮🇳',
    nominalGdpUsdTrillion: 4.2,
    annualGrowthPct: 6.8,
    inflationPct: 4.6,
    policyRatePct: 6.50
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    nominalGdpUsdTrillion: 3.6,
    annualGrowthPct: 1.2,
    inflationPct: 2.4,
    policyRatePct: 4.75
  }
];

// US International Trade & Imports / Exports Monthly Balance Series ($ Billions)
export const US_TRADE_BALANCE_SERIES: TradeBalanceData[] = [
  { period: 'Aug 2026', exportsBln: 268.4, importsBln: 336.2, balanceBln: -67.8 },
  { period: 'Jul 2026', exportsBln: 265.1, importsBln: 336.6, balanceBln: -71.5 },
  { period: 'Jun 2026', exportsBln: 263.8, importsBln: 337.0, balanceBln: -73.2 },
  { period: 'May 2026', exportsBln: 262.0, importsBln: 335.8, balanceBln: -73.8 },
  { period: 'Apr 2026', exportsBln: 260.5, importsBln: 334.2, balanceBln: -73.7 },
  { period: 'Mar 2026', exportsBln: 258.9, importsBln: 331.4, balanceBln: -72.5 }
];

// Breakdown of Major US Export and Import Product Categories
export const TRADE_CATEGORIES_BREAKDOWN = {
  topExports: [
    { category: 'Capital Goods & Aircraft', valueBln: 62.4, pctShare: 23.2 },
    { category: 'Industrial Supplies & Petroleum', valueBln: 58.6, pctShare: 21.8 },
    { category: 'Commercial Services & IP', valueBln: 48.2, pctShare: 18.0 },
    { category: 'Semiconductors & Electronics', valueBln: 38.5, pctShare: 14.3 },
    { category: 'Automotive & Parts', valueBln: 19.8, pctShare: 7.4 }
  ],
  topImports: [
    { category: 'Consumer Goods (Tech & Apparel)', valueBln: 74.2, pctShare: 22.1 },
    { category: 'Capital Equipment & Computers', valueBln: 68.5, pctShare: 20.4 },
    { category: 'Automotive Vehicles & Parts', valueBln: 44.1, pctShare: 13.1 },
    { category: 'Industrial Supplies & Chem', valueBln: 41.8, pctShare: 12.4 },
    { category: 'Pharmaceutical Preparations', valueBln: 28.6, pctShare: 8.5 }
  ]
};

// Multi-Asset Benchmark Universe Overview (Equities, Rates, Commodities, FX, Crypto)
export interface MultiAssetItem {
  symbol: string;
  name: string;
  assetClass: 'EQUITY' | 'RATE' | 'COMMODITY' | 'FX' | 'CRYPTO';
  last: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  unit: string;
}

export const MULTI_ASSET_BENCHMARKS: MultiAssetItem[] = [
  // Equities
  { symbol: 'SPX', name: 'S&P 500 Index', assetClass: 'EQUITY', last: 5885.50, change: 32.40, changePct: 0.55, high: 5898.20, low: 5860.10, unit: 'pts' },
  { symbol: 'NDX', name: 'Nasdaq 100 Index', assetClass: 'EQUITY', last: 20490.80, change: 168.20, changePct: 0.83, high: 20540.00, low: 20380.50, unit: 'pts' },
  { symbol: 'DJI', name: 'Dow Jones Industrial', assetClass: 'EQUITY', last: 43215.00, change: 145.00, changePct: 0.34, high: 43290.00, low: 43100.00, unit: 'pts' },
  { symbol: 'RUT', name: 'Russell 2000 Small-Cap', assetClass: 'EQUITY', last: 2280.40, change: 18.20, changePct: 0.80, high: 2292.00, low: 2268.00, unit: 'pts' },
  { symbol: 'FTSE', name: 'FTSE 100 (London)', assetClass: 'EQUITY', last: 8245.30, change: 24.10, changePct: 0.29, high: 8260.00, low: 8220.00, unit: 'pts' },
  { symbol: 'N225', name: 'Nikkei 225 (Tokyo)', assetClass: 'EQUITY', last: 39120.00, change: 280.00, changePct: 0.72, high: 39250.00, low: 38900.00, unit: 'pts' },

  // Rates
  { symbol: 'US02Y', name: 'US 2-Year Treasury', assetClass: 'RATE', last: 4.52, change: 0.04, changePct: 0.89, high: 4.54, low: 4.48, unit: '%' },
  { symbol: 'US10Y', name: 'US 10-Year Benchmark', assetClass: 'RATE', last: 4.99, change: 0.05, changePct: 1.01, high: 5.01, low: 4.94, unit: '%' },
  { symbol: 'US30Y', name: 'US 30-Year Bond', assetClass: 'RATE', last: 5.18, change: 0.04, changePct: 0.78, high: 5.20, low: 5.14, unit: '%' },
  { symbol: 'DE10Y', name: 'German 10Y Bund', assetClass: 'RATE', last: 2.38, change: 0.02, changePct: 0.85, high: 2.40, low: 2.35, unit: '%' },
  { symbol: 'JP10Y', name: 'Japan 10Y JGB', assetClass: 'RATE', last: 1.02, change: 0.01, changePct: 0.99, high: 1.03, low: 1.00, unit: '%' },

  // Commodities
  { symbol: 'CL1', name: 'WTI Crude Oil', assetClass: 'COMMODITY', last: 101.40, change: 1.84, changePct: 1.85, high: 102.40, low: 98.90, unit: '$/bbl' },
  { symbol: 'CO1', name: 'Brent Crude Oil', assetClass: 'COMMODITY', last: 105.80, change: 1.95, changePct: 1.88, high: 106.90, low: 103.40, unit: '$/bbl' },
  { symbol: 'XAU', name: 'Gold Spot Bullion', assetClass: 'COMMODITY', last: 4075.40, change: 37.00, changePct: 0.92, high: 4079.00, low: 4001.60, unit: '$/oz' },
  { symbol: 'XAG', name: 'Silver Spot', assetClass: 'COMMODITY', last: 48.60, change: 0.75, changePct: 1.57, high: 49.10, low: 47.50, unit: '$/oz' },
  { symbol: 'HG1', name: 'Copper Futures', assetClass: 'COMMODITY', last: 4.65, change: 0.06, changePct: 1.31, high: 4.70, low: 4.58, unit: '$/lb' },
  { symbol: 'NG1', name: 'Natural Gas', assetClass: 'COMMODITY', last: 2.85, change: -0.04, changePct: -1.38, high: 2.92, low: 2.81, unit: '$/MMBtu' },

  // FX / Currencies
  { symbol: 'DXY', name: 'US Dollar Index', assetClass: 'FX', last: 103.85, change: 0.22, changePct: 0.21, high: 104.10, low: 103.50, unit: 'idx' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', assetClass: 'FX', last: 1.0825, change: -0.0022, changePct: -0.20, high: 1.0860, low: 1.0815, unit: 'FX' },
  { symbol: 'USDJPY', name: 'US Dollar / Yen', assetClass: 'FX', last: 153.40, change: 0.55, changePct: 0.36, high: 153.85, low: 152.70, unit: 'FX' },
  { symbol: 'GBPUSD', name: 'British Pound / USD', assetClass: 'FX', last: 1.2980, change: -0.0018, changePct: -0.14, high: 1.3020, low: 1.2965, unit: 'FX' },
  { symbol: 'USDCHF', name: 'US Dollar / Franc', assetClass: 'FX', last: 0.8670, change: 0.0015, changePct: 0.17, high: 0.8690, low: 0.8645, unit: 'FX' },

  // Crypto
  { symbol: 'BTCUSD', name: 'Bitcoin (USD)', assetClass: 'CRYPTO', last: 80650.00, change: 940.00, changePct: 1.18, high: 80710.00, low: 79380.00, unit: '$' },
  { symbol: 'ETHUSD', name: 'Ethereum (USD)', assetClass: 'CRYPTO', last: 3820.00, change: 65.00, changePct: 1.73, high: 3855.00, low: 3740.00, unit: '$' },
  { symbol: 'SOLUSD', name: 'Solana (USD)', assetClass: 'CRYPTO', last: 245.50, change: 7.20, changePct: 3.02, high: 248.00, low: 236.00, unit: '$' }
];

// Major Economic & Market News Bulletins (Compact Feed for Dashboard)
export interface DashboardNewsItem {
  id: string;
  time: string;
  category: 'MACRO' | 'CENTRAL_BANK' | 'EQUITIES' | 'TRADE' | 'COMMODITIES';
  headline: string;
  summary: string;
  urgency: 'FLASH' | 'BULLETIN' | 'REGULAR';
  impactTicker?: string;
}

export const DASHBOARD_NEWS_ITEMS: DashboardNewsItem[] = [
  {
    id: 'dnews-1',
    time: '13:15 EDT',
    category: 'MACRO',
    headline: 'US Q3 GDP ADVANCE ESTIMATE PRINTS +2.8% ANNUALIZED BEATING FORECASTS',
    summary: 'Consumer spending grew at a robust 2.2% pace while private tech infrastructure investment offset mild drags from residential fixed investment.',
    urgency: 'FLASH',
    impactTicker: 'SPX'
  },
  {
    id: 'dnews-2',
    time: '12:45 EDT',
    category: 'TRADE',
    headline: 'US TRADE DEFICIT NARROWS TO -$67.8B ON RECORD SEMICONDUCTOR & AIRCRAFT EXPORTS',
    summary: 'Department of Commerce reports capital goods shipments abroad climbed 3.4% month-over-month, supported by high-value accelerated compute systems.',
    urgency: 'BULLETIN',
    impactTicker: 'NVDA'
  },
  {
    id: 'dnews-3',
    time: '12:10 EDT',
    category: 'CENTRAL_BANK',
    headline: 'FED FUNDS DESK SEES 78% PROBABILITY OF 25 BPS RATE REDUCTION AT NOVEMBER FOMC',
    summary: 'Swap markets priced in steady disinflation trajectory as Core PCE held at 2.6% YoY with labor market remaining in balanced equilibrium.',
    urgency: 'BULLETIN',
    impactTicker: 'US10Y'
  },
  {
    id: 'dnews-4',
    time: '11:35 EDT',
    category: 'COMMODITIES',
    headline: 'GOLD REACHES $4,075/OZ RECORD LEVEL AS CENTRAL BANKS EXPAND BULLION RESERVES',
    summary: 'Sovereign wealth funds and global central banks added net 42 metric tons in Q3 trade, hedging currency debasement and term premia.',
    urgency: 'REGULAR',
    impactTicker: 'XAU'
  },
  {
    id: 'dnews-5',
    time: '10:50 EDT',
    category: 'EQUITIES',
    headline: 'TECH LEADERSHIP EXTENDS AS MAG 7 NET CASH PILE SURPASSES $720 BILLION',
    summary: 'Cash flow generation across top enterprise cloud and semiconductor leaders remains at historical highs, powering ongoing dividend and buyback accretion.',
    urgency: 'REGULAR',
    impactTicker: 'MSFT'
  }
];
