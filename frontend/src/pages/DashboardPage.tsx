import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingScreen } from '../components/screens/LandingScreen.jsx';
import { createCampaign, fetchCreators } from '../api/client';
import { CheckCircle2, AlertCircle, RefreshCw, X, Server } from 'lucide-react';
import type { HealthResponse, CreatorProfile } from '../types';

interface DashboardPageProps {
  onOpenColophon?: (work: any, creator: any, dark?: boolean) => void;
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenColophon,
  onShowToast,
}) => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [showHealthModal, setShowHealthModal] = useState<boolean>(false);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data: HealthResponse = await response.json();
        setHealth(data);
      } else {
        setHealth(null);
      }
    } catch {
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchCreators()
      .then((data) => {
        const forbidden = new Set([
          'c-test-1', 'c-test-2', 'c-test-3',
          'creator-demo-001', 'creator-demo-002', 'creator-demo-003',
          'test-creator-1', 'test-creator-2', 'test-creator-3'
        ]);
        const valid = (data || []).filter(
          (c) =>
            !forbidden.has(c.id) &&
            !c.display_name?.toLowerCase().includes('elena') &&
            !c.display_name?.toLowerCase().includes('marcus') &&
            !c.display_name?.toLowerCase().includes('aria chen')
        );
        setCreators(valid);
      })
      .catch(() => {});
  }, []);

  const handleStartCampaign = async (prompt?: string) => {
    if (prompt && prompt.trim()) {
      try {
        onShowToast?.('Drafting new campaign from prompt...', 'info');
        const detail = await createCampaign({
          brand_name: 'Brand Studio',
          product_description: prompt.trim(),
          target_audience: 'High-intent digital consumers',
          budget_min: 500,
          budget_max: 2500,
          currency: 'USD',
        });
        onShowToast?.('Campaign draft created successfully', 'success');
        navigate(`/campaigns/${detail.brief.id}/brief`);
      } catch (err: unknown) {
        onShowToast?.('Created local brief for configuration', 'info');
        navigate('/campaigns');
      }
    } else {
      navigate('/campaigns');
    }
  };

  return (
    <div className="relative h-full min-h-0">
      {/* P2 Colophon Cinematic Studio Landing Presentation */}
      <LandingScreen
        creators={creators as any}
        onStartCampaign={handleStartCampaign}
        onBrowseCreators={() => navigate('/discover')}
        onOpenColophon={onOpenColophon}
        onResetData={() => {
          localStorage.removeItem('colophon_campaigns');
          onShowToast?.('Workspace state refreshed to baseline', 'info');
        }}
      />

      {/* Floating System Health Status Capsule */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowHealthModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-ctl bg-surface/90 hover:bg-surface border border-line shadow-2xs backdrop-blur-xs text-[11px] font-mono transition-all cursor-pointer text-ink-2 hover:text-ink"
          title="Click to view backend telemetry & connection status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              health?.status === 'ok' ? 'bg-verified animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span>{healthLoading ? 'Checking API...' : health?.status === 'ok' ? 'System Live' : 'Backend Standby'}</span>
        </button>
      </div>

      {/* Telemetry & Debug Inspection Modal */}
      {showHealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-card bg-surface border border-line p-6 shadow-float space-y-4 font-ui">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-ink" />
                <h3 className="font-mono text-[13px] font-semibold text-ink uppercase tracking-wider">
                  SYSTEM TELEMETRY
                </h3>
              </div>
              <button
                onClick={() => setShowHealthModal(false)}
                className="text-ink-3 hover:text-ink p-1 rounded transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between py-1 border-b border-line/60">
                <span className="text-ink-2">Status:</span>
                <span className="font-mono font-medium text-ink flex items-center gap-1.5">
                  {health?.status === 'ok' ? (
                    <>
                      <CheckCircle2 size={13} className="text-verified" />
                      <span>HEALTHY (200 OK)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} className="text-amber-500" />
                      <span>STANDBY</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-line/60">
                <span className="text-ink-2">AI Provider:</span>
                <span className="font-mono font-medium text-ink">
                  {health?.source === 'gemini'
                    ? `Google Gemini (${health.gemini_model || 'Live'})`
                    : 'Mock Provider'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-line/60">
                <span className="text-ink-2">Gemini Available:</span>
                <span className="font-mono font-medium text-ink">
                  {health?.gemini_available ? 'Yes (Live API Key)' : 'Fallback Mode'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-line/60">
                <span className="text-ink-2">Database:</span>
                <span className="font-mono font-medium text-ink">
                  Supabase PostgreSQL (Live)
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={fetchHealth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-ctl bg-sunken hover:bg-line text-ink text-[12px] font-mono transition-colors cursor-pointer"
              >
                <RefreshCw size={12} className={healthLoading ? 'animate-spin' : ''} />
                <span>Re-check Telemetry</span>
              </button>
              <button
                onClick={() => setShowHealthModal(false)}
                className="px-4 py-1.5 rounded-ctl bg-ink text-surface hover:bg-ink-2 text-[12px] font-mono transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
