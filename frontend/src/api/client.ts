/**
 * frontend/src/api/client.ts
 * Real API client for CreatorConnect AI backend.
 * Uses relative `/api` paths proxied by Vite to Flask backend.
 */

import type {
  CreatorProfile,
  CampaignBrief,
  CampaignDetail,
  BriefGenerationResponse,
  MatchResponse,
} from '../types';

export interface CreatorFilterParams {
  niche?: string;
  platform?: string;
  skill?: string;
  available?: boolean | string;
  q?: string;
  discipline?: string;
}

export interface CreateCampaignInput {
  brand_name: string;
  product_description: string;
  target_audience: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  deadline?: string | null;
}

export interface EditableBriefFields {
  campaign_title?: string;
  objective?: string;
  deliverables?: string[];
  preferred_platforms?: string[];
  required_skills?: string[];
  preferred_niches?: string[];
  preferred_style?: string;
  tone?: string;
  key_messages?: string[];
  call_to_action?: string;
}

export interface ShortlistItem {
  creator_id: string;
  display_name: string;
  handle: string;
  starting_price: number;
  availability: boolean;
  added_at: string;
  match_score?: number;
  creator?: CreatorProfile;
}

export interface ShortlistResponse {
  id?: string;
  campaign_id: string;
  selected_creator_ids: string[];
  workflow_status: string;
  created_at?: string;
  updated_at?: string;
  shortlist: ShortlistItem[];
  total_shortlisted: number;
}

export class ApiError extends Error {
  code?: string;
  details?: Record<string, unknown>;

  constructor(message: string, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function handleResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // ignore
    }
    throw new ApiError(
      errorData.error || `${defaultMessage} (HTTP ${response.status})`,
      errorData.code || 'HTTP_ERROR',
      errorData.details
    );
  }
  return response.json();
}

/**
 * Fetch creators list from GET /api/creators
 */
export async function fetchCreators(
  filters?: CreatorFilterParams,
  signal?: AbortSignal
): Promise<CreatorProfile[]> {
  const query = new URLSearchParams();
  if (filters?.niche && filters.niche !== 'All') {
    query.set('niche', filters.niche);
  }
  if (filters?.platform && filters.platform !== 'All') {
    query.set('platform', filters.platform);
  }
  if (filters?.skill) {
    query.set('skill', filters.skill);
  }
  if (filters?.available !== undefined && filters.available !== '') {
    query.set('available', String(filters.available));
  }
  if (filters?.q && filters.q.trim()) {
    query.set('q', filters.q.trim());
  }
  if (filters?.discipline && filters.discipline !== 'All') {
    query.set('discipline', filters.discipline);
  }

  const url = `/api/creators${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url, { signal });
  return handleResponse<CreatorProfile[]>(response, 'Failed to fetch creators');
}

/**
 * Fetch a single creator profile from GET /api/creators/<creator_id>
 */
export async function fetchCreatorById(
  creatorId: string,
  signal?: AbortSignal
): Promise<CreatorProfile> {
  const response = await fetch(`/api/creators/${encodeURIComponent(creatorId)}`, { signal });
  return handleResponse<CreatorProfile>(response, 'Failed to fetch creator profile');
}

/**
 * 1. Fetch campaigns list from GET /api/campaigns
 */
export async function fetchCampaigns(signal?: AbortSignal): Promise<CampaignBrief[]> {
  const response = await fetch('/api/campaigns', { signal });
  return handleResponse<CampaignBrief[]>(response, 'Failed to fetch campaigns');
}

/**
 * 2. Create new campaign using POST /api/campaigns
 */
export async function createCampaign(
  payload: CreateCampaignInput,
  signal?: AbortSignal
): Promise<CampaignDetail> {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
  return handleResponse<CampaignDetail>(response, 'Failed to create campaign');
}

/**
 * 3. Fetch single campaign detail from GET /api/campaigns/<campaign_id>
 */
export async function fetchCampaignById(
  campaignId: string,
  signal?: AbortSignal
): Promise<CampaignDetail> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}`, { signal });
  return handleResponse<CampaignDetail>(response, 'Failed to fetch campaign details');
}

/**
 * 4. Generate/regenerate brief using POST /api/campaigns/<campaign_id>/generate-brief
 */
export async function generateCampaignBrief(
  campaignId: string,
  signal?: AbortSignal
): Promise<BriefGenerationResponse> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/generate-brief`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
  });
  return handleResponse<BriefGenerationResponse>(response, 'Failed to generate brief');
}

/**
 * 5. Update editable brief fields using PATCH /api/campaigns/<campaign_id>
 */
export async function updateCampaignBrief(
  campaignId: string,
  updates: Partial<EditableBriefFields>,
  signal?: AbortSignal
): Promise<CampaignBrief> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
    signal,
  });
  return handleResponse<CampaignBrief>(response, 'Failed to update brief');
}

/**
 * 6. Run creator matching using POST /api/campaigns/<campaign_id>/match
 */
export async function runCampaignMatching(
  campaignId: string,
  signal?: AbortSignal
): Promise<MatchResponse> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
  });
  return handleResponse<MatchResponse>(response, 'Failed to run matching');
}

/**
 * Retrieve saved matching results using GET /api/campaigns/<campaign_id>/matches
 */
export async function fetchCampaignMatches(
  campaignId: string,
  signal?: AbortSignal
): Promise<MatchResponse> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/matches`, { signal });
  return handleResponse<MatchResponse>(response, 'Failed to fetch matches');
}

/**
 * 7. Retrieve shortlist using GET /api/campaigns/<campaign_id>/shortlist
 */
export async function fetchCampaignShortlist(
  campaignId: string,
  signal?: AbortSignal
): Promise<ShortlistResponse> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/shortlist`, { signal });
  return handleResponse<ShortlistResponse>(response, 'Failed to fetch campaign shortlist');
}

/**
 * Add creator to shortlist using POST /api/campaigns/<campaign_id>/shortlist
 */
export async function addCreatorToShortlist(
  campaignId: string,
  creatorId: string,
  signal?: AbortSignal
): Promise<ShortlistResponse> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/shortlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creator_id: creatorId }),
    signal,
  });
  return handleResponse<ShortlistResponse>(response, 'Failed to add creator to shortlist');
}

/**
 * Remove creator from shortlist using DELETE /api/campaigns/<campaign_id>/shortlist/<creator_id>
 */
export async function removeCreatorFromShortlist(
  campaignId: string,
  creatorId: string,
  signal?: AbortSignal
): Promise<ShortlistResponse> {
  const response = await fetch(
    `/api/campaigns/${encodeURIComponent(campaignId)}/shortlist/${encodeURIComponent(creatorId)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal,
    }
  );
  return handleResponse<ShortlistResponse>(response, 'Failed to remove creator from shortlist');
}

/**
 * 8. Advance workflow status using PATCH /api/campaigns/<campaign_id>/status
 */
export async function updateCampaignStatus(
  campaignId: string,
  status: string,
  signal?: AbortSignal
): Promise<{ workflow_status: string; campaign_id: string; selected_creator_ids: string[] }> {
  const response = await fetch(`/api/campaigns/${encodeURIComponent(campaignId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflow_status: status }),
    signal,
  });
  return handleResponse(response, 'Failed to update campaign status');
}

/**
 * 9. Fetch intelligence analytics for a single creator from GET /api/creators/<creator_id>/analytics
 */
export async function fetchCreatorAnalytics(
  creatorId: string,
  signal?: AbortSignal
): Promise<import('../types/analytics').CreatorAnalyticsPayload> {
  const response = await fetch(`/api/creators/${encodeURIComponent(creatorId)}/analytics`, { signal });
  return handleResponse<import('../types/analytics').CreatorAnalyticsPayload>(
    response,
    `Failed to fetch analytics for creator ${creatorId}`
  );
}

/**
 * 10. Fetch intelligence analytics for multiple creators in batch from GET /api/creators/batch-analytics
 */
export async function fetchBatchCreatorAnalytics(
  creatorIds: string[],
  signal?: AbortSignal
): Promise<Record<string, import('../types/analytics').CreatorAnalyticsPayload>> {
  if (!creatorIds || creatorIds.length === 0) return {};
  const query = new URLSearchParams({ ids: creatorIds.join(',') });
  const response = await fetch(`/api/creators/batch-analytics?${query.toString()}`, { signal });
  return handleResponse<Record<string, import('../types/analytics').CreatorAnalyticsPayload>>(
    response,
    'Failed to fetch batch creator analytics'
  );
}


