import React, { useState } from 'react';
import { getProvenanceLabel } from '../../types/provenance';
import { HowWeLabelDataModal } from './HowWeLabelDataModal';

/**
 * ProvenanceTag
 * Mono 11px caps.
 * Defaults unknown status to 'missing'.
 * Clicking opens the "How we label data" modal.
 */
export function ProvenanceTag({
  status = 'missing',
  asOf,
  note,
  className = '',
}) {
  const [showModal, setShowModal] = useState(false);

  const isVerified = status === 'verified';
  const isDeclared = status === 'declared';
  const isSimulated = status === 'simulated';

  const label = getProvenanceLabel(status, asOf, note);

  let styleClasses = 'border-dashed border-line-strong bg-sunken/40 text-ink-3';
  if (isSimulated) {
    styleClasses = 'border-dashed border-[#D4CEBF] bg-[#F7F5F0] text-ink-3';
  } else if (isDeclared) {
    styleClasses = 'border-dashed border-unverified/40 bg-unverified-wash/30 text-unverified';
  } else if (isVerified) {
    styleClasses = 'border-solid border-verified bg-verified-wash text-verified';
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        title="Click to view data provenance rules and legend"
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border font-mono text-[10px] tracking-wider uppercase font-medium hover:border-ink transition-colors cursor-pointer select-none ${styleClasses} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block bg-current opacity-70" />
        <span>{label}</span>
      </button>

      {showModal && (
        <HowWeLabelDataModal
          activeStatus={status}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
