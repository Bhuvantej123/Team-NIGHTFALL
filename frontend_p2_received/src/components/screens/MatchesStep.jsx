import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X, ArrowLeft, ArrowRight, Check, Layers, Workflow, Film } from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { FitMeter } from '../common/FitMeter';
import { RangeFitBar } from '../common/RangeFitBar';
import { StatusGlyph } from '../common/StatusGlyph';
import { ToolMark } from '../common/ToolMark';
import { WorkflowStrip } from '../common/WorkflowStrip';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { PipelineView } from './PipelineView';
import { formatRupees } from '../../utils/formatters';

export function MatchesStep({
  campaign,
  creators = [],
  shortlistedIds = [],
  onToggleShortlist,
  onOpenFitSheet,
  onOpenColophon,
  onBack,
  onProceedToShortlist,
  onResetData,
}) {
  // Levers state (interactive rail)
  const [budgetLever, setBudgetLever] = useState(campaign?.budget || 10000);
  const [commercialOnly, setCommercialOnly] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('fit'); // 'fit', 'price', 'fastest'
  const [lastDelta, setLastDelta] = useState(null);

  // Compare mode inside step 2 (?compare=a,b)
  const [comparedIds, setComparedIds] = useState([]);
  const [isCompareSheetOpen, setIsCompareSheetOpen] = useState(false);
  const [differencesOnly, setDifferencesOnly] = useState(false);

  // Reserve promotion overrides
  const [promotedIds, setPromotedIds] = useState([]);

  // Compute matches vs reserve
  const { matchedCreators, reserveCreators } = useMemo(() => {
    let matches = [];
    let reserve = [];

    creators.forEach((c) => {
      const isPromoted = promotedIds.includes(c.id);
      const fitsBudget = isPromoted || c.minPrice <= budgetLever;
      const fitsCommercial = !commercialOnly || c.commercialDeclared || isPromoted;
      const fitsFormat = selectedFormat === 'All' || c.formats.includes(selectedFormat);
      const fitsPlatform = selectedPlatform === 'All' || c.platforms.includes(selectedPlatform);

      if (fitsBudget && fitsCommercial && fitsFormat && fitsPlatform) {
        matches.push(c);
      } else {
        if (!fitsBudget && fitsCommercial && fitsFormat && fitsPlatform) {
          reserve.push({
            ...c,
            failingConstraint: `Over budget by ${formatRupees(c.minPrice - budgetLever)}`,
            leverAction: `Raise budget to ${formatRupees(c.minPrice)}`,
            targetBudget: c.minPrice,
          });
        } else if (!fitsCommercial && fitsBudget) {
          reserve.push({
            ...c,
            failingConstraint: 'Rights not declared',
            leverAction: 'Ask for rights clearance',
            isRightsAction: true,
          });
        }
      }
    });

    if (sortBy === 'price') {
      matches.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'fastest') {
      matches.sort((a, b) => parseInt(a.turnaround) - parseInt(b.turnaround));
    } else {
      matches.sort((a, b) => b.fitScore - a.fitScore);
    }

    return { matchedCreators: matches, reserveCreators: reserve };
  }, [creators, budgetLever, commercialOnly, selectedFormat, selectedPlatform, sortBy, promotedIds]);

  const handlePromoteReserve = (c) => {
    if (c.targetBudget) {
      setBudgetLever(c.targetBudget);
      setLastDelta(`Budget raised to ${formatRupees(c.targetBudget)} (+1 creator)`);
    }
    setPromotedIds((prev) => [...prev, c.id]);
    setTimeout(() => setLastDelta(null), 3000);
  };

  const handleToggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter((item) => item !== id));
    } else {
      if (comparedIds.length >= 4) {
        alert('You can compare up to 4 creators at a time.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const comparedCreators = creators.filter((c) => comparedIds.includes(c.id));

  return (
    <div className="h-[calc(100vh-105px)] flex flex-col justify-between overflow-hidden bg-paper">
      {/* 2-Pane Work Area: Left is 100% FIXED & Constant, Right ONLY SCROLLS */}
        <div className="flex-1 flex gap-8 overflow-hidden px-6 pt-4 max-w-[1360px] w-full mx-auto">
          {/* Left Pane: 100% FIXED / Stationary Levers Rail with ZERO Scrollbars */}
          <aside className="w-[340px] flex-shrink-0 overflow-hidden">
            <div className="bg-surface p-5 rounded-card border border-line shadow-sm space-y-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3">
                  ACTIVE CAMPAIGN
                </span>
                <h2 className="font-display text-2xl text-ink leading-tight mt-0.5">
                  {campaign?.title || 'Velo-Stride Sneaker Drop'}
                </h2>
              </div>

              <div className="h-[1px] bg-line" />

              {/* Levers Header */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink font-semibold flex items-center gap-2">
                  <SlidersHorizontal size={14} strokeWidth={1.5} />
                  <span>LEVERS (CONSTRAINTS)</span>
                </span>
                {lastDelta && (
                  <span className="font-mono text-[10px] text-cobalt bg-cobalt-tint px-2 py-0.5 rounded-[4px] font-semibold">
                    {lastDelta}
                  </span>
                )}
              </div>

              {/* Lever 1: Budget Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[12px]">
                  <span className="text-ink-2">BUDGET CAP</span>
                  <span className="font-semibold text-ink tnum text-[14px]">
                    {formatRupees(budgetLever)}
                  </span>
                </div>
                <input
                  type="range"
                  min="8000"
                  max="50000"
                  step="1000"
                  value={budgetLever}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetLever(val);
                    setLastDelta(`Updated to ${formatRupees(val)}`);
                    setTimeout(() => setLastDelta(null), 2000);
                  }}
                  className="w-full accent-cobalt cursor-pointer h-2 bg-sunken rounded-full"
                />
                <div className="flex justify-between font-mono text-[10px] text-ink-3">
                  <span>₹8,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              {/* Lever 2: Commercial Rights Switch */}
              <div className="pt-2 border-t border-line/60">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div>
                    <div className="text-[13px] font-medium text-ink">
                      Commercial Rights
                    </div>
                    <div className="text-[11px] font-mono text-ink-3">
                      Only verified model licenses
                    </div>
                  </div>
                  {/* Pill Switch */}
                  <button
                    type="button"
                    onClick={() => setCommercialOnly(!commercialOnly)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      commercialOnly ? 'bg-cobalt' : 'bg-sunken border border-line-strong'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        commercialOnly ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Lever 3: Format Chips */}
              <div className="space-y-2 pt-2 border-t border-line/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 block">
                  FORMATS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Reel 9:16', 'Stills 4:5', 'Landscape 16:9'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-3 py-1.5 rounded-ctl text-[12px] font-mono transition-colors ${
                        selectedFormat === fmt
                          ? 'bg-cobalt-tint border border-cobalt text-cobalt font-medium'
                          : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lever 4: Platform Chips */}
              <div className="space-y-2 pt-2 border-t border-line/60">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 block">
                  PLATFORMS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Instagram', 'YouTube', 'Billboard', 'Web'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-3 py-1.5 rounded-ctl text-[12px] font-mono transition-colors ${
                        selectedPlatform === plat
                          ? 'bg-cobalt-tint border border-cobalt text-cobalt font-medium'
                          : 'bg-surface border border-line text-ink-2 hover:border-line-strong'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Pane: ONLY THIS AREA SCROLLS */}
          <div className="flex-1 h-full overflow-y-auto pr-3 pb-8 space-y-6">
            {/* Header Row: Headline & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-line pb-4">
              <div>
                <h1
                  aria-live="polite"
                  className="font-display text-4xl text-ink leading-tight"
                >
                  <span className="tnum font-medium mr-2">
                    {matchedCreators.length}
                  </span>
                  creators fit your brief
                </h1>
                <p className="font-mono text-[11px] text-ink-3 mt-1">
                  CALIBRATED BY SYNTHETIC PIPELINE & COMMERCIAL DECLARATION
                </p>
              </div>

              <div className="flex items-center gap-3">




                <div className="flex items-center gap-1.5 bg-surface border border-line-strong px-2.5 py-1 rounded-ctl">
                  <ArrowUpDown size={12} strokeWidth={1.5} className="text-ink-3" />
                  <span className="font-mono text-[11px] text-ink-3 uppercase">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[12px] font-medium text-ink focus:outline-none cursor-pointer"
                  >
                    <option value="fit">Best Fit</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="fastest">Fastest Turnaround</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Match Cards with Dark Stage Mats */}
            <div className="space-y-6">
              <AnimatePresence>
                {matchedCreators.map((creator, idx) => {
                  const leadWork = creator.portfolio[0] || {};
                  const otherWorks = creator.portfolio.slice(1, 3);
                  const isShortlisted = shortlistedIds.includes(creator.id);
                  const isCompared = comparedIds.includes(creator.id);

                  return (
                    <motion.div
                      key={creator.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18, delay: idx * 0.04 }}
                      className="group bg-surface rounded-card border border-line hover:border-line-strong p-6 transition-colors shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Left 45%: STAGE MAT UNDER MEDIA (#0D0D0B background) */}
                        <div className="md:col-span-5 space-y-2">
                          <div className="bg-stage p-3 rounded-card border border-stage-line">
                            <div className="flex gap-2">
                              {/* Large 4:5 Lead Piece */}
                              <div className="relative flex-1 aspect-[4/5] rounded-ctl overflow-hidden bg-stage-raised group/lead">
                                <img
                                  src={leadWork.imageUrl}
                                  alt={leadWork.title}
                                  className="w-full h-full object-cover"
                                />
                                <CropMarks hoverable={true} dark={true} />
                              </div>

                              {/* 2 Small Pieces */}
                              <div className="flex flex-col gap-2 w-20">
                                {otherWorks.map((w, wIdx) => (
                                  <div
                                    key={wIdx}
                                    className="relative flex-1 rounded-ctl overflow-hidden bg-stage-raised group/sub"
                                  >
                                    <img
                                      src={w.imageUrl}
                                      alt={w.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <CropMarks hoverable={true} dark={true} offset={3} length={8} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Museum Wall Credit Line on Paper below the mat */}
                          <div className="px-1 pt-1">
                            <CreditLine
                              work={leadWork}
                              creator={creator}
                              onOpenColophon={onOpenColophon}
                            />
                          </div>
                        </div>

                        {/* Right 55%: Creator info, Why sentence, Deliverables tags, Range bar, Actions */}
                        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                          <div>
                            {/* Name, Role & Fit Meter */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-ui font-semibold text-[19px] text-ink leading-tight">
                                    {creator.name}
                                  </h3>
                                  <span className="font-mono text-[10px] bg-verified/10 text-verified px-2 py-0.5 rounded-[3px] font-semibold">
                                    96% FIT
                                  </span>
                                </div>
                                <p className="text-ink-2 text-[13px] mt-0.5">
                                  {creator.role} · {creator.location}
                                </p>
                              </div>
                              <FitMeter level={creator.fitLevel} />
                            </div>

                            {/* Deliverables Tags (From Image 8 & Image 4) */}
                            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#EEF8F1] text-[#1F7A40] border border-[#CDEED5] font-semibold">
                                3 stills (4:5)
                              </span>
                              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#EEF8F1] text-[#1F7A40] border border-[#CDEED5] font-semibold">
                                2 reels (9:16)
                              </span>
                              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-sunken text-ink-3 border border-line">
                                14-day turnaround
                              </span>
                            </div>

                            {/* "Why" Sentence with Marker Yellow */}
                            <div className="mt-3.5 pt-3 border-t border-line/60">
                              <span className="font-mono text-[9px] uppercase tracking-[0.05em] text-ink-3 block mb-1">
                                WRITTEN FROM THE DATA ABOVE
                              </span>
                              <p className="text-[13px] text-ink leading-relaxed">
                                Matches deliverable requirements with{' '}
                                <span className="marker-stroke font-medium">
                                  {creator.criteria?.style?.evidence || creator.family}
                                </span>
                              </p>
                            </div>

                            {/* Range-fit bar */}
                            <div className="mt-4">
                              <RangeFitBar
                                minPrice={creator.minPrice}
                                maxPrice={creator.maxPrice}
                                budget={budgetLever}
                              />
                            </div>

                            {/* Unverified claims */}
                            {creator.unverifiedClaims && creator.unverifiedClaims.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {creator.unverifiedClaims.map((claim, uIdx) => (
                                  <div
                                    key={uIdx}
                                    className="flex items-center gap-1.5 font-mono text-[11px] text-unverified"
                                  >
                                    <StatusGlyph status="unverified" size={12} />
                                    <span>{claim.req} (Unverified)</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Warnings row (Master Plan Section 7 & 8) */}
                            {creator.channel?.trend === 'declining' && (
                              <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] text-ink-2 bg-sunken/60 px-2.5 py-1 rounded-[4px] border border-line">
                                <span className="w-1.5 h-1.5 rounded-full bg-unverified flex-shrink-0" />
                                <span>Audience declining (simulated) · {creator.channel.trendSentence}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions Row */}
                          <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {/* Shortlist button */}
                              <button
                                onClick={() => onToggleShortlist(creator.id)}
                                className={`px-4 py-2 rounded-ctl text-[13px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt ${
                                  isShortlisted
                                    ? 'bg-ink text-surface'
                                    : 'bg-surface border border-line-strong text-ink hover:border-ink'
                                }`}
                              >
                                {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                              </button>

                              {/* Fit Sheet tertiary button */}
                              <button
                                onClick={() => onOpenFitSheet(creator)}
                                className="px-2.5 py-1.5 text-[13px] text-ink-2 hover:text-ink underline underline-offset-4 font-medium"
                              >
                                Fit sheet
                              </button>
                            </div>

                            {/* Compare checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer select-none font-mono text-[12px] text-ink-2 hover:text-ink">
                              <input
                                type="checkbox"
                                checked={isCompared}
                                onChange={() => handleToggleCompare(creator.id)}
                                className="w-4 h-4 rounded-[4px] accent-cobalt cursor-pointer"
                              />
                              <span>Compare</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Reserve List: "Just outside your brief" */}
            {reserveCreators.length > 0 && (
              <div className="mt-10 pt-8 border-t border-line space-y-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3">
                    NEGOTIATION OPPORTUNITY
                  </span>
                  <h3 className="font-display text-2xl text-ink">
                    Just outside your brief ({reserveCreators.length})
                  </h3>
                  <p className="text-[13px] text-ink-2 mt-0.5">
                    These creators fail exactly one hard constraint. Click a lever action to bring them into range.
                  </p>
                </div>

                <div className="space-y-3">
                  {reserveCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="p-4 bg-surface rounded-card border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-12 h-12 rounded-ctl object-cover border border-line"
                        />
                        <div>
                          <div className="font-medium text-ink text-[15px]">
                            {creator.name}
                          </div>
                          <div className="font-mono text-[11px] text-blocked mt-0.5">
                            {creator.failingConstraint}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePromoteReserve(creator)}
                        className="px-3.5 py-1.5 rounded-ctl bg-surface border border-line-strong hover:border-ink font-mono text-[11px] text-ink transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
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

      {/* Docked Solid Bottom Action Bar */}
      <CampaignActionBar
        backLabel="1 Brief"
        onBack={onBack}
        statusText={`${matchedCreators.length} matches · ${shortlistedIds.length} shortlisted · ₹${budgetLever.toLocaleString('en-IN')}`}
        forwardLabel={`Review shortlist (${shortlistedIds.length})`}
        onForward={onProceedToShortlist}
        onResetData={onResetData}
      />

      {/* Compare Mode Slide-over Drawer (?compare=a,b) */}
      <AnimatePresence>
        {isCompareSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-5xl bg-surface border border-line rounded-card shadow-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink-3">
                    SIDE-BY-SIDE MATRIX
                  </span>
                  <h2 className="font-display text-2xl text-ink">
                    Comparing {comparedCreators.length} creators
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 font-mono text-[11px] text-ink-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={differencesOnly}
                      onChange={(e) => setDifferencesOnly(e.target.checked)}
                      className="accent-cobalt"
                    />
                    <span>Highlight differences only</span>
                  </label>

                  <button
                    onClick={() => setIsCompareSheetOpen(false)}
                    className="p-1 rounded-ctl hover:bg-sunken text-ink transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Compare Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparedCreators.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-paper rounded-ctl border border-line space-y-3"
                  >
                    <div className="aspect-[4/5] rounded-ctl overflow-hidden bg-stage">
                      <img
                        src={c.portfolio[0]?.imageUrl || c.avatar}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-ink text-[14px]">
                        {c.name}
                      </div>
                      <div className="text-[12px] text-ink-2">
                        {c.family}
                      </div>
                    </div>
                    <div className="font-mono text-[12px] text-ink font-semibold">
                      {formatRupees(c.minPrice)} – {formatRupees(c.maxPrice)}
                    </div>
                    <div className="text-[11px] font-mono text-ink-3">
                      Turnaround: {c.turnaround}
                    </div>
                    <button
                      onClick={() => onToggleShortlist(c.id)}
                      className={`w-full py-1.5 rounded-ctl font-mono text-[11px] uppercase font-semibold transition-colors ${
                        shortlistedIds.includes(c.id)
                          ? 'bg-ink text-surface'
                          : 'bg-surface border border-line text-ink'
                      }`}
                    >
                      {shortlistedIds.includes(c.id) ? 'Shortlisted' : 'Shortlist'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Compare Launcher Pill if creators checked */}
      {comparedIds.length > 0 && !isCompareSheetOpen && (
        <div className="fixed bottom-18 left-1/2 -translate-x-1/2 z-40 bg-ink text-surface px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-ink-2 animate-bounce">
          <span className="font-mono text-[12px] font-medium">
            {comparedIds.length} creators selected for comparison
          </span>
          <button
            onClick={() => setIsCompareSheetOpen(true)}
            className="px-3 py-1 rounded-full bg-cobalt hover:bg-cobalt-press text-white font-mono text-[11px] font-semibold transition-colors"
          >
            Launch matrix →
          </button>
          <button
            onClick={() => setComparedIds([])}
            className="text-surface/60 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
