import React from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Sticky bottom demo helper bar:
 * Reset shortcut indicator, Honesty disclaimer.
 */
export function DemoFooter({ onResetData }) {
  return (
    <footer className="w-full bg-paper border-t border-line py-3 select-none">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-ink-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-verified inline-block" />
          <span className="uppercase tracking-wider">
            DEMO DATA · CREATORS AND WORKS ARE FICTIONAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Reset shortcut */}
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 hover:text-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ink rounded-[2px] cursor-pointer"
            title="Press Shift+R anytime to reset application state"
          >
            <RotateCcw size={12} strokeWidth={1.5} />
            <span>RESET SEED (SHIFT+R)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
