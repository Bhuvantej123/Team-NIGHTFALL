import React from 'react';
import { ProvenanceTag } from './ProvenanceTag';
import { InsufficientData } from './InsufficientData';

/**
 * MetricBlock Component
 * Requires a provenance prop: { status, asOf, note, source }.
 * You cannot render a metric block without declaring its source.
 * If data is absent, renders InsufficientData with reason.
 */
export function MetricBlock({
  title,
  value,
  subtext,
  provenance, // Required: { status: 'simulated' | 'declared' | 'verified' | 'missing', asOf?: string, note?: string }
  children,
  className = '',
}) {
  // If provenance is not passed, default to 'missing'
  const safeProvenance = provenance || { status: 'missing', note: 'No provenance declared' };

  return (
    <div className={`p-4 bg-surface rounded-card border border-line shadow-2xs space-y-2.5 ${className}`}>
      {/* Title & Provenance Tag Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-line/60 pb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
          {title}
        </span>
        <ProvenanceTag
          status={safeProvenance.status}
          asOf={safeProvenance.asOf}
          note={safeProvenance.note}
          source={safeProvenance.source}
        />
      </div>

      {/* Main Content */}
      {value !== undefined && value !== null ? (
        <div className="space-y-1">
          <div className="font-mono text-2xl font-bold text-ink tnum">
            {value}
          </div>
          {subtext && (
            <div className="text-[12px] text-ink-2 leading-relaxed">
              {subtext}
            </div>
          )}
        </div>
      ) : null}

      {children}
    </div>
  );
}
