import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import { fetchCreatorById } from '../api/client';
import { adaptCreatorProfileToUi, type UiCreator } from '../api/adapters';
import { CreatorProfileScreen } from '../components/screens/CreatorProfileScreen';

interface CreatorDetailPageProps {
  onOpenColophon: (work: any, creator: any) => void;
}

export const CreatorDetailPage: React.FC<CreatorDetailPageProps> = ({ onOpenColophon }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [creator, setCreator] = useState<UiCreator | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCreator = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCreatorById(id);
      const adapted = adaptCreatorProfileToUi(data);
      setCreator(adapted);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve creator profile';
      setError(message);
      setCreator(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCreator();
  }, [loadCreator]);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-28 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cobalt-tint text-cobalt animate-spin mb-2">
          <Loader2 size={24} />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          QUERYING PROFILE · GET /api/creators/{id}
        </div>
        <h2 className="font-display text-2xl text-ink">
          Retrieving Creator Profile...
        </h2>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="max-w-md mx-auto p-6 bg-surface rounded-card border border-blocked/40 shadow-float text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blocked-wash text-blocked inline-flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-blocked font-semibold">
              PROFILE LOOKUP FAILED
            </span>
            <h2 className="font-display text-2xl text-ink">
              Creator not found
            </h2>
            <p className="text-[13px] text-ink-2">
              {error || `Creator ID '${id}' could not be located in the registry.`}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/discover')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-ctl border border-line bg-surface text-ink text-[12px] font-medium hover:bg-sunken transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Discover</span>
            </button>
            <button
              onClick={loadCreator}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CreatorProfileScreen
      creator={creator}
      onBack={() => navigate('/discover')}
      onOpenColophon={onOpenColophon}
    />
  );
};

export default CreatorDetailPage;
