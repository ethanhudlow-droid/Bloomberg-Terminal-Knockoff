import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalContext';
import { TerminalFunctionCode } from '../types/terminal';
import {
  Activity,
  Volume2,
  VolumeX,
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
  Globe
} from 'lucide-react';

interface NavItem {
  code: TerminalFunctionCode;
  label: string;
  hotkey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { code: 'DASH', label: 'MARKET', hotkey: 'F1', icon: Globe },
  { code: 'DES', label: 'DES', hotkey: 'F2', icon: TrendingUp },
  { code: 'GP', label: 'GP', hotkey: 'F3', icon: BarChart2 },
  { code: 'MD', label: 'MD', hotkey: 'F4', icon: Layers },
  { code: 'FA', label: 'FA', hotkey: 'F5', icon: FileText },
  { code: 'WATCH', label: 'TICKER', hotkey: 'F6', icon: List },
  { code: 'SEC', label: 'SEC', hotkey: 'F7', icon: FileCheck },
  { code: 'YCRV', label: 'YCRV', hotkey: 'F8', icon: Activity },
  { code: 'N', label: 'NEWS', hotkey: 'F9', icon: Radio },
  { code: 'B-QUANT', label: 'B-QUANT', hotkey: 'F10', icon: Cpu },
  { code: 'WORKSPACE', label: '4-QUAD', hotkey: 'F11', icon: Sliders },
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
    lastSyncTime,
    isAudioOn,
    toggleAudio
  } = useTerminal();

  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <header className="bg-[#101217] border-b border-[#242731] select-none text-xs">
      {/* Top Functional Utility Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#1b1e26] text-[#8e95a5]">
        {/* Zone 1: Terminal Branding & Active Symbol */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff9900] shadow-[0_0_8px_#ff9900]"></span>
            <span className="font-bold tracking-wider text-[#ff9900] font-mono-bbg uppercase">
              APEX // TERMINAL
            </span>
            <span className="text-[10px] text-[#555d6e] px-1 py-0.5 bg-[#181b22] border border-[#2b303c] rounded">
              B-PRO v2026.4
            </span>
          </div>

          <div className="h-3 w-[1px] bg-[#292e3a]"></div>

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

        {/* Zone 3: Command Line Box & Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Bloomberg Command Prompt */}
          <form onSubmit={handleCommandSubmit} className="flex items-center">
            <div className="relative flex items-center">
              <span className="absolute left-2 text-[#ff9900] font-bold font-mono-bbg text-xs">&gt;</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="NVDA FA <GO> or AAPL GP..."
                className="bg-[#08090b] text-[#f0f2f7] border border-[#303542] hover:border-[#ff9900] focus:border-[#ff9900] focus:outline-none pl-6 pr-14 py-1 text-xs font-mono-bbg rounded-sm w-48 sm:w-64 placeholder-[#4f5666] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1 px-1.5 py-0.5 text-[10px] font-bold font-mono-bbg bg-[#ff9900] text-black hover:bg-[#ffb033] rounded-xs cursor-pointer tracking-wider"
              >
                &lt;GO&gt;
              </button>
            </div>
          </form>

          {/* Live Data Feed Connection Badge */}
          <button
            onClick={handleRefreshClick}
            title={`Real-Time Market Sync: ${lastSyncTime}. Click to sync now.`}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded border text-[10px] font-mono-bbg transition-all cursor-pointer ${
              isLiveFeedConnected
                ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40'
                : 'border-amber-800/60 bg-amber-950/30 text-amber-400'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#ff9900]' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'SYNCING...' : 'LIVE 10s'}
            </span>
          </button>

          {/* Tick Engine Toggle & Speed Selector */}
          <div className="flex items-center space-x-1 bg-[#16181f] border border-[#272b36] rounded px-1.5 py-0.5">
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

          {/* Audio Chimes Toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioOn ? 'Audio Chimes Enabled' : 'Audio Chimes Muted'}
            className={`p-1 border rounded cursor-pointer ${
              isAudioOn
                ? 'border-[#ff9900]/40 text-[#ff9900] bg-[#ff9900]/10'
                : 'border-[#272b36] text-[#555d6e] hover:text-[#9ea6b5]'
            }`}
          >
            {isAudioOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links & Function Keys (F1 - F10) */}
      <nav className="flex items-center px-2 py-1 overflow-x-auto no-scrollbar bg-[#0d0e12] space-x-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.code;
          const Icon = item.icon;
          return (
            <button
              key={item.code}
              onClick={() => setCurrentView(item.code)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono-bbg border transition-all cursor-pointer whitespace-nowrap rounded-xs ${
                isActive
                  ? 'border-[#ff9900] bg-[#ff9900] text-black font-bold shadow-[0_0_10px_rgba(255,153,0,0.3)]'
                  : 'border-[#20232c] bg-[#13151b] text-[#9ba2b3] hover:text-white hover:border-[#383e4d] hover:bg-[#1a1d25]'
              }`}
            >
              <span className={`text-[10px] font-semibold px-1 py-0.2 rounded-xs ${
                isActive ? 'bg-black text-[#ff9900]' : 'bg-[#21242d] text-[#6d7586]'
              }`}>
                {item.hotkey}
              </span>
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
