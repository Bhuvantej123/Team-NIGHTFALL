import React from 'react';

/**
 * 3-segment meter with fit label (Strong, Good, Partial)
 */
export function FitMeter({ level = 'Strong', className = '' }) {
  let solidCount = 3;
  let textColor = 'text-ink';

  if (level === 'Strong') {
    solidCount = 3;
  } else if (level === 'Good') {
    solidCount = 2;
  } else {
    solidCount = 1;
    textColor = 'text-unverified';
  }

  return (
    <div className={`inline-flex items-center gap-2 flex-shrink-0 whitespace-nowrap ${className}`}>
      {/* 3-segment meter */}
      <div className="flex items-center gap-1 flex-shrink-0" aria-label={`Fit level: ${level}`}>
        {[1, 2, 3].map((seg) => {
          const isSolid = seg <= solidCount;
          return (
            <div
              key={seg}
              className={`w-3 h-1.5 rounded-[1px] transition-colors ${
                isSolid
                  ? 'bg-ink border border-ink'
                  : 'bg-transparent border border-line-strong'
              }`}
            />
          );
        })}
      </div>
      <span className={`font-mono text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap ${textColor}`}>
        {level} Fit
      </span>
    </div>
  );
}

/**
 * Criterion track: thin track with a dot, a one-word verdict and one line of evidence.
 */
export function CriterionTrack({ name, verdict, evidence, score, weight }) {
  return (
    <div className="group/crit py-2 border-b border-line/60">
      <div className="flex items-center justify-between text-[13px] mb-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink">{name}</span>
          <span className="font-mono text-[10px] text-ink-3">({weight})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink text-[12px]">{verdict}</span>
          <span className="opacity-0 group-hover/crit:opacity-100 font-mono text-[11px] text-ink-3 transition-opacity">
            {score}/100
          </span>
        </div>
      </div>
      <div className="relative w-full h-1 bg-sunken rounded-full overflow-hidden mb-1.5">
        <div
          className="absolute top-0 bottom-0 left-0 bg-ink rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-[12px] text-ink-2 leading-relaxed">{evidence}</p>
    </div>
  );
}
