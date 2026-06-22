import { useState, useEffect, useMemo, useCallback } from 'react';
import { PHASES, EMPLOYEES } from '../data/moveData.js';
import { FLOOR_PLANS, ROOM_LOOKUP, ROOM_COORDS, floorIdForRoom } from '../data/roomCoords.js';

const DEPT_COLORS = {
  'כספים':'#3b82f6','הנדסה':'#10b981','התחדשות עירונית':'#f59e0b','כללי':'#6b7280',
  'משפטי':'#8b5cf6','מכירות':'#ef4444','שיווק':'#ec4899','חווית לקוח':'#14b8a6',
  'מניבים':'#f97316','מוקד':'#06b6d4','סיטי הול':'#a855f7','מזכירות':'#78716c','מערכות מידע':'#0ea5e9',
};


export default function Comparison({ movedSet, onSelectEmployee, searchQuery = '', compareEmployee, toggleMoved }) {
  const [selection, setSelection] = useState(null);
  const [leftFloor, setLeftFloor] = useState('floor8_ic');
  const [rightFloor, setRightFloor] = useState('floor8_ic');
  const [fullscreen, setFullscreen] = useState(false);

  const phaseColorMap = useMemo(() => {
    const m = {};
    PHASES.forEach(p => { m[p.id] = p.color; });
    return m;
  }, []);

  const oldRoomMap = useMemo(() => {
    const m = {};
    EMPLOYEES.forEach(emp => {
      const r = emp.oldRoom;
      if (!r || r === 'חדש' || r === 'מזכירות') return;
      if (!m[r]) m[r] = [];
      m[r].push(emp);
      // Also store under the ROOM_COORDS canonical key (with leading zero)
      const padded = r.replace(/^(\d)(\D)$/, '0$1$2');
      if (padded !== r) {
        if (!m[padded]) m[padded] = [];
        m[padded].push(emp);
      }
    });
    return m;
  }, []);

  const newRoomMap = useMemo(() => {
    const m = {};
    EMPLOYEES.forEach(emp => {
      if (!emp.newRoom) return;
      if (!m[emp.newRoom]) m[emp.newRoom] = [];
      m[emp.newRoom].push(emp);
      const padded = emp.newRoom.replace(/^(\d)(\D)$/, '0$1$2');
      if (padded !== emp.newRoom) {
        if (!m[padded]) m[padded] = [];
        m[padded].push(emp);
      }
    });
    return m;
  }, []);

  const searchResults = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return EMPLOYEES;
    return EMPLOYEES.filter(e => {
      const name = `${e.first} ${e.last}`.toLowerCase();
      return name.includes(q) || e.dept.toLowerCase().includes(q) || e.oldRoom?.toLowerCase().includes(q) || e.newRoom?.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  const handleSelectEmployee = useCallback((emp) => {
    const oldFl = floorIdForRoom(emp.oldRoom);
    const newFl = floorIdForRoom(emp.newRoom);
    setSelection({ type: 'employee', employees: [emp], oldRoom: emp.oldRoom, newRoom: emp.newRoom });
    if (oldFl) setRightFloor(oldFl);
    if (newFl) setLeftFloor(newFl);
  }, []);

  useEffect(() => {
    if (compareEmployee) handleSelectEmployee(compareEmployee);
  }, [compareEmployee, handleSelectEmployee]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && fullscreen) setFullscreen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [fullscreen]);

  const handleSelectRoom = useCallback((roomId, side) => {
    if (side === 'right') {
      const emps = oldRoomMap[roomId] || [];
      if (!emps.length) return;
      if (floorIdForRoom(roomId)) setRightFloor(floorIdForRoom(roomId));
      const newRooms = [...new Set(emps.map(e => e.newRoom))];
      if (floorIdForRoom(newRooms[0])) setLeftFloor(floorIdForRoom(newRooms[0]));
      setSelection({ type: 'room', employees: emps, oldRoom: roomId, newRooms });
    } else {
      const emps = newRoomMap[roomId] || [];
      if (!emps.length) return;
      if (floorIdForRoom(roomId)) setLeftFloor(floorIdForRoom(roomId));
      const oldRooms = [...new Set(emps.map(e => e.oldRoom).filter(r => r && r !== 'חדש' && r !== 'מזכירות'))];
      if (floorIdForRoom(oldRooms[0])) setRightFloor(floorIdForRoom(oldRooms[0]));
      setSelection({ type: 'room', employees: emps, newRoom: roomId, oldRooms });
    }
  }, [oldRoomMap, newRoomMap]);

  const clearSelection = useCallback(() => setSelection(null), []);

  const selectedOldRooms = useMemo(() => {
    if (!selection) return new Set();
    if (selection.oldRoom) return new Set([selection.oldRoom]);
    if (selection.oldRooms) return new Set(selection.oldRooms);
    return new Set(selection.employees.map(e => e.oldRoom).filter(Boolean));
  }, [selection]);

  const selectedNewRooms = useMemo(() => {
    if (!selection) return new Set();
    if (selection.newRoom) return new Set([selection.newRoom]);
    if (selection.newRooms) return new Set(selection.newRooms);
    return new Set(selection.employees.map(e => e.newRoom).filter(Boolean));
  }, [selection]);

  const selectedEmpIds = useMemo(() => {
    if (!selection) return new Set();
    return new Set(selection.employees.map(e => e.id));
  }, [selection]);

  const rightPlan = FLOOR_PLANS.find(f => f.id === rightFloor);
  const leftPlan = FLOOR_PLANS.find(f => f.id === leftFloor);

  const panelProps = {
    current: {
      title: 'מיקום נוכחי',
      plan: rightPlan, allPlans: FLOOR_PLANS, activePlanId: rightFloor, onChangePlan: setRightFloor,
      imageKey: 'oldImage', roomMap: oldRoomMap,
      highlightedRooms: selectedOldRooms, selectedEmpIds,
      phaseColorMap, movedSet,
      onClickRoom: (rid) => handleSelectRoom(rid, 'right'), onClickEmployee: handleSelectEmployee,
      overlayColor: 'rgba(245, 158, 11, 0.35)', overlayBorder: '#f59e0b',
    },
    target: {
      title: 'מיקום חדש',
      plan: leftPlan, allPlans: FLOOR_PLANS, activePlanId: leftFloor, onChangePlan: setLeftFloor,
      imageKey: 'newImage', roomMap: newRoomMap,
      highlightedRooms: selectedNewRooms, selectedEmpIds,
      phaseColorMap, movedSet,
      onClickRoom: (rid) => handleSelectRoom(rid, 'left'), onClickEmployee: handleSelectEmployee,
      overlayColor: 'rgba(14, 165, 233, 0.35)', overlayBorder: '#0ea5e9',
    },
  };

  const wrapper = fullscreen
    ? 'fixed inset-0 z-50 bg-gray-100 flex flex-col'
    : 'relative';

  return (
    <div className={wrapper} style={fullscreen ? undefined : { height: 'calc(100vh - 220px)' }}>
      {/* Top bar */}
      <div className={`flex items-center px-3 py-1.5 shrink-0 ${fullscreen ? 'bg-gray-900 flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${fullscreen ? 'mr-auto' : 'ml-auto'}`}>
          <button onClick={() => setFullscreen(!fullscreen)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              fullscreen
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
            {fullscreen ? 'יציאה ממסך מלא ✕' : 'מסך מלא ⛶'}
          </button>
        </div>

        {selection && (
          <div className="flex items-center gap-3 animate-fade-in mr-3">
            {selection.employees.map(emp => {
              const isMoved = movedSet.has(emp.id);
              const phase = PHASES.find(p => p.id === emp.phase);
              return (
              <div key={emp.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-2 ${fullscreen ? 'bg-white/10' : 'bg-gray-100 border border-gray-200'}`}>
                {/* Name + dept */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: DEPT_COLORS[emp.dept] || '#6b7280' }} />
                  <span onClick={() => onSelectEmployee(emp)}
                    className={`text-base font-bold cursor-pointer hover:opacity-70 ${fullscreen ? 'text-white' : 'text-gray-900'}`}>
                    {emp.first} {emp.last}
                  </span>
                  <span className={`text-sm ${fullscreen ? 'text-gray-400' : 'text-gray-500'}`}>{emp.dept}</span>
                </div>

                <span className={`text-sm ${fullscreen ? 'text-gray-600' : 'text-gray-300'}`}>|</span>

                {/* Transition: old → new with buildings */}
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-base font-bold font-mono text-amber-600">{emp.oldRoom}</div>
                    <div className={`text-[10px] ${fullscreen ? 'text-gray-500' : 'text-gray-400'}`}>{emp.oldBld}</div>
                  </div>
                  <span className={`text-lg ${fullscreen ? 'text-gray-500' : 'text-gray-400'}`}>←</span>
                  <div className="text-center">
                    <div className="text-base font-bold font-mono text-sky-600">{emp.newRoom}</div>
                    <div className={`text-[10px] ${fullscreen ? 'text-gray-500' : 'text-gray-400'}`}>{emp.newBld}</div>
                  </div>
                </div>

                <span className={`text-sm ${fullscreen ? 'text-gray-600' : 'text-gray-300'}`}>|</span>

                {/* Phase + day/time */}
                <div className="flex items-center gap-2">
                  {phase && (
                    <>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
                      <span className={`text-sm ${fullscreen ? 'text-gray-400' : 'text-gray-500'}`}>
                        {phase.name}
                      </span>
                      <span className={`text-xs ${fullscreen ? 'text-gray-500' : 'text-gray-400'}`}>
                        יום {phase.day === 1 ? "א'" : "ב'"} {phase.time}
                      </span>
                    </>
                  )}
                </div>

                <span className={`text-sm ${fullscreen ? 'text-gray-600' : 'text-gray-300'}`}>|</span>

                {/* Mark as moved */}
                {toggleMoved && (
                  <button onClick={(e) => { e.stopPropagation(); toggleMoved(emp.id); }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      isMoved
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : fullscreen ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                    {isMoved ? '✓ הועבר' : 'סמן כהועבר'}
                  </button>
                )}
              </div>
              );
            })}
            <button onClick={clearSelection} className={`text-xs hover:opacity-70 ${fullscreen ? 'text-gray-400' : 'text-gray-500'}`}>✕</button>
          </div>
        )}
      </div>

      {/* Side by side maps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 flex-1 min-h-0 px-1 pb-1">
        <FloorPanel {...panelProps.current} fullscreen={fullscreen} />
        <FloorPanel {...panelProps.target} fullscreen={fullscreen} />
      </div>
    </div>
  );
}

function FloorPanel({
  title, plan, allPlans, activePlanId, onChangePlan, imageKey,
  roomMap, highlightedRooms, selectedEmpIds, phaseColorMap, movedSet,
  onClickRoom, onClickEmployee, overlayColor, overlayBorder, fullscreen,
}) {
  const floorRooms = useMemo(() => {
    return Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === activePlanId);
  }, [activePlanId]);

  const imageSrc = plan?.[imageKey];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full min-h-0">
      <div className={`px-3 py-1.5 flex items-center gap-3 shrink-0 ${
        title === 'מיקום נוכחי' ? 'bg-amber-50 border-b border-amber-200' : 'bg-sky-50 border-b border-sky-200'
      }`}>
        <span className={`text-xs font-semibold whitespace-nowrap ${
          title === 'מיקום נוכחי' ? 'text-amber-700' : 'text-sky-700'
        }`}>{title}</span>
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {allPlans.map(fp => (
            <button key={fp.id} onClick={() => onChangePlan(fp.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                activePlanId === fp.id ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {fp.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-auto flex-1 min-h-0">
        <div className="relative inline-block min-w-full">
          <img src={imageSrc} alt={plan?.label} className="w-full h-auto block" draggable={false} />
          {floorRooms.map(([roomId, coords]) => {
            const occs = roomMap[roomId] || [];
            const isHighlighted = highlightedRooms.has(roomId);
            return (
              <div key={roomId}>
                {isHighlighted && (
                  <div className="absolute pointer-events-none animate-pulse"
                    style={{
                      left: `${coords.x - (coords.w || 6) / 2 - 1}%`,
                      top: `${coords.y - (coords.h || 6) / 2 - 1}%`,
                      width: `${(coords.w || 6) + 2}%`,
                      height: `${(coords.h || 6) + 2}%`,
                      backgroundColor: overlayColor,
                      border: `4px solid ${overlayBorder}`,
                      borderRadius: '8px',
                      zIndex: 20,
                      boxShadow: `0 0 30px ${overlayColor}, 0 0 60px ${overlayColor}, inset 0 0 20px ${overlayColor}`,
                    }} />
                )}
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: isHighlighted ? 25 : occs.length > 0 ? 10 : 5 }}
                  onClick={() => onClickRoom(roomId)}>
                  <div className={`rounded-lg px-1 py-0.5 backdrop-blur-sm transition-all ${
                    isHighlighted ? 'bg-white border-2 shadow-2xl scale-125'
                    : occs.length > 0 ? 'bg-white/80 border border-gray-400/60 hover:bg-white/95 hover:shadow-md hover:scale-105'
                    : 'bg-gray-200/40 border border-gray-300/30'
                  }`} style={isHighlighted ? { borderColor: overlayBorder, boxShadow: `0 0 12px ${overlayBorder}` } : undefined}>
                    <div className={`font-extrabold text-center leading-none mb-0.5 ${isHighlighted ? 'text-[10px] text-gray-900' : 'text-[8px] text-gray-600'}`}>{roomId}</div>
                    {occs.length > 0 && (
                      <div className="flex flex-wrap gap-px justify-center">
                        {occs.map(emp => {
                          const isEmpSelected = selectedEmpIds.has(emp.id);
                          const pc = phaseColorMap[emp.phase] || '#6b7280';
                          const isMoved = movedSet.has(emp.id);
                          return (
                            <div key={emp.id} className={`flex items-center gap-1 ${isEmpSelected ? 'z-30' : ''}`}>
                            <button onClick={(e) => { e.stopPropagation(); onClickEmployee(emp); }}
                              title={`${emp.first} ${emp.last} — ${emp.dept}`}
                              className={`rounded-full font-bold flex items-center justify-center transition-all ${
                                isEmpSelected ? 'w-[24px] h-[24px] text-[9px] scale-110 ring-2 ring-white shadow-lg' : 'w-[18px] h-[18px] text-[7px] hover:scale-[1.6] hover:z-20'}`}
                              style={{
                                backgroundColor: isMoved ? '#22c55e' : pc, color: 'white',
                                border: isEmpSelected ? `3px solid ${overlayBorder}` : isMoved ? '1.5px solid #16a34a' : '1.5px dashed rgba(255,255,255,0.6)',
                              }}>
                              {isMoved ? '✓' : (emp.first?.[0] || '') + (emp.last?.[0] || '')}
                            </button>
                            {isEmpSelected && (
                              <span className="bg-white/95 backdrop-blur border border-gray-300 rounded px-1.5 py-0.5 text-[10px] font-semibold text-gray-800 shadow-md whitespace-nowrap animate-fade-in"
                                style={{ borderColor: overlayBorder }}>
                                {emp.first} {emp.last}
                              </span>
                            )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
