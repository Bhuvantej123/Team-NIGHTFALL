/**
 * ROI Calculation Helper
 * Formula: ROI = (Attributable Revenue − Spend) ÷ Spend
 *
 * Requirements:
 * - Pure function returning either { value, formatted, positive } or { insufficient: true, reason: string }
 * - Insufficient if revenue is missing/null/undefined or spend is not positive.
 */
export function computeRoi(revenue, spend) {
  if (revenue === null || revenue === undefined) {
    return {
      insufficient: true,
      reason: 'Attributable revenue not declared or tracked',
    };
  }

  if (typeof spend !== 'number' || spend <= 0) {
    return {
      insufficient: true,
      reason: 'Spend baseline must be positive to compute ROI',
    };
  }

  const roi = (revenue - spend) / spend;
  const percentage = (roi * 100).toFixed(1);
  const formatted = `${roi >= 0 ? '+' : ''}${percentage}% (${roi.toFixed(2)}x)`;

  return {
    insufficient: false,
    roi,
    formatted,
    positive: roi >= 0,
    formula: `(${revenue.toLocaleString('en-IN')} - ${spend.toLocaleString('en-IN')}) ÷ ${spend.toLocaleString('en-IN')}`,
  };
}
