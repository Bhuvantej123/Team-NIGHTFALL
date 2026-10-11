import React from 'react';
import { StatusGlyph } from './StatusGlyph';
import { ToolMark } from './ToolMark';

/**
 * Museum wall label credit line under every piece of work
 * Clicking opens the Colophon sheet
 */
export function CreditLine({
  work,
  creator,
  onOpenColophon,
  dark = false,
  className = '',
}) {
  const tools = work?.tools || ['Midjourney V7', 'Photoshop'];
  const humanInvolvement = work?.humanInvolvementText || 'HUMAN-EDITED';
  const rightsStatus = work?.rightsStatus || 'COMMERCIAL USE DECLARED';
  const verification = work?.verification || 'verified';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onOpenColophon) onOpenColophon(work, creator);
      }}
      className={`text-left group/credit flex items-center flex-wrap gap-x-1.5 gap-y-1 font-mono text-[11px] leading-[16px] tracking-[0.04em] uppercase transition-colors select-none ${
        dark
          ? 'text-stage-ink hover:text-white'
          : 'text-ink-2 hover:text-ink'
      } ${className}`}
      title="Click to view Colophon sheet"
    >
      {/* Primary tool mark icon */}
      {tools[0] && (
        <ToolMark
          name={tools[0]}
          dark={dark}
          className="mr-0.5 group-hover/credit:border-cobalt"
        />
      )}

      {/* Tool names & middle dots */}
      <span className="font-medium underline-offset-2 group-hover/credit:underline">
        {tools.join(' · ')}
      </span>

      <span className={dark ? 'text-stage-ink-2' : 'text-ink-3'}>·</span>

      <span>{humanInvolvement}</span>

      <span className={dark ? 'text-stage-ink-2' : 'text-ink-3'}>·</span>

      <span className="inline-flex items-center gap-1 font-semibold">
        {rightsStatus}
        <StatusGlyph status={verification} size={11} className="inline ml-0.5" />
      </span>
    </button>
  );
}
