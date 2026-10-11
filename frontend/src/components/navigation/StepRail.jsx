import React from 'react';
import { ChevronRight, Check } from 'lucide-react';

/**
 * Slim step rail that sits directly under the top bar inside an active campaign.
 * Displays:
 * - Campaign name
 * - 4 nodes: 1 Brief → 2 Matches → 3 Shortlist → 4 Summary
 * Done steps: solid Ink
 * Current step: Cobalt ring with dot
 * Future steps: locked with reason (e.g. "Needs brief", "Needs matches")
 */
export function StepRail({
  campaign,
  currentStep = 1, // 1 to 4
  onSelectStep = (_stepNum) => {},
}) {
  if (!campaign) return null;

  const steps = [
    { number: 1, name: 'Brief', id: 'brief', lockedReason: null },
    { number: 2, name: 'Matches', id: 'matches', lockedReason: 'Needs brief' },
    { number: 3, name: 'Shortlist', id: 'shortlist', lockedReason: 'Needs matches' },
    { number: 4, name: 'Summary', id: 'summary', lockedReason: 'Needs shortlist' },
  ];

  return (
    <div className="w-full bg-paper border-b border-line px-6 py-2.5 flex items-center justify-between select-none text-[13px]">
      {/* Campaign Identity */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          {campaign.code || 'CAMPAIGN'}
        </span>
        <span className="text-ink-3">·</span>
        <span className="font-medium text-ink truncate max-w-[240px] sm:max-w-md">
          {campaign.title}
        </span>
      </div>

      {/* 4 Step Nodes */}
      <div className="flex items-center gap-4 sm:gap-6">
        {steps.map((st, idx) => {
          const isDone = st.number < currentStep;
          const isCurrent = st.number === currentStep;
          const isFuture = st.number > currentStep;
          const isClickable = st.number <= Math.max(currentStep, campaign.step || 1);

          return (
            <React.Fragment key={st.id}>
              <button
                type="button"
                onClick={() => {
                  if (isClickable && onSelectStep) onSelectStep(st.number);
                }}
                disabled={!isClickable}
                className={`flex items-center gap-2 focus:outline-none ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                title={isFuture && !isClickable ? st.lockedReason : `${st.name} step`}
              >
                {/* Node icon */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold transition-all ${
                    isDone
                      ? 'bg-ink text-surface'
                      : isCurrent
                      ? 'border-2 border-ink bg-surface text-ink ring-2 ring-sunken'
                      : 'border border-line-strong bg-sunken text-ink-3'
                  }`}
                >
                  {isDone ? <Check size={11} strokeWidth={2.5} /> : st.number}
                </div>

                {/* Label */}
                <span
                  className={`hidden md:inline font-medium text-[12px] ${
                    isCurrent
                      ? 'text-ink font-semibold'
                      : isDone
                      ? 'text-ink'
                      : 'text-ink-3'
                  }`}
                >
                  {st.name}
                </span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight
                  size={12}
                  className="text-ink-3 hidden sm:inline"
                  strokeWidth={1.5}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default StepRail;
