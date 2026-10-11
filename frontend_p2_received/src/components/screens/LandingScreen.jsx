import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Layers,
  FileCheck,
  Sparkles,
  SlidersHorizontal,
  Compass,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { CREATORS_DATA } from '../../data/creators';

/**
 * LandingScreen
 * Ultra-premium, cinematic studio presentation.
 * Merges imagery and atmospheric background seamlessly together
 * using deep obsidian canvas (#09090B), ambient luminous light blooms,
 * frosted studio glassmorphism, and physical editorial typography.
 */
export function LandingScreen({
  onStartCampaign,
  onBrowseCreators,
  onOpenColophon,
  onResetData,
}) {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [hoveredWork, setHoveredWork] = useState(null);

  const samplePrompts = [
    {
      label: 'Urban sneaker drop',
      prompt:
        '3 photorealistic hero stills and 2 vertical 9:16 reels for an urban performance sneaker drop in Mumbai with commercial rights.',
    },
    {
      label: 'Botanical skincare',
      prompt:
        '4 soft pastel still compositions capturing morning rainwater on lotus leaves with organic gouache texture.',
    },
    {
      label: 'UPI soundbox explainer',
      prompt:
        '3 isometric animated explainer videos demonstrating instant merchant notification soundboxes.',
    },
    {
      label: 'Architectural ceramics',
      prompt:
        '3 architectural product stills styled on raw travertine with dramatic directional afternoon sunlight.',
    },
  ];

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onStartCampaign?.(quickPrompt.trim() || samplePrompts[0].prompt);
  };

  const showcaseWorks = [
    {
      id: 'sw-1',
      title: 'Monolith Sole Geometry',
      imageUrl:
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[4/5]',
      creatorName: 'Ishita Rao',
      creatorRole: 'Neo-Product CGI',
      creatorAvatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      tools: ['Midjourney V7', 'Blender 4.2', 'ComfyUI'],
      humanInvolvementText: 'HYBRID RETOUCHED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(20, 71, 255, 0.35)',
    },
    {
      id: 'sw-2',
      title: 'Nocturne 35mm Horizon Film',
      imageUrl:
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[16/10]',
      creatorName: 'Kabir Mehta',
      creatorRole: 'Cinematic Director',
      creatorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tools: ['Runway Gen-3', 'Premiere Pro'],
      humanInvolvementText: 'COLOR-GRADED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(147, 51, 234, 0.28)',
    },
    {
      id: 'sw-3',
      title: 'Organic Botanical Hydration',
      imageUrl:
        'https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[1/1]',
      creatorName: 'Devika Sen',
      creatorRole: 'Pastel & Gouache Artist',
      creatorAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      tools: ['Flux.1 Pro', 'Procreate'],
      humanInvolvementText: 'HAND-PAINTED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(16, 185, 129, 0.25)',
    },
    {
      id: 'sw-4',
      title: 'Chromium Kinetic Glyph 09',
      imageUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[4/5]',
      creatorName: 'Tenzin Norbu',
      creatorRole: 'Generative Typography',
      creatorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      tools: ['Cinema 4D', 'Midjourney V7'],
      humanInvolvementText: '3D COMPOSITED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(59, 130, 246, 0.3)',
    },
    {
      id: 'sw-5',
      title: 'Ripstop Macro Textile Fold',
      imageUrl:
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[1/1]',
      creatorName: 'Ishita Rao',
      creatorRole: 'CMF & Industrial Design',
      creatorAvatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      tools: ['Flux.1 Pro', 'Photoshop'],
      humanInvolvementText: 'HUMAN-EDITED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(249, 115, 22, 0.25)',
    },
    {
      id: 'sw-6',
      title: 'UPI Ledger Gateway Isometric',
      imageUrl:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[16/10]',
      creatorName: 'Meera Nambiar',
      creatorRole: 'CAD & Architectural CGI',
      creatorAvatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      tools: ['Blender 4.2', 'SDXL'],
      humanInvolvementText: 'CAD DIRECTED',
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      glowColor: 'rgba(99, 102, 241, 0.28)',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#0A0A0C] text-white overflow-hidden selection:bg-cobalt selection:text-white">
      {/* Ambient Atmospheric Glow Blooms (Merged Background Lighting) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top-left Cobalt Ambient Aurora */}
        <div className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-cobalt/18 via-cobalt/6 to-transparent blur-[140px]" />

        {/* Center-right Violet & Indigo Luminous Haze */}
        <div className="absolute top-[25%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-purple-600/12 via-indigo-600/6 to-transparent blur-[160px]" />

        {/* Subtle Warm Amber Studio Glow at bottom */}
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-amber-500/6 blur-[180px]" />

        {/* Cinematic Film Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Grid: Fluid, Seamless Editorial Canvas */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)]">
        {/* Left Half (Cinematic Pitch & Glass Studio Command Center) */}
        <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] backdrop-blur-[2px]">
          <div className="space-y-8 max-w-xl">
            {/* Header Lockup & Vision */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/80 font-medium">
                  CREATOR MARKETPLACE · PROVENANCE STANDARD
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl xl:text-[68px] text-white leading-[1.04] tracking-[-0.03em]">
                Know how it <br />
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                  was made.
                </span>
              </h1>

              <p className="text-[16px] text-white/70 leading-relaxed font-ui font-normal max-w-lg">
                Commission verified generative artists with their software stack,
                dataset licenses, and retouching depth permanently recorded on the public colophon ledger.
              </p>
            </div>

            {/* Seamless Frosted Glass Fast Brief Composer */}
            <div className="relative rounded-2xl p-5 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.1] shadow-[0_16px_40px_rgba(0,0,0,0.5)] space-y-4 group transition-all duration-300 hover:border-white/[0.18]">
              {/* Top ambient highlight line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-t-2xl" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-white/80 font-semibold flex items-center gap-2">
                  <Sparkles size={13} className="text-cobalt" />
                  <span>FAST COMMISSION · DRAFT A BRIEF</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-medium bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                  Instant Match
                </span>
              </div>

              <form onSubmit={handleQuickSubmit} className="relative">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="e.g. 3 hero product stills for luxury footwear launch..."
                  className="w-full h-12 pl-4 pr-32 rounded-xl bg-black/40 border border-white/[0.12] text-[13.5px] text-white placeholder:text-white/35 focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt/50 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 px-4 rounded-lg bg-cobalt hover:bg-cobalt-press text-white text-[12.5px] font-medium flex items-center gap-1.5 transition-all shadow-[0_2px_12px_rgba(20,71,255,0.4)] cursor-pointer hover:shadow-[0_4px_20px_rgba(20,71,255,0.6)]"
                >
                  <span>Draft brief</span>
                  <ArrowRight size={13} strokeWidth={2} />
                </button>
              </form>

              {/* Interactive Idea Chips */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                  <span className="font-mono text-[9.5px] text-white/40 uppercase mr-1 flex-shrink-0 tracking-wider">
                    IDEAS:
                  </span>
                  {samplePrompts.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onStartCampaign?.(item.prompt)}
                      className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-[11px] font-mono text-white/75 hover:text-white transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                onClick={() => onStartCampaign?.()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-cobalt hover:bg-cobalt-press text-white font-medium text-[14px] transition-all shadow-[0_4px_24px_rgba(20,71,255,0.45)] hover:shadow-[0_6px_32px_rgba(20,71,255,0.6)] cursor-pointer"
              >
                <span>Start custom campaign</span>
                <ArrowRight size={15} strokeWidth={2} />
              </button>
              <button
                onClick={onBrowseCreators}
                className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] hover:border-white/[0.25] text-white font-medium text-[14px] transition-all cursor-pointer text-center backdrop-blur-md"
              >
                Browse creators
              </button>
            </div>

            {/* 3 Translucent Provenance Pillars (Melted into background) */}
            <div className="pt-2 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.15] backdrop-blur-md transition-all space-y-1.5 group">
                <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-widest block">
                  01 / AUDIT
                </span>
                <div className="font-ui font-semibold text-[13px] text-white group-hover:text-cobalt transition-colors">
                  Tool Transparency
                </div>
                <p className="text-[11px] text-white/60 font-ui leading-relaxed">
                  Models, seeds, and retouching recorded on the colophon ledger.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.15] backdrop-blur-md transition-all space-y-1.5 group">
                <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-widest block">
                  02 / RIGHTS
                </span>
                <div className="font-ui font-semibold text-[13px] text-white group-hover:text-cobalt transition-colors">
                  Commercial Clearance
                </div>
                <p className="text-[11px] text-white/60 font-ui leading-relaxed">
                  Enterprise model licensing and ASCI disclosure standards.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.15] backdrop-blur-md transition-all space-y-1.5 group">
                <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-widest block">
                  03 / PRICING
                </span>
                <div className="font-ui font-semibold text-[13px] text-white group-hover:text-cobalt transition-colors">
                  Transparent Escrow
                </div>
                <p className="text-[11px] text-white/60 font-ui leading-relaxed">
                  Pre-calibrated asset rates with zero unverified surcharges.
                </p>
              </div>
            </div>
          </div>

          {/* Clean Editorial Footer Strip */}
          <div className="pt-8 mt-8 border-t border-white/[0.08] flex items-center justify-between text-white/40 font-mono text-[11px] select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span className="uppercase tracking-wider text-white/60">
                VERIFIED ARCHIVE · 8 VETTED CREATORS IN RESIDENCE
              </span>
            </div>

            {onResetData && (
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                title="Reset application state"
              >
                <RotateCcw size={11} strokeWidth={1.5} />
                <span className="uppercase tracking-wider">RESET</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Half: Immersive Artwork Stage (Images Merged Directly with the Dark Atmosphere) */}
        <div className="lg:col-span-7 p-8 lg:p-14 overflow-y-auto">
          {/* Stage Header */}
          <div className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cobalt" />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/80 font-semibold">
                CURATED EXHIBITION · RECENT COMMISSIONS
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              CLICK ANY WORK FOR PROVENANCE LEDGER
            </span>
          </div>

          {/* Works Grid: Floating pieces with ambient backlight blooms and seamless bottom vignettes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            {showcaseWorks.map((work, idx) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredWork(work.id)}
                onMouseLeave={() => setHoveredWork(null)}
                onClick={() => onOpenColophon?.(work)}
              >
                {/* Dynamic Ambient Colored Glow Behind Image (Melted into background) */}
                <div
                  className="absolute -inset-1.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: work.glowColor }}
                />

                {/* Artwork Card with Seamless Vignette Finish */}
                <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.1] group-hover:border-white/[0.28] transition-all duration-300 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
                  {/* Image container */}
                  <div className={`relative ${work.aspect} w-full overflow-hidden`}>
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />

                    {/* Architectural Crop Marks */}
                    <CropMarks hoverable={true} dark={true} />

                    {/* Gradient Fade Merging Bottom of Image into Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                    {/* Hover Inspect Pill */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase bg-black/75 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                        <span>Inspect Colophon</span>
                        <ArrowUpRight size={11} />
                      </span>
                    </div>

                    {/* Merged Artwork Information Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 bg-black/60 flex-shrink-0">
                            <img
                              src={work.creatorAvatar}
                              alt={work.creatorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-ui font-semibold text-[13px] text-white leading-tight">
                            {work.creatorName}
                          </span>
                        </div>
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                          {work.rightsStatus}
                        </span>
                      </div>

                      <h3 className="font-display text-lg text-white font-medium leading-snug truncate">
                        {work.title}
                      </h3>

                      {/* Tool pills */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5 font-mono text-[10px] text-white/70">
                        {work.tools.map((t, i) => (
                          <span
                            key={i}
                            className="bg-white/[0.08] backdrop-blur-md px-2 py-0.5 rounded-[4px] border border-white/[0.1] text-white/90"
                          >
                            {t}
                          </span>
                        ))}
                        <span className="text-white/40">·</span>
                        <span className="text-white/60">{work.humanInvolvementText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
