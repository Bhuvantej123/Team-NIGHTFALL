import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Calendar,
  Film,
  ShieldCheck,
  Clock,
  Tag,
  X,
  Plus,
  Minus,
  AlertCircle,
  Sparkles,
  Camera,
  Layers,
  Monitor,
  Smartphone,
  Sliders,
  Box,
  FileCheck,
} from 'lucide-react';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatRupees } from '../../utils/formatters';

/**
 * BriefStep (Step 1: Campaign Brief & Specification)
 * Redesigned for clarity, speed, and ease of use:
 * - Single source of truth (no redundant nested steppers)
 * - Clear grouping: Commission Parameters, Deliverables & Formats, Creative Direction
 * - Preset sample brief templates for instant 1-click testing
 * - Interactive tag toggles for format/style requirements
 * - Real Match Readiness verification checklist (no fake reach projections)
 */
export function BriefStep({
  campaign,
  onUpdateCampaign,
  onBack,
  onProceedToMatches,
}) {
  const [brandName, setBrandName] = useState(campaign?.brandName || 'Brand Commission');
  const [title, setTitle] = useState(campaign?.title || 'New Creative Commission');
  const [budgetVal, setBudgetVal] = useState(campaign?.budget || 25000);
  const [currency, setCurrency] = useState(campaign?.currency || 'INR');
  const [deadline, setDeadline] = useState(campaign?.deadline || '2026-11-20');
  const [deliverablesText, setDeliverablesText] = useState(
    campaign?.deliverablesText || '3 Stills (4:5) + 2 Reels (9:16)'
  );
  const [rawText, setRawText] = useState(campaign?.fullText || campaign?.description || '');

  // Deliverables options state
  const [stillsCount, setStillsCount] = useState(3);
  const [reelsCount, setReelsCount] = useState(2);
  const [motionCount, setMotionCount] = useState(0);
  const [cgiCount, setCgiCount] = useState(0);
  const [deliverablesPresetTab, setDeliverablesPresetTab] = useState('all');
  const [selectedSpecs, setSelectedSpecs] = useState([
    '4K Master Resolution (3840×2160)',
    'Commercial Model Rights Cleared',
  ]);

  // Tag selection for requirements
  const defaultTags = [
    '3D CGI Renders',
    'Macro Product Stills',
    'Vertical Reels (9:16)',
    'Commercial Clearance',
    'Color Grading',
    'High Resolution (4K)',
    'Lighting Direction',
    'Perpetual Rights',
  ];

  const [selectedTags, setSelectedTags] = useState(() => {
    if (campaign?.phrases && campaign.phrases.length > 0) {
      return campaign.phrases.map((p) => p.chip).filter(Boolean);
    }
    return ['3D CGI Renders', 'Vertical Reels (9:16)', 'Commercial Clearance'];
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Quick preset templates
  const sampleTemplates = [
    {
      name: 'Sneaker Drop',
      brand: 'Velo-Stride',
      title: 'Velo-Stride Urban Sneaker Drop',
      budget: 150000,
      deliverables: '3 Stills (4:5) + 2 Reels (9:16)',
      text: 'Photorealistic urban performance sneaker launch. Hero CGI stills for billboard and web, plus vertical short-form reels showcasing shoe flex and rain traction under wet asphalt conditions. Target audience: Gen Z streetwear collectors.',
      tags: ['3D CGI Renders', 'Vertical Reels (9:16)', 'Macro Product Stills', 'Commercial Clearance'],
    },
    {
      name: 'Botanical Skincare',
      brand: 'Nila Organics',
      title: 'Nila Monsoon Botanical Skincare',
      budget: 25000,
      deliverables: '4 Stills (4:5)',
      text: 'Organic Ayurvedic hydration serum launch. 4 soft pastel still compositions capturing morning rainwater on lotus leaves with organic gouache texture and macro droplets.',
      tags: ['Macro Product Stills', 'High Resolution (4K)', 'Lighting Direction', 'Commercial Clearance'],
    },
    {
      name: 'Fintech Explainer',
      brand: 'SetuPay',
      title: 'SetuPay UPI Instant Settlement Series',
      budget: 30000,
      deliverables: '3 Motion Explainers (16:9)',
      text: 'Merchant offline QR settlement feature. 3 isometric technical explainer animations demonstrating instant audio soundbox verification with clean minimalist CAD aesthetics.',
      tags: ['3D CGI Renders', 'High Resolution (4K)', 'Commercial Clearance', 'Color Grading'],
    },
  ];

  const handleApplyTemplate = (tmpl) => {
    setBrandName(tmpl.brand);
    setTitle(tmpl.title);
    setBudgetVal(tmpl.budget);
    setDeliverablesText(tmpl.deliverables);
    setRawText(tmpl.text);
    setSelectedTags(tmpl.tags);

    onUpdateCampaign?.({
      ...campaign,
      brandName: tmpl.brand,
      title: tmpl.title,
      budget: tmpl.budget,
      deliverablesText: tmpl.deliverables,
      fullText: tmpl.text,
      description: tmpl.text,
    });
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (newTagInput.trim() && !selectedTags.includes(newTagInput.trim())) {
      setSelectedTags([...selectedTags, newTagInput.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const deliverableCategories = [
    {
      id: 'all',
      name: 'All Presets',
      presets: [
        '3 Stills (4:5) + 2 Reels (9:16)',
        '4 Product Hero Stills (4:5)',
        '3 Motion Explainers (16:9)',
        'Social Launch Kit (4 Stills + 2 Reels + 1 Banner)',
        '6 E-Commerce Catalog Renders (1:1)',
        '2 Viral Reels (9:16) + 1 Carousel (6 Slides)',
        'Single 3D Hero Render + Alpha Mask',
        'Full 360° Product Turntable Loop (1:1)',
        '3 Macro Material Texture Stills',
        '2 Retouched Billboard Master Files (4K)',
        'Brand Teaser Reel (9:16) + 3 Hero Stills',
        'Interactive 3D GLTF Asset Package',
      ],
    },
    {
      id: 'social',
      name: 'Social & Drops',
      presets: [
        '3 Stills (4:5) + 2 Reels (9:16)',
        'Social Launch Kit (4 Stills + 2 Reels + 1 Banner)',
        '2 Viral Reels (9:16) + 1 Carousel (6 Slides)',
        'Brand Teaser Reel (9:16) + 3 Hero Stills',
      ],
    },
    {
      id: 'product',
      name: 'Product & E-Commerce',
      presets: [
        '4 Product Hero Stills (4:5)',
        '6 E-Commerce Catalog Renders (1:1)',
        '3 Macro Material Texture Stills',
        '8 Multi-Angle Apparel Stills (4:5)',
      ],
    },
    {
      id: 'motion',
      name: 'Motion & Video',
      presets: [
        '3 Motion Explainers (16:9)',
        'Full 360° Product Turntable Loop (1:1)',
        '3 Looping Product GIFs / MP4s (9:16)',
        'Brand Story Hero Video (16:9 4K)',
      ],
    },
    {
      id: '3d',
      name: '3D CGI & Spatial',
      presets: [
        'Single 3D Hero Render + Alpha Mask',
        '2 Retouched Billboard Master Files (4K)',
        'Interactive 3D GLTF Asset Package',
        'Single 3D Hero Render',
      ],
    },
  ];

  const aspectRatios = [
    { label: '9:16 Vertical', desc: 'Reels, TikTok, Stories', icon: Smartphone, tag: 'Reels (9:16)' },
    { label: '4:5 Portrait', desc: 'Feed & Carousels', icon: Camera, tag: 'Stills (4:5)' },
    { label: '1:1 Square', desc: 'Catalog & Grid', icon: Layers, tag: 'Square (1:1)' },
    { label: '16:9 Landscape', desc: 'Web & Video', icon: Monitor, tag: 'Video (16:9)' },
    { label: '3D Spatial', desc: 'GLTF / OBJ Models', icon: Box, tag: '3D Asset' },
  ];

  const technicalSpecsList = [
    '4K Master Resolution (3840×2160)',
    'Layered PSD / Source Files',
    'Transparent Alpha Video (ProRes 4444)',
    'Color Grading & LUT Included',
    'Audio Stems & Sound Design',
    'Commercial Model Rights Cleared',
    'Fast 3-Day Turnaround SLA',
    'Full Copyright Assignment',
  ];

  const handleUpdateCounts = (stills, reels, motion, cgi) => {
    const s = Math.max(0, stills);
    const r = Math.max(0, reels);
    const m = Math.max(0, motion);
    const c = Math.max(0, cgi);
    setStillsCount(s);
    setReelsCount(r);
    setMotionCount(m);
    setCgiCount(c);

    const parts = [];
    if (s > 0) parts.push(`${s} Still${s > 1 ? 's' : ''} (4:5)`);
    if (r > 0) parts.push(`${r} Reel${r > 1 ? 's' : ''} (9:16)`);
    if (m > 0) parts.push(`${m} Motion Video${m > 1 ? 's' : ''} (16:9)`);
    if (c > 0) parts.push(`${c} 3D Render${c > 1 ? 's' : ''}`);

    if (parts.length > 0) {
      setDeliverablesText(parts.join(' + '));
    } else {
      setDeliverablesText('Custom Asset Package');
    }
  };

  const handleToggleSpec = (spec) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter((s) => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const handleAppendFormat = (formatTag) => {
    if (!deliverablesText || deliverablesText === 'Custom Asset Package') {
      setDeliverablesText(`1 ${formatTag}`);
    } else if (!deliverablesText.includes(formatTag)) {
      setDeliverablesText(`${deliverablesText} + 1 ${formatTag}`);
    }
  };

  const handleSaveAndProceed = () => {
    onUpdateCampaign?.({
      ...campaign,
      brandName,
      title,
      budget: budgetVal,
      currency,
      deadline,
      deliverablesText,
      fullText: rawText,
      description: rawText,
      deliverableSpecs: selectedSpecs,
      status: 'matches_ready',
      step: 2,
    });
    onProceedToMatches?.();
  };

  const isFormValid = brandName.trim() && budgetVal > 0 && title.trim();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 pb-32 space-y-8">
      {/* Header & Direct Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            <span>{campaign?.code || 'CAMPAIGN'} · BRIEF SPECIFICATION</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-1.5">
            {title || 'Campaign Specification'}
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Specify commercial scope, format deliverables, and creative guidelines to match vetted creators.
          </p>
        </div>

        <button
          onClick={handleSaveAndProceed}
          disabled={!isFormValid}
          className={`h-11 px-5 rounded-ctl text-[13px] font-medium flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer ${
            isFormValid
              ? 'bg-cobalt hover:bg-cobalt-press text-white'
              : 'bg-sunken text-ink-3 cursor-not-allowed border border-line'
          }`}
        >
          <span>Find Verified Matches</span>
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): The Brief Builder Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Parameters (Identity & Budget) */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                01 · CORE COMMISSION PARAMETERS
              </span>
              <span className="font-mono text-[10px] text-ink-3 uppercase">
                REQUIRED FOR MATCHING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Urban Performance Sneaker Drop"
                  className="w-full h-10 px-3.5 text-[14px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Brand / Client Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Velo-Stride"
                  className="w-full h-10 px-3.5 text-[14px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Commission Budget ({currency})
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(Number(e.target.value))}
                    step="5000"
                    min="1000"
                    className="w-full h-10 pl-3.5 pr-20 text-[14px] font-mono rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="absolute right-1.5 h-7 px-2 rounded-ctl bg-surface border border-line text-[11px] font-mono text-ink focus:outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-10 px-3.5 text-[14px] font-mono rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Deliverables Specification */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                02 · DELIVERABLE SPECIFICATIONS
              </span>
              <span className="font-mono text-[10px] text-ink-3 uppercase">
                ASSETS, FORMATS & TECHNICAL SPECS
              </span>
            </div>

            {/* 1. Main Package Summary input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[10px] uppercase text-ink-3">
                  DELIVERABLE PACKAGE SUMMARY
                </label>
                <span className="text-[11px] text-ink-3 font-mono">
                  Custom or auto-compiled from mixer
                </span>
              </div>
              <input
                type="text"
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                placeholder="e.g. 3 Stills (4:5) + 2 Reels (9:16)"
                className="w-full h-11 px-3.5 text-[14px] font-mono rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
              />
            </div>

            {/* 2. Interactive Quick Asset Mixer (Quantity Steppers) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-ink-3 font-semibold flex items-center gap-1.5">
                  <Sliders size={12} className="text-cobalt" />
                  <span>INTERACTIVE ASSET MIXER (STEPPER CONTROLS)</span>
                </span>
                <span className="font-mono text-[10px] text-cobalt font-medium">
                  Click +/- to auto-compile package
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Stepper 1: Stills */}
                <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                  <div className="flex items-center gap-1.5 text-ink-2">
                    <Camera size={14} className="text-ink-3" />
                    <span className="font-mono text-[11px] font-semibold text-ink truncate">
                      Stills (4:5)
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount - 1, reelsCount, motionCount, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className="font-mono text-[14px] font-semibold text-ink tnum">
                      {stillsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount + 1, reelsCount, motionCount, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Stepper 2: Reels */}
                <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                  <div className="flex items-center gap-1.5 text-ink-2">
                    <Smartphone size={14} className="text-ink-3" />
                    <span className="font-mono text-[11px] font-semibold text-ink truncate">
                      Reels (9:16)
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount - 1, motionCount, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className="font-mono text-[14px] font-semibold text-ink tnum">
                      {reelsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount + 1, motionCount, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Stepper 3: Motion */}
                <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                  <div className="flex items-center gap-1.5 text-ink-2">
                    <Monitor size={14} className="text-ink-3" />
                    <span className="font-mono text-[11px] font-semibold text-ink truncate">
                      Video (16:9)
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount, motionCount - 1, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className="font-mono text-[14px] font-semibold text-ink tnum">
                      {motionCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount, motionCount + 1, cgiCount)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Stepper 4: 3D CGI */}
                <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                  <div className="flex items-center gap-1.5 text-ink-2">
                    <Box size={14} className="text-ink-3" />
                    <span className="font-mono text-[11px] font-semibold text-ink truncate">
                      3D Renders
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount, motionCount, cgiCount - 1)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span className="font-mono text-[14px] font-semibold text-ink tnum">
                      {cgiCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCounts(stillsCount, reelsCount, motionCount, cgiCount + 1)}
                      className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Categorized Deliverable Presets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-ink-3 uppercase font-semibold">
                  CURATED PRESET PACKAGES BY USE-CASE:
                </span>

                {/* Category tabs */}
                <div className="flex items-center gap-1 bg-paper p-0.5 rounded-ctl border border-line">
                  {deliverableCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDeliverablesPresetTab(cat.id)}
                      className={`px-2 py-0.5 rounded-[3px] font-mono text-[10px] transition-colors cursor-pointer ${
                        deliverablesPresetTab === cat.id
                          ? 'bg-surface text-ink font-semibold shadow-2xs border border-line'
                          : 'text-ink-3 hover:text-ink'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {(
                  deliverableCategories.find((c) => c.id === deliverablesPresetTab) ||
                  deliverableCategories[0]
                ).presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDeliverablesText(preset)}
                    className={`px-2.5 py-1 rounded-ctl text-[11px] font-mono border transition-colors cursor-pointer ${
                      deliverablesText === preset
                        ? 'bg-ink text-surface border-ink font-medium shadow-2xs'
                        : 'bg-paper text-ink-2 border-line hover:border-line-strong hover:text-ink'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Aspect Ratio & Delivery Formats */}
            <div className="space-y-2 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-ink-3 font-semibold block">
                  STANDARD ASPECT RATIOS (CLICK TO APPEND TO PACKAGE):
                </span>
                <span className="font-mono text-[10px] text-ink-3">
                  Click to add
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {aspectRatios.map((ar, i) => {
                  const Icon = ar.icon;
                  const isPresent = deliverablesText.includes(ar.tag);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAppendFormat(ar.tag)}
                      className={`p-2.5 rounded-ctl border text-left transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-cobalt-tint border-cobalt text-cobalt font-medium shadow-2xs'
                          : 'bg-paper border-line text-ink-2 hover:border-line-strong hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={14} className={isPresent ? 'text-cobalt' : 'text-ink-3'} />
                        <span className="font-mono text-[11px] font-semibold truncate">
                          {ar.label}
                        </span>
                      </div>
                      <span className="font-ui text-[10px] text-ink-3 block leading-tight truncate">
                        {ar.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Technical Specifications & Deliverables Extras */}
            <div className="space-y-2 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-ink-3 font-semibold block">
                  TECHNICAL DELIVERABLE STANDARDS & EXTRAS:
                </span>
                <span className="font-mono text-[10px] text-verified font-medium">
                  {selectedSpecs.length} Active Specs
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {technicalSpecsList.map((spec, i) => {
                  const isChecked = selectedSpecs.includes(spec);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleSpec(spec)}
                      className={`px-2.5 py-1 rounded-ctl text-[11px] font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isChecked
                          ? 'bg-verified/10 text-verified border-verified/40 font-semibold'
                          : 'bg-paper text-ink-2 border-line hover:border-line-strong hover:text-ink'
                      }`}
                    >
                      {isChecked ? (
                        <Check size={12} strokeWidth={2.5} className="text-verified" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full border border-line-strong inline-block" />
                      )}
                      <span>{spec}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Creative Direction & Specification */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                03 · CREATIVE DIRECTION & BRIEF
              </span>

              {/* Sample Brief Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[10px] text-ink-3 uppercase mr-1">
                  SAMPLE BRIEFS:
                </span>
                {sampleTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2 py-0.5 rounded-ctl bg-paper border border-line hover:border-cobalt text-ink-2 hover:text-cobalt text-[10px] font-mono transition-colors cursor-pointer"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Describe project context, product materials, lighting references, platform distribution, and any specific constraints..."
                rows={6}
                className="w-full p-4 rounded-ctl bg-paper border border-line text-[14px] leading-relaxed text-ink placeholder:text-ink-3 focus:outline-none focus:border-cobalt transition-colors resize-y"
              />
            </div>

            {/* Requirement Tags Selector */}
            <div className="pt-2 border-t border-line/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-ink-3 tracking-wider">
                  KEY REQUIREMENT TAGS (CLICK TO TOGGLE)
                </span>
                <span className="font-mono text-[10px] text-ink-3">
                  {selectedTags.length} SELECTED
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {defaultTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-ink text-surface border-ink font-semibold shadow-2xs'
                          : 'bg-paper text-ink-2 border-line hover:border-line-strong'
                      }`}
                    >
                      {isSelected && <Check size={11} strokeWidth={2.5} />}
                      <span>{tag}</span>
                    </button>
                  );
                })}

                {/* Custom Tags Added by User */}
                {selectedTags
                  .filter((t) => !defaultTags.includes(t))
                  .map((customTag) => (
                    <span
                      key={customTag}
                      className="px-3 py-1.5 rounded-ctl font-mono text-[11px] bg-cobalt-tint text-cobalt border border-cobalt/30 flex items-center gap-1.5"
                    >
                      <span>{customTag}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleTag(customTag)}
                        className="hover:text-ink cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}

                {showTagInput ? (
                  <form onSubmit={handleAddCustomTag} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Custom tag..."
                      className="h-8 px-2.5 text-[11px] font-mono rounded-ctl bg-paper border border-cobalt text-ink focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-8 px-2 rounded-ctl bg-ink text-surface text-[10px] font-mono cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTagInput(false)}
                      className="h-8 px-1.5 text-ink-3 hover:text-ink text-[10px] cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(true)}
                    className="px-2.5 py-1.5 rounded-ctl font-mono text-[11px] border border-dashed border-line text-ink-3 hover:text-ink hover:border-line-strong transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={11} />
                    <span>Add requirement</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Match Readiness & Commission Blueprint */}
        <div className="lg:col-span-4 space-y-6">
          {/* Match Readiness Checklist */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                MATCH READINESS CHECKLIST
              </span>
              <span className="font-mono text-[9px] bg-verified/10 text-verified px-2 py-0.5 rounded-[2px] font-semibold">
                VERIFIED READY
              </span>
            </div>

            <div className="space-y-3 font-mono text-[12px]">
              <div className="flex items-start gap-2.5 p-3 rounded-ctl bg-paper border border-line">
                <div className="w-4 h-4 rounded-full bg-verified/15 text-verified flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-semibold text-ink">Budget Allocated</div>
                  <div className="text-[11px] text-ink-3 mt-0.5">
                    {formatRupees(budgetVal)} {currency} committed
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-ctl bg-paper border border-line">
                <div className="w-4 h-4 rounded-full bg-verified/15 text-verified flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-semibold text-ink">Scope Defined</div>
                  <div className="text-[11px] text-ink-3 mt-0.5 truncate">
                    {deliverablesText}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-ctl bg-paper border border-line">
                <div className="w-4 h-4 rounded-full bg-verified/15 text-verified flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-semibold text-ink">Commercial Clearance</div>
                  <div className="text-[11px] text-ink-3 mt-0.5">
                    Perpetual commercial rights required
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-ctl bg-paper border border-line">
                <div className="w-4 h-4 rounded-full bg-verified/15 text-verified flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="font-semibold text-ink">Target Creators Pool</div>
                  <div className="text-[11px] text-ink-3 mt-0.5">
                    8 vetted creators in database
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button in Right Column */}
            <button
              onClick={handleSaveAndProceed}
              disabled={!isFormValid}
              className={`w-full h-11 px-4 rounded-ctl text-[13px] font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                isFormValid
                  ? 'bg-cobalt hover:bg-cobalt-press text-white'
                  : 'bg-sunken text-ink-3 cursor-not-allowed border border-line'
              }`}
            >
              <span>Proceed to Matches</span>
              <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Transparent Rate Advisory */}
          <div className="p-5 rounded-card bg-surface border border-line shadow-2xs space-y-2">
            <span className="font-mono text-[10px] uppercase font-semibold text-ink-3 block">
              TRANSPARENT MARKET BENCHMARK
            </span>
            <p className="text-[13px] text-ink leading-relaxed">
              Vetted 3D & CGI artists typically charge between <span className="font-mono font-semibold">₹15,000</span> and <span className="font-mono font-semibold">₹40,000</span> for commercial still & motion packages with verified generation logs.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <CampaignActionBar
        backLabel="All campaigns"
        onBack={onBack}
        statusText={`${title} · Budget: ${formatRupees(budgetVal)}`}
        forwardLabel="Find creators"
        onForward={handleSaveAndProceed}
      />
    </div>
  );
}
