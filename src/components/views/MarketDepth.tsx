import React from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { Layers, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const MarketDepth: React.FC = () => {
  const { activeSecurity, orderBook, timeAndSales } = useTerminal();

  const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 1;
  const maxAskTotal = orderBook.asks[orderBook.asks.length - 1]?.total || 1;
  const maxCumulative = Math.max(maxBidTotal, maxAskTotal);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#232733]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            MD: {activeSecurity.ticker} US EQUITY
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | LEVEL 2 ORDER BOOK & TIME AND SALES
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[#7d8697]">
            Spread: <strong className="text-white">${orderBook.spread.toFixed(2)}</strong> ({orderBook.spreadBps.toFixed(1)} bps)
          </span>
          <span className="text-[#7d8697]">
            Exchange: <strong className="text-white">{activeSecurity.exchange}</strong>
          </span>
        </div>
      </div>

      {/* Main Content: Ladder on Left / Time & Sales on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 p-2 overflow-hidden">
        {/* Level 2 Order Book Ladder (Bids & Asks) */}
        <div className="lg:col-span-2 flex flex-col border border-[#232733] bg-[#101217] rounded-xs overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-[#232733] border-b border-[#232733] bg-[#161820] text-[11px] font-semibold text-[#8b94a6] uppercase py-1.5 px-2">
            <div className="flex justify-between pr-2 text-emerald-400">
              <span>BIDS (BUY ORDERS)</span>
              <span>SIZE / TOTAL</span>
            </div>
            <div className="flex justify-between pl-2 text-red-400">
              <span>PRICE / SIZE</span>
              <span>ASKS (SELL ORDERS)</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 divide-x divide-[#232733] overflow-y-auto">
            {/* Bids Ladder */}
            <div className="divide-y divide-[#181a22]">
              {orderBook.bids.map((bid, i) => {
                const depthPct = (bid.total / maxCumulative) * 100;
                return (
                  <div key={i} className="relative flex items-center justify-between py-1 px-2.5 hover:bg-[#161922]">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none"
                      style={{ width: `${depthPct}%` }}
                    />
                    <div className="flex items-center space-x-2 z-10">
                      <span className="text-[10px] text-[#555d6e] w-4">{bid.orders}</span>
                      <span className="font-bold text-emerald-400">${bid.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-right z-10">
                      <span className="text-white font-medium">{bid.size.toLocaleString()}</span>
                      <span className="text-[#656e7f] text-[10px] w-14">{bid.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Asks Ladder */}
            <div className="divide-y divide-[#181a22]">
              {orderBook.asks.map((ask, i) => {
                const depthPct = (ask.total / maxCumulative) * 100;
                return (
                  <div key={i} className="relative flex items-center justify-between py-1 px-2.5 hover:bg-[#161922]">
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-red-500/10 pointer-events-none"
                      style={{ width: `${depthPct}%` }}
                    />
                    <div className="flex items-center space-x-3 z-10">
                      <span className="font-bold text-red-400">${ask.price.toFixed(2)}</span>
                      <span className="text-white font-medium">{ask.size.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-right z-10">
                      <span className="text-[#656e7f] text-[10px] w-14">{ask.total.toLocaleString()}</span>
                      <span className="text-[10px] text-[#555d6e] w-4">{ask.orders}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-Time Time & Sales Tape */}
        <div className="flex flex-col border border-[#232733] bg-[#101217] rounded-xs overflow-hidden">
          <div className="py-1.5 px-3 bg-[#161820] border-b border-[#232733] text-[11px] font-semibold text-[#ff9900] uppercase flex justify-between items-center">
            <span>TIME & SALES TAPE</span>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE TICKS</span>
            </span>
          </div>

          <div className="grid grid-cols-4 px-3 py-1 bg-[#13151c] border-b border-[#1f222c] text-[10px] font-semibold text-[#767e90] uppercase">
            <span>TIME</span>
            <span>PRICE</span>
            <span className="text-right">SIZE</span>
            <span className="text-right">EXCH</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#181a22]">
            {timeAndSales.map((print) => {
              const isBuy = print.side === 'BUY';
              return (
                <div key={print.id} className="grid grid-cols-4 px-3 py-1 hover:bg-[#161922] text-xs">
                  <span className="text-[#848c9e] text-[11px]">{print.time}</span>
                  <span className={`font-bold ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${print.price.toFixed(2)}
                  </span>
                  <span className="text-right text-white font-medium">
                    {print.size.toLocaleString()}
                  </span>
                  <span className="text-right text-[#656e7f] text-[10px]">
                    {print.exchange}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
