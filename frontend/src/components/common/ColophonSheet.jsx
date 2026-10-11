import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownToLine } from 'lucide-react';
import { StatusGlyph } from './StatusGlyph';
import { ToolMark } from './ToolMark';
import { WorkflowStrip } from './WorkflowStrip';

/**
 * Colophon Sheet:
 * 520px slide-over typeset like the back page of a book.
 * Serif title, mono labels, 24px between groups, nothing boxed.
 */
export function ColophonSheet({ isOpen, onClose, work, creator, onSelectCreator, dark = false }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !work) return null;

  const involvementLevel = work.humanInvolvementLevel || 4; // 1 to 5
  const involvementLabels = [
    'Prompted (Zero touch)',
    'Prompted & Curated',
    'Inpainted & Edited',
    'Hybrid (Composited & Retouched)',
    'Hand-finished (Full Human Post)',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#14130F]/28"
          aria-hidden="true"
        />

        {/* 520px Slide-over with radius 28 on left corners */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 380 }}
          className={`relative w-full max-w-[520px] h-full shadow-float z-10 flex flex-col rounded-l-[28px] overflow-hidden ${
            dark ? 'bg-stage-raised text-stage-ink border-l border-stage-line' : 'bg-surface text-ink border-l border-line'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-line">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3">
                COLOPHON SHEET · RECORD {work.id || 'W-084'}
              </span>
              <h2 className="font-display text-2xl mt-0.5 text-ink leading-tight">
                {work.title || 'Untitled Deliverable'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-ctl text-ink-2 hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
              aria-label="Close sheet"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Book Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Creator Attribution */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 block mb-1">
                CREATOR & ORIGIN
              </span>
              <div
                onClick={() => {
                  if (onSelectCreator) onSelectCreator(creator || { name: work.creatorName, avatar: work.imageUrl });
                }}
                className="flex items-center justify-between p-2.5 -mx-2.5 rounded-ctl hover:bg-sunken border border-transparent hover:border-line transition-all cursor-pointer group/author"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 group-hover/author:border-cobalt transition-colors shadow-2xs">
                    <img
                      src={creator?.avatar || work.imageUrl}
                      alt={creator?.name || 'Creator'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-ink text-[15px] group-hover/author:text-cobalt transition-colors">
                      {creator?.name || work.creatorName || 'Creator'}
                    </div>
                    <div className="text-ink-2 text-[12px]">
                      {creator?.role || 'AI Artist'} · {creator?.location || 'Global'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5 font-mono text-[10px]">
                  {creator?.channel?.firstLastFollowers?.last ? (
                    <span className="font-semibold text-ink bg-surface px-2 py-0.5 rounded-[3px] border border-line flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                      {creator.channel.firstLastFollowers.last.split(' ')[0]} Followers
                    </span>
                  ) : (
                    <span className="font-semibold text-ink bg-surface px-2 py-0.5 rounded-[3px] border border-line">
                      Active Creator
                    </span>
                  )}
                  <span className="text-cobalt text-[9.5px] uppercase font-semibold">
                    {creator?.formats?.join(' · ') || 'Reels 9:16 · Photoshoots 4:5'}
                  </span>
                </div>
              </div>
            </div>

            {/* Made with (Tools & Model Versions) */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 block mb-2">
                MADE WITH (MODELS & PIPELINE)
              </span>
              <div className="space-y-2">
                {(work.toolsWithVersions || [
                  { name: 'Midjourney', version: 'Latest', role: 'Base visual generation' },
                  { name: 'ComfyUI', version: 'Workflow Nodes', role: 'Composition guidance' },
                  { name: 'Adobe Photoshop', version: 'Creative Suite', role: 'Manual retouching & typography' },
                ]).map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-[13px] py-1 border-b border-line/60">
                    <div className="flex items-center gap-2">
                      <ToolMark name={t.name} />
                      <span className="font-medium text-ink">{t.name}</span>
                      <span className="font-mono text-[11px] text-ink-3">({t.version})</span>
                    </div>
                    <span className="text-[12px] text-ink-2">{t.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow strip */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 block mb-2">
                WORKFLOW CHAIN
              </span>
              <WorkflowStrip steps={work.workflowSteps} />
            </div>

            {/* Human involvement: 5-segment meter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3">
                  HUMAN INVOLVEMENT (5-SEGMENT METER)
                </span>
                <span className="font-mono text-[11px] text-ink font-medium">
                  LEVEL {involvementLevel} / 5
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-2 rounded-[2px] transition-colors ${
                      lvl <= involvementLevel ? 'bg-ink' : 'bg-sunken border border-line'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[13px] text-ink-2">
                <span className="font-medium text-ink">
                  {involvementLabels[involvementLevel - 1]}
                </span>
                : Direct manual guidance and localized human retouching applied before delivery.
              </p>
            </div>

            {/* Rights & Licensing */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-ink-3 block mb-2">
                COMMERCIAL RIGHTS & PROVENANCE
              </span>
              <div className="space-y-2 text-[13px]">
                <div className="flex items-start gap-2">
                  <StatusGlyph status={work.rightsVerification || 'verified'} size={15} className="mt-0.5" />
                  <div>
                    <span className="font-medium text-ink">Commercial Usage Cleared</span>
                    <p className="text-ink-2 text-[12px] mt-0.5 leading-relaxed">
                      Models declared carry active enterprise tier terms permitting commercial deliverables.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[12px] text-ink-3 font-mono">
                  THIRD-PARTY ASSETS: Clean commercial license declared.
                </div>
              </div>
            </div>

            {/* Declaration & Verification Footer */}
            <div className="pt-4 border-t border-line">
              <div className="font-mono text-[10px] uppercase tracking-[0.05em] text-ink-3 leading-relaxed">
                DECLARED BY CREATOR · VERSION 1.0
              </div>
              <div className="font-mono text-[11px] font-semibold text-ink-2 mt-1 tracking-[0.04em]">
                SELF-DECLARED. NOT INDEPENDENTLY VERIFIED.
              </div>
            </div>
          </div>

          {/* Sticky footer */}
          <div className="p-6 border-t border-line bg-paper/50 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-ctl bg-cobalt text-white text-[13px] font-medium hover:bg-cobalt-press transition-colors cursor-pointer"
            >
              Done reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
