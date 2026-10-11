/**
 * frontend/src/types/provenance.ts
 * Provenance statuses and label generators.
 */

export const PROVENANCE_STATUSES = {
  SIMULATED: 'simulated',
  DECLARED: 'declared',
  VERIFIED: 'verified',
  MISSING: 'missing',
} as const;

export type ProvenanceStatus =
  | 'simulated'
  | 'declared'
  | 'verified'
  | 'missing';

export function getProvenanceLabel(
  status: string,
  asOf?: string,
  note?: string
): string {
  const dateStr = asOf ? ` · UPDATED ${asOf.toUpperCase()}` : '';
  switch (status) {
    case 'simulated':
      return `SIMULATED DEMO DATA${dateStr}`;
    case 'declared':
      return `DECLARED BY CREATOR · NOT INDEPENDENTLY VERIFIED${dateStr}`;
    case 'verified':
      return `INDEPENDENTLY VERIFIED${dateStr}`;
    case 'missing':
    default:
      return note ? `NOT DECLARED · ${note.toUpperCase()}` : 'NOT DECLARED';
  }
}
