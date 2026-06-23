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
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full inline-block bg-gray-300" />
          ממתין
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
          <span className="w-2 h-2 rounded-full inline-block bg-amber-400" />
          בתהליך
        </span>
      );
    case 'complete':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
          <span className="w-2 h-2 rounded-full inline-block bg-green-500" />
          הושלם
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
  unmarkPhase,
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
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            style={{ borderTop: `2px solid ${phase.color}` }}
          >
            {/* Phase Header */}
            <button
              onClick={() => toggleExpand(phase.id)}
              className="w-full text-right"
            >
              <div
                className="flex items-center gap-3 px-6 py-5 cursor-pointer select-none transition-colors flex-wrap"
              >
                {/* Phase name & info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-gray-900 truncate">
                      {phase.name}
                    </span>

                    {isSCC && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 rounded px-2 py-0.5 whitespace-nowrap">
                        סיבוב מסונכרן
                      </span>
                    )}

                    <StatusBadge status={status} />
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
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
                    <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
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
                  {status !== 'complete' && (
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
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors whitespace-nowrap cursor-pointer min-h-[32px] inline-flex items-center"
                    >
                      סמן הכל
                    </span>
                  )}
                  {(status === 'in_progress' || status === 'complete') && unmarkPhase && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        unmarkPhase(phase.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          unmarkPhase(phase.id);
                        }
                      }}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors whitespace-nowrap cursor-pointer min-h-[32px] inline-flex items-center"
                    >
                      בטל הכל
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
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-b-xl">
                    <div className="text-center">
                      <span className="text-gray-500 font-medium text-sm">שלב קודם טרם הושלם</span>
                    </div>
                  </div>
                )}

                {/* SCC info box */}
                {isSCC && (
                  <div className="mx-6 mt-3 mb-2 border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 text-center">
                    שלב סיבוב מסונכרן — כל {totalCount} עובדים חייבים לעבור בו-זמנית!
                  </div>
                )}

                {/* Employee table */}
                <div className="px-6 pb-4">
                <div className="overflow-x-auto">
                  {phaseEmployees.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      אין עובדים תואמים לסינון
                    </div>
                  ) : (
                    <table className="w-full text-sm mt-2">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 px-2 text-right w-10 text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                          <th className="py-2 px-2 text-right w-10 text-xs font-medium text-gray-400 uppercase tracking-wider">מס'</th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">שם</th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">מחלקה</th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">מחדר</th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">לחדר</th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">מחליף את</th>
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
                              className={`border-b border-gray-100 cursor-pointer transition-colors min-h-[44px] ${
                                isMoved
                                  ? 'bg-gray-50 opacity-50'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {/* Checkbox */}
                              <td className="py-3 px-2">
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
                              <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                                {emp.id}
                              </td>

                              {/* Name */}
                              <td className={`py-3 px-2 font-medium ${isMoved ? 'text-gray-400' : 'text-gray-900'}`}>
                                <span className="inline-flex items-center gap-1.5">
                                  {isMoved && (
                                    <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                  {emp.first} {emp.last}
                                </span>
                              </td>

                              {/* Department */}
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block shrink-0"
                                    style={{ backgroundColor: deptColor }}
                                  />
                                  <span className={`text-xs ${isMoved ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {emp.dept}
                                  </span>
                                </div>
                              </td>

                              {/* Old Room */}
                              <td className={`py-3 px-2 text-xs ${isMoved ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span className="font-medium">{emp.oldRoom}</span>
                                <span className="text-gray-400 mr-1 hidden sm:inline">({getBldAbbr(emp.oldBld)})</span>
                              </td>

                              {/* New Room */}
                              <td className={`py-3 px-2 text-xs ${isMoved ? 'text-gray-400' : 'text-gray-700 font-semibold'}`}>
                                <span>{emp.newRoom}</span>
                                <span className="text-gray-400 mr-1 font-normal hidden sm:inline">({getBldAbbr(emp.newBld)})</span>
                              </td>

                              {/* Replaces */}
                              <td className={`py-3 px-2 text-xs max-w-[180px] truncate hidden sm:table-cell ${isMoved ? 'text-gray-400' : 'text-gray-500'}`}>
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
