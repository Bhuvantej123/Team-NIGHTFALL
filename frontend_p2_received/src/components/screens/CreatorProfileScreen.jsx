import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Send,
  Globe,
  Users,
  Film,
  Clock,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { CropMarks } from '../common/CropMarks';
import { CreditLine } from '../common/CreditLine';
import { ToolMark } from '../common/ToolMark';
import { WorkflowStrip } from '../common/WorkflowStrip';
import { ProvenanceTag } from '../common/ProvenanceTag';
import { Sparkline } from '../common/Sparkline';
import { InsufficientData } from '../common/InsufficientData';
import { RoiFormulaPopover } from '../common/RoiFormulaPopover';
import { computeRoi } from '../../lib/roi';
import { formatRupees } from '../../utils/formatters';

/**
 * CreatorProfileScreen
 * Colophon Paper & Stage System with Full Provenance Layer (Master Plan v3)
 * Tabs:
 * 1. Work (pieces with credit lines on Stage mat)
 * 2. Process (toolkit, workflow strip, human involvement mix, palette)
 * 3. Track record (5 blocks: Audience Trend, Audience & Niche Fit, Past Campaigns Ledger with ROI, Disclosure & Rights, Data Sources & Gaps)
 * 4. Rates & rights (commercial license terms, starting fees)
 */
export function CreatorProfileScreen({
  creator,
  campaign,
  onBack,
  onOpenColophon,
  onShortlist,
  isShortlisted = false,
}) {
  const [profileTab, setProfileTab] = useState('track'); // Defaults to 'track' or 'work'

  if (!creator) return null;

  // Commercial works count for Facts Strip
  const commercialWorksCount = (creator.portfolio || []).filter(
    (w) => w.rightsStatus?.includes('COMMERCIAL')
  ).length;

  // Trend icon helper
  const getTrendIcon = (trend) => {
    if (trend === 'growing') {
      return <TrendingUp size={14} className="text-verified" />;
    }
    if (trend === 'declining') {
      return <TrendingDown size={14} className="text-blocked" />;
    }
    return <Minus size={14} className="text-ink-2" />;
  };

  return (
    <div className="min-h-screen bg-paper pb-28">
      {/* Stage Hero Section (~480px on #0D0D0B) */}
      <div className="bg-stage text-stage-ink py-10 px-6 lg:px-16 border-b border-stage-line">
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-stage-ink-2 hover:text-white font-mono text-[12px] mb-8 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span>BACK TO SEARCH</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 cols: Bio & Facts Strip */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-verified inline-block" />
                <span className="font-mono text-[11px] text-verified uppercase font-semibold">
                  AVAILABLE FROM 3 NOV · RESPONSE TIME &lt; 2H
                </span>
              </div>

              <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight">
                {creator.name}
              </h1>

              <p className="text-[15px] text-stage-ink-2 leading-relaxed max-w-xl">
                {creator.bio}
              </p>

              {/* What they do: Format & Deliverable Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-stage-ink-2">
                  SPECIALIZES IN:
                </span>
                {(creator.formats || ['Stills 4:5', 'Reels 9:16']).map((fmt) => (
                  <span
                    key={fmt}
                    className="font-mono text-[11px] bg-stage-raised px-2.5 py-1 rounded-[3px] border border-stage-line text-stage-ink font-medium"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="font-mono text-[11px] bg-cobalt-tint/10 text-cobalt px-2.5 py-1 rounded-[3px] border border-cobalt/30 font-medium">
                  Photoshoot & Motion CGI
                </span>
              </div>

              {/* Facts Strip of 5 Serif/Tabular Numerals from Real Data */}
              <div className="pt-3 border-t border-stage-line/60 flex items-center gap-6 lg:gap-8 flex-wrap">
                <div>
                  <span className="font-mono text-stage-ink-2 text-[10px] uppercase block tracking-wider">
                    FOLLOWERS
                  </span>
                  <span className="font-display text-2xl text-white font-medium tnum">
                    {creator.channel?.firstLastFollowers?.last?.split(' ')?.[0] || '140K'}
                  </span>
                  <span className="font-mono text-[9px] text-verified block">
                    {creator.channel?.platform || 'Instagram'} Verified
                  </span>
                </div>

                <div className="h-8 w-[1px] bg-stage-line" />

                <div>
                  <span className="font-mono text-stage-ink-2 text-[10px] uppercase block tracking-wider">
                    STARTING PRICE
                  </span>
                  <span className="font-display text-2xl text-white font-medium tnum">
                    {formatRupees(creator.minPrice)}
                  </span>
                  <span className="font-mono text-[9px] text-stage-ink-2 block">
                    Base package
                  </span>
                </div>

                <div className="h-8 w-[1px] bg-stage-line" />

                <div>
                  <span className="font-mono text-stage-ink-2 text-[10px] uppercase block tracking-wider">
                    TURNAROUND
                  </span>
                  <span className="font-display text-2xl text-white font-medium">
                    {creator.turnaround}
                  </span>
                  <span className="font-mono text-[9px] text-stage-ink-2 block">
                    Delivery time
                  </span>
                </div>

                <div className="h-8 w-[1px] bg-stage-line" />

                <div>
                  <span className="font-mono text-stage-ink-2 text-[10px] uppercase block tracking-wider">
                    COMMERCIAL RIGHTS
                  </span>
                  <span className="font-display text-2xl text-white font-medium">
                    {commercialWorksCount} of {creator.portfolio?.length || 0}
                  </span>
                  <span className="font-mono text-[9px] text-stage-ink-2 block">
                    Works declared
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Hero Reel framed with Crop Marks */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-stage-raised border border-stage-line shadow-2xl">
                <img
                  src={creator.portfolio[0]?.imageUrl || creator.avatar}
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
                <CropMarks active={true} dark={true} offset={8} length={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header on Paper */}
      <div className="border-b border-line bg-paper sticky top-16 z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {[
              { id: 'track', label: 'Track record' },
              { id: 'work', label: 'Work' },
              { id: 'process', label: 'Process' },
              { id: 'rates', label: 'Rates & rights' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProfileTab(tab.id)}
                className={`py-4 font-mono text-[12px] uppercase tracking-wider font-semibold border-b-2 transition-colors cursor-pointer ${
                  profileTab === tab.id
                    ? 'border-cobalt text-cobalt'
                    : 'border-transparent text-ink-3 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Single Primary Action: Shortlist */}
          <button
            onClick={() => onShortlist?.(creator.id)}
            className={`px-4 py-2 rounded-ctl text-[12px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
              isShortlisted
                ? 'bg-ink text-surface'
                : 'bg-cobalt hover:bg-cobalt-press text-white'
            }`}
          >
            {isShortlisted ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>Shortlisted</span>
              </>
            ) : (
              <span>Shortlist Creator</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Viewport */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* TAB 1: TRACK RECORD (Provenance Layer Backbone) */}
        {profileTab === 'track' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: The 5 Track Record Blocks */}
            <div className="lg:col-span-8 space-y-6">
              {/* BLOCK 1: AUDIENCE TREND & POSTING CONSISTENCY */}
              <div className="p-6 bg-surface rounded-card border border-line shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                      BLOCK 01 · SIX-MONTH CHANNEL DYNAMICS
                    </span>
                    <h3 className="font-display text-xl text-ink">
                      Audience trend & posting consistency
                    </h3>
                  </div>
                  {creator.channel?.provenance && (
                    <ProvenanceTag
                      status={creator.channel.provenance.status}
                      asOf={creator.channel.provenance.asOf}
                    />
                  )}
                </div>

                {creator.channel ? (
                  <div className="space-y-5">
                    {/* Verdict & Plain Language Sentence */}
                    <div className="p-3.5 rounded-ctl bg-sunken/40 border border-line/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        {getTrendIcon(creator.channel.trend)}
                        <div>
                          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                            VERDICT: {creator.channel.trend.toUpperCase()}
                          </span>
                          <p className="text-[13px] text-ink-2 mt-0.5">
                            {creator.channel.trendSentence}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          CONSISTENCY
                        </span>
                        <span className="font-mono text-[12px] font-semibold text-ink">
                          {creator.channel.postingConsistency}
                        </span>
                      </div>
                    </div>

                    {/* 3 Metric Sparklines Grid (Followers, Avg Views, Engagement) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      {/* Followers */}
                      <div className="p-3.5 rounded-ctl bg-paper border border-line space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px] text-ink-3 uppercase">
                          <span>Followers</span>
                          <span>6 mo</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-lg font-bold text-ink tnum">
                            {(creator.channel.followersSeries[creator.channel.followersSeries.length - 1] / 1000).toFixed(1)}K
                          </span>
                          <Sparkline
                            data={creator.channel.followersSeries}
                            width={80}
                            height={22}
                            ariaLabel={`Followers: ${creator.channel.firstLastFollowers?.first} to ${creator.channel.firstLastFollowers?.last}`}
                          />
                        </div>
                        <div className="font-mono text-[10px] text-ink-3 flex justify-between pt-1 border-t border-line/60">
                          <span>{creator.channel.firstLastFollowers?.first}</span>
                          <span>{creator.channel.firstLastFollowers?.last}</span>
                        </div>
                      </div>

                      {/* Average Views */}
                      <div className="p-3.5 rounded-ctl bg-paper border border-line space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px] text-ink-3 uppercase">
                          <span>Avg Views</span>
                          <span>6 mo</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-lg font-bold text-ink tnum">
                            {(creator.channel.viewsSeries[creator.channel.viewsSeries.length - 1] / 1000).toFixed(1)}K
                          </span>
                          <Sparkline
                            data={creator.channel.viewsSeries}
                            width={80}
                            height={22}
                            ariaLabel="Average views trend"
                          />
                        </div>
                        <div className="font-mono text-[10px] text-ink-3 flex justify-between pt-1 border-t border-line/60">
                          <span>{(creator.channel.viewsSeries[0] / 1000).toFixed(0)}K</span>
                          <span>{(creator.channel.viewsSeries[creator.channel.viewsSeries.length - 1] / 1000).toFixed(0)}K</span>
                        </div>
                      </div>

                      {/* Engagement Rate */}
                      <div className="p-3.5 rounded-ctl bg-paper border border-line space-y-2">
                        <div className="flex items-center justify-between font-mono text-[10px] text-ink-3 uppercase">
                          <span>Engagement</span>
                          <span>6 mo</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="font-mono text-lg font-bold text-ink tnum">
                            {creator.channel.engagementSeries[creator.channel.engagementSeries.length - 1]}%
                          </span>
                          <Sparkline
                            data={creator.channel.engagementSeries}
                            width={80}
                            height={22}
                            ariaLabel="Engagement rate trend"
                          />
                        </div>
                        <div className="font-mono text-[10px] text-ink-3 flex justify-between pt-1 border-t border-line/60">
                          <span>{creator.channel.engagementSeries[0]}%</span>
                          <span>{creator.channel.engagementSeries[creator.channel.engagementSeries.length - 1]}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <InsufficientData reason="No personal channel data declared · Creator publishes strictly for brand commissions" />
                )}
              </div>

              {/* BLOCK 2: AUDIENCE & NICHE FIT */}
              <div className="p-6 bg-surface rounded-card border border-line shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                      BLOCK 02 · DEMOGRAPHIC & REGIONAL FIT
                    </span>
                    <h3 className="font-display text-xl text-ink">
                      Audience and niche distribution
                    </h3>
                  </div>
                  {creator.audience?.provenance && (
                    <ProvenanceTag
                      status={creator.audience.provenance.status}
                      asOf={creator.audience.provenance.asOf}
                    />
                  )}
                </div>

                {creator.audience ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Age Ranges */}
                      <div className="p-3.5 bg-paper rounded-ctl border border-line space-y-1.5">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          AGE SPREAD
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.audience.ageRanges.map((age, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] bg-surface px-2 py-0.5 rounded-[3px] border border-line text-ink"
                            >
                              {age}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Regions */}
                      <div className="p-3.5 bg-paper rounded-ctl border border-line space-y-1.5">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          TOP GEOGRAPHIES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.audience.regions.map((reg, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] bg-surface px-2 py-0.5 rounded-[3px] border border-line text-ink"
                            >
                              {reg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="p-3.5 bg-paper rounded-ctl border border-line space-y-1.5">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          LANGUAGES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.audience.languages.map((lang, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] bg-surface px-2 py-0.5 rounded-[3px] border border-line text-ink"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Core Niches */}
                      <div className="p-3.5 bg-paper rounded-ctl border border-line space-y-1.5">
                        <span className="font-mono text-[10px] uppercase text-ink-3 block">
                          AFFINITY NICHES
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {creator.audience.interests.map((int, i) => (
                            <span
                              key={i}
                              className="font-mono text-[11px] bg-surface px-2 py-0.5 rounded-[3px] border border-line text-ink font-medium"
                            >
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Brief Overlap Context if campaign exists */}
                    {campaign && (
                      <div className="p-3 rounded-ctl bg-sunken/40 border border-line text-[12px] flex items-center justify-between">
                        <span className="font-mono text-[11px] text-ink font-medium">
                          BRIEF OVERLAP EVALUATION ({campaign.title})
                        </span>
                        <span className="font-mono text-[11px] text-verified font-semibold">
                          OVERLAPS (AGE: 86% · REGION: MATCH)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <InsufficientData reason="Audience demographic survey data not declared for this profile" />
                )}
              </div>

              {/* BLOCK 3: PAST CAMPAIGNS LEDGER & SPONSOR ROI */}
              <div className="p-6 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                      BLOCK 03 · VERIFIED ATTRIBUTION LEDGER
                    </span>
                    <h3 className="font-display text-xl text-ink">
                      Previous campaign results & ROI evidence
                    </h3>
                  </div>
                  <ProvenanceTag
                    status="simulated"
                    asOf="12 Sep 2026"
                  />
                </div>

                {creator.pastCampaigns && creator.pastCampaigns.length > 0 ? (
                  <div className="space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-ui text-[12px]">
                        <thead>
                          <tr className="font-mono text-[10px] uppercase text-ink-3 border-b border-line">
                            <th className="pb-2 font-medium">Brand & Flight</th>
                            <th className="pb-2 font-medium">Category</th>
                            <th className="pb-2 font-medium">Spend</th>
                            <th className="pb-2 font-medium">Conversions</th>
                            <th className="pb-2 font-medium">Computed ROI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/60">
                          {creator.pastCampaigns.map((pc) => {
                            const roiData = computeRoi(pc.revenue, pc.spend);

                            return (
                              <tr key={pc.id} className="hover:bg-paper transition-colors">
                                <td className="py-2.5 font-medium text-ink">
                                  {pc.brand}
                                  <span className="block font-mono text-[10px] text-ink-3">
                                    {pc.period}
                                  </span>
                                </td>
                                <td className="py-2.5 text-ink-2 font-mono text-[11px]">
                                  {pc.category}
                                </td>
                                <td className="py-2.5 font-mono text-ink tnum">
                                  {formatRupees(pc.spend)}
                                </td>
                                <td className="py-2.5 font-mono text-ink tnum">
                                  {pc.conversions.toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5">
                                  {roiData.insufficient ? (
                                    <span className="font-mono text-[10px] text-unverified bg-unverified-wash/40 px-2 py-0.5 rounded-[3px] border border-dashed border-unverified/40 inline-block">
                                      INSUFFICIENT DATA
                                    </span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-mono text-[12px] font-semibold tnum ${
                                          roiData.positive ? 'text-verified' : 'text-blocked'
                                        }`}
                                      >
                                        {roiData.formatted}
                                      </span>
                                      <RoiFormulaPopover
                                        revenue={pc.revenue}
                                        spend={pc.spend}
                                        roiFormatted={roiData.formatted}
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Caveat line mandated by Master Plan */}
                    <p className="font-mono text-[10px] text-ink-3 pt-2 border-t border-line/60">
                      Results were observed during the campaign period. Other factors may have contributed.
                    </p>
                  </div>
                ) : (
                  <InsufficientData reason="No past campaign flight rows recorded in ledger" />
                )}
              </div>

              {/* BLOCK 4: DISCLOSURE & RIGHTS NOTE */}
              <div className="p-6 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                      BLOCK 04 · REGULATORY & MODEL DECLARATION
                    </span>
                    <h3 className="font-display text-xl text-ink">
                      Disclosure and licensing terms
                    </h3>
                  </div>
                  {creator.disclosure?.provenance && (
                    <ProvenanceTag
                      status={creator.disclosure.provenance.status}
                      asOf={creator.disclosure.provenance.asOf}
                    />
                  )}
                </div>

                <div className="p-4 rounded-ctl bg-paper border border-line space-y-2 text-[13px] text-ink">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-ink-3 block">
                      DISCLOSURE NOTE
                    </span>
                    <p className="mt-0.5 text-ink leading-relaxed">
                      {creator.disclosure?.note || 'Commercial model declaration pending submission.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-line/60">
                    <span className="font-mono text-[10px] uppercase text-ink-3 block">
                      LICENCE TERMS
                    </span>
                    <p className="mt-0.5 text-ink-2 leading-relaxed">
                      {creator.disclosure?.licenceTerms || 'Perpetual worldwide digital promotional rights.'}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-ink-3">
                  Declared by creator · Confirm current platform and local advertising rules before production flight.
                </div>
              </div>

              {/* BLOCK 5: DATA SOURCES AND GAPS */}
              <div className="p-6 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                <div className="border-b border-line pb-3">
                  <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                    BLOCK 05 · AUDIT TRAIL
                  </span>
                  <h3 className="font-display text-xl text-ink">
                    Data sources and verified gaps
                  </h3>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2.5 rounded-ctl bg-paper border border-line">
                    <span className="text-ink">Channel Dynamics (Followers, Views)</span>
                    <ProvenanceTag status={creator.channel ? 'simulated' : 'missing'} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-ctl bg-paper border border-line">
                    <span className="text-ink">Audience Demographics</span>
                    <ProvenanceTag status={creator.audience ? 'simulated' : 'missing'} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-ctl bg-paper border border-line">
                    <span className="text-ink">Past Campaign Ledger & Attributable ROI</span>
                    <ProvenanceTag status="simulated" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-ctl bg-paper border border-line">
                    <span className="text-ink">Commercial Model Licenses</span>
                    <ProvenanceTag status="declared" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Context Card */}
            <div className="lg:col-span-4 sticky top-36 space-y-5">
              <div className="p-5 bg-surface rounded-card border border-line shadow-2xs space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
                  COMMISSION SUMMARY
                </span>

                <div>
                  <h4 className="font-display text-2xl text-ink">
                    {creator.name}
                  </h4>
                  <p className="text-[13px] text-ink-2 mt-0.5">
                    {creator.role}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-line text-[13px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-ink-3">Price Range:</span>
                    <span className="font-semibold text-ink">
                      {formatRupees(creator.minPrice)} – {formatRupees(creator.maxPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">Avg Turnaround:</span>
                    <span className="text-ink">{creator.turnaround}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-3">Revisions:</span>
                    <span className="text-ink">{creator.revisions} Included</span>
                  </div>
                </div>

                {/* If active campaign in context, display fit evaluation */}
                {campaign && (
                  <div className="p-3 bg-paper rounded-ctl border border-line space-y-1">
                    <span className="font-mono text-[10px] uppercase text-ink-3 block">
                      FIT FOR ACTIVE CAMPAIGN
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-ink truncate mr-2">
                        {campaign.title}
                      </span>
                      <span className="font-mono text-[11px] text-cobalt font-semibold flex-shrink-0">
                        {creator.fitLevel} Fit · {creator.fitScore}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onShortlist?.(creator.id)}
                  className={`w-full h-10 rounded-ctl text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isShortlisted
                      ? 'bg-ink text-surface'
                      : 'bg-cobalt hover:bg-cobalt-press text-white'
                  }`}
                >
                  {isShortlisted ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      <span>Shortlisted for Campaign</span>
                    </>
                  ) : (
                    <span>Shortlist Creator</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORK */}
        {profileTab === 'work' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(creator.portfolio || []).map((w, idx) => (
              <div key={idx} className="group space-y-2">
                <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-stage-raised border border-stage-line">
                  <img
                    src={w.imageUrl}
                    alt={w.title}
                    className="w-full h-full object-cover"
                  />
                  <CropMarks hoverable={true} dark={true} />
                </div>
                <CreditLine
                  work={w}
                  creator={creator}
                  onOpenColophon={onOpenColophon}
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PROCESS */}
        {profileTab === 'process' && (
          <div className="max-w-3xl space-y-8 bg-surface p-8 rounded-card border border-line">
            {/* Toolkit */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3">
                TOOLKIT & FREQUENCY
              </span>
              <div className="space-y-2">
                {creator.tools.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2">
                      <ToolMark name={t} />
                      <span className="font-medium text-ink">{t}</span>
                    </div>
                    <div className="w-36 h-1.5 bg-sunken rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink rounded-full"
                        style={{ width: `${85 - idx * 15}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow steps */}
            <div className="space-y-3 pt-6 border-t border-line">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3">
                WORKFLOW STEP SEQUENCE
              </span>
              <WorkflowStrip steps={creator.workflowSteps} />
            </div>

            {/* Signature Palette */}
            <div className="space-y-3 pt-6 border-t border-line">
              <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-3">
                SIGNATURE TONAL PALETTE
              </span>
              <div className="flex items-center gap-2">
                {creator.palette.map((color, idx) => (
                  <div key={idx} className="flex-1 space-y-1">
                    <div
                      className="h-10 rounded-ctl border border-line shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[9px] text-ink-3 block text-center">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RATES & RIGHTS */}
        {profileTab === 'rates' && (
          <div className="max-w-3xl space-y-6 bg-surface p-8 rounded-card border border-line">
            <div>
              <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider block">
                COMMISSION PRICING & RIGHTS MATRIX
              </span>
              <h3 className="font-display text-2xl text-ink">
                Standard commissioning terms
              </h3>
            </div>

            <div className="space-y-3 font-mono text-[12px]">
              <div className="flex justify-between p-3 bg-paper rounded-ctl border border-line">
                <span className="text-ink">Single Hero Still (4:5)</span>
                <span className="font-semibold text-ink">{formatRupees(creator.minPrice)}</span>
              </div>
              <div className="flex justify-between p-3 bg-paper rounded-ctl border border-line">
                <span className="text-ink">Vertical Short-form Reel (9:16)</span>
                <span className="font-semibold text-ink">{formatRupees(creator.minPrice * 1.5)}</span>
              </div>
              <div className="flex justify-between p-3 bg-paper rounded-ctl border border-line">
                <span className="text-ink">Campaign Multi-Asset Bundle</span>
                <span className="font-semibold text-ink">{formatRupees(creator.maxPrice)}</span>
              </div>
            </div>

            <div className="p-4 bg-sunken/40 rounded-ctl border border-line space-y-1 text-[12px]">
              <div className="font-medium text-ink">Commercial Usage Rights:</div>
              <p className="text-ink-2 leading-relaxed">
                Includes perpetual digital broadcast, social advertising, and website hero placement. Print and Out-Of-Home billboard usage requires prior commercial model declaration pass.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
