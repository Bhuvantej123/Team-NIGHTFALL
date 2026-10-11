import React from 'react';
import { Plus } from 'lucide-react';
import { ColophonLockup } from '../common/BrandLogo';

/**
 * TopBar: 64px
 * @param {{
 *   currentRoute?: string;
 *   onNavigate?: (route: string) => void;
 *   onNewCampaign?: () => void;
 * }} props
 */
export function TopBar({
  currentRoute = '/discover',
  onNavigate = (_route) => {},
  onNewCampaign = undefined,
}) {
  const isCampaigns = currentRoute === '/campaigns' || (currentRoute && currentRoute.startsWith('/campaigns/'));
  const isDiscover = currentRoute === '/discover' || (currentRoute && currentRoute.startsWith('/creators/'));

  return (
    <header className="sticky top-0 z-40 h-16 w-full px-6 flex items-center justify-between select-none transition-colors duration-300 bg-paper border-b border-line text-ink">
      {/* Left: Brand Lockup & Main Navigation */}
      <div className="flex items-center gap-8">
        <ColophonLockup dark={false} onClick={() => onNavigate?.('/')} />

        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate?.('/discover')}
            className={`relative px-3 py-1.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-ctl cursor-pointer ${
              isDiscover
                ? 'text-ink font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            Discover Creators
            {isDiscover && (
              <span className="absolute bottom-[-14px] left-3 right-3 h-[2px] bg-ink" />
            )}
          </button>

          <button
            onClick={() => onNavigate?.('/campaigns')}
            className={`relative px-3 py-1.5 text-[14px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-ctl cursor-pointer ${
              isCampaigns
                ? 'text-ink font-semibold'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            Campaigns
            {isCampaigns && (
              <span className="absolute bottom-[-14px] left-3 right-3 h-[2px] bg-ink" />
            )}
          </button>
        </nav>
      </div>

      {/* Right: Status pill + New campaign action */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-ink-3">
          CreatorConnect AI Workspace
        </span>

        {onNewCampaign && (
          <button
            onClick={onNewCampaign}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-ctl bg-ink hover:bg-ink/85 text-surface text-[13px] font-medium transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2} />
            <span>New campaign</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default TopBar;
