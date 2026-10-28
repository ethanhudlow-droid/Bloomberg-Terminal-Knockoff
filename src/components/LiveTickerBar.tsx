import React, { useState } from 'react';
import { useTerminal } from '../context/TerminalContext';
import { Plus, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

export const LiveTickerBar: React.FC = () => {
  const {
    securities,
    activeSecurity,
    selectSecurityByTicker,
    userTickerList,
    addToUserTickerList,
    tickFlashes,
    setCurrentView
  } = useTerminal();

  const [isAdding, setIsAdding] = useState(false);
  const [newTickerInput, setNewTickerInput] = useState('');

  // Filter securities to user's specified list
  const tickerItems = securities.filter((sec) => userTickerList.includes(sec.ticker));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTickerInput.trim()) {
      addToUserTickerList(newTickerInput.trim().toUpperCase());
      setNewTickerInput('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#0a0b0d] border-b border-[#ff9900]/50 py-1 px-2 flex items-center justify-between text-xs font-mono-bbg overflow-x-auto no-scrollbar shadow-[0_1px_8px_rgba(255,153,0,0.08)]">
      <div className="flex items-center space-x-2 shrink-0">
        <span className="text-[10px] text-[#ff9900] font-bold tracking-wider px-1.5 py-0.5 bg-[#171920] border border-[#ff9900]/70 rounded-xs uppercase">
          TICKER TAPE
        </span>
        <button
          onClick={() => setCurrentView('WATCH')}
          title="Open Full Ticker Monitor [F5]"
          className="text-[#6c7485] hover:text-[#ff9900] cursor-pointer p-0.5 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Scrolling / Dense Items List */}
      <div className="flex items-center space-x-2 px-3 overflow-x-auto no-scrollbar">
        {tickerItems.map((sec) => {
          const isSelected = activeSecurity.ticker === sec.ticker;
          const isPositive = sec.change >= 0;
          const flash = tickFlashes[sec.ticker];

          return (
            <div
              key={sec.ticker}
              onClick={() => selectSecurityByTicker(sec.ticker)}
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-xs cursor-pointer border transition-colors whitespace-nowrap ${
                isSelected
                  ? 'border-[#ff9900] bg-[#1a1c24] shadow-[0_0_6px_rgba(255,153,0,0.2)]'
                  : 'border-[#ff9900]/30 hover:border-[#ff9900] bg-[#121419]/90 hover:bg-[#181a22]'
              }`}
            >
              <span className={`font-bold ${isSelected ? 'text-[#ff9900]' : 'text-white'}`}>
                {sec.ticker}
              </span>
              <span className="text-[#e2e5ed] font-semibold">
                ${sec.price >= 1000 ? sec.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : sec.price.toFixed(2)}
              </span>

              {/* Little arrow that blips green on increase or red on decrease for 0.25 seconds */}
              <span className="inline-flex items-center justify-center w-2.5 h-2.5 shrink-0" title={flash ? `Micro-tick: ${flash}` : undefined}>
                {flash === 'UP' ? (
                  <span className="text-[#00e676] font-black text-[10px] leading-none select-none">
                    ▲
                  </span>
                ) : flash === 'DOWN' ? (
                  <span className="text-[#ff3b30] font-black text-[10px] leading-none select-none">
                    ▼
                  </span>
                ) : null}
              </span>

              <span
                className={`flex items-center text-[11px] font-medium ${
                  isPositive ? 'text-[#00e676]' : 'text-[#ff3b30]'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? '+' : ''}
                {sec.changePercent.toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#5e6677] hidden xl:inline">
                Vol: {(sec.volume / 1000000).toFixed(1)}M
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Add Ticker Input */}
      <div className="flex items-center shrink-0 pl-2 border-l border-[#ff9900]/50">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="flex items-center space-x-1">
            <input
              type="text"
              autoFocus
              value={newTickerInput}
              onChange={(e) => setNewTickerInput(e.target.value)}
              placeholder="e.g. AMD, PLTR"
              className="bg-[#121419] text-white border border-[#ff9900] px-1.5 py-0.5 text-[11px] rounded-xs font-mono-bbg uppercase w-24 focus:outline-none"
            />
            <button
              type="submit"
              className="px-1.5 py-0.5 bg-[#ff9900] text-black text-[10px] font-bold rounded-xs cursor-pointer"
            >
              ADD
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-1 text-[#727a8a] hover:text-white text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-1 px-2 py-0.5 text-[11px] text-[#8e96a8] hover:text-[#ff9900] hover:border-[#ff9900]/40 border border-transparent rounded-xs cursor-pointer"
            title="Add ticker to live tape"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">ADD TICKER</span>
          </button>
        )}
      </div>
    </div>
  );
};
