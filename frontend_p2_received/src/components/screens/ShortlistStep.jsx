import React from 'react';
import { Trash2, ArrowLeft, ArrowRight, UserPlus } from 'lucide-react';
import { FitMeter } from '../common/FitMeter';
import { RangeFitBar } from '../common/RangeFitBar';
import { StatusGlyph } from '../common/StatusGlyph';
import { CreditLine } from '../common/CreditLine';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatRupees } from '../../utils/formatters';

export function ShortlistStep({
  campaign,
  shortlistedCreators = [],
  onRemoveFromShortlist,
  onOpenFitSheet,
  onOpenColophon,
  onBack,
  onProceedToSummary,
}) {
  if (shortlistedCreators.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 pb-32 text-center space-y-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          STEP 3 · SHORTLIST
        </span>
        <h2 className="font-display text-3xl text-ink">
          No creators shortlisted yet.
        </h2>
        <p className="text-[14px] text-ink-2 max-w-md mx-auto">
          Return to the Matches step to select and shortlist creators for this campaign.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-ctl bg-cobalt text-white text-[13px] font-medium hover:bg-cobalt-press transition-colors"
        >
          <UserPlus size={14} />
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

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 pb-32 space-y-8">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <span className="font-mono text-[10px] uppercase text-ink-3">
          STEP 3 · CANDIDATE ROSTER
        </span>
        <h1 className="font-display text-4xl text-ink leading-tight mt-1">
          Shortlisted Creators ({shortlistedCreators.length})
        </h1>
        <p className="text-[14px] text-ink-2 mt-1">
          These creators have verified technical pipelines and fit your campaign constraints.
        </p>
      </div>

      {/* Compact Rows */}
      <div className="space-y-4">
        {shortlistedCreators.map((creator) => (
          <div
            key={creator.id}
            className="p-5 rounded-card bg-surface border border-line hover:border-line-strong transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
          >
            {/* Left info: Work-crop avatar, name, role, fit */}
            <div className="flex items-center gap-4">
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
                  <FitMeter level={creator.fitLevel} />
                </div>
                <p className="text-ink-2 text-[13px] mt-0.5">
                  {creator.role} · {creator.location}
                </p>
                <div className="font-mono text-[11px] text-ink-3 mt-1">
                  Turnaround: {creator.turnaround} · Commercial Rights Cleared
                </div>
              </div>
            </div>

            {/* Middle: Range Fit Bar */}
            <div className="w-full md:w-64">
              <RangeFitBar
                minPrice={creator.minPrice}
                maxPrice={creator.maxPrice}
                budget={campaign?.budget || 10000}
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => onOpenFitSheet(creator)}
                className="px-3 py-1.5 rounded-ctl border border-line-strong hover:border-ink text-ink text-[12px] font-medium transition-colors"
              >
                Fit sheet
              </button>
              <button
                onClick={() => onRemoveFromShortlist(creator.id)}
                className="p-2 text-ink-3 hover:text-blocked transition-colors"
                title="Remove from shortlist"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Action Bar */}
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
