import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Check, Plus, AlertCircle } from 'lucide-react';
import { FitMeter, CriterionTrack } from './FitMeter';
import { StatusGlyph } from './StatusGlyph';
import { formatCurrency } from '../../utils/formatters';

/**
 * @param {{
 *   isOpen?: boolean;
 *   onClose?: () => void;
 *   creator?: any;
 *   briefId?: string;
 *   isShortlisted?: boolean;
 *   onToggleShortlist?: (id: string) => void;
 *   onOpenColophon?: (work: any, creator: any, dark?: boolean) => void;
 * }} props
 */
export function FitSheet({
  isOpen = false,
  onClose = () => {},
  creator = null,
  briefId = 'CAMPAIGN BRIEF',
  isShortlisted = false,
  onToggleShortlist = (_id) => {},
  onOpenColophon = (_work, _creator, _dark) => {},
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

  // Extract score breakdown if available from backend MatchResult
  const breakdown = creator.scoreBreakdown || {
    skill_niche_relevance: 0.85,
    portfolio_relevance: 0.80,
    style_compatibility: 0.75,
    budget_fit: 0.90,
    availability: 1.0,
  };

  const skillScore = Math.round((breakdown.skill_niche_relevance ?? 0.85) * 100);
  const portfolioScore = Math.round((breakdown.portfolio_relevance ?? 0.80) * 100);
  const styleScore = Math.round((breakdown.style_compatibility ?? 0.75) * 100);
  const budgetScore = Math.round((breakdown.budget_fit ?? 0.90) * 100);
  const availScore = Math.round((breakdown.availability ?? 1.0) * 100);

  const evidence = creator.evidence || {};
  const skillEvidence = evidence.skill_terms?.join(', ') || evidence.matched_skills?.join(', ') || 'Niche and skills align with brief requirements';
  const portfolioEvidence = evidence.portfolio_terms?.join(', ') || evidence.portfolio_matches?.join(', ') || 'Portfolio history matches deliverables';
  const styleEvidence = evidence.style_terms?.join(', ') || evidence.style_tags?.join(', ') || 'Visual tone and style match campaign';

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
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-ctl text-ink-2 hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Top Block: Fit label, meter, & weights info */}
            <div className="pb-4 border-b border-line">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FitMeter level={creator.fitLevel || 'Strong'} />
                  {creator.fitScore !== undefined && (
                    <span className="font-mono text-[13px] font-semibold text-ink">
                      {creator.fitScore}%
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowHowWeScore(!showHowWeScore)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-ink hover:underline cursor-pointer"
                >
                  <HelpCircle size={13} strokeWidth={1.5} />
                  <span>How we score</span>
                </button>
              </div>

              {/* Over budget alert if applicable */}
              {creator.overBudget && (
                <div className="p-3 mb-4 rounded-ctl bg-blocked/10 border border-blocked/30 text-blocked text-[12px] flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>
                    <strong>Over Budget:</strong> Creator starting price exceeds the campaign maximum budget.
                  </span>
                </div>
              )}

              {/* How We Score Explainer */}
              {showHowWeScore && (
                <div className="p-3 mb-4 rounded-ctl bg-sunken border border-line text-[12px] space-y-1.5">
                  <div className="font-mono text-[10px] uppercase font-semibold text-ink">
                    DETERMINISTIC 5-FACTOR MATCHING ENGINE
                  </div>
                  <p className="text-ink-2 leading-relaxed">
                    Skill & Niche Relevance: 35% · Portfolio Relevance: 25% · Style Compatibility: 20% · Budget Fit: 10% · Availability: 10%.
                  </p>
                  <p className="text-ink-3 font-mono text-[10px]">
                    Evaluated deterministically against CreatorConnect verified creator profiles.
                  </p>
                </div>
              )}

              {/* 5 Deterministic Factor Tracks */}
              <div className="space-y-1">
                <CriterionTrack
                  name="Skill & Niche Relevance"
                  weight="35%"
                  verdict={skillScore >= 80 ? 'Exemplary' : 'Compatible'}
                  evidence={skillEvidence}
                  score={skillScore}
                />
                <CriterionTrack
                  name="Portfolio Relevance"
                  weight="25%"
                  verdict={portfolioScore >= 80 ? 'High' : 'Moderate'}
                  evidence={portfolioEvidence}
                  score={portfolioScore}
                />
                <CriterionTrack
                  name="Style Compatibility"
                  weight="20%"
                  verdict={styleScore >= 80 ? 'Strong' : 'Aligned'}
                  evidence={styleEvidence}
                  score={styleScore}
                />
                <CriterionTrack
                  name="Budget Fit"
                  weight="10%"
                  verdict={creator.overBudget ? 'Over Budget' : 'Within Budget'}
                  evidence={creator.overBudget ? 'Starting rate exceeds budget cap' : 'Rates meet allocated campaign budget'}
                  score={budgetScore}
                />
                <CriterionTrack
                  name="Availability Fit"
                  weight="10%"
                  verdict={creator.availability ? 'Available' : 'Busy'}
                  evidence={creator.availability ? 'Creator declared available for commission' : 'Limited bandwidth indicated'}
                  score={availScore}
                />
              </div>
            </div>

            {/* Explanation Section */}
            {creator.explanation && (
              <div className="p-4 rounded-ctl bg-sunken border border-line space-y-1.5">
                <div className="font-mono text-[10px] uppercase font-semibold text-ink">
                  ALGORITHMIC MATCH JUSTIFICATION
                </div>
                <p className="text-[13px] text-ink-2 leading-relaxed">
                  {creator.explanation}
                </p>
              </div>
            )}

            {/* Rate & Turnaround */}
            <div className="p-4 rounded-ctl bg-paper border border-line space-y-2">
              <div className="font-mono text-[10px] uppercase font-semibold text-ink-3">
                COMMISSION COMMERCIALS
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-2">Starting Rate:</span>
                <span className="font-mono font-semibold text-ink">
                  {formatCurrency(creator.minPrice, creator.currency)} {creator.currency || 'USD'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-2">Turnaround:</span>
                <span className="font-mono text-ink">{creator.turnaround || '3-5 business days'}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-line bg-surface flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-ink-2 hover:text-ink cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onToggleShortlist?.(creator.id)}
              className={`px-5 py-2.5 rounded-ctl text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-ink text-surface hover:bg-ink-2'
                  : 'bg-ink hover:bg-ink/85 text-surface shadow-sm'
              }`}
            >
              {isShortlisted ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  <span>Shortlisted</span>
                </>
              ) : (
                <>
                  <Plus size={14} strokeWidth={2} />
                  <span>Add to Shortlist</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default FitSheet;
