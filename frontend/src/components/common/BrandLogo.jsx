import React from 'react';

/**
 * Registration Mark: 12px Cobalt dot centered inside four crop-mark corners (1.5px Ink lines, 6px long, 28px square)
 */
export function RegistrationMark({ size = 28, dotSize = 12, dark = false }) {
  const lineColor = dark ? '#F1EFE9' : '#14130F';
  const scale = size / 28;

  return (
    <div
      className="relative flex items-center justify-center select-none flex-shrink-0"
      style={{ width: size, height: size }}
      aria-label="colophon mark"
    >
      {/* 4 crop-mark corners, 6px long, 1.5px stroke */}
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
      >
        {/* TL */}
        <path d="M2 8V2H8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
        {/* TR */}
        <path d="M20 2H26V8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
        {/* BL */}
        <path d="M2 20V26H8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
        {/* BR */}
        <path d="M20 26H26V20" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      {/* Centered Cobalt Dot */}
      <div
        className="rounded-full bg-cobalt"
        style={{ width: dotSize * scale, height: dotSize * scale }}
      />
    </div>
  );
}

/**
 * Colophon Logo Lockup
 * Horizontal for nav (mark, 8px gap, wordmark)
 * Stacked for welcome
 */
export function ColophonLockup({ layout = 'horizontal', dark = false, onClick, className = '', title = 'CreatorConnect AI' }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${
        layout === 'stacked' ? 'flex-col gap-3 text-center' : 'flex-row gap-2.5'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <RegistrationMark size={layout === 'stacked' ? 36 : 28} dark={dark} />
      <span
        className={`font-display text-2xl tracking-[-0.01em] leading-none ${
          dark ? 'text-stage-ink' : 'text-ink'
        }`}
      >
        {title}
      </span>
    </div>
  );
}
