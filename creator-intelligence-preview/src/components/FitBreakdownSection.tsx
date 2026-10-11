import React from 'react';
import { Target, Zap, Palette, DollarSign, Clock, Check, AlertCircle, Award } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';

interface FitBreakdownSectionProps {
  creators: CreatorProfile[];
  activeHighlightId: string | null;
}

export const FitBreakdownSection: React.FC<FitBreakdownSectionProps> = ({
  creators,
  activeHighlightId,
}) => {
  const dimensions = [
    {
      key: 'skillRelevance' as const,
      name: 'Skill & Tool Alignment',
      weight: '35%',
      icon: Target,
      desc: 'Prompting expertise, camera motion choreography, 3D toolchain match',
    },
    {
      key: 'portfolioQuality' as const,
      name: 'Portfolio Relevance & Polish',
      weight: '25%',
      icon: Zap,
      desc: 'Demonstrated commercial portfolio items, fluid physics, cinematic grading',
    },
    {
      key: 'aestheticMatch' as const,
      name: 'Aesthetic & Tone Compatibility',
      weight: '20%',
      icon: Palette,
      desc: 'Color palette alignment, cinematic rhythm, and brand mood resonance',
    },
    {
      key: 'budgetCompatibility' as const,
      name: 'Budget & Pricing Compatibility',
      weight: '10%',
      icon: DollarSign,
      desc: 'Starting rate relative to campaign budget ceiling and deliverable requirements',
    },
    {
      key: 'reliabilityScore' as const,
      name: 'Turnaround & Reliability',
      weight: '10%',
      icon: Clock,
      desc: 'Response time, production turnaround speed, and delivery reliability',
    },
  ];

  const getWinnerId = (key: keyof CreatorProfile['fitBreakdown']) => {
    return creators.reduce((prev, curr) => 
      curr.fitBreakdown[key] > prev.fitBreakdown[key] ? curr : prev
    ).id;
  };

  return (
    <div className="space-y-6">
      {/* Dimension Matrix Card */}
      <div className="rounded-card bg-surface border border-line shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-line">
          <div>
            <h3 className="font-display text-2xl text-ink leading-tight">
              Detailed Match Scoring & Dimension Weighting
            </h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              Deterministic scoring based on verified skills, portfolio tags, tone, and campaign budget.
            </p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 bg-sunken px-3 py-1 rounded-ctl border border-line w-fit">
            Deterministic Weights (Sum = 100%)
          </span>
        </div>

        {/* Dimension rows */}
        <div className="divide-y divide-line">
          {dimensions.map((dim) => {
            const winnerId = getWinnerId(dim.key);

            return (
              <div key={dim.key} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-ui font-semibold text-[14px] text-ink">{dim.name}</span>
                      <span className="font-mono text-[10px] font-semibold text-ink-3 px-1.5 py-0.5 bg-sunken rounded-ctl border border-line">
                        Weight: {dim.weight}
                      </span>
                    </div>
                    <p className="text-[12px] text-ink-3 mt-0.5">{dim.desc}</p>
                  </div>
                </div>

                {/* Comparative Horizontal Bars for the 3 Creators */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {creators.map((c) => {
                    const score = c.fitBreakdown[dim.key];
                    const isWinner = c.id === winnerId;
                    const isHighlighted = activeHighlightId === c.id;

                    return (
                      <div 
                        key={c.id} 
                        className={`p-3 rounded-ctl border transition-all ${
                          isHighlighted
                            ? 'bg-cobalt-tint/30 border-cobalt ring-1 ring-cobalt/20'
                            : 'bg-sunken/40 border-line hover:border-line-strong'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-ui font-medium text-ink truncate max-w-[130px]">
                            {c.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isWinner && (
                              <span className="font-mono text-[10px] font-semibold text-verified bg-verified-wash px-1.5 py-0.2 rounded border border-verified/30 flex items-center gap-0.5">
                                <Award size={10} /> Top
                              </span>
                            )}
                            <span className="font-mono text-[12px] font-bold text-ink tnum">{score}%</span>
                          </div>
                        </div>

                        {/* Progress track */}
                        <div className="h-2 w-full bg-line rounded-[2px] overflow-hidden">
                          <div
                            className={`h-full rounded-[2px] transition-all duration-500 ${
                              isWinner ? 'bg-cobalt' : 'bg-ink'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Qualitative Strengths & Key Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {creators.map((creator, i) => (
          <div 
            key={creator.id}
            className="p-5 rounded-card bg-surface border border-line shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-line">
                <h4 className="font-ui font-semibold text-[15px] text-ink">{creator.name}</h4>
                <span className="font-mono text-[11px] text-ink-3">Profile Synthesis</span>
              </div>

              {/* Strengths */}
              <div className="mb-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-verified font-semibold block mb-2 flex items-center gap-1">
                  <Check size={12} strokeWidth={2.5} /> Confirmed Strengths
                </span>
                <ul className="space-y-1.5">
                  {creator.strengths.map((str, idx) => (
                    <li key={idx} className="text-[12px] text-ink-2 bg-sunken/60 p-2.5 rounded-ctl border border-line leading-relaxed">
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-unverified font-semibold block mb-2 flex items-center gap-1">
                  <AlertCircle size={12} /> Execution Considerations
                </span>
                <ul className="space-y-1.5">
                  {creator.keyRisks.map((risk, idx) => (
                    <li key={idx} className="text-[12px] text-unverified bg-unverified-wash/40 p-2.5 rounded-ctl border border-unverified/30 leading-relaxed">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Overall Recommendation Footnote */}
            <div className="mt-4 pt-3 border-t border-line text-[12px] text-ink-3">
              <strong className="text-ink font-semibold">Recommendation: </strong>
              {i === 0 
                ? 'Primary candidate for balanced cinematic production & on-time delivery.' 
                : i === 1 
                ? 'Best for luxury commercial aesthetics if budget ceiling accommodates $1,750+.' 
                : 'High-conversion alternative for viral youth gaming audiences.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
