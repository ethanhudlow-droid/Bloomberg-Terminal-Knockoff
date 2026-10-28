import React, { useState } from 'react';
import { useTerminal } from '../../context/TerminalContext';
import { SEC_FILINGS_DATABASE } from '../../data/marketUniverse';
import { FileCheck, AlertTriangle, ExternalLink, Calendar, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SecFilings: React.FC = () => {
  const { activeSecurity } = useTerminal();
  const filings = SEC_FILINGS_DATABASE[activeSecurity.ticker] || [
    {
      id: `${activeSecurity.ticker}-10K-2025`,
      formType: '10-K',
      period: 'FY 2025 (Annual)',
      filingDate: '2025-02-28',
      title: 'Annual Report Pursuant to Section 13 or 15(d) of the Securities Exchange Act of 1934',
      summary: `Annual financial filing for ${activeSecurity.name} detailing audited financial results, capital expenditures, risk disclosures, and operational performance.`,
      highlights: [
        'Revenue expanded across primary operating segments.',
        'Net cash provided by operating activities supported capital return programs.',
        'Management identified key supply chain dependencies and competitive dynamics.'
      ],
      keyRiskItem: 'Item 1A Risk Factors: Global regulatory compliance, supply chain continuity, interest rate volatility, and cyber security safeguards.'
    }
  ];

  const [selectedFilingId, setSelectedFilingId] = useState<string>(filings[0]?.id || '');
  const activeFiling = filings.find((f) => f.id === selectedFilingId) || filings[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d10] font-mono-bbg overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121419] border-b border-[#ff9900]/50 shadow-[0_1px_8px_rgba(255,153,0,0.06)]">
        <div className="flex items-center space-x-3">
          <span className="text-[#ff9900] font-bold text-sm">
            SEC: {activeSecurity.ticker} US EQUITY
          </span>
          <span className="text-[#8e97aa] text-xs hidden sm:inline">
            | EDGAR CORPORATE FILINGS & ITEM 1A DISCLOSURES
          </span>
        </div>
        <div className="text-[11px] text-[#788194]">
          Entity CIK: <span className="text-white font-semibold">0001045810</span>
        </div>
      </div>

      {/* Main Split: Filings List on Left / Filing Inspector on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2.5 p-3 overflow-hidden">
        {/* Filings List */}
        <div className="flex flex-col border border-[#ff9900]/60 bg-[#101217] rounded-xs overflow-hidden shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div className="py-2 px-3 bg-[#161820] border-b border-[#ff9900]/30 text-[11px] font-semibold text-[#ff9900] uppercase">
            FILING DIRECTORY
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#ff9900]/15">
            {filings.map((filing) => {
              const isSelected = activeFiling.id === filing.id;
              return (
                <div
                  key={filing.id}
                  onClick={() => setSelectedFilingId(filing.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1a1d26] border-l-2 border-[#ff9900]' : 'hover:bg-[#14161e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white px-1.5 py-0.5 bg-[#20242f] rounded-xs text-[10px] text-[#ff9900]">
                      {filing.formType}
                    </span>
                    <span className="text-[#646c7d] text-[10px]">{filing.filingDate}</span>
                  </div>
                  <div className="font-semibold text-white text-xs mb-1 line-clamp-1">
                    {filing.period}
                  </div>
                  <p className="text-[#848c9e] text-[11px] line-clamp-2">
                    {filing.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filing Inspector */}
        <div className="lg:col-span-2 flex flex-col border border-[#ff9900]/60 bg-[#101217] rounded-xs overflow-y-auto p-4 space-y-4 shadow-[0_0_12px_rgba(255,153,0,0.06)]">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-[#ff9900] text-black font-bold text-xs rounded-xs">
                {activeFiling.formType}
              </span>
              <span className="text-[#a4abb9] text-xs font-semibold">
                Filing Date: {activeFiling.filingDate} &bull; {activeFiling.period}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              {activeFiling.title}
            </h2>
          </div>

          {/* Executive Summary */}
          <div className="bg-[#14161f] border border-[#ff9900]/40 p-3 rounded-xs">
            <span className="text-[10px] text-[#ff9900] font-bold uppercase block mb-1">
              Executive Summary & MD&A Overview
            </span>
            <p className="text-[#c8cfdc] text-xs leading-relaxed font-sans font-normal">
              {activeFiling.summary}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-[#14161f] border border-[#ff9900]/40 p-3 rounded-xs">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-2 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Key Filing Operational Highlights</span>
            </span>
            <ul className="space-y-1.5 text-xs text-[#a4abb9]">
              {activeFiling.highlights.map((h, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-[#ff9900] font-bold">&bull;</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors Scrutiny */}
          <div className="bg-[#1d1414] border border-red-900/40 p-3 rounded-xs">
            <span className="text-[10px] text-red-400 font-bold uppercase block mb-1 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Item 1A Regulatory & Downside Risk Scrutiny</span>
            </span>
            <p className="text-[#e2b8b8] text-xs leading-relaxed font-sans font-normal">
              {activeFiling.keyRiskItem}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
