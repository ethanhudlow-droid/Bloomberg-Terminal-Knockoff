import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { Radio, AlertCircle, Clock, Tag, ExternalLink } from 'lucide-react';

export const TerminalNews: React.FC = () => {
  const { newsItems, selectSecurityByTicker } = useTerminal();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeNewsId, setActiveNewsId] = useState<string>(newsItems[0]?.id || '');

  const filteredNews = newsItems.filter(
    (n) => selectedCategory === 'ALL' || n.category === selectedCategory
  );

  const activeArticle = newsItems.find((n) => n.id === activeNewsId) || newsItems[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#232733]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            N: BLOOMBERG FIRST WORD & GLOBAL NEWSWIRE
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | REAL-TIME INSTITUTIONAL DISPATCHES
          </span>
        </div>
        <div className="flex items-center space-x-1.5 bg-[#171920] border border-[#2b2f3d] rounded-xs p-0.5 text-[10px]">
          {['ALL', 'MACRO', 'EQUITIES', 'FX_COMMODITIES'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                selectedCategory === cat ? 'bg-[#ff9900] text-black font-bold' : 'text-[#848c9e] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Headlines on Left / Story on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 p-3 overflow-hidden">
        {/* Headlines Feed */}
        <div className="flex flex-col border border-[#232733] bg-[#101217] rounded-xs overflow-hidden">
          <div className="py-2 px-3 bg-[#161820] border-b border-[#232733] text-[11px] font-semibold text-[#ff9900] uppercase flex items-center justify-between">
            <span>LIVE WIRE FEED</span>
            <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#181a22]">
            {filteredNews.map((item) => {
              const isSelected = item.id === activeArticle?.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveNewsId(item.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1b1e27] border-l-2 border-[#ff9900]' : 'hover:bg-[#14161e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px]">
                    <span className="text-[#687182]">{item.timestamp}</span>
                    <span
                      className={`px-1 py-0.2 rounded-xs font-bold ${
                        item.urgency === 'FLASH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : item.urgency === 'BULLETIN'
                          ? 'bg-amber-500/20 text-[#ff9900] border border-amber-500/40'
                          : 'bg-[#20232c] text-[#8e97aa]'
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-xs leading-snug line-clamp-2 mb-1.5">
                    {item.headline}
                  </h3>

                  <div className="flex items-center space-x-1.5">
                    {item.relatedTickers.map((t) => (
                      <span
                        key={t}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSecurityByTicker(t);
                        }}
                        className="text-[10px] text-[#ff9900] bg-[#181b22] px-1 py-0.2 rounded-xs border border-[#272b36] hover:bg-[#ff9900] hover:text-black"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Reader */}
        <div className="lg:col-span-2 flex flex-col border border-[#232733] bg-[#101217] rounded-xs p-4 overflow-y-auto">
          {activeArticle && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[11px] text-[#788194]">
                <span className="px-1.5 py-0.5 bg-[#ff9900] text-black font-bold rounded-xs">
                  {activeArticle.source}
                </span>
                <span>{activeArticle.timestamp}</span>
                <span>&bull;</span>
                <span>{activeArticle.readTime} read</span>
              </div>

              <h1 className="text-base font-bold text-white leading-snug">
                {activeArticle.headline}
              </h1>

              <div className="flex items-center space-x-2 pt-1 pb-3 border-b border-[#21242d]">
                <span className="text-[11px] text-[#636c7d]">Affected Securities:</span>
                {activeArticle.relatedTickers.map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => selectSecurityByTicker(ticker)}
                    className="px-2 py-0.5 bg-[#181b24] hover:bg-[#ff9900] hover:text-black text-[#ff9900] border border-[#2c3240] rounded-xs font-bold text-xs cursor-pointer"
                  >
                    {ticker} &lt;GO&gt;
                  </button>
                ))}
              </div>

              <div className="text-[#c8cfdc] text-sm leading-relaxed font-sans font-normal space-y-3">
                <p>{activeArticle.body}</p>
                <p className="text-[#848c9e] text-xs">
                  Market desks report heightened bid-ask volume in response to these headlines. Desk strategists advise monitoring volatility indices and cross-currency spreads.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
