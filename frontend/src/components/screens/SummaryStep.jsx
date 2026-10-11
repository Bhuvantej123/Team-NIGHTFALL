import React, { useState } from 'react';
import { Copy, Check, CheckCircle2, Home, Layers, Loader2, AlertCircle } from 'lucide-react';
import { FitMeter } from '../common/FitMeter';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatCurrency } from '../../utils/formatters';

/**
 * SummaryStep (Step 4: Final Record & Completion)
 * @param {{
 *   campaign: any;
 *   shortlistedCreators: Array<any>;
 *   onCompleteCampaign: () => Promise<any>;
 *   onNavigateHome: () => void;
 *   onNavigateCampaigns: () => void;
 *   onBack: () => void;
 * }} props
 */
export function SummaryStep({
  campaign,
  shortlistedCreators = [],
  onCompleteCampaign,
  onNavigateHome,
  onNavigateCampaigns,
  onBack,
}) {
  const [copied, setCopied] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState(null);

  const isCompleted = campaign?.status === 'completed' || campaign?.rawWorkflow?.workflow_status === 'completed';
  const currency = campaign?.currency || 'USD';

  const handleCopySummary = () => {
    const text = `CREATORCONNECT AI CAMPAIGN DOSSIER
Campaign: ${campaign?.title || 'Creative Campaign'}
Brand: ${campaign?.brandName || 'Brand'}
Budget Allocation: ${formatCurrency(campaign?.budget, currency)} ${currency}
Deadline: ${campaign?.deadline || 'Flexible'}
Deliverables: ${campaign?.deliverablesText || 'Custom Asset Package'}

SHORTLISTED CREATORS (${shortlistedCreators.length}):
${shortlistedCreators
  .map(
    (c) => `- ${c.display_name || c.name} (@${c.handle || c.id}) | Rate: ${formatCurrency(c.starting_price || c.minPrice, currency)}`
  )
  .join('\n')}

Recorded via CreatorConnect AI Workflow Engine.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    setCompletionError(null);
    try {
      await onCompleteCampaign();
    } catch (err) {
      setCompletionError(err?.message || 'Failed to complete campaign workflow');
    } finally {
      setIsCompleting(false);
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
            Campaign Dossier & Audit Record
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
            title="Go to Homepage"
          >
            <Home size={14} />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={onNavigateCampaigns}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
            title="Go to Campaigns directory"
          >
            <Layers size={14} />
            <span>Campaigns</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-ctl border border-line-strong hover:border-ink bg-surface text-ink text-[13px] font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-verified" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Completion Error Alert */}
      {completionError && (
        <div className="p-4 rounded-ctl bg-blocked/10 border border-blocked/30 text-blocked flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{completionError}</span>
          </div>
          <button
            type="button"
            onClick={handleMarkComplete}
            className="px-3 py-1 rounded-ctl bg-blocked text-white text-[12px] font-mono cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted ? (
        <div className="p-5 rounded-card bg-[#EEF8F1] border border-[#CDEED5] text-ink flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-verified/20 text-verified flex items-center justify-center font-bold text-sm">
              ✓
            </span>
            <div>
              <div className="font-semibold text-[15px]">Campaign Finalized & Recorded</div>
              <div className="text-[12px] text-ink-2">Status marked completed on database workflow ledger.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateCampaigns}
            className="px-4 py-2 rounded-ctl bg-ink text-surface text-[13px] font-medium hover:bg-ink-2 transition-colors cursor-pointer"
          >
            Return to Campaigns Directory
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-card bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-ui font-semibold text-[15px] text-ink">Ready to Finalize Campaign?</h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              Advance workflow status to 'completed' via backend status progression contract.
            </p>
          </div>
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={isCompleting || shortlistedCreators.length === 0}
            className="px-5 py-2.5 rounded-ctl bg-ink hover:bg-ink/85 text-surface text-[13px] font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isCompleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Finalizing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Complete Campaign</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Dossier Summary Card */}
      <div className="p-8 rounded-card bg-surface border border-line shadow-2xs space-y-6">
        {/* Campaign Parameters */}
        <div className="space-y-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 font-semibold block">
            COMMISSION SPECIFICATIONS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-paper rounded-ctl border border-line space-y-1">
              <span className="font-mono text-[10px] uppercase text-ink-3 block">Campaign Title</span>
              <div className="text-[15px] font-semibold text-ink">{campaign?.title}</div>
            </div>

            <div className="p-4 bg-paper rounded-ctl border border-line space-y-1">
              <span className="font-mono text-[10px] uppercase text-ink-3 block">Client / Brand</span>
              <div className="text-[15px] font-semibold text-ink">{campaign?.brandName}</div>
            </div>

            <div className="p-4 bg-paper rounded-ctl border border-line space-y-1">
              <span className="font-mono text-[10px] uppercase text-ink-3 block">Budget Cap</span>
              <div className="text-[15px] font-mono font-semibold text-ink">
                {formatCurrency(campaign?.budget, currency)} {currency}
              </div>
            </div>

            <div className="p-4 bg-paper rounded-ctl border border-line space-y-1">
              <span className="font-mono text-[10px] uppercase text-ink-3 block">Target Deadline</span>
              <div className="text-[15px] font-mono text-ink">
                {campaign?.deadline || 'Flexible'}
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables & Direction */}
        <div className="pt-4 border-t border-line/60 space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 font-semibold block">
            DELIVERABLES & STRATEGIC DIRECTION
          </span>
          <div className="p-4 bg-paper rounded-ctl border border-line space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">Asset Package:</span>
              <span className="font-mono text-ink-2">{campaign?.deliverablesText || 'Custom Deliverables'}</span>
            </div>
            {campaign?.objective && (
              <div className="pt-2 border-t border-line/60 text-[13px]">
                <span className="font-medium text-ink block mb-0.5">Objective:</span>
                <p className="text-ink-2 leading-relaxed">{campaign.objective}</p>
              </div>
            )}
          </div>
        </div>

        {/* Shortlisted Creators Roster */}
        <div className="pt-4 border-t border-line/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 font-semibold">
              COMMISSION CANDIDATES ({shortlistedCreators.length})
            </span>
            <span className="font-mono text-[11px] text-verified">
              Verified Pipeline
            </span>
          </div>

          <div className="space-y-3">
            {shortlistedCreators.map((item) => {
              const creatorId = item.creator_id || item.id;
              const name = item.display_name || item.name || 'Creator';
              const handle = item.handle || '';
              const rate = item.starting_price || item.minPrice || 0;
              const avatar = item.creator?.portfolio_items?.[0]?.thumbnail_url ||
                item.creator?.portfolio_items?.[0]?.content_url ||
                item.avatar ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';

              return (
                <div
                  key={creatorId}
                  className="p-3.5 rounded-ctl bg-paper border border-line flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
                      <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-ink">{name}</div>
                      <div className="font-mono text-[11px] text-ink-3">{handle}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[12px]">
                    <div className="font-semibold text-ink">
                      {formatCurrency(rate, currency)} {currency}
                    </div>
                    <div className="text-verified text-[10px]">Ready for outreach</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CampaignActionBar
        backLabel="Back to Shortlist"
        onBack={onBack}
        forwardLabel={isCompleted ? 'View Campaigns' : 'Complete Campaign'}
        onForward={isCompleted ? onNavigateCampaigns : handleMarkComplete}
      />
    </div>
  );
}

export default SummaryStep;
