import React from 'react';
import { Users, Globe2, Compass, CheckCircle } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';

interface AudienceDemographicsSectionProps {
  creators: CreatorProfile[];
  activeHighlightId: string | null;
}

export const AudienceDemographicsSection: React.FC<AudienceDemographicsSectionProps> = ({
  creators,
  activeHighlightId,
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-card bg-surface border border-line shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
          <div>
            <h3 className="font-display text-2xl text-ink leading-tight">
              Audience Demographics & Demographic Overlap
            </h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              Audience telemetry based on verified followers, viewer retention, and active comment sentiment.
            </p>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-verified bg-verified-wash px-3 py-1 rounded-ctl border border-verified/30 font-medium">
            <CheckCircle size={13} /> 98.2% Bot-Cleaned Audience
          </span>
        </div>

        {/* 3-Column Comparative Demographics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.map((creator) => {
            const isHighlighted = activeHighlightId === creator.id;
            const { genderSplit, ageBrackets: ages, topCountries, topInterests } = creator.audience;

            return (
              <div
                key={creator.id}
                className={`rounded-card p-5 border transition-all ${
                  isHighlighted
                    ? 'bg-cobalt-tint/20 border-cobalt ring-1 ring-cobalt/30 shadow-xs'
                    : 'bg-surface border-line'
                }`}
              >
                {/* Header with Creator Info */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-line">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-full object-cover border border-line bg-sunken"
                  />
                  <div>
                    <h4 className="font-ui font-semibold text-[15px] text-ink leading-tight">{creator.name}</h4>
                    <span className="font-mono text-[11px] text-ink-3">{creator.handle}</span>
                  </div>
                </div>

                {/* 1. Gender Ratio */}
                <div className="mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-2">
                    Gender Distribution
                  </span>
                  
                  {/* Stacked Progress Bar */}
                  <div className="h-3 w-full rounded-[2px] overflow-hidden flex bg-sunken border border-line mb-2">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${genderSplit.male}%` }}
                      title={`Male: ${genderSplit.male}%`}
                    />
                    <div
                      className="h-full bg-cobalt"
                      style={{ width: `${genderSplit.female}%` }}
                      title={`Female: ${genderSplit.female}%`}
                    />
                    <div
                      className="h-full bg-line-strong"
                      style={{ width: `${genderSplit.nonBinary}%` }}
                      title={`Non-Binary: ${genderSplit.nonBinary}%`}
                    />
                  </div>

                  {/* Percentage Legend */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-ink-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-[1px] bg-ink" />
                      Male {genderSplit.male}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-[1px] bg-cobalt" />
                      Female {genderSplit.female}%
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-3">
                      Other {genderSplit.nonBinary}%
                    </span>
                  </div>
                </div>

                {/* 2. Age Distribution */}
                <div className="mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-2">
                    Age Cohorts
                  </span>
                  <div className="space-y-2">
                    {ages.map((a) => (
                      <div key={a.bracket} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-ink-3">{a.bracket}</span>
                          <span className="font-mono text-[11px] font-semibold text-ink tnum">{a.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-sunken rounded-[2px] overflow-hidden">
                          <div
                            className={`h-full rounded-[2px] ${
                              a.percentage > 40 ? 'bg-cobalt' : 'bg-ink'
                            }`}
                            style={{ width: `${a.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Top Countries Breakdown */}
                <div className="mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-2 flex items-center gap-1">
                    <Globe2 size={12} className="text-ink-3" /> Geographic Footprint
                  </span>
                  <div className="space-y-1.5">
                    {topCountries.map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center justify-between p-1.5 rounded-ctl bg-sunken/50 border border-line text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-surface text-ink border border-line">
                            {c.code}
                          </span>
                          <span className="text-[12px] text-ink-2 truncate">{c.country}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-ink tnum">{c.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Audience Top Interests & Affinity */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block mb-2 flex items-center gap-1">
                    <Compass size={12} className="text-ink-3" /> Domain Affinities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topInterests.map((interest) => (
                      <div
                        key={interest.category}
                        className="px-2.5 py-1 rounded-ctl bg-sunken border border-line text-[11px] text-ink-2 flex items-center gap-1.5"
                      >
                        <span>{interest.category}</span>
                        <span className="font-mono text-[10px] font-bold text-cobalt">
                          {interest.affinity}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
