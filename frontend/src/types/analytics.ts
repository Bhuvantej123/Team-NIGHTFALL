/**
 * frontend/src/types/analytics.ts
 * Creator Intelligence Platform contracts matching Person 3 analytics telemetry.
 */

export interface GrowthPeriod {
  platform: string;
  period: string; // YYYY-MM
  period_start: string;
  period_end: string;
  followers_start: number;
  followers_end: number;
  net_follower_change: number;
  growth_rate_pct: number | null;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  link_clicks: number;
  profile_visits: number;
  engagement_rate_pct: number | null;
  is_simulated: boolean;
}

export interface BrandCampaignOutcome {
  campaign_id: string;
  brand: string;
  product: string;
  objective: string;
  platform: string;
  start_date: string;
  end_date: string;
  spend_inr: number;
  baseline_sales: number;
  post_sales: number;
  sales_lift_pct: number | null;
  baseline_visits?: number;
  post_visits?: number;
  traffic_lift_pct: number | null;
  link_clicks: number;
  conversions: number;
  conversion_rate_pct: number | null;
  roas_estimate: number | null;
  roas_is_estimate?: boolean;
  attribution_method: string;
  data_source: string;
  status?: string;
  deliverables?: string;
  content_type?: string;
  provenance_label?: string;
  verification_status?: string;
  is_simulated: boolean;
  verified?: boolean;
  is_verified?: boolean;
  is_creator_reported?: boolean;
  is_sample_demo?: boolean;
  associated_portfolio_work?: {
    id: string;
    title: string;
    content_type: string;
    image_url?: string;
    description?: string;
    tags?: string[];
  } | null;
}

export interface PortfolioMetaPiece {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  content_type: string;
  tags: string[];
  style_tags: string[];
  image_reference?: string;
}

export interface AudienceDemographics {
  status: 'partial_survey' | 'oauth_connected' | 'unavailable';
  disclosure: string;
  age_brackets: Array<{ bracket: string; percentage: number }>;
  gender_split: { female_pct: number; male_pct: number; other_pct: number } | null;
  top_geographies: Array<{ country: string; code: string; percentage: number }>;
}

export interface CreatorAnalyticsSummary {
  current_followers: number | null;
  total_views: number;
  total_reach: number;
  avg_engagement_rate: number | null;
  overall_growth_pct: number | null;
  periods_tracked: number;
  verified_campaigns_count: number;
  has_collaborations?: boolean;
}

export interface CreatorAnalyticsPayload {
  creator_id: string;
  has_telemetry: boolean;
  summary: CreatorAnalyticsSummary;
  growth_history: GrowthPeriod[];
  past_campaigns: BrandCampaignOutcome[];
  portfolio_metadata: PortfolioMetaPiece[];
  audience_demographics: AudienceDemographics;
}
