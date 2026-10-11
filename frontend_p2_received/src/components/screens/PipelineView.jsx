import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Check, Clock, Eye, Send, AlertCircle } from 'lucide-react';
import { PIPELINE_CREATORS } from '../../data/briefs';
import { CropMarks } from '../common/CropMarks';
import { formatRupees } from '../../utils/formatters';

/**
 * PipelineView (Direct Implementation of User Reference Image 8: "Monthly campaign")
 * Featuring:
 * - Subnav tabs: Outreach (active pill), Content, Results, Messages ·
 * - Pipeline scrub track: 14 Invited | 4 Waitlisted | [ONBOARDING → POSTING] scrubber | 7 Accepted | 1 Declined
 * - Left column: Invited creator cards with status pills (Sent, Viewed, Accepted, Declined) & Waitlisted section
 * - Right column: Progress cards with live deliverable badges (1 carousel, 1 story, 2 reels, 0 post yet) and post thumbnails
 * - Strictly in Colophon editorial theme: Paper #F4F2ED, Ink #14130F, Cobalt #1447FF, Geist UI & Mono.
 */
export function PipelineView({
  campaign,
  onBack,
  onSelectCreator,
  onToggleTab,
}) {
  const [activeSubTab, setActiveSubTab] = useState('Outreach'); // 'Outreach', 'Content', 'Results', 'Messages'
  const [pipelineRatio, setPipelineRatio] = useState(55); // percentage for scrubber divider
  const [invitedList, setInvitedList] = useState(PIPELINE_CREATORS.invited);
  const [waitlistList, setWaitlistList] = useState(PIPELINE_CREATORS.waitlisted);
  const [progressList, setProgressList] = useState(PIPELINE_CREATORS.progress);
  const [waitlistDropdownOpen, setWaitlistDropdownOpen] = useState(null);

  const acceptedCount = invitedList.filter((c) => c.status === 'accepted').length;
  const declinedCount = invitedList.filter((c) => c.status === 'declined').length;
  const invitedCount = invitedList.length;
  const waitlistCount = waitlistList.length;

  const handlePromoteWaitlist = (creatorId) => {
    const creator = waitlistList.find((c) => c.id === creatorId);
    if (!creator) return;
    setWaitlistList(waitlistList.filter((c) => c.id !== creatorId));
    setInvitedList([
      ...invitedList,
      { ...creator, status: 'sent' },
    ]);
    setWaitlistDropdownOpen(null);
  };

  const handleSendReminder = (progId) => {
    setProgressList(
      progressList.map((p) =>
        p.id === progId ? { ...p, actionLabel: 'Reminder queued' } : p
      )
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6 pb-28">
      {/* Top Header Row matching Image 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Back arrow + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-surface border border-line hover:border-line-strong flex items-center justify-center text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            title="Back to matches calibration"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
              {campaign?.title || 'Monthly campaign'}
            </h1>
            <p className="font-mono text-[11px] text-ink-3 uppercase tracking-wider">
              CAMPAIGN PIPELINE & PRODUCTION TIMELINE · {campaign?.brandName || 'VELO-STRIDE'}
            </p>
          </div>
        </div>

        {/* Subnav Tabs: Outreach, Content, Results, Messages */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-full border border-line shadow-sm">
          {['Outreach', 'Content', 'Results', 'Messages'].map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-ink text-surface shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Messages' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cobalt ml-1.5 -translate-y-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Pipeline Metrics Ribbon matching Image 8 */}
      <div className="bg-surface rounded-card border border-line p-4 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* 14 Invited */}
          <div className="lg:col-span-2 flex items-center gap-2 px-3 py-2 rounded-ctl bg-[#EEF8F1] border border-[#CDEED5]">
            <span className="font-mono text-2xl font-bold text-[#1F7A40] tnum">
              {invitedCount}
            </span>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F7A40]">
              <span className="block font-semibold">Invited</span>
              <span className="text-[9px] text-[#1F7A40]/80">Outreach live</span>
            </div>
          </div>

          {/* 4 Waitlisted */}
          <div className="lg:col-span-2 flex items-center gap-2 px-3 py-2 rounded-ctl bg-[#F7EEFA] border border-[#EBD0F2]">
            <span className="font-mono text-2xl font-bold text-[#7A2885] tnum">
              {waitlistCount}
            </span>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#7A2885]">
              <span className="block font-semibold">Waitlisted</span>
              <span className="text-[9px] text-[#7A2885]/80">Reserve bench</span>
            </div>
          </div>

          {/* Center Pipeline Scrub Track: ONBOARDING -> POSTING */}
          <div className="lg:col-span-4 px-2 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-ink-3 uppercase tracking-wider">
              <span className="font-semibold text-ink">ONBOARDING ({pipelineRatio}%)</span>
              <span className="font-semibold text-verified">POSTING ({100 - pipelineRatio}%)</span>
            </div>

            <div className="relative w-full h-7 rounded-ctl bg-sunken overflow-hidden border border-line flex items-center p-1">
              {/* Onboarding segment */}
              <div
                className="h-full rounded-[4px] bg-[#E1F3EA] border border-[#BCE4CF] flex items-center justify-center transition-all duration-300"
                style={{ width: `${pipelineRatio}%` }}
              >
                <span className="font-mono text-[9px] text-[#1F7A40] uppercase font-semibold tracking-wider truncate px-1">
                  ONBOARDING
                </span>
              </div>

              {/* Scrubber divider line & diamond handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize flex items-center justify-center -translate-x-1/2 group"
                style={{ left: `${pipelineRatio}%` }}
                title="Drag to simulate milestone transition"
                onClick={() => setPipelineRatio(pipelineRatio > 50 ? 40 : 65)}
              >
                <div className="w-2.5 h-2.5 rotate-45 bg-amber-500 border border-white shadow-sm" />
              </div>

              {/* Posting segment */}
              <div
                className="h-full rounded-[4px] bg-[#EAF7D8] border border-[#C8E99F] flex items-center justify-center transition-all duration-300"
                style={{ width: `${100 - pipelineRatio}%` }}
              >
                <span className="font-mono text-[9px] text-[#43750F] uppercase font-semibold tracking-wider truncate px-1">
                  POSTING
                </span>
              </div>
            </div>
          </div>

          {/* 7 Accepted */}
          <div className="lg:col-span-2 flex items-center gap-2 px-3 py-2 rounded-ctl bg-[#EEF8F1] border border-[#CDEED5]">
            <span className="font-mono text-2xl font-bold text-[#1F7A40] tnum">
              {acceptedCount}
            </span>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#1F7A40]">
              <span className="block font-semibold">Accepted</span>
              <span className="text-[9px] text-[#1F7A40]/80">Confirmed deals</span>
            </div>
          </div>

          {/* 1 Declined */}
          <div className="lg:col-span-2 flex items-center gap-2 px-3 py-2 rounded-ctl bg-[#FDEEED] border border-[#F9CFCB]">
            <span className="font-mono text-2xl font-bold text-[#A6261D] tnum">
              {declinedCount}
            </span>
            <div className="font-mono text-[11px] uppercase tracking-wider text-[#A6261D]">
              <span className="block font-semibold">Declined</span>
              <span className="text-[9px] text-[#A6261D]/80">Schedule clash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout matching Image 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Image 8: "Invited" 2-subcolumn list + "Waitlisted" section) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Section 1: Invited */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="font-display text-2xl text-ink flex items-center gap-2">
                <span>Invited</span>
                <span className="font-mono text-[13px] text-ink-3">({invitedList.length})</span>
              </h2>
              <span className="font-mono text-[11px] text-ink-3">REALTIME OUTREACH STATUS</span>
            </div>

            {/* 2-Column Grid of Invited Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {invitedList.map((c) => {
                const statusStyles = {
                  sent: 'bg-sunken text-ink-2 border-line',
                  viewed: 'bg-cobalt-tint text-cobalt border-cobalt/20',
                  accepted: 'bg-[#EEF8F1] text-[#1F7A40] border-[#CDEED5]',
                  declined: 'bg-[#FDEEED] text-[#A6261D] border-[#F9CFCB]',
                };

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCreator?.(c)}
                    className="p-3 bg-surface rounded-ctl border border-line hover:border-line-strong transition-all flex items-center justify-between gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={c.avatar}
                        alt={c.handle}
                        className="w-8 h-8 rounded-full object-cover border border-line flex-shrink-0"
                      />
                      <div className="min-w-0 truncate">
                        <span className="font-mono text-[12px] font-medium text-ink group-hover:text-cobalt block truncate">
                          {c.handle}
                        </span>
                        <span className="text-[11px] text-ink-3 truncate block">
                          {c.name}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill on Right */}
                    <span
                      className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-[4px] border flex-shrink-0 ${
                        statusStyles[c.status] || 'bg-sunken text-ink-2'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Waitlisted */}
          <div className="space-y-3 pt-4 border-t border-line">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-ink flex items-center gap-2">
                <span>Waitlisted</span>
                <span className="font-mono text-[12px] text-ink-3">({waitlistList.length})</span>
              </h3>
              <span className="font-mono text-[10px] text-ink-3">AVAILABLE FOR INSTANT PROMOTION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {waitlistList.map((w) => (
                <div
                  key={w.id}
                  className="p-3 bg-surface rounded-ctl border border-line flex items-center justify-between gap-2 shadow-2xs relative"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={w.avatar}
                      alt={w.handle}
                      className="w-8 h-8 rounded-full object-cover border border-line flex-shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <span className="font-mono text-[12px] font-medium text-ink block truncate">
                        {w.handle}
                      </span>
                      <span className="text-[11px] text-ink-3 truncate block">
                        {w.name}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setWaitlistDropdownOpen(
                          waitlistDropdownOpen === w.id ? null : w.id
                        )
                      }
                      className="flex items-center gap-1 font-mono text-[10px] uppercase font-semibold px-2.5 py-1 rounded-[4px] bg-[#F7EEFA] text-[#7A2885] border border-[#EBD0F2] hover:bg-[#F0DEFA] transition-colors"
                    >
                      <span>Waitlist</span>
                      <ChevronDown size={11} />
                    </button>

                    {waitlistDropdownOpen === w.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-surface rounded-ctl border border-line-strong shadow-lg p-1 z-30 space-y-1">
                        <button
                          onClick={() => handlePromoteWaitlist(w.id)}
                          className="w-full text-left px-2.5 py-1.5 text-[11px] font-mono text-ink hover:bg-sunken rounded-[3px] flex items-center gap-1.5"
                        >
                          <Send size={11} className="text-cobalt" />
                          <span>Send Invitation</span>
                        </button>
                        <button
                          onClick={() => setWaitlistDropdownOpen(null)}
                          className="w-full text-left px-2.5 py-1.5 text-[11px] font-mono text-ink-3 hover:bg-sunken rounded-[3px]"
                        >
                          Keep in Reserve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Image 8: "Progress" cards with deliverable tags and live post thumbnails) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="font-display text-2xl text-ink flex items-center gap-2">
              <span>Progress</span>
              <span className="font-mono text-[13px] text-ink-3">({progressList.length})</span>
            </h2>
            <span className="font-mono text-[11px] text-ink-3">LIVE PROOFS & POSTING MILESTONES</span>
          </div>

          <div className="space-y-3">
            {progressList.map((prog) => {
              const hasDeliverables = prog.deliverables && prog.deliverables.length > 0;

              return (
                <div
                  key={prog.id}
                  className="p-4 bg-surface rounded-card border border-line hover:border-line-strong transition-all flex items-center justify-between gap-4 shadow-sm"
                >
                  {/* Left: Avatar + handle */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prog.avatar}
                      alt={prog.handle}
                      className="w-9 h-9 rounded-full object-cover border border-line flex-shrink-0"
                    />
                    <div>
                      <span className="font-mono text-[13px] font-semibold text-ink block truncate">
                        {prog.handle}
                      </span>
                      <span className="font-mono text-[10px] text-ink-3 uppercase">
                        {hasDeliverables ? 'CONTENT SUBMITTED' : 'PRODUCTION IN FLIGHT'}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Deliverables tags or reminder notice */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {hasDeliverables ? (
                      prog.deliverables.map((deliv, dIdx) => (
                        <span
                          key={dIdx}
                          className="font-mono text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#EEF8F1] text-[#1F7A40] border border-[#CDEED5]"
                        >
                          {deliv}
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#A6261D] font-medium">
                          {prog.postCount}
                        </span>
                        <button
                          onClick={() => handleSendReminder(prog.id)}
                          className="font-mono text-[10px] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#FFF4E5] text-[#B76E00] border border-[#FFE2B8] hover:bg-[#FFECC9] transition-colors"
                        >
                          {prog.actionLabel}
                        </button>
                      </div>
                    )}

                    {/* Right: Media Post Thumbnails side-by-side */}
                    {prog.thumbnails && prog.thumbnails.length > 0 && (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-line/60">
                        {prog.thumbnails.map((thumb, tIdx) => (
                          <div
                            key={tIdx}
                            className="w-10 h-10 rounded-[4px] overflow-hidden bg-stage border border-line flex-shrink-0 relative group/thumb cursor-pointer"
                            title="Click to view full resolution proof"
                          >
                            <img
                              src={thumb}
                              alt="Proof preview"
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover/thumb:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
