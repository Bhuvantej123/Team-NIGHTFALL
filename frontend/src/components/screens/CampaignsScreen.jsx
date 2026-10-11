import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Clock,
  Layers,
  SlidersHorizontal,
  Sliders,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { StatusGlyph } from '../common/StatusGlyph';
import { formatRupees, formatCurrency } from '../../utils/formatters';

/**
 * CampaignsScreen
 * Colophon Editorial Campaign Directory
 * Exact restoration of P2 design:
 * - 4 Metric overview blocks (Total Campaigns, In Production, Assets, Escrow)
 * - Interactive Brief Composer with quick suggestions & Priority Tasks
 * - Status filter tabs: ALL, DRAFT, BRIEF READY, MATCHES READY, SHORTLISTED, COMPLETED
 * - 3-Column card grid with cinematic cover images, gradient overlays, badges & 4-step workflow indicator
 * - Live campaign data binding with real action triggers
/**
 * @param {{
 *   campaigns?: any[];
 *   onSelectCampaign?: (id: string, step?: number) => void;
 *   onNewCampaignWithText?: (text?: string) => void;
 *   onOpenPipeline?: (id: string) => void;
 * }} props
 */
export function CampaignsScreen({
  campaigns = [],
  onSelectCampaign = (_id, _step) => {},
  onNewCampaignWithText = (_text) => {},
  onOpenPipeline = (_id) => {},
}) {
  const [inputText, setInputText] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setHasSimulatedError(false);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleSimulatedErrorToggle = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setHasSimulatedError(true);
    }, 400);
  };

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
    onNewCampaignWithText?.(inputText.trim() || sampleChips[0].text);
  };

  const getCoverImage = (camp) => {
    if (camp.coverImage) return camp.coverImage;
    const t = `${camp.title || ''} ${camp.brandName || ''} ${camp.description || ''}`.toLowerCase();
    if (t.includes('sneaker') || t.includes('footwear') || t.includes('velo'))
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80';
    if (t.includes('skincare') || t.includes('botanical') || t.includes('serum') || t.includes('nila'))
      return 'https://images.unsplash.com/photo-1608248597359-001099b22b7a?w=700&auto=format&fit=crop&q=80';
    if (t.includes('upi') || t.includes('soundbox') || t.includes('setu') || t.includes('fintech') || t.includes('merchant'))
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=80';
    if (t.includes('ceramic') || t.includes('homeware') || t.includes('komorebi') || t.includes('stoneware'))
      return 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=700&auto=format&fit=crop&q=80';
    if (t.includes('chronograph') || t.includes('watch') || t.includes('aethel') || t.includes('timepiece'))
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80';
    if (t.includes('olive') || t.includes('culinary') || t.includes('indus') || t.includes('oil'))
      return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=700&auto=format&fit=crop&q=80';
  };

  const uniqueCampaigns = React.useMemo(() => {
    const seen = new Set();
    return (campaigns || []).filter((c) => {
      if (!c?.id || seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [campaigns]);

  const totalCampaignsCount = uniqueCampaigns.length;
  const inProductionCount = uniqueCampaigns.filter(
    (c) => c.status === 'matches_ready' || c.status === 'in_pipeline' || c.status === 'active'
  ).length;
  const totalAssetsCount = uniqueCampaigns.reduce((acc, c) => {
    const text = c.deliverablesText || '';
    const match = text.match(/\d+/g);
    return acc + (match ? match.reduce((s, n) => s + parseInt(n, 10), 0) : 3);
  }, 0);
  const totalBudget = uniqueCampaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

  const filteredCampaigns = uniqueCampaigns.filter((c) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'DRAFT') return c.status === 'draft';
    if (filterStatus === 'BRIEF READY') return c.status === 'brief_ready';
    if (filterStatus === 'MATCHES READY') return c.status === 'matches_ready' || c.status === 'active';
    if (filterStatus === 'SHORTLISTED') return c.status === 'shortlisted' || c.status === 'in_pipeline';
    if (filterStatus === 'COMPLETED') return c.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted':
        return {
          label: 'SHORTLISTED',
          dot: 'bg-indigo-500',
          badgeCls: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80',
          stageIdx: 2,
        };
      case 'matches_ready':
      case 'active':
        return {
          label: 'MATCHES READY',
          dot: 'bg-emerald-500',
          badgeCls: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80',
          stageIdx: 1,
        };
      case 'in_pipeline':
        return {
          label: 'IN PRODUCTION',
          dot: 'bg-ink',
          badgeCls: 'bg-sunken text-ink border-line',
          stageIdx: 3,
        };
      case 'brief_ready':
        return {
          label: 'BRIEF READY',
          dot: 'bg-amber-500',
          badgeCls: 'bg-amber-50/90 text-amber-700 border-amber-200/80',
          stageIdx: 0,
        };
      case 'completed':
        return {
          label: 'COMPLETED',
          dot: 'bg-slate-400',
          badgeCls: 'bg-slate-100 text-slate-600 border-slate-200',
          stageIdx: 3,
        };
      default:
        return {
          label: 'DRAFT BRIEF',
          dot: 'bg-ink-3/40',
          badgeCls: 'bg-paper text-ink-3 border-line border-dashed',
          stageIdx: 0,
        };
    }
  };

  const stages = ['Brief', 'Matches', 'Shortlist', 'Flight'];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-9 pb-28">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            <span>COLOPHON · CAMPAIGN REGISTRY & PRODUCTION SUITE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-1.5 font-normal">
            Creative Campaigns
          </h1>
          <p className="text-[14px] text-ink-2 mt-1 max-w-2xl font-ui">
            Deploy precision creative briefs, tune synthetic creator matching parameters, and manage escrow disbursements.
          </p>
        </div>

        <button
          onClick={() => onNewCampaignWithText?.()}
          className="group h-10 px-4 rounded-ctl bg-ink hover:bg-[#26241E] text-surface text-[13px] font-medium tracking-tight border border-ink shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer active:scale-[0.98]"
        >
          <span className="w-4 h-4 rounded-full bg-surface/15 flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-colors duration-150">
            <Plus size={11} strokeWidth={2.5} />
          </span>
          <span>New Campaign</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Campaigns */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-2 hover:border-line-strong transition-colors">
          <div className="flex items-center justify-between text-ink-3">
            <span className="font-mono text-[10px] uppercase tracking-wider">Total Campaigns</span>
            <LayoutGrid size={14} className="text-ink-3" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-semibold text-ink tnum">
              {totalCampaignsCount}
            </div>
            <span className="font-mono text-[10px] text-verified font-medium bg-verified/10 px-1.5 py-0.5 rounded">
              Active Registry
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">Across 6 Creative Families</span>
        </div>

        {/* In Production Flights */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-2 hover:border-line-strong transition-colors">
          <div className="flex items-center justify-between text-ink-3">
            <span className="font-mono text-[10px] uppercase tracking-wider">In Production Flights</span>
            <Clock size={14} className="text-ink-2" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-semibold text-verified tnum">
              {inProductionCount}
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-verified">
              <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
              Live Flights
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">Matching & Escrow Lock</span>
        </div>

        {/* Commissioned Assets */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-2 hover:border-line-strong transition-colors">
          <div className="flex items-center justify-between text-ink-3">
            <span className="font-mono text-[10px] uppercase tracking-wider">Commissioned Assets</span>
            <Layers size={14} className="text-ink" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-semibold text-ink tnum">
              {totalAssetsCount}
            </div>
            <span className="font-mono text-[10px] text-ink-2 bg-sunken px-1.5 py-0.5 rounded">
              4K DCI-P3
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">Stills 4:5 & Reels 9:16</span>
        </div>

        {/* Escrow Capital */}
        <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-2 hover:border-line-strong transition-colors">
          <div className="flex items-center justify-between text-ink-3">
            <span className="font-mono text-[10px] uppercase tracking-wider">Escrow Capital</span>
            <ShieldCheck size={14} className="text-verified" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-semibold text-ink tnum">
              {formatRupees(totalBudget)}
            </div>
            <span className="font-mono text-[10px] text-verified bg-verified/10 px-1.5 py-0.5 rounded font-medium">
              100% Protected
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-3 block">Milestone Smart Escrow</span>
        </div>
      </div>

      {/* Brief Composer Box */}
      <div className="bg-surface rounded-card border border-line p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-sunken text-ink flex items-center justify-center border border-line">
              <Sliders size={13} />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
              BRIEF COMPOSER & SYNTHETIC MATCHING
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

        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a creative brief prompt: e.g. 3 photorealistic sneaker hero stills for billboard in Mumbai with commercial rights..."
            className="w-full h-12 pl-4 pr-36 rounded-ctl bg-paper border border-line text-[14px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-ink transition-colors font-ui"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 h-9 px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-surface text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-ink"
          >
            <span>Draft brief</span>
            <ArrowRight size={13} strokeWidth={1.5} />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto whitespace-nowrap py-1">
          <span className="font-mono text-[10px] text-ink-3 uppercase mr-1 flex-shrink-0">
            QUICK PROMPTS:
          </span>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onNewCampaignWithText?.(chip.text)}
              className="px-3 py-1.5 rounded-ctl bg-paper hover:bg-sunken border border-line hover:border-line-strong text-ink-2 hover:text-ink text-[11px] font-medium transition-all flex-shrink-0 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Priority Tasks Drawer */}
        {showIntelligence && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-line">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-ink-3 block">
                TODAY'S PRIORITY TASKS
              </span>
              <div className="space-y-2">
                <div
                  onClick={() => onSelectCampaign?.('camp-01', 2)}
                  className="p-3 bg-paper rounded-ctl border border-line hover:border-line-strong cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <StatusGlyph status="unverified" size={13} />
                    <span className="text-[13px] text-ink font-medium">
                      Review matches on Velo-Stride Urban Sneaker Drop
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-ink font-semibold">Open →</span>
                </div>
                <div
                  onClick={() => onSelectCampaign?.('camp-02', 2)}
                  className="p-3 bg-paper rounded-ctl border border-line hover:border-line-strong cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <StatusGlyph status="meets" size={13} />
                    <span className="text-[13px] text-ink font-medium">
                      Evaluate creator offers for Nila Monsoon Skincare
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-ink font-semibold">Open →</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-ink-3 block">
                BUDGET CALIBRATION LEVER
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

      {/* Filter Tabs & Registry Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['ALL', 'DRAFT', 'BRIEF READY', 'MATCHES READY', 'SHORTLISTED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] uppercase transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-ink text-surface font-semibold shadow-2xs'
                  : 'bg-surface border border-line text-ink-2 hover:text-ink'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink-3">
            SHOWING {filteredCampaigns.length} OF {campaigns.length} CAMPAIGNS
          </span>
          <div className="flex items-center gap-1.5 border-l border-line pl-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh campaign registry"
              className="p-1.5 rounded-ctl bg-surface border border-line hover:border-line-strong text-ink-3 hover:text-ink transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-ink' : ''} />
            </button>
            <button
              onClick={() => (hasSimulatedError ? setHasSimulatedError(false) : handleSimulatedErrorToggle())}
              className={`px-2 py-1 rounded-ctl font-mono text-[10px] uppercase border transition-colors cursor-pointer ${
                hasSimulatedError
                  ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                  : 'bg-paper text-ink-3 border-line hover:text-ink hover:border-line-strong'
              }`}
              title="Toggle simulated API network condition"
            >
              {hasSimulatedError ? 'Error Active' : 'Test Error'}
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Network Error Banner */}
      {hasSimulatedError && (
        <div className="p-4 rounded-card bg-red-50/70 border border-red-200 text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={16} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-ui font-semibold text-[13.5px] text-ink leading-tight">
                Remote Campaign Registry Sync Failed
              </h4>
              <p className="font-ui text-[12px] text-ink-3 mt-0.5">
                HTTP 503 Service Unavailable: Local cached campaigns displayed. Upstream verification ledger offline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-1.5 rounded-ctl bg-ink hover:bg-ink-light text-white text-[12px] font-medium transition-colors cursor-pointer shadow-2xs"
            >
              Retry Connection
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
      {isRefreshing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-card bg-surface border border-line shadow-2xs overflow-hidden animate-pulse space-y-4"
            >
              <div className="h-28 bg-line" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-28 bg-line rounded" />
                <div className="h-6 w-3/4 bg-line rounded" />
                <div className="h-4 w-full bg-line rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 3-Column Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredCampaigns.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center bg-surface rounded-card border border-dashed border-line space-y-4">
              <div className="w-12 h-12 rounded-full bg-sunken flex items-center justify-center mx-auto text-ink-3">
                <Sliders size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-ui font-semibold text-lg text-ink">
                  No campaigns match "{filterStatus}"
                </h3>
                <p className="text-[13px] text-ink-2 max-w-sm mx-auto">
                  There are currently no campaigns in this workflow state. Change the filter or initiate a new campaign brief.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setFilterStatus('ALL')}
                  className="h-9 px-4 rounded-ctl bg-surface border border-line-strong hover:border-ink text-ink font-mono text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => onNewCampaignWithText?.()}
                  className="h-9 px-4 rounded-ctl bg-ink hover:bg-[#25231F] text-white font-mono text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-ink"
                >
                  <Plus size={13} />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>
          ) : (
            filteredCampaigns.map((camp, idx) => {
              const badge = getStatusBadge(camp.status);
              const isPipeline = camp.status === 'in_pipeline';
              const isMatches = camp.status === 'matches_ready' || camp.status === 'active';
              const isShortlisted = camp.status === 'shortlisted';
              const isBrief = camp.status === 'brief_ready' || camp.status === 'draft';
              const isCompleted = camp.status === 'completed';
              const coverImg = getCoverImage(camp);

              return (
                <motion.div
                  key={camp.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="rounded-card bg-surface border border-line hover:border-line-strong transition-all duration-200 shadow-2xs hover:shadow-float flex flex-col justify-between overflow-hidden group h-full"
                >
                  {/* Cinematic Cover Banner with Status Strip */}
                  <div className="relative h-28 w-full overflow-hidden bg-stage-raised flex-shrink-0">
                    <img
                      src={coverImg}
                      alt={camp.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/90 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                          {camp.code || 'CAMPAIGN'} · {camp.brandName}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase font-semibold px-2 py-0.5 rounded backdrop-blur-md border shadow-2xs ${badge.badgeCls}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-white/90 font-mono text-[10px]">
                        <span>Submitted: {camp.submittedAt || 'Oct 2026'}</span>
                        <span className="bg-white/20 backdrop-blur-md px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold">
                          {camp.turnaround || '14 Days'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        onClick={() => onSelectCampaign?.(camp.id, camp.step || 1)}
                        className="font-display text-xl text-ink leading-snug group-hover:underline transition-colors cursor-pointer line-clamp-1 font-medium"
                      >
                        {camp.title}
                      </h3>
                      <p className="text-[13px] text-ink-2 line-clamp-2 leading-relaxed min-h-[38px] font-ui font-light">
                        {camp.description || camp.fullText}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="font-mono text-[10px] bg-paper px-2.5 py-1 rounded-[4px] border border-line text-ink font-medium">
                        {camp.deliverablesText || 'Custom Deliverables'}
                      </span>
                    </div>

                    {/* 4-Step Workflow Progress Bar */}
                    <div className="pt-2 border-t border-line/60">
                      <div className="flex items-center justify-between mb-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-3">
                        <span>Workflow Progress</span>
                        <span className="text-ink font-medium">{stages[badge.stageIdx]}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {stages.map((st, sIdx) => {
                          const isDone = sIdx < badge.stageIdx;
                          const isCurr = sIdx === badge.stageIdx;
                          return (
                            <div
                              key={st}
                              className={`h-1.5 rounded-full transition-all ${
                                isCurr
                                  ? 'bg-ink shadow-xs'
                                  : isDone
                                  ? 'bg-ink/70'
                                  : 'bg-sunken'
                              }`}
                              title={`${st} (${isDone ? 'Completed' : isCurr ? 'Active' : 'Pending'})`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Budget and Purposeful Action Buttons */}
                  <div className="px-5 py-3.5 bg-paper/70 border-t border-line flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[15px] font-bold text-ink tnum leading-tight">
                        {formatCurrency(camp.budget, camp.currency || 'USD')}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-3">
                        ALLOCATION
                      </div>
                    </div>

                    <div>
                      {isPipeline && (
                        <button
                          onClick={() => (onOpenPipeline ? onOpenPipeline(camp.id) : onSelectCampaign?.(camp.id, 2))}
                          className="h-8 px-3 rounded-ctl bg-surface border border-line-strong text-ink hover:border-ink font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Pipeline</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {isShortlisted && (
                        <button
                          onClick={() => onSelectCampaign?.(camp.id, 3)}
                          className="h-8 px-3 rounded-ctl bg-ink text-white hover:bg-[#25231F] font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border border-ink"
                        >
                          <span>Shortlist ({(camp.shortlistedCreatorIds && camp.shortlistedCreatorIds.length) || 1})</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {isMatches && (
                        <button
                          onClick={() => onSelectCampaign?.(camp.id, 2)}
                          className="h-8 px-3 rounded-ctl bg-ink text-surface hover:bg-[#25231F] font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs border border-ink"
                        >
                          <span>Matches ({camp.verifiedMatches || 8})</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {isBrief && (
                        <button
                          onClick={() => onSelectCampaign?.(camp.id, 1)}
                          className="h-8 px-3 rounded-ctl bg-surface border border-line-strong text-ink hover:border-ink font-mono text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Edit Brief</span>
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => onSelectCampaign?.(camp.id, 4)}
                          className="h-8 px-3 rounded-ctl bg-sunken border border-line text-ink-2 hover:text-ink font-mono text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>Summary</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
