import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Share2,
  Maximize2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { ToolMark } from '../common/ToolMark';
import { formatRupees, formatCurrency } from '../../utils/formatters';
import { fetchCreatorAnalytics } from '../../api/client';
import { CreatorIntelligenceSection } from '../analytics/CreatorIntelligenceSection';


/**
 * CreatorProfileScreen
 * Colophon Editorial Creator Profile (Split-Screen Inspector)
 * Exact restoration of P2 design:
 * - Left 6-col: Large portfolio specimen inspector with auto-cycling specimen progress bars,
 *   clickable left/right navigation zones, CropMarks, specimen metadata, and Inspect Spec action.
 * - Right 6-col: Creator identity, 4 key metrics (Reach, Engagement, Turnaround, Rights),
 *   toolchain chips with monograms, and selectable commission deliverable tiers (Still, Reel, Suite).
 * - Full live data binding with share link and real shortlist functionality.
 *
 * @param {{
 *   creator: any;
 *   campaign?: any;
 *   onBack?: () => void;
 *   onOpenColophon?: (work?: any, creator?: any) => void;
 *   onShortlist?: (id: string) => void;
 *   isShortlisted?: boolean;
 * }} props
 */
export function CreatorProfileScreen({
  creator,
  campaign = null,
  onBack = () => {},
  onOpenColophon = (_work, _creator) => {},
  onShortlist = null,
  isShortlisted = false,
}) {
  const [activeSpecimenIdx, setActiveSpecimenIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTier, setSelectedTier] = useState('reel');
  const [copiedLink, setCopiedLink] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!creator?.id) return;
    let isMounted = true;
    fetchCreatorAnalytics(creator.id)
      .then((data) => {
        if (isMounted) setAnalytics(data);
      })
      .catch((err) => {
        console.warn('Analytics unavailable for creator:', creator.id, err);
      });
    return () => {
      isMounted = false;
    };
  }, [creator?.id]);

  if (!creator) return null;


  // Fallback specimen list if creator has no portfolio items
  const fallbackSpecimens = [
    {
      id: 'specimen-01',
      title: 'Kevlar Monolith Sole Concept',
      imageUrl:
        creator.avatar ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
      tools: ['Blender 4.2', 'ComfyUI', 'Photoshop'],
      humanInvolvementText: 'DIRECTOR CURATED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      aspect: '4:5',
    },
    {
      id: 'specimen-02',
      title: 'Directional Raytracing Study',
      imageUrl:
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=80',
      tools: ['Midjourney V7', 'Flux.1 Pro', 'Lightroom'],
      humanInvolvementText: 'HUMAN RETOUCHED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      aspect: '9:16',
    },
    {
      id: 'specimen-03',
      title: 'Spatial Material Dispersion',
      imageUrl:
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80',
      tools: ['Octane Render', 'Photoshop', 'ComfyUI'],
      humanInvolvementText: 'HYBRID SYNTHESIS',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      aspect: '4:5',
    },
  ];

  const portfolioItems =
    creator.portfolio && creator.portfolio.length > 0
      ? creator.portfolio
      : fallbackSpecimens;

  // Auto-cycle timer
  useEffect(() => {
    if (isPaused || portfolioItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSpecimenIdx((prev) => (prev + 1) % portfolioItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [portfolioItems.length, isPaused]);

  const currentSpecimen = portfolioItems[activeSpecimenIdx] || portfolioItems[0];
  const toolList =
    creator.tools && creator.tools.length > 0
      ? creator.tools
      : ['Blender 4.2', 'ComfyUI', 'Midjourney V7', 'Adobe Photoshop'];

  const basePrice = creator.minPrice || 8500;

  const tiers = {
    still: {
      id: 'still',
      tag: 'SINGLE ASSET',
      title: 'Hero Still (4:5)',
      multiplier: 1,
      turnaround: '2-3 days',
      deliverables:
        '1x Master 4K Resolution Still (DCI-P3) + Source PSD + Perpetual Digital Rights',
      revisions: creator.revisions || 2,
    },
    reel: {
      id: 'reel',
      tag: 'VIDEO CGI',
      title: 'Kinetic Vertical Reel (9:16)',
      multiplier: 1.45,
      turnaround: creator.turnaround || '3-5 days',
      deliverables:
        '1x 15-30s 4K 60fps Motion Reel + Seamless Audio Sync + 2x Cutdowns for Stories',
      revisions: creator.revisions || 2,
    },
    suite: {
      id: 'suite',
      tag: 'COMPLETE DROP',
      title: 'Full Multi-Asset Drop Suite',
      multiplier: 2.4,
      turnaround: '6-8 days',
      deliverables:
        '3x Hero Stills (4:5) + 2x Vertical Reels (9:16) + Color Grade LUTs + Full Commercial Rights',
      revisions: (creator.revisions || 2) + 1,
    },
  };

  const activeTierConfig = tiers[selectedTier] || tiers.reel;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const followerCount =
    creator.channel?.firstLastFollowers?.last?.split(' ')?.[0] || '140K';
  const platform = creator.channel?.platform || 'Instagram';
  const engagementRate =
    creator.channel?.engagementSeries?.[
      creator.channel.engagementSeries.length - 1
    ] || '5.1';

  const formatTierPrice = (amount) => {
    if (typeof amount === 'number') {
      return formatRupees(amount, creator.currency || 'USD');
    }
    return String(amount);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-paper text-ink selection:bg-ink selection:text-white flex flex-col justify-between">
      {/* Editorial Header */}
      <header className="border-b border-line bg-surface/90 backdrop-blur-md px-6 lg:px-8 py-2.5 flex items-center justify-between shrink-0 z-20">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-ink-3 hover:text-ink font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft
              size={13}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            <span className="font-semibold text-ink">Verified Registry</span>
            <span>·</span>
            <span>{creator.location || 'Bengaluru, IN'}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-ctl bg-surface hover:bg-sunken border border-line text-[11px] font-mono text-ink-2 hover:text-ink transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check size={12} className="text-verified" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={12} />
                  <span>Share</span>
                </>
              )}
            </button>

            {onShortlist && (
              <button
                onClick={() => onShortlist(creator.id)}
                className={`px-3.5 py-1.5 rounded-ctl font-mono text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border ${
                  isShortlisted
                    ? 'bg-surface border-ink text-ink hover:bg-paper'
                    : 'bg-ink hover:bg-[#25231F] text-white border-ink'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check size={12} strokeWidth={2.5} />
                    <span>Shortlisted</span>
                  </>
                ) : (
                  <span>Shortlist Creator</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Inspector */}
      <main className="flex-1 px-6 lg:px-8 py-5 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Specimen Inspector */}
        <div className="lg:col-span-6 h-full flex flex-col relative min-h-[520px]">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full h-full rounded-card overflow-hidden bg-stage-raised border border-line shadow-float group select-none flex flex-col justify-between"
          >
            {/* Animated Specimen Background Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSpecimen.id || currentSpecimen.imageUrl}
                src={currentSpecimen.imageUrl}
                alt={currentSpecimen.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

            <CropMarks hoverable={true} dark={true} offset={8} length={14} />

            {/* Specimen Header & Cycle Bar */}
            <div className="relative z-20 p-4 space-y-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 w-full">
                {portfolioItems.map((specimen, idx) => {
                  const isCurrent = activeSpecimenIdx === idx;
                  const isPast = idx < activeSpecimenIdx;
                  return (
                    <button
                      key={specimen.id || idx}
                      type="button"
                      onClick={() => setActiveSpecimenIdx(idx)}
                      className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden relative cursor-pointer hover:h-1.5 transition-all"
                      title={`Specimen ${idx + 1}: ${specimen.title}`}
                    >
                      {isCurrent ? (
                        <motion.div
                          key={`progress-${idx}`}
                          initial={{ width: '0%' }}
                          animate={{ width: isPaused ? '50%' : '100%' }}
                          transition={{ duration: 3.5, ease: 'linear' }}
                          className="h-full bg-white"
                        />
                      ) : isPast ? (
                        <div className="w-full h-full bg-white/80" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="font-mono text-[10px] bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-0.5 rounded border border-white/10 font-medium">
                  SPECIMEN {activeSpecimenIdx + 1} / {portfolioItems.length} · {currentSpecimen.aspect || '4:5'}
                </span>
                <button
                  onClick={() => onOpenColophon?.(currentSpecimen, creator)}
                  className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-ink font-mono text-[10px] font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Maximize2 size={11} strokeWidth={2.5} />
                  <span>Inspect Spec</span>
                </button>
              </div>
            </div>

            {/* Clickable Left/Right Navigation Halves */}
            <div
              onClick={() =>
                setActiveSpecimenIdx(
                  (prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length
                )
              }
              className="absolute inset-y-16 left-0 w-1/4 z-10 cursor-w-resize"
              title="Previous Specimen"
            />
            <div
              onClick={() =>
                setActiveSpecimenIdx((prev) => (prev + 1) % portfolioItems.length)
              }
              className="absolute inset-y-16 right-0 w-1/4 z-10 cursor-e-resize"
              title="Next Specimen"
            />

            {/* Specimen Bottom Metadata */}
            <div className="relative z-20 p-4 text-white space-y-1 pointer-events-none">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl text-white font-normal leading-tight truncate">
                  {currentSpecimen.title}
                </h3>
                <span className="text-[10px] font-mono uppercase text-white/80 bg-white/15 px-2 py-0.5 rounded shrink-0">
                  {isPaused ? 'Paused' : 'Auto-Cycle'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/80">
                <span className="truncate">
                  {currentSpecimen.tools?.join(' · ') || 'Blender · ComfyUI'}
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-medium shrink-0">
                  Commercial Cleared
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Identity, Metrics, Toolchain & Commission Tiers */}
        <div className="lg:col-span-6 h-full flex flex-col justify-between space-y-3">
          {/* Creator Identity */}
          <div className="space-y-1 shrink-0">
            <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-tight font-normal leading-none">
              {creator.name}
            </h1>
            <p className="font-mono text-[11px] text-ink-2 uppercase tracking-wider font-semibold">
              {creator.role || 'CGI & Generative Creative Director'}
            </p>
            <p className="text-[13.5px] text-ink-2 leading-snug font-ui font-normal line-clamp-2 mt-1">
              {creator.bio ||
                'Award-winning multidisciplinary director engineering synthetic brand campaigns and photorealistic editorial assets.'}
            </p>
          </div>

          {/* 4 Key Metrics */}
          <div className="grid grid-cols-4 gap-2.5 p-3 rounded-card bg-surface border border-line shadow-2xs shrink-0">
            <div>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 block">
                Audience Reach
              </span>
              <div className="font-mono text-xl font-bold text-ink tnum leading-tight mt-0.5">
                {followerCount}
              </div>
              <span className="font-mono text-[9.5px] text-verified block">
                {platform} Verified
              </span>
            </div>

            <div>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 block">
                Engagement Rate
              </span>
              <div className="font-mono text-xl font-bold text-ink tnum leading-tight mt-0.5">
                {engagementRate}%
              </div>
              <span className="font-mono text-[9.5px] text-ink-3 block">
                Industry Lead
              </span>
            </div>

            <div>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 block">
                Turnaround SLA
              </span>
              <div className="font-mono text-xl font-bold text-ink tnum leading-tight mt-0.5">
                {creator.turnaround || '3-5d'}
              </div>
              <span className="font-mono text-[9.5px] text-ink-3 block">
                Fast Track
              </span>
            </div>

            <div>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 block">
                Rights Status
              </span>
              <div className="font-mono text-lg font-bold text-ink leading-tight mt-0.5">
                Cleared
              </div>
              <span className="font-mono text-[9.5px] text-verified block">
                Perpetual Global
              </span>
            </div>
          </div>

          {/* Production Toolchain */}
          <div className="space-y-1.5 shrink-0">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-ink-3 block font-semibold">
              PRODUCTION TOOLCHAIN & MODELS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {toolList.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[10.5px] bg-surface px-2 py-0.5 rounded-ctl border border-line text-ink flex items-center gap-1 shadow-2xs"
                >
                  <ToolMark name={tool} />
                  <span>{tool}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Commission Deliverable Tiers */}
          <div className="p-4 rounded-card bg-surface border border-line shadow-2xs space-y-3 shrink-0">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink font-semibold">
                COMMISSION DELIVERABLE TIERS
              </span>
              <span className="font-mono text-[10px] text-verified font-medium">
                100% Milestone Escrow
              </span>
            </div>

            {/* 3 Tier Cards */}
            <div className="grid grid-cols-3 gap-2">
              {Object.values(tiers).map((tier) => {
                const isCurrent = selectedTier === tier.id;
                const price =
                  typeof basePrice === 'number'
                    ? Math.round(basePrice * tier.multiplier)
                    : basePrice;

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-2.5 rounded-ctl border transition-all cursor-pointer text-left flex flex-col justify-between space-y-1.5 relative ${
                      isCurrent
                        ? 'bg-paper border-ink ring-1 ring-ink shadow-xs'
                        : 'bg-paper/40 border-line hover:border-line-strong hover:bg-paper'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-ink-3 block">
                        {tier.tag}
                      </span>
                      <h4 className="font-display text-[14px] text-ink leading-tight font-medium line-clamp-1">
                        {tier.title.split('(')?.[0]}
                      </h4>
                    </div>
                    <div className="font-mono text-[13.5px] font-bold text-ink tnum">
                      {formatTierPrice(price)}
                    </div>
                    {isCurrent && (
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-ink text-white flex items-center justify-center">
                        <Check size={9} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tier Deliverables Description */}
            <div className="p-2.5 rounded-ctl bg-paper border border-line space-y-1.5 text-ink">
              <div className="flex items-center justify-between font-mono text-[10.5px]">
                <span className="font-semibold text-ink uppercase">
                  {activeTierConfig.title}
                </span>
                <span className="text-ink-3">SLA: {activeTierConfig.turnaround}</span>
              </div>
              <p className="text-[12px] text-ink-2 font-ui leading-tight">
                {activeTierConfig.deliverables}
              </p>
              <div className="flex items-center justify-between font-mono text-[9.5px] text-ink-3 pt-1 border-t border-line/60">
                <span>{activeTierConfig.revisions} Revisions Included</span>
                <span className="text-verified font-medium">Enterprise Cleared</span>
              </div>
            </div>

            {/* Primary Action Button */}
            {onShortlist && (
              <button
                onClick={() => onShortlist(creator.id)}
                className={`w-full h-11 rounded-ctl font-mono text-[11.5px] uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm border ${
                  isShortlisted
                    ? 'bg-surface border-ink text-ink hover:bg-paper'
                    : 'bg-ink hover:bg-[#25231F] text-white border-ink'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check size={13} strokeWidth={2.5} />
                    <span>Creator Shortlisted</span>
                  </>
                ) : (
                  <>
                    <span>Lock Tier & Shortlist</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
      <CreatorIntelligenceSection creator={creator} analytics={analytics} campaign={campaign} />
    </div>
  );
}

