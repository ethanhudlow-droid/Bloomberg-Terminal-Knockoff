import React from 'react';
import { useTerminal } from '../../context/TerminalContext';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Layers,
  BarChart,
  ShieldCheck,
  Building2,
  Calendar,
  Globe
} from 'lucide-react';

export const SecurityOverview: React.FC = () => {
  const { activeSecurity, setCurrentView } = useTerminal();
  const isPositive = activeSecurity.change >= 0;

  const rangeSpan = Math.max(1, activeSecurity.week52High - activeSecurity.week52Low);
  const currentPosPct = Math.min(100, Math.max(0, ((activeSecurity.price - activeSecurity.week52Low) / rangeSpan) * 100));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-y-auto text-xs p-3 space-y-3">
      {/* Top Banner Card: Quote & Identifiers */}
      <div className="bg-[#121419] border border-[#ff9900]/60 p-3 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#ff9900]">
                {activeSecurity.bloombergSymbol}
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-[#191c24] text-[#8e97aa] border border-[#ff9900]/40 rounded-xs font-semibold">
                {activeSecurity.exchange}
              </span>
              <span className="text-[11px] px-2 py-0.5 bg-[#191c24] text-emerald-400 border border-[#ff9900]/40 rounded-xs font-semibold">
                ACTIVE TRADING
              </span>
            </div>
            <h1 className="text-sm text-[#c8cfdc] mt-1 font-sans font-medium">
              {activeSecurity.name} &bull; {activeSecurity.sector || 'US Equity'}
            </h1>
          </div>

          <div className="flex items-baseline space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-white tracking-tight">
                ${activeSecurity.price >= 1000 ? activeSecurity.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : activeSecurity.price.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end space-x-1 text-xs font-semibold ${isPositive ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{activeSecurity.change.toFixed(2)} ({isPositive ? '+' : ''}{activeSecurity.changePercent.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Function Jump Links */}
        <div className="flex items-center space-x-2 mt-3 pt-2.5 border-t border-[#ff9900]/30">
          <span className="text-[10px] text-[#ff9900] uppercase font-semibold">Terminal Commands:</span>
          <button
            onClick={() => setCurrentView('FA')}
            className="px-2 py-1 bg-[#191c24] hover:bg-[#ff9900] hover:text-black text-[#9ba3b5] border border-[#ff9900]/40 rounded-xs cursor-pointer text-[10px] transition-colors"
          >
            FA &lt;GO&gt; 5Y Financials
          </button>
          <button
            onClick={() => setCurrentView('GP')}
            className="px-2 py-1 bg-[#191c24] hover:bg-[#ff9900] hover:text-black text-[#9ba3b5] border border-[#ff9900]/40 rounded-xs cursor-pointer text-[10px] transition-colors"
          >
            GP &lt;GO&gt; Candlestick Chart
          </button>
          <button
            onClick={() => setCurrentView('MD')}
            className="px-2 py-1 bg-[#191c24] hover:bg-[#ff9900] hover:text-black text-[#9ba3b5] border border-[#ff9900]/40 rounded-xs cursor-pointer text-[10px] transition-colors"
          >
            MD &lt;GO&gt; Level 2 Depth
          </button>
          <button
            onClick={() => setCurrentView('SEC')}
            className="px-2 py-1 bg-[#191c24] hover:bg-[#ff9900] hover:text-black text-[#9ba3b5] border border-[#ff9900]/40 rounded-xs cursor-pointer text-[10px] transition-colors"
          >
            SEC &lt;GO&gt; 10-K Filings
          </button>
          <button
            onClick={() => setCurrentView('B-QUANT')}
            className="px-2 py-1 bg-[#191c24] hover:bg-[#ff9900] hover:text-black text-[#9ba3b5] border border-[#ff9900]/40 rounded-xs cursor-pointer text-[10px] transition-colors"
          >
            B-QUANT &lt;GO&gt; Quant Memo
          </button>
        </div>
      </div>

      {/* Main Grid: Description, Multiples & Trading Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: Key Multiples & Valuation */}
        <div className="bg-[#121419] border border-[#ff9900]/60 p-3 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="text-[#ff9900] font-bold text-xs uppercase mb-2 pb-1 border-b border-[#ff9900]/30 flex items-center justify-between">
            <span>Valuation & Multiples</span>
            <span className="text-[10px] text-[#ff9900]/70">B-VAL ENGINE</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Market Capitalization</span>
              <span className="text-white font-bold">{activeSecurity.marketCap}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">P/E (Trailing 12M)</span>
              <span className="text-white font-bold">{activeSecurity.peTrailing ? `${activeSecurity.peTrailing}x` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">P/E (Forward 1Yr)</span>
              <span className="text-white font-bold">{activeSecurity.peForward ? `${activeSecurity.peForward}x` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">EV / EBITDA</span>
              <span className="text-white font-bold">{activeSecurity.evEbitda ? `${activeSecurity.evEbitda}x` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Price / Sales</span>
              <span className="text-white font-bold">{activeSecurity.priceToSales ? `${activeSecurity.priceToSales}x` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Price / Book</span>
              <span className="text-white font-bold">{activeSecurity.priceToBook ? `${activeSecurity.priceToBook}x` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Dividend Yield</span>
              <span className="text-white font-bold">{activeSecurity.dividendYield ? `${activeSecurity.dividendYield}%` : '0.00%'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#848c9e]">Beta (5Y Monthly)</span>
              <span className="text-white font-bold">{activeSecurity.beta ? activeSecurity.beta.toFixed(2) : '1.00'}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Trading Ranges & Intraday Liquidity */}
        <div className="bg-[#121419] border border-[#ff9900]/60 p-3 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="text-[#ff9900] font-bold text-xs uppercase mb-2 pb-1 border-b border-[#ff9900]/30 flex items-center justify-between">
            <span>Intraday & Liquidity Profile</span>
            <span className="text-[10px] text-[#ff9900]/70">EXCHANGE FEED</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Day Open</span>
              <span className="text-white font-medium">${activeSecurity.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Day Range (Low / High)</span>
              <span className="text-white font-medium">${activeSecurity.dayLow.toFixed(2)} - ${activeSecurity.dayHigh.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Previous Close</span>
              <span className="text-white font-medium">${activeSecurity.prevClose.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">VWAP (Volume-Weighted)</span>
              <span className="text-[#ff9900] font-bold">${activeSecurity.vwap.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Today's Trading Volume</span>
              <span className="text-white font-bold">{(activeSecurity.volume / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Average 30D Volume</span>
              <span className="text-white font-medium">{(activeSecurity.avgVolume / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#1b1e26]">
              <span className="text-[#848c9e]">Short Interest (% Float)</span>
              <span className="text-white font-medium">{activeSecurity.shortInterestPct ? `${activeSecurity.shortInterestPct}%` : '1.1%'}</span>
            </div>

            {/* 52-Week Range Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#7e8798]">52W Low: ${activeSecurity.week52Low.toFixed(2)}</span>
                <span className="text-[#7e8798]">52W High: ${activeSecurity.week52High.toFixed(2)}</span>
              </div>
              <div className="w-full bg-[#1b1e27] h-2 rounded-xs relative border border-[#ff9900]/20">
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-[#ff9900] rounded-xs -ml-1"
                  style={{ left: `${currentPosPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Business Profile & Governance */}
        <div className="bg-[#121419] border border-[#ff9900]/60 p-3 rounded-xs flex flex-col justify-between shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div>
            <div className="text-[#ff9900] font-bold text-xs uppercase mb-2 pb-1 border-b border-[#ff9900]/30 flex items-center justify-between">
              <span>Corporate Profile</span>
              <span className="text-[10px] text-[#ff9900]/70">SEC 10-K SUMMARY</span>
            </div>
            <p className="text-[#b2bacb] text-xs leading-relaxed font-sans font-normal mb-3">
              {activeSecurity.description}
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#1b1e26]">
                <span className="text-[#848c9e]">Industry</span>
                <span className="text-white font-medium">{activeSecurity.industry || 'Technology'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b1e26]">
                <span className="text-[#848c9e]">Leadership (CEO)</span>
                <span className="text-white font-medium">{activeSecurity.ceo || 'Executive Board'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1b1e26]">
                <span className="text-[#848c9e]">Headquarters</span>
                <span className="text-white font-medium">{activeSecurity.headquarters || 'United States'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#848c9e]">Shares Outstanding</span>
                <span className="text-white font-medium">{activeSecurity.sharesOutstanding || 'Float Multi-Class'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1d2028] flex items-center justify-between text-[11px] text-[#687182]">
            <span>Bloomberg DES Engine</span>
            <span>Security ID: {activeSecurity.ticker}.US</span>
          </div>
        </div>
      </div>
    </div>
  );
};
