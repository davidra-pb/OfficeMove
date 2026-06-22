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

function darkenColor(hex, amount = 0.3) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `rgb(${r}, ${g}, ${b})`;
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

function SyncIcon({ color }) {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  );
}

function StatusDot({ status }) {
  const styles = {
    locked: 'bg-gray-400',
    ready: 'bg-blue-500',
    in_progress: 'bg-yellow-400 animate-pulse',
    complete: 'bg-green-500',
  };
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${styles[status] || 'bg-gray-300'}`}
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
}) {
  const [expanded, setExpanded] = useState(false);

  const top = hourToY(timeRange.start);
  const height = (timeRange.end - timeRange.start) * PX_PER_HOUR;
  const status = getPhaseStatus(phase.id);
  const phaseEmployees = employees.filter((e) => e.phase === phase.id);
  const movedCount = phaseEmployees.filter((e) => movedSet.has(e.id)).length;
  const totalCount = phaseEmployees.length;
  const progressPct = totalCount > 0 ? (movedCount / totalCount) * 100 : 0;
  const isSCC = phase.type === 'scc';

  return (
    <div
      className="absolute inset-x-2 rounded-lg overflow-visible cursor-pointer transition-shadow hover:shadow-lg group"
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 32)}px`,
        border: isSCC ? `2px solid ${phase.color}` : '1px solid rgba(0,0,0,0.08)',
        animation: isSCC ? 'scc-pulse 2s ease-in-out infinite' : undefined,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Background fill */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{ backgroundColor: phase.colorLight || phase.color + '22' }}
      />

      {/* Progress fill */}
      <div
        className="absolute inset-y-0 right-0 rounded-lg transition-all duration-500 ease-out"
        style={{
          width: `${progressPct}%`,
          backgroundColor: darkenColor(phase.color, 0.05),
          opacity: 0.35,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 px-3 h-full min-h-[32px]">
        <StatusDot status={status} />

        {isSCC && <SyncIcon color={phase.color} />}

        <span
          className="text-xs font-bold truncate"
          style={{ color: darkenColor(phase.color, 0.35) }}
        >
          {phase.name}
        </span>

        <span className="text-[10px] text-gray-500 whitespace-nowrap mr-auto">
          {movedCount}/{totalCount} הועברו
        </span>
      </div>

      {/* Expanded employee list */}
      {expanded && phaseEmployees.length > 0 && (
        <div
          className="absolute right-0 left-0 z-30 bg-white rounded-b-lg shadow-xl border border-gray-200 p-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto"
          style={{ top: `${Math.max(height, 32)}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {phaseEmployees.map((emp) => {
            const isMoved = movedSet.has(emp.id);
            return (
              <button
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                  isMoved
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
   DependencyArrows — SVG connecting lines
   ──────────────────────────────────────────────────────── */

function DependencyArrows({ phases, dayColumnRefs }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Recalculate positions on every render
    const newPositions = [];

    for (const [fromId, toId] of DEPENDENCIES) {
      const fromPhase = phases.find((p) => p.id === fromId);
      const toPhase = phases.find((p) => p.id === toId);
      if (!fromPhase || !toPhase) continue;

      const fromTime = PHASE_TIMES[fromId];
      const toTime = PHASE_TIMES[toId];
      if (!fromTime || !toTime) continue;

      const fromRange = parseTime(fromTime);
      const toRange = parseTime(toTime);

      const fromBottom = hourToY(fromRange.end);
      const toTop = hourToY(toRange.start);

      // Same day: simple vertical dashed line
      if (fromPhase.day === toPhase.day) {
        newPositions.push({
          type: 'same-day',
          day: fromPhase.day,
          y1: fromBottom,
          y2: toTop,
        });
      } else {
        // Cross-day: from bottom of day1 col to top of day2 col
        newPositions.push({
          type: 'cross-day',
          fromDay: fromPhase.day,
          toDay: toPhase.day,
          y1: fromBottom,
          y2: toTop,
        });
      }
    }

    setPositions(newPositions);
  }, [phases]);

  return (
    <>
      {positions.map((pos, i) => {
        if (pos.type === 'same-day') {
          const colRef = dayColumnRefs.current[pos.day];
          if (!colRef) return null;
          return (
            <svg
              key={i}
              className="absolute pointer-events-none z-0"
              style={{
                top: 0,
                right: 0,
                left: 0,
                height: `${TIMELINE_HEIGHT}px`,
              }}
            >
              <line
                x1="50%"
                y1={pos.y1}
                x2="50%"
                y2={pos.y2}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                markerEnd="url(#arrowhead)"
              />
            </svg>
          );
        }
        return null;
      })}
    </>
  );
}

/* ────────────────────────────────────────────────────────
   CrossDayArrow — single SVG overlay for cross-day deps
   ──────────────────────────────────────────────────────── */

function CrossDayArrows({ phases, containerRef }) {
  const [arrows, setArrows] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const newArrows = [];

    for (const [fromId, toId] of DEPENDENCIES) {
      const fromPhase = phases.find((p) => p.id === fromId);
      const toPhase = phases.find((p) => p.id === toId);
      if (!fromPhase || !toPhase || fromPhase.day === toPhase.day) continue;

      const fromTime = PHASE_TIMES[fromId];
      const toTime = PHASE_TIMES[toId];
      if (!fromTime || !toTime) continue;

      const fromRange = parseTime(fromTime);
      const toRange = parseTime(toTime);

      // Find the column elements
      const fromCol = container.querySelector(`[data-day="${fromPhase.day}"]`);
      const toCol = container.querySelector(`[data-day="${toPhase.day}"]`);
      if (!fromCol || !toCol) continue;

      const fromRect = fromCol.getBoundingClientRect();
      const toRect = toCol.getBoundingClientRect();

      const fromX = fromRect.left - containerRect.left + fromRect.width * 0.5;
      const toX = toRect.left - containerRect.left + toRect.width * 0.5;

      const headerOffset = 44; // approximate header height inside day column
      const fromY = headerOffset + hourToY(fromRange.end);
      const toY = headerOffset + hourToY(toRange.start);

      newArrows.push({ fromX, toX, fromY, toY });
    }

    setArrows(newArrows);
  }, [phases, containerRef]);

  if (arrows.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrowhead-cross"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>
      {arrows.map((a, i) => {
        const midY = (a.fromY + a.toY) / 2;
        return (
          <path
            key={i}
            d={`M ${a.fromX} ${a.fromY} C ${a.fromX} ${midY}, ${a.toX} ${midY}, ${a.toX} ${a.toY}`}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            fill="none"
            markerEnd="url(#arrowhead-cross)"
          />
        );
      })}
    </svg>
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
}) {
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) {
    hours.push(h);
  }

  return (
    <div
      data-day={day}
      className={`flex-1 min-w-[280px] rounded-xl border transition-opacity duration-300 ${
        dimmed ? 'opacity-40 border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Day header */}
      <div
        className="text-center py-3 font-bold text-sm border-b border-gray-200 rounded-t-xl"
        style={{
          backgroundColor: day === 1 ? '#dbeafe' : '#fef3c7',
          color: day === 1 ? '#1e40af' : '#92400e',
        }}
      >
        {label}
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
              <span className="text-[10px] text-gray-400 font-mono leading-none">
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
            <defs>
              <marker
                id={`arrowhead-${day}`}
                markerWidth="7"
                markerHeight="5"
                refX="7"
                refY="2.5"
                orient="auto"
              >
                <polygon points="0 0, 7 2.5, 0 5" fill="#94a3b8" />
              </marker>
            </defs>
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
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  markerEnd={`url(#arrowhead-${day})`}
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

  const showNow = useMemo(() => isNowInRange(), []);
  const nowPos = useMemo(() => (showNow ? getNowPosition() : null), [showNow]);

  return (
    <div dir="rtl" className="space-y-4">
      {/* SCC pulse animation */}
      <style>{`
        @keyframes scc-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(168,85,247,0); }
        }
      `}</style>

      {/* Timeline container */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-2xl shadow-lg p-5 overflow-x-auto"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">ציר זמן — מעבר משרדים</h3>

        {/* Day columns */}
        <div className="flex flex-col md:flex-row gap-4 relative">
          <DayColumn
            day={1}
            label={DAY_LABELS[1]}
            phases={phases}
            employees={employees}
            movedSet={movedSet}
            getPhaseStatus={getPhaseStatus}
            onSelectEmployee={onSelectEmployee}
            dimmed={dayFilter === 2}
          />

          {/* Cross-day dependency arrow overlay */}
          <div className="hidden md:flex items-center justify-center w-8 shrink-0 relative">
            <svg className="w-full" style={{ height: `${TIMELINE_HEIGHT}px` }}>
              <defs>
                <marker
                  id="arrowhead-mid"
                  markerWidth="8"
                  markerHeight="6"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
                </marker>
              </defs>
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
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    fill="none"
                    markerEnd="url(#arrowhead-mid)"
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
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md" />
                <div className="flex-1 h-[2px] bg-red-500" />
                <span className="text-[10px] font-bold text-red-600 bg-white px-1 rounded">
                  עכשיו
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div
        dir="rtl"
        className="bg-white rounded-xl shadow-sm px-5 py-3 flex flex-wrap items-center gap-5 text-sm"
      >
        <span className="text-gray-500 font-semibold text-xs">מקרא:</span>

        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded bg-gradient-to-l from-blue-200 to-blue-400 border border-blue-300" />
          <span className="text-gray-600 text-xs">שלב גל (Wave)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-3 rounded border-2 border-purple-400 bg-purple-100 relative">
            <div className="absolute inset-0 animate-pulse bg-purple-200 rounded" />
          </div>
          <span className="text-gray-600 text-xs">סיבוב מסונכרן (SCC)</span>
        </div>

        <div className="flex items-center gap-2 mr-4">
          <StatusDot status="locked" />
          <span className="text-gray-500 text-xs">נעול</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status="ready" />
          <span className="text-gray-500 text-xs">מוכן</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status="in_progress" />
          <span className="text-gray-500 text-xs">בתהליך</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status="complete" />
          <span className="text-gray-500 text-xs">הושלם</span>
        </div>

        <div className="flex items-center gap-2 mr-4">
          <svg width="24" height="8">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
          <span className="text-gray-500 text-xs">תלות בין שלבים</span>
        </div>
      </div>
    </div>
  );
}
