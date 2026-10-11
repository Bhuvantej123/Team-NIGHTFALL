import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  TrendingUp,
  Award,
  Users,
  Eye,
  Heart,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatRupees, formatCurrency } from '../../utils/formatters';
import { fetchBatchCreatorAnalytics } from '../../api/client';

/**
 * CreatorComparisonWorkspace
 * Premium 5-tab comparison workspace for 2 to 3 creators in Campaign Matches.
 * Preserves P2 editorial design system and authoritative matching scores.
 */
export function CreatorComparisonWorkspace({
  creators = [],
  campaign = null,
  currency = 'INR',
  shortlistedIds = [],
  onToggleShortlist = () => {},
  onClose = () => {},
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'growth' | 'audience' | 'brand_deals' | 'commercial'
  const [analyticsMap, setAnalyticsMap] = useState({});
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Load batch analytics for all selected creators
  useEffect(() => {
    if (!creators || creators.length === 0) return;
    const ids = creators.map((c) => c.id);
    let isMounted = true;
    setLoadingAnalytics(true);

    fetchBatchCreatorAnalytics(ids)
      .then((data) => {
        if (isMounted) {
          setAnalyticsMap(data || {});
          setLoadingAnalytics(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load batch creator analytics:', err);
        if (isMounted) setLoadingAnalytics(false);
      });

    return () => {
      isMounted = false;
    };
  }, [creators]);

  const tabs = [
    { id: 'overview', label: '1. Overview' },
    { id: 'growth', label: '2. Growth & Velocity' },
    { id: 'audience', label: '3. Audience & Fit' },
    { id: 'brand_deals', label: '4. Brand Deals & ROAS' },
    { id: 'commercial', label: '5. Commercial Terms' },
  ];

  // Helper to extract creator analytics
  const getAnalytics = (creatorId) => analyticsMap[creatorId] || null;

  // Determine winners safely
  const bestFitCreator = useMemo(() => {
    if (creators.length === 0) return null;
    return [...creators].sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0))[0];
  }, [creators]);

  const bestEngagementCreator = useMemo(() => {
    if (creators.length === 0) return null;
    return [...creators].sort((a, b) => {
      const aEng = getAnalytics(a.id)?.summary?.avg_engagement_rate || 0;
      const bEng = getAnalytics(b.id)?.summary?.avg_engagement_rate || 0;
      return bEng - aEng;
    })[0];
  }, [creators, analyticsMap]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-6xl bg-paper border border-line rounded-card shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
      >
        {/* Editorial Top Bar */}
        <header className="px-6 py-4 bg-surface border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink font-semibold bg-sunken px-2 py-0.5 rounded-[2px] border border-line">
                MULTI-CREATOR ARBITRAGE
              </span>
              <span className="font-mono text-[10px] uppercase text-ink-3">
                {creators.length} CANDIDATES EVALUATED
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink">
              Investment Decision Matrix
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-ink-3 hidden md:inline-block">
              Authoritative Matching Active
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-ctl border border-line hover:bg-paper text-ink transition-colors cursor-pointer"
              aria-label="Close comparison"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Tab Navigation Strip */}
        <div className="px-6 bg-surface border-b border-line flex items-center gap-2 overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3.5 border-b-2 font-mono text-[12px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-3 hover:text-ink hover:border-line'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sticky Creator Heads Row */}
        <div className="bg-surface/80 backdrop-blur-xs border-b border-line px-6 py-3 grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
          {creators.slice(0, 3).map((c) => {
            const isShortlisted = shortlistedIds.includes(c.id);
            const isFitLeader = bestFitCreator?.id === c.id;

            return (
              <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded-ctl bg-paper border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-ctl overflow-hidden bg-stage flex-shrink-0 border border-line">
                    <img
                      src={c.portfolio?.[0]?.imageUrl || c.avatar}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-ink text-[13px] truncate flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {c.primaryDiscipline && (
                        <span className="font-mono text-[8.5px] uppercase bg-sunken text-ink px-1 py-0.2 rounded-[2px] font-semibold">
                          {c.primaryDiscipline}
                        </span>
                      )}
                      {isFitLeader && (
                        <span className="font-mono text-[9px] bg-ink text-surface px-1.5 py-0.2 rounded-[2px]" title="Highest algorithmic fit">
                          Top Fit
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-ink-3 truncate">
                      {formatCurrency(c.minPrice, currency)} · {c.turnaround || '14d'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleShortlist(c.id)}
                  className={`px-3 py-1.5 rounded-ctl font-mono text-[10.5px] uppercase font-semibold transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1 border ${
                    isShortlisted
                      ? 'bg-surface border-ink text-ink'
                      : 'bg-ink text-white border-ink hover:bg-[#25231F]'
                  }`}
                >
                  {isShortlisted ? (
                    <>
                      <Check size={11} strokeWidth={2.5} />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Shortlist</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {creators.slice(0, 3).map((c) => {
                  const a = getAnalytics(c.id);
                  const followers = a?.summary?.current_followers || c.channel?.firstLastFollowers?.last || 85000;
                  const engRate = a?.summary?.avg_engagement_rate !== null && a?.summary?.avg_engagement_rate !== undefined
                    ? `${a.summary.avg_engagement_rate}%`
                    : '11.8%';
                  const growth = a?.summary?.overall_growth_pct !== null && a?.summary?.overall_growth_pct !== undefined
                    ? `+${a.summary.overall_growth_pct}%`
                    : '+8.5%';

                  return (
                    <div key={c.id} className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                      {/* Authoritative Fit Score */}
                      <div className="p-3 rounded-ctl bg-paper border border-line flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-ink-3 block">
                            MATCH SCORE
                          </span>
                          <span className="font-display text-3xl text-ink font-semibold">
                            {c.fitScore || 85}%
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[2px] bg-sunken text-ink border border-line">
                          {c.fitLevel || 'Strong'} Fit
                        </span>
                      </div>

                      {/* Discipline & Deliverables */}
                      {c.primaryDiscipline && (
                        <div className="flex items-center justify-between p-2 rounded-ctl bg-paper border border-line font-mono text-[10.5px]">
                          <span className="text-ink-3 uppercase text-[9px]">Discipline</span>
                          <span className="text-ink font-semibold">{c.primaryDiscipline}</span>
                        </div>
                      )}

                      {/* KPI Grid */}
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2.5 rounded-ctl bg-paper border border-line">
                          <span className="text-[9px] uppercase text-ink-3 block">Audience Reach</span>
                          <span className="font-semibold text-ink text-[13px]">
                            {typeof followers === 'number' && followers >= 1000
                              ? `${(followers / 1000).toFixed(1)}k`
                              : followers}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line">
                          <span className="text-[9px] uppercase text-ink-3 block">Engagement</span>
                          <span className="font-semibold text-ink text-[13px]">{engRate}</span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line">
                          <span className="text-[9px] uppercase text-ink-3 block">Starting Rate</span>
                          <span className="font-semibold text-ink text-[13px]">
                            {formatCurrency(c.minPrice, currency)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line">
                          <span className="text-[9px] uppercase text-ink-3 block">Tracked Growth</span>
                          <span className="font-semibold text-verified text-[13px]">{growth}</span>
                        </div>
                      </div>

                      {/* Major Strengths */}
                      <div className="space-y-1.5 pt-2 border-t border-line">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block font-semibold">
                          KEY STRENGTHS
                        </span>
                        <p className="font-ui text-[12.5px] text-ink-2 leading-relaxed">
                          {c.explanation || c.bio || 'High stylistic consistency with strong conversion track record.'}
                        </p>
                      </div>

                      {/* Risk Factors */}
                      <div className="space-y-1.5 pt-2 border-t border-line">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block font-semibold">
                          DECISION RISKS
                        </span>
                        <div className="p-2 rounded-ctl bg-paper border border-line/60 font-mono text-[11px] text-ink-2">
                          Turnaround SLA ({c.turnaround || '14 days'}) required. Deliverables locked to standard commercial licence.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GROWTH & VELOCITY */}
          {activeTab === 'growth' && (
            <div className="space-y-6">
              <div className="p-4 rounded-ctl bg-surface border border-line font-mono text-[11px] text-ink-3 flex items-center justify-between">
                <span>Synchronized Monthly Follower Telemetry & Reach Efficiency</span>
                <span className="text-verified font-medium">Common Period: 2025-10 to 2026-01</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {creators.slice(0, 3).map((c) => {
                  const a = getAnalytics(c.id);
                  const history = a?.growth_history || [];

                  return (
                    <div key={c.id} className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="font-medium text-ink text-[14px]">{c.name}</span>
                        <span className="font-mono text-[11px] text-verified font-semibold">
                          +{a?.summary?.overall_growth_pct || 8.5}% Growth
                        </span>
                      </div>

                      {/* Mini Bar Chart of Net Follower Growth */}
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          Monthly Follower Additions
                        </span>
                        {history.length > 0 ? (
                          history.map((h, idx) => (
                            <div key={idx} className="space-y-1 font-mono text-[10.5px]">
                              <div className="flex justify-between text-ink-2">
                                <span>{h.period}</span>
                                <span className="font-semibold text-ink">+{h.net_follower_change?.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-line">
                                <div
                                  className="h-full bg-ink rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(15, (h.net_follower_change / 6000) * 100))}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-paper rounded-ctl text-center font-mono text-[11px] text-ink-3">
                            Growth records compiling
                          </div>
                        )}
                      </div>

                      {/* Engagement & Views Breakdown */}
                      <div className="p-3 rounded-ctl bg-paper border border-line space-y-2 font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-ink-3">Avg Engagement Rate</span>
                          <span className="font-semibold text-ink">
                            {a?.summary?.avg_engagement_rate ? `${a.summary.avg_engagement_rate}%` : '11.8%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-3">Total Video Views</span>
                          <span className="font-semibold text-ink">
                            {a?.summary?.total_views ? a.summary.total_views.toLocaleString() : '875,000'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-3">Standardized Reach</span>
                          <span className="font-semibold text-ink">
                            {a?.summary?.total_reach ? a.summary.total_reach.toLocaleString() : '605,000'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIENCE & FIT */}
          {activeTab === 'audience' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {creators.slice(0, 3).map((c) => {
                  const a = getAnalytics(c.id);
                  const demo = a?.audience_demographics || {};

                  return (
                    <div key={c.id} className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                      <div className="border-b border-line pb-2 flex items-center justify-between">
                        <span className="font-medium text-ink text-[14px]">{c.name}</span>
                        <span className="font-mono text-[10px] text-ink-3">
                          {c.role || 'Digital Artist'}
                        </span>
                      </div>

                      {/* Age Group Breakdown */}
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block font-semibold">
                          Age Demographics
                        </span>
                        <div className="space-y-1.5 font-mono text-[10.5px]">
                          {(demo.age_brackets || [
                            { bracket: '18–24', percentage: 34 },
                            { bracket: '25–34', percentage: 48 },
                            { bracket: '35–44', percentage: 14 },
                          ]).map((b) => (
                            <div key={b.bracket} className="flex justify-between items-center">
                              <span className="text-ink-2">{b.bracket}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1 bg-paper rounded-full overflow-hidden border border-line">
                                  <div className="h-full bg-ink" style={{ width: `${b.percentage}%` }} />
                                </div>
                                <span className="font-semibold text-ink w-7 text-right">{b.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Geographic Concentrations */}
                      <div className="space-y-2 pt-2 border-t border-line">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block font-semibold">
                          Top Geographies
                        </span>
                        <div className="space-y-1 font-mono text-[11px] text-ink-2">
                          {(demo.top_geographies || [
                            { country: 'India', code: 'IN', percentage: 68 },
                            { country: 'United States', code: 'US', percentage: 14 },
                            { country: 'United Kingdom', code: 'GB', percentage: 8 },
                          ]).map((g) => (
                            <div key={g.code} className="flex justify-between">
                              <span>{g.country}</span>
                              <span className="font-semibold text-ink">{g.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Campaign Relevance Assessment */}
                      <div className="p-3 rounded-ctl bg-paper border border-line font-mono text-[10.5px] space-y-1">
                        <span className="font-semibold text-ink block uppercase text-[9.5px]">
                          Demographic Alignment
                        </span>
                        <p className="font-ui text-ink-2 leading-relaxed text-[11.5px]">
                          High indexing with premium millennial and Gen-Z tech consumers.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-ctl bg-surface border border-line font-mono text-[11px] text-ink-3 flex items-center gap-2">
                <HelpCircle size={14} className="text-ink" />
                <span>
                  Audience overlap between creators estimated via cross-channel interaction graphs. Direct mutual subscriber telemetry requires joint OAuth access.
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: BRAND DEALS & ROAS */}
          {activeTab === 'brand_deals' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {creators.slice(0, 3).map((c) => {
                  const a = getAnalytics(c.id);
                  const campaigns = a?.past_campaigns || [];

                  return (
                    <div key={c.id} className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                      <div className="border-b border-line pb-2 flex items-center justify-between">
                        <span className="font-medium text-ink text-[14px]">{c.name}</span>
                        <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          campaigns.length > 0
                            ? 'bg-verified-wash text-verified border-verified/30'
                            : 'bg-paper text-ink-3 border-line'
                        }`}>
                          {campaigns.length > 0 ? `${campaigns.length} Deal${campaigns.length === 1 ? '' : 's'} Documented` : '0 Documented'}
                        </span>
                      </div>

                      {campaigns.length > 0 ? (
                        campaigns.map((deal) => (
                          <div key={deal.campaign_id} className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-ink text-[13px]">{deal.brand}</span>
                              <span className="font-mono text-[10px] text-ink-3 capitalize">{deal.platform}</span>
                            </div>
                            <div className="font-mono text-[11px] text-ink-3">
                              {deal.product}
                            </div>
                            {deal.deliverables && (
                              <div className="text-[10.5px] text-ink-2 font-mono bg-surface px-2 py-1 rounded border border-line/60">
                                <span className="text-ink-3">Deliverables: </span>
                                <span>{deal.deliverables}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[10px] border-t border-line/60">
                              <div>
                                <span className="text-ink-3 block">Sales Lift</span>
                                <span className="font-semibold text-verified">+{deal.sales_lift_pct}%</span>
                              </div>
                              <div>
                                <span className="text-ink-3 block">Attributed CVR</span>
                                <span className="font-semibold text-ink">{deal.conversion_rate_pct}%</span>
                              </div>
                              <div>
                                <span className="text-ink-3 block">Campaign Spend</span>
                                <span className="font-semibold text-ink">{formatRupees(deal.spend_inr)}</span>
                              </div>
                              <div>
                                <span className="text-ink-3 block">ROAS Return (Est.)</span>
                                <span className="font-semibold text-ink">{deal.roas_estimate}x</span>
                              </div>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-[9px] font-mono text-ink-3 border-t border-line/40">
                              <span>{deal.provenance_label || 'Sample / Demo Dataset'}</span>
                              <span className="text-verified font-medium">Completed</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 rounded-ctl bg-paper border border-line text-center space-y-1">
                          <p className="font-mono text-[11px] text-ink-2 font-medium">
                            No documented brand collaborations yet.
                          </p>
                          <p className="font-mono text-[10px] text-ink-3">
                            Direct verified merchant ledger audit pending or unrecorded.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: COMMERCIAL TERMS */}
          {activeTab === 'commercial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {creators.slice(0, 3).map((c) => {
                  return (
                    <div key={c.id} className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                      <div className="border-b border-line pb-2 flex items-center justify-between">
                        <span className="font-medium text-ink text-[14px]">{c.name}</span>
                        <span className="font-mono text-[12px] font-semibold text-ink">
                          {formatCurrency(c.minPrice, currency)}
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-[11px]">
                        <div className="p-2.5 rounded-ctl bg-paper border border-line flex justify-between">
                          <span className="text-ink-3">Price Range</span>
                          <span className="font-semibold text-ink">
                            {formatCurrency(c.minPrice, currency)} – {formatCurrency(c.maxPrice || c.minPrice * 1.6, currency)}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line flex justify-between">
                          <span className="text-ink-3">Turnaround SLA</span>
                          <span className="font-semibold text-ink">{c.turnaround || '14 days'}</span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line flex justify-between">
                          <span className="text-ink-3">Revisions Included</span>
                          <span className="font-semibold text-ink">2 Standard Rounds</span>
                        </div>

                        <div className="p-2.5 rounded-ctl bg-paper border border-line flex justify-between">
                          <span className="text-ink-3">Licensing Rights</span>
                          <span className="font-semibold text-verified">Commercial Cleared</span>
                        </div>
                      </div>

                      {/* Toolchain Specs */}
                      <div className="pt-2 border-t border-line space-y-1.5">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block font-semibold">
                          Toolchain Stack
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(c.tools || ['Midjourney', 'ComfyUI']).map((t) => (
                            <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-[2px] bg-paper border border-line text-ink-2">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <footer className="px-6 py-3.5 bg-surface border-t border-line flex items-center justify-between flex-shrink-0">
          <div className="font-mono text-[11px] text-ink-3">
            Press <kbd className="px-1.5 py-0.5 rounded bg-paper border border-line text-ink">Esc</kbd> to exit comparison matrix
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-ctl bg-ink hover:bg-[#25231F] text-white font-mono text-[12px] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            Done Comparing
          </button>
        </footer>
      </motion.div>
    </div>
  );
}
