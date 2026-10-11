import React from 'react';

/**
 * Registration Mark: 12px Cobalt dot centered inside four crop-mark corners (1.5px Ink lines, 6px long, 28px square)
 */
export function RegistrationMark({ size = 28, dotSize = 12 }) {
  const lineColor = '#14130F';
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
        <path d="M2 8V2H8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
        <path d="M20 2H26V8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
        <path d="M2 20V26H8" stroke={lineColor} strokeWidth="1.5" strokeLinecap="square" />
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
 */
export function ColophonLockup({ onClick, className = '', title = 'CreatorConnect AI' }: { onClick?: () => void; className?: string; title?: string }) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center flex-row gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <RegistrationMark size={28} />
      <span className="font-display text-2xl tracking-[-0.01em] leading-none text-ink">
        {title}
      </span>
    </div>
  );
}
