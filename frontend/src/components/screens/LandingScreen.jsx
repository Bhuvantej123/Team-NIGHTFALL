import React, { useState } from 'react';
import { Plus, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';

/**
 * LandingScreen
 * Restored P2 Editorial Canvas with dual continuous waterfall creator-card reels.
 * Features opposite directional movement, seamless looping, fast brief composer,
 * sample prompt chips, and physical editorial typography.
 */
export function LandingScreen({
  campaigns = [],
  onSelectCampaign = () => {},
  onStartCampaign = () => {},
  onBrowseCreators = () => {},
  onViewAllCampaigns = () => {},
  onOpenColophon = (_work, _creator, _dark) => {},
  onResetData = () => {},
}) {
  const [quickPrompt, setQuickPrompt] = useState('');

  const samplePrompts = [
    {
      label: 'Urban sneaker drop (3 stills + 2 reels)',
      prompt:
        'We need 3 photorealistic hero stills and 2 vertical 9:16 reels for an urban performance sneaker drop in Mumbai with commercial rights.',
    },
    {
      label: 'Botanical skincare launch',
      prompt:
        '4 soft pastel still compositions capturing morning rainwater on lotus leaves with organic gouache texture.',
    },
    {
      label: 'UPI soundbox explainer',
      prompt:
        '3 isometric animated explainer videos demonstrating instant merchant notification soundboxes.',
    },
    {
      label: 'Minimalist ceramics lookbook',
      prompt:
        '3 architectural product stills styled on raw travertine with dramatic directional afternoon sunlight.',
    },
  ];

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onStartCampaign?.(quickPrompt.trim() || samplePrompts[0].prompt);
  };

  // Original curated creator works for the continuous waterfall reels
  const sampleWorks = [
    {
      id: 'sw-1',
      title: 'Monolith Sole Geometry',
      imageUrl:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85',
      aspect: 'aspect-[4/5]',
      creatorName: 'Ishita Rao',
      creatorRole: 'Neo-Product CGI',
      creatorAvatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      tools: ['Midjourney V7', 'Blender 4.2', 'ComfyUI'],
      humanInvolvementText: 'HYBRID RETOUCHED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-2',
      title: 'Nocturne 35mm Horizon Film',
      imageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=85',
      aspect: 'aspect-[16/10]',
      creatorName: 'Kabir Mehta',
      creatorRole: 'Cinematic Director',
      creatorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tools: ['Runway Gen-3', 'Premiere Pro'],
      humanInvolvementText: 'COLOR-GRADED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-3',
      title: 'Organic Botanical Hydration',
      imageUrl:
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=900&auto=format&fit=crop&q=85',
      aspect: 'aspect-[1/1]',
      creatorName: 'Devika Sen',
      creatorRole: 'Pastel & Gouache Artist',
      creatorAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      tools: ['Flux.1 Pro', 'Procreate'],
      humanInvolvementText: 'HAND-PAINTED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
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
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
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
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
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
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-7',
      title: 'Hyper-Glaze Ceramic Specimen',
      imageUrl:
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[4/5]',
      creatorName: 'Ananya Roy',
      creatorRole: 'Organic Clay Physics',
      creatorAvatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      tools: ['Midjourney V7', 'ZBrush'],
      humanInvolvementText: 'SCULPTED & SHADED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-8',
      title: 'Solarium Architectural Light Study',
      imageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[1/1]',
      creatorName: 'Meera Nambiar',
      creatorRole: 'Spatial World Building',
      creatorAvatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      tools: ['Blender 4.2', 'Octane'],
      humanInvolvementText: 'PATH TRACED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-9',
      title: 'Cybernetic Sprint Rig 04',
      imageUrl:
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[16/10]',
      creatorName: 'Ishita Rao',
      creatorRole: 'Generative Footwear',
      creatorAvatar:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      tools: ['ComfyUI', 'Marvelous Designer'],
      humanInvolvementText: 'PATTERN TUNED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
    {
      id: 'sw-10',
      title: 'Velvet Dusk Editorial Compositions',
      imageUrl:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80',
      aspect: 'aspect-[4/5]',
      creatorName: 'Devika Sen',
      creatorRole: 'Grain & Pigment Study',
      creatorAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      tools: ['Photoshop', 'Midjourney V7'],
      humanInvolvementText: 'COLOR TIMED',
      rightsStatus: 'COMMERCIAL USE DECLARED',
      verification: 'verified',
    },
  ];

  // Distribute works across left and right columns and duplicate for infinite continuous loop
  const colLeft = sampleWorks.filter((_, idx) => idx % 2 === 0);
  const colRight = sampleWorks.filter((_, idx) => idx % 2 !== 0);
  const colLeftDoubled = [...colLeft, ...colLeft];
  const colRightDoubled = [...colRight, ...colRight];

  const renderCard = (work, idx, colId) => (
    <div
      key={`${colId}-${work.id}-${idx}`}
      onClick={() => onOpenColophon?.(work)}
      className="group space-y-2 cursor-pointer transition-all duration-200"
    >
      <div
        className={`relative ${work.aspect} w-full rounded-card overflow-hidden bg-surface border border-line group-hover:border-ink transition-all duration-300 shadow-[0_4px_16px_-4px_rgba(20,19,15,0.08)] group-hover:shadow-[0_14px_32px_-6px_rgba(20,19,15,0.16)]`}
      >
        <img
          src={work.imageUrl}
          alt={work.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] contrast-[1.03]"
        />
        <CropMarks hoverable={true} />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase bg-surface/95 backdrop-blur-md text-ink px-2.5 py-1 rounded-full border border-ink shadow-sm">
            <span>Inspect Spec</span>
            <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
      <div className="space-y-1 pt-0.5 px-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
              <img
                src={work.creatorAvatar}
                alt={work.creatorName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-ui font-semibold text-[13px] text-ink group-hover:underline">
              {work.creatorName}
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
            {work.creatorRole}
          </span>
        </div>
        <CreditLine work={work} dark={false} onOpenColophon={onOpenColophon} />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-[#F7F5F0] text-ink selection:bg-ink selection:text-white overflow-hidden relative flex">
      {/* Left Waterfall Column (Moving Downwards Continuously) */}
      <div className="hidden md:block w-[240px] lg:w-[280px] xl:w-[320px] h-full overflow-hidden relative shrink-0 group/col-left">
        {/* Soft Vignette Masks for Seamless Infinite Looping */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F7F5F0] via-[#F7F5F0]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F5F0] via-[#F7F5F0]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent via-[#F7F5F0]/70 to-[#F7F5F0] z-20" />

        <div className="h-full px-3 lg:px-4 py-4 overflow-hidden relative">
          <div
            className="space-y-6 animate-waterfall-down group-hover/col-left:waterfall-paused"
            style={{ '--waterfall-speed': '38s' }}
          >
            {colLeftDoubled.map((work, idx) => renderCard(work, idx, 'col-left'))}
          </div>
        </div>
      </div>

      {/* Center Hero Command Center & Interactive Fast Brief Composer */}
      <div className="flex-1 h-full overflow-y-auto relative z-10 flex flex-col justify-center items-center py-8 px-6 lg:px-12">
        <div className="max-w-[680px] xl:max-w-[720px] w-full mx-auto my-auto space-y-8">
          {/* Header Tag & Editorial Title */}
          <div className="space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-2.5 font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.08em] text-ink-3">
              <span className="w-2.5 h-2.5 rounded-full bg-verified" />
              <span>CREATORCONNECT AI · BRAND DASHBOARD</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-[64px] lg:text-[72px] text-ink leading-[1.02] tracking-[-0.03em]">
              Creative Campaign <br />
              <span className="italic font-normal text-ink-2">Command Center.</span>
            </h1>

            <p className="text-[16px] sm:text-[18px] lg:text-[19px] text-ink-2 leading-relaxed font-ui font-normal max-w-2xl">
              Commission generative artists with full model provenance, clear commercial rights, and
              milestone escrow protection.
            </p>
          </div>

          {/* Interactive Fast Brief Composer with Real API Integration */}
          <div className="relative rounded-card p-5 sm:p-6 bg-surface border border-line shadow-2xs space-y-4 transition-all duration-300 hover:border-line-strong">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
                <Sparkles size={13} className="text-cobalt" />
                <span>FAST COMMISSION · DRAFT A BRIEF</span>
              </span>
              <span className="font-mono text-[10px] text-verified uppercase tracking-widest font-medium bg-verified-wash px-2 py-0.5 rounded border border-verified/30">
                Gemini Powered
              </span>
            </div>

            <form onSubmit={handleQuickSubmit} className="relative">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="e.g. 3 photorealistic hero stills for luxury footwear launch..."
                className="w-full h-12 pl-4 pr-32 rounded-ctl bg-paper border border-line text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-9 px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-surface text-[12.5px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Draft brief</span>
                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </form>

            {/* Interactive Idea Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                <span className="font-mono text-[9.5px] text-ink-3 uppercase mr-1 flex-shrink-0 tracking-wider">
                  IDEAS:
                </span>
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onStartCampaign?.(item.prompt)}
                    className="px-3 py-1 rounded-full bg-paper hover:bg-sunken border border-line hover:border-line-strong text-[11px] font-mono text-ink-2 hover:text-ink transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
            <button
              onClick={() => onStartCampaign?.()}
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-ctl bg-ink hover:bg-[#25231F] text-surface font-ui font-medium text-[15px] sm:text-[16px] tracking-tight border border-ink shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <span className="w-5 h-5 rounded-full bg-surface/15 flex items-center justify-center group-hover:bg-surface/25 transition-colors">
                <Plus size={13} strokeWidth={2.5} />
              </span>
              <span>Create Campaign</span>
            </button>

            <button
              onClick={onBrowseCreators}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-ctl bg-surface hover:bg-ink text-ink hover:text-white border border-line-strong hover:border-ink font-ui font-medium text-[15px] sm:text-[16px] transition-all duration-150 shadow-xs cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-ink group-hover:bg-white transition-colors" />
              <span>Browse Creators</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Waterfall Column (Moving Upwards Continuously) */}
      <div className="hidden md:block w-[240px] lg:w-[280px] xl:w-[320px] h-full overflow-hidden relative shrink-0 group/col-right">
        {/* Soft Vignette Masks for Seamless Infinite Looping */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F7F5F0] via-[#F7F5F0]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7F5F0] via-[#F7F5F0]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-l from-transparent via-[#F7F5F0]/70 to-[#F7F5F0] z-20" />

        <div className="h-full px-3 lg:px-4 py-4 overflow-hidden relative">
          <div
            className="space-y-6 animate-waterfall-up group-hover/col-right:waterfall-paused"
            style={{ '--waterfall-speed': '42s' }}
          >
            {colRightDoubled.map((work, idx) => renderCard(work, idx, 'col-right'))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingScreen;
