import React from 'react';

/**
 * Custom 16px Status Glyphs
 * Meets: solid disc, check cut out
 * Unverified: dashed ring, center dot (always paired with dashed outline when badge)
 * Blocked / Doesn't meet: ring, diagonal slash
 */
export function StatusGlyph({ status = 'meets', size = 16, className = '' }) {
  if (status === 'meets' || status === 'verified') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={`inline-block flex-shrink-0 text-verified ${className}`}
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M5 8.2L7 10.2L11.2 6"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (status === 'unverified') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        className={`inline-block flex-shrink-0 text-unverified ${className}`}
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="6.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="2.5 2"
        />
        <circle cx="8" cy="8" r="1.8" fill="currentColor" />
      </svg>
    );
  }

  // blocked / doesn't meet
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={`inline-block flex-shrink-0 text-blocked ${className}`}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.8" stroke="currentColor" strokeWidth="1.4" />
      <line
        x1="4"
        y1="4"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Status Tag: Pill with glyph + word.
 * "Status color never travels alone. Always glyph plus word."
 * "Pills are used only for status tags and switches, so a pill always means state."
 */
export function StatusTag({ status = 'meets', label = null, className = '' }) {
  let text = label;
  let bgClass = 'bg-[#E2F3E9] text-verified border border-[#14794A]/20';

  if (status === 'meets' || status === 'verified') {
    text = text || 'Verified';
    bgClass = 'bg-[#E2F3E9] text-verified border border-transparent';
  } else if (status === 'unverified') {
    text = text || 'Unverified';
    // spec: Unverified is always with a dashed outline
    bgClass = 'bg-[#FBEFD6] text-unverified border border-dashed border-[#94590A]/40';
  } else {
    text = text || "Doesn't meet";
    bgClass = 'bg-[#FBE5E0] text-blocked border border-transparent';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono tracking-wide font-medium ${bgClass} ${className}`}
    >
      <StatusGlyph status={status} size={12} />
      <span>{text}</span>
    </span>
  );
}
