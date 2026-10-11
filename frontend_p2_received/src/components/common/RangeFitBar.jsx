import React from 'react';
import { formatRupees } from '../../utils/formatters';

/**
 * Range-fit bar:
 * Budget fit at a glance: an 8px track, the creator's price range as an Ink bar,
 * the brand's budget as a Cobalt tick with a mono caption.
 * Tick inside the bar means Meets. Outside, the gap turns blocked-red with the exact difference.
 */
export function RangeFitBar({
  minPrice = 45000,
  maxPrice = 75000,
  budget = 60000,
  scaleMax = 120000,
  className = '',
}) {
  const minPercent = Math.min(100, Math.max(0, (minPrice / scaleMax) * 100));
  const maxPercent = Math.min(100, Math.max(0, (maxPrice / scaleMax) * 100));
  const budgetPercent = Math.min(100, Math.max(0, (budget / scaleMax) * 100));

  const isOverBudget = minPrice > budget;
  const isUnderBudget = budget > maxPrice;
  const isWithin = !isOverBudget && !isUnderBudget;
  const diffOver = minPrice - budget;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Visual Track */}
      <div className="relative w-full h-2 bg-sunken rounded-full overflow-hidden">
        {/* Creator price range bar */}
        <div
          className="absolute top-0 bottom-0 bg-ink rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(4, maxPercent - minPercent)}%`,
          }}
        />

        {/* If over budget, the blocked gap in red */}
        {isOverBudget && (
          <div
            className="absolute top-0 bottom-0 bg-blocked/40"
            style={{
              left: `${budgetPercent}%`,
              width: `${Math.max(2, minPercent - budgetPercent)}%`,
            }}
          />
        )}
      </div>

      {/* Indicator & Label Row */}
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-3">
        <div className="flex items-center gap-1.5">
          <span className="text-ink font-medium">
            {formatRupees(minPrice)} – {formatRupees(maxPrice)}
          </span>
          <span className="text-[10px]">CREATOR RANGE</span>
        </div>

        <div className="flex items-center gap-1">
          {isOverBudget ? (
            <span className="text-blocked font-medium">
              Over by {formatRupees(diffOver)}
            </span>
          ) : isWithin ? (
            <span className="text-verified font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt inline-block" />
              Budget meets ({formatRupees(budget)})
            </span>
          ) : (
            <span className="text-verified font-medium">
              Well within budget
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
