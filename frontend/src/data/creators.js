/**
 * 20 Authentic Demo Creators across 6 Style Families:
 * 1. neo-product (glossy renders on seamless backdrops)
 * 2. film-grain cinematic
 * 3. gouache and pastel illustration
 * 4. retro-futurist 3D type
 * 5. fashion editorial (stylized/cropped textures, NO human faces)
 * 6. isometric and architectural worlds
 *
 * Truth rule & Provenance Layer (Master Plan Section 6, 7, 8 & 11):
 * - Every number carries its source, status, and date.
 * - Simulated data is labeled SIMULATED DEMO DATA (never verified).
 * - Declared data is labeled DECLARED BY CREATOR · NOT INDEPENDENTLY VERIFIED.
 * - Missing/untracked data renders as InsufficientData frame with clear reason.
 * - Requirements:
 *   - At least 2 declining creators (c-03, c-05).
 *   - At least 2 creators with NO channel data (c-04, c-06).
 *   - At least 1 past campaign with revenue === null (triggers InsufficientData ROI).
 *   - Real price spread with starters under ₹10,000.
 *   - Zero real brands, zero logos, zero recognizable faces.
 */

export const CREATORS_DATA = [
  {
    id: 'c-01',
    name: 'Ishita Rao',
    slug: 'ishita-rao',
    role: 'Neo-product CGI & Generative Industrial Design',
    family: 'neo-product',
    location: 'Bengaluru, IN',
    minPrice: 8500, // Supports the ₹10,000 brief scenario!
    maxPrice: 28000,
    turnaround: '3 days',
    revisions: 2,
    fitLevel: 'Strong',
    fitScore: 95,
    // Avatar is a crop of creator's generative work, NOT a human face
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    palette: ['#1A1A1A', '#E8E5DF', '#FF4800', '#7A8288', '#2D3136'],
    bio: 'Directs synthetic product campaigns focusing on tactile material physics and directional studio illumination. Built proprietary ComfyUI nodes for seamless material displacement.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Midjourney V7', 'ComfyUI', 'Adobe Photoshop', 'Blender 4.2'],
    platforms: ['Instagram', 'YouTube', 'Web'],
    formats: ['Stills 4:5', 'Reel 9:16'],
    workflowSteps: [
      { name: 'Prompt', type: 'human', tool: 'Director Brief' },
      { name: 'Geometry', type: 'human', tool: 'Blender 4.2' },
      { name: 'Synthesis', type: 'model', tool: 'Midjourney V7' },
      { name: 'Inpaint', type: 'model', tool: 'ComfyUI' },
      { name: 'Grade', type: 'human', tool: 'Photoshop' },
    ],
    humanInvolvementLevel: 4,

    // PROVENANCE LAYER: Channel & Audience Metrics (Item 1 & 3)
    channel: {
      platform: 'Instagram',
      handle: '@ishita.cgi',
      trend: 'growing', // 'growing', 'steady', 'declining'
      trendSentence: 'Followers up 14% since April',
      postingConsistency: 'High',
      followersSeries: [118000, 122000, 126000, 131000, 135000, 140000],
      viewsSeries: [42000, 48000, 51000, 56000, 62000, 68000],
      engagementSeries: [4.1, 4.3, 4.5, 4.6, 4.8, 5.1],
      firstLastFollowers: { first: '118K (Apr)', last: '140K (Sep)' },
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Simulated Platform Scrape',
      },
    },

    audience: {
      ageRanges: ['18-24 (48%)', '25-34 (38%)', '35+ (14%)'],
      regions: ['India (Mumbai, Bengaluru 72%)', 'Southeast Asia (16%)', 'Other (12%)'],
      languages: ['English (Primary)', 'Hindi'],
      interests: ['Streetwear & Footwear', 'Industrial Design', '3D Graphics', 'Sneakerheads'],
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Audience Sample Survey',
      },
    },

    // PROVENANCE LAYER: Past Campaigns Ledger (Item 2 & 4)
    pastCampaigns: [
      {
        id: 'pc-01',
        brand: 'Apex Footwear',
        category: 'Footwear & Apparel',
        period: 'May 2026',
        spend: 40000,
        clicks: 14200,
        conversions: 840,
        revenue: 110000,
        baselineSales: '₹3.20L',
        campaignSales: '₹4.30L',
        provenance: { status: 'simulated', asOf: '01 Jun 2026', source: 'Brand Partner Ledger' },
      },
      {
        id: 'pc-02',
        brand: 'Velo Botanics',
        category: 'Personal Care',
        period: 'Jul 2026',
        spend: 25000,
        clicks: 8900,
        conversions: 320,
        revenue: 68000,
        baselineSales: '₹1.80L',
        campaignSales: '₹2.48L',
        provenance: { status: 'simulated', asOf: '15 Aug 2026', source: 'Brand Partner Ledger' },
      },
    ],

    // PROVENANCE LAYER: Disclosure & Rights Note (Item 6)
    disclosure: {
      note: 'AI-generated synthetic materials disclosed in accordance with ASCI Guidelines. Model licensing cleared under ComfyUI enterprise license.',
      licenceTerms: 'Perpetual worldwide digital promotional rights; physical billboard print limited to 12 months.',
      provenance: { status: 'declared', asOf: '10 Oct 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Exemplary', score: 96, evidence: 'Studio seamless backdrops and sub-surface scattering match sneaker brief.' },
      tools: { verdict: 'Complete', score: 92, evidence: 'ComfyUI ControlNet integration ensures strict footwear silhouette adherence.' },
      category: { verdict: 'Proven', score: 94, evidence: '6 high-conversion apparel and sneaker drops delivered this year.' },
      consistency: { verdict: 'Exact', score: 94, evidence: 'Zero color drift observed between 9:16 reels and 4:5 still hero assets.' },
    },
    meetsClaims: [
      { req: '4K vertical (9:16) and hero stills (4:5)', source: 'Velo-Stride Campaign 2026' },
      { req: 'Turnaround within 4 days', source: 'Historical average: 3.2 days' },
      { req: 'Commercial usage declared with training logs', source: 'Enterprise Model License Cleared' },
    ],
    unverifiedClaims: [
      { req: 'Physical sneaker 3D scan integration', note: 'Creator requests physical prototype delivery if mesh import required.' },
    ],
    portfolio: [
      {
        id: 'w-01',
        title: 'Kevlar Monolith Sole Concept',
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=80',
        tools: ['Midjourney V7', 'ComfyUI', 'Photoshop'],
        humanInvolvementText: 'HYBRID RETOUCHED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '4:5',
      },
      {
        id: 'w-02',
        title: 'Aerogel Cushioning Dispersion',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
        tools: ['Blender 4.2', 'Flux.1 Pro', 'Lightroom'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-03',
        title: 'Carbon Fiber Weave Texture Detail',
        imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
        tools: ['Midjourney V7', 'Magnific AI', 'Photoshop'],
        humanInvolvementText: 'HAND-FINISHED',
        humanInvolvementLevel: 5,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  {
    id: 'c-02',
    name: 'Devansh Kulkarni',
    slug: 'devansh-kulkarni',
    role: 'Film-Grain Cinematic & High-Fidelity Video Director',
    family: 'film-grain cinematic',
    location: 'Mumbai, IN',
    minPrice: 9500, // Supports the ₹10,000 brief scenario!
    maxPrice: 32000,
    turnaround: '4 days',
    revisions: 2,
    fitLevel: 'Good',
    fitScore: 88,
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80',
    palette: ['#1C1E24', '#D4AF37', '#8B263E', '#EAE6DF', '#4A5060'],
    bio: 'Cinema cinematographer bridging 35mm anamorphic textures with neural mastering. Directs narrative commercials with grounded physical camera motion.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Runway Gen-3', 'Midjourney V7', 'Adobe Premiere', 'Topaz Video'],
    platforms: ['YouTube', 'Instagram', 'Web'],
    formats: ['Reel 9:16', 'Landscape 16:9'],
    workflowSteps: [
      { name: 'Storyboard', type: 'human', tool: 'Figma & Sketch' },
      { name: 'Keyframes', type: 'model', tool: 'Midjourney V7' },
      { name: 'Motion Gen', type: 'model', tool: 'Runway Gen-3' },
      { name: 'Color Grade', type: 'human', tool: 'Premiere Pro' },
      { name: 'Mastering', type: 'human', tool: 'Topaz Neural' },
    ],
    humanInvolvementLevel: 4,

    // Steady audience channel
    channel: {
      platform: 'YouTube',
      handle: 'Devansh Motion',
      trend: 'steady',
      trendSentence: 'Steady audience baseline (±1.5% variance)',
      postingConsistency: 'Medium',
      followersSeries: [82000, 82600, 83100, 82900, 83400, 83800],
      viewsSeries: [130000, 134000, 138000, 136000, 140000, 142000],
      engagementSeries: [6.0, 6.2, 6.1, 6.3, 6.1, 6.2],
      firstLastFollowers: { first: '82K (Apr)', last: '83.8K (Sep)' },
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Simulated Platform Scrape',
      },
    },

    audience: {
      ageRanges: ['18-24 (34%)', '25-34 (52%)', '35+ (14%)'],
      regions: ['India (Mumbai, Pune 65%)', 'Europe (20%)', 'Other (15%)'],
      languages: ['English', 'Marathi', 'Hindi'],
      interests: ['Cinema & Cameras', 'Storytelling', 'Luxury & Fashion'],
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Audience Sample Survey',
      },
    },

    pastCampaigns: [
      {
        id: 'pc-03',
        brand: 'Neo FinTech',
        category: 'Finance',
        period: 'Jun 2026',
        spend: 50000,
        clicks: 18200,
        conversions: 1120,
        revenue: 145000,
        baselineSales: '₹4.50L',
        campaignSales: '₹5.95L',
        provenance: { status: 'simulated', asOf: '10 Jul 2026', source: 'Brand Partner Ledger' },
      },
      // REVENUE NULL TEST CASE (Triggers InsufficientData)
      {
        id: 'pc-04',
        brand: 'Urban Velocity',
        category: 'Mobility',
        period: 'Aug 2026',
        spend: 35000,
        clicks: 9400,
        conversions: 410,
        revenue: null,
        baselineSales: null,
        provenance: { status: 'simulated', asOf: '01 Sep 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'Commercial model training rights verified under Runway Gen-3 Enterprise agreement. All synthesized voices and talents cleared.',
      licenceTerms: 'Perpetual digital broadcast & web syndication.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Strong', score: 92, evidence: 'Natural analog grain curves and believable atmospheric rain reflections.' },
      tools: { verdict: 'Direct', score: 90, evidence: 'Runway Gen-3 alpha pass with custom post-color grade.' },
      category: { verdict: 'High', score: 87, evidence: 'Experience in luxury and athletic performance storytelling.' },
      consistency: { verdict: 'Verified', score: 91, evidence: 'No temporal flickering across generated sequences.' },
    },
    meetsClaims: [
      { req: 'Cinematic 35mm film emulation', source: 'Short Film Festival 2026' },
      { req: '9:16 and 16:9 delivery passes', source: 'Documented in Colophon Record #V-192' },
    ],
    portfolio: [
      {
        id: 'w-04',
        title: 'Nocturne Sprint — Streetlight Motion',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
        tools: ['Runway Gen-3', 'Premiere Pro'],
        humanInvolvementText: 'DIRECTOR-GRADED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '16:9',
      },
      {
        id: 'w-05',
        title: 'Rain Reflection Anamorphic Flare',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
        tools: ['Midjourney V7', 'Topaz Video'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 3,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-06',
        title: 'Subway Turnstile Atmospheric Light',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
        tools: ['Runway Gen-3', 'After Effects'],
        humanInvolvementText: 'COMPOSITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  {
    id: 'c-03',
    name: 'Aanya Sen',
    slug: 'aanya-sen',
    role: 'Pastel Gouache & Organic Editorial Illustration',
    family: 'gouache and pastel illustration',
    location: 'Kolkata, IN',
    minPrice: 7500,
    maxPrice: 24000,
    turnaround: '3 days',
    revisions: 3,
    fitLevel: 'Good',
    fitScore: 82,
    avatar: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=200&auto=format&fit=crop&q=80',
    palette: ['#F9DCC4', '#F8AD9D', '#D0F4DE', '#A3C4BC', '#3E5C76'],
    bio: 'Crafts soft, organic illustrative narratives using bespoke LoRA models trained strictly on hand-painted botanical gouache plates.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Flux.1 Pro', 'Adobe Photoshop', 'Procreate'],
    platforms: ['Instagram', 'Web'],
    formats: ['Stills 4:5', 'Square 1:1'],
    workflowSteps: [
      { name: 'Sketch', type: 'human', tool: 'Procreate' },
      { name: 'Diffusion', type: 'model', tool: 'Flux.1 Pro' },
      { name: 'Retouch', type: 'human', tool: 'Photoshop' },
    ],
    humanInvolvementLevel: 5,

    // DECLINING CREATOR #1 (Person 3 dataset requirement)
    channel: {
      platform: 'Instagram',
      handle: '@aanya.gouache',
      trend: 'declining',
      trendSentence: 'Followers down 9% since April',
      postingConsistency: 'Low',
      followersSeries: [154000, 151000, 147000, 144000, 141000, 140100],
      viewsSeries: [48000, 44000, 41000, 39000, 38000, 36000],
      engagementSeries: [4.2, 3.9, 3.8, 3.5, 3.4, 3.2],
      firstLastFollowers: { first: '154K (Apr)', last: '140.1K (Sep)' },
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Simulated Platform Scrape',
      },
    },

    audience: {
      ageRanges: ['18-24 (28%)', '25-34 (58%)', '35+ (14%)'],
      regions: ['India (Bengaluru, Kolkata 60%)', 'Global (40%)'],
      languages: ['English', 'Bengali', 'Hindi'],
      interests: ['Botanicals', 'Ayurveda & Skincare', 'Handmade Art'],
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Audience Sample Survey',
      },
    },

    pastCampaigns: [
      {
        id: 'pc-05',
        brand: 'Kama Botanical',
        category: 'Skincare',
        period: 'Apr 2026',
        spend: 30000,
        clicks: 11000,
        conversions: 780,
        revenue: 84000,
        baselineSales: '₹2.10L',
        campaignSales: '₹2.94L',
        provenance: { status: 'simulated', asOf: '01 May 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'Trained on custom proprietary hand-drawn botanical gouache plates. No external artist data used.',
      licenceTerms: 'Perpetual digital rights for packaging and social.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Distinct', score: 85, evidence: 'Warm tactile pigment textures; excels at lifestyle and beauty.' },
      tools: { verdict: 'Streamlined', score: 82, evidence: 'Clean 3-stage hand-finished workflow.' },
      category: { verdict: 'Moderate', score: 78, evidence: 'Primarily skincare and editorial lifestyle.' },
      consistency: { verdict: 'High', score: 84, evidence: 'Consistent warm pigment density across batches.' },
    },
    meetsClaims: [
      { req: 'Artistic brush texture provenance', source: 'Self-trained Gouache LoRA v3' },
    ],
    portfolio: [
      {
        id: 'w-07',
        title: 'Botanical Droplet Hydration',
        imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=900&auto=format&fit=crop&q=80',
        tools: ['Flux.1 Pro', 'Procreate'],
        humanInvolvementText: 'HAND-PAINTED POST',
        humanInvolvementLevel: 5,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '4:5',
      },
      {
        id: 'w-08',
        title: 'Morning Monsoon Petals',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
        tools: ['Flux.1 Pro', 'Photoshop'],
        humanInvolvementText: 'HYBRID',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-09',
        title: 'Terracotta Vessel Still Life',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
        tools: ['Flux.1 Pro', 'Lightroom'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  {
    id: 'c-04',
    name: 'Soren Lindqvist',
    slug: 'soren-lindqvist',
    role: 'Retro-Futurist 3D Typography & Kinetic Branding',
    family: 'retro-futurist 3D type',
    location: 'Stockholm, SE',
    minPrice: 14000,
    maxPrice: 42000,
    turnaround: '5 days',
    revisions: 2,
    fitLevel: 'Strong',
    fitScore: 90,
    avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80',
    palette: ['#0A0A0A', '#E8E8E8', '#FF3E00', '#545454', '#262626'],
    bio: 'Pioneers kinetic letterforms using custom neural displacement maps in Cinema 4D. Specializes in brutalist spatial typography.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Cinema 4D', 'Midjourney V7', 'After Effects'],
    platforms: ['Web', 'Instagram', 'Billboard'],
    formats: ['Landscape 16:9', 'Stills 4:5'],
    workflowSteps: [
      { name: 'Typography', type: 'human', tool: 'Glyphs 3' },
      { name: 'Extrusion', type: 'human', tool: 'Cinema 4D' },
      { name: 'Neural Diff', type: 'model', tool: 'Midjourney V7' },
      { name: 'Comp', type: 'human', tool: 'After Effects' },
    ],
    humanInvolvementLevel: 4,

    // NO CHANNEL DATA CREATOR #1 (Person 3 dataset requirement)
    // Only publishes client work, no personal social channel.
    channel: null,
    audience: null,

    pastCampaigns: [
      {
        id: 'pc-06',
        brand: 'Nordic Sound Labs',
        category: 'Audio & Tech',
        period: 'Mar 2026',
        spend: 45000,
        clicks: 12500,
        conversions: 610,
        revenue: 98000,
        baselineSales: null,
        provenance: { status: 'simulated', asOf: '10 Apr 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'Vector typography created with Glyphs 3. All Cinema 4D 3D assets modeled from scratch.',
      licenceTerms: 'Full worldwide rights including billboard and out-of-home print.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Exceptional', score: 95, evidence: 'Brutalist chrome typographic geometry with tactile raytracing.' },
      tools: { verdict: 'Robust', score: 88, evidence: 'Direct hybrid Cinema 4D workflow with vector master files.' },
      category: { verdict: 'Strong', score: 87, evidence: 'Executed 8 tech and street drops in EU/Asia.' },
      consistency: { verdict: 'High', score: 88, evidence: 'Precise kerning and letterform integrity maintained.' },
    },
    meetsClaims: [
      { req: 'Vector output alongside 4K renders', source: 'Client delivery log #C4D-99' },
    ],
    portfolio: [
      {
        id: 'w-10',
        title: 'CHROMIUM 014 — Deconstructed Monogram',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
        tools: ['Cinema 4D', 'Midjourney V7'],
        humanInvolvementText: '3D HYBRID',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '4:5',
      },
      {
        id: 'w-11',
        title: 'Kinetic Warp Glyph Sequence',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
        tools: ['Cinema 4D', 'After Effects'],
        humanInvolvementText: 'HAND-ANIMATED',
        humanInvolvementLevel: 5,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-12',
        title: 'Liquid Mercury Sans Character Set',
        imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
        tools: ['Cinema 4D', 'Photoshop'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  {
    id: 'c-05',
    name: 'Maya Chen',
    slug: 'maya-chen',
    role: 'Editorial High-Fashion Textiles & Macro Silhouette',
    family: 'fashion editorial',
    location: 'Singapore',
    minPrice: 11000,
    maxPrice: 35000,
    turnaround: '4 days',
    revisions: 2,
    fitLevel: 'Good',
    fitScore: 84,
    avatar: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80',
    palette: ['#0C0D0E', '#EAE6E1', '#D4C5B9', '#8C7A6B', '#342E28'],
    bio: 'Specializes in avant-garde tailoring and textural macro crops. Strictly adheres to anonymous cropped fabric contours to maintain brand focus.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Midjourney V7', 'Flux.1 Pro', 'Adobe Photoshop'],
    platforms: ['Instagram', 'Billboard', 'Web'],
    formats: ['Stills 4:5', 'Reel 9:16'],
    workflowSteps: [
      { name: 'Concept', type: 'human', tool: 'Editorial Deck' },
      { name: 'Synthesis', type: 'model', tool: 'Flux.1 Pro' },
      { name: 'Drape Mod', type: 'model', tool: 'Midjourney V7' },
      { name: 'Retouch', type: 'human', tool: 'Photoshop' },
    ],
    humanInvolvementLevel: 4,

    // DECLINING CREATOR #2 (Person 3 dataset requirement)
    channel: {
      platform: 'Instagram',
      handle: '@maya.textiles',
      trend: 'declining',
      trendSentence: 'Followers down 6% over last quarter',
      postingConsistency: 'Medium',
      followersSeries: [96000, 94500, 93200, 92000, 91100, 90200],
      viewsSeries: [32000, 31000, 29000, 28000, 27500, 26000],
      engagementSeries: [3.8, 3.6, 3.5, 3.4, 3.3, 3.1],
      firstLastFollowers: { first: '96K (Apr)', last: '90.2K (Sep)' },
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Simulated Platform Scrape',
      },
    },

    audience: {
      ageRanges: ['25-34 (64%)', '35-44 (26%)', '18-24 (10%)'],
      regions: ['Singapore (42%)', 'East Asia (38%)', 'Other (20%)'],
      languages: ['English', 'Mandarin'],
      interests: ['Haute Couture', 'Textile Engineering', 'Minimalist Architecture'],
      provenance: {
        status: 'simulated',
        asOf: '12 Sep 2026',
        source: 'Audience Sample Survey',
      },
    },

    pastCampaigns: [
      {
        id: 'pc-07',
        brand: 'Aethel Timepieces',
        category: 'Luxury Accessories',
        period: 'Jun 2026',
        spend: 55000,
        clicks: 15400,
        conversions: 480,
        revenue: 165000,
        baselineSales: '₹5.00L',
        campaignSales: '₹6.65L',
        provenance: { status: 'simulated', asOf: '15 Jul 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'Zero recognizable human models utilized. Strictly anonymous cropped textiles and macro textures.',
      licenceTerms: 'Perpetual commercial print & web license.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Elite', score: 94, evidence: 'Museum-grade editorial lighting with zero uncanny valley artifacting.' },
      tools: { verdict: 'Good', score: 81, evidence: 'Dual-model fusion with manual fabric tone grading.' },
      category: { verdict: 'High', score: 86, evidence: 'Technical outerwear and footwear materials portfolio.' },
      consistency: { verdict: 'Solid', score: 83, evidence: 'Unified low-contrast shadow tonality throughout.' },
    },
    meetsClaims: [
      { req: 'Zero facial licensing exposure', source: 'Macro Fabric Policy strictly adhered' },
    ],
    portfolio: [
      {
        id: 'w-13',
        title: 'Pleated Ripstop Macro Fold',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
        tools: ['Midjourney V7', 'Photoshop'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '4:5',
      },
      {
        id: 'w-14',
        title: 'Matte Neoprene Collar Contour',
        imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
        tools: ['Flux.1 Pro', 'Photoshop'],
        humanInvolvementText: 'RETOUCHED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-15',
        title: 'Technical Webbing Buckle Still',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
        tools: ['Midjourney V7', 'Lightroom'],
        humanInvolvementText: 'COLOR-GRADED',
        humanInvolvementLevel: 3,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  {
    id: 'c-06',
    name: 'Karan Mehra',
    slug: 'karan-mehra',
    role: 'Isometric Explainer Worlds & Architectural Cutaways',
    family: 'isometric and architectural worlds',
    location: 'New Delhi, IN',
    minPrice: 8000,
    maxPrice: 22000,
    turnaround: '3 days',
    revisions: 3,
    fitLevel: 'Partial',
    fitScore: 72,
    avatar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80',
    palette: ['#2B2D42', '#8D99AE', '#EDF2F4', '#EF233C', '#D90429'],
    bio: 'Builds modular isometric technical diagrams and architectural vignettes for fintech and infrastructure products. Blends CAD geometry with AI texture maps.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Blender 4.2', 'Stable Diffusion XL', 'Illustrator'],
    platforms: ['Web', 'YouTube'],
    formats: ['Landscape 16:9', 'Square 1:1'],
    workflowSteps: [
      { name: 'CAD Base', type: 'human', tool: 'Blender 4.2' },
      { name: 'Texture', type: 'model', tool: 'Stable Diffusion XL' },
      { name: 'Vector Callouts', type: 'human', tool: 'Illustrator' },
    ],
    humanInvolvementLevel: 5,

    // NO CHANNEL DATA CREATOR #2 (Person 3 dataset requirement)
    channel: null,
    audience: null,

    pastCampaigns: [
      {
        id: 'pc-08',
        brand: 'SetuPay Technologies',
        category: 'FinTech',
        period: 'Feb 2026',
        spend: 28000,
        clicks: 19400,
        conversions: 1840,
        revenue: 92000,
        baselineSales: '₹3.10L',
        campaignSales: '₹4.02L',
        provenance: { status: 'simulated', asOf: '01 Mar 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'CAD components built in Blender 4.2. No copyrighted iconography incorporated.',
      licenceTerms: 'Perpetual software explainer integration rights.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Isometric Only', score: 68, evidence: 'Strong architectural discipline, but less tailored for organic footwear.' },
      tools: { verdict: 'Rigorous', score: 79, evidence: 'Precise CAD modeling with neural texturing pass.' },
      category: { verdict: 'Fintech/Tech', score: 70, evidence: 'Deep experience in SaaS and UPI technical diagrams.' },
      consistency: { verdict: 'Exceptional', score: 92, evidence: 'Strict isometric grid alignment across all components.' },
    },
    meetsClaims: [
      { req: 'Vector UI integration ready', source: 'Figma Token Deliverable Package' },
    ],
    portfolio: [
      {
        id: 'w-16',
        title: 'UPI Ledger Cloud Gateway Cutaway',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80',
        tools: ['Blender 4.2', 'Stable Diffusion XL'],
        humanInvolvementText: 'CAD DIRECTED',
        humanInvolvementLevel: 5,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '16:9',
      },
      {
        id: 'w-17',
        title: 'Automated Micro-fulfillment Isometric',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
        tools: ['Blender 4.2', 'Photoshop'],
        humanInvolvementText: 'HUMAN-EDITED',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
      {
        id: 'w-18',
        title: 'Modular Server Rack Cooling Array',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        tools: ['Stable Diffusion XL', 'Illustrator'],
        humanInvolvementText: 'HYBRID',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '1:1',
      },
    ],
  },

  // Reserve List Creators: Fail exactly ONE constraint!
  {
    id: 'c-07',
    name: 'Aarav Patel',
    slug: 'aarav-patel',
    role: 'Hyperreal Footwear & Streetwear CGI',
    family: 'neo-product',
    location: 'Ahmedabad, IN',
    minPrice: 16000, // Over budget by ₹6,000 for a ₹10,000 scenario!
    maxPrice: 38000,
    turnaround: '4 days',
    revisions: 2,
    fitLevel: 'Good',
    fitScore: 89,
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    palette: ['#121212', '#E1DFD9', '#E63946', '#457B9D', '#1D3557'],
    bio: 'Photoreal footwear director with multiple synthetic knit shoe campaigns under belt. Specializes in synthetic soles and exploded structural renders.',
    commercialDeclared: true,
    rightsVerification: 'verified',
    tools: ['Midjourney V7', 'Blender 4.2', 'Photoshop'],
    platforms: ['Instagram', 'Web'],
    formats: ['Stills 4:5', 'Reel 9:16'],
    isReserve: true,
    failingConstraint: 'Over budget by ₹6,000',
    leverAction: 'Raise budget to ₹16,000',
    targetBudget: 16000,
    doesNotMeet: 'Starting rate ₹16,000 exceeds selected brief budget ₹10,000.',
    workflowSteps: [
      { name: 'Model', type: 'human', tool: 'Blender 4.2' },
      { name: 'Diffuse', type: 'model', tool: 'Midjourney V7' },
      { name: 'Composite', type: 'human', tool: 'Photoshop' },
    ],
    humanInvolvementLevel: 4,

    channel: {
      platform: 'Instagram',
      handle: '@aarav.footwear',
      trend: 'growing',
      trendSentence: 'Followers up 21% since April',
      postingConsistency: 'High',
      followersSeries: [62000, 66000, 70000, 74000, 78000, 83000],
      viewsSeries: [28000, 31000, 35000, 39000, 42000, 47000],
      engagementSeries: [5.2, 5.4, 5.5, 5.7, 5.8, 6.0],
      firstLastFollowers: { first: '62K (Apr)', last: '83K (Sep)' },
      provenance: { status: 'simulated', asOf: '12 Sep 2026', source: 'Simulated Platform Scrape' },
    },

    audience: {
      ageRanges: ['18-24 (54%)', '25-34 (36%)', '35+ (10%)'],
      regions: ['India (78%)', 'Other (22%)'],
      languages: ['English', 'Gujarati', 'Hindi'],
      interests: ['Sneakers', 'Street Fashion', '3D CAD'],
      provenance: { status: 'simulated', asOf: '12 Sep 2026', source: 'Audience Sample Survey' },
    },

    pastCampaigns: [
      {
        id: 'pc-09',
        brand: 'SoleKinetics',
        category: 'Footwear',
        period: 'May 2026',
        spend: 32000,
        clicks: 11200,
        conversions: 710,
        revenue: 89000,
        baselineSales: '₹2.40L',
        campaignSales: '₹3.29L',
        provenance: { status: 'simulated', asOf: '01 Jun 2026', source: 'Brand Partner Ledger' },
      },
    ],

    disclosure: {
      note: 'All footwear soles synthesized from scratch using Blender 4.2 meshes.',
      licenceTerms: 'Commercial usage declared with training logs.',
      provenance: { status: 'declared', asOf: '12 Sep 2026', source: 'Self-declared by creator' },
    },

    criteria: {
      style: { verdict: 'Ideal', score: 95, evidence: 'Matches street sneaker lighting and sole texture.' },
      tools: { verdict: 'Matches', score: 90, evidence: 'Midjourney + Blender pipeline meets delivery criteria.' },
      category: { verdict: 'Direct', score: 92, evidence: 'High experience with athletic footwear models.' },
      consistency: { verdict: 'Strong', score: 87, evidence: 'Crisp sole tread resolution across multi-angle shots.' },
    },
    portfolio: [
      {
        id: 'w-19',
        title: 'Exploded Running Sole Assembly',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop&q=80',
        tools: ['Blender 4.2', 'Midjourney V7'],
        humanInvolvementText: '3D HYBRID',
        humanInvolvementLevel: 4,
        rightsStatus: 'COMMERCIAL USE DECLARED',
        verification: 'verified',
        aspect: '4:5',
      },
    ],
  },
];

