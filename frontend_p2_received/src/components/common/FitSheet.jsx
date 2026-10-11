import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Check, Plus } from 'lucide-react';
import { FitMeter, CriterionTrack } from './FitMeter';
import { StatusGlyph } from './StatusGlyph';
import { CreditLine } from './CreditLine';
import { CropMarks } from './CropMarks';
import { ProvenanceTag } from './ProvenanceTag';

export function FitSheet({
  isOpen,
  onClose,
  creator,
  briefId = 'BRIEF 014',
  isShortlisted = false,
  isCompared = false,
  onToggleShortlist,
  onToggleCompare,
  onOpenColophon,
}) {
  const [showHowWeScore, setShowHowWeScore] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !creator) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#14130F]/28"
          aria-hidden="true"
        />

        {/* 520px Slide-over */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 380 }}
          className="relative w-full max-w-[520px] h-full shadow-float z-10 flex flex-col rounded-l-[28px] overflow-hidden bg-surface text-ink border-l border-line"
        >
          {/* Header */}
          <div className="px-8 pt-7 pb-4 border-b border-line flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3">
                  FIT SHEET · {briefId}
                </span>
                <h2 className="font-display text-2xl text-ink leading-tight">
                  {creator.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-ctl text-ink-2 hover:text-ink hover:bg-sunken transition-colors"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Top Block: Fit label, meter, & weights info */}
            <div className="pb-4 border-b border-line">
              <div className="flex items-center justify-between mb-3">
                <FitMeter level={creator.fitLevel || 'Strong'} />
                <button
                  type="button"
                  onClick={() => setShowHowWeScore(!showHowWeScore)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-cobalt hover:underline"
                >
                  <HelpCircle size={13} strokeWidth={1.5} />
                  <span>How we score</span>
                </button>
              </div>

              {/* How We Score Explainer Modal/Popover */}
              {showHowWeScore && (
                <div className="p-3 mb-4 rounded-ctl bg-sunken border border-line text-[12px] space-y-1.5">
                  <div className="font-mono text-[10px] uppercase font-semibold text-ink">
                    MATCH ENGINE WEIGHTING
                  </div>
                  <p className="text-ink-2">
                    Style Fidelity: 40% · Tooling & Pipeline: 25% · Category Track Record: 20% · Revisions & Delivery Reliability: 15%.
                  </p>
                  <p className="text-ink-3 font-mono text-[10px]">
                    Scores are algorithmic constraints, verified against creator colophon logs.
                  </p>
                </div>
              )}

              {/* 4 Criteria Tracks */}
              <div className="space-y-1">
                <CriterionTrack
                  name="Style Alignment"
                  weight="40%"
                  verdict={creator.criteria?.style?.verdict || 'Exemplary'}
                  evidence={creator.criteria?.style?.evidence || 'Matches 9:16 cinematic lighting and shoe texture prompts.'}
                  score={creator.criteria?.style?.score || 94}
                />
                <CriterionTrack
                  name="Tools and Workflow"
                  weight="25%"
                  verdict={creator.criteria?.tools?.verdict || 'Compatible'}
                  evidence={creator.criteria?.tools?.evidence || 'Production pipeline includes ComfyUI and manual retouching.'}
                  score={creator.criteria?.tools?.score || 88}
                />
                <CriterionTrack
                  name="Category Experience"
                  weight="20%"
                  verdict={creator.criteria?.category?.verdict || 'Direct'}
                  evidence={creator.criteria?.category?.evidence || '4 footwear and streetwear drops completed this quarter.'}
                  score={creator.criteria?.category?.score || 90}
                />
                <CriterionTrack
                  name="Consistency & Delivery"
                  weight="15%"
                  verdict={creator.criteria?.consistency?.verdict || 'High'}
                  evidence={creator.criteria?.consistency?.evidence || 'Consistent grain structure across past 12 project deliveries.'}
                  score={creator.criteria?.consistency?.score || 92}
                />
              </div>
            </div>

            {/* 3 Status Groups: Meets / Unverified / Doesn't meet */}
            <div className="space-y-4">
              {/* MEETS */}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 flex items-center gap-1.5 mb-2">
                  <StatusGlyph status="meets" size={13} />
                  <span>MEETS REQUIREMENTS</span>
                </span>
                <div className="space-y-2 text-[13px] bg-sunken/40 p-3 rounded-ctl border border-line">
                  {(creator.meetsClaims || [
                    { req: '4K 9:16 deliverable with seamless lighting', source: 'Neon Runner campaign, declared by creator' },
                    { req: 'Commercial rights clearance', source: 'Enterprise model tier agreement' },
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-verified mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="text-ink font-medium">{item.req}</div>
                        <div className="text-ink-3 text-[11px] font-mono mt-0.5">{item.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UNVERIFIED */}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 flex items-center gap-1.5 mb-2">
                  <StatusGlyph status="unverified" size={13} />
                  <span>UNVERIFIED CLAIMS</span>
                </span>
                <div className="space-y-2 text-[13px] bg-[#FBEFD6]/30 p-3 rounded-ctl border border-dashed border-[#94590A]/40">
                  <div className="text-ink font-medium">Turnaround within 5 days</div>
                  <div className="text-ink-2 text-[12px]">
                    Creator average is 6 days. Can be confirmed upon offer acceptance.
                  </div>
                </div>
              </div>

              {/* DOESN'T MEET (if reserve) */}
              {creator.doesNotMeet && (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-blocked flex items-center gap-1.5 mb-2">
                    <StatusGlyph status="blocked" size={13} />
                    <span>DOES NOT MEET HARD CONSTRAINT</span>
                  </span>
                  <div className="text-[13px] bg-[#FBE5E0]/40 p-3 rounded-ctl border border-blocked/20 text-blocked">
                    {creator.doesNotMeet}
                  </div>
                </div>
              )}
            </div>

            {/* Evidence (NOT PART OF THE SCORE) Section (Master Plan Section 3 & 7) */}
            <div className="p-4 rounded-card bg-surface border border-line space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-ink">
                    EVIDENCE & AUDIENCE SIGNALS
                  </span>
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-sunken border border-line text-ink-3">
                    NOT PART OF THE SCORE
                  </span>
                </div>
                <ProvenanceTag status="simulated" asOf="12 Sep 2026" />
              </div>

              <div className="space-y-2.5 text-[12px]">
                {/* 1. Audience trend verdict */}
                <div className="flex items-center justify-between p-2 rounded-ctl bg-paper border border-line">
                  <span className="text-ink">Audience Trend Verdict:</span>
                  <span className="font-mono text-[11px] font-semibold text-ink uppercase">
                    {creator.channel ? `${creator.channel.trend} (${creator.channel.trendSentence})` : 'No channel declared'}
                  </span>
                </div>

                {/* 2. Past campaigns in category */}
                <div className="flex items-center justify-between p-2 rounded-ctl bg-paper border border-line">
                  <span className="text-ink">Category Campaign Flights:</span>
                  <span className="font-mono text-[11px] font-semibold text-ink">
                    {creator.pastCampaigns?.length || 0} flights on record
                  </span>
                </div>

                {/* 3. Audience overlap with brief */}
                <div className="flex items-center justify-between p-2 rounded-ctl bg-paper border border-line">
                  <span className="text-ink">Audience Overlap (Age & Region):</span>
                  <span className="font-mono text-[11px] font-semibold text-verified">
                    {creator.audience ? 'Overlaps (86% Age Match)' : 'Not declared'}
                  </span>
                </div>
              </div>

              {/* Missing data plain list */}
              <div className="pt-2 border-t border-line/60">
                <span className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                  DECLARED GAPS & MISSING DATA
                </span>
                <p className="font-mono text-[11px] text-ink-3">
                  {!creator.channel ? '• Channel scrape not declared by creator\n' : ''}
                  {!creator.audience ? '• Audience regional survey pending\n' : ''}
                  • Full training prompts cataloged under Colophon logs
                </p>
              </div>
            </div>

            {/* Most Relevant Works (3 pieces with credit lines) */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 block mb-3">
                RELEVANT PORTFOLIO PROOFS (3 WORKS)
              </span>
              <div className="space-y-4">
                {(creator.portfolio || []).slice(0, 3).map((work, wIdx) => (
                  <div key={wIdx} className="group/item space-y-1.5">
                    <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden bg-sunken border border-line">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <CropMarks hoverable={true} />
                    </div>
                    <CreditLine
                      work={work}
                      creator={creator}
                      onOpenColophon={onOpenColophon}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky footer for actions */}
          <div className="p-6 border-t border-line bg-paper/60 flex items-center justify-between">
            <button
              onClick={() => onToggleCompare?.(creator.id)}
              className={`px-4 py-2 rounded-ctl border text-[13px] font-medium transition-colors ${
                isCompared
                  ? 'bg-cobalt-tint border-cobalt text-cobalt'
                  : 'bg-surface border-line-strong text-ink hover:bg-sunken'
              }`}
            >
              {isCompared ? 'In comparison' : '+ Add to compare'}
            </button>
            <button
              onClick={() => onToggleShortlist?.(creator.id)}
              className={`px-5 py-2 rounded-ctl text-[13px] font-medium transition-colors ${
                isShortlisted
                  ? 'bg-ink text-surface hover:bg-ink-2'
                  : 'bg-cobalt text-white hover:bg-cobalt-press'
              }`}
            >
              {isShortlisted ? 'Shortlisted' : 'Shortlist creator'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
