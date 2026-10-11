import React, { useState } from 'react';
import {
  List,
  Columns,
  Mail,
  Trash2,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { RangeFitBar } from '../common/RangeFitBar';
import { FitLevelBadge } from './DiscoverScreen';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatRupees, formatCurrency } from '../../utils/formatters';

/**
 * ShortlistStep
 * Step 3: Shortlisted Candidates Roster
 * Exact restoration of P2 design:
 * - Candidate Roster header with creator count and List View vs Comparison Matrix toggle
 * - List View: Compact horizontal rows with creator identity, fit score, FitLevelBadge,
 *   turnaround SLA, commercial clearance badge, RangeFitBar budget comparison,
 *   and quick actions (Outreach Email, Fit sheet, Remove)
 * - Comparison Matrix: Side-by-side table comparing profile, match fit, price, and SLA
 * - Outreach Email Modal: 1-click auto-populated campaign commission inquiry with copy & mailto
 * - Docked CampaignActionBar workflow navigation
 *
 * @param {{
 *   campaign: any;
 *   shortlistedCreators: Array<any>;
 *   isLoading?: boolean;
 *   onRemoveFromShortlist: (creatorId: string) => Promise<any>;
 *   onOpenFitSheet?: (creator: any) => void;
 *   onBack: () => void;
 *   onProceedToSummary: () => void;
 * }} props
 */
export function ShortlistStep({
  campaign,
  shortlistedCreators = [],
  isLoading = false,
  onRemoveFromShortlist,
  onOpenFitSheet = (_creator) => {},
  onBack,
  onProceedToSummary,
}) {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'matrix'
  const [outreachCreator, setOutreachCreator] = useState(null);
  const [hasCopiedEmail, setHasCopiedEmail] = useState(false);

  const currency = campaign?.currency || 'USD';
  const campaignBudget = campaign?.budgetMax || campaign?.budget || 25000;

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-24 text-center space-y-3">
        <Loader2 size={28} className="animate-spin text-ink mx-auto" />
        <p className="font-mono text-[13px] text-ink">Loading campaign shortlist...</p>
      </div>
    );
  }

  if (shortlistedCreators.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 pb-32 text-center space-y-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          STEP 3 · SHORTLIST
        </span>
        <h2 className="font-display text-3xl text-ink">No creators shortlisted yet.</h2>
        <p className="text-[14px] text-ink-2 max-w-md mx-auto">
          Return to the Matches step to select and shortlist creators for this campaign.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-ctl bg-ink text-white text-[13px] font-medium hover:bg-[#25231F] transition-colors cursor-pointer border border-ink"
        >
          <ArrowLeft size={14} />
          <span>Browse matched creators</span>
        </button>
        <CampaignActionBar
          backLabel="Back to matches"
          onBack={onBack}
          forwardLabel="Review summary"
          isForwardDisabled={true}
          onForward={onProceedToSummary}
        />
      </div>
    );
  }

  const getOutreachSubject = (creator) => {
    return `Commission Inquiry: ${campaign?.title || 'Creative Commission'} [Colophon Verified]`;
  };

  const getOutreachBody = (creator) => {
    return `Hi ${creator.name},

I came across your work on Colophon and was impressed by your ${creator.family || 'creative'} portfolio. We are currently casting for an upcoming commercial project:

Project: ${campaign?.title || 'Creative Campaign'}
Client: ${campaign?.brandName || 'Brand Commission'}
Deliverables: ${campaign?.deliverablesText || '3 Stills (4:5) + 2 Reels (9:16)'}
Budget Cap: ${formatCurrency(campaignBudget, currency)}
Target Deadline: ${campaign?.deadline || '2026-11-20'}

Scope & Directives:
${campaign?.description || campaign?.fullText || 'High-fidelity commercial stills and motion reels with perpetual digital rights clearance.'}

We are prepared to issue escrow through Colophon's smart contract terms with verified toolchain logs.

Please let us know if your schedule allows for this turnaround time (${creator.turnaround || '14 days'}).

Best regards,
Commission Director
Via Colophon Protocol`;
  };

  const handleCopyEmail = (creator) => {
    const fullText = `Subject: ${getOutreachSubject(creator)}\n\n${getOutreachBody(creator)}`;
    navigator.clipboard?.writeText(fullText);
    setHasCopiedEmail(true);
    setTimeout(() => setHasCopiedEmail(false), 2000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-8 pb-32 space-y-8">
      {/* Header and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase text-ink-3">
            STEP 3 · CANDIDATE ROSTER
          </span>
          <h1 className="font-display text-4xl text-ink leading-tight mt-1">
            Shortlisted Creators ({shortlistedCreators.length})
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Compare candidate profiles, audit technical toolchains, and generate personalized direct outreach.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-ctl border border-line self-start sm:self-auto">
          <button
            onClick={() => setActiveView('list')}
            className={`px-3 py-1.5 rounded-[4px] font-mono text-[11px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === 'list'
                ? 'bg-ink text-surface font-semibold shadow-2xs'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <List size={13} />
            <span>List View</span>
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`px-3 py-1.5 rounded-[4px] font-mono text-[11px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeView === 'matrix'
                ? 'bg-ink text-surface font-semibold shadow-2xs'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Columns size={13} />
            <span>Comparison Matrix</span>
          </button>
        </div>
      </div>

      {/* List View: Compact Roster Rows */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {shortlistedCreators.map((creator) => (
            <div
              key={creator.id}
              className="p-5 rounded-card bg-surface border border-line hover:border-line-strong transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-ui font-semibold text-[17px] text-ink">
                      {creator.name}
                    </h3>
                    <span className="font-mono text-[10px] bg-verified/10 text-verified px-2 py-0.5 rounded-[3px] font-semibold">
                      {creator.fitScore || 96}% FIT
                    </span>
                    <FitLevelBadge level={creator.fitLevel || 'Strong'} />
                  </div>
                  <p className="text-ink-2 text-[13px] mt-0.5">
                    {creator.role} · {creator.location || 'Bengaluru, IN'}
                  </p>
                  <div className="font-mono text-[11px] text-ink-3 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Turnaround: {creator.turnaround || '3-5 days'}</span>
                    <span>·</span>
                    <span className="text-verified flex items-center gap-1">
                      <ShieldCheck size={11} />
                      <span>Commercial Rights Cleared</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Range Fit Bar */}
              <div className="w-full md:w-64">
                <RangeFitBar
                  minPrice={creator.minPrice || 45000}
                  maxPrice={creator.maxPrice || 75000}
                  budget={campaignBudget}
                  currency={currency}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 self-end md:self-center flex-shrink-0">
                <button
                  onClick={() => setOutreachCreator(creator)}
                  className="px-3 py-1.5 rounded-ctl bg-ink text-white hover:bg-[#25231F] border border-ink text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail size={13} />
                  <span>Outreach Email</span>
                </button>
                <button
                  onClick={() => onOpenFitSheet?.(creator)}
                  className="px-3 py-1.5 rounded-ctl border border-line-strong hover:border-ink text-ink text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Fit sheet
                </button>
                <button
                  onClick={() => onRemoveFromShortlist?.(creator.id)}
                  className="p-2 text-ink-3 hover:text-blocked transition-colors cursor-pointer"
                  title="Remove from shortlist"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Matrix View */}
      {activeView === 'matrix' && (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] bg-surface rounded-card border border-line shadow-2xs divide-y divide-line">
            <div className="grid grid-cols-12 p-4 bg-paper font-mono text-[11px] text-ink-3 uppercase tracking-wider">
              <div className="col-span-3 font-semibold text-ink">CREATOR PROFILE</div>
              <div className="col-span-2">MATCH FIT</div>
              <div className="col-span-2">PRICE RANGE</div>
              <div className="col-span-2">SLA & TURNAROUND</div>
              <div className="col-span-3 text-right">ACTIONS</div>
            </div>
            {shortlistedCreators.map((creator) => (
              <div
                key={creator.id}
                className="grid grid-cols-12 p-4 items-center hover:bg-sunken/40 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-3 pr-2">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-ctl object-cover border border-line flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-ui font-semibold text-[15px] text-ink leading-tight">
                      {creator.name}
                    </h4>
                    <span className="font-mono text-[11px] text-ink-3 block mt-0.5 truncate max-w-[170px]">
                      {creator.role}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold text-verified">
                      {creator.fitScore || 96}%
                    </span>
                    <FitLevelBadge level={creator.fitLevel || 'Strong'} />
                  </div>
                  <span className="font-mono text-[10px] text-ink-3 block">
                    Style: 98% · SLA: 92%
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="font-mono text-[13px] font-semibold text-ink">
                    {formatCurrency(creator.minPrice, currency)} – {formatCurrency(creator.maxPrice, currency)}
                  </div>
                  <span className="font-mono text-[10px] text-ink-3 block mt-0.5">
                    Budget: {formatCurrency(campaignBudget, currency)}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="font-mono text-[12px] text-ink font-medium block">
                    {creator.turnaround || '3-5 days'}
                  </span>
                  <span className="font-mono text-[10px] text-verified block mt-0.5">
                    Perpetual Rights
                  </span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setOutreachCreator(creator)}
                    className="h-8 px-2.5 rounded-ctl bg-ink text-white hover:bg-[#25231F] border border-ink font-mono text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Mail size={12} />
                    <span>Outreach</span>
                  </button>
                  <button
                    onClick={() => onOpenFitSheet?.(creator)}
                    className="h-8 px-2.5 rounded-ctl border border-line-strong hover:border-ink text-ink font-mono text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Fit Sheet
                  </button>
                  <button
                    onClick={() => onRemoveFromShortlist?.(creator.id)}
                    className="p-1.5 text-ink-3 hover:text-blocked transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outreach Email Modal */}
      {outreachCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-surface rounded-card border border-line shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase text-ink-3 flex items-center gap-1.5">
                  DIRECT DISPATCH DRAFT · COLOPHON OUTREACH
                </span>
                <h3 className="font-display text-2xl text-ink mt-0.5">
                  Draft Inquiry for {outreachCreator.name}
                </h3>
              </div>
              <button
                onClick={() => setOutreachCreator(null)}
                className="p-1 rounded-ctl hover:bg-sunken text-ink-3 hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase text-ink-3 block">
                EMAIL SUBJECT
              </label>
              <div className="p-2.5 rounded-ctl bg-paper border border-line font-mono text-[13px] text-ink select-all">
                {getOutreachSubject(outreachCreator)}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase text-ink-3 block">
                MESSAGE BODY (TAILORED CAMPAIGN SPECIFICATION)
              </label>
              <textarea
                readOnly
                rows={10}
                value={getOutreachBody(outreachCreator)}
                className="w-full p-3.5 rounded-ctl bg-paper border border-line text-[13px] font-mono leading-relaxed text-ink select-all resize-none focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-line">
              <span className="font-mono text-[11px] text-ink-3">
                1-click copy or open native mail composer
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyEmail(outreachCreator)}
                  className={`flex-1 sm:flex-none h-10 px-4 rounded-ctl text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    hasCopiedEmail
                      ? 'bg-verified text-white shadow-2xs'
                      : 'bg-surface border border-line-strong hover:border-ink text-ink'
                  }`}
                >
                  {hasCopiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  <span>{hasCopiedEmail ? 'Copied to Clipboard!' : 'Copy Email Text'}</span>
                </button>
                <a
                  href={`mailto:creators@colophon.art?subject=${encodeURIComponent(
                    getOutreachSubject(outreachCreator)
                  )}&body=${encodeURIComponent(getOutreachBody(outreachCreator))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none h-10 px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-white text-[13px] font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-ink"
                >
                  <Mail size={14} />
                  <span>Open Mail Client</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Docked Action Bar */}
      <CampaignActionBar
        backLabel="Back to matches"
        onBack={onBack}
        statusText={`${shortlistedCreators.length} creators ready for final review`}
        forwardLabel="Review summary"
        onForward={onProceedToSummary}
      />
    </div>
  );
}
