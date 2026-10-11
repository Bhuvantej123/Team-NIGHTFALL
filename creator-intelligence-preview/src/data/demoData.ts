// creator-intelligence-preview/src/data/demoData.ts
// Fictional, clearly labelled demo data for Creator Intelligence Comparison Dashboard

export interface BrandCollab {
  brand: string;
  campaignTitle: string;
  year: string;
  deliverable: string;
  views: string;
  engagement: string;
  ctr: string;
  roas: string;
  verified: boolean;
  testimonial: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  tagline: string;
  matchScore: number;
  matchTier: 'Outstanding' | 'Strong' | 'Competitive';
  badgeColor: string;
  startingPrice: number;
  currency: string;
  availability: boolean;
  responseRate: string;
  avgTurnaround: string;
  platforms: {
    name: 'YouTube' | 'Instagram' | 'TikTok';
    handle: string;
    followers: number;
    engagement: number;
    color: string;
  }[];
  totalFollowers: number;
  avgEngagement: number;
  growthRate6M: number;
  monthlyFollowerGrowth: {
    month: string;
    followers: number;
    gain: number;
  }[];
  fitBreakdown: {
    skillRelevance: number;     // 0-100
    portfolioQuality: number;   // 0-100
    aestheticMatch: number;     // 0-100
    budgetCompatibility: number;// 0-100
    reliabilityScore: number;   // 0-100
  };
  strengths: string[];
  keyRisks: string[];
  audience: {
    genderSplit: { male: number; female: number; nonBinary: number };
    ageBrackets: { bracket: string; percentage: number }[];
    topCountries: { country: string; code: string; percentage: number }[];
    topInterests: { category: string; affinity: number }[];
  };
  pastCollaborations: BrandCollab[];
}

export const CAMPAIGN_PRESETS = [
  {
    id: 'camp-aura-glow',
    title: 'Aura Glow Skincare — Cinematic Product Launch',
    budgetRange: '$1,200 – $2,500',
    primaryNiches: ['Clean Beauty', 'Photorealistic AI', 'Lifestyle UGC'],
    targetAudience: '22–35 Tech-savvy lifestyle & skincare buyers',
    preferredPlatforms: ['Instagram', 'TikTok', 'YouTube'],
  },
  {
    id: 'camp-vr-gaming',
    title: 'Nova VR Headset — Next-Gen Spatial Trailer',
    budgetRange: '$1,500 – $3,000',
    primaryNiches: ['Sci-Fi', 'Virtual Reality', 'Synthetic Audio'],
    targetAudience: '18–34 Gaming & hardware enthusiasts',
    preferredPlatforms: ['YouTube', 'TikTok'],
  },
];

export const DEMO_CREATORS: CreatorProfile[] = [
  {
    id: 'creator-aarav',
    name: 'Aarav Sharma',
    handle: '@aarav_cinematic',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tagline: 'Cinematic AI Director & Speculative Sci-Fi Storyteller',
    matchScore: 94.6,
    matchTier: 'Outstanding',
    badgeColor: 'emerald',
    startingPrice: 1450,
    currency: 'USD',
    availability: true,
    responseRate: '< 2 hrs',
    avgTurnaround: '4 business days',
    platforms: [
      { name: 'YouTube', handle: '@aarav_cinematic', followers: 115000, engagement: 6.8, color: '#FF0000' },
      { name: 'Instagram', handle: '@aarav_cinematic', followers: 78000, engagement: 5.9, color: '#E1306C' },
    ],
    totalFollowers: 193000,
    avgEngagement: 6.4,
    growthRate6M: 28.4,
    monthlyFollowerGrowth: [
      { month: 'May', followers: 151000, gain: 4200 },
      { month: 'Jun', followers: 157500, gain: 6500 },
      { month: 'Jul', followers: 165200, gain: 7700 },
      { month: 'Aug', followers: 173800, gain: 8600 },
      { month: 'Sep', followers: 182900, gain: 9100 },
      { month: 'Oct', followers: 193000, gain: 10100 },
    ],
    fitBreakdown: {
      skillRelevance: 97,
      portfolioQuality: 94,
      aestheticMatch: 95,
      budgetCompatibility: 91,
      reliabilityScore: 96,
    },
    strengths: [
      'Mastery of Runway Gen-3 camera motion dynamics',
      'Consistent photorealistic character continuity',
      'Orchestral audio sync with sound design expertise',
    ],
    keyRisks: [
      'High client demand may require 1-week lead time',
    ],
    audience: {
      genderSplit: { male: 61, female: 36, nonBinary: 3 },
      ageBrackets: [
        { bracket: '18–24', percentage: 22 },
        { bracket: '25–34', percentage: 51 },
        { bracket: '35–44', percentage: 19 },
        { bracket: '45+', percentage: 8 },
      ],
      topCountries: [
        { country: 'United States', code: 'US', percentage: 41 },
        { country: 'India', code: 'IN', percentage: 27 },
        { country: 'United Kingdom', code: 'GB', percentage: 14 },
        { country: 'Germany', code: 'DE', percentage: 9 },
        { country: 'Canada', code: 'CA', percentage: 9 },
      ],
      topInterests: [
        { category: 'Generative AI Cinema', affinity: 96 },
        { category: 'Sci-Fi Worldbuilding', affinity: 89 },
        { category: '3D VFX & Motion Graphics', affinity: 82 },
        { category: 'Cinematography Tech', affinity: 74 },
        { category: 'Brand Aesthetics', affinity: 68 },
      ],
    },
    pastCollaborations: [
      {
        brand: 'Runway AI',
        campaignTitle: 'Gen-3 Alpha Filmmakers Launch',
        year: '2026',
        deliverable: '1x 60s Cinematic Spec Trailer + Behind-The-Scenes Prompt Breakdown',
        views: '4.8M',
        engagement: '8.4%',
        ctr: '19.2%',
        roas: '4.6x',
        verified: true,
        testimonial: '“Aarav’s camera motion precision set the standard for our community showcase.”',
      },
      {
        brand: 'Topaz Video',
        campaignTitle: 'AI Spatial Upscaling Showcase',
        year: '2026',
        deliverable: '2x 4K Re-rendered Sci-Fi Shorts',
        views: '2.9M',
        engagement: '6.2%',
        ctr: '14.8%',
        roas: '3.9x',
        verified: true,
        testimonial: '“Exceptional delivery speed and seamless revision workflow.”',
      },
      {
        brand: 'Aura Skincare',
        campaignTitle: 'Botanical Peptide Morning Ritual Spec',
        year: '2025',
        deliverable: '1x 45s Macro Fluid Ad',
        views: '1.8M',
        engagement: '7.1%',
        ctr: '16.5%',
        roas: '4.1x',
        verified: true,
        testimonial: '“Turned complex organic science into stunning cinematic poetry.”',
      },
    ],
  },
  {
    id: 'creator-002',
    name: 'Pooja Varma',
    handle: '@pooja_synth',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tagline: 'Hyper-Realistic AI Visuals & Minimalist Luxury Tech Reels',
    matchScore: 90.2,
    matchTier: 'Outstanding',
    badgeColor: 'indigo',
    startingPrice: 1750,
    currency: 'USD',
    availability: true,
    responseRate: '< 4 hrs',
    avgTurnaround: '5 business days',
    platforms: [
      { name: 'Instagram', handle: '@pooja_synth', followers: 165000, engagement: 6.2, color: '#E1306C' },
      { name: 'YouTube', handle: '@poojavisuals', followers: 82000, engagement: 5.4, color: '#FF0000' },
    ],
    totalFollowers: 247000,
    avgEngagement: 5.9,
    growthRate6M: 33.1,
    monthlyFollowerGrowth: [
      { month: 'May', followers: 188000, gain: 6100 },
      { month: 'Jun', followers: 197500, gain: 9500 },
      { month: 'Jul', followers: 209000, gain: 11500 },
      { month: 'Aug', followers: 221000, gain: 12000 },
      { month: 'Sep', followers: 233500, gain: 12500 },
      { month: 'Oct', followers: 247000, gain: 13500 },
    ],
    fitBreakdown: {
      skillRelevance: 91,
      portfolioQuality: 96,
      aestheticMatch: 93,
      budgetCompatibility: 84,
      reliabilityScore: 94,
    },
    strengths: [
      'Unmatched studio macro lighting and fluid physics',
      'Ultra-high conversion rates for premium cosmetic & jewelry brands',
      'Strong appeal across European and North American buyers',
    ],
    keyRisks: [
      'Rate ceiling sits near upper bound of budget',
    ],
    audience: {
      genderSplit: { male: 42, female: 55, nonBinary: 3 },
      ageBrackets: [
        { bracket: '18–24', percentage: 16 },
        { bracket: '25–34', percentage: 56 },
        { bracket: '35–44', percentage: 22 },
        { bracket: '45+', percentage: 6 },
      ],
      topCountries: [
        { country: 'United States', code: 'US', percentage: 46 },
        { country: 'Germany', code: 'DE', percentage: 19 },
        { country: 'France', code: 'FR', percentage: 15 },
        { country: 'United Kingdom', code: 'GB', percentage: 12 },
        { country: 'Japan', code: 'JP', percentage: 8 },
      ],
      topInterests: [
        { category: 'Luxury Industrial Design', affinity: 94 },
        { category: 'Clean Cosmetic Aesthetics', affinity: 91 },
        { category: 'Minimalist Architecture', affinity: 85 },
        { category: 'High-Tech Consumer Audio', affinity: 79 },
        { category: 'Sustainable Packaging', affinity: 72 },
      ],
    },
    pastCollaborations: [
      {
        brand: 'L’Aura Paris',
        campaignTitle: 'Cellular Botanical Serum Launch',
        year: '2026',
        deliverable: '2x High-Gloss Macro Instagram Reels + 3x Static 8K Packshots',
        views: '4.2M',
        engagement: '7.8%',
        ctr: '18.4%',
        roas: '5.2x',
        verified: true,
        testimonial: '“The highest return on ad spend we’ve recorded this quarter.”',
      },
      {
        brand: 'Aura Audio Lab',
        campaignTitle: 'Titanium Acoustic Earbuds',
        year: '2026',
        deliverable: '1x 30s Exploded Assembly Ad',
        views: '2.5M',
        engagement: '5.9%',
        ctr: '13.2%',
        roas: '3.7x',
        verified: true,
        testimonial: '“Pooja’s metal texture fidelity exceeded expectations.”',
      },
      {
        brand: 'Chrono Horizon',
        campaignTitle: 'Minimalist Smart Ceramic Chronograph',
        year: '2025',
        deliverable: '1x 15s High-Conversion Ad',
        views: '1.9M',
        engagement: '6.4%',
        ctr: '15.1%',
        roas: '4.0x',
        verified: true,
        testimonial: '“Pristine lighting and prompt revisions.”',
      },
    ],
  },
  {
    id: 'creator-013',
    name: 'Vikram Nair',
    handle: '@vikram_vfx',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tagline: 'Realtime AI Game Lore & High-Velocity Spatial Audio',
    matchScore: 85.4,
    matchTier: 'Strong',
    badgeColor: 'amber',
    startingPrice: 1950,
    currency: 'USD',
    availability: false,
    responseRate: '< 6 hrs',
    avgTurnaround: '7 business days',
    platforms: [
      { name: 'TikTok', handle: '@vikram_vfx', followers: 190000, engagement: 9.1, color: '#00F2FE' },
      { name: 'YouTube', handle: '@vikrammotion', followers: 125000, engagement: 7.2, color: '#FF0000' },
    ],
    totalFollowers: 315000,
    avgEngagement: 8.3,
    growthRate6M: 41.5,
    monthlyFollowerGrowth: [
      { month: 'May', followers: 226000, gain: 11000 },
      { month: 'Jun', followers: 241000, gain: 15000 },
      { month: 'Jul', followers: 258000, gain: 17000 },
      { month: 'Aug', followers: 276000, gain: 18000 },
      { month: 'Sep', followers: 295000, gain: 19000 },
      { month: 'Oct', followers: 315000, gain: 20000 },
    ],
    fitBreakdown: {
      skillRelevance: 89,
      portfolioQuality: 88,
      aestheticMatch: 82,
      budgetCompatibility: 79,
      reliabilityScore: 89,
    },
    strengths: [
      'Unmatched viral reach on TikTok with 9.1% engagement',
      'Dynamic ElevenLabs voice cloning and procedural sound design',
      'Massive youth tech demographic (76% 18–34)',
    ],
    keyRisks: [
      'Currently booked out until next sprint (availability caution)',
      'Aesthetic leans aggressive and game-oriented vs subtle luxury',
    ],
    audience: {
      genderSplit: { male: 72, female: 25, nonBinary: 3 },
      ageBrackets: [
        { bracket: '18–24', percentage: 48 },
        { bracket: '25–34', percentage: 38 },
        { bracket: '35–44', percentage: 11 },
        { bracket: '45+', percentage: 3 },
      ],
      topCountries: [
        { country: 'United States', code: 'US', percentage: 53 },
        { country: 'Canada', code: 'CA', percentage: 17 },
        { country: 'United Kingdom', code: 'GB', percentage: 14 },
        { country: 'Australia', code: 'AU', percentage: 9 },
        { country: 'Sweden', code: 'SE', percentage: 7 },
      ],
      topInterests: [
        { category: 'Unreal Engine 5 & AI', affinity: 97 },
        { category: 'Tactical Gaming Hardware', affinity: 93 },
        { category: 'Synthetic Voice Acting', affinity: 86 },
        { category: 'Cyberpunk Lore', affinity: 81 },
        { category: 'Tech Streaming Culture', affinity: 76 },
      ],
    },
    pastCollaborations: [
      {
        brand: 'ElevenLabs',
        campaignTitle: 'Voice Design for Indie Game Prototypes',
        year: '2026',
        deliverable: '3x TikTok UGC Skits + Voice Pack Demonstration',
        views: '6.1M',
        engagement: '10.8%',
        ctr: '22.5%',
        roas: '5.8x',
        verified: true,
        testimonial: '“Vikram created the single most viral developer video in our campaign cycle.”',
      },
      {
        brand: 'Nova VR Systems',
        campaignTitle: 'Haptic spatial headset launch',
        year: '2026',
        deliverable: '1x In-depth YouTube Tech Breakdown',
        views: '3.4M',
        engagement: '8.1%',
        ctr: '17.2%',
        roas: '4.2x',
        verified: true,
        testimonial: '“Authentic gaming passion translated directly to hardware pre-orders.”',
      },
      {
        brand: 'Apex Peripherals',
        campaignTitle: 'Synthetic Soundbar Pro',
        year: '2025',
        deliverable: '2x Short-form Sound Tests',
        views: '2.1M',
        engagement: '7.9%',
        ctr: '14.9%',
        roas: '3.8x',
        verified: true,
        testimonial: '“Crisp audio production and great banter.”',
      },
    ],
  },
];
