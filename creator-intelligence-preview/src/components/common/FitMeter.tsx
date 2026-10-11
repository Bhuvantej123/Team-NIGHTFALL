import React from 'react';

/**
 * 3-segment meter with fit label (Strong, Good, Partial)
 */
export function FitMeter({ level = 'Strong', className = '' }: { level?: string; className?: string }) {
  let solidCount = 3;
  let textColor = 'text-ink';

  if (level === 'Strong' || level === 'Outstanding') {
    solidCount = 3;
  } else if (level === 'Good' || level === 'Competitive') {
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
