/**
 * frontend/src/api/adapters.ts
 * Dedicated adapter layer converting backend canonical CreatorProfile models
 * into UI view models for P2 DiscoverScreen and CreatorProfileScreen.
 */

import type {
  CreatorProfile,
  CampaignBrief,
  CampaignWorkflow,
  MatchResult,
  ScoreBreakdown,
} from '../types';
import { CANONICAL_PORTFOLIO_BY_CREATOR } from '../data/canonicalPortfolioMetadata';


export interface UiPortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tools: string[];
  tags: string[];
  rightsStatus: string;
  verification: 'unverified' | 'verified' | 'simulated';
  humanInvolvementText: string;
  humanInvolvementLevel: number;
  declaredDate?: string;
  toolsWithVersions?: Array<{ name: string; version: string; role: string }>;
  workflowSteps?: Array<{ name: string; type: 'human' | 'model'; tool: string }>;
  creator?: UiCreator;
  creatorName?: string;
}

export interface UiCreator {
  id: string;
  name: string;
  slug: string;
  role: string;
  family: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  turnaround: string;
  revisions: number;
  fitLevel: string;
  fitScore: number;
  avatar: string;
  palette: string[];
  bio: string;
  commercialDeclared: boolean;
  rightsVerification: 'unverified' | 'verified' | 'simulated';
  tools: string[];
  platforms: string[];
  formats: string[];
  workflowSteps: Array<{ name: string; type: 'human' | 'model'; tool: string }>;
  humanInvolvementLevel: number;
  channel: {
    platform: string;
    handle: string;
    trend: 'growing' | 'steady' | 'declining';
    trendSentence: string;
    firstLastFollowers: {
      first?: string | null;
      last?: string | null;
    };
    engagementSeries?: number[];
    viewsSeries?: number[];
  };
  portfolio: UiPortfolioItem[];
  rawProfile: CreatorProfile;
}

export interface UiCampaign {
  id: string;
  code: string;
  title: string;
  brandName: string;
  budget: number;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  deadline: string | null;
  status: string;
  step: number;
  deliverablesText: string;
  turnaround: string;
  description: string;
  fullText: string;
  targetAudience: string;
  objective: string;
  deliverables: string[];
  preferredPlatforms: string[];
  requiredSkills: string[];
  preferredNiches: string[];
  preferredStyle: string;
  tone: string;
  keyMessages: string[];
  callToAction: string;
  generatedBy: string;
  userEditedFields: string[];
  shortlistedCreatorIds: string[];
  submittedAt?: string;
  rawBrief: CampaignBrief;
  rawWorkflow: CampaignWorkflow | null;
}

export interface UiMatchedCreator {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  fitScore: number;
  fitLevel: 'Strong' | 'Moderate' | 'Partial';
  budgetFit: boolean;
  overBudget: boolean;
  availabilityFit: boolean;
  availability: boolean;
  scoreBreakdown: ScoreBreakdown;
  evidence: Record<string, string[]>;
  explanation: string;
  formats: string[];
  platforms: string[];
  commercialDeclared: boolean;
  turnaround: string;
  location: string;
  rawMatch: MatchResult;
  rawCreator: CreatorProfile;
}

/**
 * Maps a single backend CreatorProfile to the UI Creator model
 */
export function adaptCreatorProfileToUi(creator: CreatorProfile): UiCreator {
  const primaryPlatform = creator.platforms && creator.platforms.length > 0
    ? creator.platforms[0]
    : null;

  const followerNumber = primaryPlatform?.follower_count ?? null;
  const followerDisplay = followerNumber !== null
    ? followerNumber >= 1000
      ? `${Math.round(followerNumber / 1000)}K`
      : `${followerNumber}`
    : null;

  const styleFamily = (creator.niches && creator.niches.length > 0)
    ? creator.niches[0]
    : (creator.style_tags && creator.style_tags.length > 0)
    ? creator.style_tags[0]
    : 'neo-product';

  const tools = (creator.ai_tools && creator.ai_tools.length > 0)
    ? creator.ai_tools
    : ['Midjourney', 'ComfyUI'];

  const workflowSteps = tools.map((t, idx) => ({
    name: t,
    type: (idx % 2 === 0 ? 'human' : 'model') as 'human' | 'model',
    tool: t,
  }));

  const canonicalPieces = CANONICAL_PORTFOLIO_BY_CREATOR[creator.id];
  let uiPortfolio: UiPortfolioItem[] = [];

  if (canonicalPieces && canonicalPieces.length > 0) {
    uiPortfolio = canonicalPieces.map((piece, idx) => ({
      id: piece.id || `cp-${creator.id}-${idx}`,
      title: piece.title,
      description: piece.description,
      imageUrl: piece.image_url,
      tools: tools,
      tags: piece.tags || [],
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'verified',
      humanInvolvementText: 'DIRECTOR CURATED',
      humanInvolvementLevel: 4,
      declaredDate: creator.created_at ? new Date(creator.created_at).toLocaleDateString() : undefined,
      toolsWithVersions: tools.map((t) => ({
        name: t,
        version: 'Production Asset',
        role: piece.content_type || 'Commercial asset creation',
      })),
      workflowSteps: workflowSteps,
    }));
  } else if (creator.portfolio_items && creator.portfolio_items.length > 0) {
    const defaultPlaceholderImages = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
    ];
    uiPortfolio = creator.portfolio_items.map((item, idx) => {
      const image = item.thumbnail_url || item.content_url || defaultPlaceholderImages[idx % defaultPlaceholderImages.length];
      return {
        id: item.id || `pi-${idx}`,
        title: item.title || 'Portfolio Piece',
        description: item.description || '',
        imageUrl: image,
        tools: tools,
        tags: item.tags || [],
        rightsStatus: 'COMMERCIAL DECLARED',
        verification: 'unverified',
        humanInvolvementText: 'HUMAN-DIRECTED',
        humanInvolvementLevel: 4,
        declaredDate: creator.created_at ? new Date(creator.created_at).toLocaleDateString() : undefined,
        toolsWithVersions: tools.map((t) => ({
          name: t,
          version: 'Registered',
          role: 'Production asset creation',
        })),
        workflowSteps: workflowSteps,
      };
    });
  } else {
    uiPortfolio.push({
      id: `p-work-${creator.id}`,
      title: `${creator.display_name} — Specimen Work`,
      description: creator.portfolio_evidence || creator.bio,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      tools: tools,
      tags: creator.style_tags || [],
      rightsStatus: 'COMMERCIAL DECLARED',
      verification: 'unverified',
      humanInvolvementText: 'HUMAN-DIRECTED',
      humanInvolvementLevel: 4,
      toolsWithVersions: tools.map((t) => ({
        name: t,
        version: 'Active Tool',
        role: 'Creative synthesis',
      })),
      workflowSteps: workflowSteps,
    });
  }

  const avatar = uiPortfolio[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';

  const uiCreator: UiCreator = {
    id: creator.id,
    name: creator.display_name,
    slug: creator.handle.replace(/^@/, '') || creator.id,
    role: (creator.skills && creator.skills.length > 0)
      ? creator.skills.join(' · ')
      : 'Generative Visual Artist',
    family: styleFamily,
    location: 'Remote / Global',
    minPrice: creator.starting_price || 0,
    maxPrice: creator.starting_price ? creator.starting_price * 1.5 : 0,
    currency: creator.currency || 'USD',
    turnaround: '3-5 business days',
    revisions: 2,
    fitLevel: creator.availability ? 'Strong' : 'Partial',
    fitScore: 88,
    avatar: avatar,
    palette: ['#1A1A1A', '#E8E5DF', '#1447FF', '#7A8288', '#2D3136'],
    bio: creator.bio || '',
    commercialDeclared: true,
    rightsVerification: 'unverified',
    tools: tools,
    platforms: (creator.platforms || []).map(p => p.name),
    formats: ['Stills 4:5', 'Reels 9:16'],
    workflowSteps: workflowSteps,
    humanInvolvementLevel: 4,
    channel: {
      platform: primaryPlatform?.name ? (primaryPlatform.name.charAt(0).toUpperCase() + primaryPlatform.name.slice(1)) : 'Instagram',
      handle: primaryPlatform?.handle || creator.handle,
      trend: 'steady',
      trendSentence: followerNumber !== null ? `${followerNumber.toLocaleString()} verified platform followers` : 'Followers declared by creator',
      firstLastFollowers: {
        last: followerDisplay ? `${followerDisplay} Followers` : null,
      },
      engagementSeries: [4.2, 4.5, 4.8, 5.0, 5.2, 5.1],
      viewsSeries: [12000, 15000, 18000, 22000, 25000, 28000],
    },
    portfolio: uiPortfolio,
    rawProfile: creator,
  };

  uiPortfolio.forEach(w => {
    w.creator = uiCreator;
    w.creatorName = uiCreator.name;
  });

  return uiCreator;
}

/**
 * Maps an array of backend CreatorProfile objects to UI Creator array
 */
export function adaptCreatorProfilesToUi(creators: CreatorProfile[]): UiCreator[] {
  return creators.map(adaptCreatorProfileToUi);
}

/**
 * Converts status string to UI step index (1: Brief, 2: Matches, 3: Shortlist, 4: Summary)
 */
export function getStepFromStatus(status: string): number {
  switch (status) {
    case 'draft':
    case 'brief_ready':
      return 1;
    case 'matches_ready':
      return 2;
    case 'shortlisted':
      return 3;
    case 'completed':
      return 4;
    default:
      return 1;
  }
}

/**
 * Maps a canonical CampaignBrief and optional CampaignWorkflow to UiCampaign
 */
export function adaptCampaignToUi(
  brief: CampaignBrief,
  workflow?: CampaignWorkflow | null,
  index = 0
): UiCampaign {
  const effectiveStatus = workflow?.workflow_status || brief.status || 'draft';
  const step = getStepFromStatus(effectiveStatus);

  const deliverablesFormatted = brief.deliverables && brief.deliverables.length > 0
    ? brief.deliverables.join(' + ')
    : 'Custom Asset Package';

  const codeNum = String(index + 1).padStart(2, '0');
  const code = `CAMPAIGN ${codeNum}`;
  const title = brief.campaign_title || `${brief.brand_name} Campaign`;

  return {
    id: brief.id,
    code,
    title,
    brandName: brief.brand_name,
    budget: brief.budget_max || brief.budget_min || 0,
    budgetMin: brief.budget_min || 0,
    budgetMax: brief.budget_max || 0,
    currency: brief.currency || 'USD',
    deadline: brief.deadline,
    status: effectiveStatus,
    step,
    deliverablesText: deliverablesFormatted,
    turnaround: brief.deadline ? `Deadline: ${brief.deadline}` : 'Flexible',
    description: brief.product_description,
    fullText: brief.product_description,
    targetAudience: brief.target_audience,
    objective: brief.objective || '',
    deliverables: brief.deliverables || [],
    preferredPlatforms: brief.preferred_platforms || [],
    requiredSkills: brief.required_skills || [],
    preferredNiches: brief.preferred_niches || [],
    preferredStyle: brief.preferred_style || '',
    tone: brief.tone || '',
    keyMessages: brief.key_messages || [],
    callToAction: brief.call_to_action || '',
    generatedBy: brief.generated_by || 'user',
    userEditedFields: brief.user_edited_fields || [],
    shortlistedCreatorIds: workflow?.selected_creator_ids || [],
    submittedAt: brief.created_at ? new Date(brief.created_at).toLocaleString() : undefined,
    rawBrief: brief,
    rawWorkflow: workflow || null,
  };
}

/**
 * Maps an array of backend CampaignBrief objects to UiCampaign array
 */
export function adaptCampaignsToUi(
  briefs: CampaignBrief[],
  workflows?: Record<string, CampaignWorkflow>
): UiCampaign[] {
  return briefs.map((brief, idx) => adaptCampaignToUi(brief, workflows?.[brief.id], idx));
}

/**
 * Maps a single MatchResult to UiMatchedCreator
 */
export function adaptMatchResultToUi(result: MatchResult): UiMatchedCreator {
  const creator = result.creator;
  const fitScore = Math.round(result.total_score * 100) / 100;
  const fitLevel = fitScore >= 80 ? 'Strong' : fitScore >= 60 ? 'Moderate' : 'Partial';

  const avatar = creator.portfolio_items?.[0]?.thumbnail_url ||
    creator.portfolio_items?.[0]?.content_url ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';

  const platforms = creator.platforms && creator.platforms.length > 0
    ? creator.platforms.map(p => p.name)
    : ['instagram'];

  return {
    id: result.creator_id,
    name: creator.display_name,
    handle: creator.handle,
    role: creator.skills && creator.skills.length > 0 ? creator.skills.join(' · ') : 'Visual Creator',
    avatar,
    minPrice: creator.starting_price || 0,
    maxPrice: (creator.starting_price || 0) * 1.5,
    currency: creator.currency || 'USD',
    fitScore,
    fitLevel,
    budgetFit: result.budget_fit,
    overBudget: result.over_budget,
    availabilityFit: result.availability_fit,
    availability: creator.availability,
    scoreBreakdown: result.score_breakdown,
    evidence: result.evidence || {},
    explanation: result.explanation || '',
    formats: ['Stills 4:5', 'Reels 9:16', '16:9'],
    platforms,
    commercialDeclared: true,
    turnaround: '3-5 business days',
    location: 'Remote / Global',
    rawMatch: result,
    rawCreator: creator,
  };
}

/**
 * Maps an array of backend MatchResult objects to UiMatchedCreator array
 */
export function adaptMatchResultsToUi(results: MatchResult[]): UiMatchedCreator[] {
  return results.map(adaptMatchResultToUi);
}

