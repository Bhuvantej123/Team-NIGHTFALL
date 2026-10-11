import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Sparkles,
  RefreshCw,
  Check,
  CheckCircle2,
  FileText,
  X,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  Film,
} from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatRupees, formatCurrency } from '../../utils/formatters';
import { CreatorComparisonWorkspace } from '../matching/CreatorComparisonWorkspace';


/**
 * MatchesStep
 * Step 2: Algorithmic Creator Matching
 * Exact restoration of P2 design:
 * - Left 330px aside: Levers (Budget cap slider, Commercial Rights switch, Deliverable Formats, Platforms, Calibration Index)
 * - Main matching area: Top Matches (3) vs All Candidates view toggle, Re-run Engine, Casting Room launch, Sort dropdown
 * - 3-Column card grid: Cinematic top banners with #1 TOP MATCH and Fit % badges, crop marks, follower strips, commission status, and match breakdown pills
 * - Interactive Side-by-side comparison matrix modal
 * - Reserve creators section: "Just outside your brief" with lever actions
 * - Docked CampaignActionBar workflow bar
 *
 * @param {{
 *   campaign: any;
 *   matches: Array<any>;
 *   isLoadingMatches?: boolean;
 *   isMatchingRunning?: boolean;
 *   matchingError?: string | null;
 *   onRunMatching?: () => Promise<any>;
 *   shortlistedIds?: Array<string>;
 *   onToggleShortlist?: (creatorId: string) => Promise<any>;
 *   onOpenFitSheet?: (creator: any) => void;
 *   onOpenColophon?: (work: any, creator: any, dark?: boolean) => void;
 *   onBack?: () => void;
 *   onProceedToShortlist?: () => void;
 *   onOpenCastingRoom?: () => void;
 * }} props
 */
export function MatchesStep({
  campaign,
  matches = [],
  isLoadingMatches = false,
  isMatchingRunning = false,
  matchingError = null,
  onRunMatching = async () => {},
  shortlistedIds = [],
  onToggleShortlist = async (_id) => {},
  onOpenFitSheet = (_c) => {},
  onOpenColophon = (_w, _c, _d) => {},
  onBack = () => {},
  onProceedToShortlist = () => {},
  onOpenCastingRoom = () => {},
}) {
  const maxCreatorPrice = useMemo(() => {
    return matches.reduce((max, c) => Math.max(max, c.minPrice || 0), 0);
  }, [matches]);
  const initialBudget = Math.max(campaign?.budgetMax || campaign?.budget || 20000, maxCreatorPrice, 20000);
  const [budgetCap, setBudgetCap] = useState(initialBudget);
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('fit'); // 'fit' | 'price' | 'fastest'
  const [toastMessage, setToastMessage] = useState(null);
  const [viewMode, setViewMode] = useState('top'); // 'top' | 'all'
  const [hoveredCreatorId, setHoveredCreatorId] = useState(null);
  const [comparingIds, setComparingIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [overriddenCreatorIds, setOverriddenCreatorIds] = useState([]);

  const currency = campaign?.currency || 'USD';

  // Levers and filter computation
  const { matchedCreators, reserveCreators } = useMemo(() => {
    const matched = [];
    const reserve = [];

    matches.forEach((creator) => {
      const isOverridden = overriddenCreatorIds.includes(creator.id);
      const minP = creator.minPrice || 0;
      const withinBudget = minP <= budgetCap || isOverridden;
      const meetsCommercial = !commercialOnly || creator.commercialDeclared !== false;
      const meetsFormat =
        selectedFormat === 'All' ||
        (creator.formats &&
          creator.formats.some((fmt) => {
            const fLower = fmt.toLowerCase();
            const sLower = selectedFormat.toLowerCase();
            if (fLower.includes(sLower)) return true;
            if (selectedFormat === '4:5' && (fLower.includes('4:5') || fLower.includes('stills'))) return true;
            if (selectedFormat === '9:16' && (fLower.includes('9:16') || fLower.includes('reels'))) return true;
            if (selectedFormat === '16:9' && fLower.includes('16:9')) return true;
            return false;
          }));
      const meetsPlatform =
        selectedPlatform === 'All' ||
        (creator.platforms &&
          creator.platforms.some((p) => p.toLowerCase() === selectedPlatform.toLowerCase())) ||
        (creator.channel &&
          creator.channel.platform?.toLowerCase() === selectedPlatform.toLowerCase());

      if (withinBudget && meetsCommercial && meetsFormat && meetsPlatform) {
        matched.push(creator);
      } else if (!withinBudget && meetsCommercial && meetsFormat && meetsPlatform) {
        reserve.push({
          ...creator,
          failingConstraint: `Starts at ${formatCurrency(minP, currency)} (Budget cap: ${formatCurrency(budgetCap, currency)})`,
          leverAction: `Raise budget to ${formatCurrency(minP, currency)}`,
          targetBudget: minP,
        });
      }
    });

    if (sortBy === 'price') {
      matched.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (sortBy === 'fastest') {
      matched.sort((a, b) => parseInt(a.turnaround || '14') - parseInt(b.turnaround || '14'));
    } else {
      matched.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));
    }

    return { matchedCreators: matched, reserveCreators: reserve };
  }, [matches, budgetCap, commercialOnly, selectedFormat, selectedPlatform, sortBy, overriddenCreatorIds, currency]);

  // View switch: Top Matches (up to 3 highest-ranked) vs All Candidates (every eligible result)
  const displayedMatches = useMemo(() => {
    return viewMode === 'top' ? matchedCreators.slice(0, 3) : matchedCreators;
  }, [matchedCreators, viewMode]);

  const handleApplyLever = (creator) => {
    if (creator.targetBudget) {
      setBudgetCap(creator.targetBudget);
      setToastMessage(`Budget cap raised to ${formatCurrency(creator.targetBudget, currency)} (+1 creator unlocked)`);
    }
    setOverriddenCreatorIds((prev) => [...prev, creator.id]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleCompare = (id) => {
    if (comparingIds.includes(id)) {
      setComparingIds(comparingIds.filter((cid) => cid !== id));
    } else {
      if (comparingIds.length >= 4) {
        alert('You can compare up to 4 creators at a time.');
        return;
      }
      setComparingIds([...comparingIds, id]);
    }
  };

  const comparedCreators = matches.filter((c) => comparingIds.includes(c.id));

  return (
    <div className="h-full flex-1 flex flex-col justify-between bg-paper selection:bg-ink selection:text-white min-h-0 overflow-hidden">
      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-6 px-6 pt-3 pb-2 max-w-[1400px] w-full mx-auto min-h-0 overflow-hidden">
        {/* Left Aside: Levers & Constraints (310px) */}
        <aside className="w-full lg:w-[310px] flex-shrink-0 flex flex-col min-h-0">
          <div className="bg-surface p-4 rounded-card border border-line shadow-2xs flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                  ACTIVE CAMPAIGN
                </span>
                <h2 className="font-display text-2xl text-ink leading-tight mt-0.5">
                  {campaign?.title || 'Velo-Stride Sneaker Drop'}
                </h2>
              </div>

              <div className="h-[1px] bg-line" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink font-semibold flex items-center gap-2">
                  <Sliders size={14} strokeWidth={1.5} />
                  <span>LEVERS (CONSTRAINTS)</span>
                </span>
                {toastMessage && (
                  <span className="font-mono text-[10px] text-ink bg-sunken border border-line px-2 py-0.5 rounded-[4px] font-semibold animate-pulse">
                    {toastMessage}
                  </span>
                )}
              </div>

              {/* Budget Cap Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[12px]">
                  <span className="text-ink-2">BUDGET CAP</span>
                  <span className="font-semibold text-ink tnum text-[14px]">
                    {formatCurrency(budgetCap, currency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={budgetCap}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetCap(val);
                    setToastMessage(`Cap: ${formatCurrency(val, currency)}`);
                    setTimeout(() => setToastMessage(null), 2000);
                  }}
                  className="w-full accent-ink cursor-pointer h-1.5 bg-sunken rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-ink-3">
                  <span>{formatCurrency(500, currency)}</span>
                  <span>{formatCurrency(100000, currency)}</span>
                </div>
              </div>

              {/* Commercial Rights Toggle */}
              <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink block font-medium">
                    COMMERCIAL RIGHTS
                  </span>
                  <span className="font-mono text-[10px] text-ink-3">
                    Enterprise cleared only
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCommercialOnly(!commercialOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    commercialOnly ? 'bg-ink' : 'bg-sunken border border-line'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                      commercialOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Deliverable Formats Chips */}
              <div className="space-y-2 pt-2 border-t border-line/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 block">
                  DELIVERABLE FORMATS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', '4:5', '9:16', '16:9'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-3 py-1.5 rounded-ctl text-[12px] font-mono transition-colors cursor-pointer ${
                        selectedFormat === fmt
                          ? 'bg-ink text-surface border border-ink font-medium'
                          : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platforms Chips */}
              <div className="space-y-2 pt-2 border-t border-line/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 block">
                  PLATFORMS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Instagram', 'YouTube', 'Billboard', 'Web'].map((plt) => (
                    <button
                      key={plt}
                      onClick={() => setSelectedPlatform(plt)}
                      className={`px-3 py-1.5 rounded-ctl text-[12px] font-mono transition-colors cursor-pointer ${
                        selectedPlatform === plt
                          ? 'bg-ink text-surface border border-ink font-medium'
                          : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                      }`}
                    >
                      {plt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Status Blocks */}
            <div className="pt-3 border-t border-line/70 space-y-2.5 font-mono text-[11px] mt-4">
              <div className="flex items-center justify-between text-ink-3 text-[10.5px]">
                <span className="uppercase tracking-wider">Calibration Index</span>
                <span className="text-verified font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                  100% ASCI Cleared
                </span>
              </div>
              <div className="p-2.5 rounded-[6px] bg-sunken/60 border border-line flex items-center justify-between text-[11px] text-ink">
                <span>Turnaround Delivery</span>
                <span className="font-semibold text-ink">3 – 5 Days Delivery</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Area: Matches Header, Cards Grid & Reserve Roster */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-2 mb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-display text-2xl sm:text-[26px] text-ink leading-tight font-normal">
                  <span className="tnum font-medium mr-1.5">
                    {viewMode === 'top' ? Math.min(3, matchedCreators.length) : matchedCreators.length}
                  </span>
                  Creators Fit Your Brief
                </h1>

                {/* View Switch: Top Matches (3) vs All Candidates */}
                <div className="inline-flex items-center p-0.5 rounded-ctl bg-sunken border border-line text-[11px] font-mono font-medium">
                  <button
                    onClick={() => setViewMode('top')}
                    className={`px-2.5 py-1 rounded-[3px] transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === 'top'
                        ? 'bg-ink text-surface shadow-xs font-semibold'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <Sparkles size={11} className={viewMode === 'top' ? 'text-marker' : ''} />
                    <span>Top Matches ({Math.min(3, matchedCreators.length)})</span>
                  </button>
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-2.5 py-1 rounded-[3px] transition-all cursor-pointer ${
                      viewMode === 'all'
                        ? 'bg-ink text-surface shadow-xs font-semibold'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <span>All Candidates ({matchedCreators.length})</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: Casting Room, Re-run Engine & Sort */}
              <div className="flex items-center gap-2 flex-wrap">
                {onOpenCastingRoom && (
                  <button
                    onClick={onOpenCastingRoom}
                    className="h-7 px-2.5 rounded-ctl bg-ink hover:bg-[#25231F] text-surface font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs border border-ink"
                    title="Launch 3D Casting Room review experience"
                  >
                    <Film size={11} />
                    <span>Casting Room</span>
                  </button>
                )}

                <button
                  onClick={onRunMatching}
                  disabled={isMatchingRunning}
                  className="h-7 px-2.5 rounded-ctl bg-surface border border-line-strong hover:border-ink text-ink font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw
                    size={11}
                    className={isMatchingRunning ? 'animate-spin text-ink' : ''}
                  />
                  <span>{isMatchingRunning ? 'Re-scoring...' : 'Re-run Engine'}</span>
                </button>

                <div className="flex items-center gap-1.5 bg-surface border border-line-strong px-2 py-0.5 rounded-ctl shadow-2xs">
                  <span className="font-mono text-[10px] text-ink-3 uppercase">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[11px] font-medium text-ink focus:outline-none cursor-pointer font-ui"
                  >
                    <option value="fit">Best Fit</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="fastest">Fastest Turnaround</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error or Loading Banners */}
            {matchingError && (
              <div className="p-3 mb-4 rounded-card bg-blocked/10 border border-blocked/30 text-blocked text-[12px] flex items-center justify-between">
                <span>{matchingError}</span>
                <button
                  onClick={onRunMatching}
                  className="font-mono text-[11px] underline uppercase"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty Matches State */}
            {matchedCreators.length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-card border border-dashed border-line space-y-3 my-8">
                <div className="w-10 h-10 rounded-full bg-sunken flex items-center justify-center mx-auto text-ink-3">
                  <Sliders size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-ui font-semibold text-base text-ink">
                    No creators fit the current constraints
                  </h3>
                  <p className="text-[12px] text-ink-2 max-w-sm mx-auto">
                    Adjust your budget slider or relax commercial rights requirements on the left rail to unlock matched creators.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setBudgetCap(100000);
                    setCommercialOnly(false);
                    setSelectedFormat('All');
                    setSelectedPlatform('All');
                  }}
                  className="h-8 px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-white font-mono text-[11px] font-medium transition-colors cursor-pointer border border-ink"
                >
                  Relax All Levers
                </button>
              </div>
            ) : (
              /* 3-Column Matches Card Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                <AnimatePresence>
                  {displayedMatches.map((creator, idx) => {
                    const heroWork = creator.portfolio?.[0] || {
                      imageUrl: creator.avatar,
                      title: 'Generative Specimen',
                    };
                    const isShortlisted = shortlistedIds.includes(creator.id);
                    const isComparing = comparingIds.includes(creator.id);
                    const isOverCap = (creator.minPrice || 0) > budgetCap;
                    const isHovered = hoveredCreatorId === creator.id;
                    const platformName = creator.channel?.platform || 'Instagram';
                    const followerStr =
                      creator.channel?.firstLastFollowers?.last?.split(' ')?.[0] || '140K';
                    const handle = creator.channel?.handle || `@${creator.slug || 'creator'}`;
                    const engRate =
                      creator.channel?.engagementSeries?.[
                        creator.channel.engagementSeries.length - 1
                      ] || '5.1';

                    return (
                      <motion.div
                        key={creator.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        whileHover={{ y: -4 }}
                        onMouseEnter={() => setHoveredCreatorId(creator.id)}
                        onClick={() => setHoveredCreatorId(creator.id)}
                        className={`group rounded-card bg-surface border-2 transition-all duration-200 shadow-2xs hover:shadow-float flex flex-col justify-between overflow-hidden cursor-pointer ${
                          isHovered ? 'border-ink shadow-float' : 'border-line hover:border-line-strong'
                        }`}
                      >
                        {/* Cinematic Banner */}
                        <div className="relative h-[135px] xl:h-[142px] w-full overflow-hidden bg-stage-raised flex-shrink-0">
                          <img
                            src={heroWork.imageUrl || creator.avatar}
                            alt={creator.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                          <CropMarks hoverable={true} dark={true} offset={6} length={10} />

                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                            <span className="font-mono text-[9px] bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded border border-white/10 font-semibold uppercase">
                              #{idx + 1} TOP MATCH
                            </span>
                            <span className="font-mono text-[9px] bg-verified/25 backdrop-blur-md text-white px-2 py-0.5 rounded border border-verified/50 font-bold">
                              {creator.fitScore || 95}% FIT
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                            <div>
                              <h4 className="font-display text-lg text-white font-medium leading-tight drop-shadow-sm">
                                {creator.name}
                              </h4>
                              <p className="font-mono text-[9.5px] text-white/80 mt-0.5">
                                {creator.role?.split('&')?.[0] || 'CGI Art Director'}
                              </p>
                            </div>
                            <span className="font-mono text-[9.5px] bg-white/20 backdrop-blur-md text-white px-1.5 py-0.5 rounded font-medium">
                              {creator.turnaround || '3-5d'}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                          {/* Channel & Follower Strip */}
                          <div className="p-2 rounded-ctl bg-paper border border-line space-y-1 transition-colors group-hover:bg-sunken/40">
                            <div className="flex items-center justify-between font-mono text-[9.5px]">
                              <span className="flex items-center gap-1.5 font-semibold text-ink uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                                <span>{platformName}</span>
                                <span className="text-ink-3 font-normal">{handle}</span>
                              </span>
                              <span className="text-verified font-medium text-[9px]">Active</span>
                            </div>
                            <div className="flex items-baseline justify-between pt-0.5">
                              <div className="flex items-baseline gap-1">
                                <span className="font-mono text-base font-bold text-ink tnum">
                                  {followerStr}
                                </span>
                                <span className="font-mono text-[10px] text-ink-3">Followers</span>
                              </div>
                              <span className="font-mono text-[10px] text-ink-2">
                                {engRate}% Eng Rate
                              </span>
                            </div>
                          </div>

                          {/* Starting Commission Box */}
                          <div className="flex items-center justify-between p-2 rounded-ctl bg-surface border border-line">
                            <div>
                              <span className="font-mono text-[8.5px] uppercase tracking-wider text-ink-3 block">
                                STARTING COMMISSION
                              </span>
                              <div className="font-mono text-base font-bold text-ink tnum">
                                {formatCurrency(creator.minPrice, currency)}
                              </div>
                            </div>
                            <div className="text-right">
                              {isOverCap ? (
                                <span className="font-mono text-[9px] text-blocked bg-blocked/10 px-1.5 py-0.5 rounded font-semibold border border-blocked/20">
                                  Over Cap
                                </span>
                              ) : (
                                <span className="font-mono text-[9px] text-verified bg-verified/10 px-1.5 py-0.5 rounded font-semibold border border-verified/20">
                                  In Budget
                                </span>
                              )}
                              <span className="font-mono text-[9px] text-ink-3 block mt-0.5">
                                {creator.revisions || 2} Revs Included
                              </span>
                            </div>
                          </div>

                          {/* Fit Breakdown Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[9px] bg-sunken px-1.5 py-0.5 rounded border border-line text-ink">
                              Style: {Math.round((creator.scoreBreakdown?.style_compatibility || 0.95) * 100)}%
                            </span>
                            <span className="font-mono text-[9px] bg-sunken px-1.5 py-0.5 rounded border border-line text-ink">
                              Toolchain: {Math.round((creator.scoreBreakdown?.skill_niche_relevance || 0.98) * 100)}%
                            </span>
                            <span className="font-mono text-[9px] bg-verified/10 text-verified px-1.5 py-0.5 rounded border border-verified/30 font-medium">
                              Cleared
                            </span>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="px-3 py-2 bg-paper/60 border-t border-line flex items-center justify-between gap-2 flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleShortlist(creator.id);
                              }}
                              className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                                isShortlisted
                                  ? 'bg-surface border border-ink text-ink hover:bg-paper'
                                  : 'bg-ink hover:bg-[#25231F] text-white border border-ink'
                              }`}
                            >
                              {isShortlisted ? (
                                <>
                                  <Check size={12} strokeWidth={2.5} />
                                  <span>Shortlisted</span>
                                </>
                              ) : (
                                <span>Shortlist</span>
                              )}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenFitSheet(creator);
                              }}
                              className="px-2.5 py-1.5 rounded-ctl bg-surface border border-line hover:border-ink font-mono text-[11px] text-ink transition-colors cursor-pointer"
                              title="Inspect full creator portfolio dossier & fit breakdown"
                            >
                              <FileText size={13} />
                            </button>
                          </div>

                          <label
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 cursor-pointer font-mono text-[10px] text-ink-3 hover:text-ink select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isComparing}
                              onChange={() => toggleCompare(creator.id)}
                              className="accent-ink rounded"
                            />
                            <span>Compare</span>
                          </label>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Reserve Creators: "Just outside your brief" */}
            {viewMode === 'all' && reserveCreators.length > 0 && (
              <div className="mt-8 pt-6 border-t border-line space-y-3">
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3">
                    NEGOTIATION OPPORTUNITY
                  </span>
                  <h3 className="font-display text-xl text-ink">
                    Just outside your brief ({reserveCreators.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reserveCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="p-3 bg-surface rounded-card border border-line flex items-center justify-between gap-3 shadow-2xs hover:border-line-strong transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-10 h-10 rounded-ctl object-cover border border-line"
                        />
                        <div>
                          <div className="font-medium text-ink text-[13px]">{creator.name}</div>
                          <div className="font-mono text-[10px] text-blocked mt-0.5">
                            {creator.failingConstraint}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyLever(creator)}
                        className="px-2.5 py-1 rounded-ctl bg-surface border border-line-strong hover:border-ink font-mono text-[10.5px] text-ink transition-colors flex items-center gap-1 shadow-2xs flex-shrink-0 cursor-pointer"
                      >
                        <span>{creator.leverAction}</span>
                        <span>→</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Action Bar */}
      {comparingIds.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-40 bg-ink text-surface px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-ink-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="font-mono text-[12px] font-medium">
            {comparingIds.length} creators selected for comparison
          </span>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1 rounded-full bg-surface text-ink hover:bg-paper font-mono text-[11px] font-semibold transition-colors cursor-pointer border border-line"
          >
            Launch matrix →
          </button>
          <button
            onClick={() => setComparingIds([])}
            className="text-surface/60 hover:text-white transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Advanced Creator Comparison Workspace */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <CreatorComparisonWorkspace
            creators={comparedCreators}
            campaign={campaign}
            currency={currency}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={onToggleShortlist}
            onClose={() => setIsCompareModalOpen(false)}
          />
        )}
      </AnimatePresence>


      {/* Docked Campaign Workflow Action Bar */}
      <CampaignActionBar
        backLabel="1 Brief"
        onBack={onBack}
        statusText={`${matchedCreators.length} matches · ${shortlistedIds.length} shortlisted · ${formatCurrency(budgetCap, currency)}`}
        forwardLabel={`Review shortlist (${shortlistedIds.length})`}
        onForward={onProceedToShortlist}
      />
    </div>
  );
}
