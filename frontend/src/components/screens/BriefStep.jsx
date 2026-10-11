import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  Calendar,
  Sparkles,
  Camera,
  Layers,
  Monitor,
  Smartphone,
  Sliders,
  Box,
  Lock,
  RotateCcw,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { CampaignActionBar } from '../navigation/CampaignActionBar';
import { formatCurrency } from '../../utils/formatters';

/**
 * BriefStep (Step 1: Campaign Brief & Specification)
 * @param {{
 *   campaign: any;
 *   onUpdateCampaign: (updates: any) => Promise<any>;
 *   onGenerateBrief: () => Promise<any>;
 *   isGenerating?: boolean;
 *   generationError?: string | null;
 *   generationSource?: string | null;
 *   onBack: () => void;
 *   onProceedToMatches: () => void;
 * }} props
 */
export function BriefStep({
  campaign,
  onUpdateCampaign,
  onGenerateBrief,
  isGenerating = false,
  generationError = null,
  generationSource = null,
  onBack,
  onProceedToMatches,
}) {
  // Immutable Fields (Displayed for context, locked from manual edit to obey backend contract)
  const brandName = campaign?.brandName || campaign?.rawBrief?.brand_name || 'Brand Commission';
  const productDescription = campaign?.description || campaign?.rawBrief?.product_description || '';
  const targetAudience = campaign?.targetAudience || campaign?.rawBrief?.target_audience || 'Target demographics';
  const budgetMin = campaign?.budgetMin ?? campaign?.rawBrief?.budget_min ?? 0;
  const budgetMax = campaign?.budgetMax ?? campaign?.rawBrief?.budget_max ?? campaign?.budget ?? 0;
  const currency = campaign?.currency || campaign?.rawBrief?.currency || 'USD';
  const deadline = campaign?.deadline || campaign?.rawBrief?.deadline || null;

  // Editable Fields
  const [title, setTitle] = useState(campaign?.title || campaign?.rawBrief?.campaign_title || '');
  const [objective, setObjective] = useState(campaign?.objective || campaign?.rawBrief?.objective || '');
  const [style, setStyle] = useState(campaign?.preferredStyle || campaign?.rawBrief?.preferred_style || '');
  const [tone, setTone] = useState(campaign?.tone || campaign?.rawBrief?.tone || '');
  const [callToAction, setCallToAction] = useState(campaign?.callToAction || campaign?.rawBrief?.call_to_action || '');

  // List fields
  const [deliverables, setDeliverables] = useState(
    campaign?.deliverables && campaign.deliverables.length > 0
      ? campaign.deliverables
      : campaign?.rawBrief?.deliverables || ['3 Stills (4:5)', '2 Reels (9:16)']
  );

  const [platforms, setPlatforms] = useState(
    campaign?.preferredPlatforms && campaign.preferredPlatforms.length > 0
      ? campaign.preferredPlatforms
      : campaign?.rawBrief?.preferred_platforms || ['Instagram', 'TikTok']
  );

  const [skills, setSkills] = useState(
    campaign?.requiredSkills && campaign.requiredSkills.length > 0
      ? campaign.requiredSkills
      : campaign?.rawBrief?.required_skills || ['Product Photography', 'Color Grading']
  );

  const [niches, setNiches] = useState(
    campaign?.preferredNiches && campaign.preferredNiches.length > 0
      ? campaign.preferredNiches
      : campaign?.rawBrief?.preferred_niches || ['Fashion', 'Streetwear']
  );

  const [keyMessages, setKeyMessages] = useState(
    campaign?.keyMessages && campaign.keyMessages.length > 0
      ? campaign.keyMessages
      : campaign?.rawBrief?.key_messages || []
  );

  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [saveErrorMsg, setSaveErrorMsg] = useState(null);

  // Sync state if campaign prop updates (e.g. after AI generation)
  useEffect(() => {
    if (campaign) {
      if (campaign.title) setTitle(campaign.title);
      if (campaign.objective) setObjective(campaign.objective);
      if (campaign.preferredStyle) setStyle(campaign.preferredStyle);
      if (campaign.tone) setTone(campaign.tone);
      if (campaign.callToAction) setCallToAction(campaign.callToAction);
      if (campaign.deliverables && campaign.deliverables.length > 0) setDeliverables(campaign.deliverables);
      if (campaign.preferredPlatforms && campaign.preferredPlatforms.length > 0) setPlatforms(campaign.preferredPlatforms);
      if (campaign.requiredSkills && campaign.requiredSkills.length > 0) setSkills(campaign.requiredSkills);
      if (campaign.preferredNiches && campaign.preferredNiches.length > 0) setNiches(campaign.preferredNiches);
      if (campaign.keyMessages && campaign.keyMessages.length > 0) setKeyMessages(campaign.keyMessages);
    }
  }, [campaign]);

  // Steppers for deliverables quick mixing
  const [stillsCount, setStillsCount] = useState(3);
  const [reelsCount, setReelsCount] = useState(2);

  const handleUpdateCounts = (stills, reels) => {
    const s = Math.max(0, stills);
    const r = Math.max(0, reels);
    setStillsCount(s);
    setReelsCount(r);

    const newDelivs = [];
    if (s > 0) newDelivs.push(`${s} Still${s > 1 ? 's' : ''} (4:5)`);
    if (r > 0) newDelivs.push(`${r} Reel${r > 1 ? 's' : ''} (9:16)`);
    if (newDelivs.length > 0) {
      setDeliverables(newDelivs);
    }
  };

  const handleTogglePlatform = (plat) => {
    if (platforms.includes(plat)) {
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleToggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleToggleNiche = (niche) => {
    if (niches.includes(niche)) {
      setNiches(niches.filter((n) => n !== niche));
    } else {
      setNiches([...niches, niche]);
    }
  };

  const [isMatching, setIsMatching] = useState(false);

  // Save changes via PATCH /api/campaigns/<id>
  const handleSaveOnly = async () => {
    setSaveStatus('saving');
    setSaveErrorMsg(null);
    try {
      await onUpdateCampaign({
        campaign_title: title.trim(),
        objective: objective.trim(),
        deliverables: deliverables,
        preferred_platforms: platforms,
        required_skills: skills,
        preferred_niches: niches,
        preferred_style: style.trim(),
        tone: tone.trim(),
        key_messages: keyMessages,
        call_to_action: callToAction.trim(),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      setSaveStatus('error');
      setSaveErrorMsg(err?.message || 'Failed to update brief fields');
      throw err;
    }
  };

  const handleProceed = async () => {
    if (isMatching || saveStatus === 'saving') return;
    setIsMatching(true);
    try {
      await handleSaveOnly();
      if (onProceedToMatches) {
        await onProceedToMatches();
      }
    } catch {
      // stay on page on error
    } finally {
      setIsMatching(false);
    }
  };

  const providerLabel = generationSource || campaign?.generatedBy || campaign?.rawBrief?.generated_by || 'user';

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 pb-32 space-y-8">
      {/* Header & Direct Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full bg-verified" />
            <span>{campaign?.code || 'CAMPAIGN'} · BRIEF SPECIFICATION</span>
            <span className="text-line-strong">·</span>
            <span className="uppercase text-cobalt font-medium">Provider: {providerLabel}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-1.5">
            {title || `${brandName} Creative Brief`}
          </h1>
          <p className="text-[14px] text-ink-2 mt-1">
            Configure brief deliverables, style guidelines, and required technical skills.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* AI Generation Trigger */}
          <button
            type="button"
            onClick={onGenerateBrief}
            disabled={isGenerating}
            className={`h-10 px-4 rounded-ctl text-[13px] font-medium flex items-center gap-2 border transition-all cursor-pointer ${
              isGenerating
                ? 'bg-sunken text-ink-3 border-line cursor-wait'
                : 'bg-paper border-cobalt/40 text-cobalt hover:bg-cobalt-tint hover:border-cobalt'
            }`}
            title="Generate structured brief with live Gemini AI"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin text-cobalt" />
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-cobalt" />
                <span>{providerLabel === 'user' ? 'Generate with AI' : 'Regenerate Brief'}</span>
              </>
            )}
          </button>

          {/* Save / Proceed Action */}
          <button
            type="button"
            onClick={handleProceed}
            disabled={saveStatus === 'saving' || isGenerating || isMatching}
            className="h-10 px-5 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {isMatching ? (
              <>
                <Loader2 size={15} className="animate-spin text-white" />
                <span>Finding Verified Matches...</span>
              </>
            ) : (
              <>
                <span>Find Verified Matches</span>
                <ArrowRight size={15} strokeWidth={2} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation Error Banner */}
      {generationError && (
        <div className="p-4 rounded-ctl bg-blocked/10 border border-blocked/30 text-blocked flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px]">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span><strong>AI Generation Alert:</strong> {generationError}</span>
          </div>
          <button
            type="button"
            onClick={onGenerateBrief}
            className="px-3 py-1 rounded-ctl bg-blocked text-white text-[12px] font-mono hover:opacity-90 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Save Status Banner */}
      {saveStatus === 'saved' && (
        <div className="p-3 rounded-ctl bg-verified/10 border border-verified/30 text-verified font-mono text-[12px] flex items-center gap-2">
          <Check size={14} strokeWidth={2.5} />
          <span>Brief changes saved successfully to backend.</span>
        </div>
      )}
      {saveStatus === 'error' && saveErrorMsg && (
        <div className="p-3 rounded-ctl bg-blocked/10 border border-blocked/30 text-blocked font-mono text-[12px] flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Brief Editor Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Core Parameters (Immutable vs Title) */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                01 · CORE COMMISSION PARAMETERS
              </span>
              <span className="font-mono text-[10px] text-ink-3 uppercase flex items-center gap-1">
                <Lock size={10} />
                <span>IMMUTABLE FIELDS PRESERVED</span>
              </span>
            </div>

            {/* Campaign Title (Editable) */}
            <div>
              <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                Campaign Title (Editable)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urban Performance Sneaker Drop"
                className="w-full h-10 px-3.5 text-[14px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
              />
            </div>

            {/* Locked Immutable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line/60">
              {/* Brand Name */}
              <div className="p-3 rounded-ctl bg-sunken/40 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-ink-3">Brand Name</span>
                  <Lock size={10} className="text-ink-3" />
                </div>
                <div className="text-[13px] font-semibold text-ink">{brandName}</div>
              </div>

              {/* Budget Range */}
              <div className="p-3 rounded-ctl bg-sunken/40 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-ink-3">Budget Range</span>
                  <Lock size={10} className="text-ink-3" />
                </div>
                <div className="text-[13px] font-mono font-semibold text-ink">
                  {formatCurrency(budgetMin, currency)} – {formatCurrency(budgetMax, currency)} {currency}
                </div>
              </div>

              {/* Target Deadline */}
              <div className="p-3 rounded-ctl bg-sunken/40 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-ink-3">Target Deadline</span>
                  <Lock size={10} className="text-ink-3" />
                </div>
                <div className="text-[13px] font-mono text-ink">
                  {deadline || 'No hard deadline specified'}
                </div>
              </div>

              {/* Target Audience */}
              <div className="p-3 rounded-ctl bg-sunken/40 border border-line space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-ink-3">Target Audience</span>
                  <Lock size={10} className="text-ink-3" />
                </div>
                <div className="text-[13px] text-ink truncate">{targetAudience}</div>
              </div>
            </div>

            {/* Product Description */}
            <div className="p-3 rounded-ctl bg-sunken/40 border border-line space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-ink-3">Product Description Premise</span>
                <Lock size={10} className="text-ink-3" />
              </div>
              <p className="text-[13px] text-ink-2 leading-relaxed">{productDescription}</p>
            </div>
          </div>

          {/* Card 2: Creative Direction & AI-generated fields */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                02 · CREATIVE DIRECTION & OBJECTIVES
              </span>
              <span className="font-mono text-[10px] text-cobalt uppercase font-medium">
                AI REFINABLE (PATCH)
              </span>
            </div>

            {/* Objective */}
            <div>
              <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                Strategic Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Primary campaign objective (e.g., Drive product launch awareness and showcase all-weather durability)..."
                rows={2}
                className="w-full p-3 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors resize-y leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Style */}
              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Visual Style
                </label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g. Photorealistic Industrial CGI"
                  className="w-full h-10 px-3.5 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                  Editorial Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g. Sleek, energetic, high-performance"
                  className="w-full h-10 px-3.5 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Call to action */}
            <div>
              <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1.5">
                Call to Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Pre-order drop available at launch"
                className="w-full h-10 px-3.5 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Card 3: Deliverables & Formats */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink">
                03 · DELIVERABLES & FORMAT MIXER
              </span>
              <span className="font-mono text-[10px] text-ink-3 uppercase">
                {deliverables.length} ASSETS SPECIFIED
              </span>
            </div>

            {/* Stepper Mixer */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                <div className="flex items-center gap-1.5 text-ink-2">
                  <Camera size={14} className="text-ink-3" />
                  <span className="font-mono text-[11px] font-semibold text-ink">Stills (4:5)</span>
                </div>
                <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                  <button
                    type="button"
                    onClick={() => handleUpdateCounts(stillsCount - 1, reelsCount)}
                    className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-mono text-[14px] font-semibold text-ink tnum">{stillsCount}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateCounts(stillsCount + 1, reelsCount)}
                    className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-ctl bg-paper border border-line space-y-2">
                <div className="flex items-center gap-1.5 text-ink-2">
                  <Smartphone size={14} className="text-ink-3" />
                  <span className="font-mono text-[11px] font-semibold text-ink">Reels (9:16)</span>
                </div>
                <div className="flex items-center justify-between bg-surface p-1 rounded-ctl border border-line">
                  <button
                    type="button"
                    onClick={() => handleUpdateCounts(stillsCount, reelsCount - 1)}
                    className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-mono text-[14px] font-semibold text-ink tnum">{reelsCount}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateCounts(stillsCount, reelsCount + 1)}
                    className="w-7 h-7 rounded-[4px] hover:bg-sunken flex items-center justify-center text-ink-2 hover:text-ink cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Deliverables chips */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-ink-3 block">
                Deliverables Package
              </label>
              <div className="flex flex-wrap gap-2">
                {deliverables.map((deliv, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-ctl font-mono text-[11px] bg-paper border border-line text-ink flex items-center gap-2"
                  >
                    <span>{deliv}</span>
                    <button
                      type="button"
                      onClick={() => setDeliverables(deliverables.filter((_, i) => i !== idx))}
                      className="text-ink-3 hover:text-ink cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Platforms, Skills, and Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Platforms Tag Selector */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink block">
              PREFERRED PLATFORMS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Instagram', 'TikTok', 'YouTube', 'Billboard', 'Web Storefront', 'Twitter / X'].map((plat) => {
                const isSelected = platforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handleTogglePlatform(plat)}
                    className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-ink text-surface border-ink font-semibold'
                        : 'bg-paper text-ink-2 border-line hover:border-line-strong'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={2.5} />}
                    <span>{plat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Skills Selector */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink block">
              REQUIRED CREATOR SKILLS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Product Photography',
                'Color Grading',
                'ComfyUI',
                'Midjourney',
                '3D CGI Renders',
                'Macro Stills',
                'Lighting Direction',
                'Vertical Video',
              ].map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-ctl font-mono text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-cobalt text-white border-cobalt font-semibold'
                        : 'bg-paper text-ink-2 border-line hover:border-line-strong'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={2.5} />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Match Readiness Box */}
          <div className="p-6 rounded-card bg-surface border border-line shadow-2xs space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-ink block">
              MATCH ENGINE READINESS
            </span>
            <div className="space-y-2.5 font-mono text-[12px]">
              <div className="flex items-center gap-2 p-2.5 rounded-ctl bg-paper border border-line">
                <Check size={13} className="text-verified" strokeWidth={2.5} />
                <span className="text-ink">Budget fit: {formatCurrency(budgetMax, currency)} cap</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-ctl bg-paper border border-line">
                <Check size={13} className="text-verified" strokeWidth={2.5} />
                <span className="text-ink">Deliverables defined: {deliverables.length}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-ctl bg-paper border border-line">
                <Check size={13} className="text-verified" strokeWidth={2.5} />
                <span className="text-ink">Platforms targeted: {platforms.length}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={saveStatus === 'saving'}
              className="w-full py-2.5 rounded-ctl bg-paper hover:bg-sunken border border-line text-ink text-[12px] font-mono transition-colors cursor-pointer"
            >
              {saveStatus === 'saving' ? 'Saving edits...' : 'Save edits without leaving'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BriefStep;
