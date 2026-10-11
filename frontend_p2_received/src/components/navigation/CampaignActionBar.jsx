import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

/**
 * Clean, docked decision bar merged seamlessly with the Paper theme:
 * - Solid Paper background (`bg-paper border-t border-line`)
 * - ZERO glassmorphism, ZERO backdrop-blur, ZERO floating dropshadow
 * - Integrated demo status & reset shortcut
 * - Never produces double scrollbars
 */
export function CampaignActionBar({
  backLabel = 'Back',
  onBack,
  forwardLabel = 'Continue',
  onForward,
  isForwardDisabled = false,
  statusText = null,
  secondaryAction = null,
  onResetData = null,
  className = '',
}) {
  return (
    <div
      className={`w-full bg-paper border-t border-line px-6 py-2.5 flex items-center justify-between select-none flex-shrink-0 z-20 ${className}`}
    >
      <div className="max-w-[1360px] w-full mx-auto flex items-center justify-between gap-4">
        {/* Left: Back button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded-ctl px-2 py-1"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              <span>{backLabel}</span>
            </button>
          )}
        </div>

        {/* Center: Status summary + Demo notice merged into theme */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-ink-3">
          {statusText && <span className="hidden md:inline font-medium text-ink-2">{statusText}</span>}
          {statusText && <span className="hidden md:inline text-line-strong">·</span>}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-verified inline-block" />
            <span className="uppercase tracking-wider text-[10px]">DEMO DATA</span>
          </div>
          {onResetData && (
            <button
              onClick={onResetData}
              className="hidden lg:inline-flex items-center gap-1 hover:text-ink transition-colors text-[10px] uppercase ml-1"
              title="Reset application seed (Shift+R)"
            >
              <RotateCcw size={10} />
              <span>RESET (⇧R)</span>
            </button>
          )}
        </div>

        {/* Right: Secondary Action (Compare) + Primary Cobalt Button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {secondaryAction}

          <button
            onClick={onForward}
            disabled={isForwardDisabled}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-ctl font-medium text-[13px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt ${
              isForwardDisabled
                ? 'bg-sunken text-ink-3 cursor-not-allowed border border-line'
                : 'bg-cobalt hover:bg-cobalt-press text-white shadow-sm'
            }`}
          >
            <span>{forwardLabel}</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
