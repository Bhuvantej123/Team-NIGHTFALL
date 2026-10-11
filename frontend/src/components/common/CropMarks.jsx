import React from 'react';

/**
 * Crop marks component: 4 L-shaped ticks 6px outside corners
 * Always present if 'active' or drawn on hover if 'hoverable'.
 * Turns Cobalt if 'selected'.
 */
export function CropMarks({
  active = false,
  selected = false,
  hoverable = true,
  className = '',
  offset = 6, // 6px outside corners
  length = 12, // 12px long
  strokeWidth = 1.5,
  dark = false,
}) {
  const strokeColor = selected
    ? (dark ? '#F1EFE9' : '#14130F')
    : dark
    ? '#F1EFE9'
    : '#14130F';

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-140 ${
        active
          ? 'opacity-100'
          : hoverable
          ? 'opacity-0 group-hover:opacity-100'
          : 'opacity-100'
      } ${className}`}
      style={{
        margin: `-${offset}px`,
      }}
      aria-hidden="true"
    >
      {/* Top Left */}
      <svg
        className="absolute top-0 left-0"
        width={length + 2}
        height={length + 2}
        viewBox={`0 0 ${length + 2} ${length + 2}`}
        fill="none"
      >
        <path
          d={`M0 ${length}V0H${length}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </svg>

      {/* Top Right */}
      <svg
        className="absolute top-0 right-0"
        width={length + 2}
        height={length + 2}
        viewBox={`0 0 ${length + 2} ${length + 2}`}
        fill="none"
      >
        <path
          d={`M2 0H${length + 2}V${length}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </svg>

      {/* Bottom Left */}
      <svg
        className="absolute bottom-0 left-0"
        width={length + 2}
        height={length + 2}
        viewBox={`0 0 ${length + 2} ${length + 2}`}
        fill="none"
      >
        <path
          d={`M0 2V${length + 2}H${length}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </svg>

      {/* Bottom Right */}
      <svg
        className="absolute bottom-0 right-0"
        width={length + 2}
        height={length + 2}
        viewBox={`0 0 ${length + 2} ${length + 2}`}
        fill="none"
      >
        <path
          d={`M2 ${length + 2}H${length + 2}V2`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
