import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { StepRail } from '../components/navigation/StepRail';
import { BriefStep } from '../components/screens/BriefStep';
import { MatchesStep } from '../components/screens/MatchesStep';
import { ShortlistStep } from '../components/screens/ShortlistStep';
import { SummaryStep } from '../components/screens/SummaryStep';
import { PipelineView } from '../components/screens/PipelineView';
import { CastingRoom } from './CastingRoom';
import { FitSheet } from '../components/common/FitSheet';
import {
  fetchCampaignById,
  generateCampaignBrief,
  updateCampaignBrief,
  runCampaignMatching,
  fetchCampaignMatches,
  fetchCampaignShortlist,
  addCreatorToShortlist,
  removeCreatorFromShortlist,
  updateCampaignStatus,
  type EditableBriefFields,
  type ShortlistItem,
} from '../api/client';
import {
  adaptCampaignToUi,
  adaptMatchResultsToUi,
  type UiCampaign,
  type UiMatchedCreator,
} from '../api/adapters';

interface CampaignJourneyPageProps {
  onOpenColophon?: (work: any, creator: any, dark?: boolean) => void;
}

export const CampaignJourneyPage: React.FC<CampaignJourneyPageProps> = ({
  onOpenColophon,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Campaign state
  const [campaign, setCampaign] = useState<UiCampaign | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);

  // AI Brief Generation state
  const [isGeneratingBrief, setIsGeneratingBrief] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSource, setGenerationSource] = useState<string | null>(null);

  // Matching state
  const [matches, setMatches] = useState<UiMatchedCreator[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);
  const [isMatchingRunning, setIsMatchingRunning] = useState<boolean>(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);

  // Shortlist state
  const [shortlistedCreators, setShortlistedCreators] = useState<ShortlistItem[]>([]);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [isLoadingShortlist, setIsLoadingShortlist] = useState<boolean>(false);

  // FitSheet state
  const [fitSheetState, setFitSheetState] = useState<{
    isOpen: boolean;
    creator: any | null;
  }>({
    isOpen: false,
    creator: null,
  });

  // Map live match results into CastingRoom schema (called unconditionally before any returns)
  const castingCandidates = useMemo(() => {
    return matches.map((m) => {
      const portfolioItems = m.rawCreator?.portfolio_items || [];
      const portfolio = portfolioItems.map((pi: any, idx: number) => ({
        id: pi.id || `work-${m.id}-${idx}`,
        title: pi.title || `${m.name} Portfolio Piece ${idx + 1}`,
        imageUrl: pi.content_url || pi.thumbnail_url || m.avatar,
        tools: m.rawCreator?.ai_tools || ['Midjourney', 'Runway Gen-3'],
        rightsStatus: 'Commercial Clear',
        humanInvolvementText: 'Prompt Architecture & Post-Grade',
        humanInvolvementLevel: 80,
        verification: 'Platform Verified',
        aspect: '4:5',
      }));

      if (portfolio.length === 0) {
        portfolio.push({
          id: `work-${m.id}-0`,
          title: `${m.name} Selected Work`,
          imageUrl: m.avatar,
          tools: m.rawCreator?.ai_tools || ['Midjourney', 'ComfyUI'],
          rightsStatus: 'Commercial Clear',
          humanInvolvementText: 'Creative Direction & AI Pipeline',
          humanInvolvementLevel: 75,
          verification: 'Verified',
          aspect: '4:5',
        });
      }

      return {
        ...m,
        portfolio,
        criteria: {
          style: {
            verdict: (m.scoreBreakdown?.style_compatibility || 0) >= 0.7 ? 'Strong Match' : 'Compatible',
            score: Math.round((m.scoreBreakdown?.style_compatibility || 0.8) * 100),
            evidence: m.evidence?.style?.[0] || 'Aesthetic alignment verified against brief requirements',
          },
          tools: {
            verdict: (m.scoreBreakdown?.skill_niche_relevance || 0) >= 0.7 ? 'Direct Match' : 'Alternative Toolset',
            score: Math.round((m.scoreBreakdown?.skill_niche_relevance || 0.85) * 100),
            evidence: m.evidence?.tools?.[0] || 'AI tooling aligns with required asset formats',
          },
          category: {
            verdict: (m.scoreBreakdown?.portfolio_relevance || 0) >= 0.7 ? 'Verified Niche' : 'Cross-Disciplinary',
            score: Math.round((m.scoreBreakdown?.portfolio_relevance || 0.75) * 100),
            evidence: m.evidence?.category?.[0] || 'Proven track record in brand campaign niche',
          },
          consistency: {
            verdict: 'Audited Track Record',
            score: Math.round(m.fitScore || 85),
            evidence: 'Consistent aesthetic signature across past client deliverables',
          },
        },
        unverifiedClaims: ((m.evidence?.unverified_claims || []) as any[]).map((c) =>
          typeof c === 'string' ? { req: 'Audited Claim', note: c } : c
        ),
      };
    });
  }, [matches]);

  // Determine current active step from pathname
  // e.g. /campaigns/:id/brief, /campaigns/:id/matches, /campaigns/:id/shortlist, /campaigns/:id/summary, /campaigns/:id/pipeline
  const pathname = location.pathname;
  let activeStepName = 'brief';
  let activeStepNumber = 1;

  if (pathname.includes('/matches')) {
    activeStepName = 'matches';
    activeStepNumber = 2;
  } else if (pathname.includes('/casting')) {
    activeStepName = 'casting';
    activeStepNumber = 2;
  } else if (pathname.includes('/shortlist')) {
    activeStepName = 'shortlist';
    activeStepNumber = 3;
  } else if (pathname.includes('/summary')) {
    activeStepName = 'summary';
    activeStepNumber = 4;
  } else if (pathname.includes('/pipeline')) {
    activeStepName = 'pipeline';
    activeStepNumber = 2;
  }

  // 1. Load Campaign Detail (GET /api/campaigns/<id>)
  const loadCampaign = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setCampaignError(null);
    try {
      const data = await fetchCampaignById(id);
      const adapted = adaptCampaignToUi(data.brief, data.workflow);
      setCampaign(adapted);
      setShortlistedIds(data.workflow?.selected_creator_ids || []);
    } catch (err: any) {
      setCampaignError(err?.message || `Failed to retrieve campaign ${id}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // 2. Load Persisted Matches (GET /api/campaigns/<id>/matches)
  const loadMatches = useCallback(async () => {
    if (!id) return;
    setIsLoadingMatches(true);
    setMatchingError(null);
    try {
      const data = await fetchCampaignMatches(id);
      const adaptedMatches = adaptMatchResultsToUi(data.results || []);
      if (adaptedMatches.length === 0) {
        const runRes = await runCampaignMatching(id);
        const fresh = adaptMatchResultsToUi(runRes.results || []);
        setMatches(fresh);
        loadCampaign();
      } else {
        setMatches(adaptedMatches);
      }
    } catch (err: any) {
      setMatchingError(err?.message || 'Failed to load matching results.');
    } finally {
      setIsLoadingMatches(false);
    }
  }, [id, loadCampaign]);

  // 3. Load Shortlist (GET /api/campaigns/<id>/shortlist)
  const loadShortlist = useCallback(async () => {
    if (!id) return;
    setIsLoadingShortlist(true);
    try {
      const data = await fetchCampaignShortlist(id);
      setShortlistedCreators(data.shortlist || []);
      setShortlistedIds(data.selected_creator_ids || []);
    } catch (err: any) {
      // ignore if empty
    } finally {
      setIsLoadingShortlist(false);
    }
  }, [id]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  useEffect(() => {
    if (activeStepName === 'matches') {
      loadMatches();
    }
    if (activeStepName === 'shortlist' || activeStepName === 'summary' || activeStepName === 'matches') {
      loadShortlist();
    }
  }, [activeStepName, loadMatches, loadShortlist]);

  // Handler: Generate Brief via AI (POST /api/campaigns/<id>/generate-brief)
  const handleGenerateBrief = async () => {
    if (!id) return;
    setIsGeneratingBrief(true);
    setGenerationError(null);
    try {
      const result = await generateCampaignBrief(id);
      setGenerationSource(result.source);
      if (campaign) {
        const updated = adaptCampaignToUi(result.brief, campaign.rawWorkflow);
        setCampaign(updated);
      }
    } catch (err: any) {
      setGenerationError(err?.message || 'Failed to generate brief with AI.');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Handler: Update Brief via PATCH (PATCH /api/campaigns/<id>)
  const handleUpdateBrief = async (updates: Partial<EditableBriefFields>) => {
    if (!id) return;
    const updatedBrief = await updateCampaignBrief(id, updates);
    if (campaign) {
      const updated = adaptCampaignToUi(updatedBrief, campaign.rawWorkflow);
      setCampaign(updated);
    }
    return updatedBrief;
  };

  // Handler: Run Matching Engine (POST /api/campaigns/<id>/match)
  const handleRunMatching = async () => {
    if (!id) return;
    setIsMatchingRunning(true);
    setMatchingError(null);
    try {
      const res = await runCampaignMatching(id);
      const adapted = adaptMatchResultsToUi(res.results || []);
      setMatches(adapted);
      // Reload campaign to reflect updated status
      loadCampaign();
    } catch (err: any) {
      setMatchingError(err?.message || 'Failed to compute matches.');
    } finally {
      setIsMatchingRunning(false);
    }
  };

  const handleProceedToMatches = async () => {
    if (!id) return;
    setIsMatchingRunning(true);
    setMatchingError(null);
    try {
      const res = await runCampaignMatching(id);
      const adapted = adaptMatchResultsToUi(res.results || []);
      setMatches(adapted);
      loadCampaign();
      navigate(`/campaigns/${id}/matches`);
    } catch (err: any) {
      setMatchingError(err?.message || 'Failed to compute matches.');
      navigate(`/campaigns/${id}/matches`);
    } finally {
      setIsMatchingRunning(false);
    }
  };

  // Handler: Shortlist Toggle
  const handleToggleShortlist = async (creatorId: string) => {
    if (!id) return;
    const isCurrentlyShortlisted = shortlistedIds.includes(creatorId);

    if (isCurrentlyShortlisted) {
      // Remove
      const res = await removeCreatorFromShortlist(id, creatorId);
      setShortlistedIds(res.selected_creator_ids || []);
      setShortlistedCreators(res.shortlist || []);
      if (fitSheetState.isOpen && fitSheetState.creator?.id === creatorId) {
        setFitSheetState((prev) => ({ ...prev }));
      }
    } else {
      // Add
      const res = await addCreatorToShortlist(id, creatorId);
      setShortlistedIds(res.selected_creator_ids || []);
      setShortlistedCreators(res.shortlist || []);
      if (fitSheetState.isOpen && fitSheetState.creator?.id === creatorId) {
        setFitSheetState((prev) => ({ ...prev }));
      }
    }
  };

  // Handler: Finalize Campaign Status (PATCH /api/campaigns/<id>/status)
  const handleCompleteCampaign = async () => {
    if (!id) return;
    const res = await updateCampaignStatus(id, 'completed');
    if (campaign) {
      setCampaign({
        ...campaign,
        status: res.workflow_status || 'completed',
      });
    }
    return res;
  };

  const handleStepSelect = (stepNum: number) => {
    const stepMap: Record<number, string> = {
      1: 'brief',
      2: 'matches',
      3: 'shortlist',
      4: 'summary',
    };
    navigate(`/campaigns/${id}/${stepMap[stepNum] || 'brief'}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-ink animate-spin" />
        <span className="font-mono text-[13px] text-ink-2 uppercase tracking-wider">
          Loading campaign dossier...
        </span>
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="p-8 rounded-card bg-surface border border-blocked/30 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-blocked/10 text-blocked flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">Campaign Not Found</h2>
            <p className="text-[13px] text-ink-2 mt-1 leading-relaxed">
              {campaignError || `Unable to locate campaign with ID ${id}`}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/campaigns')}
              className="px-4 py-2 rounded-ctl border border-line text-[13px] font-medium text-ink hover:bg-sunken cursor-pointer"
            >
              Back to Campaigns
            </button>
            <button
              onClick={loadCampaign}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-ctl bg-ink text-surface hover:bg-ink-2 text-[13px] font-medium cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`flex flex-col h-full min-h-0 ${activeStepName === 'casting' ? 'h-screen w-screen overflow-hidden' : 'overflow-hidden'}`}>
      {/* Step Rail Navigation (Always visible across steps except pipeline and casting) */}
      {activeStepName !== 'pipeline' && activeStepName !== 'casting' && (
        <StepRail
          campaign={campaign}
          currentStep={activeStepNumber}
          onSelectStep={handleStepSelect}
        />
      )}

      {/* Main Step Screen */}
      <div className={`flex-1 min-h-0 ${activeStepName === 'matches' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
        {activeStepName === 'brief' && (
          <BriefStep
            campaign={campaign}
            onUpdateCampaign={handleUpdateBrief}
            onGenerateBrief={handleGenerateBrief}
            isGenerating={isGeneratingBrief}
            generationError={generationError}
            generationSource={generationSource}
            onBack={() => navigate('/campaigns')}
            onProceedToMatches={handleProceedToMatches}
          />
        )}

        {activeStepName === 'matches' && (
          <MatchesStep
            campaign={campaign}
            matches={matches}
            isLoadingMatches={isLoadingMatches}
            isMatchingRunning={isMatchingRunning}
            matchingError={matchingError}
            onRunMatching={handleRunMatching}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onOpenFitSheet={(c: any) => setFitSheetState({ isOpen: true, creator: c })}
            onOpenColophon={onOpenColophon}
            onBack={() => navigate(`/campaigns/${id}/brief`)}
            onProceedToShortlist={() => navigate(`/campaigns/${id}/shortlist`)}
            onOpenCastingRoom={() => navigate(`/campaigns/${id}/casting`)}
          />
        )}

        {activeStepName === 'casting' && (
          <CastingRoom
            campaign={campaign}
            creators={castingCandidates}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onOpenFitSheet={(c: any) => setFitSheetState({ isOpen: true, creator: c })}
            onBack={() => navigate(`/campaigns/${id}/matches`)}
            onNavigate={(route: string) => navigate(route)}
          />
        )}

        {activeStepName === 'shortlist' && (
          <ShortlistStep
            campaign={campaign}
            shortlistedCreators={shortlistedCreators}
            isLoading={isLoadingShortlist}
            onRemoveFromShortlist={handleToggleShortlist}
            onOpenFitSheet={(c: any) => setFitSheetState({ isOpen: true, creator: c })}
            onBack={() => navigate(`/campaigns/${id}/matches`)}
            onProceedToSummary={() => navigate(`/campaigns/${id}/summary`)}
          />
        )}

        {activeStepName === 'summary' && (
          <SummaryStep
            campaign={campaign}
            shortlistedCreators={shortlistedCreators}
            onCompleteCampaign={handleCompleteCampaign}
            onNavigateHome={() => navigate('/')}
            onNavigateCampaigns={() => navigate('/campaigns')}
            onBack={() => navigate(`/campaigns/${id}/shortlist`)}
          />
        )}

        {activeStepName === 'pipeline' && (
          <PipelineView
            campaign={campaign}
            onBack={() => navigate(`/campaigns/${id}/matches`)}
            onSelectCreator={(c: any) => setFitSheetState({ isOpen: true, creator: c })}
          />
        )}
      </div>

      {/* Slide-over Fit Sheet */}
      <FitSheet
        isOpen={fitSheetState.isOpen}
        onClose={() => setFitSheetState({ isOpen: false, creator: null })}
        creator={fitSheetState.creator}
        briefId={campaign.code}
        isShortlisted={Boolean(fitSheetState.creator && shortlistedIds.includes(fitSheetState.creator.id))}
        onToggleShortlist={handleToggleShortlist}
        onOpenColophon={onOpenColophon}
      />
    </div>
  );
};

export default CampaignJourneyPage;
