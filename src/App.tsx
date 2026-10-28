import React, { useEffect, useState } from 'react';
import { TerminalProvider, useTerminal } from './context/TerminalContext';
import { TerminalHeader } from './components/TerminalHeader';
import { LiveTickerBar } from './components/LiveTickerBar';
import { MarketMacroDashboard } from './components/views/MarketMacroDashboard';
import { SecurityOverview } from './components/views/SecurityOverview';
import { TechnicalChart } from './components/views/TechnicalChart';
import { MarketDepth } from './components/views/MarketDepth';
import { FinancialAnalysis } from './components/views/FinancialAnalysis';
import { LiveTickerMonitor } from './components/views/LiveTickerMonitor';
import { SecFilings } from './components/views/SecFilings';
import { YieldCurveView } from './components/views/YieldCurveView';
import { TerminalNews } from './components/views/TerminalNews';
import { QuantAnalyst } from './components/views/QuantAnalyst';
import { QuadWorkspace } from './components/views/QuadWorkspace';
import { soundService } from './services/soundService';
import { ErrorBoundary } from './components/ErrorBoundary';

const TerminalContent: React.FC = () => {
  const { currentView, setCurrentView } = useTerminal();
  const [clockTime, setClockTime] = useState<string>('');

  // Real-time UTC + EDT clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          timeZone: 'America/New_York',
        }) + ' EDT'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcuts (F1 - F11, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          setCurrentView('DASH');
          soundService.playChime('EXECUTE');
          break;
        case 'F2':
          e.preventDefault();
          setCurrentView('DES');
          soundService.playChime('EXECUTE');
          break;
        case 'F3':
          e.preventDefault();
          setCurrentView('GP');
          soundService.playChime('EXECUTE');
          break;
        case 'F4':
          e.preventDefault();
          setCurrentView('MD');
          soundService.playChime('EXECUTE');
          break;
        case 'F5':
          e.preventDefault();
          setCurrentView('FA');
          soundService.playChime('EXECUTE');
          break;
        case 'F6':
          e.preventDefault();
          setCurrentView('WATCH');
          soundService.playChime('EXECUTE');
          break;
        case 'F7':
          e.preventDefault();
          setCurrentView('SEC');
          soundService.playChime('EXECUTE');
          break;
        case 'F8':
          e.preventDefault();
          setCurrentView('YCRV');
          soundService.playChime('EXECUTE');
          break;
        case 'F9':
          e.preventDefault();
          setCurrentView('N');
          soundService.playChime('EXECUTE');
          break;
        case 'F10':
          e.preventDefault();
          setCurrentView('B-QUANT');
          soundService.playChime('EXECUTE');
          break;
        case 'F11':
          e.preventDefault();
          setCurrentView('WORKSPACE');
          soundService.playChime('EXECUTE');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentView]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0c0d10] text-[#e6e8ee] overflow-hidden select-none">
      {/* Bloomberg Navigation Header */}
      <TerminalHeader />

      {/* Real-Time Live Ticker Tape */}
      <LiveTickerBar />

      {/* Main Terminal Viewport */}
      <main className="flex-1 flex overflow-hidden relative">
        {currentView === 'DASH' && <MarketMacroDashboard />}
        {currentView === 'DES' && <SecurityOverview />}
        {currentView === 'GP' && <TechnicalChart />}
        {currentView === 'MD' && <MarketDepth />}
        {currentView === 'FA' && <FinancialAnalysis />}
        {currentView === 'WATCH' && <LiveTickerMonitor />}
        {currentView === 'SEC' && <SecFilings />}
        {currentView === 'YCRV' && <YieldCurveView />}
        {currentView === 'N' && <TerminalNews />}
        {currentView === 'B-QUANT' && <QuantAnalyst />}
        {currentView === 'WORKSPACE' && <QuadWorkspace />}
      </main>

      {/* High-Density Terminal Bottom Status Bar */}
      <footer className="h-6 bg-[#090a0c] border-t border-[#ff9900]/40 px-3 flex items-center justify-between text-[10px] font-mono-bbg text-[#788194] shrink-0">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-semibold">EXCHANGE: OPEN</span>
          </span>
          <span className="text-[#3c4250]">|</span>
          <span className="hidden sm:inline">PROTOCOL: SIP LEVEL-1/2 FEED</span>
          <span className="text-[#3c4250] hidden sm:inline">|</span>
          <span className="hidden md:inline">LATENCY: 14ms</span>
        </div>

        {/* Hotkey Guide */}
        <div className="hidden xl:flex items-center space-x-2 text-[#5a6273]">
          <span><strong className="text-[#ff9900]">F1</strong> MARKET</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F2</strong> DES</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F3</strong> GP</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F4</strong> MD</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F5</strong> FA</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F6</strong> TICKER</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F7</strong> SEC</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F8</strong> YCRV</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F9</strong> NEWS</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F10</strong> QUANT</span>
          <span>&bull;</span>
          <span><strong className="text-[#ff9900]">F11</strong> 4-QUAD</span>
        </div>

        {/* Clock & Status */}
        <div className="flex items-center space-x-2 font-bold text-white">
          <span className="text-[#ff9900]">{clockTime}</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <TerminalProvider>
        <TerminalContent />
      </TerminalProvider>
    </ErrorBoundary>
  );
}
