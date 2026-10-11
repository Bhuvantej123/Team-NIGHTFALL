import React from 'react';

/**
 * Sparkline Component
 * Inline SVG polyline, 1.5px Ink stroke, last-point dot, no fill, no gradient.
 * Accessible aria-label summarizing first and last values.
 */
export function Sparkline({
  data = [],
  width = 120,
  height = 28,
  ariaLabel = 'Metric trend sparkline',
  className = '',
  color = '#14130F',
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Add padding around polyline so dots are not clipped
  const padX = 4;
  const padY = 4;
  const drawWidth = width - padX * 2;
  const drawHeight = height - padY * 2;

  const points = data
    .map((val, idx) => {
      const x = padX + (idx / (data.length - 1)) * drawWidth;
      const y = height - padY - ((val - min) / range) * drawHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastVal = data[data.length - 1];
  const lastX = padX + drawWidth;
  const lastY = height - padY - ((lastVal - min) / range) * drawHeight;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible inline-block ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Last-point dot */}
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}
