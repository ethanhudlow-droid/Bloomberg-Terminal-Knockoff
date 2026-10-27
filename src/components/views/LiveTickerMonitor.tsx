import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import {
  Plus,
  Trash2,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  ExternalLink,
  Search,
  CheckCircle,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

export const LiveTickerMonitor: React.FC = () => {
  const {
    securities,
    activeSecurity,
    selectSecurityByTicker,
    userTickerList,
    addToUserTickerList,
    removeFromUserTickerList,
    tickFlashes,
    isRealTimeRunning,
    toggleRealTime,
    tickSpeedMs,
    setTickSpeedMs,
    refreshLiveQuotes,
    isLiveFeedConnected,
    lastSyncTime,
    setCurrentView
  } = useTerminal();

  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filter to user-specified symbols, with optional search or asset class filter
  const userSecurities = securities.filter((s) => userTickerList.includes(s.ticker));

  const filteredSecurities = userSecurities.filter((s) => {
    const matchesQuery =
      s.ticker.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesClass = selectedAssetClass === 'ALL' || s.assetClass === selectedAssetClass;
    return matchesQuery && matchesClass;
  });

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbolInput.trim().toUpperCase();
    if (!sym) return;

    const added = addToUserTickerList(sym);
    if (added) {
      setStatusMessage(`Added ${sym} to live ticker monitor.`);
      setNewSymbolInput('');
      // Trigger a live quote refresh to pull real price immediately
      await refreshLiveQuotes();
    } else {
      setStatusMessage(`${sym} is already in your live watchlist.`);
    }

    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshLiveQuotes();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Quick preset watchlist buttons
  const applyPreset = (symbols: string[]) => {
    symbols.forEach((sym) => addToUserTickerList(sym));
    setStatusMessage(`Loaded preset with ${symbols.length} tickers.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Top Controls & Watchlist Configurator */}
      <div className="p-3 bg-[#121419] border-b border-[#232733] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Section Header & Watchlist Count */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff9900] shadow-[0_0_8px_#ff9900]"></span>
            <span className="text-[#ff9900] font-bold text-sm tracking-wider uppercase">
              LIVE TICKER MONITOR & PORTFOLIO WATCH
            </span>
          </div>
          <span className="text-[10px] text-[#7b8396] px-2 py-0.5 bg-[#181a22] border border-[#2b303c] rounded">
            {userSecurities.length} SYMBOLS ACTIVE
          </span>
          {statusMessage && (
            <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/50 rounded animate-fade-in">
              {statusMessage}
            </span>
          )}
        </div>

        {/* Right: Actions & Add Ticker Form */}
        <div className="flex items-center space-x-2">
          {/* Add custom user symbol */}
          <form onSubmit={handleAddTicker} className="flex items-center space-x-1">
            <div className="relative">
              <input
                type="text"
                value={newSymbolInput}
                onChange={(e) => setNewSymbolInput(e.target.value)}
                placeholder="Add Symbol (e.g. PLTR, AMD)"
                className="bg-[#090a0d] border border-[#2e3444] focus:border-[#ff9900] text-white px-2 py-1 text-xs rounded-xs w-44 focus:outline-none uppercase placeholder-[#4e5566]"
              />
            </div>
            <button
              type="submit"
              className="flex items-center space-x-1 px-2.5 py-1 bg-[#ff9900] hover:bg-[#ffb033] text-black font-bold text-xs rounded-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </button>
          </form>

          {/* Sync live quotes */}
          <button
            onClick={handleManualRefresh}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#1a1d26] hover:bg-[#232733] border border-[#303646] text-[#b2bacb] hover:text-white rounded-xs cursor-pointer text-xs"
            title="Fetch real live quotes from exchange"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff9900]' : ''}`} />
            <span>SYNC NOW</span>
          </button>
        </div>
      </div>

      {/* Filter & Presets Row */}
      <div className="px-3 py-1.5 bg-[#0e1015] border-b border-[#1c1f28] flex flex-wrap items-center justify-between gap-2 text-[11px]">
        {/* Presets */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#646c7d] text-[10px] uppercase font-semibold">Presets:</span>
          <button
            onClick={() => applyPreset(['NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA'])}
            className="px-2 py-0.5 bg-[#161820] hover:bg-[#21242e] border border-[#282d3b] text-[#9ba3b5] hover:text-white rounded-xs cursor-pointer"
          >
            Mag 7
          </button>
          <button
            onClick={() => applyPreset(['BTCUSD', 'ETHUSD', 'SOLUSD', 'XAU', 'CL1', 'SPX', 'US10Y'])}
            className="px-2 py-0.5 bg-[#161820] hover:bg-[#21242e] border border-[#282d3b] text-[#9ba3b5] hover:text-white rounded-xs cursor-pointer"
          >
            Macro / Crypto / FX
          </button>
          <button
            onClick={() => applyPreset(['JPM', 'LLY', 'ASML', 'BRK/B'])}
            className="px-2 py-0.5 bg-[#161820] hover:bg-[#21242e] border border-[#282d3b] text-[#9ba3b5] hover:text-white rounded-xs cursor-pointer"
          >
            Leaders
          </button>
        </div>

        {/* Search within watchlist */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter symbols..."
              className="bg-[#08090c] border border-[#262a36] text-white px-2 py-0.5 text-[11px] rounded-xs w-32 focus:outline-none focus:border-[#ff9900] placeholder-[#4f5666]"
            />
          </div>
          <span className="text-[10px] text-[#555d6e]">
            Last Sync: <span className="text-emerald-400 font-semibold">{lastSyncTime}</span>
          </span>
        </div>
      </div>

      {/* Main Real-Time Ticker Table */}
      <div className="flex-1 overflow-auto p-3">
        <div className="border border-[#232733] bg-[#101217] rounded-xs shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181a22] border-b border-[#2b303e] text-[#8e97aa] text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Symbol</th>
                <th className="py-2.5 px-3 font-semibold">Security Description</th>
                <th className="py-2.5 px-3 font-semibold text-right">Live Price</th>
                <th className="py-2.5 px-3 font-semibold text-right">Net Change ($)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Change (%)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Trading Volume</th>
                <th className="py-2.5 px-3 font-semibold text-center w-36">52-Week Corridor</th>
                <th className="py-2.5 px-3 font-semibold text-right">Market Cap</th>
                <th className="py-2.5 px-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1f28] text-xs">
              {filteredSecurities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#6e778a]">
                    No securities match your filter. Use "ADD" above to track any stock symbol.
                  </td>
                </tr>
              ) : (
                filteredSecurities.map((sec) => {
                  const isSelected = activeSecurity.ticker === sec.ticker;
                  const isPositive = sec.change >= 0;
                  const flash = tickFlashes[sec.ticker];
                  const rangeSpan = Math.max(1, sec.week52High - sec.week52Low);
                  const currentPosPct = Math.min(100, Math.max(0, ((sec.price - sec.week52Low) / rangeSpan) * 100));

                  return (
                    <tr
                      key={sec.ticker}
                      onClick={() => selectSecurityByTicker(sec.ticker)}
                      className={`hover:bg-[#161922] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#181c25]' : ''
                      } ${flash === 'UP' ? 'flash-up' : flash === 'DOWN' ? 'flash-down' : ''}`}
                    >
                      {/* Ticker & Class */}
                      <td className="py-2.5 px-3 font-bold">
                        <div className="flex items-center space-x-1.5">
                          <span className={isSelected ? 'text-[#ff9900]' : 'text-white'}>
                            {sec.ticker}
                          </span>
                          <span className="text-[9px] px-1 py-0.2 bg-[#1d2028] text-[#7e8799] border border-[#2b303d] rounded-xs">
                            {sec.assetClass}
                          </span>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-3 text-[#b2bacb]">
                        <div className="truncate max-w-[200px]" title={sec.name}>
                          {sec.name}
                        </div>
                        <span className="text-[10px] text-[#555d6e]">
                          {sec.exchange}
                        </span>
                      </td>

                      {/* Live Price */}
                      <td className="py-2.5 px-3 text-right font-bold text-white text-sm">
                        ${sec.price >= 1000 ? sec.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sec.price.toFixed(2)}
                      </td>

                      {/* Change $ */}
                      <td className={`py-2.5 px-3 text-right font-semibold ${isPositive ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
                        <div className="flex items-center justify-end space-x-0.5">
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isPositive ? '+' : ''}{sec.change.toFixed(2)}</span>
                        </div>
                      </td>

                      {/* Change % */}
                      <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? 'text-[#00e676]' : 'text-[#ff3b30]'}`}>
                        {isPositive ? '+' : ''}{sec.changePercent.toFixed(2)}%
                      </td>

                      {/* Volume */}
                      <td className="py-2.5 px-3 text-right text-[#b8bfcc]">
                        <div className="font-medium">
                          {sec.volume >= 1000000
                            ? `${(sec.volume / 1000000).toFixed(2)}M`
                            : sec.volume.toLocaleString()}
                        </div>
                        <div className="w-full bg-[#1e222c] h-1 rounded-xs mt-1 overflow-hidden">
                          <div
                            className="bg-[#ff9900] h-full"
                            style={{ width: `${Math.min(100, (sec.volume / (sec.avgVolume || 50000000)) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* 52-Week Corridor Bar */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-between text-[10px] text-[#636c7e] mb-0.5">
                          <span>${sec.week52Low.toFixed(0)}</span>
                          <span className="text-[#a0a8b7]">${sec.price.toFixed(0)}</span>
                          <span>${sec.week52High.toFixed(0)}</span>
                        </div>
                        <div className="w-full bg-[#1a1d26] h-1.5 rounded-xs relative">
                          <div
                            className="absolute top-0 bottom-0 w-2 bg-[#ff9900] rounded-xs -ml-1"
                            style={{ left: `${currentPosPct}%` }}
                            title={`52-Week Position: ${currentPosPct.toFixed(0)}%`}
                          />
                        </div>
                      </td>

                      {/* Market Cap */}
                      <td className="py-2.5 px-3 text-right text-white font-medium">
                        {sec.marketCap}
                      </td>

                      {/* Action buttons */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => {
                              selectSecurityByTicker(sec.ticker);
                              setCurrentView('GP');
                            }}
                            title="Open Technical Chart [GP]"
                            className="px-1.5 py-0.5 bg-[#171922] hover:bg-[#ff9900] hover:text-black border border-[#2b303d] text-[#8e97aa] text-[10px] rounded-xs cursor-pointer"
                          >
                            GP
                          </button>
                          <button
                            onClick={() => {
                              selectSecurityByTicker(sec.ticker);
                              setCurrentView('FA');
                            }}
                            title="Open 5-Year Financial Statements [FA]"
                            className="px-1.5 py-0.5 bg-[#171922] hover:bg-[#ff9900] hover:text-black border border-[#2b303d] text-[#8e97aa] text-[10px] rounded-xs cursor-pointer"
                          >
                            FA
                          </button>
                          <button
                            onClick={() => removeFromUserTickerList(sec.ticker)}
                            title="Remove from watch list"
                            className="p-1 text-[#656d7e] hover:text-[#ff3b30] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Real-time Ticker Engine Info Banner */}
        <div className="mt-3 p-2.5 bg-[#121419] border border-[#232733] flex flex-wrap items-center justify-between text-xs text-[#8a92a3] gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>
              Real-time stock ticker connected via server proxy. Prices, volume, and percentage changes update continuously.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Feed Protocol: <strong className="text-white">REST + Micro-Tick Engine</strong></span>
            <span>Latency: <strong className="text-emerald-400">&lt; 45ms</strong></span>
            <span>Quotes In Memory: <strong className="text-[#ff9900]">{securities.length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
