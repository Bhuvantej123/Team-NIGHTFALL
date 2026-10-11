/**
 * Provenance Layer Types and Helpers
 * Truth rule: Every metric shows where it came from, and simulated data can NEVER display as verified.
 * Four states:
 * - 'simulated': from the fictional dataset (dashed outline)
 * - 'declared': stated by a person, not independently verified (dashed outline)
 * - 'verified': from a connected source (none connected in prototype; never rendered as verified)
 * - 'missing': dashed empty frame with reason
 */

export const PROVENANCE_STATUSES = {
  SIMULATED: 'simulated',
  DECLARED: 'declared',
  VERIFIED: 'verified',
  MISSING: 'missing',
};

export function getProvenanceLabel(status, asOf, note) {
  const dateStr = asOf ? ` · UPDATED ${asOf.toUpperCase()}` : '';
  switch (status) {
    case 'simulated':
      return `SIMULATED DEMO DATA${dateStr}`;
    case 'declared':
      return `DECLARED BY CREATOR · NOT INDEPENDENTLY VERIFIED${dateStr}`;
    case 'verified':
      // The verified state exists in the design system for product completeness,
      // but in this prototype no real external APIs are connected, so it is never rendered.
      return `INDEPENDENTLY VERIFIED${dateStr}`;
    case 'missing':
    default:
      return note ? `NOT DECLARED · ${note.toUpperCase()}` : 'NOT DECLARED';
  }
}
