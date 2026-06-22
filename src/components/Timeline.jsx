import React, { useState, useMemo, useRef, useEffect } from 'react';

/* ────────────────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────────────────── */

const HOUR_START = 8;
const HOUR_END = 17;
const HOURS = HOUR_END - HOUR_START; // 9 hours
const PX_PER_HOUR = 60;
const TIMELINE_HEIGHT = HOURS * PX_PER_HOUR; // 540px

const DAY_LABELS = {
  1: "יום א' — 28.06.2026",
  2: "יום ב' — 29.06.2026",
};

/* Hardcoded phase time ranges (phase id -> "HH:MM-HH:MM") */
const PHASE_TIMES = {
  1: '08:00-09:30',
  2: '09:30-10:30',
  3: '10:30-11:30',
  4: '12:00-13:30',
  5: '08:00-09:00',
  6: '09:00-10:00',
  7: '10:00-11:00',
  8: '11:00-13:00',
  9: '13:00-14:00',
  10: '14:00-15:00',
  11: '15:00-15:30',
};

/* Dependency chains */
const DEPENDENCIES = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
];

/* ────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────── */

function parseTime(timeStr) {
  // "08:00-09:30" -> { start: 8.0, end: 9.5 }
  const [s, e] = timeStr.split('-');
  const [sh, sm] = s.split(':').map(Number);
  const [eh, em] = e.split(':').map(Number);
  return { start: sh + sm / 60, end: eh + em / 60 };
}

function hourToY(hour) {
  return (hour - HOUR_START) * PX_PER_HOUR;
}

function hexToRgb(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function isNowInRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  const d = now.getDate();
  return y === 2026 && m === 5 && (d === 28 || d === 29);
}

function getNowPosition() {
  const now = new Date();
  const d = now.getDate();
  const hour = now.getHours() + now.getMinutes() / 60;
  if (hour < HOUR_START || hour > HOUR_END) return null;
  return { day: d === 28 ? 1 : 2, y: hourToY(hour) };
}

/* ────────────────────────────────────────────────────────
   Sub-components
   ──────────────────────────────────────────────────────── */

function StatusDot({ status }) {
  const styles = {
    locked: 'bg-gray-300',
    ready: 'bg-gray-300',
    in_progress: 'bg-amber-400',
    complete: 'bg-green-500',
  };
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${styles[status] || 'bg-gray-300'}`}
    />
  );
}

/* ────────────────────────────────────────────────────────
   PhaseBar — a single phase on the timeline
   ──────────────────────────────────────────────────────── */

function PhaseBar({
  phase,
  employees,
  movedSet,
  getPhaseStatus,
  onSelectEmployee,
  timeRange,
  expanded,
  onToggleExpand,
}) {
  const top = hourToY(timeRange.start);
  const height = (timeRange.end - timeRange.start) * PX_PER_HOUR;
  const status = getPhaseStatus(phase.id);
  const phaseEmployees = employees.filter((e) => e.phase === phase.id);
  const movedCount = phaseEmployees.filter((e) => movedSet.has(e.id)).length;
  const totalCount = phaseEmployees.length;
  const progressPct = totalCount > 0 ? (movedCount / totalCount) * 100 : 0;
  const isSCC = phase.type === 'scc';

  const { r, g, b } = hexToRgb(phase.color);
  const bgColor = `rgba(${r}, ${g}, ${b}, 0.15)`;

  return (
    <div
      className="absolute inset-x-2 rounded-md overflow-visible cursor-pointer transition-colors group"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 32)}px`,
        backgroundColor: bgColor,
        borderRight: `3px solid ${phase.color}`,
      }}
      onClick={() => onToggleExpand(phase.id)}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 px-3 h-full min-h-[32px]">
        <StatusDot status={status} />

        {isSCC && (
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: '#a855f7' }}
          />
        )}

        <span className="text-xs font-medium text-gray-700 truncate">
          {phase.name}
        </span>

        <span className="text-[10px] text-gray-400 whitespace-nowrap mr-auto">
          {movedCount}/{totalCount} הועברו
        </span>
      </div>

      {/* Progress fill — thin bar at bottom */}
      <div className="absolute bottom-0 right-0 left-0 h-1 rounded-b-md overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-b-md"
          style={{
            width: `${progressPct}%`,
            backgroundColor: phase.color,
            opacity: 0.6,
          }}
        />
      </div>

      {/* Expanded employee list */}
      {expanded && phaseEmployees.length > 0 && (
        <div
          className="absolute right-0 left-0 z-30 bg-white rounded-b-xl border border-gray-200 p-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto"
          style={{ top: `${Math.max(height, 32)}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {phaseEmployees.map((emp) => {
            const isMoved = movedSet.has(emp.id);
            return (
              <button
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  isMoved
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>
                  {emp.first} {emp.last}
                </span>
                {emp.dept && (
                  <span className="text-[10px] opacity-60">{emp.dept}</span>
                )}
                {isMoved && (
                  <svg className="w-3 h-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   DayColumn — a single day on the Gantt chart
   ──────────────────────────────────────────────────────── */

function DayColumn({
  day,
  label,
  phases,
  employees,
  movedSet,
  getPhaseStatus,
  onSelectEmployee,
  dimmed,
  expandedPhaseId,
  onToggleExpand,
}) {
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) {
    hours.push(h);
  }

  return (
    <div
      data-day={day}
      className={`flex-1 min-w-[280px] border border-gray-200 rounded-xl transition-opacity duration-300 ${
        dimmed ? 'opacity-30' : ''
      }`}
    >
      {/* Day header */}
      <div className="bg-gray-50 rounded-t-xl px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>

      {/* Timeline body */}
      <div className="relative flex" style={{ height: `${TIMELINE_HEIGHT}px` }}>
        {/* Time axis */}
        <div className="w-12 shrink-0 relative border-l border-gray-200">
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-0 left-0 flex items-center justify-center"
              style={{ top: `${hourToY(h)}px` }}
            >
              <span className="text-xs text-gray-300 font-mono leading-none">
                {String(h).padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Phase bars area */}
        <div className="flex-1 relative">
          {/* Horizontal grid lines */}
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-0 left-0 border-t border-gray-100"
              style={{ top: `${hourToY(h)}px` }}
            />
          ))}

          {/* Vertical dependency lines (same-day) */}
          <svg
            className="absolute inset-0 w-full pointer-events-none z-[1]"
            style={{ height: `${TIMELINE_HEIGHT}px` }}
          >
            {DEPENDENCIES.filter(([fromId, toId]) => {
              const fromPhase = phases.find((p) => p.id === fromId);
              const toPhase = phases.find((p) => p.id === toId);
              return fromPhase && toPhase && fromPhase.day === day && toPhase.day === day;
            }).map(([fromId, toId], i) => {
              const fromTime = PHASE_TIMES[fromId];
              const toTime = PHASE_TIMES[toId];
              if (!fromTime || !toTime) return null;
              const fromRange = parseTime(fromTime);
              const toRange = parseTime(toTime);
              const y1 = hourToY(fromRange.end);
              const y2 = hourToY(toRange.start);
              if (y2 <= y1) return null;
              return (
                <line
                  key={i}
                  x1="50%"
                  y1={y1}
                  x2="50%"
                  y2={y2}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          {/* Phase bars */}
          {phases
            .filter((p) => p.day === day)
            .map((phase) => {
              const timeStr = PHASE_TIMES[phase.id];
              if (!timeStr) return null;
              const timeRange = parseTime(timeStr);
              return (
                <PhaseBar
                  key={phase.id}
                  phase={phase}
                  employees={employees}
                  movedSet={movedSet}
                  getPhaseStatus={getPhaseStatus}
                  onSelectEmployee={onSelectEmployee}
                  timeRange={timeRange}
                  expanded={expandedPhaseId === phase.id}
                  onToggleExpand={onToggleExpand}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Timeline — main export
   ──────────────────────────────────────────────────────── */

export default function Timeline({
  employees,
  phases,
  movedSet,
  onSelectEmployee,
  getPhaseStatus,
  dayFilter,
}) {
  const containerRef = useRef(null);
  const dayColumnRefs = useRef({});
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);

  const handleToggleExpand = (phaseId) => {
    setExpandedPhaseId((prev) => (prev === phaseId ? null : phaseId));
  };

  const showNow = useMemo(() => isNowInRange(), []);
  const nowPos = useMemo(() => (showNow ? getNowPosition() : null), [showNow]);

  return (
    <div dir="rtl" className="space-y-4">
      {/* Timeline container */}
      <div
        ref={containerRef}
        className="bg-white border border-gray-200 rounded-xl p-6"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-5">ציר זמן — מעבר משרדים</h3>

        {/* Day columns */}
        <div className="flex flex-col md:flex-row gap-5 relative">
          <DayColumn
            day={1}
            label={DAY_LABELS[1]}
            phases={phases}
            employees={employees}
            movedSet={movedSet}
            getPhaseStatus={getPhaseStatus}
            onSelectEmployee={onSelectEmployee}
            dimmed={dayFilter === 2}
            expandedPhaseId={expandedPhaseId}
            onToggleExpand={handleToggleExpand}
          />

          {/* Cross-day dependency line */}
          <div className="hidden md:flex items-center justify-center w-8 shrink-0 relative">
            <svg className="w-full" style={{ height: `${TIMELINE_HEIGHT}px` }}>
              {(() => {
                // Find cross-day dependency: Phase 4 (day1) -> Phase 5 (day2)
                const fromTime = PHASE_TIMES[4];
                const toTime = PHASE_TIMES[5];
                if (!fromTime || !toTime) return null;
                const fromRange = parseTime(fromTime);
                const toRange = parseTime(toTime);
                const headerOffset = 44;
                const y1 = headerOffset + hourToY(fromRange.end);
                const y2 = headerOffset + hourToY(toRange.start);
                return (
                  <path
                    d={`M 0 ${y1} C 16 ${(y1 + y2) / 2}, 16 ${(y1 + y2) / 2}, 32 ${y2}`}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    fill="none"
                  />
                );
              })()}
            </svg>
          </div>

          <DayColumn
            day={2}
            label={DAY_LABELS[2]}
            phases={phases}
            employees={employees}
            movedSet={movedSet}
            getPhaseStatus={getPhaseStatus}
            onSelectEmployee={onSelectEmployee}
            dimmed={dayFilter === 1}
            expandedPhaseId={expandedPhaseId}
            onToggleExpand={handleToggleExpand}
          />

          {/* "Now" indicator */}
          {nowPos && (
            <div
              className="absolute pointer-events-none z-20"
              style={{
                top: `${44 + nowPos.y}px`, // 44px header offset
                right: nowPos.day === 1 ? 0 : undefined,
                left: nowPos.day === 2 ? 0 : undefined,
                width: '50%',
              }}
            >
              <div className="flex items-center gap-0">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="flex-1 h-px bg-indigo-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div
        dir="rtl"
        className="flex items-center gap-4 px-1"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-xs text-gray-400">גל</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-xs text-gray-400">סיבוב מסונכרן</span>
        </div>
      </div>
    </div>
  );
}
