import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Loader2, Users } from 'lucide-react';
import { fetchCreators } from '../api/client';
import { adaptCreatorProfilesToUi, type UiCreator } from '../api/adapters';
import { DiscoverScreen } from '../components/screens/DiscoverScreen';

interface DiscoverPageProps {
  onOpenColophon: (work: any, creator: any) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onOpenColophon }) => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<UiCreator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCreators = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCreators();
      const adapted = adaptCreatorProfilesToUi(data);
      setCreators(adapted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load creators from server';
      setError(message);
      setCreators([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-24 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cobalt-tint text-cobalt animate-spin mb-2">
          <Loader2 size={24} />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          CONNECTING TO BACKEND
        </div>
        <h2 className="font-display text-2xl text-ink">
          Loading Creator Registry...
        </h2>
        <p className="text-[13px] text-ink-2 max-w-sm mx-auto">
          Querying live creator profiles from the PostgreSQL registry.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="max-w-md mx-auto p-6 bg-surface rounded-card border border-blocked/40 shadow-float text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blocked-wash text-blocked inline-flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-blocked font-semibold">
              API ERROR · GET /api/creators
            </span>
            <h2 className="font-display text-2xl text-ink">
              Failed to load creators
            </h2>
            <p className="text-[13px] text-ink-2">
              {error}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={loadCreators}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-sunken text-ink-3 inline-flex items-center justify-center">
          <Users size={22} />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          EMPTY REGISTRY
        </div>
        <h2 className="font-display text-2xl text-ink">
          No creators found in database
        </h2>
        <p className="text-[13px] text-ink-2 max-w-md mx-auto">
          The database currently contains zero creator profiles. Please ensure the database has been seeded.
        </p>
        <button
          onClick={loadCreators}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-ctl border border-line bg-surface text-ink text-[12px] font-medium hover:bg-sunken transition-colors cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <DiscoverScreen
      creators={creators}
      onOpenColophon={onOpenColophon}
      onSelectCreator={(c: UiCreator) => navigate(`/creators/${c.id}`)}
    />
  );
};

export default DiscoverPage;
