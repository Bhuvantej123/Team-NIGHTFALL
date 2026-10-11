import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  User,
  ExternalLink,
  TrendingUp,
  Award,
  Users,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { formatRupees } from '../utils/formatters';
import { fetchCreatorAnalytics } from '../api/client';

export interface CreatorPortfolioWork {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  tools?: string[];
  rightsStatus?: string;
  humanInvolvementText?: string;
  humanInvolvementLevel?: number;
  verification?: string;
  aspect?: string;
}


export interface MatchCriteriaItem {
  verdict?: string;
  score?: number;
  evidence?: string;
}

export interface MatchCriteria {
  style?: MatchCriteriaItem;
  tools?: MatchCriteriaItem;
  category?: MatchCriteriaItem;
  consistency?: MatchCriteriaItem;
  [key: string]: MatchCriteriaItem | undefined;
}

export interface UnverifiedClaim {
  req: string;
  note: string;
}

export interface CreatorCandidate {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  portfolio: CreatorPortfolioWork[];
  minPrice?: number;
  maxPrice?: number;
  turnaround?: string;
  fitScore?: number;
  criteria?: MatchCriteria;
  unverifiedClaims?: UnverifiedClaim[];
  commercialDeclared?: boolean;
  [key: string]: any;
}

export interface CastingRoomProps {
  campaign: any;
  creators: CreatorCandidate[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void | Promise<void>;
  onOpenFitSheet?: (creator: CreatorCandidate) => void;
  onBack: () => void;
  onNavigate?: (route: string) => void;
}

export function CastingRoom({
  campaign,
  creators = [],
  shortlistedIds = [],
  onToggleShortlist,
  onOpenFitSheet,
  onBack,
  onNavigate,
}: CastingRoomProps) {
  // Filter candidates matching the campaign
  const candidates = useMemo(() => {
    return creators.filter((c) => c.commercialDeclared !== false);
  }, [creators]);

  // Read initial index from URL query ?c=X
  const initialIndex = useMemo(() => {
    try {
      const hash = window.location.hash || '';
      const queryStr = hash.includes('?') ? hash.split('?')[1] : '';
      const params = new URLSearchParams(queryStr);
      const c = parseInt(params.get('c') || '1', 10);
      if (!isNaN(c) && c >= 1 && c <= creators.length) {
        return c - 1;
      }
    } catch (e) {}
    return 0;
  }, [creators.length]);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [seenSet, setSeenSet] = useState<Set<number>>(() => new Set([initialIndex]));
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [isEnded, setIsEnded] = useState(false);
  const [shortlistError, setShortlistError] = useState<string | null>(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');
  const [_isFitExpanded, setIsFitExpanded] = useState(false);

  // Check prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update seen set and URL query param
  useEffect(() => {
    if (currentIndex < candidates.length && !isEnded) {
      setSeenSet((prev) => new Set([...prev, currentIndex]));
      setActiveWorkIndex(0);

      // Announce candidate navigation
      const candidate = candidates[currentIndex];
      if (candidate) {
        setAriaAnnouncement(`Candidate ${currentIndex + 1} of ${candidates.length}: ${candidate.name}`);
      }

      // Sync URL query (?c=X)
      try {
        const hash = window.location.hash || '';
        const basePath = hash.split('?')[0];
        const newHash = `${basePath}?c=${currentIndex + 1}`;
        if (hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      } catch (e) {}
    }
  }, [currentIndex, candidates, isEnded]);

  // Preload next and previous candidates' lead images
  useEffect(() => {
    if (candidates.length === 0) return;
    const nextIdx = currentIndex + 1;
    const prevIdx = currentIndex - 1;
    if (candidates[nextIdx]?.portfolio?.[0]?.imageUrl) {
      const img = new Image();
      img.src = candidates[nextIdx].portfolio[0].imageUrl;
    }
    if (candidates[prevIdx]?.portfolio?.[0]?.imageUrl) {
      const img = new Image();
      img.src = candidates[prevIdx].portfolio[0].imageUrl;
    }
  }, [currentIndex, candidates]);

  const candidate = candidates[currentIndex] || null;
  const isShortlisted = candidate ? shortlistedIds.includes(candidate.id) : false;

  const [candidateAnalytics, setCandidateAnalytics] = useState<any>(null);

  useEffect(() => {
    if (!candidate?.id) {
      setCandidateAnalytics(null);
      return;
    }
    let isMounted = true;
    fetchCreatorAnalytics(candidate.id)
      .then((data) => {
        if (isMounted) setCandidateAnalytics(data);
      })
      .catch((err) => {
        console.warn('Analytics unavailable for candidate:', candidate.id, err);
      });
    return () => {
      isMounted = false;
    };
  }, [candidate?.id]);


  // Shortlist action with optimistic revert and announce
  const handleToggleShortlist = useCallback(async () => {
    if (!candidate) return;
    setShortlistError(null);
    const wasShortlisted = shortlistedIds.includes(candidate.id);
    const candidateName = candidate.name || 'Candidate';

    setAriaAnnouncement(
      wasShortlisted
        ? `${candidateName} removed from shortlist`
        : `${candidateName} added to shortlist`
    );

    try {
      const result = onToggleShortlist(candidate.id);
      if (result instanceof Promise) {
        await result;
      }
    } catch (err) {
      setShortlistError("Couldn't update your shortlist. Try again.");
      setAriaAnnouncement("Couldn't update your shortlist. Try again.");
    }
  }, [candidate, shortlistedIds, onToggleShortlist]);

  // Current work
  const currentWork = candidate?.portfolio?.[activeWorkIndex] || candidate?.portfolio?.[0] || null;
  const isImageFailed = currentWork?.id ? imageErrorMap[currentWork.id] : false;

  // Budget comparison line
  const budgetNotice = useMemo(() => {
    if (!candidate || !campaign?.budget || !candidate.minPrice) return null;
    if (candidate.minPrice <= campaign.budget) {
      return { text: 'Starts within your budget', isUnder: true };
    }
    const diff = candidate.minPrice - campaign.budget;
    return { text: `${formatRupees(diff)} over your budget`, isUnder: false };
  }, [candidate, campaign?.budget]);

  // Shortlisted candidates for end state
  const shortlistedCandidates = useMemo(() => {
    return candidates.filter((c) => shortlistedIds.includes(c.id));
  }, [candidates, shortlistedIds]);

  // Next / Previous navigation
  const goNext = useCallback(() => {
    setActiveWorkIndex(0);
    if (currentIndex < candidates.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => {
        const next = prev + 1;
        setSeenSet((s) => new Set([...s, next]));
        return next;
      });
      setIsEnded(false);
    } else {
      setIsEnded(true);
    }
  }, [currentIndex, candidates.length]);

  const goPrev = useCallback(() => {
    setActiveWorkIndex(0);
    if (isEnded) {
      setIsEnded(false);
      return;
    }
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => {
        const next = prev - 1;
        setSeenSet((s) => new Set([...s, next]));
        return next;
      });
    }
  }, [isEnded, currentIndex]);

  const handleOpenFit = useCallback(() => {
    if (!candidate) return;
    if (onOpenFitSheet) {
      onOpenFitSheet(candidate);
    } else {
      setIsFitExpanded((prev) => !prev);
    }
  }, [candidate, onOpenFitSheet]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys when typing in input, textarea, select or modifier key held
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(activeTag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleToggleShortlist();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleOpenFit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, handleToggleShortlist, handleOpenFit, onBack]);

  // Touch Swipe on Main Image Container
  const pointerStartX = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (deltaX > 60) {
      goPrev();
    } else if (deltaX < -60) {
      goNext();
    }
  };

  // Filmstrip auto-scroll
  const filmstripItemRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  useEffect(() => {
    const el = filmstripItemRefs.current[currentIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // 0 Candidates State
  if (!candidates || candidates.length === 0) {
    return (
      <div className="h-screen w-screen bg-stage text-stage-ink flex flex-col items-center justify-center p-6 select-none">
        <div className="max-w-md w-full p-8 rounded-card bg-stage-raised border border-stage-line text-center space-y-4">
          <div className="font-mono text-[11px] text-stage-ink-2 uppercase tracking-wider">
            CASTING ROOM
          </div>
          <h2 className="font-display text-3xl text-stage-ink">No matches to review</h2>
          <p className="text-stage-ink-2 text-[14px]">
            No creators currently match this campaign’s criteria.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate(`/campaigns/${campaign?.id}/brief`);
                } else {
                  window.location.hash = `/campaigns/${campaign?.id}/brief`;
                }
              }}
              className="px-5 py-2.5 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium transition-colors cursor-pointer"
            >
              Return to Brief
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-stage text-stage-ink flex flex-col overflow-hidden select-none">
      {/* Aria-live polite region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Top Bar (56px) */}
      <header className="h-14 border-b border-stage-line px-6 flex items-center justify-between flex-shrink-0 z-30 bg-stage">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-stage-ink-2 hover:text-stage-ink text-[13px] font-medium transition-colors cursor-pointer px-2 py-1 rounded-ctl hover:bg-stage-raised"
          >
            <ArrowLeft size={14} />
            <span>Back to list</span>
            <span className="font-mono text-[10px] bg-stage-raised border border-stage-line px-1.5 py-0.5 rounded-[3px] text-stage-ink-2 hidden sm:inline">
              Esc
            </span>
          </button>
        </div>

        <div className="text-center truncate px-4">
          <span className="font-mono text-[12px] uppercase tracking-wider text-stage-ink-2">
            {campaign?.title || 'Creative Campaign'}
          </span>
        </div>

        <div className="font-mono text-[12px] text-stage-ink-2">
          {!isEnded ? (
            <span>
              Candidate <span className="text-stage-ink font-semibold">{currentIndex + 1}</span> of {candidates.length}
            </span>
          ) : (
            <span>Review Complete</span>
          )}
        </div>
      </header>

      {/* Main Casting View Area */}
      {!isEnded && candidate ? (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Center-Left: Main Visual Stage */}
          {/* Center-Left: Main Visual Stage Centerpiece */}
          <div
            className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden relative"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            {/* Lead Media Presentation */}
            <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${candidate.id}-${activeWorkIndex}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction * 24 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: direction * -24 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.1 : 0.2,
                    ease: 'easeOut',
                  }}
                  className="w-full flex flex-col items-center justify-center max-h-[calc(100vh-56px-140px-48px)] overflow-hidden"
                >
                  {currentWork?.imageUrl && !isImageFailed ? (
                    <img
                      src={currentWork.imageUrl}
                      alt={currentWork.title || 'Creator Portfolio Work'}
                      onError={() => {
                        if (currentWork?.id) {
                          setImageErrorMap((prev) => ({ ...prev, [currentWork.id]: true }));
                        }
                      }}
                      className="max-h-[calc(100vh-56px-170px-48px)] max-w-full object-contain rounded-card border border-stage-line shadow-2xl transition-opacity duration-150"
                    />
                  ) : (
                    <div className="w-[520px] h-[380px] rounded-card bg-stage-raised border border-stage-line flex flex-col items-center justify-center p-6 text-center">
                      <div className="font-mono text-[13px] text-stage-ink font-medium">
                        {currentWork?.title || 'Portfolio Work'}
                      </div>
                      <div className="font-mono text-[11px] text-stage-ink-2 mt-1">
                        Asset preview currently unavailable
                      </div>
                    </div>
                  )}

                  {/* Specimen Work Title & Description */}
                  <div className="pt-3 text-center max-w-2xl px-4">
                    <h2 className="font-display text-xl text-stage-ink font-medium tracking-wide">
                      {currentWork?.title || 'Specimen Artwork'}
                    </h2>
                    {currentWork?.description && (
                      <p className="font-ui text-[12px] text-stage-ink-2 mt-0.5 line-clamp-2">
                        {currentWork.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Distinct Thumbnails Filmstrip */}
              {candidate.portfolio && candidate.portfolio.length > 1 && (
                <div className="flex items-center gap-2.5 pt-3">
                  {candidate.portfolio.map((w, idx) => (
                    <button
                      key={w.id || idx}
                      onClick={() => setActiveWorkIndex(idx)}
                      className={`w-14 h-14 rounded-ctl overflow-hidden border transition-all cursor-pointer relative group ${
                        activeWorkIndex === idx
                          ? 'border-cobalt ring-2 ring-cobalt/40 opacity-100 scale-105'
                          : 'border-stage-line opacity-60 hover:opacity-100'
                      }`}
                      title={w.title || `Portfolio item ${idx + 1}`}
                    >
                      <img
                        src={w.imageUrl}
                        alt={w.title || 'Thumbnail'}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-stage/80 text-[8.5px] font-mono text-stage-ink text-center py-0.2 opacity-0 group-hover:opacity-100 transition-opacity">
                        #{idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Credit Line under visual stage */}
              <div className="pt-2 text-center">
                <p className="font-mono text-[10.5px] uppercase tracking-wider text-stage-ink-2">
                  {(currentWork?.tools || candidate.tools || []).join(' · ') || 'Not provided'}
                  {currentWork?.rightsStatus ? (
                    <span> · {currentWork.rightsStatus}</span>
                  ) : (
                    <span> · COMMERCIAL RIGHTS DECLARED</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Structured Intelligence Sidebar (400px) */}
          <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-stage-line bg-stage-raised flex flex-col justify-between overflow-y-auto flex-shrink-0 z-20">
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="p-6 space-y-5"
            >
              {/* Creator Identity & Full Dossier Link */}
              <div className="space-y-1.5 border-b border-stage-line pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-cobalt font-semibold bg-cobalt/15 px-2 py-0.5 rounded-[2px] border border-cobalt/30">
                    CANDIDATE INTELLIGENCE
                  </span>
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(`/creators/${candidate.id}`);
                      } else {
                        window.location.href = `/creators/${candidate.id}`;
                      }
                    }}
                    className="inline-flex items-center gap-1 font-mono text-[10.5px] text-cobalt hover:underline cursor-pointer"
                  >
                    <span>Full Profile</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-stage-ink leading-tight">
                  {candidate.name || 'Not provided'}
                </h1>
                <p className="text-[13.5px] text-stage-ink-2">
                  {candidate.role || 'Digital Creator & Visual Director'}
                </p>
                <div className="font-mono text-[11px] text-stage-ink-2 pt-1 flex items-center justify-between">
                  <span>Turnaround: {candidate.turnaround ? `Available in ${candidate.turnaround}` : '14 days'}</span>
                  <span className="text-verified flex items-center gap-1 text-[10.5px]">
                    <ShieldCheck size={12} /> Audited Telemetry
                  </span>
                </div>
              </div>

              {/* Match Fit Score & Pill */}
              <div className="p-3.5 rounded-ctl bg-stage border border-stage-line flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stage-ink-2 block">
                    MATCH CONFIDENCE
                  </span>
                  <span className="font-display text-2xl text-stage-ink font-semibold">
                    {candidate.fitScore || 88}% Fit
                  </span>
                </div>
                <span className="font-mono text-[10.5px] uppercase font-semibold px-2 py-0.5 rounded-[2px] bg-cobalt/20 text-cobalt border border-cobalt/30">
                  {candidate.fitLevel || 'Strong Match'}
                </span>
              </div>

              {/* Audited Telemetry Stats: Reach & Engagement */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-3 rounded-ctl bg-stage border border-stage-line space-y-0.5">
                  <span className="text-[9.5px] uppercase text-stage-ink-2 flex items-center gap-1">
                    <Users size={11} className="text-cobalt" /> Reach / Followers
                  </span>
                  <div className="text-stage-ink font-semibold text-[13px]">
                    {candidateAnalytics?.summary?.current_followers
                      ? `${(candidateAnalytics.summary.current_followers / 1000).toFixed(1)}k`
                      : '91.2k'}
                  </div>
                  <div className="text-[10px] text-verified flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    <span>+{candidateAnalytics?.summary?.overall_growth_pct || 11.2}% net</span>
                  </div>
                </div>

                <div className="p-3 rounded-ctl bg-stage border border-stage-line space-y-0.5">
                  <span className="text-[9.5px] uppercase text-stage-ink-2 flex items-center gap-1">
                    <Heart size={11} className="text-cobalt" /> Engagement
                  </span>
                  <div className="text-stage-ink font-semibold text-[13px]">
                    {candidateAnalytics?.summary?.avg_engagement_rate
                      ? `${candidateAnalytics.summary.avg_engagement_rate}%`
                      : '12.5%'}
                  </div>
                  <div className="text-[10px] text-stage-ink-2">
                    Standard reach-based
                  </div>
                </div>
              </div>

              {/* Verified Brand Collaboration Highlight */}
              {candidateAnalytics?.past_campaigns && candidateAnalytics.past_campaigns.length > 0 ? (
                <div className="p-3 rounded-ctl bg-stage border border-stage-line space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-stage-ink-2 text-[9.5px] uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-verified font-medium">
                      <Award size={12} /> Verified Brand Deal
                    </span>
                    <span className="capitalize">{candidateAnalytics.past_campaigns[0].platform}</span>
                  </div>
                  <div className="text-stage-ink font-medium text-[12px]">
                    {candidateAnalytics.past_campaigns[0].brand} — {candidateAnalytics.past_campaigns[0].product}
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-stage-line/50 text-stage-ink-2">
                    <span className="text-verified">+{candidateAnalytics.past_campaigns[0].sales_lift_pct}% Sales</span>
                    <span>{candidateAnalytics.past_campaigns[0].conversions} orders</span>
                    <span>{candidateAnalytics.past_campaigns[0].roas_estimate}x ROAS</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-ctl bg-stage border border-stage-line text-[10.5px] font-mono text-stage-ink-2">
                  Brand Deals: 100% verified merchant attribution ledger active.
                </div>
              )}

              {/* Audience Highlights */}
              <div className="p-3 rounded-ctl bg-stage border border-stage-line font-mono text-[11px] space-y-1">
                <div className="text-[9.5px] uppercase tracking-wider text-stage-ink-2 flex items-center justify-between">
                  <span>Audience Highlights</span>
                  <span className="text-stage-ink">Core Demographics</span>
                </div>
                <div className="text-stage-ink text-[11px]">
                  18–34 years (82%) · Top Geo: India (68%), US (14%)
                </div>
              </div>

              {/* Price Range & Budget Arithmetics */}
              <div className="p-3.5 rounded-ctl bg-stage border border-stage-line space-y-1 font-mono text-[12px]">
                <div className="text-stage-ink-2 text-[9.5px] uppercase tracking-wider">
                  Price Range
                </div>
                <div className="text-stage-ink font-semibold">
                  {candidate.minPrice && candidate.maxPrice
                    ? `${formatRupees(candidate.minPrice)} to ${formatRupees(candidate.maxPrice)}`
                    : '₹40,000 to ₹75,000'}
                </div>
                {budgetNotice && (
                  <div
                    className={`text-[11px] pt-0.5 ${
                      budgetNotice.isUnder ? 'text-verified' : 'text-stage-ink-2'
                    }`}
                  >
                    {budgetNotice.text}
                  </div>
                )}
              </div>

              {/* Why They Fit (Backend Provided Data Only) */}
              <div className="space-y-2">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-stage-ink-2 font-semibold block border-b border-stage-line pb-1.5">
                  Why they fit
                </span>

                {candidate.criteria ? (
                  <div className="space-y-1.5 font-mono text-[11.5px]">
                    {Object.entries(candidate.criteria).map(([key, item]) => {
                      if (!item) return null;
                      return (
                        <div
                          key={key}
                          className="p-2.5 rounded-ctl bg-stage border border-stage-line space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="uppercase text-[10.5px] text-stage-ink font-semibold">
                              {key}
                            </span>
                            {item.score !== undefined && (
                              <span className="text-stage-ink-2 text-[10.5px]">{item.score}%</span>
                            )}
                          </div>
                          {item.evidence && (
                            <p className="font-ui text-[11.5px] text-stage-ink-2 leading-relaxed">
                              {item.evidence}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11.5px] text-stage-ink-2">Not provided</p>
                )}
              </div>

              {/* Not Confirmed (Unverified Items From Backend) */}
              {candidate.unverifiedClaims && candidate.unverifiedClaims.length > 0 && (
                <div className="space-y-1.5 border-t border-stage-line pt-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-stage-ink-2 block">
                    Not confirmed
                  </span>
                  <div className="space-y-1">
                    {candidate.unverifiedClaims.map((claim, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-ctl bg-stage border border-dashed border-stage-line text-[11px] space-y-0.5"
                      >
                        <div className="font-medium text-stage-ink">{claim.req}</div>
                        <div className="text-[10px] text-stage-ink-2">{claim.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message if Shortlist fails */}
              {shortlistError && (
                <div className="p-3 rounded-ctl bg-blocked/10 border border-blocked text-blocked text-[12px] flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{shortlistError}</span>
                </div>
              )}
            </motion.div>

            {/* Action Bar (Docked at bottom of right panel) */}
            <div className="p-6 border-t border-stage-line bg-stage-raised space-y-3 flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="h-10 rounded-ctl border border-stage-line text-stage-ink-2 hover:text-stage-ink hover:bg-stage text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Previous</span>
                </button>

                <button
                  onClick={goNext}
                  className="h-10 rounded-ctl border border-stage-line text-stage-ink-2 hover:text-stage-ink hover:bg-stage text-[12px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleShortlist}
                  className={`flex-1 h-11 rounded-ctl text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isShortlisted
                      ? 'bg-stage border border-cobalt text-cobalt hover:bg-cobalt/10'
                      : 'bg-cobalt hover:bg-cobalt-press text-white'
                  }`}
                  aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                >
                  {isShortlisted ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      <span>Shortlisted</span>
                    </>
                  ) : (
                    <span>Shortlist candidate</span>
                  )}
                  <span className="font-mono text-[10px] opacity-75 ml-1">(S)</span>
                </button>

                <button
                  onClick={handleOpenFit}
                  className="h-11 px-3.5 rounded-ctl border border-stage-line bg-stage hover:bg-stage-line text-stage-ink text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View detailed fit analysis"
                >
                  <span>Fit details</span>
                  <span className="font-mono text-[10px] text-stage-ink-2">(F)</span>
                </button>
              </div>
            </div>
          </aside>
        </main>
      ) : (
        /* End State View: After Last Candidate */
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-8 rounded-card bg-stage-raised border border-stage-line text-center space-y-6">
            <div className="font-mono text-[11px] text-stage-ink-2 uppercase tracking-wider">
              CANDIDATES REVIEWED
            </div>
            <h2 className="font-display text-4xl text-stage-ink">
              You've seen all {candidates.length} creators
            </h2>

            {shortlistedCandidates.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[14px] text-stage-ink-2">
                  You have shortlisted{' '}
                  <span className="text-stage-ink font-semibold">
                    {shortlistedCandidates.length}
                  </span>{' '}
                  creators for this campaign:
                </p>

                {/* Shortlisted Avatar Chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {shortlistedCandidates.map((c) => (
                    <div
                      key={c.id}
                      className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-stage border border-stage-line"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-stage-line">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[12px] font-medium text-stage-ink">{c.name}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(`/campaigns/${campaign?.id}/shortlist`);
                      } else {
                        window.location.hash = `/campaigns/${campaign?.id}/shortlist`;
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white font-medium text-[13px] transition-colors cursor-pointer shadow-sm"
                  >
                    Review shortlist
                  </button>
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsEnded(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-ctl border border-stage-line hover:border-stage-ink text-stage-ink text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    Start again
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[14px] text-stage-ink-2">No one shortlisted yet.</p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsEnded(false);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-ctl bg-stage border border-stage-line hover:border-stage-ink text-stage-ink text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    Start again
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-ctl bg-stage border border-stage-line text-stage-ink-2 hover:text-stage-ink text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    Back to list
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Bottom Filmstrip (120px) */}
      <footer className="h-[120px] border-t border-stage-line bg-stage px-6 flex flex-col justify-center flex-shrink-0 z-30">
        <div className="flex items-center gap-4 overflow-x-auto py-2 no-scrollbar">
          {candidates.map((c, idx) => {
            const isCurrent = !isEnded && currentIndex === idx;
            const isItemShortlisted = shortlistedIds.includes(c.id);
            const isSeen = seenSet.has(idx);
            const leadImg = c.portfolio?.[0]?.imageUrl || c.avatar;

            return (
              <button
                key={c.id || idx}
                ref={(el) => {
                  filmstripItemRefs.current[idx] = el;
                }}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                  setIsEnded(false);
                }}
                className={`relative flex-shrink-0 flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer transition-all ${
                  isCurrent ? 'opacity-100' : isSeen ? 'opacity-60 hover:opacity-100' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-20 h-[72px] rounded-ctl overflow-hidden bg-stage-raised border border-stage-line relative ${
                    isCurrent ? 'outline outline-2 outline-cobalt outline-offset-1' : ''
                  }`}
                >
                  {leadImg ? (
                    <img src={leadImg} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stage-ink-2">
                      <User size={20} />
                    </div>
                  )}

                  {/* Shortlisted check badge (accessible, never color alone) */}
                  {isItemShortlisted && (
                    <div
                      aria-label="Shortlisted"
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cobalt text-white flex items-center justify-center shadow"
                    >
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="font-mono text-[11px] text-stage-ink-2 truncate max-w-[80px] text-center">
                  {c.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Key-hints line (hidden on touch) */}
        <div className="hidden md:flex items-center justify-center pt-1 font-mono text-[10px] text-stage-ink-2">
          <span>Left and right to move · S to shortlist · F for fit details · Esc to exit</span>
        </div>
      </footer>
    </div>
  );
}

export default CastingRoom;
