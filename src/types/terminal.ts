export type AssetClass = 'EQUITY' | 'FX' | 'COMMODITY' | 'RATE' | 'CRYPTO' | 'INDEX';

export interface Security {
  ticker: string;
  bloombergSymbol: string; // e.g. "NVDA US Equity"
  name: string;
  assetClass: AssetClass;
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  avgVolume: number;
  marketCap: string; // e.g. "$3.24T"
  marketCapNum: number;
  peTrailing?: number;
  peForward?: number;
  evEbitda?: number;
  priceToSales?: number;
  priceToBook?: number;
  dividendYield?: number;
  beta?: number;
  week52High: number;
  week52Low: number;
  vwap: number;
  shortInterestPct?: number;
  sharesOutstanding?: string;
  freeCashFlowYield?: number;
  description: string;
  sector?: string;
  industry?: string;
  ceo?: string;
  headquarters?: string;
}

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  orders: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadBps: number;
}

export interface TradePrint {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL' | 'CROSS';
  exchange: 'NSDQ' | 'ARCA' | 'BATS' | 'EDGX' | 'NYSE';
}

export interface FinancialYearData {
  year: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  rdExpense: number;
  sgaExpense: number;
  operatingIncome: number;
  netIncome: number;
  dilutedEps: number;
  cashAndEquivalents: number;
  totalAssets: number;
  totalDebt: number;
  stockholderEquity: number;
  operatingCashFlow: number;
  capitalExpenditures: number;
  freeCashFlow: number;
  grossMarginPct: number;
  operatingMarginPct: number;
  netMarginPct: number;
  roicPct: number;
  roePct: number;
}

export interface SecFiling {
  id: string;
  formType: '10-K' | '10-Q' | '8-K' | 'TRANSCRIPT';
  period: string;
  filingDate: string;
  title: string;
  summary: string;
  highlights: string[];
  keyRiskItem: string;
}

export interface NewsItem {
  id: string;
  timestamp: string;
  source: string;
  headline: string;
  urgency: 'FLASH' | 'BULLETIN' | 'REGULAR';
  category: 'MACRO' | 'EQUITIES' | 'CENTRAL_BANKS' | 'FX_COMMODITIES' | 'EARNINGS';
  relatedTickers: string[];
  body: string;
  readTime: string;
}

export interface YieldCurvePoint {
  tenor: string;
  months: number;
  currentYield: number;
  oneMonthAgo: number;
  oneYearAgo: number;
  changeBps: number;
}

export interface SectorPerformance {
  name: string;
  code: string;
  change1D: number;
  change1W: number;
  change1M: number;
  changeYTD: number;
  marketWeightPct: number;
  topStock: string;
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
}

export interface EconomicIndicator {
  id: string;
  name: string;
  country: string;
  category: 'INFLATION' | 'LABOR' | 'GROWTH' | 'TRADE' | 'CENTRAL_BANK' | 'SURVEY';
  period: string;
  actual: string;
  forecast: string;
  prior: string;
  unit: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  trend: 'UP' | 'DOWN' | 'STABLE';
  surprise: 'BEAT' | 'MISS' | 'IN_LINE';
  releaseTime: string;
}

export interface GdpQuarterData {
  quarter: string;
  realGdpGrowthPct: number;
  personalConsumptionPct: number;
  privateInvestmentPct: number;
  governmentSpendingPct: number;
  netExportsPct: number;
}

export interface GlobalGdpComparison {
  country: string;
  flag: string;
  nominalGdpUsdTrillion: number;
  annualGrowthPct: number;
  inflationPct: number;
  policyRatePct: number;
}

export interface TradeBalanceData {
  period: string;
  exportsBln: number;
  importsBln: number;
  balanceBln: number;
}

export type TerminalFunctionCode =
  | 'DASH'
  | 'DES'
  | 'GP'
  | 'MD'
  | 'FA'
  | 'SEC'
  | 'N'
  | 'YCRV'
  | 'B-QUANT'
  | 'WATCH'
  | 'WORKSPACE';

export type TerminalTheme = 'bloomberg-amber' | 'modern-dark' | 'matrix-green';

