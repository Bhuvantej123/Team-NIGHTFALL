import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';
import { CropMarks } from './CropMarks';

/**
 * HowWeLabelDataModal
 * Educational popover linking to the 4 states of the Provenance Layer:
 * 1. SIMULATED DEMO DATA
 * 2. DECLARED BY CREATOR
 * 3. INDEPENDENTLY VERIFIED (None connected in prototype)
 * 4. NOT DECLARED / INSUFFICIENT DATA
 */
export function HowWeLabelDataModal({ activeStatus, onClose }) {
  const states = [
    {
      status: 'simulated',
      title: 'SIMULATED DEMO DATA',
      tagClass: 'border-dashed border-line-strong bg-sunken/60 text-ink-3',
      description:
        'Numbers, engagement trends, and past campaign revenues synthesized from statistical archetypes. Never presented as live factual measurements.',
      rule: 'In this prototype, all follower metrics, monthly series, and past performance rows are simulated.',
    },
    {
      status: 'declared',
      title: 'DECLARED BY CREATOR',
      tagClass: 'border-dashed border-unverified/50 bg-unverified-wash/40 text-unverified',
      description:
        'Self-reported claims, software licenses, turnaround guarantees, and commercial rights declarations submitted directly by the creator or agency.',
      rule: 'Subject to verification before production escrow release.',
    },
    {
      status: 'verified',
      title: 'INDEPENDENTLY VERIFIED',
      tagClass: 'border-solid border-verified bg-verified-wash text-verified',
      description:
        'Direct OAuth connection to platform APIs (Meta Graph API, YouTube Analytics) or bank-cleared escrow ledger records.',
      rule: 'Note: No live external platforms are connected in this prototype. This state exists to show product specification, but is never rendered as verified in this demo.',
    },
    {
      status: 'missing',
      title: 'NOT DECLARED / INSUFFICIENT DATA',
      tagClass: 'border-dashed border-line-strong bg-sunken text-ink-3',
      description:
        'Variables that were either withheld by the creator, unmeasured during the flight, or missing required baseline sales figures.',
      rule: 'Rendered as a dashed crop-marked frame with a plain-language reason. Unknown is a state, not an error.',
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-surface rounded-card border border-line p-6 shadow-float space-y-5"
      >
        <CropMarks active={true} offset={6} length={12} />

        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
              DATA INTEGRITY & PROVENANCE SPECIFICATION
            </span>
            <h3 className="font-display text-2xl text-ink mt-0.5">
              How we label data
            </h3>
            <p className="text-[13px] text-ink-2 mt-1">
              "Know how it was made." Every number shows its source, status, and date. Simulated data can never display as verified.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-ctl text-ink-3 hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {states.map((st) => {
            const isCurrent = activeStatus === st.status;
            return (
              <div
                key={st.status}
                className={`p-3.5 rounded-ctl border transition-colors ${
                  isCurrent
                    ? 'border-cobalt bg-cobalt-tint/30 ring-1 ring-cobalt'
                    : 'border-line bg-paper/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[3px] border ${st.tagClass}`}
                  >
                    {st.title}
                  </span>
                  {isCurrent && (
                    <span className="font-mono text-[9px] uppercase text-cobalt font-bold">
                      ACTIVE CONTEXT
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-ink leading-relaxed">
                  {st.description}
                </p>
                <div className="mt-2 pt-2 border-t border-line/60 font-mono text-[10px] text-ink-3">
                  {st.rule}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-line flex justify-end">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-ctl bg-ink text-surface text-[12px] font-medium hover:bg-ink-2 transition-colors cursor-pointer"
          >
            Close legend
          </button>
        </div>
      </div>
    </div>
  );
}
