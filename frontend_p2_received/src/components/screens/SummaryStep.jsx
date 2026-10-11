import React, { useState } from 'react';
import { Copy, Check, CheckCircle2, ArrowLeft } from 'lucide-react';
import { FitMeter } from '../common/FitMeter';
import { CreditLine } from '../common/CreditLine';
import { StatusGlyph } from '../common/StatusGlyph';
import { CropMarks } from '../common/CropMarks';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatRupees } from '../../utils/formatters';

import { Home, Layers } from 'lucide-react';

export function SummaryStep({
  campaign,
  shortlistedCreators = [],
  onOpenColophon,
  onBack,
  onCompleteCampaign,
  onNavigateHome,
  onNavigateCampaigns,
}) {
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(campaign?.status === 'completed');

  const handleCopySummary = () => {
    const text = `COLOPHON CAMPAIGN RECORD\nCampaign: ${campaign.title}\nBrand: ${campaign.brandName}\nBudget: ${formatRupees(campaign.budget)}\nDeadline: ${campaign.deadline}\n\nSHORTLISTED CREATORS:\n${shortlistedCreators
      .map(
        (c) => `- ${c.name} (${c.fitLevel} Fit, ${c.turnaround}, Range: ${formatRupees(c.minPrice)}-${formatRupees(c.maxPrice)})`
      )
      .join('\n')}\n\nGenerated via Colophon Creator Marketplace.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    onCompleteCampaign?.(campaign.id);
    if (onNavigateCampaigns) {
      onNavigateCampaigns();
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 pb-32 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase text-ink-3">
            STEP 4 · FINAL RECORD
          </span>
          <h1 className="font-display text-4xl text-ink leading-tight mt-1">
            Campaign Dossier & Colophon Record
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
            title="Go to Homepage"
          >
            <Home size={14} />
            <span>Home</span>
          </button>

          <button
            onClick={onNavigateCampaigns}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
            title="Go to Campaigns directory"
          >
            <Layers size={14} />
            <span>Campaigns</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line-strong hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-verified" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-4 rounded-card bg-[#EEF8F1] border border-[#CDEED5] text-ink flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-verified/20 text-verified flex items-center justify-center font-bold text-sm">
              ✓
            </span>
            <div>
              <div className="font-semibold text-[14px]">Campaign Finalized & Recorded</div>
              <div className="text-[12px] text-ink-2">Status marked completed on immutable audit ledger.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-ctl bg-surface border border-line text-ink text-[12px] font-medium hover:border-ink transition-colors cursor-pointer"
            >
              Return Home
            </button>
            <button
              onClick={onNavigateCampaigns}
              className="px-3.5 py-1.5 rounded-ctl bg-ink text-surface text-[12px] font-medium hover:bg-ink-2 transition-colors cursor-pointer"
            >
              View All Campaigns
            </button>
          </div>
        </div>
      )}

      {/* Book-Back-Page Colophon Style Record Card */}
      <div className="relative bg-surface rounded-card border border-line p-8 md:p-12 space-y-8 shadow-sm">
        <CropMarks active={true} offset={10} length={16} />

        {/* Top Kicker */}
        <div className="flex items-center justify-between border-b border-line pb-4 font-mono text-[11px]">
          <span className="uppercase text-ink-3">
            RECORD IDENTIFIER · {campaign?.code || 'CAMPAIGN 014'}
          </span>
          <span className="text-ink font-semibold uppercase">
            STATUS: {isCompleted ? 'COMPLETED' : 'SHORTLIST READY'}
          </span>
        </div>

        {/* Section 1: Hard Fields & Scope */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-3">
            01 / SPECIFICATION & CONSTRAINTS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-ctl bg-sunken/40 border border-line font-mono text-[12px]">
            <div>
              <span className="text-ink-3 text-[10px] uppercase block">Brand</span>
              <span className="text-ink font-semibold">{campaign?.brandName || 'Velo-Stride'}</span>
            </div>
            <div>
              <span className="text-ink-3 text-[10px] uppercase block">Budget Cap</span>
              <span className="text-ink font-semibold tnum">{formatRupees(campaign?.budget || 10000)}</span>
            </div>
            <div>
              <span className="text-ink-3 text-[10px] uppercase block">Deadline</span>
              <span className="text-ink font-semibold">{campaign?.deadline || '2026-10-24'}</span>
            </div>
            <div>
              <span className="text-ink-3 text-[10px] uppercase block">Currency</span>
              <span className="text-ink font-semibold">{campaign?.currency || 'INR'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Final Brief Summary */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-2">
            02 / VERIFIED CREATIVE OBJECTIVE
          </span>
          <p className="font-ui text-[15px] leading-[24px] text-ink-2 bg-sunken/20 p-4 rounded-ctl border border-line">
            {campaign?.fullText}
          </p>
        </div>

        {/* Section 3: Shortlisted Creators with Top Work Credit Lines */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-3">
            03 / SHORTLISTED CREATORS & EVIDENCE
          </span>

          <div className="space-y-6">
            {shortlistedCreators.map((creator) => {
              const leadWork = creator.portfolio[0] || {};
              return (
                <div
                  key={creator.id}
                  className="p-5 rounded-ctl border border-line bg-surface space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-line bg-sunken">
                        <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-ui font-semibold text-ink text-[16px]">
                          {creator.name}
                        </div>
                        <div className="text-[12px] text-ink-2">
                          {creator.role} · {creator.location}
                        </div>
                      </div>
                    </div>

                    <FitMeter level={creator.fitLevel} />
                  </div>

                  {/* Proof Work & Museum Credit Line */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3 aspect-[4/3] rounded-ctl overflow-hidden bg-sunken border border-line">
                      <img
                        src={leadWork.imageUrl}
                        alt={leadWork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:col-span-9 space-y-2">
                      <CreditLine
                        work={leadWork}
                        creator={creator}
                        onOpenColophon={onOpenColophon}
                      />
                      <p className="text-[12px] text-ink-2">
                        {creator.criteria?.style?.evidence}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Provenance Footer */}
        <div className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px] text-ink-3">
          <span>GENERATED FROM CREATOR COLOPHON DECLARATIONS · ARCHIVE SAFE</span>
          <span>COLOPHON SPECIFICATION · TRUTH IN SYNTHESIS</span>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <CampaignActionBar
        backLabel="Back to shortlist"
        onBack={onBack}
        statusText={isCompleted ? 'Campaign completed on record' : 'Ready to mark complete'}
        forwardLabel={isCompleted ? 'Return to campaigns' : 'Finalize & view campaigns'}
        isForwardDisabled={false}
        secondaryAction={
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        }
        onForward={isCompleted ? onNavigateCampaigns : handleMarkComplete}
      />
    </div>
  );
}
