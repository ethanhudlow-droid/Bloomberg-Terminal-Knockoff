import React, { useState, useRef, useEffect } from 'react';
import { useTerminal } from '../context/TerminalContext';
import { TerminalFunctionCode } from '../types/terminal';
import { soundService } from '../services/soundService';
import {
  Activity,
  RefreshCw,
  Search,
  Play,
  Pause,
  Sliders,
  TrendingUp,
  Cpu,
  FileText,
  Layers,
  FileCheck,
  Radio,
  BarChart2,
  List,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';

interface NavItem {
  code: TerminalFunctionCode;
  label: string;
  description: string;
  hotkey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { code: 'DASH', label: 'MARKET', description: 'Cross-Asset Performance & Macro Economic Dashboard', hotkey: 'F1', icon: Globe },
  { code: 'DES', label: 'DES', description: 'Company Overview, Multiples & Capital Structure', hotkey: 'F2', icon: TrendingUp },
  { code: 'GP', label: 'GP', description: 'Technical Price Candlestick & Volume Chart', hotkey: 'F3', icon: BarChart2 },
  { code: 'MD', label: 'MD', description: 'Level 2 Order Book & Depth of Market', hotkey: 'F4', icon: Layers },
  { code: 'FA', label: 'FA', description: '5-Year Financial Statements (IS, BS, CF)', hotkey: 'F5', icon: FileText },
  { code: 'WATCH', label: 'TICKER', description: 'Real-Time Multi-Asset Live Quote Monitor', hotkey: 'F6', icon: List },
  { code: 'SEC', label: 'SEC', description: 'EDGAR Regulatory Filings (10-K, 10-Q, 8-K)', hotkey: 'F7', icon: FileCheck },
  { code: 'YCRV', label: 'YCRV', description: 'US Sovereign Yield Curve & Treasury Spreads', hotkey: 'F8', icon: Activity },
  { code: 'N', label: 'NEWS', description: 'Real-Time Institutional Financial News Wire', hotkey: 'F9', icon: Radio },
  { code: 'B-QUANT', label: 'B-QUANT', description: 'Gemini AI Equity Research Memo & Stress Test', hotkey: 'F10', icon: Cpu },
  { code: 'WORKSPACE', label: '4-QUAD', description: 'Multi-Panel Quad Workspace Grid', hotkey: 'F11', icon: Sliders },
];

export const TerminalHeader: React.FC = () => {
  const {
    activeSecurity,
    currentView,
    setCurrentView,
    commandInput,
    setCommandInput,
    executeCommand,
    isRealTimeRunning,
    toggleRealTime,
    tickSpeedMs,
    setTickSpeedMs,
    refreshLiveQuotes,
    isLiveFeedConnected,
    lastSyncTime
  } = useTerminal();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const activeItem = NAV_ITEMS.find((item) => item.code === currentView) || NAV_ITEMS[0];
  const ActiveIcon = activeItem.icon;

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      executeCommand(commandInput);
    }
  };

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await refreshLiveQuotes();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="bg-[#101217] border-b border-[#ff9900]/50 select-none text-xs shadow-[0_1px_8px_rgba(255,153,0,0.08)]">
      {/* Unified Functional Utility Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 text-[#8e95a5] gap-2.5">
        {/* Left Side: Command Line Box + Function Dropdown + Active Symbol */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-visible">
          {/* Bloomberg Command Prompt */}
          <form onSubmit={handleCommandSubmit} className="flex items-center">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-[#ff9900] font-bold font-mono-bbg text-xs select-none">&gt;</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="NVDA FA <GO> or AAPL GP..."
                className="bg-[#08090b] text-[#f0f2f7] border border-[#ff9900]/60 hover:border-[#ff9900] focus:border-[#ff9900] focus:outline-none pl-6 pr-13 py-1 text-xs font-mono-bbg rounded-sm w-44 sm:w-56 md:w-64 placeholder-[#4f5666] transition-colors shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 px-1.5 py-0.5 text-[10px] font-bold font-mono-bbg bg-[#ff9900] text-black hover:bg-[#ffb033] rounded-xs cursor-pointer tracking-wider"
              >
                &lt;GO&gt;
              </button>
            </div>
          </form>

          <div className="h-4 w-[1px] bg-[#ff9900]/40 shrink-0"></div>

          {/* Function Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="listbox"
              className="flex items-center space-x-2 px-2.5 py-1 bg-[#14161d] hover:bg-[#1a1d26] border border-[#ff9900] rounded-sm text-[#e0e2ec] cursor-pointer transition-all shadow-[0_0_8px_rgba(255,153,0,0.18)] group font-mono-bbg"
            >
              <span className="bg-[#ff9900] text-black font-bold text-[10px] px-1.5 py-0.2 rounded-xs tracking-wide">
                {activeItem.hotkey}
              </span>
              <ActiveIcon className="w-3.5 h-3.5 text-[#ff9900]" />
              <span className="font-bold text-white tracking-wide text-xs">
                {activeItem.label}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-[#ff9900] transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Floating Dropdown Menu Panel */}
            {isMenuOpen && (
              <div
                role="listbox"
                className="absolute left-0 top-full mt-1.5 w-[330px] sm:w-[400px] bg-[#101217] border border-[#ff9900]/60 rounded-sm shadow-2xl z-50 overflow-hidden py-1 divide-y divide-[#1f232d] font-mono-bbg"
              >
                <div className="px-3 py-1.5 bg-[#161820] flex items-center justify-between text-[10px] text-[#788294]">
                  <span className="font-bold text-[#ff9900] tracking-wider uppercase">
                    AVAILABLE FUNCTIONS ({NAV_ITEMS.length})
                  </span>
                  <span>HOTKEY [F1-F11]</span>
                </div>
                <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                  {NAV_ITEMS.map((item) => {
                    const isActive = currentView === item.code;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          setCurrentView(item.code);
                          setIsMenuOpen(false);
                          soundService.playChime('EXECUTE');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-[#ff9900]/15 text-[#ff9900] border-l-2 border-[#ff9900]'
                            : 'hover:bg-[#181a22] text-[#c4cad4] hover:text-white border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs ${
                              isActive
                                ? 'bg-[#ff9900] text-black'
                                : 'bg-[#20232c] text-[#8e96a7]'
                            }`}
                          >
                            {item.hotkey}
                          </span>
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#ff9900]' : 'text-[#8e96a7]'}`} />
                          <div>
                            <div className="font-semibold text-xs tracking-wide">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-[#6d7586] font-normal truncate max-w-[210px] sm:max-w-[270px]">
                              {item.description}
                            </div>
                          </div>
                        </div>

                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-[#ff9900] shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#ff9900]/40 shrink-0 hidden sm:block"></div>

          {/* Active Security Identity */}
          <div className="flex items-center space-x-2 font-mono-bbg">
            <span className="text-[#ff9900] font-bold text-sm tracking-wide">
              {activeSecurity.bloombergSymbol}
            </span>
            <span className="text-[#a4abb8] font-normal hidden md:inline">
              {activeSecurity.name}
            </span>
            <span className="text-[#646c7d] text-[10px] hidden lg:inline">
              ({activeSecurity.exchange})
            </span>
          </div>
        </div>

        {/* Right Side: Live Sync, Speed & Controls (Audio and Quick Jump removed) */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Live Data Feed Connection Badge */}
          <button
            onClick={handleRefreshClick}
            title={`Real-Time Market Sync: ${lastSyncTime}. Click to sync now.`}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded border text-[10px] font-mono-bbg transition-all cursor-pointer ${
              isLiveFeedConnected
                ? 'border-emerald-600/70 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40'
                : 'border-[#ff9900]/70 bg-amber-950/30 text-amber-400'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#ff9900]' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'SYNCING...' : 'LIVE 10s'}
            </span>
          </button>

          {/* Tick Engine Toggle & Speed Selector */}
          <div className="flex items-center space-x-1 bg-[#16181f] border border-[#ff9900]/50 rounded px-1.5 py-0.5">
            <button
              onClick={toggleRealTime}
              title={isRealTimeRunning ? 'Pause micro-ticks' : 'Resume micro-ticks'}
              className="text-[#9ea6b5] hover:text-[#ff9900] cursor-pointer p-0.5"
            >
              {isRealTimeRunning ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-[#ff9900]" />}
            </button>
            <select
              value={tickSpeedMs}
              onChange={(e) => setTickSpeedMs(Number(e.target.value))}
              className="bg-transparent text-[10px] font-mono-bbg text-[#a0a8b7] focus:outline-none cursor-pointer border-none py-0.5"
              title="Tick Engine Frequency"
            >
              <option value={800} className="bg-[#121418] text-white">0.8s (Fast)</option>
              <option value={1500} className="bg-[#121418] text-white">1.5s (Std)</option>
              <option value={3000} className="bg-[#121418] text-white">3.0s (Slow)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
