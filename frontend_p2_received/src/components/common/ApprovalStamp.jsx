import React from 'react';
import { motion } from 'framer-motion';
import { CropMarks } from './CropMarks';

/**
 * Record Approval Stamp:
 * Bordered mono tag with crop marks, settling from 1.06 to 1 scale in 180ms.
 * No confetti, no rotation. It is a record, not a sticker.
 */
export function ApprovalStamp({ date = '12 OCT 2026', className = '' }) {
  return (
    <motion.div
      initial={{ scale: 1.06, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      className={`relative inline-flex items-center px-3 py-1 bg-surface border border-ink text-ink font-mono text-[11px] uppercase tracking-[0.08em] font-semibold select-none ${className}`}
    >
      <CropMarks active={true} offset={3} length={6} strokeWidth={1.5} />
      <span>APPROVED · {date}</span>
    </motion.div>
  );
}
