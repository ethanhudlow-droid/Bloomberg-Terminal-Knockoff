import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { FinancialYearData } from '../../types/terminal';
import {
  FileText,
  Download,
  Percent,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

type StatementType = 'INCOME' | 'BALANCE' | 'CASHFLOW' | 'RATIOS';

export const FinancialAnalysis: React.FC = () => {
  const {
    activeSecurity,
    selectSecurityByTicker,
    securities,
    getHistoricalFinancials,
    financialDisplayMode,
    setFinancialDisplayMode,
    financialCurrencyScale,
    setFinancialCurrencyScale
  } = useTerminal();

  const [activeTab, setActiveTab] = useState<StatementType>('INCOME');
  const [searchTicker, setSearchTicker] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  const financials = getHistoricalFinancials(activeSecurity.ticker);
  const years = financials.map((f) => f.year);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTicker.trim()) {
      selectSecurityByTicker(searchTicker.trim().toUpperCase());
      setSearchTicker('');
    }
  };

  // Format cell value depending on mode ($ Millions/$ Billions, Growth %, or % of Revenue)
  const formatValue = (
    val: number,
    field: keyof FinancialYearData,
    yearIdx: number,
    baseRev: number
  ): { text: string; sub?: string; isPositive?: boolean } => {
    if (financialDisplayMode === 'GROWTH') {
      if (yearIdx === financials.length - 1) {
        return { text: '--' };
      }
      const priorVal = financials[yearIdx + 1][field] as number;
      if (!priorVal || priorVal === 0) return { text: '--' };
      const growthPct = ((val - priorVal) / Math.abs(priorVal)) * 100;
      const isPos = growthPct >= 0;
      return {
        text: `${isPos ? '+' : ''}${growthPct.toFixed(1)}%`,
        isPositive: isPos
      };
    }

    if (financialDisplayMode === 'COMMON_SIZE') {
      if (baseRev === 0) return { text: '--' };
      const pct = (val / baseRev) * 100;
      return { text: `${pct.toFixed(1)}%` };
    }

    // Standard Currency Scale
    const scaleFactor = financialCurrencyScale === 'BILLIONS' ? 1000 : 1;
    const scaled = val / scaleFactor;
    const formatted = scaled >= 1000
      ? scaled.toLocaleString(undefined, { maximumFractionDigits: 1 })
      : scaled.toFixed(1);

    return { text: `$${formatted}${financialCurrencyScale === 'BILLIONS' ? 'B' : 'M'}` };
  };

  const handleExportCSV = () => {
    if (!financials || financials.length === 0) return;
    const headers = ['Metric', ...years].join(',');
    const rows = [
      ['Revenue', ...financials.map((f) => f.revenue)].join(','),
      ['Cost of Goods Sold', ...financials.map((f) => f.cogs)].join(','),
      ['Gross Profit', ...financials.map((f) => f.grossProfit)].join(','),
      ['R&D Expense', ...financials.map((f) => f.rdExpense)].join(','),
      ['SG&A Expense', ...financials.map((f) => f.sgaExpense)].join(','),
      ['Operating Income (EBIT)', ...financials.map((f) => f.operatingIncome)].join(','),
      ['Net Income', ...financials.map((f) => f.netIncome)].join(','),
      ['Diluted EPS ($)', ...financials.map((f) => f.dilutedEps)].join(','),
      ['Cash & Equivalents', ...financials.map((f) => f.cashAndEquivalents)].join(','),
      ['Total Assets', ...financials.map((f) => f.totalAssets)].join(','),
      ['Total Debt', ...financials.map((f) => f.totalDebt)].join(','),
      ['Stockholder Equity', ...financials.map((f) => f.stockholderEquity)].join(','),
      ['Operating Cash Flow', ...financials.map((f) => f.operatingCashFlow)].join(','),
      ['Capital Expenditures', ...financials.map((f) => f.capitalExpenditures)].join(','),
      ['Free Cash Flow', ...financials.map((f) => f.freeCashFlow)].join(',')
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeSecurity.ticker}_5Y_Financial_Statements.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sparkline mini bar component for 5-year trend
  const renderTrendSpark = (field: keyof FinancialYearData) => {
    const values = financials.map((f) => f[field] as number).reverse(); // Oldest to newest
    const maxVal = Math.max(...values.map((v) => Math.abs(v)), 1);

    return (
      <div className="flex items-end space-x-1 h-5 w-20 py-0.5">
        {values.map((val, i) => {
          const heightPct = Math.max(15, Math.min(100, Math.round((Math.abs(val) / maxVal) * 100)));
          const isUp = i > 0 ? val >= values[i - 1] : true;
          return (
            <div
              key={i}
              title={`${years[years.length - 1 - i]}: ${val.toLocaleString()}`}
              className={`w-3 rounded-xs ${isUp ? 'bg-emerald-500/80 hover:bg-emerald-400' : 'bg-red-500/80 hover:bg-red-400'}`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Subheader & Company Quick Selector Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#ff9900]/50 gap-2 shadow-[0_1px_8px_rgba(255,153,0,0.06)]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-[#ff9900] font-bold text-sm">
              FA: {activeSecurity.ticker} US EQUITY
            </span>
            <span className="text-[#7d8596] text-xs hidden sm:inline">
              | 5-YEAR AUDITED FINANCIAL STATEMENTS
            </span>
          </div>

          {/* Quick Stock Selector Pills */}
          <div className="hidden lg:flex items-center space-x-1 pl-2 border-l border-[#ff9900]/40">
            {['NVDA', 'TSLA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'JPM'].map((sym) => (
              <button
                key={sym}
                onClick={() => selectSecurityByTicker(sym)}
                className={`px-1.5 py-0.5 text-[10px] rounded-xs cursor-pointer border transition-colors ${
                  activeSecurity.ticker === sym
                    ? 'border-[#ff9900] bg-[#ff9900]/20 text-[#ff9900] font-bold'
                    : 'border-[#ff9900]/30 text-[#8e96a8] hover:text-white hover:bg-[#1a1c24] hover:border-[#ff9900]'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Company Lookup & Display Controls */}
        <div className="flex items-center space-x-2">
          {/* Lookup any company */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                placeholder="Lookup Ticker..."
                className="bg-[#090a0d] border border-[#ff9900]/50 focus:border-[#ff9900] text-white px-2 py-1 text-xs rounded-xs w-32 focus:outline-none uppercase placeholder-[#4d5464]"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 text-[#ff9900]">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Scale: Millions vs Billions */}
          <div className="flex items-center bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
            <button
              onClick={() => setFinancialCurrencyScale('MILLIONS')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                financialCurrencyScale === 'MILLIONS'
                  ? 'bg-[#ff9900] text-black font-bold'
                  : 'text-[#848c9e] hover:text-white'
              }`}
            >
              $M
            </button>
            <button
              onClick={() => setFinancialCurrencyScale('BILLIONS')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                financialCurrencyScale === 'BILLIONS'
                  ? 'bg-[#ff9900] text-black font-bold'
                  : 'text-[#848c9e] hover:text-white'
              }`}
            >
              $B
            </button>
          </div>

          {/* Mode: Standard vs Growth vs Common-Size */}
          <div className="flex items-center bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
            <button
              onClick={() => setFinancialDisplayMode('STANDARD')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                financialDisplayMode === 'STANDARD'
                  ? 'bg-[#2b303c] text-[#ff9900] font-bold'
                  : 'text-[#848c9e] hover:text-white'
              }`}
            >
              VALUES
            </button>
            <button
              onClick={() => setFinancialDisplayMode('GROWTH')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                financialDisplayMode === 'GROWTH'
                  ? 'bg-[#2b303c] text-[#ff9900] font-bold'
                  : 'text-[#848c9e] hover:text-white'
              }`}
            >
              YOY %
            </button>
            <button
              onClick={() => setFinancialDisplayMode('COMMON_SIZE')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                financialDisplayMode === 'COMMON_SIZE'
                  ? 'bg-[#2b303c] text-[#ff9900] font-bold'
                  : 'text-[#848c9e] hover:text-white'
              }`}
            >
              % REV
            </button>
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1 px-2.5 py-1 bg-[#1d2028] hover:bg-[#252934] border border-[#ff9900]/40 hover:border-[#ff9900] text-[#b0b8c8] hover:text-white rounded-xs cursor-pointer text-xs transition-colors"
            title="Export 5-Year Statements to CSV"
          >
            <Download className="w-3 h-3 text-[#ff9900]" />
            <span className="hidden sm:inline">EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Statement Tabs */}
      <div className="flex items-center px-3 bg-[#0d0e12] border-b border-[#ff9900]/40 space-x-2 pt-1 text-xs">
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'INCOME'
              ? 'border-[#ff9900] text-[#ff9900] bg-[#161820]'
              : 'border-transparent text-[#7e8798] hover:text-white hover:bg-[#12141a]'
          }`}
        >
          1. INCOME STATEMENT
        </button>
        <button
          onClick={() => setActiveTab('BALANCE')}
          className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'BALANCE'
              ? 'border-[#ff9900] text-[#ff9900] bg-[#161820]'
              : 'border-transparent text-[#7e8798] hover:text-white hover:bg-[#12141a]'
          }`}
        >
          2. BALANCE SHEET
        </button>
        <button
          onClick={() => setActiveTab('CASHFLOW')}
          className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'CASHFLOW'
              ? 'border-[#ff9900] text-[#ff9900] bg-[#161820]'
              : 'border-transparent text-[#7e8798] hover:text-white hover:bg-[#12141a]'
          }`}
        >
          3. CASH FLOW STATEMENT
        </button>
        <button
          onClick={() => setActiveTab('RATIOS')}
          className={`px-3 py-1.5 border-b-2 font-bold cursor-pointer transition-all ${
            activeTab === 'RATIOS'
              ? 'border-[#ff9900] text-[#ff9900] bg-[#161820]'
              : 'border-transparent text-[#7e8798] hover:text-white hover:bg-[#12141a]'
          }`}
        >
          4. MARGINS & RATIOS
        </button>
      </div>

      {/* Financial Statements Table Body */}
      <div className="flex-1 overflow-auto p-3">
        <div className="border border-[#ff9900]/60 bg-[#101217] rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181a22] border-b border-[#ff9900]/30 text-[#ff9900]/80 text-[11px] uppercase tracking-wider">
                <th className="py-2 px-3 font-semibold w-1/3">Accounting Line Item (USD)</th>
                <th className="py-2 px-2 font-semibold text-center w-24">5Y Trend</th>
                {financials.map((f) => (
                  <th key={f.year} className="py-2 px-3 font-semibold text-right text-white">
                    {f.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1f28] text-xs">
              {/* TAB 1: INCOME STATEMENT */}
              {activeTab === 'INCOME' && (
                <>
                  {/* Revenue */}
                  <tr className="hover:bg-[#161922] bg-[#13151c] font-semibold text-white">
                    <td className="py-2 px-3 flex items-center justify-between text-[#ff9900]">
                      <span>Total Net Revenue</span>
                    </td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('revenue')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.revenue, 'revenue', i, f.revenue);
                      return (
                        <td key={f.year} className="py-2 px-3 text-right font-bold text-white">
                          <span className={res.isPositive === true ? 'text-[#00e676]' : res.isPositive === false ? 'text-[#ff3b30]' : ''}>
                            {res.text}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* COGS */}
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Cost of Goods Sold (COGS)</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('cogs')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.cogs, 'cogs', i, f.revenue);
                      return (
                        <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Gross Profit */}
                  <tr className="hover:bg-[#161922] bg-[#12141a] font-semibold">
                    <td className="py-2 px-3 pl-4 text-emerald-400">Gross Profit</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('grossProfit')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.grossProfit, 'grossProfit', i, f.revenue);
                      return (
                        <td key={f.year} className="py-2 px-3 text-right font-semibold text-emerald-400">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Operating Expenses Section */}
                  <tr className="bg-[#14161e] text-[10px] text-[#ff9900] uppercase font-bold tracking-wider">
                    <td colSpan={7} className="py-1 px-3">Operating Expenses</td>
                  </tr>

                  {/* R&D */}
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Research & Development (R&D)</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('rdExpense')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.rdExpense, 'rdExpense', i, f.revenue);
                      return (
                        <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* SG&A */}
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Selling, General & Admin (SG&A)</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('sgaExpense')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.sgaExpense, 'sgaExpense', i, f.revenue);
                      return (
                        <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Operating Income (EBIT) */}
                  <tr className="hover:bg-[#161922] bg-[#141720] font-bold text-white">
                    <td className="py-2 px-3 pl-4 text-[#ff9900]">Operating Income (EBIT)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('operatingIncome')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.operatingIncome, 'operatingIncome', i, f.revenue);
                      return (
                        <td key={f.year} className="py-2 px-3 text-right font-bold text-[#ff9900]">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Net Income */}
                  <tr className="hover:bg-[#161922] bg-[#161a24] font-bold text-white border-t border-[#ff9900]/40">
                    <td className="py-2 px-3 pl-4 text-emerald-400">Net Income (GAAP)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('netIncome')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.netIncome, 'netIncome', i, f.revenue);
                      return (
                        <td key={f.year} className="py-2 px-3 text-right font-bold text-emerald-400">
                          {res.text}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Diluted EPS */}
                  <tr className="hover:bg-[#161922]">
                    <td className="py-2 px-3 pl-6 text-white font-medium">Diluted EPS ($)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('dilutedEps')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-white font-bold">
                        ${f.dilutedEps.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </>
              )}

              {/* TAB 2: BALANCE SHEET */}
              {activeTab === 'BALANCE' && (
                <>
                  <tr className="bg-[#14161e] text-[10px] text-[#ff9900] uppercase font-bold tracking-wider">
                    <td colSpan={7} className="py-1 px-3">Assets & Liquidity</td>
                  </tr>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Cash & Cash Equivalents</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('cashAndEquivalents')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.cashAndEquivalents, 'cashAndEquivalents', i, f.revenue);
                      return <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">{res.text}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-[#161922] bg-[#12141a] font-semibold">
                    <td className="py-2 px-3 pl-4 text-white">Total Assets</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('totalAssets')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.totalAssets, 'totalAssets', i, f.revenue);
                      return <td key={f.year} className="py-2 px-3 text-right font-bold text-white">{res.text}</td>;
                    })}
                  </tr>

                  <tr className="bg-[#14161e] text-[10px] text-[#ff9900] uppercase font-bold tracking-wider">
                    <td colSpan={7} className="py-1 px-3">Liabilities & Capital Structure</td>
                  </tr>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Total Debt (Short & Long Term)</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('totalDebt')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.totalDebt, 'totalDebt', i, f.revenue);
                      return <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">{res.text}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-[#161922] bg-[#141720] font-bold">
                    <td className="py-2 px-3 pl-4 text-[#ff9900]">Stockholders' Equity</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('stockholderEquity')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.stockholderEquity, 'stockholderEquity', i, f.revenue);
                      return <td key={f.year} className="py-2 px-3 text-right font-bold text-[#ff9900]">{res.text}</td>;
                    })}
                  </tr>
                </>
              )}

              {/* TAB 3: CASH FLOW STATEMENT */}
              {activeTab === 'CASHFLOW' && (
                <>
                  <tr className="hover:bg-[#161922] bg-[#12141a] font-semibold">
                    <td className="py-2 px-3 pl-4 text-emerald-400">Cash Flow from Operations (CFO)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('operatingCashFlow')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.operatingCashFlow, 'operatingCashFlow', i, f.revenue);
                      return <td key={f.year} className="py-2 px-3 text-right font-bold text-emerald-400">{res.text}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 pl-6 text-[#9ca4b5]">Capital Expenditures (CapEx)</td>
                    <td className="py-1.5 px-2 text-center">{renderTrendSpark('capitalExpenditures')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.capitalExpenditures, 'capitalExpenditures', i, f.revenue);
                      return <td key={f.year} className="py-1.5 px-3 text-right text-[#b8bfcc]">{res.text}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-[#161922] bg-[#161a24] font-bold border-t border-[#ff9900]/40">
                    <td className="py-2 px-3 pl-4 text-[#ff9900]">Free Cash Flow (FCF = CFO - CapEx)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('freeCashFlow')}</td>
                    {financials.map((f, i) => {
                      const res = formatValue(f.freeCashFlow, 'freeCashFlow', i, f.revenue);
                      return <td key={f.year} className="py-2 px-3 text-right font-bold text-[#ff9900]">{res.text}</td>;
                    })}
                  </tr>
                </>
              )}

              {/* TAB 4: MARGINS & RATIOS */}
              {activeTab === 'RATIOS' && (
                <>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-2 px-3 pl-4 text-white font-medium">Gross Margin (%)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('grossMarginPct')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-emerald-400 font-semibold">
                        {f.grossMarginPct.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-2 px-3 pl-4 text-white font-medium">Operating Margin (EBIT %)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('operatingMarginPct')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-[#ff9900] font-semibold">
                        {f.operatingMarginPct.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#161922]">
                    <td className="py-2 px-3 pl-4 text-white font-medium">Net Profit Margin (%)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('netMarginPct')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-emerald-400 font-semibold">
                        {f.netMarginPct.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#161922] bg-[#12141a]">
                    <td className="py-2 px-3 pl-4 text-white font-medium">Return on Invested Capital (ROIC)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('roicPct')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-white font-bold">
                        {f.roicPct.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-[#161922] bg-[#141720]">
                    <td className="py-2 px-3 pl-4 text-white font-medium">Return on Equity (ROE)</td>
                    <td className="py-2 px-2 text-center">{renderTrendSpark('roePct')}</td>
                    {financials.map((f) => (
                      <td key={f.year} className="py-2 px-3 text-right text-white font-bold">
                        {f.roePct.toFixed(1)}%
                      </td>
                    ))}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Highlights & Audit Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3 text-xs">
          <div className="bg-[#121419] border border-[#ff9900]/50 p-2.5 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.06)]">
            <span className="text-[10px] text-[#ff9900]/80 uppercase block font-semibold">Latest FCF Yield</span>
            <span className="text-base font-bold text-[#ff9900] font-mono-bbg">
              {activeSecurity.freeCashFlowYield ? `${activeSecurity.freeCashFlowYield}%` : '2.8%'}
            </span>
            <span className="text-[10px] text-[#8e95a5] block mt-0.5">High cash conversion profile</span>
          </div>

          <div className="bg-[#121419] border border-[#ff9900]/50 p-2.5 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.06)]">
            <span className="text-[10px] text-[#ff9900]/80 uppercase block font-semibold">5Y Revenue CAGR</span>
            <span className="text-base font-bold text-emerald-400 font-mono-bbg">
              {financials.length >= 5
                ? `+${(((financials[0].revenue / financials[4].revenue) ** (1 / 4) - 1) * 100).toFixed(1)}%`
                : '+24.5%'}
            </span>
            <span className="text-[10px] text-[#8e95a5] block mt-0.5">Compounded top-line growth</span>
          </div>

          <div className="bg-[#121419] border border-[#ff9900]/50 p-2.5 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.06)]">
            <span className="text-[10px] text-[#ff9900]/80 uppercase block font-semibold">P/E Multiple (TTM)</span>
            <span className="text-base font-bold text-white font-mono-bbg">
              {activeSecurity.peTrailing ? `${activeSecurity.peTrailing}x` : '32.4x'}
            </span>
            <span className="text-[10px] text-[#8e95a5] block mt-0.5">Fwd P/E: {activeSecurity.peForward || '24.1'}x</span>
          </div>

          <div className="bg-[#121419] border border-[#ff9900]/50 p-2.5 rounded-xs shadow-[0_0_8px_rgba(255,153,0,0.06)]">
            <span className="text-[10px] text-[#ff9900]/80 uppercase block font-semibold">Capital Structure / Debt</span>
            <span className="text-base font-bold text-sky-400 font-mono-bbg">
              ${(financials[0].totalDebt / 1000).toFixed(1)}B
            </span>
            <span className="text-[10px] text-[#8e95a5] block mt-0.5">Cash: ${(financials[0].cashAndEquivalents / 1000).toFixed(1)}B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
