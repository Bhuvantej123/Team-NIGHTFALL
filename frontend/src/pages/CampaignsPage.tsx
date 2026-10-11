import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw, X, Plus } from 'lucide-react';
import { CampaignsScreen } from '../components/screens/CampaignsScreen';
import { fetchCampaigns, createCampaign, type CreateCampaignInput } from '../api/client';
import { adaptCampaignsToUi, type UiCampaign } from '../api/adapters';

export const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<UiCampaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New Campaign Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [brandName, setBrandName] = useState<string>('');
  const [productDesc, setProductDesc] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('Gen Z streetwear collectors & digital creators');
  const [budgetMin, setBudgetMin] = useState<number>(500);
  const [budgetMax, setBudgetMax] = useState<number>(1500);
  const [currency, setCurrency] = useState<string>('USD');
  const [deadline, setDeadline] = useState<string>('2026-11-20');

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCampaigns();
      const adapted = adaptCampaignsToUi(data);
      const seenIds = new Set<string>();
      const uniqueCampaigns = adapted.filter((camp) => {
        if (!camp.id || seenIds.has(camp.id)) return false;
        seenIds.add(camp.id);
        return true;
      });
      setCampaigns(uniqueCampaigns);
    } catch (err: any) {
      setError(err?.message || 'Failed to retrieve campaigns from backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleOpenCreateModal = (prefillPrompt?: string) => {
    if (prefillPrompt) {
      setProductDesc(prefillPrompt);
      if (!brandName) {
        const firstWord = prefillPrompt.split(' ')[0] || 'Brand';
        setBrandName(firstWord);
      }
    } else {
      setBrandName('');
      setProductDesc('');
    }
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!brandName.trim()) {
      setModalError('Brand name is required.');
      return;
    }
    if (!productDesc.trim()) {
      setModalError('Product description is required.');
      return;
    }
    if (budgetMin < 0 || budgetMax < budgetMin) {
      setModalError('Budget max must be greater than or equal to budget min.');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    const payload: CreateCampaignInput = {
      brand_name: brandName.trim(),
      product_description: productDesc.trim(),
      target_audience: targetAudience.trim() || 'General audience',
      budget_min: Number(budgetMin),
      budget_max: Number(budgetMax),
      currency: currency.trim() || 'USD',
      deadline: deadline ? deadline : null,
    };

    try {
      const result = await createCampaign(payload);
      const newId = result.brief?.id || (result as any).id;
      setIsModalOpen(false);
      navigate(`/campaigns/${newId}/brief`);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to create campaign on backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectCampaign = (campId: string, stepNum = 1) => {
    const stepMap: Record<number, string> = {
      1: 'brief',
      2: 'matches',
      3: 'shortlist',
      4: 'summary',
    };
    navigate(`/campaigns/${campId}/${stepMap[stepNum] || 'brief'}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cobalt animate-spin" />
        <span className="font-mono text-[13px] text-ink-2 uppercase tracking-wider">
          Loading campaigns directory...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="p-8 rounded-card bg-surface border border-blocked/30 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-blocked/10 text-blocked flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">Campaigns Unavailable</h2>
            <p className="text-[13px] text-ink-2 mt-1 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={loadCampaigns}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-ctl bg-ink text-surface hover:bg-ink-2 text-[13px] font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CampaignsScreen
        campaigns={campaigns}
        onSelectCampaign={handleSelectCampaign}
        onNewCampaignWithText={handleOpenCreateModal}
        onOpenPipeline={(campId: string) => navigate(`/campaigns/${campId}/pipeline`)}
      />

      {/* New Campaign Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface border border-line rounded-card shadow-float overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-line flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-ink-3">NEW COMMISSION</span>
                <h3 className="font-display text-2xl text-ink">Create Campaign</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-ctl text-ink-2 hover:text-ink cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-ctl bg-blocked/10 border border-blocked/30 text-blocked text-[12px] flex items-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                  Brand / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Velo-Stride, Nila Organics"
                  className="w-full h-10 px-3.5 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                  Product Description * (Immutable Campaign Premise)
                </label>
                <textarea
                  required
                  rows={3}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Describe product materials, campaign goal, or creative launch requirements..."
                  className="w-full p-3 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none resize-y leading-relaxed"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                  Target Audience *
                </label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Gen Z streetwear collectors across Mumbai"
                  className="w-full h-10 px-3.5 text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                    Budget Min ({currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full h-10 px-3.5 font-mono text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                    Budget Max ({currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full h-10 px-3.5 font-mono text-[13px] rounded-ctl bg-paper border border-line text-ink focus:border-cobalt focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                    Currency *
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 px-3 font-mono text-[12px] rounded-ctl bg-paper border border-line text-ink focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase text-ink-3 block mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full h-10 px-3 font-mono text-[12px] rounded-ctl bg-paper border border-line text-ink focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-medium text-ink-2 hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Campaign...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Create & Configure Brief</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignsPage;
