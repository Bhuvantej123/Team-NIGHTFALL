import React from 'react';
import { Layers, Check, Download } from 'lucide-react';
import { ColophonLockup } from './common/BrandLogo';
import { CAMPAIGN_PRESETS } from '../data/demoData';

interface HeaderProps {
  selectedCampaignId: string;
  onSelectCampaign: (id: string) => void;
  shortlistedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCampaignId,
  onSelectCampaign,
  shortlistedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 w-full px-6 flex items-center justify-between select-none bg-paper border-b border-line text-ink">
      {/* Left: Brand Lockup & Subheading */}
      <div className="flex items-center gap-6">
        <ColophonLockup />
        <div className="hidden md:flex items-center gap-2 border-l border-line pl-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
            WORKSPACE /
          </span>
          <span className="text-[13px] font-semibold text-ink">
            Creator Intelligence Benchmark
          </span>
          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-ctl bg-sunken border border-line text-ink-2">
            PROTOTYPE PREVIEW
          </span>
        </div>
      </div>

      {/* Right: Campaign Selector, Shortlist Counter, and Export */}
      <div className="flex items-center gap-3">
        {/* Campaign Switcher Dropdown */}
        <div className="flex items-center gap-1.5 bg-surface border border-line rounded-ctl px-3 py-1.5 text-[13px] text-ink shadow-2xs">
          <Layers size={14} className="text-ink-3" />
          <span className="font-mono text-[11px] uppercase text-ink-3">Brief:</span>
          <select
            aria-label="Active Campaign Brief"
            value={selectedCampaignId}
            onChange={(e) => onSelectCampaign(e.target.value)}
            className="bg-transparent border-none text-[13px] text-ink font-medium focus:ring-0 cursor-pointer pr-2 outline-none"
          >
            {CAMPAIGN_PRESETS.map((camp) => (
              <option key={camp.id} value={camp.id} className="bg-surface text-ink">
                {camp.title}
              </option>
            ))}
          </select>
        </div>

        {/* Shortlist Counter Pill */}
        <div className="flex items-center gap-1.5 bg-verified-wash text-verified border border-verified/30 px-3 py-1.5 rounded-ctl font-mono text-[12px] font-semibold">
          <Check size={14} strokeWidth={2.5} />
          <span>Shortlist: {shortlistedCount}/3</span>
        </div>

        {/* Export Button */}
        <button
          onClick={() => alert('Exporting Creator Intelligence Benchmark Dossier (PDF)...')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-ctl bg-surface hover:bg-sunken border border-line text-ink text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
        >
          <Download size={14} className="text-ink-3" />
          <span>Export Dossier</span>
        </button>
      </div>
    </header>
  );
};
