import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { Cpu, Send, RefreshCw, CheckCircle, FileText, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const QuantAnalyst: React.FC = () => {
  const { activeSecurity, getHistoricalFinancials } = useTerminal();
  const financials = getHistoricalFinancials(activeSecurity.ticker);
  const latestFin = financials[0] || {};

  const [promptType, setPromptType] = useState<string>('Comprehensive Institutional Research Memo');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sourceTag, setSourceTag] = useState<string>('');

  const runQuantAnalysis = async (typeOverride?: string) => {
    setIsLoading(true);
    const chosenType = typeOverride || promptType;
    try {
      const res = await fetch('/api/quant/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: activeSecurity.ticker,
          name: activeSecurity.name,
          currentPrice: activeSecurity.price,
          pe: activeSecurity.peTrailing || 30.5,
          evEbitda: activeSecurity.evEbitda || 22.0,
          marketCap: activeSecurity.marketCap,
          grossMargin: latestFin.grossMarginPct || 55.0,
          revenueGrowth: 18.5,
          promptType: chosenType,
          customQuestion: customQuestion.trim() || undefined
        })
      });

      const data = await res.json();
      setAnalysisText(data.analysis || 'Analysis output generated.');
      setSourceTag(data.source || 'gemini-3.8-flash');
    } catch (e: any) {
      setAnalysisText(`Error contacting quantitative server: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#ff9900]/50 shadow-[0_1px_8px_rgba(255,153,0,0.06)]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            B-QUANT: {activeSecurity.ticker} US EQUITY
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | INSTITUTIONAL RESEARCH DESK & VALUATION SYNTHESIS
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 rounded-xs flex items-center space-x-1">
            <Zap className="w-3 h-3 text-[#ff9900]" />
            <span>GEMINI 3.8 FLASH ENGINE</span>
          </span>
        </div>
      </div>

      {/* Main Split: Strategy Presets & Custom Query Left / Quant Report Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2.5 p-3 overflow-hidden">
        {/* Left Control Panel */}
        <div className="flex flex-col border border-[#ff9900]/60 bg-[#101217] rounded-xs p-3 space-y-3 overflow-y-auto shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div>
            <span className="text-[10px] text-[#ff9900] font-bold uppercase block mb-1.5">
              Select Institutional Audit Profile
            </span>
            <div className="space-y-1.5">
              {[
                'Comprehensive Institutional Research Memo',
                'Discounted Cash Flow (DCF) & WACC Sensitivity',
                'Gross Margin Sustainability & Pricing Power Stress-Test',
                'Form 10-K Forensic Scrutiny & Item 1A Risk Audit',
                'Scenario Valuation & Probability Matrix (Bull / Base / Bear)'
              ].map((pt) => (
                <button
                  key={pt}
                  onClick={() => {
                    setPromptType(pt);
                    runQuantAnalysis(pt);
                  }}
                  className={`w-full text-left p-2 rounded-xs border text-xs cursor-pointer transition-colors ${
                    promptType === pt
                      ? 'border-[#ff9900] bg-[#1a1d26] text-white font-semibold'
                      : 'border-[#ff9900]/30 bg-[#121419] text-[#8e97aa] hover:border-[#ff9900] hover:text-white'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Quant Query */}
          <div>
            <span className="text-[10px] text-[#ff9900] font-bold uppercase block mb-1">
              Custom Quant Question or Thesis
            </span>
            <textarea
              rows={3}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. Stress test FY26 margins if datacenter capex decelerates 15%..."
              className="w-full bg-[#08090b] border border-[#ff9900]/50 focus:border-[#ff9900] text-white p-2 text-xs rounded-xs focus:outline-none placeholder-[#4d5464]"
            />
            <button
              onClick={() => runQuantAnalysis()}
              disabled={isLoading}
              className="w-full mt-2 py-1.5 bg-[#ff9900] hover:bg-[#ffb033] text-black font-bold text-xs rounded-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50 tracking-wider"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>SYNTHESIZING QUANT AUDIT...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5" />
                  <span>EXECUTE QUANT MEMO &lt;GO&gt;</span>
                </>
              )}
            </button>
          </div>

          {/* Security Snapshot Card */}
          <div className="bg-[#14161f] border border-[#ff9900]/40 p-2.5 rounded-xs space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#ff9900]/80">Security:</span>
              <span className="text-white font-bold">{activeSecurity.ticker}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#ff9900]/80">Price:</span>
              <span className="text-[#ff9900] font-bold">${activeSecurity.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#ff9900]/80">Mkt Cap:</span>
              <span className="text-white">{activeSecurity.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#ff9900]/80">Trailing P/E:</span>
              <span className="text-white">{activeSecurity.peTrailing || 'N/A'}x</span>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-2 flex flex-col border border-[#ff9900]/60 bg-[#101217] rounded-xs overflow-hidden shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="py-2 px-3 bg-[#161820] border-b border-[#ff9900]/30 text-[11px] font-semibold text-[#ff9900] uppercase flex items-center justify-between">
            <span>INSTITUTIONAL QUANTITATIVE RESEARCH REPORT</span>
            {sourceTag && (
              <span className="text-[10px] text-emerald-400 font-normal">
                Engine: {sourceTag}
              </span>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-[#7f889a]">
                <RefreshCw className="w-6 h-6 animate-spin text-[#ff9900]" />
                <span className="text-sm">Synthesizing Bloomberg-level valuation and risk memo...</span>
              </div>
            ) : analysisText ? (
              <pre className="text-xs text-[#dbe0ec] whitespace-pre-wrap leading-relaxed font-mono-bbg selection:bg-[#ff9900] selection:text-black">
                {analysisText}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-2 text-[#687082] text-center p-6">
                <Cpu className="w-8 h-8 text-[#ff9900]/60 mb-2" />
                <p className="text-sm text-white font-semibold">Institutional Quantitative Audit Ready</p>
                <p className="text-xs max-w-md">
                  Select a research profile on the left or press "Execute Quant Memo &lt;GO&gt;" to generate a comprehensive institutional valuation memo, DCF scenario analysis, and 10-K forensic audit.
                </p>
                <button
                  onClick={() => runQuantAnalysis()}
                  className="mt-3 px-3 py-1.5 bg-[#ff9900] text-black font-bold text-xs rounded-xs cursor-pointer"
                >
                  RUN DEFAULT RESEARCH MEMO &lt;GO&gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
