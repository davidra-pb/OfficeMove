import { useState, useMemo, useCallback } from 'react';
import { PHASES, EMPLOYEES } from '../data/moveData.js';
import { FLOOR_PLANS, ROOM_COORDS, floorIdForRoom } from '../data/roomCoords.js';

const DEPT_COLORS = {
  'כספים':'#3b82f6','הנדסה':'#10b981','התחדשות עירונית':'#f59e0b','כללי':'#6b7280',
  'משפטי':'#8b5cf6','מכירות':'#ef4444','שיווק':'#ec4899','חווית לקוח':'#14b8a6',
  'מניבים':'#f97316','מוקד':'#06b6d4','סיטי הול':'#a855f7','מזכירות':'#78716c','מערכות מידע':'#0ea5e9',
};


export default function Comparison({ movedSet, onSelectEmployee, searchQuery = '' }) {
  const [selection, setSelection] = useState(null);
  const [leftFloor, setLeftFloor] = useState('floor8_ic');
  const [rightFloor, setRightFloor] = useState('floor8_ic');

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
    });
    return m;
  }, []);

  const newRoomMap = useMemo(() => {
    const m = {};
    EMPLOYEES.forEach(emp => {
      if (!emp.newRoom) return;
      if (!m[emp.newRoom]) m[emp.newRoom] = [];
      m[emp.newRoom].push(emp);
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

  return (
    <div className="space-y-3">
      {selection && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-200 p-4 slide-in">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-800">
                  {selection.employees.length === 1 ? `${selection.employees[0].first} ${selection.employees[0].last}` : `${selection.employees.length} עובדים`}
                </span>
                {selection.employees.length === 1 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: DEPT_COLORS[selection.employees[0].dept] || '#6b7280' }}>
                    {selection.employees[0].dept}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selection.employees.map(emp => {
                  const phase = PHASES.find(p => p.id === emp.phase);
                  return (
                    <div key={emp.id} onClick={() => onSelectEmployee(emp)}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEPT_COLORS[emp.dept] || '#6b7280' }} />
                      <span className="text-sm font-medium text-gray-800">{emp.first} {emp.last}</span>
                      <span className="text-gray-400 text-xs">|</span>
                      <span className="text-xs text-red-500 font-mono">{emp.oldRoom}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-xs text-green-600 font-mono font-bold">{emp.newRoom}</span>
                      {phase && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />}
                      {movedSet.has(emp.id) && <span className="text-green-500 text-xs font-bold">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <button onClick={clearSelection} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0">✕ נקה בחירה</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FloorPanel
          title="מיקום חדש" titleColor="bg-gradient-to-l from-green-600 to-emerald-700"
          plan={leftPlan} allPlans={FLOOR_PLANS} activePlanId={leftFloor} onChangePlan={setLeftFloor}
          imageKey="newImage" roomMap={newRoomMap}
          highlightedRooms={selectedNewRooms} selectedEmpIds={selectedEmpIds}
          phaseColorMap={phaseColorMap} movedSet={movedSet}
          onClickRoom={(rid) => handleSelectRoom(rid, 'left')} onClickEmployee={handleSelectEmployee}
          overlayColor="rgba(34, 197, 94, 0.25)" overlayBorder="#22c55e"
        />
        <FloorPanel
          title="מיקום נוכחי" titleColor="bg-gradient-to-l from-red-600 to-rose-700"
          plan={rightPlan} allPlans={FLOOR_PLANS} activePlanId={rightFloor} onChangePlan={setRightFloor}
          imageKey="oldImage" roomMap={oldRoomMap}
          highlightedRooms={selectedOldRooms} selectedEmpIds={selectedEmpIds}
          phaseColorMap={phaseColorMap} movedSet={movedSet}
          onClickRoom={(rid) => handleSelectRoom(rid, 'right')} onClickEmployee={handleSelectEmployee}
          overlayColor="rgba(239, 68, 68, 0.2)" overlayBorder="#ef4444"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-600 mb-3">בחר עובד לצפייה בהשוואה</h3>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
          {searchResults.map(emp => {
            const isSelected = selectedEmpIds.has(emp.id);
            const pc = phaseColorMap[emp.phase] || '#6b7280';
            return (
              <button key={emp.id} onClick={() => handleSelectEmployee(emp)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${isSelected ? 'text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                style={isSelected ? { backgroundColor: pc } : undefined}>
                {emp.first} {emp.last}
                <span className="text-[10px] opacity-70 mr-1">({emp.oldRoom}→{emp.newRoom})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FloorPanel({
  title, titleColor, plan, allPlans, activePlanId, onChangePlan, imageKey,
  roomMap, highlightedRooms, selectedEmpIds, phaseColorMap, movedSet,
  onClickRoom, onClickEmployee, overlayColor, overlayBorder,
}) {
  const floorRooms = useMemo(() => {
    return Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === activePlanId);
  }, [activePlanId]);

  const imageSrc = plan?.[imageKey];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className={`${titleColor} text-white px-4 py-2.5 flex items-center justify-between`}>
        <h3 className="text-base font-bold">{title}</h3>
        <span className="text-sm text-white/70">{plan?.label}</span>
      </div>
      <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {allPlans.map(fp => (
          <button key={fp.id} onClick={() => onChangePlan(fp.id)}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${activePlanId === fp.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {fp.label}
          </button>
        ))}
      </div>
      <div className="relative overflow-auto" style={{ maxHeight: '65vh' }}>
        <div className="relative inline-block min-w-full">
          <img src={imageSrc} alt={plan?.label} className="w-full h-auto block" style={{ minWidth: '500px' }} draggable={false} />
          {floorRooms.map(([roomId, coords]) => {
            const occs = roomMap[roomId] || [];
            const isHighlighted = highlightedRooms.has(roomId);
            return (
              <div key={roomId}>
                {isHighlighted && (
                  <div className="absolute pointer-events-none transition-all duration-300"
                    style={{
                      left: `${coords.x - (coords.w || 6) / 2}%`,
                      top: `${coords.y - (coords.h || 6) / 2}%`,
                      width: `${coords.w || 6}%`,
                      height: `${coords.h || 6}%`,
                      backgroundColor: overlayColor,
                      border: `3px solid ${overlayBorder}`,
                      borderRadius: '6px',
                      zIndex: 20,
                      boxShadow: `0 0 25px ${overlayColor}, 0 0 50px ${overlayColor}`,
                    }} />
                )}
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: isHighlighted ? 25 : occs.length > 0 ? 10 : 5 }}
                  onClick={() => onClickRoom(roomId)}>
                  <div className={`rounded-lg px-1 py-0.5 backdrop-blur-sm transition-all ${
                    isHighlighted ? 'bg-white/95 border-2 shadow-xl scale-110'
                    : occs.length > 0 ? 'bg-white/80 border border-gray-400/60 hover:bg-white/95 hover:shadow-md hover:scale-105'
                    : 'bg-gray-200/40 border border-gray-300/30'
                  }`} style={isHighlighted ? { borderColor: overlayBorder } : undefined}>
                    <div className={`text-[8px] font-extrabold text-center leading-none mb-0.5 ${isHighlighted ? 'text-gray-900' : 'text-gray-600'}`}>{roomId}</div>
                    {occs.length > 0 && (
                      <div className="flex flex-wrap gap-px justify-center">
                        {occs.map(emp => {
                          const isEmpSelected = selectedEmpIds.has(emp.id);
                          const pc = phaseColorMap[emp.phase] || '#6b7280';
                          const isMoved = movedSet.has(emp.id);
                          return (
                            <button key={emp.id} onClick={(e) => { e.stopPropagation(); onClickEmployee(emp); }}
                              title={`${emp.first} ${emp.last} — ${emp.dept}`}
                              className={`w-[18px] h-[18px] rounded-full text-[7px] font-bold flex items-center justify-center transition-transform ${
                                isEmpSelected ? 'scale-150 ring-2 ring-white shadow-lg z-30' : 'hover:scale-[1.6] hover:z-20'}`}
                              style={{
                                backgroundColor: isMoved ? '#22c55e' : pc, color: 'white',
                                border: isEmpSelected ? `2px solid ${overlayBorder}` : isMoved ? '1.5px solid #16a34a' : '1.5px dashed rgba(255,255,255,0.6)',
                              }}>
                              {isMoved ? '✓' : (emp.first?.[0] || '') + (emp.last?.[0] || '')}
                            </button>
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
