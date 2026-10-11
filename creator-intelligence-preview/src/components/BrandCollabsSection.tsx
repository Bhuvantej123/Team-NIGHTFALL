import React, { useState } from 'react';
import { Briefcase, Eye, MousePointerClick, TrendingUp, DollarSign, Quote } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';

interface BrandCollabsSectionProps {
  creators: CreatorProfile[];
  activeHighlightId: string | null;
}

export const BrandCollabsSection: React.FC<BrandCollabsSectionProps> = ({
  creators,
  activeHighlightId,
}) => {
  const [activeTabCreatorId, setActiveTabCreatorId] = useState<string>(
    activeHighlightId || creators[0].id
  );

  const selectedCreator = creators.find(c => c.id === activeTabCreatorId) || creators[0];

  return (
    <div className="space-y-6">
      <div className="rounded-card bg-surface border border-line shadow-2xs p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
          <div>
            <h3 className="font-display text-2xl text-ink leading-tight">
              Verified Brand Collaborations & Performance Audits
            </h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              Case studies and conversion metrics audited from past commercial client partnerships.
            </p>
          </div>

          {/* Creator Segmented Tabs */}
          <div className="flex items-center gap-1 bg-sunken border border-line p-1 rounded-ctl">
            {creators.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTabCreatorId(c.id)}
                className={`px-3 py-1.5 rounded-[5px] font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                  activeTabCreatorId === c.id
                    ? 'bg-surface text-ink font-semibold shadow-2xs'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span>{c.name.split(' ')[0]}</span>
                <span className="text-[10px] text-ink-3 ml-1">({c.pastCollaborations.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Creator Collaborations Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-sunken/50 p-3.5 rounded-ctl border border-line">
            <img
              src={selectedCreator.avatar}
              alt={selectedCreator.name}
              className="w-10 h-10 rounded-full object-cover border border-line bg-surface"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-ui font-semibold text-[15px] text-ink">{selectedCreator.name}’s Audited Campaigns</h4>
                <span className="font-mono text-[10px] text-verified bg-verified-wash px-2 py-0.5 rounded border border-verified/30 font-semibold">
                  VERIFIED HISTORY
                </span>
              </div>
              <p className="text-[12px] text-ink-3">
                Avg Portfolio ROAS: <strong className="text-ink font-mono font-semibold">4.4x</strong> · 100% On-Time Delivery Record
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {selectedCreator.pastCollaborations.map((collab, idx) => (
              <div
                key={idx}
                className="p-5 rounded-card bg-surface border border-line shadow-2xs hover:border-line-strong transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Brand & Year Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-cobalt font-semibold block">
                        {collab.brand}
                      </span>
                      <h5 className="font-ui font-semibold text-[15px] text-ink mt-0.5 leading-snug">
                        {collab.campaignTitle}
                      </h5>
                    </div>
                    <span className="font-mono text-[10px] text-ink-3 bg-sunken px-2 py-0.5 rounded border border-line">
                      {collab.year}
                    </span>
                  </div>

                  {/* Deliverable description */}
                  <div className="text-[12px] text-ink-2 bg-sunken/60 p-2.5 rounded-ctl border border-line/70 mb-4">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3 block mb-0.5 font-semibold">
                      Deliverable Scope:
                    </span>
                    {collab.deliverable}
                  </div>

                  {/* Performance Metrics Cards */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-sunken/40 p-2.5 rounded-ctl border border-line">
                      <span className="font-mono text-[10px] text-ink-3 uppercase flex items-center gap-1">
                        <Eye size={12} className="text-ink-3" /> Views
                      </span>
                      <span className="font-mono text-[14px] font-bold text-ink mt-0.5 block tnum">
                        {collab.views}
                      </span>
                    </div>

                    <div className="bg-sunken/40 p-2.5 rounded-ctl border border-line">
                      <span className="font-mono text-[10px] text-ink-3 uppercase flex items-center gap-1">
                        <MousePointerClick size={12} className="text-ink-3" /> CTR
                      </span>
                      <span className="font-mono text-[14px] font-bold text-verified mt-0.5 block tnum">
                        {collab.ctr}
                      </span>
                    </div>

                    <div className="bg-sunken/40 p-2.5 rounded-ctl border border-line">
                      <span className="font-mono text-[10px] text-ink-3 uppercase flex items-center gap-1">
                        <TrendingUp size={12} className="text-ink-3" /> Engagement
                      </span>
                      <span className="font-mono text-[14px] font-bold text-ink mt-0.5 block tnum">
                        {collab.engagement}
                      </span>
                    </div>

                    <div className="bg-sunken/40 p-2.5 rounded-ctl border border-line">
                      <span className="font-mono text-[10px] text-ink-3 uppercase flex items-center gap-1">
                        <DollarSign size={12} className="text-ink-3" /> ROAS
                      </span>
                      <span className="font-mono text-[14px] font-bold text-ink mt-0.5 block tnum">
                        {collab.roas}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="pt-3 border-t border-line text-[13px] text-ink-2 font-display italic flex items-start gap-2">
                  <Quote size={13} className="text-ink-3 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{collab.testimonial}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
