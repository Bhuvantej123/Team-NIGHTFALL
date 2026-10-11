import React, { useState } from 'react';
import { TrendingUp, Flame, Info } from 'lucide-react';
import type { CreatorProfile } from '../data/demoData';

interface GrowthEngagementSectionProps {
  creators: CreatorProfile[];
  activeHighlightId: string | null;
}

export const GrowthEngagementSection: React.FC<GrowthEngagementSectionProps> = ({
  creators,
  activeHighlightId,
}) => {
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(5);
  const [timeRange, setTimeRange] = useState<'3M' | '6M'>('6M');

  const monthsAll = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const months = timeRange === '3M' ? monthsAll.slice(3) : monthsAll;
  const startIndex = timeRange === '3M' ? 3 : 0;

  // Chart configuration
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 45;
  const paddingY = 30;

  const allValues = creators.flatMap(c => 
    c.monthlyFollowerGrowth.slice(startIndex).map(m => m.followers)
  );
  const minVal = Math.min(...allValues) * 0.95;
  const maxVal = Math.max(...allValues) * 1.05;

  const getCoordinates = (creatorIndex: number, monthIdxInSlice: number) => {
    const creator = creators[creatorIndex];
    const dataPoint = creator.monthlyFollowerGrowth[startIndex + monthIdxInSlice];
    const x = paddingX + (monthIdxInSlice / (months.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((dataPoint.followers - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, data: dataPoint };
  };

  const creatorColors = [
    { stroke: '#14794A', name: 'Aarav Sharma' },
    { stroke: '#1447FF', name: 'Pooja Varma' },
    { stroke: '#14130F', name: 'Vikram Nair' },
  ];

  return (
    <div className="space-y-6">
      {/* Follower Growth Chart Card */}
      <div className="rounded-card bg-surface border border-line shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
          <div>
            <h3 className="font-display text-2xl text-ink leading-tight">
              Follower Growth Trajectory & Historical Momentum
            </h3>
            <p className="text-[13px] text-ink-2 mt-0.5">
              Verified 6-month subscriber and audience velocity across primary social channels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Timeframe selector */}
            <div className="flex items-center bg-sunken border border-line rounded-ctl p-0.5">
              <button
                onClick={() => setTimeRange('3M')}
                className={`px-3 py-1 rounded-[6px] font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                  timeRange === '3M' ? 'bg-surface text-ink font-semibold shadow-2xs' : 'text-ink-3 hover:text-ink'
                }`}
              >
                Last 3M
              </button>
              <button
                onClick={() => setTimeRange('6M')}
                className={`px-3 py-1 rounded-[6px] font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                  timeRange === '6M' ? 'bg-surface text-ink font-semibold shadow-2xs' : 'text-ink-3 hover:text-ink'
                }`}
              >
                Last 6M
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-4 mb-4 text-xs">
          {creators.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2 font-mono text-[12px]">
              <span 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: creatorColors[i].stroke }} 
              />
              <span className="font-semibold text-ink">{c.name}</span>
              <span className="text-verified font-medium">+{c.growthRate6M}%</span>
            </div>
          ))}
          <span className="font-mono text-[11px] text-ink-3 ml-auto flex items-center gap-1">
            <Info size={12} /> Hover nodes to view monthly delta
          </span>
        </div>

        {/* SVG Interactive Line Chart */}
        <div className="relative bg-sunken/40 rounded-ctl p-3 border border-line overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
              const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
              const labelValue = Math.round((minVal + ratio * (maxVal - minVal)) / 1000);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E4E0D7"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    fill="#6B675E"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {labelValue}k
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {months.map((m, idx) => {
              const x = paddingX + (idx / (months.length - 1)) * (chartWidth - paddingX * 2);
              return (
                <text
                  key={idx}
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill="#4A473F"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {m}
                </text>
              );
            })}

            {/* Draw Paths for each creator */}
            {creators.map((c, creatorIdx) => {
              const coords = months.map((_, mIdx) => getCoordinates(creatorIdx, mIdx));
              const pathD = coords.reduce((acc, pt, idx) => {
                if (idx === 0) return `M ${pt.x} ${pt.y}`;
                const prev = coords[idx - 1];
                const cx1 = prev.x + (pt.x - prev.x) / 2;
                const cx2 = prev.x + (pt.x - prev.x) / 2;
                return `${acc} C ${cx1} ${prev.y}, ${cx2} ${pt.y}, ${pt.x} ${pt.y}`;
              }, '');

              const isHighlighted = activeHighlightId === c.id;

              return (
                <g key={c.id}>
                  {/* High Contrast Stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={creatorColors[creatorIdx].stroke}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Nodes */}
                  {coords.map((pt, mIdx) => {
                    const isHovered = hoveredMonthIndex === (startIndex + mIdx);
                    return (
                      <circle
                        key={mIdx}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5 : 3.5}
                        fill="#FFFFFF"
                        stroke={creatorColors[creatorIdx].stroke}
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredMonthIndex(startIndex + mIdx)}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Vertical crosshair line on hovered month */}
            {hoveredMonthIndex !== null && hoveredMonthIndex >= startIndex && (
              <line
                x1={paddingX + ((hoveredMonthIndex - startIndex) / (months.length - 1)) * (chartWidth - paddingX * 2)}
                y1={paddingY}
                x2={paddingX + ((hoveredMonthIndex - startIndex) / (months.length - 1)) * (chartWidth - paddingX * 2)}
                y2={chartHeight - paddingY}
                stroke="#1447FF"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </div>

        {/* Hover Snapshot Card */}
        {hoveredMonthIndex !== null && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-sunken/60 p-3 rounded-ctl border border-line">
            {creators.map((c, i) => {
              const pt = c.monthlyFollowerGrowth[hoveredMonthIndex];
              return (
                <div key={c.id} className="flex items-center justify-between text-xs p-2.5 rounded-ctl bg-surface border border-line">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: creatorColors[i].stroke }} />
                    <span className="font-ui font-semibold text-ink">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-ink text-[13px] tnum">
                      {(pt.followers / 1000).toFixed(1)}k
                    </div>
                    <div className="font-mono text-[10px] text-verified font-medium">
                      +{pt.gain.toLocaleString()} in {pt.month}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Engagement & Benchmark Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {creators.map((creator) => (
          <div key={creator.id} className="p-5 rounded-card bg-surface border border-line shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-line">
              <span className="font-ui font-semibold text-[15px] text-ink">{creator.name}</span>
              <span className="font-mono text-[11px] text-ink-3 uppercase">Activity Index</span>
            </div>

            <div className="bg-sunken/60 p-4 rounded-ctl border border-line mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] text-ink-2">Avg Engagement Rate</span>
                <span className="font-mono text-2xl font-bold text-ink tnum">
                  {creator.avgEngagement}%
                </span>
              </div>

              {/* Benchmark comparison bar */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-ink-2 font-mono">
                  <span>Rate:</span>
                  <span className="text-verified font-semibold">{creator.avgEngagement}%</span>
                </div>
                <div className="h-2 w-full bg-line rounded-[2px] overflow-hidden">
                  <div 
                    className="h-full bg-cobalt rounded-[2px]"
                    style={{ width: `${Math.min(100, (creator.avgEngagement / 10) * 100)}%` }}
                  />
                </div>

                <div className="flex justify-between font-mono text-ink-3 text-[10px] pt-1">
                  <span>Benchmark: 3.2%</span>
                  <span className="text-cobalt font-semibold">
                    +{(creator.avgEngagement - 3.2).toFixed(1)}% vs industry
                  </span>
                </div>
              </div>
            </div>

            {/* Platform breakdowns */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-3 block">
                Channel Distribution
              </span>
              {creator.platforms.map((p) => (
                <div 
                  key={p.name}
                  className="flex items-center justify-between p-2 rounded-ctl bg-surface border border-line text-[12px]"
                >
                  <span className="font-ui font-medium text-ink">{p.name}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-ink-3">{(p.followers / 1000).toFixed(0)}k</span>
                    <span className="text-line-strong">·</span>
                    <span className="font-semibold text-verified">{p.engagement}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
