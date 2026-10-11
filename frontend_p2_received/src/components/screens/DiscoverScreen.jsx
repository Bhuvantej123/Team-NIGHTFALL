import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowRight, User, Info, Film, Camera } from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { ToolMark } from '../common/ToolMark';
import { FitMeter } from '../common/FitMeter';
import { CreatorSheet } from '../common/CreatorSheet';
import { formatRupees } from '../../utils/formatters';

export function DiscoverScreen({
  creators = [],
  onOpenColophon,
  onOpenFitSheet,
  onSelectCreator,
  onOpenCreatorSheet,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('works'); // 'works' or 'creators'
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [commercialOnly, setCommercialOnly] = useState(false);
  const [sheetCreator, setSheetCreator] = useState(null);

  // Flatten all works across all creators
  const allWorks = creators.flatMap((c) =>
    (c.portfolio || []).map((w) => ({
      ...w,
      creator: c,
    }))
  );

  const filteredWorks = allWorks.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStyle =
      selectedStyle === 'All' || w.creator.family === selectedStyle;
    const matchesCommercial = !commercialOnly || w.rightsStatus.includes('COMMERCIAL');
    return matchesSearch && matchesStyle && matchesCommercial;
  });

  const filteredCreators = creators.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.family.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = selectedStyle === 'All' || c.family === selectedStyle;
    const matchesCommercial = !commercialOnly || c.commercialDeclared;
    return matchesSearch && matchesStyle && matchesCommercial;
  });

  const handleOpenCreator = (creator) => {
    if (onOpenCreatorSheet) {
      onOpenCreatorSheet(creator);
    } else {
      setSheetCreator(creator);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3">
            VERIFIED REGISTRY · PUBLIC ARCHIVE
          </span>
          <h1 className="font-display text-4xl text-ink leading-tight mt-1">
            Discover Creators & Works
          </h1>
        </div>

        {/* Search Input (Cmd+K) */}
        <div className="relative">
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
            className="w-full h-12 pl-12 pr-4 rounded-ctl bg-surface border border-line-strong text-[15px] text-ink placeholder:text-ink-3 focus:border-cobalt focus:outline-none"
          />
        </div>

        {/* Filter Row & Segmented Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase text-ink-3 mr-1">
              STYLE:
            </span>
            {[
              'All',
              'neo-product',
              'film-grain cinematic',
              'gouache and pastel illustration',
              'retro-futurist 3D type',
              'fashion editorial',
              'isometric and architectural worlds',
            ].map((sty) => (
              <button
                key={sty}
                onClick={() => setSelectedStyle(sty)}
                className={`px-2.5 py-1 rounded-ctl text-[11px] font-mono transition-colors ${
                  selectedStyle === sty
                    ? 'bg-cobalt-tint border border-cobalt text-cobalt font-semibold'
                    : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                }`}
              >
                {sty}
              </button>
            ))}
          </div>

          {/* Segmented Control (Works / Creators) */}
          <div className="flex items-center gap-1 bg-sunken p-1 rounded-ctl border border-line self-start sm:self-auto flex-shrink-0">
            <button
              onClick={() => setViewTab('works')}
              className={`px-3 py-1 rounded-[4px] font-mono text-[11px] uppercase transition-colors ${
                viewTab === 'works'
                  ? 'bg-surface text-ink font-semibold shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Works ({filteredWorks.length})
            </button>
            <button
              onClick={() => setViewTab('creators')}
              className={`px-3 py-1 rounded-[4px] font-mono text-[11px] uppercase transition-colors ${
                viewTab === 'creators'
                  ? 'bg-surface text-ink font-semibold shadow-sm'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              Creators ({filteredCreators.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content View: Works (Masonry Grid) */}
      {viewTab === 'works' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((w, idx) => (
            <div key={idx} className="group space-y-2">
              <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-sunken border border-line">
                <img
                  src={w.imageUrl}
                  alt={w.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <CropMarks hoverable={true} />
              </div>

              {/* Creator Attribution line & Credit line */}
              <div className="space-y-1.5 pt-1">
                <div
                  onClick={() => handleOpenCreator(w.creator)}
                  className="flex items-center justify-between group/creator cursor-pointer p-2 -mx-2 rounded-ctl hover:bg-surface border border-transparent hover:border-line transition-all bg-surface/30"
                  title={`Click to view ${w.creator.name}'s followers, reels, photoshoots & details`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 group-hover/creator:border-cobalt transition-colors shadow-2xs">
                      <img
                        src={w.creator.avatar}
                        alt={w.creator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-ink text-[13px] group-hover/creator:text-cobalt transition-colors block leading-tight">
                          {w.creator.name}
                        </span>
                        <Info size={12} className="text-ink-3 group-hover/creator:text-cobalt transition-colors" />
                      </div>
                      <span className="text-[11px] text-ink-3 block truncate max-w-[150px]">
                        {w.creator.role?.split('&')?.[0] || w.creator.role || 'Generative Artist'}
                      </span>
                    </div>
                  </div>

                  {/* Followers & Formats details (Reels, Photoshoots) */}
                  <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                    {w.creator.channel?.firstLastFollowers?.last ? (
                      <span className="font-semibold text-ink bg-sunken px-2 py-0.5 rounded-[4px] border border-line flex items-center gap-1 group-hover/creator:border-cobalt/40 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-verified" />
                        {w.creator.channel.firstLastFollowers.last.split(' ')[0]} Followers
                      </span>
                    ) : (
                      <span className="text-ink-3">Independent</span>
                    )}
                    <span className="text-cobalt text-[9.5px] uppercase tracking-wider font-semibold bg-cobalt-tint/30 px-1.5 py-0.2 rounded-[3px]">
                      {w.creator.formats?.join(' · ') || 'Reels 9:16 · Photoshoots 4:5'}
                    </span>
                  </div>
                </div>

                <CreditLine
                  work={w}
                  creator={w.creator}
                  onOpenColophon={onOpenColophon}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content View: Creators (Compact Rows with Followers & Deliverables) */}
      {viewTab === 'creators' && (
        <div className="space-y-4">
          {filteredCreators.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-card bg-surface border border-line hover:border-line-strong transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xs group"
            >
              <div
                onClick={() => handleOpenCreator(c)}
                className="flex items-start sm:items-center gap-4 cursor-pointer flex-1"
                title={`Click to view ${c.name}'s followers, reels, photoshoots & details`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0 group-hover:border-cobalt transition-colors">
                  <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-ui font-semibold text-[17px] text-ink group-hover:text-cobalt transition-colors">
                      {c.name}
                    </h3>
                    <FitMeter level={c.fitLevel} />
                    {c.channel?.firstLastFollowers?.last && (
                      <span className="font-mono text-[11px] font-semibold text-verified bg-verified/10 px-2 py-0.5 rounded-[3px] border border-verified/20">
                        {c.channel.firstLastFollowers.last.split(' ')[0]} Followers
                      </span>
                    )}
                  </div>

                  <p className="text-ink-2 text-[13px] leading-snug">
                    {c.role} · {c.location}
                  </p>

                  {/* Formats & What they do (Reels, Photoshoot, CGI) */}
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="font-mono text-[10px] text-ink-3 uppercase mr-1">
                      DELIVERABLES:
                    </span>
                    {(c.formats || ['Stills 4:5', 'Reels 9:16']).map((fmt) => (
                      <span
                        key={fmt}
                        className="font-mono text-[10px] bg-sunken px-2 py-0.5 rounded-[3px] border border-line text-ink font-medium"
                      >
                        {fmt}
                      </span>
                    ))}
                    <span className="font-mono text-[10px] text-ink-3 ml-2">
                      Starts at {formatRupees(c.minPrice)} · {c.turnaround}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start lg:self-center flex-shrink-0">
                <button
                  onClick={() => handleOpenCreator(c)}
                  className="px-4 py-2 rounded-ctl bg-ink hover:bg-ink-2 text-surface text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Quick details</span>
                  <Info size={13} />
                </button>

                <button
                  onClick={() =>
                    onSelectCreator
                      ? onSelectCreator(c)
                      : (window.location.hash = `/creators/${c.id}`)
                  }
                  className="px-3.5 py-2 rounded-ctl border border-line-strong hover:border-ink bg-surface text-ink text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Full profile</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  onClick={() => onOpenFitSheet(c)}
                  className="px-3.5 py-2 rounded-ctl border border-line hover:border-ink bg-surface text-ink text-[12px] font-medium transition-colors cursor-pointer"
                >
                  Fit sheet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over: Creator Details Drawer (Followers, Reels, Photoshoots, Bio, Tools) */}
      <CreatorSheet
        isOpen={Boolean(sheetCreator)}
        onClose={() => setSheetCreator(null)}
        creator={sheetCreator}
        onViewFullProfile={(c) => {
          setSheetCreator(null);
          if (onSelectCreator) onSelectCreator(c);
          else window.location.hash = `/creators/${c.id}`;
        }}
        onOpenColophon={onOpenColophon}
      />
    </div>
  );
}
