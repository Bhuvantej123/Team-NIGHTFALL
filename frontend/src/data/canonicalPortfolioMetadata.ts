/**
 * Canonical Portfolio Metadata from Person 3 analytics.
 * 43 distinct portfolio works mapped to creator IDs.
 */

export interface CanonicalPortfolioItem {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  content_type: string;
  tags: string[];
  style_tags: string[];
  image_reference?: string;
  image_url: string;
}

export const CANONICAL_PORTFOLIO_BY_CREATOR: Record<string, CanonicalPortfolioItem[]> = {
  "creator-001": [
    {
      "id": "portfolio-001",
      "creator_id": "creator-001",
      "title": "Chrono Drift: Sci-Fi Teaser Trailer",
      "description": "A 45-second cinematic teaser featuring time-dilated spaceship dogfights, asteroid fields, and neon nebulas rendered with synchronized orchestral soundscapes.",
      "content_type": "cinematic_video",
      "tags": [
        "sci-fi",
        "space",
        "teaser-trailer",
        "visual-effects"
      ],
      "style_tags": [
        "cinematic",
        "photorealistic",
        "widescreen"
      ],
      "image_reference": "portfolio_assets/creator_001_chrono_drift.webp",
      "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-002",
      "creator_id": "creator-001",
      "title": "Echoes of the Red Planet",
      "description": "Atmospheric mood short depicting an explorer discovering ancient bioluminescent caverns beneath Martian sands.",
      "content_type": "short_film",
      "tags": [
        "mars",
        "exploration",
        "atmospheric",
        "world-building"
      ],
      "style_tags": [
        "moody",
        "atmospheric",
        "cinematic"
      ],
      "image_reference": "portfolio_assets/creator_001_red_planet.webp",
      "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-003",
      "creator_id": "creator-001",
      "title": "Neon Monolith: Brand Identity Film",
      "description": "Abstract cinematic sequence demonstrating futuristic architecture dissolving into light beams for an architectural design showcase.",
      "content_type": "brand_film",
      "tags": [
        "architecture",
        "abstract",
        "lighting",
        "commercial"
      ],
      "style_tags": [
        "cinematic",
        "photorealistic",
        "moody"
      ],
      "image_reference": "portfolio_assets/creator_001_neon_monolith.webp",
      "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-002": [
    {
      "id": "portfolio-004",
      "creator_id": "creator-002",
      "title": "Aura Pulse: Wireless Audio Launch Ad",
      "description": "3D exploded commercial showcasing synthetic metallic textures, water-resistance fluid droplets, and seamless packaging reveals.",
      "content_type": "product_commercial",
      "tags": [
        "consumer-electronics",
        "audio",
        "exploded-view",
        "e-commerce"
      ],
      "style_tags": [
        "commercial",
        "clean",
        "hyper-detailed"
      ],
      "image_reference": "portfolio_assets/creator_002_aura_pulse.webp",
      "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-005",
      "creator_id": "creator-002",
      "title": "Kinetix Chrono: Minimalist Smartwatch Reel",
      "description": "15-second high-conversion social ad featuring rotating titanium watch bezel angles with dynamic synthetic lighting shifts.",
      "content_type": "social_ad",
      "tags": [
        "smartwatch",
        "luxury-tech",
        "macro-lighting",
        "packshot"
      ],
      "style_tags": [
        "minimalist",
        "high-conversion",
        "clean"
      ],
      "image_reference": "portfolio_assets/creator_002_kinetix_chrono.webp",
      "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-006",
      "creator_id": "creator-002",
      "title": "Lumina Skincare: Glass Jar Liquid Transition",
      "description": "Hygienic e-commerce packshot sequence highlighting translucent glass bottles, botanical essence dispersion, and radiant skin tones.",
      "content_type": "product_commercial",
      "tags": [
        "skincare",
        "cosmetics",
        "glass-render",
        "botanical"
      ],
      "style_tags": [
        "clean",
        "commercial",
        "hyper-detailed"
      ],
      "image_reference": "portfolio_assets/creator_002_lumina_skincare.webp",
      "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-003": [
    {
      "id": "portfolio-007",
      "creator_id": "creator-003",
      "title": "Solar Silk: Digital Haute Couture Lookbook",
      "description": "Virtual fashion editorial exploring flowing golden silk drapes, aerodynamic pleats, and iridescent textures on digital models.",
      "content_type": "virtual_lookbook",
      "tags": [
        "haute-couture",
        "textiles",
        "digital-models",
        "runway"
      ],
      "style_tags": [
        "editorial",
        "glamorous",
        "elegant"
      ],
      "image_reference": "portfolio_assets/creator_003_solar_silk.webp",
      "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-008",
      "creator_id": "creator-003",
      "title": "Metamorphic Blooms: Avant-Garde Beauty Reel",
      "description": "Macro digital beauty film featuring botanical petal eye-makeup blooming across synthetic portraiture under soft studio illumination.",
      "content_type": "beauty_editorial",
      "tags": [
        "beauty",
        "makeup",
        "botanical",
        "editorial"
      ],
      "style_tags": [
        "avant-garde",
        "vibrant",
        "editorial"
      ],
      "image_reference": "portfolio_assets/creator_003_metamorphic_blooms.webp",
      "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-009",
      "creator_id": "creator-003",
      "title": "Cyber-Kashmiri: Heritage Fusion Runway",
      "description": "Reimagining traditional Pashmina weaves with futuristic cyber-aesthetic silhouettes for an immersive digital fashion week concept.",
      "content_type": "runway_presentation",
      "tags": [
        "heritage-fusion",
        "fashion-week",
        "pashmina",
        "runway"
      ],
      "style_tags": [
        "glamorous",
        "avant-garde",
        "elegant"
      ],
      "image_reference": "portfolio_assets/creator_003_cyber_kashmiri.webp",
      "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-004": [
    {
      "id": "portfolio-010",
      "creator_id": "creator-004",
      "title": "Saffron Smoke: Biryani Slow-Motion Masterpiece",
      "description": "Sensory culinary motion sequence capturing steam billowing from clay handis, fragrant saffron threads settling on aged basmati grains.",
      "content_type": "culinary_video",
      "tags": [
        "food-tech",
        "biryani",
        "slow-motion",
        "sensory"
      ],
      "style_tags": [
        "mouth-watering",
        "macro",
        "warm"
      ],
      "image_reference": "portfolio_assets/creator_004_saffron_smoke.webp",
      "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-011",
      "creator_id": "creator-004",
      "title": "Velvet Cocoa: Gourmet Truffle Physics",
      "description": "Macro slow-motion capture of tempered molten dark chocolate cascading over golden roasted hazelnuts and sea salt crystals.",
      "content_type": "culinary_video",
      "tags": [
        "chocolate",
        "pastry",
        "macro-food",
        "fluid-physics"
      ],
      "style_tags": [
        "mouth-watering",
        "sensory",
        "vibrant"
      ],
      "image_reference": "portfolio_assets/creator_004_velvet_cocoa.webp",
      "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-005": [
    {
      "id": "portfolio-012",
      "creator_id": "creator-005",
      "title": "Neo-Kashi 2089: Cyberpunk Game Reveal",
      "description": "Teaser trailer introducing augmented cyber-samurai duelists amidst neon-lit river ghats and holograms for an indie RPG.",
      "content_type": "game_trailer",
      "tags": [
        "gameplay-reveal",
        "cyberpunk",
        "indie-game",
        "action"
      ],
      "style_tags": [
        "cyberpunk",
        "neon",
        "high-octane"
      ],
      "image_reference": "portfolio_assets/creator_005_neo_kashi.webp",
      "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-013",
      "creator_id": "creator-005",
      "title": "Dreadforged: Dark Fantasy Hero Showcase",
      "description": "Character intro spotlight featuring an obsidian-armored sorcerer invoking shadow flames in an ancient gothic citadel.",
      "content_type": "character_intro",
      "tags": [
        "dark-fantasy",
        "rpg",
        "character-design",
        "lore"
      ],
      "style_tags": [
        "dark-fantasy",
        "gritty",
        "high-octane"
      ],
      "image_reference": "portfolio_assets/creator_005_dreadforged.webp",
      "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-014",
      "creator_id": "creator-005",
      "title": "Vortex Major: Esports Championship Stinger",
      "description": "High-octane tournament broadcast package featuring glitch transitions, kinetic 3D typography, and trophy reveal animations.",
      "content_type": "esports_motion",
      "tags": [
        "esports",
        "broadcast",
        "motion-graphics",
        "typography"
      ],
      "style_tags": [
        "neon",
        "high-octane",
        "cyberpunk"
      ],
      "image_reference": "portfolio_assets/creator_005_vortex_major.webp",
      "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-006": [
    {
      "id": "portfolio-015",
      "creator_id": "creator-006",
      "title": "Cloudbound: Shonen Anime Pilot Clip",
      "description": "A 30-second cel-shaded anime battle sequence showcasing sky pirates battling storm elementals with dynamic camera pivots.",
      "content_type": "anime_short",
      "tags": [
        "anime",
        "cel-shaded",
        "action",
        "storyboarding"
      ],
      "style_tags": [
        "anime",
        "stylized",
        "expressive"
      ],
      "image_reference": "portfolio_assets/creator_006_cloudbound.webp",
      "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-016",
      "creator_id": "creator-006",
      "title": "The Whispering Teapot: Whimsical Short",
      "description": "Heartwarming cartoon animation following an enchanted ceramic teapot organizing a midnight tea party for forest spirits.",
      "content_type": "animated_short",
      "tags": [
        "fantasy",
        "children",
        "cute",
        "whimsical"
      ],
      "style_tags": [
        "playful",
        "handcrafted-feel",
        "expressive"
      ],
      "image_reference": "portfolio_assets/creator_006_whispering_teapot.webp",
      "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-017",
      "creator_id": "creator-006",
      "title": "Rhythm Raccoon: Lo-Fi Mascot Loop",
      "description": "Endlessly looping 2D animated lo-fi beats aesthetic visual of a raccoon studying beside a rain-streaked window.",
      "content_type": "animated_loop",
      "tags": [
        "lo-fi",
        "mascot",
        "loop",
        "cozy"
      ],
      "style_tags": [
        "handcrafted-feel",
        "stylized",
        "playful"
      ],
      "image_reference": "portfolio_assets/creator_006_rhythm_raccoon.webp",
      "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-018",
      "creator_id": "creator-006",
      "title": "Mecha Sparks: Kinetic Manga Panel Motion",
      "description": "Manga-style black and white line art infused with kinetic speed-lines and electric blue color pops.",
      "content_type": "motion_graphic",
      "tags": [
        "manga",
        "mecha",
        "speed-lines",
        "comic"
      ],
      "style_tags": [
        "stylized",
        "anime",
        "expressive"
      ],
      "image_reference": "portfolio_assets/creator_006_mecha_sparks.webp",
      "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-007": [
    {
      "id": "portfolio-019",
      "creator_id": "creator-007",
      "title": "Stop Scrolling: 3-Second Viral Hook Series",
      "description": "Batch of 5 vertical hooks utilizing eye-catching gravity-defying item drops, surreal room transformations, and kinetic sound design.",
      "content_type": "short_form_reel",
      "tags": [
        "viral-hooks",
        "vertical-video",
        "retention",
        "reels"
      ],
      "style_tags": [
        "fast-paced",
        "punchy",
        "viral"
      ],
      "image_reference": "portfolio_assets/creator_007_stop_scrolling.webp",
      "image_url": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-020",
      "creator_id": "creator-007",
      "title": "Gen-Z Tech Reality Check: Satirical Sketch",
      "description": "Humorous AI parody reel illustrating exaggerated AI workplace assistants taking over mundane daily chores.",
      "content_type": "short_form_reel",
      "tags": [
        "satire",
        "tech-humor",
        "gen-z",
        "social-comedy"
      ],
      "style_tags": [
        "humorous",
        "punchy",
        "viral"
      ],
      "image_reference": "portfolio_assets/creator_007_tech_reality.webp",
      "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-021",
      "creator_id": "creator-007",
      "title": "Beat Drop Streetwear: Match-Cut Transition Reel",
      "description": "Rapid-fire 10-second sneaker and streetwear swap synchronized down to the millisecond with trending bass drops.",
      "content_type": "short_form_reel",
      "tags": [
        "streetwear",
        "sneakers",
        "beat-sync",
        "match-cut"
      ],
      "style_tags": [
        "kinetic",
        "fast-paced",
        "punchy"
      ],
      "image_reference": "portfolio_assets/creator_007_streetwear_beat.webp",
      "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-008": [
    {
      "id": "portfolio-022",
      "creator_id": "creator-008",
      "title": "Journey to the Event Horizon: Astrophysics Explainer",
      "description": "60-second educational journey demonstrating gravitational lensing, accretion discs, and relativistic light warping around supermassive black holes.",
      "content_type": "educational_explainer",
      "tags": [
        "astronomy",
        "physics",
        "science",
        "space"
      ],
      "style_tags": [
        "educational",
        "informative",
        "clarity-focused"
      ],
      "image_reference": "portfolio_assets/creator_008_event_horizon.webp",
      "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-023",
      "creator_id": "creator-008",
      "title": "Indus Valley Reborn: Archaeological Reconstruction",
      "description": "Photorealistic 3D archaeological walk-through recreating Harappan urban planning, brick architecture, and drainage channels.",
      "content_type": "historical_reconstruction",
      "tags": [
        "history",
        "archaeology",
        "ancient-civilizations",
        "heritage"
      ],
      "style_tags": [
        "scholarly",
        "structured",
        "informative"
      ],
      "image_reference": "portfolio_assets/creator_008_indus_valley.webp",
      "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-024",
      "creator_id": "creator-008",
      "title": "The Quantum Computer Explained in 90 Seconds",
      "description": "Visual breakdown contrasting classical bits with quantum qubits, superposition, and entanglement using intuitive animated visual metaphors.",
      "content_type": "educational_explainer",
      "tags": [
        "quantum-computing",
        "technology",
        "infographic",
        "stem"
      ],
      "style_tags": [
        "clarity-focused",
        "educational",
        "structured"
      ],
      "image_reference": "portfolio_assets/creator_008_quantum_explainer.webp",
      "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-009": [
    {
      "id": "portfolio-025",
      "creator_id": "creator-009",
      "title": "Titan One: Flagship Smartphone CGI Reveal",
      "description": "Ultra-premium 60-second hardware launch spot featuring titanium frame milling, sapphire lens anti-reflective reflections, and thermal vapor chamber breakdowns.",
      "content_type": "hardware_commercial",
      "tags": [
        "flagship",
        "smartphones",
        "industrial-design",
        "enterprise"
      ],
      "style_tags": [
        "enterprise",
        "sleek",
        "futuristic"
      ],
      "image_reference": "portfolio_assets/creator_009_titan_one.webp",
      "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-026",
      "creator_id": "creator-009",
      "title": "AeroDrive EV: Powertrain Inversion Commercial",
      "description": "Architectural studio commercial displaying electric vehicle dual-motor architecture assembling itself amidst cinematic magnetic force fields.",
      "content_type": "automotive_commercial",
      "tags": [
        "electric-vehicles",
        "automotive",
        "powertrain",
        "hardware"
      ],
      "style_tags": [
        "meticulous",
        "industrial",
        "enterprise"
      ],
      "image_reference": "portfolio_assets/creator_009_aerodrive_ev.webp",
      "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-010": [
    {
      "id": "portfolio-027",
      "creator_id": "creator-010",
      "title": "Oud Mystique: Luxury Perfume Moodscape",
      "description": "Haute perfumery visual poem depicting amber resins swirling with Damascus rose petals in a sunlit Moorish palace.",
      "content_type": "luxury_campaign",
      "tags": [
        "perfume",
        "fragrance",
        "luxury",
        "moodscape"
      ],
      "style_tags": [
        "luxury",
        "opulent",
        "ethereal"
      ],
      "image_reference": "portfolio_assets/creator_010_oud_mystique.webp",
      "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-028",
      "creator_id": "creator-010",
      "title": "The Solar Solitaire: High-Jewelry Light Refraction",
      "description": "Microscopic optical simulation tracing caustic light rays splitting into rainbow prisms through a 50-carat synthetic yellow diamond.",
      "content_type": "jewelry_editorial",
      "tags": [
        "diamonds",
        "jewelry",
        "refraction",
        "luxury"
      ],
      "style_tags": [
        "opulent",
        "high-fashion",
        "surreal"
      ],
      "image_reference": "portfolio_assets/creator_010_solar_solitaire.webp",
      "image_url": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-029",
      "creator_id": "creator-010",
      "title": "Celestial Velvet: Monaco Gala Collection",
      "description": "Midnight blue velvet gowns accented with starlight embroidery exhibited in a virtual palatial ballroom above Mediterranean waters.",
      "content_type": "couture_lookbook",
      "tags": [
        "ballgown",
        "monaco",
        "haute-couture",
        "gala"
      ],
      "style_tags": [
        "ethereal",
        "high-fashion",
        "luxury"
      ],
      "image_reference": "portfolio_assets/creator_010_celestial_velvet.webp",
      "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-011": [
    {
      "id": "portfolio-030",
      "creator_id": "creator-011",
      "title": "Abyssal Glow: Mariana Trench Speculative Fauna",
      "description": "Documentary-style sequence capturing bioluminescent siphonophores and glassy cephalopods pulsating in extreme oceanic depths.",
      "content_type": "nature_documentary",
      "tags": [
        "ocean",
        "deep-sea",
        "bioluminescence",
        "wildlife"
      ],
      "style_tags": [
        "documentary",
        "organic",
        "immersive"
      ],
      "image_reference": "portfolio_assets/creator_011_abyssal_glow.webp",
      "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-031",
      "creator_id": "creator-011",
      "title": "Canopy Whispers: Ancient Rainforest Macro World",
      "description": "Macro lens study of carnivorous sundew plants trapping morning dew and translucent tree frogs traversing fungal mycelium networks.",
      "content_type": "macro_documentary",
      "tags": [
        "rainforest",
        "macro-fauna",
        "botany",
        "ecology"
      ],
      "style_tags": [
        "tranquil",
        "organic",
        "majestic"
      ],
      "image_reference": "portfolio_assets/creator_011_canopy_whispers.webp",
      "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-032",
      "creator_id": "creator-011",
      "title": "Glacial Monoliths: Arctic Ice Formations",
      "description": "Drone-perspective slow-glide film over cracking sapphire-blue Arctic glacier shelves with ambient wind hydrophone audio.",
      "content_type": "environmental_short",
      "tags": [
        "arctic",
        "glaciers",
        "climate",
        "aerial"
      ],
      "style_tags": [
        "majestic",
        "documentary",
        "immersive"
      ],
      "image_reference": "portfolio_assets/creator_011_glacial_monoliths.webp",
      "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-012": [
    {
      "id": "portfolio-033",
      "creator_id": "creator-012",
      "title": "48 Hours in Kyoto: Golden Temple Sunsets",
      "description": "Vertical travel reel gliding through bamboo groves, traditional ryokans, and matcha ceremonies with warm golden-hour grading.",
      "content_type": "travel_reel",
      "tags": [
        "travel",
        "kyoto",
        "japan",
        "hospitality"
      ],
      "style_tags": [
        "dreamy",
        "sun-drenched",
        "wanderlust"
      ],
      "image_reference": "portfolio_assets/creator_012_kyoto_travel.webp",
      "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-034",
      "creator_id": "creator-012",
      "title": "Cliffside Serenity: Amalfi Coast Boutique Stay",
      "description": "Sensory hospitality reel capturing ocean breeze billows in white linen terraces, lemon orchards, and turquoise cliff plunge pools.",
      "content_type": "hospitality_reel",
      "tags": [
        "amalfi",
        "boutique-hotel",
        "lifestyle",
        "vacation"
      ],
      "style_tags": [
        "wanderlust",
        "vibrant",
        "inspirational"
      ],
      "image_reference": "portfolio_assets/creator_012_amalfi_serenity.webp",
      "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-013": [
    {
      "id": "portfolio-035",
      "creator_id": "creator-013",
      "title": "Citrus Tempest: Cold-Brew Tonic Splash Commercial",
      "description": "High-speed 1000fps simulation of blood orange wedges dropping into effervescent tonic water with micro-bubble vortex formations.",
      "content_type": "beverage_commercial",
      "tags": [
        "beverage",
        "tonic",
        "splash-dynamics",
        "commercial"
      ],
      "style_tags": [
        "refreshing",
        "dynamic",
        "macro-liquid"
      ],
      "image_reference": "portfolio_assets/creator_013_citrus_tempest.webp",
      "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-036",
      "creator_id": "creator-013",
      "title": "Golden Roast: Artisanal Espresso Crema Flow",
      "description": "Macro close-up capturing caramel espresso extraction streaming into crystal glassware with velvety foam marbling.",
      "content_type": "coffee_commercial",
      "tags": [
        "coffee",
        "espresso",
        "macro-food",
        "artisanal"
      ],
      "style_tags": [
        "sensory",
        "crisp",
        "refreshing"
      ],
      "image_reference": "portfolio_assets/creator_013_golden_roast.webp",
      "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-037",
      "creator_id": "creator-013",
      "title": "Frost & Hops: Craft IPA Condensation Pour",
      "description": "Commercial spot highlighting golden amber beer pouring into a frosted chalice with crisp condensation droplets dripping down the glass.",
      "content_type": "beverage_commercial",
      "tags": [
        "craft-beer",
        "condensation",
        "packshot",
        "refreshment"
      ],
      "style_tags": [
        "crisp",
        "macro-liquid",
        "dynamic"
      ],
      "image_reference": "portfolio_assets/creator_013_frost_hops.webp",
      "image_url": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-014": [
    {
      "id": "portfolio-038",
      "creator_id": "creator-014",
      "title": "Shadow Blade: Samurai Noir Episode 1",
      "description": "Animated graphic novel pilot featuring sumi-e ink washes coming to life in a rainy feudal courtyard duel.",
      "content_type": "motion_comic",
      "tags": [
        "motion-comic",
        "samurai",
        "sumi-e",
        "noir"
      ],
      "style_tags": [
        "stylized-ink",
        "noir",
        "dramatic"
      ],
      "image_reference": "portfolio_assets/creator_014_shadow_blade.webp",
      "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-039",
      "creator_id": "creator-014",
      "title": "Cyber-Gargoyle: City of Iron Lore Teaser",
      "description": "Parallax comic sequence featuring mechanical gargoyles watching over a smog-filled gothic industrial metropolis.",
      "content_type": "motion_comic",
      "tags": [
        "graphic-novel",
        "steampunk",
        "gothic",
        "lore"
      ],
      "style_tags": [
        "dramatic",
        "bold",
        "cinematic-comic"
      ],
      "image_reference": "portfolio_assets/creator_014_cyber_gargoyle.webp",
      "image_url": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-040",
      "creator_id": "creator-014",
      "title": "Eldritch Tales: Mythos Comic Anthology Intro",
      "description": "Dramatic ink-splatter animation revealing cosmic horror tentacles rising through vintage parchment pages.",
      "content_type": "motion_comic",
      "tags": [
        "cosmic-horror",
        "anthology",
        "ink-wash",
        "comic-art"
      ],
      "style_tags": [
        "stylized-ink",
        "cinematic-comic",
        "bold"
      ],
      "image_reference": "portfolio_assets/creator_014_eldritch_tales.webp",
      "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=85"
    }
  ],
  "creator-015": [
    {
      "id": "portfolio-041",
      "creator_id": "creator-015",
      "title": "The Nanobot Defense: Immunotherapy Mechanism",
      "description": "3D biomedical animation depicting programmable synthetic nanoparticles binding to malignant cell receptors and releasing targeted payloads.",
      "content_type": "biomedical_animation",
      "tags": [
        "immunotherapy",
        "nanotechnology",
        "biomedical",
        "healthcare"
      ],
      "style_tags": [
        "scientific",
        "microscopic",
        "illuminating"
      ],
      "image_reference": "portfolio_assets/creator_015_nanobot_defense.webp",
      "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-042",
      "creator_id": "creator-015",
      "title": "Synaptic Symphony: Neurotransmitter Signaling",
      "description": "Microscopic visual explanation showing electrical action potentials triggering vesicle fusion and dopamine release across synaptic clefts.",
      "content_type": "educational_explainer",
      "tags": [
        "neuroscience",
        "brain",
        "cellular-biology",
        "medtech"
      ],
      "style_tags": [
        "clean",
        "scientific",
        "educational"
      ],
      "image_reference": "portfolio_assets/creator_015_synaptic_symphony.webp",
      "image_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=85"
    },
    {
      "id": "portfolio-043",
      "creator_id": "creator-015",
      "title": "RoboSuture: Minimally Invasive Laparoscopy",
      "description": "Clinical device animation showing multi-articulated robotic micro-forceps operating within laparoscopic surgical environments.",
      "content_type": "medical_device_vis",
      "tags": [
        "surgical-robotics",
        "medtech",
        "device-demo",
        "healthcare"
      ],
      "style_tags": [
        "clean",
        "illuminating",
        "educational"
      ],
      "image_reference": "portfolio_assets/creator_015_robosuture.webp",
      "image_url": "https://images.unsplash.com/photo-1617897903246-719242758050?w=1200&auto=format&fit=crop&q=85"
    }
  ]
};
