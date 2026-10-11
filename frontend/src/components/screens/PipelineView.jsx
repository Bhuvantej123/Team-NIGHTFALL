import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Check, Clock, Eye, Send, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_PIPELINE = {
  invited: [
    { id: 'p-inv-1', handle: 'beauty.folk', name: 'Aarya Sengupta', status: 'sent', avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'p-inv-2', handle: 'melo.vibes', name: 'Kabir Mehta', status: 'sent', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'p-inv-8', handle: 'glamor.glow', name: 'Zara D’Souza', status: 'accepted', avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'p-inv-9', handle: 'karo.ulidou', name: 'Karolina Ulidou', status: 'accepted', avatar: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=120&h=120&q=80' },
  ],
  waitlisted: [
    { id: 'p-wait-1', handle: 'chrisdemantis', name: 'Chris Demantis', status: 'waitlist', avatar: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&h=120&q=80' },
  ],
  progress: [
    {
      id: 'p-prog-1',
      handle: 'glamor.glow',
      deliverables: ['1 carousel', '1 story'],
      status: 'posted',
      thumbnails: [
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=160&h=160&q=80',
      ],
      avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ],
};

/**
 * PipelineView
 * Visual stage tracking view for campaign creators
 */
export function PipelineView({
  campaign,
  onBack,
  onSelectCreator = (_c) => {},
}) {
  const [activeSubTab, setActiveSubTab] = useState('Outreach');
  const [invitedList, setInvitedList] = useState(DEFAULT_PIPELINE.invited);
  const [waitlistList, setWaitlistList] = useState(DEFAULT_PIPELINE.waitlisted);
  const [progressList, setProgressList] = useState(DEFAULT_PIPELINE.progress);

  const acceptedCount = invitedList.filter((c) => c.status === 'accepted').length;
  const invitedCount = invitedList.length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6 pb-28">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-surface border border-line hover:border-line-strong flex items-center justify-center text-ink transition-colors cursor-pointer"
            title="Back to matches calibration"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              {campaign?.title || 'Campaign Production Pipeline'}
            </h1>
            <p className="font-mono text-[11px] text-ink-3 uppercase tracking-wider">
              PRODUCTION TIMELINE · {campaign?.brandName || 'CLIENT'}
            </p>
          </div>
        </div>

        {/* Subnav Tabs */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-full border border-line shadow-2xs">
          {['Outreach', 'Content', 'Results', 'Messages'].map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-ink text-surface shadow-2xs'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="p-4 rounded-card bg-surface border border-line shadow-2xs flex flex-wrap items-center justify-between gap-4 font-mono text-[12px]">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-ink-3">INVITED: </span>
            <span className="font-semibold text-ink">{invitedCount}</span>
          </div>
          <div>
            <span className="text-ink-3">ACCEPTED: </span>
            <span className="font-semibold text-verified">{acceptedCount}</span>
          </div>
          <div>
            <span className="text-ink-3">IN PROGRESS: </span>
            <span className="font-semibold text-ink">{progressList.length}</span>
          </div>
        </div>

        <span className="text-[11px] text-ink-3 uppercase">Escrow Pipeline Active</span>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Creator Roster */}
        <div className="space-y-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 font-semibold block">
            INVITED CREATORS ({invitedList.length})
          </span>
          <div className="space-y-3">
            {invitedList.map((creator) => (
              <div
                key={creator.id}
                className="p-4 rounded-ctl bg-surface border border-line flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-line bg-sunken flex-shrink-0">
                    <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-[14px] text-ink">{creator.name}</div>
                    <div className="font-mono text-[11px] text-ink-3">@{creator.handle}</div>
                  </div>
                </div>

                <span
                  className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[2px] font-medium border ${
                    creator.status === 'accepted'
                      ? 'bg-verified/10 text-verified border-verified/30'
                      : 'bg-sunken text-ink-3 border-line'
                  }`}
                >
                  {creator.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: In-Flight Deliverables */}
        <div className="space-y-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3 font-semibold block">
            PRODUCTION DELIVERABLES ({progressList.length})
          </span>
          <div className="space-y-3">
            {progressList.map((prog) => (
              <div
                key={prog.id}
                className="p-4 rounded-ctl bg-surface border border-line space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-[13px] text-ink">@{prog.handle}</div>
                  <span className="font-mono text-[10px] bg-verified/10 text-verified px-2 py-0.5 rounded-[2px] uppercase">
                    {prog.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {prog.deliverables.map((deliv, idx) => (
                    <span key={idx} className="font-mono text-[11px] bg-sunken px-2 py-0.5 rounded-[2px] text-ink border border-line">
                      {deliv}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PipelineView;
