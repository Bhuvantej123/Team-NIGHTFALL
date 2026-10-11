import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Film,
  Layers,
  TrendingUp,
  ArrowRight,
  Check,
  Plus,
} from 'lucide-react';
import { ToolMark } from './ToolMark';
import { formatRupees } from '../../utils/formatters';

/**
 * CreatorSheet:
 * 520px slide-over drawer showing follower count, deliverable formats
 * (reels, photoshoots, 3D CGI), bio, turnaround, pricing, and sample works.
 * Adheres strictly to the Colophon design system (Paper #F4F2ED, Ink #14130F, Cobalt #1447FF).
 */
export function CreatorSheet({
  isOpen,
  onClose,
  creator,
  onViewFullProfile,
  onOpenColophon,
  isShortlisted = false,
  onToggleShortlist,
  dark = false,
}) {
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

  if (!isOpen || !creator) return null;

  const followersCount =
    creator.channel?.firstLastFollowers?.last?.split(' ')?.[0] || '140K';
  const platform = creator.channel?.platform || 'Instagram';
  const handle = creator.channel?.handle || `@${creator.slug || 'creator'}`;
  const trendSentence =
    creator.channel?.trendSentence || 'Followers up 14% since April';

  // Format deliverable items
  const deliverables = [
    {
      title: 'Commercial Photoshoot (4:5 Stills)',
      format: 'Stills 4:5',
      icon: Camera,
      desc: 'High-resolution hero product stills, directional studio illumination, and tactile material physics.',
    },
    {
      title: 'Short-Form Reels (9:16 Vertical)',
      format: 'Reels 9:16',
      icon: Film,
      desc: 'Seamless loop video motion CGI optimized for high-retention social feeds.',
    },
    {
      title: 'Generative 3D Modeling & CGI',
      format: 'Blender & ComfyUI',
      icon: Layers,
      desc: 'Custom geometry nodes and ControlNet workflows for strict brand silhouette adherence.',
    },
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

        {/* 520px Slide-over with Colophon Paper finish */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 34, stiffness: 380 }}
          className={`relative w-full max-w-[520px] h-full shadow-float z-10 flex flex-col rounded-l-[28px] overflow-hidden ${
            dark
              ? 'bg-stage-raised text-stage-ink border-l border-stage-line'
              : 'bg-surface text-ink border-l border-line'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 pt-7 pb-5 border-b border-line">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 shadow-2xs">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.05em] text-verified font-semibold bg-verified/10 px-2 py-0.5 rounded-[3px] border border-verified/20">
                    {platform} Verified
                  </span>
                  <span className="font-mono text-[11px] text-ink-3">
                    {handle}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-ink leading-tight mt-0.5">
                  {creator.name}
                </h2>
                <div className="text-[12px] text-ink-2 font-mono">
                  {creator.location || 'Remote'} · {creator.family || 'neo-product'}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-ctl text-ink-2 hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
              aria-label="Close sheet"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7">
            {/* Key Numbers Strip */}
            <div className="p-4 rounded-card bg-sunken border border-line space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {/* Followers */}
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
                    FOLLOWERS
                  </span>
                  <div className="font-display text-2xl text-ink font-semibold tnum">
                    {followersCount}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-verified font-mono font-medium">
                    <TrendingUp size={11} strokeWidth={2} />
                    <span>active audience</span>
                  </div>
                </div>

                {/* Avg Engagement / Views */}
                <div className="space-y-0.5 border-l border-line pl-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
                    ENGAGEMENT
                  </span>
                  <div className="font-display text-2xl text-ink font-semibold tnum">
                    {creator.channel?.engagementSeries?.[5] || 5.1}%
                  </div>
                  <span className="text-[10px] text-ink-3 font-mono block">
                    High retention
                  </span>
                </div>

                {/* Turnaround & Pricing */}
                <div className="space-y-0.5 border-l border-line pl-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
                    STARTING AT
                  </span>
                  <div className="font-display text-2xl text-ink font-semibold tnum">
                    {formatRupees(creator.minPrice, creator.currency)}
                  </div>
                  <span className="text-[10px] text-ink-3 font-mono block">
                    {creator.turnaround || '3-5 days'} delivery
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-line/60 flex items-center justify-between font-mono text-[11px] text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                  {trendSentence}
                </span>
                <span className="text-ink-3 text-[10px]">
                  PLATFORM AUDIT
                </span>
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3 font-semibold">
                  WHAT {creator.name.toUpperCase()} CREATES
                </span>
                <span className="font-mono text-[10px] text-ink uppercase font-semibold">
                  AVAILABLE DELIVERABLES
                </span>
              </div>

              <div className="space-y-2.5">
                {deliverables.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-ctl bg-surface border border-line hover:border-line-strong transition-all flex items-start gap-3.5"
                    >
                      <div className="p-2 rounded-ctl bg-sunken border border-line text-ink flex-shrink-0 mt-0.5">
                        <Icon size={16} strokeWidth={1.7} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-ui font-semibold text-[13px] text-ink">
                            {item.title}
                          </h4>
                          <span className="font-mono text-[10px] bg-sunken px-1.5 py-0.5 rounded-[3px] border border-line text-ink-2">
                            {item.format}
                          </span>
                        </div>
                        <p className="text-[12px] text-ink-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3 font-semibold block">
                CREATIVE DIRECTION & BIO
              </span>
              <p className="text-[13px] text-ink-2 leading-relaxed bg-surface p-3.5 rounded-ctl border border-line">
                {creator.bio}
              </p>
            </div>

            {/* Tool Chain */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3 font-semibold block">
                TOOL CHAIN & PIPELINE
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {(creator.tools || ['Midjourney', 'Runway']).map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-ctl bg-surface border border-line text-[12px] font-mono text-ink"
                  >
                    <ToolMark name={tool} />
                    <span>{tool}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Portfolio Works */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3 font-semibold">
                  PORTFOLIO WORKS ({creator.portfolio?.length || 0})
                </span>
                <span className="font-mono text-[10px] text-ink-3">
                  COMMERCIAL USE CLEARED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(creator.portfolio || []).slice(0, 4).map((work) => (
                  <div
                    key={work.id}
                    onClick={() => {
                      if (onOpenColophon) onOpenColophon(work, creator);
                    }}
                    className="group relative rounded-ctl overflow-hidden bg-sunken border border-line cursor-pointer aspect-[4/5]"
                  >
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent text-white space-y-0.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-white/80 block">
                        {work.humanInvolvementText || 'PHOTOSHOOT'}
                      </span>
                      <p className="text-[11px] font-medium leading-tight truncate">
                        {work.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-line bg-surface flex items-center gap-3">
            <button
              onClick={() => {
                onClose?.();
                onViewFullProfile?.(creator);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-ctl bg-ink hover:bg-ink/85 text-surface font-medium text-[13px] transition-colors shadow-sm cursor-pointer"
            >
              <span>View Full Profile & Analytics</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>

            {onToggleShortlist && (
              <button
                onClick={() => onToggleShortlist(creator.id)}
                className={`px-4 py-3 rounded-ctl font-mono text-[12px] uppercase font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isShortlisted
                    ? 'bg-verified/10 text-verified border border-verified/30'
                    : 'bg-surface border border-line-strong hover:border-ink text-ink'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check size={14} strokeWidth={2} />
                    <span>Shortlisted</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={2} />
                    <span>Shortlist</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CreatorSheet;
