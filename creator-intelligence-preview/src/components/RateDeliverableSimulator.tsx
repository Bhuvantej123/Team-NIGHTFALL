import React, { useState } from 'react';
import { Calculator, CheckSquare, Square, Check, AlertCircle } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';

interface RateDeliverableSimulatorProps {
  creators: CreatorProfile[];
  campaignBudgetMax: number;
}

interface DeliverableOption {
  id: string;
  name: string;
  desc: string;
  baseUnits: number;
  multiplier: number;
}

export const RateDeliverableSimulator: React.FC<RateDeliverableSimulatorProps> = ({
  creators,
  campaignBudgetMax,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(['deliv-cinematic', 'deliv-reels']);

  const options: DeliverableOption[] = [
    {
      id: 'deliv-cinematic',
      name: '1x 45s Master Video (Cinematic 4K)',
      desc: 'Orchestral audio sync + camera motion choreography and high-res grading',
      baseUnits: 1,
      multiplier: 1.0,
    },
    {
      id: 'deliv-reels',
      name: '2x High-Conversion Vertical Reels / TikToks',
      desc: 'Optimized 9:16 cuts with viral audio hooks and sound design',
      baseUnits: 2,
      multiplier: 0.65,
    },
    {
      id: 'deliv-bts',
      name: '1x Behind-The-Scenes Prompt Breakdown',
      desc: 'Technical walkthrough of generative AI toolchain and prompt structure',
      baseUnits: 1,
      multiplier: 0.35,
    },
    {
      id: 'deliv-rights',
      name: 'Commercial Paid Media Whitelisting (90 Days)',
      desc: 'Ad usage rights for Meta and TikTok Spark ads',
      baseUnits: 1,
      multiplier: 0.40,
    },
  ];

  const toggleOption = (id: string) => {
    if (selectedItems.includes(id)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter(item => item !== id));
      }
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const calculateTotal = (creator: CreatorProfile) => {
    let factor = 0;
    selectedItems.forEach(itemId => {
      const opt = options.find(o => o.id === itemId);
      if (opt) factor += opt.multiplier;
    });
    return Math.round(creator.startingPrice * factor);
  };

  return (
    <div className="rounded-card bg-surface border border-line shadow-2xs p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
        <div>
          <h3 className="font-display text-2xl text-ink leading-tight">
            Interactive Deliverable Scope & Budget Simulator
          </h3>
          <p className="text-[13px] text-ink-2 mt-0.5">
            Configure campaign package deliverables to evaluate real-time pricing and budget fit across all three creators.
          </p>
        </div>

        <div className="font-mono text-[12px] bg-sunken border border-line px-3 py-1.5 rounded-ctl text-ink-2">
          Target Budget Ceiling: <strong className="text-ink font-bold tnum">${campaignBudgetMax.toLocaleString()} USD</strong>
        </div>
      </div>

      {/* Deliverable Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {options.map((opt) => {
          const isSelected = selectedItems.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={`p-3.5 rounded-ctl border cursor-pointer transition-all flex items-start gap-3 ${
                isSelected
                  ? 'bg-cobalt-tint/50 border-cobalt shadow-2xs'
                  : 'bg-surface border-line hover:border-line-strong'
              }`}
            >
              <div className="mt-0.5 text-cobalt flex-shrink-0">
                {isSelected ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} className="text-ink-3" />
                )}
              </div>
              <div className="flex-1">
                <span className="font-ui font-semibold text-[13px] text-ink block">{opt.name}</span>
                <span className="text-[12px] text-ink-3 block mt-0.5">{opt.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Simulator Output for the 3 Creators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {creators.map((c, i) => {
          const totalCost = calculateTotal(c);
          const isUnderBudget = totalCost <= campaignBudgetMax;
          const delta = Math.abs(campaignBudgetMax - totalCost);

          return (
            <div
              key={c.id}
              className={`p-5 rounded-card bg-surface border transition-all ${
                isUnderBudget
                  ? 'border-line shadow-2xs'
                  : 'border-unverified/60 bg-unverified-wash/10 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
                <span className="font-ui font-semibold text-[15px] text-ink">{c.name}</span>
                <span className={`font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                  isUnderBudget 
                    ? 'bg-verified-wash text-verified border-verified/30'
                    : 'bg-unverified-wash text-unverified border-unverified/30'
                }`}>
                  {isUnderBudget ? 'Within Budget' : 'Exceeds Ceiling'}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 my-2">
                <span className="font-mono text-2xl font-bold text-ink tnum">${totalCost.toLocaleString()}</span>
                <span className="font-mono text-[11px] text-ink-3">USD estimated</span>
              </div>

              <p className="text-[12px] text-ink-2 mb-4">
                {isUnderBudget ? (
                  <span className="text-verified font-medium flex items-center gap-1">
                    <Check size={13} strokeWidth={2.5} /> Saves ${delta.toLocaleString()} from budget ceiling
                  </span>
                ) : (
                  <span className="text-unverified font-medium flex items-center gap-1">
                    <AlertCircle size={13} /> ${delta.toLocaleString()} above target budget ceiling
                  </span>
                )}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-line text-[12px]">
                <div className="flex justify-between text-ink-2">
                  <span className="text-ink-3">Turnaround Estimate:</span>
                  <span className="font-medium text-ink">{c.avgTurnaround}</span>
                </div>
                <div className="flex justify-between text-ink-2 font-mono">
                  <span className="text-ink-3 font-ui">Projected Impressions:</span>
                  <span className="font-semibold text-cobalt">
                    {i === 0 ? '3.5M – 5.0M' : i === 1 ? '3.0M – 4.2M' : '4.5M – 6.5M'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
