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

  const totalPercent = TOTAL_EMPLOYEES > 0 ? (stats.totalMoved / TOTAL_EMPLOYEES) * 100 : 0;

  return (
    <div
      dir="rtl"
      className="bg-white rounded-2xl shadow-lg p-5 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
        {/* Total Progress */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">התקדמות כללית</span>
            <span className="text-sm font-bold text-gray-900">
              {stats.totalMoved} / {TOTAL_EMPLOYEES} עובדים הועברו
            </span>
          </div>
          {/* Segmented progress bar */}
          <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden flex">
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
          <div className="flex gap-3 mt-2 flex-wrap">
            {stats.phaseProgress.map(phase => (
              <div key={phase.id} className="flex items-center gap-1 text-xs text-gray-500">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: phase.color }}
                />
                <span>{phase.name}</span>
                <span className="font-medium text-gray-700">{phase.moved}/{phase.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day 1 Progress */}
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">יום 1</div>
          <div className="text-2xl font-bold text-blue-800">
            {stats.day1Moved}
            <span className="text-sm font-normal text-blue-500"> / {stats.day1Total}</span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: stats.day1Total > 0
                  ? `${(stats.day1Moved / stats.day1Total) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Day 2 Progress */}
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <div className="text-xs text-amber-600 font-medium mb-1">יום 2</div>
          <div className="text-2xl font-bold text-amber-800">
            {stats.day2Moved}
            <span className="text-sm font-normal text-amber-500"> / {stats.day2Total}</span>
          </div>
          <div className="w-full h-2 bg-amber-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{
                width: stats.day2Total > 0
                  ? `${(stats.day2Moved / stats.day2Total) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Active Phase + SCC Indicator */}
      {stats.activePhase && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">שלב פעיל:</span>
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: stats.activePhase.color }}
            >
              {stats.activePhase.name}
            </span>
            <span className="text-xs text-gray-400">
              {stats.activePhase.moved}/{stats.activePhase.total} הושלמו
            </span>
          </div>

          {stats.activePhase.type === 'scc' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold animate-pulse">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              סיבוב מסונכרן פעיל!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
