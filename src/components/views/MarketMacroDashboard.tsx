import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import {
  SECTOR_PERFORMANCE_DATA,
  ECONOMIC_INDICATORS,
  US_GDP_QUARTERLY_SERIES,
  GLOBAL_GDP_COMPARISON,
  US_TRADE_BALANCE_SERIES,
  TRADE_CATEGORIES_BREAKDOWN,
  MULTI_ASSET_BENCHMARKS,
  DASHBOARD_NEWS_ITEMS,
  MultiAssetItem,
  DashboardNewsItem
} from '../../data/economicData';
import {
  Globe,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  FileText,
  DollarSign,
  Radio,
  BarChart3,
  Calendar,
  Compass,
  Zap,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';

export const MarketMacroDashboard: React.FC = () => {
  const { selectSecurityByTicker, setCurrentView, tickFlashes } = useTerminal();

  // Multi-asset category filter
  const [assetFilter, setAssetFilter] = useState<'ALL' | 'EQUITY' | 'RATE' | 'COMMODITY' | 'FX' | 'CRYPTO'>('ALL');
  // Sector timeframe view (1D, 1W, 1M, YTD)
  const [sectorTimeframe, setSectorTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  // Economic data tab view
  const [econTab, setEconTab] = useState<'REPORTS' | 'GDP' | 'TRADE'>('REPORTS');
  // Selected news item for expanded detail
  const [expandedNews, setExpandedNews] = useState<DashboardNewsItem | null>(null);

  // Filtered multi-asset items
  const filteredAssets = MULTI_ASSET_BENCHMARKS.filter(
    (item) => assetFilter === 'ALL' || item.assetClass === assetFilter
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-y-auto text-xs p-2.5 space-y-2.5">
      {/* 1. Global Market Regime & Macro Summary Bar */}
      <div className="bg-[#121419] border border-[#ff9900]/60 p-2.5 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ff9900]/30 pb-2">
          {/* Market Status & Sentiment */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[#ff9900] font-bold text-sm tracking-wider uppercase">
                GLOBAL MARKET & MACRO DASHBOARD
              </span>
            </div>
            <span className="text-[10px] text-[#ff9900] px-2 py-0.5 bg-[#181b22] border border-[#ff9900]/40 rounded">
              REGIME: RISK-ON / MODERATE EXPANSION
            </span>
          </div>

          {/* Global Session Clocks */}
          <div className="flex items-center space-x-3 text-[11px] text-[#747d8f]">
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-white font-semibold">NEW YORK</span>
              <span className="text-emerald-400 font-bold">OPEN</span>
            </span>
            <span className="text-[#ff9900]/40">&bull;</span>
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#525a6b]"></span>
              <span>LONDON</span>
              <span className="text-[#6c7586]">CLOSED</span>
            </span>
            <span className="text-[#ff9900]/40">&bull;</span>
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#525a6b]"></span>
              <span>TOKYO</span>
              <span className="text-[#6c7586]">CLOSED</span>
            </span>
          </div>
        </div>

        {/* Key Benchmark Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 text-xs">
          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>S&P 500</span>
              <span className="text-emerald-400">+0.55%</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">5,885.50</div>
            <div className="text-[9px] text-[#555d6e]">VIX: 14.2 (Low Vol)</div>
          </div>

          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>NASDAQ 100</span>
              <span className="text-emerald-400">+0.83%</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">20,490.80</div>
            <div className="text-[9px] text-[#555d6e]">Tech Momentum</div>
          </div>

          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>US 10Y YIELD</span>
              <span className="text-[#ff9900]">+5 bps</span>
            </div>
            <div className="text-sm font-bold text-[#ff9900] mt-0.5">4.99%</div>
            <div className="text-[9px] text-[#555d6e]">2Y/10Y: +47 bps</div>
          </div>

          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>US DOLLAR (DXY)</span>
              <span className="text-white">+0.21%</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">103.85</div>
            <div className="text-[9px] text-[#555d6e]">EUR/USD: 1.0825</div>
          </div>

          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>WTI CRUDE</span>
              <span className="text-emerald-400">+1.85%</span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">$101.40</div>
            <div className="text-[9px] text-[#555d6e]">Energy Bid Active</div>
          </div>

          <div className="bg-[#151720] border border-[#ff9900]/40 hover:border-[#ff9900] p-2 rounded-xs transition-colors">
            <div className="flex justify-between items-center text-[10px] text-[#717a8c]">
              <span>GOLD SPOT</span>
              <span className="text-emerald-400">+0.92%</span>
            </div>
            <div className="text-sm font-bold text-[#ff9900] mt-0.5">$4,075.40</div>
            <div className="text-[9px] text-[#555d6e]">Sovereign Reserve Bid</div>
          </div>
        </div>
      </div>

      {/* 2. Tiny Section: Major Market, Business & Economic News */}
      <div className="bg-[#121419] border border-[#ff9900]/60 p-2.5 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#ff9900]/30">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-[#ff9900]" />
            <span className="text-[#ff9900] font-bold text-xs uppercase tracking-wide">
              FLASH BULLETINS // MARKET, BUSINESS & ECONOMIC NEWS
            </span>
          </div>
          <button
            onClick={() => setCurrentView('N')}
            className="flex items-center space-x-1 text-[10px] text-[#8e97aa] hover:text-[#ff9900] cursor-pointer"
          >
            <span>FULL WIRE [F8]</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Compact Ticker List of Headlines */}
        <div className="divide-y divide-[#1a1d26] mt-1">
          {DASHBOARD_NEWS_ITEMS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setExpandedNews(expandedNews?.id === item.id ? null : item)}
              className="py-1.5 px-1 hover:bg-[#161822] cursor-pointer flex flex-wrap items-center justify-between gap-1 transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-[280px]">
                <span className="text-[10px] text-[#636c7e] shrink-0">{item.time}</span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded-xs font-bold shrink-0 ${
                    item.urgency === 'FLASH'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-[#ff9900] border border-amber-500/40'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-white font-medium text-xs truncate">
                  {item.headline}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {item.impactTicker && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSecurityByTicker(item.impactTicker!);
                    }}
                    className="px-1 py-0.2 text-[9px] bg-[#1a1d26] text-[#ff9900] border border-[#ff9900]/50 rounded hover:bg-[#ff9900] hover:text-black font-bold"
                  >
                    {item.impactTicker} &lt;GO&gt;
                  </button>
                )}
                <span className="text-[10px] text-[#555d6e]">
                  {expandedNews?.id === item.id ? '▲ Less' : '▼ Details'}
                </span>
              </div>
              {expandedNews?.id === item.id && (
                <div className="w-full text-xs text-[#a4abb8] bg-[#0c0d10] p-2 mt-1 rounded border border-[#ff9900]/30 font-sans leading-relaxed">
                  {item.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Middle Section: Multi-Asset Class Matrix & Sector Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {/* Multi-Asset Class Benchmarks */}
        <div className="bg-[#121419] border border-[#ff9900]/60 p-2.5 rounded-xs flex flex-col shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#ff9900]/30">
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-[#ff9900]" />
              <span className="text-xs font-bold text-white uppercase">
                Multi-Asset Class Performance
              </span>
            </div>

            {/* Asset Class Filter Tabs */}
            <div className="flex items-center space-x-1 bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
              {(['ALL', 'EQUITY', 'RATE', 'COMMODITY', 'FX', 'CRYPTO'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssetFilter(filter)}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    assetFilter === filter
                      ? 'bg-[#ff9900] text-black font-bold'
                      : 'text-[#848c9e] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Benchmarks Table */}
          <div className="flex-1 overflow-x-auto mt-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-[#ff9900]/70 border-b border-[#ff9900]/30 uppercase">
                  <th className="py-1 px-2">Asset</th>
                  <th className="py-1 px-2">Benchmark Name</th>
                  <th className="py-1 px-2 text-right">Last</th>
                  <th className="py-1 px-2 text-right">Change</th>
                  <th className="py-1 px-2 text-right">Change (%)</th>
                  <th className="py-1 px-2 text-center">Day Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ff9900]/15 text-xs">
                {filteredAssets.slice(0, 8).map((asset) => {
                  const isPos = asset.change >= 0;
                  const rangeSpan = Math.max(0.0001, asset.high - asset.low);
                  const posPct = Math.min(100, Math.max(0, ((asset.last - asset.low) / rangeSpan) * 100));
                  return (
                    <tr
                      key={asset.symbol}
                      onClick={() => selectSecurityByTicker(asset.symbol)}
                      className="hover:bg-[#161922] cursor-pointer"
                    >
                      <td className="py-1.5 px-2 font-bold text-white flex items-center space-x-1.5">
                        <span className="text-[#ff9900]">{asset.symbol}</span>
                        <span className="text-[9px] px-1 bg-[#1c1f28] text-[#ff9900]/80 border border-[#ff9900]/30 rounded-xs">
                          {asset.assetClass}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[#9fa7b8] truncate max-w-[130px]" title={asset.name}>
                        {asset.name}
                      </td>
                      <td className="py-1.5 px-2 text-right font-bold text-white">
                        {asset.last >= 1000
                          ? asset.last.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : asset.last >= 10
                          ? asset.last.toFixed(2)
                          : asset.last.toFixed(4)}
                      </td>
                      <td className={`py-1.5 px-2 text-right font-medium ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}{asset.change.toFixed(2)}
                      </td>
                      <td className={`py-1.5 px-2 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}{asset.changePct.toFixed(2)}%
                      </td>
                      <td className="py-1.5 px-2 text-center w-24">
                        <div className="w-full bg-[#1b1e27] h-1.5 rounded-xs relative border border-[#ff9900]/20">
                          <div
                            className="absolute top-0 bottom-0 w-2 bg-[#ff9900] rounded-xs -ml-1"
                            style={{ left: `${posPct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* S&P 500 GICS Sector Performance Heatmap */}
        <div className="bg-[#121419] border border-[#ff9900]/60 p-2.5 rounded-xs flex flex-col shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#ff9900]/30">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-3.5 h-3.5 text-[#ff9900]" />
              <span className="text-xs font-bold text-white uppercase">
                S&P 500 Sector Performance Heatmap
              </span>
            </div>

            {/* Timeframe Filter (1D, 1W, 1M, YTD) */}
            <div className="flex items-center space-x-1 bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
              {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSectorTimeframe(tf)}
                  className={`px-1.5 py-0.5 rounded-xs cursor-pointer ${
                    sectorTimeframe === tf
                      ? 'bg-[#ff9900] text-black font-bold'
                      : 'text-[#848c9e] hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Bars */}
          <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 pr-1">
            {SECTOR_PERFORMANCE_DATA.map((sector) => {
              const returnVal =
                sectorTimeframe === '1D'
                  ? sector.change1D
                  : sectorTimeframe === '1W'
                  ? sector.change1W
                  : sectorTimeframe === '1M'
                  ? sector.change1M
                  : sector.changeYTD;

              const isPos = returnVal >= 0;
              const barWidth = Math.min(100, Math.abs(returnVal) * 5); // visual scale

              return (
                <div
                  key={sector.code}
                  className="p-1.5 bg-[#151720] border border-[#ff9900]/30 hover:border-[#ff9900] rounded-xs flex items-center justify-between text-xs transition-colors"
                >
                  {/* Sector Name & Weight */}
                  <div className="w-40 truncate">
                    <span className="font-bold text-white">{sector.name}</span>
                    <span className="text-[10px] text-[#6d7586] block">
                      {sector.code} &bull; {sector.marketWeightPct}% Weight
                    </span>
                  </div>

                  {/* Visual Performance Bar */}
                  <div className="flex-1 px-3 hidden sm:flex items-center space-x-2">
                    <div className="flex-1 bg-[#1c1f28] h-2 rounded-xs flex items-center overflow-hidden border border-[#ff9900]/20">
                      <div
                        className={`h-full ${isPos ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.max(4, barWidth)}%` }}
                      />
                    </div>
                  </div>

                  {/* Leader Driver & Return % */}
                  <div className="text-right">
                    <div className={`font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPos ? '+' : ''}{returnVal.toFixed(2)}%
                    </div>
                    <span className="text-[10px] text-[#6b7385]">{sector.topStock}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Domestic and Global Economic Data (Major Reports, GDP, Imports & Exports) */}
      <div className="bg-[#121419] border border-[#ff9900]/60 p-2.5 rounded-xs flex flex-col shadow-[0_0_12px_rgba(255,153,0,0.06)]">
        {/* Navigation Tabs for Economic Data */}
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-[#ff9900]/30 gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-3.5 h-3.5 text-[#ff9900]" />
              <span className="text-xs font-bold text-[#ff9900] uppercase tracking-wide">
                DOMESTIC & GLOBAL ECONOMIC INTELLIGENCE
              </span>
            </div>
            <span className="text-[10px] text-[#788194] hidden md:inline">
              | BUREAU OF ECONOMIC ANALYSIS & CENTRAL BANKS
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
            <button
              onClick={() => setEconTab('REPORTS')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer ${
                econTab === 'REPORTS'
                  ? 'bg-[#ff9900] text-black font-bold'
                  : 'text-[#8e97aa] hover:text-white'
              }`}
            >
              1. MAJOR ECONOMIC REPORTS
            </button>
            <button
              onClick={() => setEconTab('GDP')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer ${
                econTab === 'GDP'
                  ? 'bg-[#ff9900] text-black font-bold'
                  : 'text-[#8e97aa] hover:text-white'
              }`}
            >
              2. GDP & GLOBAL GROWTH
            </button>
            <button
              onClick={() => setEconTab('TRADE')}
              className={`px-2.5 py-1 rounded-xs cursor-pointer ${
                econTab === 'TRADE'
                  ? 'bg-[#ff9900] text-black font-bold'
                  : 'text-[#8e97aa] hover:text-white'
              }`}
            >
              3. IMPORTS, EXPORTS & TRADE
            </button>
          </div>
        </div>

        {/* TAB 1: MAJOR ECONOMIC INDICATORS & REPORTS */}
        {econTab === 'REPORTS' && (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-[#ff9900]/80 border-b border-[#ff9900]/30 uppercase bg-[#161820]">
                  <th className="py-2 px-3">Economic Indicator</th>
                  <th className="py-2 px-2 text-center">Country</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Period</th>
                  <th className="py-2 px-3 text-right">Actual</th>
                  <th className="py-2 px-3 text-right">Forecast</th>
                  <th className="py-2 px-3 text-right">Prior</th>
                  <th className="py-2 px-2 text-center">Surprise</th>
                  <th className="py-2 px-2 text-center">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ff9900]/15 text-xs">
                {ECONOMIC_INDICATORS.map((indicator) => {
                  const isBeat = indicator.surprise === 'BEAT';
                  return (
                    <tr key={indicator.id} className="hover:bg-[#161922]">
                      <td className="py-2 px-3 font-semibold text-white">
                        {indicator.name}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-[#ff9900]">
                        {indicator.country}
                      </td>
                      <td className="py-2 px-2 text-[#7d8697] text-[11px]">
                        {indicator.category}
                      </td>
                      <td className="py-2 px-2 text-[#9fa7b8] text-[11px]">
                        {indicator.period}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-white text-sm">
                        {indicator.actual}
                      </td>
                      <td className="py-2 px-3 text-right text-[#9aa2b4]">
                        {indicator.forecast}
                      </td>
                      <td className="py-2 px-3 text-right text-[#727a8b]">
                        {indicator.prior}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                            isBeat
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : indicator.surprise === 'IN_LINE'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {indicator.surprise}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                            indicator.impact === 'CRITICAL'
                              ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/40'
                              : indicator.impact === 'HIGH'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              : 'bg-[#21242e] text-[#8e97aa]'
                          }`}
                        >
                          {indicator.impact}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: GDP & GLOBAL ECONOMIC GROWTH */}
        {econTab === 'GDP' && (
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* US Real GDP Historical Quarterly Trend & Components */}
            <div className="border border-[#ff9900]/50 bg-[#101217] p-3 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.05)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#ff9900]/30 mb-2">
                <span className="text-xs font-bold text-[#ff9900] uppercase">
                  US Real GDP Growth & Component Breakdown (QoQ Ann)
                </span>
                <span className="text-[10px] text-[#6d7586]">Nominal: $29.8 Trillion</span>
              </div>

              {/* Quarterly breakdown cards */}
              <div className="space-y-2">
                {US_GDP_QUARTERLY_SERIES.map((q) => (
                  <div key={q.quarter} className="p-2 bg-[#151720] border border-[#ff9900]/30 rounded-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{q.quarter}</span>
                      <span className="text-sm font-bold text-emerald-400">
                        +{q.realGdpGrowthPct.toFixed(1)}% Ann.
                      </span>
                    </div>

                    {/* Stacked Component Contribution */}
                    <div className="grid grid-cols-4 gap-1 text-[10px] text-[#8e97aa] pt-1 border-t border-[#ff9900]/20">
                      <div>
                        <span className="block text-[#5e6677]">Consumer PCE</span>
                        <span className="font-bold text-white">+{q.personalConsumptionPct}%</span>
                      </div>
                      <div>
                        <span className="block text-[#5e6677]">Investment</span>
                        <span className="font-bold text-white">+{q.privateInvestmentPct}%</span>
                      </div>
                      <div>
                        <span className="block text-[#5e6677]">Gov Spending</span>
                        <span className="font-bold text-white">+{q.governmentSpendingPct}%</span>
                      </div>
                      <div>
                        <span className="block text-[#5e6677]">Net Exports</span>
                        <span className="font-bold text-red-400">{q.netExportsPct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Major Economies GDP Comparison */}
            <div className="border border-[#ff9900]/50 bg-[#101217] p-3 rounded-xs flex flex-col shadow-[0_0_8px_rgba(255,153,0,0.05)]">
              <div className="flex items-center justify-between pb-2 border-b border-[#ff9900]/30 mb-2">
                <span className="text-xs font-bold text-[#ff9900] uppercase">
                  Global GDP & Central Bank Policy Matrix
                </span>
                <span className="text-[10px] text-[#6d7586]">G7 & Major Nations</span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-[#ff9900]/70 border-b border-[#ff9900]/30 uppercase">
                      <th className="py-1.5 px-2">Nation</th>
                      <th className="py-1.5 px-2 text-right">Nominal GDP</th>
                      <th className="py-1.5 px-2 text-right">Real Growth</th>
                      <th className="py-1.5 px-2 text-right">Inflation (CPI)</th>
                      <th className="py-1.5 px-2 text-right">Policy Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ff9900]/15 text-xs">
                    {GLOBAL_GDP_COMPARISON.map((nation) => (
                      <tr key={nation.country} className="hover:bg-[#161922]">
                        <td className="py-2 px-2 font-semibold text-white flex items-center space-x-1.5">
                          <span>{nation.flag}</span>
                          <span>{nation.country}</span>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-white">
                          ${nation.nominalGdpUsdTrillion.toFixed(1)}T
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-400">
                          +{nation.annualGrowthPct.toFixed(1)}%
                        </td>
                        <td className="py-2 px-2 text-right text-[#9ea6b8]">
                          {nation.inflationPct.toFixed(1)}%
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-[#ff9900]">
                          {nation.policyRatePct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPORTS, EXPORTS & INTERNATIONAL TRADE BALANCE */}
        {econTab === 'TRADE' && (
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Monthly Trade Balance Series */}
            <div className="border border-[#ff9900]/50 bg-[#101217] p-3 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.05)]">
              <span className="text-xs font-bold text-[#ff9900] uppercase block mb-1">
                US Monthly Trade Balance ($ Billions)
              </span>
              <span className="text-[10px] text-[#6d7586] block mb-2">
                Census Bureau Foreign Trade Dispatches
              </span>

              <div className="space-y-1.5">
                {US_TRADE_BALANCE_SERIES.map((item) => (
                  <div
                    key={item.period}
                    className="p-1.5 bg-[#151720] border border-[#ff9900]/30 rounded-xs flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{item.period}</span>
                      <div className="text-[10px] text-[#646c7e]">
                        Exp: ${item.exportsBln}B | Imp: ${item.importsBln}B
                      </div>
                    </div>
                    <span className="font-bold text-red-400">
                      -${Math.abs(item.balanceBln).toFixed(1)}B Deficit
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Export Goods Categories */}
            <div className="border border-[#ff9900]/50 bg-[#101217] p-3 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.05)]">
              <span className="text-xs font-bold text-emerald-400 uppercase block mb-1">
                Top US Export Sectors & Categories
              </span>
              <span className="text-[10px] text-[#6d7586] block mb-2">
                Total Monthly Exports: $268.4 Billion
              </span>

              <div className="space-y-1.5">
                {TRADE_CATEGORIES_BREAKDOWN.topExports.map((cat, idx) => (
                  <div key={idx} className="p-1.5 bg-[#151720] border border-[#ff9900]/30 rounded-xs">
                    <div className="flex justify-between items-center text-xs mb-0.5">
                      <span className="text-white font-medium">{cat.category}</span>
                      <span className="font-bold text-emerald-400">${cat.valueBln}B</span>
                    </div>
                    <div className="w-full bg-[#1c1f28] h-1 rounded-xs overflow-hidden border border-[#ff9900]/20">
                      <div className="bg-emerald-500 h-full" style={{ width: `${cat.pctShare * 3}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Import Goods Categories */}
            <div className="border border-[#ff9900]/50 bg-[#101217] p-3 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.05)]">
              <span className="text-xs font-bold text-[#ff9900] uppercase block mb-1">
                Top US Import Sectors & Categories
              </span>
              <span className="text-[10px] text-[#6d7586] block mb-2">
                Total Monthly Imports: $336.2 Billion
              </span>

              <div className="space-y-1.5">
                {TRADE_CATEGORIES_BREAKDOWN.topImports.map((cat, idx) => (
                  <div key={idx} className="p-1.5 bg-[#151720] border border-[#ff9900]/30 rounded-xs">
                    <div className="flex justify-between items-center text-xs mb-0.5">
                      <span className="text-white font-medium">{cat.category}</span>
                      <span className="font-bold text-white">${cat.valueBln}B</span>
                    </div>
                    <div className="w-full bg-[#1c1f28] h-1 rounded-xs overflow-hidden border border-[#ff9900]/20">
                      <div className="bg-[#ff9900] h-full" style={{ width: `${cat.pctShare * 3}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
