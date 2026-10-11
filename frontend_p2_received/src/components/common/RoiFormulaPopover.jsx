import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { formatRupees } from '../../utils/formatters';

/**
 * RoiFormulaPopover
 * Displays exact arithmetic formula for computed ROI:
 * ROI = (Attributable Revenue − Campaign Spend) ÷ Campaign Spend
 */
export function RoiFormulaPopover({
  revenue,
  spend,
  roiFormatted,
  className = '',
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        title="View formula & arithmetic verification"
        className="inline-flex items-center gap-1 font-mono text-[10px] text-cobalt hover:underline cursor-pointer select-none"
      >
        <span>[Formula]</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 bottom-full mb-2 z-50 w-72 p-3 bg-surface rounded-ctl border border-line shadow-float text-[11px] font-ui space-y-2 text-ink text-left animate-in fade-in duration-100"
          >
            <div className="flex items-center justify-between border-b border-line pb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3 font-semibold">
                ARITHMETIC VERIFICATION
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-3 hover:text-ink cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            <div className="font-mono text-[10px] bg-sunken p-2 rounded-[4px] space-y-1">
              <div className="text-ink-3 text-[9px]">FORMULA:</div>
              <div className="text-ink font-semibold">
                ROI = (Attributable Revenue − Spend) ÷ Spend
              </div>
            </div>

            <div className="font-mono text-[10px] space-y-0.5 text-ink-2">
              <div>Attributable Revenue: {formatRupees(revenue)}</div>
              <div>Campaign Spend: {formatRupees(spend)}</div>
              <div className="pt-1 text-ink font-semibold border-t border-line/60">
                Computed ROI: {roiFormatted}
              </div>
            </div>

            <p className="text-[10px] text-ink-3 leading-normal border-t border-line/60 pt-1">
              Attributed during flight period. Not an algorithmic projection.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
