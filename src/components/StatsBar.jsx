import React, { useMemo } from 'react';

const TOTAL_EMPLOYEES = 112;

export default function StatsBar({ employees, movedSet, phases }) {
  const stats = useMemo(() => {
    const totalMoved = movedSet.size;

    // Day-based stats
    const day1Phases = phases.filter(p => p.day === 1);
    const day2Phases = phases.filter(p => p.day === 2);

    const day1PhaseIds = new Set(day1Phases.map(p => p.id));
    const day2PhaseIds = new Set(day2Phases.map(p => p.id));

    const day1Employees = employees.filter(e => day1PhaseIds.has(e.phase));
    const day2Employees = employees.filter(e => day2PhaseIds.has(e.phase));

    const day1Moved = day1Employees.filter(e => movedSet.has(e.id)).length;
    const day2Moved = day2Employees.filter(e => movedSet.has(e.id)).length;

    // Phase progress for segmented bar
    const phaseProgress = phases.map(phase => {
      const phaseEmployees = employees.filter(e => e.phase === phase.id);
      const phaseMoved = phaseEmployees.filter(e => movedSet.has(e.id)).length;
      return {
        ...phase,
        total: phaseEmployees.length,
        moved: phaseMoved,
        complete: phaseMoved === phaseEmployees.length && phaseEmployees.length > 0,
      };
    });

    // First incomplete phase is the active one
    const activePhase = phaseProgress.find(p => !p.complete) || phaseProgress[phaseProgress.length - 1];

    return {
      totalMoved,
      day1Total: day1Employees.length,
      day1Moved,
      day2Total: day2Employees.length,
      day2Moved,
      phaseProgress,
      activePhase,
    };
  }, [employees, movedSet, phases]);

  return (
    <div
      dir="rtl"
      className="bg-white border border-gray-200 rounded-xl p-5 mb-6"
    >
      {/* Main stat + day stats — single row */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums text-gray-900">
            {stats.totalMoved} / {TOTAL_EMPLOYEES}
          </span>
          <span className="text-sm text-gray-400">הועברו</span>
        </div>

        <div className="flex items-baseline gap-4">
          <span className="text-sm text-gray-500 tabular-nums">
            יום א': {stats.day1Moved}/{stats.day1Total}
          </span>
          <span className="text-sm text-gray-500 tabular-nums">
            יום ב': {stats.day2Moved}/{stats.day2Total}
          </span>
        </div>
      </div>

      {/* Segmented progress bar — thin */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
        {stats.phaseProgress.map(phase => {
          const segmentWidth = TOTAL_EMPLOYEES > 0
            ? (phase.moved / TOTAL_EMPLOYEES) * 100
            : 0;
          if (segmentWidth === 0) return null;
          return (
            <div
              key={phase.id}
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${segmentWidth}%`,
                backgroundColor: phase.color,
              }}
              title={`${phase.name}: ${phase.moved}/${phase.total}`}
            />
          );
        })}
      </div>

      {/* Active phase + SCC indicator — plain text */}
      {stats.activePhase && (
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-gray-500">
            שלב פעיל: {stats.activePhase.name}
            <span className="text-gray-400 mr-1 tabular-nums">
              ({stats.activePhase.moved}/{stats.activePhase.total})
            </span>
          </span>

          {stats.activePhase.type === 'scc' && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              סיבוב מסונכרן פעיל
            </span>
          )}
        </div>
      )}
    </div>
  );
}
