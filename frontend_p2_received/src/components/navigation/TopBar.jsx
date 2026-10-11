import React from 'react';
import { Plus } from 'lucide-react';
import { ColophonLockup } from '../common/BrandLogo';

/**
 * Top bar, 64px:
 * Wordmark, then Campaigns, Discover, and a primary "New campaign" button on the right.
 * No fake notification bells or fake avatars.
 * Small "Demo workspace" caption.
 * Sentence case Geist label role (mono caps reserved strictly for captions/credit lines).
 * Focus ring only on :focus-visible.
 */
export function TopBar({
  currentRoute = '/',
  onNavigate,
  onNewCampaign,
}) {
  const isLanding = currentRoute === '/';
  const isCampaigns = currentRoute === '/campaigns' || (currentRoute && currentRoute.startsWith('/campaigns/'));
  const isDiscover = currentRoute === '/discover';

  return (
    <header className={`sticky top-0 z-40 h-16 w-full px-6 flex items-center justify-between select-none transition-colors duration-300 ${
      isLanding
        ? 'bg-[#0A0A0C]/85 backdrop-blur-md border-b border-white/[0.08] text-white'
        : 'bg-paper border-b border-line text-ink'
    }`}>
      {/* Left: Brand Lockup & Main Navigation */}
      <div className="flex items-center gap-8">
        <ColophonLockup dark={isLanding} onClick={() => onNavigate('/')} />

        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/campaigns')}
            className={`relative px-3 py-1.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded-ctl ${
              isCampaigns
                ? isLanding ? 'text-white font-semibold' : 'text-ink font-semibold'
                : isLanding ? 'text-white/70 hover:text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            Campaigns
            {isCampaigns && (
              <span className={`absolute bottom-[-14px] left-3 right-3 h-[2px] ${isLanding ? 'bg-white' : 'bg-ink'}`} />
            )}
          </button>

          <button
            onClick={() => onNavigate('/discover')}
            className={`relative px-3 py-1.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded-ctl ${
              isDiscover
                ? isLanding ? 'text-white font-semibold' : 'text-ink font-semibold'
                : isLanding ? 'text-white/70 hover:text-white' : 'text-ink-2 hover:text-ink'
            }`}
          >
            Discover
            {isDiscover && (
              <span className={`absolute bottom-[-14px] left-3 right-3 h-[2px] ${isLanding ? 'bg-white' : 'bg-ink'}`} />
            )}
          </button>
        </nav>
      </div>

      {/* Right: Demo Workspace Caption + "New campaign" Primary Action */}
      <div className="flex items-center gap-4">
        <span className={`hidden sm:inline font-mono text-[11px] uppercase tracking-wider ${
          isLanding ? 'text-white/40' : 'text-ink-3'
        }`}>
          Demo workspace
        </span>

        <button
          onClick={onNewCampaign}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-ctl bg-cobalt hover:bg-cobalt-press text-white text-[13px] font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2"
        >
          <Plus size={15} strokeWidth={2} />
          <span>New campaign</span>
        </button>
      </div>
    </header>
  );
}
