import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Minimize2,
  ExternalLink,
} from 'lucide-react';
import { CREATORS_DATA } from '../../data/creators';

/**
 * StudioBot
 * An interactive, witty, and highly helpful AI assistant for Colophon.
 * Answers client queries, suggests vetted creators, resolves issues (licensing, delays, escrow, revisions),
 * and can co-write creative briefs.
 */
export function StudioBot({
  campaign,
  onOpenCreator,
  onApplyBriefTemplate,
  onNavigate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hey there! 👋 I'm **Colophon Studio Concierge**.\n\nWhether you're stuck drafting a tricky brief, looking for top creators under your budget, or wondering how commercial licenses work without getting hit by copyright claims—I'm here to solve it! What can I help you with?",
      timestamp: 'Just now',
      suggestions: [
        'Find creators for sneaker drop',
        'How does commercial licensing work?',
        'What if a creator misses deadline?',
        'Draft a brief for skincare brand',
      ],
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Knowledge base and query resolution engine
  const resolveBotResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Sneaker / Footwear Creators
    if (q.includes('sneaker') || q.includes('shoe') || q.includes('footwear')) {
      const ishita = CREATORS_DATA.find((c) => c.name === 'Ishita Rao') || CREATORS_DATA[0];
      return {
        text: `👟 **Top Recommendation: Ishita Rao (@ishita.cgi)**\n\n• **Specialization:** Neo-product CGI & Generative Industrial Footwear\n• **Followers:** 140,000 (Instagram Verified, +14% growth)\n• **Deliverables:** Vertical Reels (9:16), Hero Stills (4:5), 3D Blender geometry\n• **Starting Rate:** ₹8,500 (Historical average delivery: 3.2 days)\n• **Provenance:** ASCI cleared, ComfyUI Enterprise licensed.\n\nWould you like me to open Ishita's complete track record or add her to your shortlist?`,
        actions: [
          {
            label: 'View Ishita Rao Profile',
            action: () => onOpenCreator?.(ishita),
          },
          {
            label: 'Draft Sneaker Brief',
            action: () => {
              if (onApplyBriefTemplate) {
                onApplyBriefTemplate({
                  brand: 'Velo-Stride',
                  title: 'Urban Sneaker Launch',
                  budget: 150000,
                  deliverables: '3 Stills (4:5) + 2 Reels (9:16)',
                  text: 'Photorealistic urban performance sneaker launch. Hero CGI stills for billboard and web, plus vertical short-form reels showcasing shoe flex and rain traction under wet asphalt conditions.',
                  tags: ['3D CGI Renders', 'Vertical Reels (9:16)', 'Macro Product Stills', 'Commercial Clearance'],
                });
              }
            },
          },
        ],
      };
    }

    // 2. Skincare / Cosmetic Creators
    if (q.includes('skincare') || q.includes('cosmetic') || q.includes('beauty') || q.includes('botanical')) {
      const devika = CREATORS_DATA.find((c) => c.family.includes('pastel') || c.role.includes('Illustration')) || CREATORS_DATA[1] || CREATORS_DATA[0];
      return {
        text: `🌿 **For Skincare & Cosmetics, check out Devika Sen / Nila Organics style!**\n\n• **Aesthetic Family:** Gouache and pastel organic illustration\n• **Strength:** Macro water droplet physics, morning dew textures, and gentle organic palettes\n• **Formats:** 4:5 Stills and seamless carousel slides\n• **Starting Rate:** ₹12,000 with 4-day turnaround\n\nI can auto-populate a botanical skincare launch brief right now into your Brief Studio!`,
        actions: [
          {
            label: 'Apply Skincare Brief Template',
            action: () => {
              if (onApplyBriefTemplate) {
                onApplyBriefTemplate({
                  brand: 'Nila Organics',
                  title: 'Monsoon Botanical Skincare Launch',
                  budget: 25000,
                  deliverables: '4 Stills (4:5)',
                  text: 'Organic Ayurvedic hydration serum launch. 4 soft pastel still compositions capturing morning rainwater on lotus leaves with organic gouache texture and macro droplets.',
                  tags: ['Macro Product Stills', 'High Resolution (4K)', 'Lighting Direction', 'Commercial Clearance'],
                });
              }
            },
          },
        ],
      };
    }

    // 3. Commercial Licensing & Rights (Crucial client query)
    if (q.includes('license') || q.includes('right') || q.includes('legal') || q.includes('asci') || q.includes('copyright')) {
      return {
        text: `🛡️ **How Commercial Rights Work on Colophon:**\n\n1. **Model Licensing:** Creators only use enterprise-cleared models (e.g. Midjourney Pro/Enterprise, Flux commercial tier, Blender 4.2 open geometry).\n2. **ASCI Compliance:** Every piece records the synthetic generation pipeline and human involvement level (1 to 5) on the public Colophon Sheet.\n3. **Perpetual Usage:** Standard briefs include perpetual worldwide digital promotional rights (web, social media, paid ads).\n4. **No Copyright Surprises:** Zero scraped celebrity likenesses or trademarked logos are permitted.\n\nEvery deliverable comes with a cryptographic origin stamp for enterprise audit safety.`,
      };
    }

    // 4. Issue Resolution: Missed Deadlines / Delays
    if (q.includes('delay') || q.includes('deadline') || q.includes('late') || q.includes('miss')) {
      return {
        text: `⚡ **Issue Resolution: Creator Delays & SLA Policy**\n\n• **Automated Milestone Locks:** Creators have committed turnarounds (e.g. 3 days for Ishita Rao). Our system flags overdue milestones 24 hours prior.\n• **Escrow Safety:** Your commission funds stay secured in escrow. Funds are never released until you explicitly approve the deliverable.\n• **Remedy Options:** If a creator is uncommunicative or delayed past the SLA, you can request an instant 100% escrow refund or 1-click reassignment to an alternative matched creator in the same aesthetic family.`,
      };
    }

    // 5. Issue Resolution: Revisions & Quality Disagreements
    if (q.includes('revision') || q.includes('quality') || q.includes('change') || q.includes('redo') || q.includes('disagree')) {
      return {
        text: `🎨 **Revision Policy & Satisfaction Guarantee:**\n\n• **2 Revision Rounds Included:** Every standard campaign brief includes 2 formal revision cycles (composition adjustment, color grading LUT, lighting re-balance).\n• **Seed & Prompt Continuity:** Creators lock seeds in ComfyUI/Midjourney to ensure zero unexpected model drift during revisions.\n• **Arbitration:** If a delivered asset fundamentally deviates from the approved Brief Margin Notes, Colophon studio curators step in to supervise touch-ups at no extra cost.`,
      };
    }

    // 6. Pricing, Escrow & Budget Queries
    if (q.includes('price') || q.includes('budget') || q.includes('cost') || q.includes('escrow') || q.includes('fee')) {
      return {
        text: `💰 **Pricing Architecture & Escrow:**\n\n• **Starting Packages:** Vetted creator starters range from ₹8,500 to ₹35,000.\n• **Direct Arithmetic:** The price you see includes base creative fees, GPU synthesis allocation, and license clearance.\n• **Zero Hidden Markups:** Unlike old agencies that add 40% surprise management fees, all pricing is fixed upon brief sign-off.\n• **Escrow Protection:** Payment is held safely and disbursed only upon deliverable sign-off in Step 4.`,
      };
    }

    // 7. How Colophon Match Scoring Works
    if (q.includes('score') || q.includes('match') || q.includes('algorithm') || q.includes('fit')) {
      return {
        text: `🎯 **How We Score Creator Matches:**\n\nWe don't use arbitrary star ratings! Every creator receives a 100-point rubric breakdown based on 4 verifiable criteria:\n\n1. **Style Alignment (35%):** Tactile physics & visual palette match.\n2. **Tool Chain Compliance (25%):** Software stack requested in the brief (e.g. ComfyUI, Blender 4.2).\n3. **Category Provenance (25%):** Real track record in your specific industry (e.g. footwear, fintech, beauty).\n4. **Consistency & SLA (15%):** Historical turnaround speed and revision adherence.\n\nYou can click **'Fit Sheet'** on any creator to inspect the exact audit notes!`,
      };
    }

    // 8. Help writing a brief / generic brief prompt
    if (q.includes('brief') || q.includes('draft') || q.includes('write') || q.includes('help')) {
      return {
        text: `✍️ **Need help drafting your brief?**\n\nA great Colophon brief has 3 things:\n1. **Clear Hero Subject:** What is the hero product or story?\n2. **Deliverable Quantities:** e.g., 3 Stills (4:5) + 2 Vertical Reels (9:16)\n3. **Lighting & Texture Direction:** e.g., directional studio lighting, organic rainwater droplets, or raw travertine stones.\n\nTell me your product and budget, and I'll generate the full brief for you right here!`,
      };
    }

    // Default friendly assistant fallback
    return {
      text: `Got it! Regarding *"${query}"*:\n\nColophon connects you directly with vetted generative creators with full tool provenance, commercial licensing, and ASCI disclosures. \n\n• Need creator recommendations? Ask for sneakers, skincare, or 3D explainer creators.\n• Need brief help? Tell me your product.\n• Have an issue with pricing or revisions? Just ask!\n\nWhat would you like to explore next?`,
      suggestions: [
        'Find creators for sneaker drop',
        'How does commercial licensing work?',
        'Explain creator pricing & escrow safety',
        'What if a creator misses deadline?',
      ],
    };
  };

  const handleSend = (textToSend = inputText) => {
    const text = (textToSend || '').trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = resolveBotResponse(text);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        actions: response.actions,
        suggestions: response.suggestions || [
          'Find creators for sneaker drop',
          'How does commercial licensing work?',
          'What if a creator misses deadline?',
        ],
        timestamp: 'Just now',
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-line shadow-float text-ink text-[12px] font-mono cursor-pointer hover:border-ink transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-verified animate-pulse" />
            <span className="font-medium">Studio Concierge</span>
            <span className="text-ink-3">· Ask anything</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-float border transition-all cursor-pointer ${
            isOpen
              ? 'bg-ink text-surface border-ink'
              : 'bg-ink text-surface border-ink hover:bg-ink/85'
          }`}
          aria-label="Toggle AI Concierge Bot"
          title="Colophon Studio Concierge AI"
        >
          {isOpen ? <X size={22} strokeWidth={2} /> : <Bot size={24} strokeWidth={1.8} />}
        </motion.button>
      </div>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-[420px] h-[580px] max-h-[82vh] rounded-[22px] bg-surface border border-line-strong shadow-float flex flex-col overflow-hidden text-ink"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-paper border-b border-line flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ink text-surface flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Bot size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-ui font-semibold text-[14px] text-ink leading-tight">
                      Colophon Concierge
                    </h3>
                    <span className="font-mono text-[9px] bg-verified/10 text-verified px-1.5 py-0.2 rounded border border-verified/30 uppercase font-medium">
                      AI Active
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-ink-3 block">
                    Resolving client queries, matches & licenses
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(initialMessages)}
                  className="p-1.5 rounded-ctl text-ink-3 hover:text-ink hover:bg-sunken transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-ctl text-ink-3 hover:text-ink hover:bg-sunken transition-colors"
                  title="Close assistant"
                >
                  <Minimize2 size={15} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-[16px] text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-ink text-surface rounded-br-[4px]'
                        : 'bg-paper border border-line text-ink rounded-bl-[4px] shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-ui">
                      {msg.text.split('\n').map((line, idx) => {
                        // Simple bold parsing
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="font-semibold text-ink">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-line/60 flex flex-col gap-1.5">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => {
                              act.action?.();
                              setIsOpen(false);
                            }}
                            className="w-full py-1.5 px-3 rounded-ctl bg-ink hover:bg-ink/85 text-surface text-[12px] font-medium flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ArrowRight size={13} strokeWidth={2} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="font-mono text-[9px] text-ink-3 mt-1 px-1">
                    {msg.sender === 'user' ? 'You' : 'Studio Concierge'} · {msg.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 rounded-full bg-paper hover:bg-sunken border border-line hover:border-line-strong text-[11px] font-mono text-ink-2 hover:text-ink transition-colors cursor-pointer text-left"
                        >
                          💬 {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing animation */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-card bg-paper border border-line w-20 text-ink-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-paper border-t border-line">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about creators, briefs, licensing, or issues..."
                  className="flex-1 h-10 px-3.5 rounded-ctl bg-surface border border-line text-[13px] text-ink placeholder:text-ink-3 focus:border-ink focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`w-10 h-10 rounded-ctl flex items-center justify-center transition-colors cursor-pointer ${
                    inputText.trim()
                      ? 'bg-ink text-surface hover:bg-ink/85 shadow-2xs'
                      : 'bg-sunken text-ink-3 cursor-not-allowed border border-line'
                  }`}
                  aria-label="Send query"
                >
                  <Send size={15} strokeWidth={2} />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] font-mono text-ink-3 pt-2 px-1">
                <span>Verified Studio AI · ASCI Cleared</span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default StudioBot;
