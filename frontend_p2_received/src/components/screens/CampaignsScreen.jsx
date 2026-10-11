import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { StatusGlyph } from '../common/StatusGlyph';
import { formatRupees } from '../../utils/formatters';

/**
 * CampaignsScreen
 * Colophon Editorial Campaign Directory
 * - Clean metrics overview (Total Campaigns, In Production, Deliverables, Allocated Budget)
 * - Brief Composer with direct prompt triggers & suggestions
 * - Perfectly aligned 3x3 Card Grid with consistent heights, baseline alignment, and purposeful action triggers
 * - Strictly adhering to Colophon typography: Paper #F4F2ED, Ink #14130F, Cobalt #1447FF.
 */
export function CampaignsScreen({
  campaigns = [],
  onSelectCampaign,
  onNewCampaignWithText,
  onOpenPipeline,
}) {
  const [inputText, setInputText] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showIntelligence, setShowIntelligence] = useState(false);

  // Text-only suggestion chips (strictly NO emojis)
  const sampleChips = [
    {
      label: 'Urban sneaker drop (3 stills + 2 reels)',
      text: 'We need 3 photorealistic hero stills and 2 vertical 9:16 reels for an urban performance sneaker drop in Mumbai with commercial rights.',
    },
    {
      label: 'Botanical skincare launch',
      text: '4 soft pastel still compositions capturing morning rainwater on lotus leaves with organic gouache texture.',
    },
    {
      label: 'UPI soundbox explainer',
      text: '3 isometric animated explainer videos demonstrating instant merchant notification soundboxes.',
    },
    {
      label: 'Minimalist ceramics lookbook',
      text: '3 architectural product stills styled on raw travertine with dramatic directional afternoon sunlight.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewCampaignWithText(inputText.trim() || sampleChips[0].text);
  };

  // Metrics
  const totalCampaignsCount = campaigns.length;
  const activeCount = campaigns.filter(
    (c) => c.status === 'matches_ready' || c.status === 'in_pipeline' || c.status === 'active'
  ).length;
  const totalDeliverables = campaigns.reduce((acc, c) => {
    const text = c.deliverablesText || '';
    const match = text.match(/\d+/g);
    const count = match ? match.reduce((sum, n) => sum + parseInt(n, 10), 0) : 3;
    return acc + count;
  }, 0);
  const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

  // Status filtering
  const filteredCampaigns = campaigns.filter((c) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'MATCHES READY')
      return c.status === 'matches_ready' || c.status === 'active';
    if (filterStatus === 'IN PIPELINE') return c.status === 'in_pipeline';
    if (filterStatus === 'BRIEF READY') return c.status === 'brief_ready';
    if (filterStatus === 'COMPLETED') return c.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'matches_ready':
      case 'active':
        return {
          label: 'MATCHES READY',
          dot: 'bg-verified',
          cls: 'bg-surface text-ink border-line',
        };
      case 'in_pipeline':
        return {
          label: 'IN PIPELINE',
          dot: 'bg-cobalt',
          cls: 'bg-cobalt-tint text-cobalt border-cobalt/30',
        };
      case 'brief_ready':
        return {
          label: 'BRIEF READY',
          dot: 'bg-unverified',
          cls: 'bg-surface text-ink-2 border-line',
        };
      case 'completed':
        return {
          label: 'COMPLETED',
          dot: 'bg-ink-3',
          cls: 'bg-sunken text-ink-3 border-line',
        };
      case 'draft':
      default:
        return {
          label: 'DRAFT',
          dot: 'bg-ink-3/40',
          cls: 'bg-sunken text-ink-3 border-line border-dashed',
        };
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            <span>COLOPHON · CAMPAIGN DIRECTORY</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-1.5">
            Campaigns
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Commission creative briefs, calibrate synthetic matching levers, and oversee live creator deliverables.
          </p>
        </div>

        <button
          onClick={() => onNewCampaignWithText()}
          className="h-10 px-4 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} strokeWidth={2} />
          <span>New Campaign</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Campaigns */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-1">
          <span className="font-mono text-[11px] uppercase text-ink-3 tracking-wider block">
            Total Campaigns
          </span>
          <div className="font-mono text-3xl font-semibold text-ink tnum">
            {totalCampaignsCount}
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">
            Active in workspace
          </span>
        </div>

        {/* Active Campaigns */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-1">
          <span className="font-mono text-[11px] uppercase text-ink-3 tracking-wider block">
            In Production
          </span>
          <div className="font-mono text-3xl font-semibold text-[#1F7A40] tnum">
            {activeCount}
          </div>
          <span className="font-mono text-[11px] text-[#1F7A40] block">
            Matching & pipeline
          </span>
        </div>

        {/* Deliverables */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-1">
          <span className="font-mono text-[11px] uppercase text-ink-3 tracking-wider block">
            Commissioned Assets
          </span>
          <div className="font-mono text-3xl font-semibold text-ink tnum">
            {totalDeliverables}
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">
            Stills & motion reels
          </span>
        </div>

        {/* Total Budget */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-1">
          <span className="font-mono text-[11px] uppercase text-ink-3 tracking-wider block">
            Allocated Budget
          </span>
          <div className="font-mono text-3xl font-semibold text-ink tnum">
            {formatRupees(totalBudget)}
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">
            Smart escrow & terms
          </span>
        </div>
      </div>

      {/* Brief Composer Box */}
      <div className="bg-surface rounded-card border border-line p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
              BRIEF COMPOSER & MATCHING
            </span>
          </div>

          <button
            onClick={() => setShowIntelligence(!showIntelligence)}
            className="flex items-center gap-1 font-mono text-[11px] text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            <span>{showIntelligence ? 'Hide details' : 'Show Priority Tasks'}</span>
            {showIntelligence ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a creative brief prompt: e.g. 3 photorealistic sneaker hero stills for billboard in Mumbai with commercial rights..."
            className="w-full h-12 pl-4 pr-32 rounded-ctl bg-paper border border-line text-[14px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-cobalt transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 h-9 px-4 rounded-ctl bg-ink hover:bg-ink-2 text-surface text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Draft brief</span>
            <ArrowRight size={13} strokeWidth={1.5} />
          </button>
        </form>

        {/* Suggestions Row */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto whitespace-nowrap py-1">
          <span className="font-mono text-[10px] text-ink-3 uppercase mr-1 flex-shrink-0">
            SUGGESTIONS:
          </span>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNewCampaignWithText(chip.text)}
              className="px-3 py-1.5 rounded-ctl bg-paper border border-line text-ink-2 hover:text-ink hover:border-line-strong text-[11px] font-medium transition-colors flex-shrink-0 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Collapsible Intelligence Drawer */}
        {showIntelligence && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-line">
            {/* Priority Tasks */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-ink-3 block">
                TODAY'S PRIORITY TASKS
              </span>
              <div className="space-y-2">
                <div
                  onClick={() => onSelectCampaign('camp-01', 2)}
                  className="p-3 bg-paper rounded-ctl border border-line hover:border-line-strong cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <StatusGlyph status="unverified" size={13} />
                    <span className="text-[13px] text-ink font-medium">
                      Review matches on Velo-Stride Urban Sneaker Drop
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-cobalt font-medium">Open →</span>
                </div>
                <div
                  onClick={() => onSelectCampaign('camp-02', 2)}
                  className="p-3 bg-paper rounded-ctl border border-line hover:border-line-strong cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <StatusGlyph status="meets" size={13} />
                    <span className="text-[13px] text-ink font-medium">
                      Evaluate creator offers for Nila Monsoon Skincare
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-cobalt font-medium">Open →</span>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-ink-3 block">
                BUDGET CALIBRATION
              </span>
              <div className="p-3 bg-paper rounded-ctl border border-line space-y-1 text-[13px] text-ink leading-relaxed">
                <div className="font-semibold text-verified flex items-center gap-1 font-mono text-[11px]">
                  <span>↑ BUDGET LEVER OPPORTUNITY</span>
                </div>
                <p>
                  Calibrating Velo-Stride budget levers from ₹10,000 to ₹16,000 unlocks 3 verified CGI artists with perpetual commercial rights clearance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['ALL', 'MATCHES READY', 'IN PIPELINE', 'BRIEF READY', 'COMPLETED'].map((st) => {
            const isSelected = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] uppercase transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-surface font-semibold shadow-2xs'
                    : 'bg-surface border border-line text-ink-2 hover:text-ink'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        <span className="font-mono text-[11px] text-ink-3">
          SHOWING {filteredCampaigns.length} OF {campaigns.length} CAMPAIGNS
        </span>
      </div>

      {/* 3x3 Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredCampaigns.map((camp) => {
          const badge = getStatusBadge(camp.status);
          const isPipeline = camp.status === 'in_pipeline';
          const isMatches = camp.status === 'matches_ready' || camp.status === 'active';
          const isBrief = camp.status === 'brief_ready' || camp.status === 'draft';
          const isCompleted = camp.status === 'completed';

          return (
            <div
              key={camp.id}
              className="p-6 rounded-card bg-surface border border-line hover:border-line-strong transition-all shadow-2xs flex flex-col justify-between group h-full"
            >
              {/* Header: Code/Brand, Status Pill, Title & Description */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 truncate">
                    {camp.code || 'CAMPAIGN'} · {camp.brandName}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-medium px-2.5 py-1 rounded-[2px] border flex-shrink-0 ${badge.cls}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => onSelectCampaign(camp.id, camp.step || 1)}
                    className="font-ui font-semibold text-[18px] text-ink leading-snug group-hover:text-cobalt transition-colors cursor-pointer line-clamp-1"
                  >
                    {camp.title}
                  </h3>
                  <p className="text-[13px] text-ink-2 line-clamp-2 leading-relaxed mt-1.5 min-h-[38px]">
                    {camp.description || camp.fullText}
                  </p>
                </div>

                <span className="font-mono text-[10px] text-ink-3 block">
                  Submitted: {camp.submittedAt || 'Oct 2026'}
                </span>
              </div>

              {/* Deliverable Specifications */}
              <div className="mt-4 pt-3.5 border-t border-line/60 flex flex-wrap gap-1.5">
                <span className="font-mono text-[11px] bg-sunken px-2.5 py-1 rounded-ctl border border-line text-ink font-medium">
                  {camp.deliverablesText || 'Custom Deliverables'}
                </span>
                <span className="font-mono text-[11px] bg-sunken px-2.5 py-1 rounded-ctl border border-line text-ink-2">
                  {camp.turnaround || '14 Days'}
                </span>
              </div>

              {/* Card Footer: Budget & Primary Action Trigger */}
              <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-base font-semibold text-ink tnum leading-tight">
                    {formatRupees(camp.budget)}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
                    ALLOCATION
                  </div>
                </div>

                <div>
                  {isPipeline && (
                    <button
                      onClick={() =>
                        onOpenPipeline
                          ? onOpenPipeline(camp.id)
                          : onSelectCampaign(camp.id, 2)
                      }
                      className="h-8 px-3.5 rounded-ctl bg-surface border border-cobalt text-cobalt hover:bg-cobalt hover:text-white font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Pipeline</span>
                      <ArrowRight size={12} />
                    </button>
                  )}

                  {isMatches && (
                    <button
                      onClick={() => onSelectCampaign(camp.id, 2)}
                      className="h-8 px-3.5 rounded-ctl bg-ink text-surface hover:bg-ink-2 font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Matches ({camp.verifiedMatches || 8})</span>
                      <ArrowRight size={12} />
                    </button>
                  )}

                  {isBrief && (
                    <button
                      onClick={() => onSelectCampaign(camp.id, 1)}
                      className="h-8 px-3.5 rounded-ctl bg-surface border border-line-strong text-ink hover:border-ink font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Edit Brief</span>
                      <ArrowRight size={12} />
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => onSelectCampaign(camp.id, 4)}
                      className="h-8 px-3.5 rounded-ctl bg-sunken border border-line text-ink-2 hover:text-ink font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Summary</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
