import React from 'react';
import { getToolMark } from '../../utils/formatters';

/**
 * 20px rounded square tool monogram with hairline border
 */
export function ToolMark({ name, className = '', dark = false }) {
  const mark = getToolMark(name);

  return (
    <span
      title={name}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] font-mono text-[9.5px] font-semibold tracking-tight transition-colors select-none ${
        dark
          ? 'bg-stage-raised border border-stage-line text-stage-ink'
          : 'bg-surface border border-line text-ink'
      } ${className}`}
    >
      {mark}
    </span>
  );
}
