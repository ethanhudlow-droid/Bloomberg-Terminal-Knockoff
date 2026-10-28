import React, { useState, useMemo } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { Candle } from '../../types/terminal';
import {
  TrendingUp,
  Maximize2,
  Sliders,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const TechnicalChart: React.FC = () => {
  const { activeSecurity, candles } = useTerminal();
  const [selectedRange, setSelectedRange] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Calculate Highs / Lows for Y-axis scaling
  const { minPrice, maxPrice, priceRange, maxVol } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 100, maxPrice: 200, priceRange: 100, maxVol: 100000 };
    }
    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    const vols = candles.map((c) => c.volume);
    const minP = Math.min(...lows);
    const maxP = Math.max(...highs);
    const padding = (maxP - minP) * 0.08 || 1;
    return {
      minPrice: minP - padding,
      maxPrice: maxP + padding,
      priceRange: (maxP + padding) - (minP - padding),
      maxVol: Math.max(...vols, 1)
    };
  }, [candles]);

  // Compute Simple Moving Averages
  const sma20 = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 19) return null;
      const slice = arr.slice(idx - 19, idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / 20;
      return avg;
    });
  }, [candles]);

  const sma50 = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 49) return null;
      const slice = arr.slice(idx - 49, idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / 50;
      return avg;
    });
  }, [candles]);

  // Compute RSI (14-period)
  const rsi = useMemo(() => {
    const period = 14;
    return candles.map((_, idx, arr) => {
      if (idx < period) return 50;
      let gains = 0;
      let losses = 0;
      for (let i = idx - period + 1; i <= idx; i++) {
        const change = arr[i].close - arr[i - 1].close;
        if (change > 0) gains += change;
        else losses += Math.abs(change);
      }
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) return 100;
      const rs = avgGain / avgLoss;
      return 100 - (100 / (1 + rs));
    });
  }, [candles]);

  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  // SVG dimensions
  const svgWidth = 900;
  const svgHeight = 360;
  const chartHeight = 260; // Top section for candles
  const volHeight = 80;    // Lower section for volume
  const rsiHeight = 80;

  const candleCount = candles.length;
  const candleStep = svgWidth / (candleCount || 1);
  const candleBodyWidth = Math.max(2, Math.min(14, candleStep * 0.7));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Chart Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#ff9900]/50 gap-2 shadow-[0_1px_8px_rgba(255,153,0,0.06)]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            GP: {activeSecurity.ticker} US EQUITY
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | INTRADAY CANDLESTICK ENGINE
          </span>

          {/* Timeframe Selectors */}
          <div className="flex items-center bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
            {(['1D', '5D', '1M', '6M', '1Y'] as const).map((rng) => (
              <button
                key={rng}
                onClick={() => setSelectedRange(rng)}
                className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                  selectedRange === rng ? 'bg-[#ff9900] text-black font-bold' : 'text-[#848c9e] hover:text-white'
                }`}
              >
                {rng}
              </button>
            ))}
          </div>

          {/* Style: Candle vs Line */}
          <div className="flex items-center bg-[#171920] border border-[#ff9900]/40 rounded-xs p-0.5 text-[10px]">
            <button
              onClick={() => setChartType('CANDLE')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                chartType === 'CANDLE' ? 'bg-[#2b303c] text-[#ff9900] font-bold' : 'text-[#848c9e] hover:text-white'
              }`}
            >
              CANDLES
            </button>
            <button
              onClick={() => setChartType('LINE')}
              className={`px-2 py-0.5 rounded-xs cursor-pointer ${
                chartType === 'LINE' ? 'bg-[#2b303c] text-[#ff9900] font-bold' : 'text-[#848c9e] hover:text-white'
              }`}
            >
              MOUNTAIN
            </button>
          </div>
        </div>

        {/* Indicators Overlay Toggles */}
        <div className="flex items-center space-x-2 text-[10px]">
          <button
            onClick={() => setShowSMA20(!showSMA20)}
            className={`px-2 py-0.5 border rounded-xs cursor-pointer ${
              showSMA20 ? 'border-amber-500/80 bg-amber-950/30 text-[#ff9900] font-bold' : 'border-[#ff9900]/30 text-[#8e97aa]'
            }`}
          >
            SMA 20
          </button>
          <button
            onClick={() => setShowSMA50(!showSMA50)}
            className={`px-2 py-0.5 border rounded-xs cursor-pointer ${
              showSMA50 ? 'border-cyan-500/80 bg-cyan-950/30 text-cyan-400 font-bold' : 'border-[#ff9900]/30 text-[#8e97aa]'
            }`}
          >
            SMA 50
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-0.5 border rounded-xs cursor-pointer ${
              showRSI ? 'border-purple-500/80 bg-purple-950/30 text-purple-400 font-bold' : 'border-[#ff9900]/30 text-[#8e97aa]'
            }`}
          >
            RSI (14)
          </button>
        </div>
      </div>

      {/* OHLCV Crosshair Data Header */}
      {activeCandle && (
        <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#0e1014] border-b border-[#ff9900]/30 text-xs gap-2">
          <div className="flex items-center space-x-4">
            <span className="text-[#a0a8b7]">Time: <strong className="text-white">{activeCandle.time}</strong></span>
            <span className="text-[#a0a8b7]">O: <strong className="text-white">${activeCandle.open.toFixed(2)}</strong></span>
            <span className="text-[#a0a8b7]">H: <strong className="text-emerald-400">${activeCandle.high.toFixed(2)}</strong></span>
            <span className="text-[#a0a8b7]">L: <strong className="text-red-400">${activeCandle.low.toFixed(2)}</strong></span>
            <span className="text-[#a0a8b7]">C: <strong className="text-white">${activeCandle.close.toFixed(2)}</strong></span>
            <span className="text-[#a0a8b7]">Vol: <strong className="text-[#ff9900]">{(activeCandle.volume / 1000).toFixed(0)}K</strong></span>
          </div>
          <div className="text-[11px] text-[#656d7e]">
            High/Low Corridor: <span className="text-white">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="flex-1 relative p-3 overflow-hidden flex flex-col">
        <div className="flex-1 border border-[#ff9900]/60 bg-[#0c0d10] relative rounded-xs overflow-hidden flex flex-col shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          {/* Main Candlestick SVG Chart */}
          <div className="flex-1 relative">
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${svgWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredCandle(null)}
            >
              {/* Subtle Gridlines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
                const y = chartHeight * ratio;
                const price = maxPrice - priceRange * ratio;
                return (
                  <g key={i}>
                    <line x1={0} y1={y} x2={svgWidth} y2={y} stroke="#1b1d24" strokeDasharray="3 3" />
                    <text x={svgWidth - 65} y={y - 4} fill="#586172" fontSize="9" textAnchor="end">
                      ${price.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Candles / Mountain Line */}
              {chartType === 'CANDLE' ? (
                candles.map((c, i) => {
                  const x = i * candleStep + candleStep / 2;
                  const isUp = c.close >= c.open;
                  const color = isUp ? '#00e676' : '#ff3b30';

                  const yHigh = chartHeight - ((c.high - minPrice) / priceRange) * chartHeight;
                  const yLow = chartHeight - ((c.low - minPrice) / priceRange) * chartHeight;
                  const yOpen = chartHeight - ((c.open - minPrice) / priceRange) * chartHeight;
                  const yClose = chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;

                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                  return (
                    <g
                      key={c.timestamp || i}
                      onMouseEnter={() => setHoveredCandle(c)}
                      className="cursor-crosshair"
                    >
                      {/* High-Low Wick */}
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" />
                      {/* Candle Body */}
                      <rect
                        x={x - candleBodyWidth / 2}
                        y={bodyTop}
                        width={candleBodyWidth}
                        height={bodyHeight}
                        fill={color}
                        stroke={color}
                      />
                    </g>
                  );
                })
              ) : (
                // Mountain Path
                <path
                  d={candles.reduce((acc, c, i) => {
                    const x = i * candleStep + candleStep / 2;
                    const y = chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;
                    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#ff9900"
                  strokeWidth="2"
                />
              )}

              {/* SMA 20 Overlay Line */}
              {showSMA20 && (
                <path
                  d={candles.reduce((acc, _, i) => {
                    const avg = sma20[i];
                    if (avg == null) return acc;
                    const x = i * candleStep + candleStep / 2;
                    const y = chartHeight - ((avg - minPrice) / priceRange) * chartHeight;
                    return `${acc} ${acc === '' ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#ff9900"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              )}

              {/* SMA 50 Overlay Line */}
              {showSMA50 && (
                <path
                  d={candles.reduce((acc, _, i) => {
                    const avg = sma50[i];
                    if (avg == null) return acc;
                    const x = i * candleStep + candleStep / 2;
                    const y = chartHeight - ((avg - minPrice) / priceRange) * chartHeight;
                    return `${acc} ${acc === '' ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              )}
            </svg>
          </div>

          {/* Volume Section */}
          <div className="h-16 border-t border-[#1e212b] bg-[#090a0d] relative">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${volHeight}`} preserveAspectRatio="none">
              {candles.map((c, i) => {
                const x = i * candleStep + candleStep / 2;
                const isUp = c.close >= c.open;
                const vHeight = (c.volume / maxVol) * (volHeight - 10);
                const y = volHeight - vHeight;
                return (
                  <rect
                    key={i}
                    x={x - candleBodyWidth / 2}
                    y={y}
                    width={candleBodyWidth}
                    height={vHeight}
                    fill={isUp ? 'rgba(0, 230, 118, 0.45)' : 'rgba(255, 59, 48, 0.45)'}
                  />
                );
              })}
            </svg>
            <span className="absolute left-2 top-1 text-[9px] text-[#5c6475] uppercase">
              Trading Volume
            </span>
          </div>

          {/* RSI Section (if toggled) */}
          {showRSI && (
            <div className="h-14 border-t border-[#1e212b] bg-[#08090b] relative">
              <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${rsiHeight}`} preserveAspectRatio="none">
                {/* 70 overbought and 30 oversold bands */}
                <line x1={0} y1={rsiHeight * 0.3} x2={svgWidth} y2={rsiHeight * 0.3} stroke="#ff3b30" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                <line x1={0} y1={rsiHeight * 0.7} x2={svgWidth} y2={rsiHeight * 0.7} stroke="#00e676" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                <path
                  d={candles.reduce((acc, _, i) => {
                    const r = rsi[i];
                    const x = i * candleStep + candleStep / 2;
                    const y = rsiHeight - (r / 100) * rsiHeight;
                    return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.2"
                />
              </svg>
              <div className="absolute left-2 top-1 flex items-center space-x-2 text-[9px]">
                <span className="text-purple-400 font-bold">RSI (14):</span>
                <span className="text-white">{rsi[rsi.length - 1]?.toFixed(1) || '50.0'}</span>
                <span className="text-[#555d6e]">(70 Overbought / 30 Oversold)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
