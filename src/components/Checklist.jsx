import React, { useState, useMemo } from 'react';

const DEPT_COLORS = {
  'כספים': '#3b82f6',
  'הנדסה': '#10b981',
  'התחדשות עירונית': '#f59e0b',
  'כללי': '#6b7280',
  'משפטי': '#8b5cf6',
  'מכירות': '#ef4444',
  'שיווק': '#ec4899',
  'חווית לקוח': '#14b8a6',
  'מניבים': '#f97316',
  'מוקד': '#06b6d4',
  'סיטי הול': '#a855f7',
  'מזכירות': '#78716c',
  'מערכות מידע': '#0ea5e9',
};

function getBldAbbr(bld) {
  if (!bld) return '';
  if (bld === 'ישראל קנדה') return 'י״ק';
  if (bld === 'אקרו') return 'אקרו';
  if (bld === 'עובד חדש') return 'חדש';
  return bld;
}

function StatusBadge({ status }) {
  switch (status) {
    case 'ready':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          מוכן
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
          בתהליך
        </span>
      );
    case 'complete':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          הושלם ✓
        </span>
      );
    default:
      return null;
  }
}

export default function Checklist({
  employees,
  phases,
  movedSet,
  toggleMoved,
  onSelectEmployee,
  markPhaseComplete,
  getPhaseStatus,
  searchQuery = '',
  dayFilter,
  departments,
}) {
  // Build a lookup from the departments prop if provided
  const deptColorMap = useMemo(() => {
    if (departments && Array.isArray(departments)) {
      const map = {};
      departments.forEach((d) => { map[d.name] = d.color; });
      return map;
    }
    return DEPT_COLORS;
  }, [departments]);

  // Determine the first non-complete phase to auto-expand
  const firstOpenPhaseId = useMemo(() => {
    for (const phase of phases) {
      const status = getPhaseStatus(phase.id);
      if (status !== 'complete') return phase.id;
    }
    return phases.length > 0 ? phases[phases.length - 1].id : null;
  }, [phases, getPhaseStatus]);

  const [expandedPhases, setExpandedPhases] = useState(() => {
    return new Set(firstOpenPhaseId != null ? [firstOpenPhaseId] : []);
  });

  const toggleExpand = (phaseId) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  // Filter phases by dayFilter
  const visiblePhases = useMemo(() => {
    if (dayFilter == null) return phases;
    return phases.filter((p) => p.day === dayFilter);
  }, [phases, dayFilter]);

  // Build employee lists per phase, with search filtering
  const employeesByPhase = useMemo(() => {
    const map = {};
    for (const phase of phases) {
      map[phase.id] = employees.filter((e) => e.phase === phase.id);
    }
    return map;
  }, [employees, phases]);

  return (
    <div dir="rtl" className="space-y-3">
      {visiblePhases.map((phase) => {
        const status = getPhaseStatus(phase.id);
        const isExpanded = expandedPhases.has(phase.id);
        const phaseEmployees = employeesByPhase[phase.id] || [];
        const movedCount = phaseEmployees.filter((e) => movedSet.has(e.id)).length;
        const totalCount = phaseEmployees.length;
        const progressPct = totalCount > 0 ? (movedCount / totalCount) * 100 : 0;
        const isSCC = phase.type === 'scc';
        const isLocked = false;

        return (
          <div
            key={phase.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-lg"
            style={{ borderRight: `5px solid ${phase.color}` }}
          >
            {/* Phase Header */}
            <button
              onClick={() => toggleExpand(phase.id)}
              className="w-full text-right"
            >
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none transition-colors"
                style={{ backgroundColor: isExpanded ? phase.colorLight : 'transparent' }}
              >
                {/* Phase name & info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold text-gray-900 truncate">
                      {phase.name}
                    </span>

                    {isSCC && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 animate-pulse whitespace-nowrap">
                        <span className="w-2 h-2 bg-purple-500 rounded-full inline-block" />
                        סיבוב מסונכרן
                      </span>
                    )}

                    <StatusBadge status={status} />
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>יום {phase.day}</span>
                    <span className="text-gray-300">|</span>
                    <span>{phase.time}</span>
                  </div>
                </div>

                {/* Progress section */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-left min-w-[100px]">
                    <div className="text-sm font-semibold text-gray-700">
                      {movedCount}/{totalCount} <span className="font-normal text-gray-500">הועברו</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progressPct}%`,
                          backgroundColor: phase.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mark all button */}
                  {!isLocked && status !== 'complete' && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        markPhaseComplete(phase.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          markPhaseComplete(phase.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
                      style={{ backgroundColor: phase.color }}
                    >
                      סמן הכל
                    </span>
                  )}

                  {/* Chevron */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Phase Body */}
            {isExpanded && (
              <div className="relative">
                {/* Locked overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-b-2xl">
                    <div className="bg-white/90 rounded-xl px-6 py-4 shadow-md text-center">
                      <span className="text-3xl block mb-2">🔒</span>
                      <span className="text-gray-600 font-semibold text-sm">שלב קודם טרם הושלם</span>
                    </div>
                  </div>
                )}

                {/* SCC info box */}
                {isSCC && (
                  <div
                    className="mx-5 mt-3 mb-2 rounded-xl p-3 border-2 text-sm font-semibold text-center"
                    style={{
                      backgroundColor: phase.colorLight,
                      borderColor: phase.color,
                      color: phase.color,
                    }}
                  >
                    שלב סיבוב מסונכרן — כל {totalCount} עובדים חייבים לעבור בו-זמנית!
                  </div>
                )}

                {/* Employee table */}
                <div className="px-5 pb-4 overflow-x-auto">
                  {phaseEmployees.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      אין עובדים תואמים לסינון
                    </div>
                  ) : (
                    <table className="w-full text-sm mt-2">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 text-xs">
                          <th className="py-2 px-2 text-right w-10"></th>
                          <th className="py-2 px-2 text-right w-10">מס'</th>
                          <th className="py-2 px-2 text-right">שם</th>
                          <th className="py-2 px-2 text-right">מחלקה</th>
                          <th className="py-2 px-2 text-right">מחדר</th>
                          <th className="py-2 px-2 text-right">לחדר</th>
                          <th className="py-2 px-2 text-right">מחליף את</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phaseEmployees.map((emp, idx) => {
                          const isMoved = movedSet.has(emp.id);
                          const deptColor = deptColorMap[emp.dept] || '#6b7280';

                          return (
                            <tr
                              key={emp.id}
                              onClick={() => onSelectEmployee(emp)}
                              className={`border-b border-gray-100 cursor-pointer transition-colors ${
                                isMoved
                                  ? 'bg-green-50 hover:bg-green-100'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-2.5 px-2">
                                <input
                                  type="checkbox"
                                  checked={isMoved}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleMoved(emp.id);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600"
                                />
                              </td>

                              {/* Number */}
                              <td className="py-2.5 px-2 text-gray-400 font-mono text-xs">
                                {emp.id}
                              </td>

                              {/* Name */}
                              <td className={`py-2.5 px-2 font-medium ${isMoved ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {emp.first} {emp.last}
                              </td>

                              {/* Department */}
                              <td className="py-2.5 px-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: deptColor }}
                                  />
                                  <span className={`text-xs ${isMoved ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                    {emp.dept}
                                  </span>
                                </div>
                              </td>

                              {/* Old Room */}
                              <td className={`py-2.5 px-2 text-xs ${isMoved ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                <span className="font-medium">{emp.oldRoom}</span>
                                <span className="text-gray-400 mr-1">({getBldAbbr(emp.oldBld)})</span>
                              </td>

                              {/* New Room */}
                              <td className={`py-2.5 px-2 text-xs ${isMoved ? 'text-gray-400 line-through' : 'text-gray-700 font-semibold'}`}>
                                <span>{emp.newRoom}</span>
                                <span className="text-gray-400 mr-1 font-normal">({getBldAbbr(emp.newBld)})</span>
                              </td>

                              {/* Replaces */}
                              <td className={`py-2.5 px-2 text-xs max-w-[180px] truncate ${isMoved ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                                {emp.replaces || '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {visiblePhases.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          אין שלבים מתאימים לסינון הנוכחי
        </div>
      )}
    </div>
  );
}
