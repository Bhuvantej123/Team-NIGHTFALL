import React from 'react';
import { Check, Plus, AlertCircle, ArrowUpRight, BarChart3, Users, Flame } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';
import { FitMeter } from './common/FitMeter';

interface CreatorSummaryCardsProps {
  creators: CreatorProfile[];
  shortlistedIds: string[];
  activeHighlightId: string | null;
  onToggleShortlist: (id: string) => void;
  onToggleHighlight: (id: string) => void;
}

export const CreatorSummaryCards: React.FC<CreatorSummaryCardsProps> = ({
  creators,
  shortlistedIds,
  activeHighlightId,
  onToggleShortlist,
  onToggleHighlight,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {creators.map((creator, index) => {
        const isShortlisted = shortlistedIds.includes(creator.id);
        const isHighlighted = activeHighlightId === creator.id;
        const rankPills = ['#1 Match · Primary Fit', '#2 Match · Luxury Spec', '#3 Match · High Velocity'];

        return (
          <div
            key={creator.id}
            onClick={() => onToggleHighlight(creator.id)}
            className={`p-5 md:p-6 rounded-card bg-surface border transition-all shadow-2xs flex flex-col justify-between cursor-pointer group ${
              isHighlighted
                ? 'border-cobalt ring-2 ring-cobalt/20 shadow-float bg-cobalt-tint/10'
                : 'border-line hover:border-line-strong'
            }`}
          >
            <div>
              {/* Header with Rank & Fit Meter */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-line">
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink-2 bg-sunken px-2.5 py-1 rounded-ctl border border-line">
                  {rankPills[index]}
                </span>

                <div className="flex items-center gap-2">
                  <FitMeter level={creator.matchTier} />
                  <span className="font-mono text-[14px] font-bold text-ink tnum">
                    {creator.matchScore.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Creator Identity */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-13 h-13 rounded-full object-cover border border-line bg-sunken group-hover:border-cobalt transition-colors"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${
                      creator.availability ? 'bg-verified' : 'bg-unverified'
                    }`}
                    title={creator.availability ? 'Available for bookings' : 'Booked / Lead time required'}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-ui font-semibold text-[17px] text-ink leading-tight truncate">
                    {creator.name}
                  </h3>
                  <p className="font-mono text-[12px] text-ink-3 truncate mt-0.5">
                    {creator.handle}
                  </p>
                  <p className="text-[12px] text-ink-2 line-clamp-1 mt-1">
                    {creator.tagline}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 bg-sunken/60 rounded-ctl p-3 border border-line/70 mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3 block">Total Audience</span>
                  <span className="font-mono text-[14px] font-bold text-ink tnum flex items-center gap-1 mt-0.5">
                    {(creator.totalFollowers / 1000).toFixed(0)}k
                    <span className="text-[11px] font-medium text-verified font-mono">+{creator.growthRate6M}%</span>
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3 block">Avg Engagement</span>
                  <span className="font-mono text-[14px] font-bold text-ink tnum flex items-center gap-1 mt-0.5">
                    {creator.avgEngagement}%
                    <span className="text-[10px] font-normal text-ink-3 font-ui">(2x avg)</span>
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3 block">Starting Rate</span>
                  <span className="font-mono text-[14px] font-bold text-ink tnum mt-0.5 block">
                    ${creator.startingPrice.toLocaleString()} <span className="text-[10px] font-normal text-ink-3">USD</span>
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3 block">Turnaround</span>
                  <span className="text-[12px] font-medium text-ink-2 mt-0.5 block truncate">
                    {creator.avgTurnaround}
                  </span>
                </div>
              </div>

              {/* Platform Chips */}
              <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                {creator.platforms.map((p) => (
                  <span
                    key={p.name}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-ctl bg-surface border border-line text-ink-2 flex items-center gap-1"
                  >
                    <span>{p.name}:</span>
                    <strong className="text-ink font-semibold">{(p.followers / 1000).toFixed(0)}k</strong>
                    <span className="text-ink-3">·</span>
                    <span className="text-verified font-medium">{p.engagement}%</span>
                  </span>
                ))}

                {!creator.availability && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-ctl bg-unverified-wash text-unverified border border-unverified/30 ml-auto flex items-center gap-1">
                    <AlertCircle size={11} />
                    Limited Lead Time
                  </span>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-line flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleShortlist(creator.id);
                }}
                className={`flex-1 py-2 px-3 rounded-ctl text-[13px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isShortlisted
                    ? 'bg-verified-wash text-verified border border-verified/40 hover:bg-verified-wash/80 font-semibold'
                    : 'bg-ink hover:bg-ink-2 text-surface shadow-2xs'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Shortlisted for Campaign</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={2} />
                    <span>Shortlist Creator</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHighlight(creator.id);
                }}
                className={`p-2 rounded-ctl border text-[13px] transition-colors cursor-pointer ${
                  isHighlighted
                    ? 'bg-cobalt-tint border-cobalt text-cobalt font-semibold'
                    : 'bg-surface border-line text-ink-3 hover:text-ink hover:border-line-strong'
                }`}
                title="Focus creator across charts"
              >
                <BarChart3 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
