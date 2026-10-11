import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calculator, 
  Layers, 
  CheckCircle2,
  X,
  Award
} from 'lucide-react';

import { DEMO_CREATORS, CAMPAIGN_PRESETS } from './data/demoData';
import { Header } from './components/Header';
import { CreatorSummaryCards } from './components/CreatorSummaryCards';
import { FitBreakdownSection } from './components/FitBreakdownSection';
import { GrowthEngagementSection } from './components/GrowthEngagementSection';
import { AudienceDemographicsSection } from './components/AudienceDemographicsSection';
import { BrandCollabsSection } from './components/BrandCollabsSection';
import { RateDeliverableSimulator } from './components/RateDeliverableSimulator';

export function App() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(CAMPAIGN_PRESETS[0].id);
  const [activeTab, setActiveTab] = useState<'fit' | 'growth' | 'audience' | 'collabs' | 'simulator' | 'all'>('fit');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['creator-aarav']);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCampaign = CAMPAIGN_PRESETS.find(c => c.id === selectedCampaignId) || CAMPAIGN_PRESETS[0];

  const handleToggleShortlist = (id: string) => {
    const creator = DEMO_CREATORS.find(c => c.id === id);
    if (!creator) return;

    if (shortlistedIds.includes(id)) {
      setShortlistedIds(shortlistedIds.filter(item => item !== id));
      showToast(`Removed ${creator.name} from campaign shortlist.`);
    } else {
      setShortlistedIds([...shortlistedIds, id]);
      showToast(`Added ${creator.name} to campaign shortlist!`);
    }
  };

  const handleToggleHighlight = (id: string) => {
    setActiveHighlightId(prev => (prev === id ? null : id));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const tabs = [
    { id: 'fit' as const, label: 'Fit & Match Intelligence', icon: ShieldCheck, count: '5 Factors' },
    { id: 'growth' as const, label: 'Growth & Engagement', icon: TrendingUp, count: '6-Month Curve' },
    { id: 'audience' as const, label: 'Audience & Demographics', icon: Users, count: 'Verified' },
    { id: 'collabs' as const, label: 'Brand Collaborations', icon: Briefcase, count: '3 Case Studies' },
    { id: 'simulator' as const, label: 'Deliverable Scope Simulator', icon: Calculator, count: 'Live Pricing' },
    { id: 'all' as const, label: 'All Intelligence Modules', icon: Layers, count: 'Full Report' },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-ui flex flex-col antialiased selection:bg-cobalt-tint selection:text-cobalt">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-line-strong text-ink px-4 py-3 rounded-ctl shadow-float flex items-center gap-3 animate-fade-in">
          <CheckCircle2 size={16} className="text-verified shrink-0" />
          <span className="text-[13px] font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-ink-3 hover:text-ink ml-2 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Header matching 64px TopBar */}
      <Header
        selectedCampaignId={selectedCampaignId}
        onSelectCampaign={setSelectedCampaignId}
        shortlistedCount={shortlistedIds.length}
      />

      {/* Main Content Area: 1280px Max Width matching DiscoverPage & MatchesStep */}
      <main className="flex-1 max-w-[1280px] mx-auto px-6 py-8 w-full space-y-8">
        {/* Campaign Scope Editorial Header */}
        <div className="rounded-card bg-surface border border-line p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                CAMPAIGN CONTEXT /
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-cobalt font-semibold">
                ACTIVE BRIEF
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              {activeCampaign.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink-2 pt-1 font-ui">
              <span>Target Budget: <strong className="text-ink font-mono font-semibold">{activeCampaign.budgetRange} USD</strong></span>
              <span className="text-line-strong">•</span>
              <span>Target Audience: <strong className="text-ink font-medium">{activeCampaign.targetAudience}</strong></span>
              <span className="text-line-strong">•</span>
              <span>Platforms: <strong className="text-ink font-medium">{activeCampaign.preferredPlatforms.join(', ')}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveHighlightId(DEMO_CREATORS[0].id)}
              className="px-3.5 py-2 rounded-ctl bg-surface hover:bg-sunken border border-line text-ink text-[12px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Award size={14} className="text-verified" />
              <span>Highlight #1 Fit</span>
            </button>
            {activeHighlightId && (
              <button
                onClick={() => setActiveHighlightId(null)}
                className="px-3 py-2 rounded-ctl bg-sunken text-ink-3 hover:text-ink text-[12px] font-mono transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Hero 3-Creator Comparison Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
                CANDIDATE CREATOR BENCHMARK (3 SHORTLIST CANDIDATES)
              </span>
            </div>
            <span className="font-mono text-[11px] text-ink-3 hidden sm:inline">
              Click any card to highlight across modules
            </span>
          </div>

          <CreatorSummaryCards
            creators={DEMO_CREATORS}
            shortlistedIds={shortlistedIds}
            activeHighlightId={activeHighlightId}
            onToggleShortlist={handleToggleShortlist}
            onToggleHighlight={handleToggleHighlight}
          />
        </section>

        {/* Section 2: Tabbed Intelligence Modules */}
        <section className="space-y-6 pt-2">
          {/* Segmented Control Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-sunken p-1.5 rounded-ctl border border-line overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[5px] text-[13px] font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-surface text-ink font-semibold shadow-2xs border border-line-strong'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-cobalt' : 'text-ink-3'} />
                  <span>{tab.label}</span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-[3px] ${
                    isActive ? 'bg-cobalt-tint text-cobalt font-semibold' : 'bg-line/50 text-ink-3'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab View */}
          <div className="transition-all duration-200">
            {(activeTab === 'fit' || activeTab === 'all') && (
              <div className="mb-8">
                <FitBreakdownSection
                  creators={DEMO_CREATORS}
                  activeHighlightId={activeHighlightId}
                />
              </div>
            )}

            {(activeTab === 'growth' || activeTab === 'all') && (
              <div className="mb-8">
                <GrowthEngagementSection
                  creators={DEMO_CREATORS}
                  activeHighlightId={activeHighlightId}
                />
              </div>
            )}

            {(activeTab === 'audience' || activeTab === 'all') && (
              <div className="mb-8">
                <AudienceDemographicsSection
                  creators={DEMO_CREATORS}
                  activeHighlightId={activeHighlightId}
                />
              </div>
            )}

            {(activeTab === 'collabs' || activeTab === 'all') && (
              <div className="mb-8">
                <BrandCollabsSection
                  creators={DEMO_CREATORS}
                  activeHighlightId={activeHighlightId}
                />
              </div>
            )}

            {(activeTab === 'simulator' || activeTab === 'all') && (
              <div className="mb-8">
                <RateDeliverableSimulator
                  creators={DEMO_CREATORS}
                  campaignBudgetMax={2500}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Production-Aligned Footer */}
      <footer className="border-t border-line bg-paper py-8 mt-12 text-xs text-ink-3">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-ink">CreatorConnect AI</span>
            <span>·</span>
            <span className="font-mono text-[11px]">Creator Intelligence Studio Preview</span>
            <span>·</span>
            <span className="font-mono text-[10px] bg-sunken px-2 py-0.5 rounded border border-line text-ink-2">
              STANDALONE PROTOTYPE
            </span>
          </div>
          <div className="font-mono text-[11px] text-ink-3">
            Fictional demo data for design evaluation · Production database unaffected
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
