import { useMemo } from 'react';
import { PHASES, EMPLOYEES } from '../data/moveData.js';

// Normalize room IDs so '1B' === '01B' for comparison
function normRoom(r) {
  if (!r) return '';
  return r.replace(/^0+(\d)/, '$1');
}

/**
 * Dynamically compute the snake evacuation order for an SCC phase.
 *
 * Logic: "snake movement" — each person's departure frees a room that
 * unlocks the next person in the chain. We trace:
 *   Start: employee A leaves their room (room X)
 *   Next: who has room X as their destination? → they move next, freeing room Y
 *   Next: who has room Y as their destination? → they move next, freeing room Z
 *   …and so on through the full cycle.
 *
 * Returns an array of employee IDs in the order they should physically move.
 * When a room has multiple occupants leaving simultaneously, they are grouped
 * as consecutive entries in the array.
 */
function computeSCCCascade(phaseId) {
  const phaseEmps = EMPLOYEES.filter(e => e.phase === phaseId);
  if (!phaseEmps.length) return [];

  const phaseIds = new Set(phaseEmps.map(e => e.id));

  // Build: normalizedRoom -> [employees whose newRoom is that room] (within SCC only)
  const destToEmps = {};
  phaseEmps.forEach(emp => {
    const r = normRoom(emp.newRoom);
    if (!destToEmps[r]) destToEmps[r] = [];
    destToEmps[r].push(emp);
  });

  // Build: normalizedRoom -> [employees whose oldRoom is that room] (within SCC only)
  const srcToEmps = {};
  phaseEmps.forEach(emp => {
    const r = normRoom(emp.oldRoom);
    if (!r || emp.oldRoom === 'חדש' || emp.oldRoom === 'מזכירות') return;
    if (!srcToEmps[r]) srcToEmps[r] = [];
    srcToEmps[r].push(emp);
  });

  // Find starting employee: one whose OLD room is NOT the destination of any SCC member
  // (means nobody in the SCC is waiting to enter their room → they can start freely)
  // If it's a pure cycle (everyone's old room IS someone's destination), pick employee
  // who unblocks the most others when they leave — or simply the first in list.
  let startEmp = phaseEmps.find(emp => {
    const r = normRoom(emp.oldRoom);
    return !destToEmps[r] || destToEmps[r].length === 0;
  });

  if (!startEmp) {
    // Pure cycle — pick the employee whose oldRoom has the most people wanting to enter
    // (unblocks most moves when they leave first)
    let maxWaiting = -1;
    phaseEmps.forEach(emp => {
      const r = normRoom(emp.oldRoom);
      const waiting = (destToEmps[r] || []).length;
      if (waiting > maxWaiting) { maxWaiting = waiting; startEmp = emp; }
    });
  }

  // Trace the snake chain
  const cascade = [];
  const visited = new Set();

  function traceFrom(emp) {
    if (!emp || visited.has(emp.id)) return;
    cascade.push(emp.id);
    visited.add(emp.id);

    // When this employee leaves their oldRoom, who can now enter it?
    const freedRoom = normRoom(emp.oldRoom);
    const unblocked = (destToEmps[freedRoom] || []).filter(e => !visited.has(e.id) && phaseIds.has(e.id));

    // Each unblocked employee can now move — trace their chain too
    unblocked.forEach(next => traceFrom(next));
  }

  traceFrom(startEmp);

  // Add any remaining employees not yet visited (isolated sub-chains)
  phaseEmps.forEach(emp => {
    if (!visited.has(emp.id)) traceFrom(emp);
  });

  return cascade;
}

const DEPT_COLORS = {
  'כספים':'#3b82f6','הנדסה':'#10b981','התחדשות עירונית':'#f59e0b','כללי':'#6b7280',
  'משפטי':'#8b5cf6','מכירות':'#ef4444','שיווק':'#ec4899','חווית לקוח':'#14b8a6',
  'מניבים':'#f97316','מוקד':'#06b6d4','סיטי הול':'#a855f7','מזכירות':'#78716c','מערכות מידע':'#0ea5e9',
};

const empById = Object.fromEntries(EMPLOYEES.map(e => [e.id, e]));

function PhaseTimeline({ phases, movedSet }) {
  return (
    <div className="flex gap-1 overflow-x-auto py-2 px-1">
      {phases.map(p => {
        const emps = EMPLOYEES.filter(e => e.phase === p.id);
        const movedCount = emps.filter(e => movedSet.has(e.id)).length;
        const status = movedCount === emps.length ? 'complete' : movedCount > 0 ? 'active' : 'pending';
        return (
          <div key={p.id} className={`flex-1 min-w-[52px] rounded-md px-2 py-1.5 text-center transition-all ${
            status === 'complete' ? 'bg-green-100' :
            status === 'active' ? 'bg-gray-100' : 'bg-gray-100'
          }`} style={status === 'active' ? {
            backgroundColor: p.colorLight || '#ede9fe',
            outline: `2.5px solid ${p.color}`,
            outlineOffset: '2px',
          } : undefined}>
            <div className="text-[9px] text-gray-400 leading-none mb-0.5">יום {p.day}</div>
            <div className="text-[10px] font-bold truncate" style={{ color: status === 'pending' ? '#9ca3af' : p.color }}>
              {p.id}
            </div>
            {status === 'complete' && <div className="text-[9px] text-green-500">✓</div>}
            {status === 'active' && (
              <div className="text-[9px] font-semibold" style={{ color: p.color }}>{movedCount}/{emps.length}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmpCard({ emp, isMoved, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
        isMoved ? 'opacity-50' : onClick ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}>
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DEPT_COLORS[emp.dept] || '#6b7280' }} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium text-gray-900 truncate ${isMoved ? 'line-through text-gray-400' : ''}`}>
          {emp.first} {emp.last}
        </div>
        <div className="text-xs text-gray-400">{emp.dept}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
        <span className="text-amber-600">{emp.oldRoom}</span>
        <span className="text-gray-300">←</span>
        <span className="text-sky-600">{emp.newRoom}</span>
      </div>
      <span className={`text-xs font-medium shrink-0 ${isMoved ? 'text-green-500' : 'text-gray-300'}`}>✓</span>
    </Tag>
  );
}

function WavePhaseView({ phase, employees, movedSet, toggleMoved }) {
  const phaseEmps = employees.filter(e => e.phase === phase.id);
  const pending = phaseEmps.filter(e => !movedSet.has(e.id));
  const done = phaseEmps.filter(e => movedSet.has(e.id));

  return (
    <div className="divide-y divide-gray-100">
      {pending.map(emp => (
        <EmpCard key={emp.id} emp={emp} isMoved={false}
          onClick={toggleMoved ? () => toggleMoved(emp.id) : undefined} />
      ))}
      {done.map(emp => (
        <EmpCard key={emp.id} emp={emp} isMoved={true}
          onClick={toggleMoved ? () => toggleMoved(emp.id) : undefined} />
      ))}
    </div>
  );
}

/**
 * Compute parallel wave groups for the SCC cascade using BFS.
 * Each wave = employees who can move simultaneously because all their
 * blockers have already moved. Returns array of waves (each wave = array of empIds).
 */
function computeSCCWaves(phaseId, movedSet) {
  const phaseEmps = EMPLOYEES.filter(e => e.phase === phaseId);
  if (!phaseEmps.length) return [];

  // Build: who blocks whom — emp A is blocked by emp B if B.oldRoom === A.newRoom
  const blockedBy = {}; // empId -> Set<empId>
  phaseEmps.forEach(emp => {
    blockedBy[emp.id] = new Set();
    const normNew = normRoom(emp.newRoom);
    phaseEmps.forEach(other => {
      if (other.id === emp.id) return;
      if (normRoom(other.oldRoom) === normNew && !movedSet.has(other.id)) {
        blockedBy[emp.id].add(other.id);
      }
    });
  });

  const waves = [];
  const scheduled = new Set(movedSet);
  const remaining = new Set(phaseEmps.map(e => e.id).filter(id => !movedSet.has(id)));

  let iterations = 0;
  while (remaining.size > 0 && iterations < 100) {
    iterations++;
    // Find all employees whose blockers are all scheduled
    const wave = [...remaining].filter(id => {
      const blockers = blockedBy[id] || new Set();
      return [...blockers].every(bId => scheduled.has(bId));
    });

    if (wave.length === 0) {
      // Pure cycle — break by picking the one with fewest remaining blockers
      const pick = [...remaining].sort((a, b) => {
        const aB = [...(blockedBy[a] || [])].filter(x => !scheduled.has(x)).length;
        const bB = [...(blockedBy[b] || [])].filter(x => !scheduled.has(x)).length;
        return aB - bB;
      })[0];
      if (pick) wave.push(pick);
    }

    if (wave.length === 0) break;
    waves.push(wave);
    wave.forEach(id => { scheduled.add(id); remaining.delete(id); });
  }

  return waves;
}

// Unified row used in SCC wave views — consistent with app's design language
function EmpRow({ emp, isMoved, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors ${
        isMoved ? 'opacity-40' : onClick ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}>
      <span className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: DEPT_COLORS[emp.dept] || '#6b7280' }} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium truncate ${isMoved ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {emp.first} {emp.last}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {emp.dept}
          {emp.replaces && emp.replaces !== 'חדר ריק' && emp.replaces !== 'חדר חדש / ריק' && (
            <span className="text-gray-300"> · מחליף: {emp.replaces}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono">
        <span className="text-amber-600">{emp.oldRoom}</span>
        <span className="text-gray-300">←</span>
        <span className="text-sky-600">{emp.newRoom}</span>
      </div>
      <span className={`text-xs shrink-0 ${isMoved ? 'text-green-500' : 'text-gray-300'}`}>✓</span>
    </Tag>
  );
}

function SCCPhaseView({ phase, movedSet, toggleMoved }) {
  const allPhaseEmps = EMPLOYEES.filter(e => e.phase === phase.id);
  const done = allPhaseEmps.filter(e => movedSet.has(e.id)).length;
  const total = allPhaseEmps.length;
  const isComplete = done === total;

  // Compute the FULL original wave structure once (empty movedSet = no filtering)
  // This gives us stable wave groups that don't disappear as people are marked done.
  const allWaves = useMemo(() => computeSCCWaves(phase.id, new Set()), [phase.id]);

  const SHOW_AHEAD = 5;

  // Active wave = first wave with any unmoved employee
  const activeWaveIdx = allWaves.findIndex(w => w.some(id => !movedSet.has(id)));
  const remainingWaves = allWaves.filter(w => w.some(id => !movedSet.has(id))).length;

  // Last 2 completed waves (most recent first) — shown above the active wave
  const completedWaves = allWaves
    .slice(0, activeWaveIdx > 0 ? activeWaveIdx : 0)
    .filter(w => w.every(id => movedSet.has(id)))
    .slice(-2)
    .reverse();

  // Style config per wave position relative to active
  const waveConfig = [
    { label: '🚀 מתפנים עכשיו', size: 'large',  opacity: 1,    border: 'colored', showMarkAll: true },
    { label: '⏳ להיערך',       size: 'medium', opacity: 0.95, border: 'gray',    showMarkAll: false },
    { label: '📋 בתור',         size: 'small',  opacity: 0.75, border: 'light',   showMarkAll: false },
    { label: '👀 הכן',          size: 'pill',   opacity: 0.55, border: 'none',    showMarkAll: false },
    { label: '🔜 קרוב',         size: 'pill',   opacity: 0.4,  border: 'none',    showMarkAll: false },
  ];

  return (
    <div className="space-y-4">
      {/* Progress bar + wave counter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(done / total) * 100}%`, backgroundColor: phase.color }} />
        </div>
        <div className="text-right shrink-0">
          <span className="text-sm font-bold tabular-nums" style={{ color: phase.color }}>{done}/{total}</span>
          {!isComplete && remainingWaves > 0 && (
            <span className="text-xs text-gray-400 block">{remainingWaves} גלי פינוי נותרו</span>
          )}
        </div>
      </div>

      {isComplete ? (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-center">
          <div className="text-base font-semibold text-green-700 mb-0.5">הסיבוב הושלם</div>
          <div className="text-sm text-green-600">כל {total} העובדים הועברו</div>
        </div>
      ) : (
        <div className="space-y-2">

          {/* Recently completed waves */}
          {completedWaves.map((wave, i) => {
            const waveIdx = activeWaveIdx - (completedWaves.length - 1 - i);
            return (
              <div key={`done-${waveIdx}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity"
                style={{ borderTop: `2px solid #22c55e` }}>
                <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-gray-600">הושלם — גל {waveIdx}</span>
                    <span className="text-xs text-gray-400">{wave.length} עובדים</span>
                  </div>
                  <span className="text-[10px] text-gray-400">לחץ לביטול</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {wave.map(id => {
                    const emp = empById[id];
                    if (!emp) return null;
                    return <EmpRow key={id} emp={emp} isMoved={true} onClick={toggleMoved ? () => toggleMoved(id) : undefined} />;
                  })}
                </div>
              </div>
            );
          })}

          {/* Upcoming waves */}
          {activeWaveIdx >= 0 && allWaves.slice(activeWaveIdx, activeWaveIdx + SHOW_AHEAD).map((wave, offset) => {
            const waveIdx = activeWaveIdx + offset + 1;
            const pendingInWave = wave.filter(id => !movedSet.has(id));
            if (pendingInWave.length === 0) return null;

            const isActive = offset === 0;
            const opacityStyle = { opacity: [1, 0.9, 0.7, 0.5, 0.35][offset] ?? 0.35 };
            const waveLabels = ['מתפנים עכשיו', 'להיערך', 'בתור', 'עמדו מוכן', 'קרוב'];
            const label = waveLabels[offset] || 'בתור';

            return (
              <div key={waveIdx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                style={{ borderTop: isActive ? `2px solid ${phase.color}` : undefined, ...opacityStyle }}>
                {/* Wave header — same style as Checklist phase header */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? phase.color : '#d1d5db' }} />
                    <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
                    <span className="text-xs text-gray-400">{pendingInWave.length} עובדים</span>
                  </div>
                  <span className="text-xs text-gray-400">גל {waveIdx} / {allWaves.length}</span>
                </div>

                {/* Employee rows */}
                <div className="divide-y divide-gray-50">
                  {wave.map(id => {
                    const emp = empById[id];
                    if (!emp) return null;
                    const isMoved = movedSet.has(id);
                    return <EmpRow key={id} emp={emp} isMoved={isMoved} onClick={toggleMoved ? () => toggleMoved(id) : undefined} />;
                  })}
                </div>

                {/* Mark all button — ghost style matching Checklist */}
                {isActive && pendingInWave.length > 0 && toggleMoved && (
                  <div className="px-4 py-2.5 border-t border-gray-100">
                    <button
                      onClick={() => pendingInWave.forEach(id => toggleMoved(id))}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-3 py-1.5 transition-colors w-full text-center">
                      סמן כולם — גל {waveIdx}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {remainingWaves > SHOW_AHEAD && (
            <div className="text-center text-xs text-gray-400 py-1">
              + עוד {remainingWaves - SHOW_AHEAD} גלי פינוי
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage({ movedSet, toggleMoved, markPhaseComplete }) {
  // Overall progress
  const totalMoved = movedSet.size;
  const totalEmps = EMPLOYEES.length;

  // Find current active phase (first non-complete)
  const activePhase = useMemo(() => {
    for (const phase of PHASES) {
      const emps = EMPLOYEES.filter(e => e.phase === phase.id);
      const movedCount = emps.filter(e => movedSet.has(e.id)).length;
      if (movedCount < emps.length) return phase;
    }
    return null;
  }, [movedSet]);

  const activePhaseEmps = activePhase ? EMPLOYEES.filter(e => e.phase === activePhase.id) : [];
  const activePhaseDone = activePhaseEmps.filter(e => movedSet.has(e.id)).length;
  const isAllDone = totalMoved === totalEmps;

  return (
    <div dir="rtl" className="space-y-4 max-w-2xl mx-auto">
      {/* Overall progress */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold tabular-nums text-gray-900">{totalMoved}</span>
          <span className="text-sm text-gray-400">/ {totalEmps} עובדים הועברו</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(totalMoved / totalEmps) * 100}%` }} />
        </div>
      </div>

      {/* Phase timeline */}
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <div className="text-xs font-medium text-gray-400 mb-2">ציר שלבים</div>
        <PhaseTimeline phases={PHASES} movedSet={movedSet} />
      </div>

      {/* All done */}
      {isAllDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-6 text-center">
          <div className="text-base font-semibold text-green-800 mb-1">המעבר הושלם</div>
          <div className="text-sm text-green-600">כל {totalEmps} העובדים הועברו בהצלחה</div>
        </div>
      )}

      {/* Active phase — matches Checklist card style */}
      {!isAllDone && activePhase && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          style={{ borderTop: `2px solid ${activePhase.color}` }}>
          {/* Header — same pattern as Checklist phase header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">{activePhase.name}</span>
                {activePhase.type === 'scc' && (
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 rounded px-2 py-0.5">סיבוב מסונכרן</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  בתהליך
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                יום {activePhase.day === 1 ? "א' 28.06" : "ב' 29.06"} · {activePhase.time}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-left min-w-[80px]">
                <div className="text-sm font-semibold text-gray-700 tabular-nums">
                  {activePhaseDone}/{activePhaseEmps.length} <span className="font-normal text-gray-400 text-xs">הועברו</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${activePhaseEmps.length ? (activePhaseDone / activePhaseEmps.length) * 100 : 0}%`, backgroundColor: activePhase.color }} />
                </div>
              </div>
              {activePhase.type === 'wave' && activePhaseDone < activePhaseEmps.length && markPhaseComplete && (
                <span role="button" onClick={() => markPhaseComplete(activePhase.id)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 transition-colors cursor-pointer">
                  סמן הכל
                </span>
              )}
            </div>
          </div>

          <div>
            {activePhase.type === 'scc' ? (
              <SCCPhaseView phase={activePhase} movedSet={movedSet} toggleMoved={toggleMoved} />
            ) : (
              <WavePhaseView phase={activePhase} employees={EMPLOYEES} movedSet={movedSet} toggleMoved={toggleMoved} />
            )}
          </div>
        </div>
      )}

      {/* Upcoming phases preview */}
      {!isAllDone && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">שלבים הבאים</div>
          {PHASES.filter(p => {
            const emps = EMPLOYEES.filter(e => e.phase === p.id);
            return emps.every(e => !movedSet.has(e.id)) && p.id !== activePhase?.id;
          }).slice(0, 3).map(p => {
            const emps = EMPLOYEES.filter(e => e.phase === p.id);
            return (
              <div key={p.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700">{p.name}</div>
                  <div className="text-xs text-gray-400">יום {p.day === 1 ? "א'" : "ב'"} · {p.time}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-gray-600">{emps.length}</div>
                  <div className="text-[10px] text-gray-400">עובדים</div>
                </div>
                {p.type === 'scc' && <span className="text-[10px] font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded">סיבוב</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
