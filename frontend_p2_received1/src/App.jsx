import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { TopBar } from './components/navigation/TopBar';
import { StepRail } from './components/navigation/StepRail';
import { DemoFooter } from './components/navigation/DemoFooter';
import { LandingScreen } from './components/screens/LandingScreen';
import { CampaignsScreen } from './components/screens/CampaignsScreen';
import { BriefStep } from './components/screens/BriefStep';
import { MatchesStep } from './components/screens/MatchesStep';
import { ShortlistStep } from './components/screens/ShortlistStep';
import { SummaryStep } from './components/screens/SummaryStep';
import { PipelineView } from './components/screens/PipelineView';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import { CreatorProfileScreen } from './components/screens/CreatorProfileScreen';
import { CastingRoom } from './pages/CastingRoom';
import { ColophonSheet } from './components/common/ColophonSheet';
import { FitSheet } from './components/common/FitSheet';
import { StudioBot } from './components/common/StudioBot';
import { INITIAL_CAMPAIGNS } from './data/briefs';
import { CREATORS_DATA } from './data/creators';

export function App() {
  // Global Data State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('colophon_campaigns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isStale = parsed.some(
          (c) =>
            c.title === 'Untitled Campaign Draft' ||
            c.clippers !== undefined ||
            c.title?.includes('Cenat') ||
            c.title?.includes('xQc') ||
            c.title?.includes('Caseoh')
        );
        if (!isStale && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CAMPAIGNS;
  });

  const [creators, setCreators] = useState(CREATORS_DATA);

  // Active Campaign & Route State (Hash-based for persistent reload on any step)
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  // Slide-over states
  const [colophonState, setColophonState] = useState({
    isOpen: false,
    work: null,
    creator: null,
    dark: false,
  });

  const [fitSheetState, setFitSheetState] = useState({
    isOpen: false,
    creator: null,
  });

  // Sync URL hash
  const navigate = (route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save campaigns to localStorage
  useEffect(() => {
    localStorage.setItem('colophon_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Ensure fresh creators and sanitize any stale cached data
  useEffect(() => {
    const raw = localStorage.getItem('colophon_campaigns');
    if (raw && (raw.includes('Untitled Campaign Draft') || raw.includes('clippers') || raw.includes('Cenat') || raw.includes('xQc') || raw.includes('Caseoh'))) {
      localStorage.setItem('colophon_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
      setCampaigns(INITIAL_CAMPAIGNS);
    }
    setCreators(CREATORS_DATA);
  }, []);

  // Demo safety: Reset on Shift+R
  const handleResetData = () => {
    setCampaigns(INITIAL_CAMPAIGNS);
    setCreators(CREATORS_DATA);
    localStorage.removeItem('colophon_campaigns');
    navigate('/');
    showToast('Workspace reset to initial benchmark state', 'info');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        handleResetData();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Parse active route
  // e.g. /campaigns/camp-01/brief, /campaigns/camp-01/matches, /campaigns/camp-01/casting?c=2
  const cleanRoute = currentRoute.split('?')[0];
  const routeParts = cleanRoute.split('/').filter(Boolean);
  const isCampaignJourney = routeParts[0] === 'campaigns' && routeParts[1] && routeParts[1] !== 'new';
  const activeCampaignId = isCampaignJourney ? routeParts[1] : null;
  const activeCampaignStepName = isCampaignJourney ? routeParts[2] || 'brief' : null;
  const isCastingRoom = isCampaignJourney && activeCampaignStepName === 'casting';

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  let activeStepNumber = 1;
  if (activeCampaignStepName === 'matches' || activeCampaignStepName === 'casting') activeStepNumber = 2;
  else if (activeCampaignStepName === 'shortlist') activeStepNumber = 3;
  else if (activeCampaignStepName === 'summary') activeStepNumber = 4;

  // New campaign creator
  const handleCreateNewCampaign = (initialText = '') => {
    const newId = `camp-${Date.now()}`;
    const derivedTitle = initialText
      ? initialText.split('.')[0].slice(0, 36) + '...'
      : 'New Creative Commission';
    const newCamp = {
      id: newId,
      code: `CAMPAIGN 0${campaigns.length + 1}`,
      title: derivedTitle,
      brandName: 'Brand Commission',
      budget: 20000,
      currency: 'INR',
      deadline: '2026-11-20',
      status: 'brief_ready',
      step: 1,
      deliverablesText: 'Custom Asset Package',
      turnaround: '14 Days',
      description: initialText || 'Provide creative direction, platform formats, and style references...',
      fullText: initialText || 'Provide creative direction, platform formats, and style references...',
      provider: 'gemini',
      phrases: [],
      marginNotes: [],
      shortlistedCreatorIds: [],
    };
    setCampaigns([newCamp, ...campaigns]);
    showToast('Created new campaign draft', 'success');
    navigate(`/campaigns/${newId}/brief`);
  };

  const handleUpdateCampaign = (updated, notify = false) => {
    setCampaigns(campaigns.map((c) => (c.id === updated.id ? updated : c)));
    if (notify) {
      showToast('Campaign brief saved and updated', 'success');
    }
  };

  const handleToggleShortlist = (creatorId) => {
    if (!activeCampaign) return;
    const currentList = activeCampaign.shortlistedCreatorIds || [];
    const isPresent = currentList.includes(creatorId);
    const updatedList = isPresent
      ? currentList.filter((id) => id !== creatorId)
      : [...currentList, creatorId];

    const targetCreator = creators.find((c) => c.id === creatorId);
    const creatorName = targetCreator ? targetCreator.name : 'Creator';

    handleUpdateCampaign({
      ...activeCampaign,
      shortlistedCreatorIds: updatedList,
      status: updatedList.length > 0 ? 'shortlisted' : 'matches_ready',
    });

    showToast(
      isPresent ? `Removed ${creatorName} from shortlist` : `Added ${creatorName} to shortlist`,
      isPresent ? 'info' : 'success'
    );
  };

  const shortlistedCreators = creators.filter((c) =>
    (activeCampaign?.shortlistedCreatorIds || []).includes(c.id)
  );

  return (
    <div className={`min-h-screen bg-paper text-ink flex flex-col font-ui selection:bg-marker selection:text-ink ${isCastingRoom ? 'overflow-hidden h-screen' : ''}`}>
      {/* 64px Top Bar */}
      {!isCastingRoom && (
        <TopBar
          currentRoute={currentRoute}
          onNavigate={navigate}
          onNewCampaign={() => handleCreateNewCampaign()}
        />
      )}

      {/* Slim Step Rail: Visible on all 4 steps of a campaign */}
      {isCampaignJourney && !isCastingRoom && (
        <StepRail
          campaign={activeCampaign}
          currentStep={activeStepNumber}
          onSelectStep={(stepNum) => {
            const stepMap = { 1: 'brief', 2: 'matches', 3: 'shortlist', 4: 'summary' };
            navigate(`/campaigns/${activeCampaign.id}/${stepMap[stepNum]}`);
          }}
        />
      )}

      {/* Main Content Area */}
      <main className={isCastingRoom ? 'h-screen w-screen overflow-hidden' : 'flex-1'}>
        {/* Landing / Dashboard (/) */}
        {currentRoute === '/' && (
          <LandingScreen
            campaigns={campaigns}
            onSelectCampaign={(campId, stepNum) => {
              const stepMap = { 1: 'brief', 2: 'matches', 3: 'shortlist', 4: 'summary' };
              navigate(`/campaigns/${campId}/${stepMap[stepNum || 1]}`);
            }}
            onStartCampaign={() => handleCreateNewCampaign()}
            onBrowseCreators={() => navigate('/discover')}
            onViewAllCampaigns={() => navigate('/campaigns')}
            onOpenColophon={(w) =>
              setColophonState({ isOpen: true, work: w, creator: creators[0], dark: false })
            }
            onResetData={handleResetData}
          />
        )}

        {/* Campaigns List (/campaigns) */}
        {currentRoute === '/campaigns' && (
          <CampaignsScreen
            campaigns={campaigns}
            onSelectCampaign={(campId, stepNum) => {
              const stepMap = { 1: 'brief', 2: 'matches', 3: 'shortlist', 4: 'summary' };
              navigate(`/campaigns/${campId}/${stepMap[stepNum || 1]}`);
            }}
            onNewCampaignWithText={(text) => handleCreateNewCampaign(text)}
            onOpenPipeline={(campId) => navigate(`/campaigns/${campId}/pipeline`)}
          />
        )}

        {/* Step 1: Brief (/campaigns/:id/brief) */}
        {isCampaignJourney && activeCampaignStepName === 'brief' && (
          <BriefStep
            campaign={activeCampaign}
            onUpdateCampaign={handleUpdateCampaign}
            onBack={() => navigate('/campaigns')}
            onProceedToMatches={() => navigate(`/campaigns/${activeCampaign.id}/matches`)}
          />
        )}

        {/* Step 2: Matches (/campaigns/:id/matches) */}
        {isCampaignJourney && activeCampaignStepName === 'matches' && (
          <MatchesStep
            campaign={activeCampaign}
            creators={creators}
            shortlistedIds={activeCampaign.shortlistedCreatorIds || []}
            onToggleShortlist={handleToggleShortlist}
            onOpenFitSheet={(c) => setFitSheetState({ isOpen: true, creator: c })}
            onOpenColophon={(w, c) =>
              setColophonState({ isOpen: true, work: w, creator: c, dark: false })
            }
            onSelectCreator={(c) => navigate(`/creators/${c.id}`)}
            onBack={() => navigate(`/campaigns/${activeCampaign.id}/brief`)}
            onProceedToShortlist={() => navigate(`/campaigns/${activeCampaign.id}/shortlist`)}
            onResetData={handleResetData}
          />
        )}

        {/* Dedicated Pipeline View (/campaigns/:id/pipeline) */}
        {isCampaignJourney && activeCampaignStepName === 'pipeline' && (
          <PipelineView
            campaign={activeCampaign}
            onBack={() => navigate(`/campaigns/${activeCampaign.id}/matches`)}
            onSelectCreator={(c) => setFitSheetState({ isOpen: true, creator: c })}
          />
        )}

        {/* Dedicated Casting Room (/campaigns/:id/casting) */}
        {isCastingRoom && (
          <CastingRoom
            campaign={activeCampaign}
            creators={creators}
            shortlistedIds={activeCampaign?.shortlistedCreatorIds || []}
            onToggleShortlist={handleToggleShortlist}
            onOpenFitSheet={(c) => setFitSheetState({ isOpen: true, creator: c })}
            onBack={() => navigate(`/campaigns/${activeCampaign.id}/matches`)}
            onNavigate={(route) => navigate(route)}
          />
        )}

        {/* Step 3: Shortlist (/campaigns/:id/shortlist) */}
        {isCampaignJourney && activeCampaignStepName === 'shortlist' && (
          <ShortlistStep
            campaign={activeCampaign}
            shortlistedCreators={shortlistedCreators}
            onRemoveFromShortlist={handleToggleShortlist}
            onOpenFitSheet={(c) => setFitSheetState({ isOpen: true, creator: c })}
            onOpenColophon={(w, c) =>
              setColophonState({ isOpen: true, work: w, creator: c, dark: false })
            }
            onBack={() => navigate(`/campaigns/${activeCampaign.id}/matches`)}
            onProceedToSummary={() => navigate(`/campaigns/${activeCampaign.id}/summary`)}
          />
        )}

        {/* Step 4: Summary (/campaigns/:id/summary) */}
        {isCampaignJourney && activeCampaignStepName === 'summary' && (
          <SummaryStep
            campaign={activeCampaign}
            shortlistedCreators={shortlistedCreators}
            onOpenColophon={(w, c) =>
              setColophonState({ isOpen: true, work: w, creator: c, dark: false })
            }
            onBack={() => navigate(`/campaigns/${activeCampaign.id}/shortlist`)}
            onNavigateHome={() => navigate('/')}
            onNavigateCampaigns={() => navigate('/campaigns')}
            onCompleteCampaign={(id) => {
              handleUpdateCampaign({ ...activeCampaign, status: 'completed' });
            }}
          />
        )}

        {/* Discover (/discover) */}
        {currentRoute === '/discover' && (
          <DiscoverScreen
            creators={creators}
            onOpenColophon={(w, c) =>
              setColophonState({ isOpen: true, work: w, creator: c, dark: false })
            }
            onOpenFitSheet={(c) => setFitSheetState({ isOpen: true, creator: c })}
            onSelectCreator={(c) => navigate(`/creators/${c.id}`)}
          />
        )}

        {/* Creator Profile (/creators/:id) */}
        {currentRoute.startsWith('/creators/') && (
          <CreatorProfileScreen
            creator={
              creators.find((c) => c.id === routeParts[1]) || creators[0]
            }
            campaign={activeCampaign}
            onBack={() => window.history.back()}
            onOpenColophon={(w, c) =>
              setColophonState({ isOpen: true, work: w, creator: c, dark: false })
            }
            onShortlist={(id) => handleToggleShortlist(id)}
            isShortlisted={(activeCampaign?.shortlistedCreatorIds || []).includes(routeParts[1])}
          />
        )}
      </main>

      {/* Slide-over: Colophon Sheet */}
      <ColophonSheet
        isOpen={colophonState.isOpen}
        onClose={() => setColophonState({ ...colophonState, isOpen: false })}
        work={colophonState.work}
        creator={colophonState.creator}
        onSelectCreator={(c) => {
          setColophonState({ ...colophonState, isOpen: false });
          const fullCreator = creators.find((cr) => cr.id === c?.id || cr.name === c?.name) || c;
          navigate(`/creators/${fullCreator.id}`);
        }}
        dark={colophonState.dark}
      />

      {/* Slide-over: Fit Sheet */}
      <FitSheet
        isOpen={fitSheetState.isOpen}
        onClose={() => setFitSheetState({ ...fitSheetState, isOpen: false })}
        creator={fitSheetState.creator}
        isShortlisted={(activeCampaign?.shortlistedCreatorIds || []).includes(
          fitSheetState.creator?.id
        )}
        onToggleShortlist={handleToggleShortlist}
        onOpenColophon={(w, c) =>
          setColophonState({ isOpen: true, work: w, creator: c, dark: false })
        }
      />

      {/* Studio Concierge AI Assistant Bot */}
      {!isCastingRoom && (
        <StudioBot
          campaign={activeCampaign}
          onOpenCreator={(c) => {
            navigate(`/creators/${c.id}`);
          }}
          onApplyBriefTemplate={(tmpl) => {
            if (activeCampaign) {
              const updated = {
                ...activeCampaign,
                brandName: tmpl.brand,
                title: tmpl.title,
                budget: tmpl.budget,
                deliverablesText: tmpl.deliverables,
                fullText: tmpl.text,
                description: tmpl.text,
              };
              handleUpdateCampaign(updated);
              showToast(`Applied "${tmpl.title}" brief template`, 'success');
              navigate(`/campaigns/${activeCampaign.id}/brief`);
            } else {
              handleCreateNewCampaign(tmpl.text);
            }
          }}
          onNavigate={(route) => navigate(route)}
        />
      )}

      {/* Demo Footer: only shown on non-landing scrollable pages (Campaigns, Discover) */}
      {currentRoute !== '/' && !isCampaignJourney && <DemoFooter onResetData={handleResetData} />}

      {/* Global Feedback Toasts Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-ctl bg-ink text-surface border border-ink/80 shadow-float text-[13px] font-ui"
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && (
                  <CheckCircle2 size={16} className="text-verified flex-shrink-0" />
                )}
                {toast.type === 'error' && (
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                )}
                {toast.type === 'info' && (
                  <Info size={16} className="text-surface flex-shrink-0" />
                )}
                <span className="leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-surface/50 hover:text-surface p-0.5 rounded transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
