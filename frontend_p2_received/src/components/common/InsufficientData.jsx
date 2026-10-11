import React from 'react';
import { CropMarks } from './CropMarks';

/**
 * InsufficientData Component
 * Dashed crop-marked frame with a one-line reason.
 * Unknown is a state, not an error.
 */
export function InsufficientData({
  reason = 'Data not declared or insufficient sample',
  minHeight = '64px',
  className = '',
}) {
  return (
    <div
      style={{ minHeight }}
      className={`relative rounded-ctl border border-dashed border-line-strong bg-sunken/40 flex items-center justify-center p-3 text-center ${className}`}
    >
      <CropMarks active={true} offset={4} length={8} />
      <span className="font-mono text-[11px] text-ink-3 uppercase tracking-wider">
        {reason}
      </span>
    </div>
  );
}
