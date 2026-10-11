/**
 * frontend/src/lib/roi.ts
 * ROI calculation helper.
 * Formula: ROI = (Attributable Revenue − Spend) ÷ Spend
 */

export interface RoiSuccess {
  insufficient: false;
  roi: number;
  formatted: string;
  positive: boolean;
  formula: string;
}

export interface RoiInsufficient {
  insufficient: true;
  reason: string;
}

export type RoiResult = RoiSuccess | RoiInsufficient;

export function computeRoi(
  revenue: number | null | undefined,
  spend: number | null | undefined
): RoiResult {
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
    formula: `(${revenue.toLocaleString('en-US')} - ${spend.toLocaleString('en-US')}) ÷ ${spend.toLocaleString('en-US')}`,
  };
}
