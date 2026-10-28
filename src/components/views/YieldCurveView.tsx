import React from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { Activity, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const YieldCurveView: React.FC = () => {
  const { yieldCurve } = useTerminal();

  // Find key tenors for spreads
  const point3M = yieldCurve.find((p) => p.tenor === '3M');
  const point2Y = yieldCurve.find((p) => p.tenor === '2Y');
  const point10Y = yieldCurve.find((p) => p.tenor === '10Y');
  const point30Y = yieldCurve.find((p) => p.tenor === '30Y');

  const spread2s10sBps = (point10Y && point2Y) ? Math.round((point10Y.currentYield - point2Y.currentYield) * 100) : 47;
  const spread3m10sBps = (point10Y && point3M) ? Math.round((point10Y.currentYield - point3M.currentYield) * 100) : 69;

  // SVG dimensions for yield curve
  const svgWidth = 800;
  const svgHeight = 240;
  const minY = 3.5;
  const maxY = 5.6;
  const rangeY = maxY - minY;

  const getX = (index: number) => {
    return 40 + (index / (yieldCurve.length - 1)) * (svgWidth - 80);
  };

  const getY = (yieldVal: number) => {
    return svgHeight - 30 - ((yieldVal - minY) / rangeY) * (svgHeight - 60);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#ff9900]/50 shadow-[0_1px_8px_rgba(255,153,0,0.06)]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            YCRV: US SOVEREIGN TREASURY BENCHMARK CURVE
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | BENCHMARK PAR YIELDS
          </span>
        </div>
        <div className="text-[11px] text-[#788194]">
          Source: <span className="text-white font-semibold">US Federal Reserve / Treasury Desk</span>
        </div>
      </div>

      {/* Spreads Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[#0e1015] border-b border-[#ff9900]/30">
        <div className="bg-[#14161f] border border-[#ff9900]/40 hover:border-[#ff9900] p-2.5 rounded-xs transition-colors">
          <span className="text-[10px] text-[#ff9900]/80 uppercase block">US 10Y Benchmark Yield</span>
          <span className="text-lg font-bold text-[#ff9900]">
            {point10Y?.currentYield.toFixed(2)}%
          </span>
          <span className="text-[10px] text-emerald-400 block">+17 bps (1M change)</span>
        </div>

        <div className="bg-[#14161f] border border-[#ff9900]/40 hover:border-[#ff9900] p-2.5 rounded-xs transition-colors">
          <span className="text-[10px] text-[#ff9900]/80 uppercase block">2Y / 10Y Curve Spread</span>
          <span className={`text-lg font-bold ${spread2s10sBps >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {spread2s10sBps >= 0 ? `+${spread2s10sBps} bps` : `${spread2s10sBps} bps`}
          </span>
          <span className="text-[10px] text-[#636c7d] block">
            {spread2s10sBps >= 0 ? 'Normal Upward Slope' : 'Inverted (Recession Signal)'}
          </span>
        </div>

        <div className="bg-[#14161f] border border-[#ff9900]/40 hover:border-[#ff9900] p-2.5 rounded-xs transition-colors">
          <span className="text-[10px] text-[#ff9900]/80 uppercase block">3M / 10Y Curve Spread</span>
          <span className={`text-lg font-bold ${spread3m10sBps >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {spread3m10sBps >= 0 ? `+${spread3m10sBps} bps` : `${spread3m10sBps} bps`}
          </span>
          <span className="text-[10px] text-[#636c7d] block">Monetary Policy Spread</span>
        </div>

        <div className="bg-[#14161f] border border-[#ff9900]/40 hover:border-[#ff9900] p-2.5 rounded-xs transition-colors">
          <span className="text-[10px] text-[#ff9900]/80 uppercase block">30Y Long Bond Yield</span>
          <span className="text-lg font-bold text-white">
            {point30Y?.currentYield.toFixed(2)}%
          </span>
          <span className="text-[10px] text-[#636c7d] block">Term Premium Elevated</span>
        </div>
      </div>

      {/* Visual Yield Curve Chart */}
      <div className="p-3">
        <div className="border border-[#ff9900]/60 bg-[#101217] p-3 rounded-xs shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#ff9900] uppercase">
              Treasury Yield Curve Structure (Current vs 1 Month vs 1 Year Ago)
            </span>
            <div className="flex items-center space-x-4 text-[10px]">
              <span className="flex items-center space-x-1">
                <span className="h-2 w-4 bg-[#ff9900] inline-block"></span>
                <span className="text-white">Current</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-4 bg-sky-400 inline-block"></span>
                <span className="text-[#8e97aa]">1 Month Ago</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="h-2 w-4 bg-purple-400 inline-block"></span>
                <span className="text-[#8e97aa]">1 Year Ago</span>
              </span>
            </div>
          </div>

          <div className="h-56 w-full relative">
            <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              {/* Horizontal Grid lines */}
              {[4.0, 4.5, 5.0, 5.5].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line x1={40} y1={y} x2={svgWidth - 40} y2={y} stroke="#1f232d" strokeDasharray="3 3" />
                    <text x={35} y={y + 3} fill="#5d6575" fontSize="9" textAnchor="end">{val.toFixed(1)}%</text>
                  </g>
                );
              })}

              {/* 1 Year Ago Curve */}
              <path
                d={yieldCurve.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.oneYearAgo)}`, '')}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.7"
              />

              {/* 1 Month Ago Curve */}
              <path
                d={yieldCurve.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.oneMonthAgo)}`, '')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* Current Curve */}
              <path
                d={yieldCurve.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.currentYield)}`, '')}
                fill="none"
                stroke="#ff9900"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {yieldCurve.map((p, i) => {
                const x = getX(i);
                const y = getY(p.currentYield);
                return (
                  <g key={p.tenor}>
                    <circle cx={x} cy={y} r="3.5" fill="#ff9900" stroke="#000" strokeWidth="1" />
                    <text x={x} y={svgHeight - 10} fill="#8e97aa" fontSize="9" textAnchor="middle">{p.tenor}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Tenor Table */}
      <div className="flex-1 overflow-auto px-3 pb-3">
        <div className="border border-[#ff9900]/50 bg-[#101217] rounded-xs shadow-[0_0_10px_rgba(255,153,0,0.06)]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#181a22] border-b border-[#ff9900]/40 text-[#ff9900]/80 text-[10px] uppercase">
                <th className="py-2 px-3">Tenor</th>
                <th className="py-2 px-3 text-right">Current Yield</th>
                <th className="py-2 px-3 text-right">1 Month Ago</th>
                <th className="py-2 px-3 text-right">1 Year Ago</th>
                <th className="py-2 px-3 text-right">Net Change (1M)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1f28] text-xs">
              {yieldCurve.map((p) => {
                const isPos = p.changeBps >= 0;
                return (
                  <tr key={p.tenor} className="hover:bg-[#161922]">
                    <td className="py-1.5 px-3 font-bold text-white">{p.tenor} Treasury</td>
                    <td className="py-1.5 px-3 text-right font-bold text-[#ff9900]">{p.currentYield.toFixed(2)}%</td>
                    <td className="py-1.5 px-3 text-right text-[#949db0]">{p.oneMonthAgo.toFixed(2)}%</td>
                    <td className="py-1.5 px-3 text-right text-[#949db0]">{p.oneYearAgo.toFixed(2)}%</td>
                    <td className={`py-1.5 px-3 text-right font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPos ? `+${p.changeBps}` : p.changeBps} bps
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
