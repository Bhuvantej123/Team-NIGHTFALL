import React from 'react';

/**
 * Workflow Strip:
 * A horizontal chain of steps (e.g. Prompt, Generate, Upscale, Edit, Final).
 * Human steps are filled Ink; Model steps are outlined hairline.
 */
export function WorkflowStrip({ steps = [], dark = false, compact = false, className = '' }) {
  const defaultSteps = [
    { name: 'Prompt', type: 'human', tool: 'Human Directed' },
    { name: 'Generate', type: 'model', tool: 'Midjourney V7' },
    { name: 'Upscale', type: 'model', tool: 'Magnific AI' },
    { name: 'Composite', type: 'human', tool: 'Photoshop' },
    { name: 'Color Grade', type: 'human', tool: 'Lightroom' },
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {activeSteps.map((step, idx) => {
          const isHuman = step.type === 'human';
          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center flex-shrink-0 group">
                <div
                  className={`w-6 h-6 rounded-[3px] flex items-center justify-center font-mono text-[9px] font-semibold transition-all ${
                    isHuman
                      ? dark
                        ? 'bg-stage-ink text-stage'
                        : 'bg-ink text-surface'
                      : dark
                      ? 'border border-stage-line text-stage-ink-2 bg-stage-raised'
                      : 'border border-line-strong text-ink-2 bg-surface'
                  }`}
                  title={`${step.name} (${step.tool} - ${isHuman ? 'Human' : 'Model'})`}
                >
                  {idx + 1}
                </div>
                {!compact && (
                  <span
                    className={`mt-1 font-mono text-[9.5px] uppercase tracking-wider text-center max-w-[56px] truncate ${
                      dark ? 'text-stage-ink-2' : 'text-ink-3'
                    }`}
                  >
                    {step.name}
                  </span>
                )}
              </div>

              {idx < activeSteps.length - 1 && (
                <div
                  className={`h-[1px] w-3 flex-shrink-0 mb-auto mt-3 ${
                    dark ? 'bg-stage-line' : 'bg-line'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!compact && (
        <div
          className={`flex items-center gap-4 text-[10px] font-mono tracking-wider uppercase ${
            dark ? 'text-stage-ink-2' : 'text-ink-3'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-[2px] ${
                dark ? 'bg-stage-ink' : 'bg-ink'
              }`}
            />
            <span>Human step</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-[2px] border ${
                dark ? 'border-stage-line' : 'border-line-strong'
              }`}
            />
            <span>Model step</span>
          </div>
        </div>
      )}
    </div>
  );
}
