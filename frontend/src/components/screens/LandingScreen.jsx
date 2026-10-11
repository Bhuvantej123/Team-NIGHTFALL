import React, { useState, useMemo } from 'react';
import { Plus, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { CANONICAL_PORTFOLIO_BY_CREATOR } from '../../data/canonicalPortfolioMetadata';

// Strict blacklist: These creators must NEVER appear anywhere in the app
const FORBIDDEN_IDS = new Set([
  'c-test-1', 'c-test-2', 'c-test-3',
  'creator-demo-001', 'creator-demo-002', 'creator-demo-003',
  'test-creator-1', 'test-creator-2', 'test-creator-3',
  'creator-elena', 'creator-marcus', 'c-08'
]);

const FORBIDDEN_STRINGS = ['elena', 'marcus', 'aria chen', '@elena', '@vance', '@aria'];

function isForbidden(entity) {
  if (!entity) return false;
  const id = entity.id || entity.creator_id || entity.creatorId || '';
  if (FORBIDDEN_IDS.has(id)) return true;
  const text = `${entity.display_name || entity.creatorName || entity.name || ''} ${entity.handle || ''} ${entity.title || ''}`.toLowerCase();
  return FORBIDDEN_STRINGS.some((term) => text.includes(term));
}

// Curated active creator baseline mapped directly to approved creators (creator-001 through creator-015)
const APPROVED_CANONICAL_CREATORS = [
  { id: 'creator-001', name: 'Aarav Sharma', role: 'AI Filmmaker & Cinematic Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', tools: ['Runway Gen-3', 'Midjourney V7', 'Premiere Pro'], humanText: 'COLOR-GRADED' },
  { id: 'creator-002', name: 'Pooja Varma', role: 'Motion Graphics & Bioluminescence', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', tools: ['ComfyUI', 'After Effects', 'Blender 4.2'], humanText: '3D COMPOSITED' },
  { id: 'creator-003', name: 'Meera Sen', role: 'Virtual Haute Couture Stylist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', tools: ['Flux.1 Pro', 'Marvelous Designer'], humanText: 'PATTERN TUNED' },
  { id: 'creator-004', name: 'Rohan Kulkarni', role: 'Generative Culinary Stylist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', tools: ['Midjourney V7', 'Photoshop'], humanText: 'HUMAN-EDITED' },
  { id: 'creator-005', name: 'Vikram Nair', role: 'Real-Time Game Lore & VFX', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80', tools: ['Unreal Engine 5', 'ElevenLabs'], humanText: 'SPATIAL MIXED' },
  { id: 'creator-006', name: 'Ananya Roy', role: 'Organic Clay Physics & Tactile CGI', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', tools: ['Blender 4.2', 'ZBrush'], humanText: 'SCULPTED & SHADED' },
  { id: 'creator-007', name: 'Kabir Malhotra', role: 'Viral Social Video Director', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', tools: ['Runway Gen-3', 'CapCut Pro'], humanText: 'PACING TIMED' },
  { id: 'creator-008', name: 'Dr. Shalini Gupta', role: 'Scientific Explainer Animator', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', tools: ['Cinema 4D', 'Midjourney V7'], humanText: 'ACCURACY VERIFIED' },
  { id: 'creator-009', name: 'Aditya Singhania', role: 'Industrial Tech Hardware CGI', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80', tools: ['Blender 4.2', 'Octane'], humanText: 'PATH TRACED' },
  { id: 'creator-010', name: 'Zara D\'Souza', role: 'Luxury Fashion Editorial', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80', tools: ['Flux.1 Pro', 'Photoshop'], humanText: 'RETOUCHED' },
  { id: 'creator-011', name: 'Tenzin Norbu', role: 'Speculative Nature Documentarian', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', tools: ['ComfyUI', 'DaVinci Resolve'], humanText: 'COLOR TIMED' },
  { id: 'creator-012', name: 'Isha Patel', role: 'Cinematic Travel & Environments', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', tools: ['Midjourney V7', 'Premiere Pro'], humanText: 'DIRECTOR-TUNED' },
];

/**
 * LandingScreen
 * Restored P2 Editorial Canvas with dual continuous waterfall creator-card reels.
 * Features opposite directional movement, seamless looping, fast brief composer,
 * sample prompt chips, and physical editorial typography.
 */
export function LandingScreen({
  creators = [],
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

  // Dynamically derive waterfall reel works from approved active creators
  const activeWorks = useMemo(() => {
    const aspectRatios = [
      'aspect-[4/5]',
      'aspect-[16/10]',
      'aspect-[1/1]',
      'aspect-[4/5]',
      'aspect-[1/1]',
      'aspect-[16/10]',
    ];

    const safeCreators = (creators && creators.length > 0)
      ? creators.filter((c) => !isForbidden(c))
      : APPROVED_CANONICAL_CREATORS;

    const works = [];
    safeCreators.forEach((creator, idx) => {
      if (isForbidden(creator)) return;
      const creatorId = creator.id;
      const portfolioItems = CANONICAL_PORTFOLIO_BY_CREATOR[creatorId] || creator.portfolio_items || [];
      const primaryWork = portfolioItems[0];

      const aspect = aspectRatios[idx % aspectRatios.length];
      const tools = (creator.ai_tools && creator.ai_tools.length)
        ? creator.ai_tools
        : (creator.tools || ['Midjourney V7', 'ComfyUI']);
      const role = creator.disciplines?.[0] || creator.skills?.[0] || creator.role || 'AI Creator';
      const fallbackCreator = APPROVED_CANONICAL_CREATORS[idx % APPROVED_CANONICAL_CREATORS.length];
      const avatar = creator.avatar_url || creator.avatar || fallbackCreator.avatar;
      const humanInvolvement = creator.humanText || ['HYBRID RETOUCHED', '3D COMPOSITED', 'COLOR-GRADED', 'CAD DIRECTED', 'DIRECTOR-TUNED'][idx % 5];

      works.push({
        id: primaryWork?.id || `work-${creatorId}`,
        creatorId: creatorId,
        title: primaryWork?.title || `${creator.display_name || creator.name} Visual Showcase`,
        imageUrl: primaryWork?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85',
        aspect,
        creatorName: creator.display_name || creator.name,
        creatorRole: role,
        creatorAvatar: avatar,
        tools,
        humanInvolvementText: humanInvolvement,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
      });
    });

    return works.filter((w) => !isForbidden(w));
  }, [creators]);

  // Distribute works across left and right columns and duplicate for infinite continuous loop
  const colLeft = activeWorks.filter((_, idx) => idx % 2 === 0);
  const colRight = activeWorks.filter((_, idx) => idx % 2 !== 0);
  const colLeftDoubled = [...colLeft, ...colLeft];
  const colRightDoubled = [...colRight, ...colRight];

  const renderCard = (work, idx, colId) => (
    <div
      key={`${colId}-${work.id}-${idx}`}
      onClick={() => onOpenColophon?.(work)}
      className="group space-y-1.5 cursor-pointer transition-all duration-200"
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
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase bg-surface/95 backdrop-blur-md text-ink px-2 py-0.5 rounded-full border border-ink shadow-sm">
            <span>Inspect Spec</span>
            <ArrowUpRight size={10} />
          </span>
        </div>
      </div>
      <div className="space-y-0.5 pt-0.5 px-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4.5 h-4.5 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
              <img
                src={work.creatorAvatar}
                alt={work.creatorName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-ui font-semibold text-[12px] sm:text-[12.5px] text-ink group-hover:underline truncate max-w-[120px]">
              {work.creatorName}
            </span>
          </div>
          <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 truncate max-w-[95px]">
            {work.creatorRole}
          </span>
        </div>
        <CreditLine work={work} dark={false} onOpenColophon={onOpenColophon} />
      </div>
    </div>
  );

  return (
    <div className="h-full min-h-0 md:h-[calc(100dvh-64px)] w-full bg-paper text-ink selection:bg-ink selection:text-white relative flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      {/* Left Waterfall Column (Moving Downwards Continuously) */}
      <div className="hidden md:block w-[200px] lg:w-[240px] xl:w-[280px] 2xl:w-[320px] h-full overflow-hidden relative shrink-0 group/col-left">
        {/* Soft Vignette Masks for Seamless Infinite Looping */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 lg:h-24 bg-gradient-to-b from-paper via-paper/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 lg:h-24 bg-gradient-to-t from-paper via-paper/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-20 bg-gradient-to-r from-transparent via-paper/70 to-paper z-20" />

        <div className="h-full px-2.5 lg:px-3 xl:px-4 py-3 lg:py-4 overflow-hidden relative">
          <div
            className="space-y-4 lg:space-y-5 xl:space-y-6 animate-waterfall-down group-hover/col-left:waterfall-paused"
            style={{ '--waterfall-speed': '38s' }}
          >
            {colLeftDoubled.map((work, idx) => renderCard(work, idx, 'col-left'))}
          </div>
        </div>
      </div>

      {/* Center Hero Command Center & Interactive Fast Brief Composer */}
      <div className="flex-1 h-full min-h-0 md:overflow-hidden relative z-10 flex flex-col justify-center items-center py-4 sm:py-5 lg:py-6 xl:py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-[620px] lg:max-w-[660px] xl:max-w-[700px] w-full mx-auto my-auto space-y-4 sm:space-y-4.5 lg:space-y-5 xl:space-y-6">
          {/* Header Tag & Editorial Title */}
          <div className="space-y-2 sm:space-y-2.5 lg:space-y-3.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.08em] text-ink-3">
              <span className="w-2 h-2 rounded-full bg-verified" />
              <span>CREATORCONNECT AI · BRAND DASHBOARD</span>
            </div>

            <h1 className="font-display text-4xl sm:text-[44px] md:text-5xl lg:text-[54px] xl:text-[62px] 2xl:text-[70px] text-ink leading-[1.04] tracking-[-0.03em]">
              Creative Campaign <br />
              <span className="italic font-normal text-ink-2">Command Center.</span>
            </h1>

            <p className="text-[13.5px] sm:text-[14.5px] lg:text-[15.5px] xl:text-[17px] text-ink-2 leading-relaxed font-ui font-normal max-w-2xl">
              Commission generative artists with full model provenance, clear commercial rights, and
              milestone escrow protection.
            </p>
          </div>

          {/* Interactive Fast Brief Composer with Real API Integration */}
          <div className="relative rounded-card p-4 sm:p-4.5 lg:p-5 bg-surface border border-line shadow-2xs space-y-3 sm:space-y-3.5 transition-all duration-300 hover:border-line-strong">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
                <Sparkles size={13} className="text-ink" />
                <span>FAST COMMISSION · DRAFT A BRIEF</span>
              </span>
            </div>

            <form onSubmit={handleQuickSubmit} className="relative">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="e.g. 3 photorealistic hero stills for luxury footwear launch..."
                className="w-full h-10.5 sm:h-11 lg:h-11.5 pl-3.5 sm:pl-4 pr-32 rounded-ctl bg-paper border border-line text-[13px] sm:text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 sm:top-1.5 h-8.5 sm:h-9 px-3.5 sm:px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-surface text-[12px] sm:text-[12.5px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span>Draft brief</span>
                <ArrowRight size={13} strokeWidth={2} />
              </button>
            </form>

            {/* Interactive Idea Chips */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                <span className="font-mono text-[9px] sm:text-[9.5px] text-ink-3 uppercase mr-1 flex-shrink-0 tracking-wider">
                  IDEAS:
                </span>
                {samplePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onStartCampaign?.(item.prompt)}
                    className="px-2.5 sm:px-3 py-1 rounded-full bg-paper hover:bg-sunken border border-line hover:border-line-strong text-[10.5px] sm:text-[11px] font-mono text-ink-2 hover:text-ink transition-all flex-shrink-0 cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-0.5">
            <button
              onClick={() => onStartCampaign?.()}
              className="group inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 rounded-ctl bg-ink hover:bg-[#25231F] text-surface font-ui font-medium text-[14px] sm:text-[15px] lg:text-[15.5px] tracking-tight border border-ink shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <span className="w-5 h-5 rounded-full bg-surface/15 flex items-center justify-center group-hover:bg-surface/25 transition-colors">
                <Plus size={13} strokeWidth={2.5} />
              </span>
              <span>Create Campaign</span>
            </button>

            <button
              onClick={onBrowseCreators}
              className="group inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 rounded-ctl bg-surface hover:bg-ink text-ink hover:text-white border border-line-strong hover:border-ink font-ui font-medium text-[14px] sm:text-[15px] lg:text-[15.5px] transition-all duration-150 shadow-xs cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-ink group-hover:bg-white transition-colors" />
              <span>Browse Creators</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Waterfall Column (Moving Upwards Continuously) */}
      <div className="hidden md:block w-[200px] lg:w-[240px] xl:w-[280px] 2xl:w-[320px] h-full overflow-hidden relative shrink-0 group/col-right">
        {/* Soft Vignette Masks for Seamless Infinite Looping */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 lg:h-24 bg-gradient-to-b from-paper via-paper/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 lg:h-24 bg-gradient-to-t from-paper via-paper/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-20 bg-gradient-to-l from-transparent via-paper/70 to-paper z-20" />

        <div className="h-full px-2.5 lg:px-3 xl:px-4 py-3 lg:py-4 overflow-hidden relative">
          <div
            className="space-y-4 lg:space-y-5 xl:space-y-6 animate-waterfall-up group-hover/col-right:waterfall-paused"
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
