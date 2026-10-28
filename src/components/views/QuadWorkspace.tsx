import React from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { TechnicalChart } from './TechnicalChart';
import { FinancialAnalysis } from './FinancialAnalysis';
import { MarketDepth } from './MarketDepth';
import { LiveTickerMonitor } from './LiveTickerMonitor';
import { SecurityOverview } from './SecurityOverview';

export const QuadWorkspace: React.FC = () => {
  const { activeSecurity } = useTerminal();

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-1 p-1 bg-[#090a0d] overflow-hidden h-full">
      {/* Quadrant 1: Chart */}
      <div className="flex flex-col border border-[#ff9900]/60 bg-[#0c0d10] overflow-hidden rounded-xs">
        <TechnicalChart />
      </div>

      {/* Quadrant 2: Level 2 Depth */}
      <div className="flex flex-col border border-[#ff9900]/60 bg-[#0c0d10] overflow-hidden rounded-xs">
        <MarketDepth />
      </div>

      {/* Quadrant 3: 5Y Financial Statements */}
      <div className="flex flex-col border border-[#ff9900]/60 bg-[#0c0d10] overflow-hidden rounded-xs">
        <FinancialAnalysis />
      </div>

      {/* Quadrant 4: Live Ticker Monitor */}
      <div className="flex flex-col border border-[#ff9900]/60 bg-[#0c0d10] overflow-hidden rounded-xs">
        <LiveTickerMonitor />
      </div>
    </div>
  );
};
