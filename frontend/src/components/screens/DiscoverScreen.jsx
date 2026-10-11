import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { formatRupees, formatCurrency } from '../../utils/formatters';

/**
 * FitLevelBadge indicator component matching P2 specification
 */
export function FitLevelBadge({ level = 'Strong', className = '' }) {
  let bars = 3;
  let textCls = 'text-ink';
  if (level === 'Strong') {
    bars = 3;
  } else if (level === 'Good') {
    bars = 2;
  } else {
    bars = 1;
    textCls = 'text-unverified';
  }
  return (
    <div className={`inline-flex items-center gap-2 flex-shrink-0 whitespace-nowrap ${className}`}>
      <div className="flex items-center gap-1 flex-shrink-0" aria-label={`Fit level: ${level}`}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className={`w-3 h-1.5 rounded-[1px] transition-colors ${
              idx <= bars ? 'bg-verified' : 'bg-sunken border border-line'
            }`}
          />
        ))}
      </div>
      <span className={`font-mono text-[10.5px] uppercase tracking-wider font-semibold ${textCls}`}>
        {level} Fit
      </span>
    </div>
  );
}

/**
 * DiscoverScreen
 * Colophon Editorial Discover Creators & Works Gallery
 * Exact restoration of P2 design:
 * - Public archive header with search, ledger refresh, and error testing
 * - Style filter chips: All, neo-product, film-grain cinematic, gouache and pastel, etc.
 * - Works (3-column aspect 4:5 gallery with CropMarks & creator strips) vs Creators tabs
 * - Full live data binding
 *
 * @param {{
 *   creators?: any[];
 *   onOpenColophon?: (work: any, creator: any) => void;
 *   onOpenFitSheet?: (creator: any) => void;
 *   onSelectCreator?: (creator: any) => void;
 * }} props
 */
export function DiscoverScreen({
  creators = [],
  onOpenColophon = (_work, _creator) => {},
  onOpenFitSheet = (_creator) => {},
  onSelectCreator = (_creator) => {},
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('works');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 350);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setHasSimulatedError(false);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSimulatedErrorToggle = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setHasSimulatedError(true);
    }, 350);
  };

  // Compact gallery: one primary specimen work per creator
  const allWorks = useMemo(() => {
    return creators.flatMap((c) => {
      const primaryWork = c.portfolio && c.portfolio.length > 0 ? c.portfolio[0] : null;
      if (!primaryWork) return [];
      return [{
        ...primaryWork,
        creator: c,
      }];
    });
  }, [creators]);

  // Filtered works
  const filteredWorks = useMemo(() => {
    return allWorks.filter((w) => {
      const q = searchQuery.toLowerCase();
      const creatorName = (w.creator?.name || '').toLowerCase();
      const title = (w.title || '').toLowerCase();
      const tools = (w.tools || []).map((t) => t.toLowerCase());
      const role = (w.creator?.role || '').toLowerCase();
      const family = (w.creator?.family || '').toLowerCase();

      const matchesSearch =
        !q ||
        title.includes(q) ||
        creatorName.includes(q) ||
        role.includes(q) ||
        family.includes(q) ||
        tools.some((t) => t.includes(q));

      const matchesStyle =
        selectedStyle === 'All' ||
        w.creator?.family?.toLowerCase() === selectedStyle.toLowerCase() ||
        (w.creator?.rawProfile?.niches || []).some(
          (n) => n.toLowerCase() === selectedStyle.toLowerCase()
        );

      const matchesCommercial =
        !commercialOnly || (w.rightsStatus && w.rightsStatus.includes('COMMERCIAL'));

      return matchesSearch && matchesStyle && matchesCommercial;
    });
  }, [allWorks, searchQuery, selectedStyle, commercialOnly]);

  // Filtered creators
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      const q = searchQuery.toLowerCase();
      const name = (c.name || '').toLowerCase();
      const role = (c.role || '').toLowerCase();
      const family = (c.family || '').toLowerCase();
      const tools = (c.tools || []).map((t) => t.toLowerCase());

      const matchesSearch =
        !q ||
        name.includes(q) ||
        role.includes(q) ||
        family.includes(q) ||
        tools.some((t) => t.includes(q));

      const matchesStyle =
        selectedStyle === 'All' ||
        family.toLowerCase() === selectedStyle.toLowerCase() ||
        (c.rawProfile?.niches || []).some(
          (n) => n.toLowerCase() === selectedStyle.toLowerCase()
        );

      const matchesCommercial = !commercialOnly || c.commercialDeclared;

      return matchesSearch && matchesStyle && matchesCommercial;
    });
  }, [creators, searchQuery, selectedStyle, commercialOnly]);

  const styleChips = [
    'All',
    'neo-product',
    'film-grain cinematic',
    'gouache and pastel illustration',
    'retro-futurist 3D type',
    'fashion editorial',
    'isometric and architectural worlds',
  ];

  const handleCreatorClick = (creator) => {
    if (onSelectCreator) {
      onSelectCreator(creator);
    } else {
      window.location.hash = `/creators/${creator.id}`;
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-6">
      {/* Header and Controls */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3">
            VERIFIED REGISTRY · PUBLIC ARCHIVE
          </span>
          <h1 className="font-display text-4xl text-ink leading-tight mt-1 font-normal">
            Discover Creators & Works
          </h1>
        </div>

        {/* Search Bar with Refresh and Test Error */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by aesthetic family, tool (e.g. ComfyUI, Midjourney), or creator name..."
              className="w-full h-12 pl-12 pr-4 rounded-ctl bg-surface border border-line-strong text-[15px] text-ink placeholder:text-ink-3 focus:border-cobalt focus:outline-none font-ui"
            />
          </div>

          <div className="flex items-center gap-1.5 h-12 px-2 bg-surface rounded-ctl border border-line-strong flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh discovery ledger"
              className="p-2 rounded-ctl text-ink-3 hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-cobalt' : ''} />
            </button>
            <button
              onClick={() => (hasSimulatedError ? setHasSimulatedError(false) : handleSimulatedErrorToggle())}
              className={`px-2 py-1 rounded-[4px] font-mono text-[10.5px] uppercase border transition-colors cursor-pointer ${
                hasSimulatedError
                  ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                  : 'bg-paper text-ink-3 border-line hover:text-ink hover:border-line-strong'
              }`}
              title="Toggle simulated discovery registry error"
            >
              {hasSimulatedError ? 'Error Active' : 'Test Error'}
            </button>
          </div>
        </div>

        {/* Style Filter Chips and Works/Creators Tab Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-ink-3 mr-1">STYLE:</span>
            {styleChips.map((style) => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className={`px-2.5 py-1 rounded-ctl text-[11px] font-mono transition-colors cursor-pointer ${
                  selectedStyle === style
                    ? 'bg-cobalt-tint border border-cobalt text-cobalt font-semibold'
                    : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-sunken p-1 rounded-ctl border border-line self-start sm:self-auto flex-shrink-0">
            <button
              onClick={() => setActiveTab('works')}
              className={`px-3 py-1 rounded-[4px] font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                activeTab === 'works'
                  ? 'bg-surface text-ink font-semibold shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Works ({filteredWorks.length})
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-3 py-1 rounded-[4px] font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                activeTab === 'creators'
                  ? 'bg-surface text-ink font-semibold shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Creators ({filteredCreators.length})
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Error Alert */}
      {hasSimulatedError && (
        <div className="p-4 rounded-card bg-red-50/70 border border-red-200 text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={16} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-ui font-semibold text-[13.5px] text-ink leading-tight">
                Creator Discovery Registry Offline
              </h4>
              <p className="font-ui text-[12px] text-ink-3 mt-0.5">
                HTTP 502 Bad Gateway: Unable to query external provenance database. Showing cached local roster.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-ctl bg-ink hover:bg-ink-light text-white text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Retry Discovery Engine
            </button>
            <button
              onClick={() => setHasSimulatedError(false)}
              className="px-3.5 py-1.5 rounded-ctl bg-surface border border-line text-ink-2 hover:text-ink text-[12px] font-medium transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isRefreshing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="space-y-3 animate-pulse">
              <div className="aspect-[4/5] rounded-card bg-sunken border border-line" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-line" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 bg-line rounded" />
                    <div className="h-3 w-16 bg-line rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-line rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Works Gallery Tab: 3-Column Image-Led Grid */}
      {!isRefreshing && activeTab === 'works' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-surface rounded-card border border-dashed border-line space-y-2">
              <p className="font-display text-xl text-ink">No works match your filter criteria.</p>
              <p className="text-[13px] text-ink-2">Try selecting "All" styles or clearing your search query.</p>
            </div>
          ) : (
            filteredWorks.map((work, idx) => (
              <div key={idx} className="group space-y-2">
                {/* 4:5 Large Portfolio Image Container */}
                <div
                  onClick={() => onOpenColophon?.(work, work.creator)}
                  className="relative aspect-[4/5] rounded-card overflow-hidden bg-sunken border border-line cursor-pointer"
                  title="Click to inspect specimen in Colophon"
                >
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                  />
                  <CropMarks hoverable={true} />
                </div>

                {/* Creator Identity & Platform Info Beneath Work Previews */}
                <div className="space-y-1.5 pt-1">
                  <div
                    onClick={() => handleCreatorClick(work.creator)}
                    className="flex items-center justify-between group/creator cursor-pointer p-2 -mx-2 rounded-ctl hover:bg-surface border border-transparent hover:border-line transition-all bg-surface/30"
                    title={`Click to view ${work.creator.name}'s followers, reels, photoshoots & details`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 group-hover/creator:border-cobalt transition-colors shadow-2xs">
                        <img
                          src={work.creator.avatar}
                          alt={work.creator.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-ink text-[13px] group-hover/creator:text-cobalt transition-colors block leading-tight">
                            {work.creator.name}
                          </span>
                          <ArrowUpRight
                            size={12}
                            className="text-ink-3 group-hover/creator:text-cobalt transition-colors"
                          />
                        </div>
                        <span className="text-[11px] text-ink-3 block truncate max-w-[150px]">
                          {work.creator.role?.split('&')?.[0] || work.creator.role || 'Generative Artist'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                      {work.creator.channel?.firstLastFollowers?.last ? (
                        <span className="font-semibold text-ink bg-sunken px-2 py-0.5 rounded-[4px] border border-line flex items-center gap-1 group-hover/creator:border-cobalt/40 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                          {work.creator.channel.firstLastFollowers.last.split(' ')[0]} Followers
                        </span>
                      ) : (
                        <span className="text-ink-3">Independent</span>
                      )}
                      <span className="text-cobalt text-[9.5px] uppercase tracking-wider font-semibold bg-cobalt-tint/30 px-1.5 py-0.2 rounded-[3px]">
                        {work.creator.formats?.join(' · ') || 'Reels 9:16 · Photoshoots 4:5'}
                      </span>
                    </div>
                  </div>
                </div>

                <CreditLine
                  work={work}
                  creator={work.creator}
                  onOpenColophon={onOpenColophon}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Creators Tab */}
      {!isRefreshing && activeTab === 'creators' && (
        <div className="space-y-4">
          {filteredCreators.length === 0 ? (
            <div className="py-16 text-center bg-surface rounded-card border border-dashed border-line space-y-2">
              <p className="font-display text-xl text-ink">No creators match your query.</p>
              <p className="text-[13px] text-ink-2">Try adjusting your filters or style selection.</p>
            </div>
          ) : (
            filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="p-5 rounded-card bg-surface border border-line hover:border-line-strong transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xs group"
              >
                <div
                  onClick={() => handleCreatorClick(creator)}
                  className="flex items-start sm:items-center gap-4 cursor-pointer flex-1"
                  title={`Click to view ${creator.name}'s followers, reels, photoshoots & details`}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 group-hover:border-cobalt transition-colors">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-ui font-semibold text-[17px] text-ink group-hover:text-cobalt transition-colors">
                        {creator.name}
                      </h3>
                      <FitLevelBadge level={creator.fitLevel || 'Strong'} />
                      {creator.channel?.firstLastFollowers?.last && (
                        <span className="font-mono text-[11px] font-semibold text-verified bg-verified/10 px-2 py-0.5 rounded-[3px] border border-verified/20">
                          {creator.channel.firstLastFollowers.last.split(' ')[0]} Followers
                        </span>
                      )}
                    </div>
                    <p className="text-ink-2 text-[13px] leading-snug">
                      {creator.role} · {creator.location || 'Bengaluru, IN'}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      <span className="font-mono text-[10px] text-ink-3 uppercase mr-1">
                        DELIVERABLES:
                      </span>
                      {(creator.formats || ['Stills 4:5', 'Reels 9:16']).map((fmt) => (
                        <span
                          key={fmt}
                          className="font-mono text-[10px] bg-sunken px-2 py-0.5 rounded-[3px] border border-line text-ink font-medium"
                        >
                          {fmt}
                        </span>
                      ))}
                      <span className="font-mono text-[10px] text-ink-3 ml-2">
                        Starts at {formatRupees(creator.minPrice || 8500)} · {creator.turnaround || '3-5 days'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center flex-shrink-0">
                  <button
                    onClick={() => handleCreatorClick(creator)}
                    className="px-4 py-2 rounded-ctl bg-ink hover:bg-cobalt text-surface text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => onOpenFitSheet?.(creator)}
                    className="px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Fit sheet
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
