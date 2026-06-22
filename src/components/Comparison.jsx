import { useState, useMemo, useCallback } from 'react';
import { PHASES, EMPLOYEES } from '../data/moveData.js';

const FLOOR_PLANS = [
  { id: 'floor8_ic', building: 'ישראל קנדה', floor: 8, image: '/floors/floor8_ic.jpeg', label: 'קומה 8 ישראל קנדה' },
  { id: 'floor6_ic', building: 'ישראל קנדה', floor: 6, image: '/floors/floor6_ic.jpeg', label: 'קומה 6 ישראל קנדה' },
  { id: 'floor8_acro', building: 'אקרו', floor: 8, image: '/floors/floor8_acro.jpeg', label: 'קומה 8 אקרו' },
  { id: 'floor7_acro', building: 'אקרו', floor: 7, image: '/floors/floor7_acro.jpeg', label: 'קומה 7 אקרו' },
];

function floorIdFor(building, floor) {
  if (!building || !floor) return null;
  if (building === 'ישראל קנדה' && floor === 8) return 'floor8_ic';
  if (building === 'ישראל קנדה' && floor === 6) return 'floor6_ic';
  if (building === 'אקרו' && floor === 8) return 'floor8_acro';
  if (building === 'אקרו' && floor === 7) return 'floor7_acro';
  return null;
}

function floorIdForRoom(roomId) {
  if (!roomId) return null;
  const letter = roomId.slice(-1);
  if (letter === 'A') return 'floor8_ic';
  if (letter === 'B' || letter === 'C') return 'floor6_ic';
  if (letter === 'D') return 'floor8_acro';
  if (letter === 'E') return 'floor7_acro';
  return null;
}

// Room coordinates — same as FloorMap.jsx
const ROOM_COORDS = {
  '01A':{x:4,y:16,floor:'floor8_ic'},'02A':{x:13,y:6,floor:'floor8_ic'},'03A':{x:17,y:6,floor:'floor8_ic'},'04A':{x:24,y:6,floor:'floor8_ic'},'05A':{x:34,y:6,floor:'floor8_ic'},'06A':{x:38,y:6,floor:'floor8_ic'},'07A':{x:49,y:6,floor:'floor8_ic'},'08A':{x:56,y:6,floor:'floor8_ic'},
  '09A':{x:88,y:5,floor:'floor8_ic'},'10A':{x:93,y:5,floor:'floor8_ic'},'11A':{x:93,y:14,floor:'floor8_ic'},'12A':{x:93,y:22,floor:'floor8_ic'},'13A':{x:93,y:30,floor:'floor8_ic'},'14A':{x:93,y:40,floor:'floor8_ic'},'15A':{x:93,y:52,floor:'floor8_ic'},'16A':{x:93,y:62,floor:'floor8_ic'},
  '17A':{x:80,y:62,floor:'floor8_ic'},'18A':{x:70,y:62,floor:'floor8_ic'},'19A':{x:60,y:62,floor:'floor8_ic'},'20A':{x:52,y:58,floor:'floor8_ic'},'21A':{x:44,y:58,floor:'floor8_ic'},'22A':{x:18,y:58,floor:'floor8_ic'},'23A':{x:8,y:58,floor:'floor8_ic'},
  '24A':{x:4,y:58,floor:'floor8_ic'},'25A':{x:4,y:48,floor:'floor8_ic'},'26A':{x:4,y:38,floor:'floor8_ic'},'27A':{x:4,y:30,floor:'floor8_ic'},'28A':{x:4,y:22,floor:'floor8_ic'},
  '1B':{x:52,y:6,floor:'floor6_ic'},'2B':{x:42,y:6,floor:'floor6_ic'},'3B':{x:30,y:6,floor:'floor6_ic'},'4B':{x:22,y:12,floor:'floor6_ic'},'5B':{x:14,y:12,floor:'floor6_ic'},'6B':{x:6,y:8,floor:'floor6_ic'},'7B':{x:4,y:22,floor:'floor6_ic'},'8B':{x:4,y:32,floor:'floor6_ic'},'9B':{x:4,y:42,floor:'floor6_ic'},'10B':{x:4,y:52,floor:'floor6_ic'},
  '11B':{x:14,y:80,floor:'floor6_ic'},'12B':{x:24,y:80,floor:'floor6_ic'},'13B':{x:34,y:80,floor:'floor6_ic'},'14B':{x:44,y:80,floor:'floor6_ic'},
  '1C':{x:90,y:10,floor:'floor6_ic'},'2C':{x:90,y:18,floor:'floor6_ic'},'3C':{x:90,y:28,floor:'floor6_ic'},'4C':{x:90,y:38,floor:'floor6_ic'},'5C':{x:90,y:48,floor:'floor6_ic'},'8C':{x:90,y:56,floor:'floor6_ic'},'9C':{x:90,y:64,floor:'floor6_ic'},'10C':{x:62,y:18,floor:'floor6_ic'},
  '22D':{x:92,y:7,floor:'floor8_acro'},'23D':{x:82,y:7,floor:'floor8_acro'},'24D':{x:68,y:7,floor:'floor8_acro'},'25D':{x:60,y:7,floor:'floor8_acro'},'26D':{x:50,y:7,floor:'floor8_acro'},'27D':{x:40,y:7,floor:'floor8_acro'},'29D':{x:20,y:7,floor:'floor8_acro'},
  '30D':{x:5,y:15,floor:'floor8_acro'},'31D':{x:5,y:23,floor:'floor8_acro'},'32D':{x:5,y:31,floor:'floor8_acro'},'33D':{x:5,y:39,floor:'floor8_acro'},'34D':{x:5,y:45,floor:'floor8_acro'},'35D':{x:5,y:53,floor:'floor8_acro'},'36D':{x:5,y:60,floor:'floor8_acro'},
  '2D':{x:5,y:72,floor:'floor8_acro'},'3D':{x:14,y:82,floor:'floor8_acro'},'4D':{x:22,y:82,floor:'floor8_acro'},'5D':{x:30,y:82,floor:'floor8_acro'},'6D':{x:38,y:82,floor:'floor8_acro'},'7D':{x:46,y:82,floor:'floor8_acro'},'8D':{x:54,y:82,floor:'floor8_acro'},'9D':{x:62,y:82,floor:'floor8_acro'},'10D':{x:70,y:82,floor:'floor8_acro'},'11D':{x:78,y:82,floor:'floor8_acro'},'12D':{x:86,y:82,floor:'floor8_acro'},
  '13D':{x:95,y:70,floor:'floor8_acro'},'14D':{x:95,y:60,floor:'floor8_acro'},'16D':{x:95,y:50,floor:'floor8_acro'},'17D':{x:95,y:40,floor:'floor8_acro'},'18D':{x:95,y:30,floor:'floor8_acro'},'19D':{x:95,y:20,floor:'floor8_acro'},'20D':{x:95,y:12,floor:'floor8_acro'},'21D':{x:95,y:12,floor:'floor8_acro'},
  '1E':{x:93,y:7,floor:'floor7_acro'},'2E':{x:84,y:7,floor:'floor7_acro'},'3E':{x:76,y:7,floor:'floor7_acro'},'4E':{x:62,y:7,floor:'floor7_acro'},'5E':{x:54,y:7,floor:'floor7_acro'},'6E':{x:46,y:7,floor:'floor7_acro'},'7E':{x:38,y:7,floor:'floor7_acro'},'8E':{x:30,y:7,floor:'floor7_acro'},'9E':{x:22,y:7,floor:'floor7_acro'},'10E':{x:14,y:7,floor:'floor7_acro'},'11E':{x:6,y:7,floor:'floor7_acro'},
  '13E':{x:6,y:24,floor:'floor7_acro'},'14E':{x:93,y:24,floor:'floor7_acro'},
};

const DEPT_COLORS = {
  'כספים':'#3b82f6','הנדסה':'#10b981','התחדשות עירונית':'#f59e0b','כללי':'#6b7280',
  'משפטי':'#8b5cf6','מכירות':'#ef4444','שיווק':'#ec4899','חווית לקוח':'#14b8a6',
  'מניבים':'#f97316','מוקד':'#06b6d4','סיטי הול':'#a855f7','מזכירות':'#78716c','מערכות מידע':'#0ea5e9',
};

const OVERLAY_SIZE = { w: 8, h: 10 };

export default function Comparison({ movedSet, onSelectEmployee, searchQuery = '' }) {
  const [selection, setSelection] = useState(null);
  const [leftFloor, setLeftFloor] = useState('floor8_ic');
  const [rightFloor, setRightFloor] = useState('floor8_ic');

  const phaseColorMap = useMemo(() => {
    const m = {};
    PHASES.forEach(p => { m[p.id] = p.color; });
    return m;
  }, []);

  // Build lookups
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
      const r = emp.newRoom;
      if (!r) return;
      if (!m[r]) m[r] = [];
      m[r].push(emp);
    });
    return m;
  }, []);

  // Filtered employee list for search
  const searchResults = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return EMPLOYEES;
    return EMPLOYEES.filter(e => {
      const name = `${e.first} ${e.last}`.toLowerCase();
      return name.includes(q) || e.dept.toLowerCase().includes(q) || e.oldRoom?.toLowerCase().includes(q) || e.newRoom?.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  const handleSelectEmployee = useCallback((emp) => {
    const oldFloorId = floorIdForRoom(emp.oldRoom);
    const newFloorId = floorIdForRoom(emp.newRoom);
    setSelection({ type: 'employee', employees: [emp], oldRoom: emp.oldRoom, newRoom: emp.newRoom });
    if (oldFloorId) setRightFloor(oldFloorId);
    if (newFloorId) setLeftFloor(newFloorId);
  }, []);

  const handleSelectRoom = useCallback((roomId, side) => {
    if (side === 'right') {
      const emps = oldRoomMap[roomId] || [];
      if (emps.length === 0) return;
      const oldFloorId = floorIdForRoom(roomId);
      if (oldFloorId) setRightFloor(oldFloorId);
      const newRooms = [...new Set(emps.map(e => e.newRoom))];
      const firstNewFloor = floorIdForRoom(newRooms[0]);
      if (firstNewFloor) setLeftFloor(firstNewFloor);
      setSelection({ type: 'room', employees: emps, oldRoom: roomId, newRooms });
    } else {
      const emps = newRoomMap[roomId] || [];
      if (emps.length === 0) return;
      const newFloorId = floorIdForRoom(roomId);
      if (newFloorId) setLeftFloor(newFloorId);
      const oldRooms = [...new Set(emps.map(e => e.oldRoom).filter(r => r && r !== 'חדש' && r !== 'מזכירות'))];
      const firstOldFloor = floorIdForRoom(oldRooms[0]);
      if (firstOldFloor) setRightFloor(firstOldFloor);
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
      {/* Info card for selected employee(s) */}
      {selection && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-200 p-4 slide-in">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-800">
                  {selection.employees.length === 1
                    ? `${selection.employees[0].first} ${selection.employees[0].last}`
                    : `${selection.employees.length} עובדים`
                  }
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
                    <div key={emp.id}
                      onClick={() => { onSelectEmployee(emp); }}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                    >
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
            <button onClick={clearSelection} className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0">
              ✕ נקה בחירה
            </button>
          </div>
        </div>
      )}

      {/* Split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* LEFT: New Position */}
        <FloorPanel
          side="left"
          title="מיקום חדש"
          titleColor="bg-gradient-to-l from-green-600 to-emerald-700"
          plan={leftPlan}
          allPlans={FLOOR_PLANS}
          activePlanId={leftFloor}
          onChangePlan={setLeftFloor}
          roomMap={newRoomMap}
          highlightedRooms={selectedNewRooms}
          selectedEmpIds={selectedEmpIds}
          phaseColorMap={phaseColorMap}
          movedSet={movedSet}
          onClickRoom={(roomId) => handleSelectRoom(roomId, 'left')}
          onClickEmployee={handleSelectEmployee}
          overlayColor="rgba(34, 197, 94, 0.25)"
          overlayBorder="#22c55e"
        />

        {/* RIGHT: Current Position */}
        <FloorPanel
          side="right"
          title="מיקום נוכחי"
          titleColor="bg-gradient-to-l from-red-600 to-rose-700"
          plan={rightPlan}
          allPlans={FLOOR_PLANS}
          activePlanId={rightFloor}
          onChangePlan={setRightFloor}
          roomMap={oldRoomMap}
          highlightedRooms={selectedOldRooms}
          selectedEmpIds={selectedEmpIds}
          phaseColorMap={phaseColorMap}
          movedSet={movedSet}
          onClickRoom={(roomId) => handleSelectRoom(roomId, 'right')}
          onClickEmployee={handleSelectEmployee}
          overlayColor="rgba(239, 68, 68, 0.2)"
          overlayBorder="#ef4444"
        />
      </div>

      {/* Employee list below for quick selection */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-600 mb-3">בחר עובד לצפייה בהשוואה</h3>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
          {searchResults.map(emp => {
            const isSelected = selectedEmpIds.has(emp.id);
            const pc = phaseColorMap[emp.phase] || '#6b7280';
            return (
              <button
                key={emp.id}
                onClick={() => handleSelectEmployee(emp)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={isSelected ? { backgroundColor: pc } : undefined}
              >
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
  side, title, titleColor, plan, allPlans, activePlanId, onChangePlan,
  roomMap, highlightedRooms, selectedEmpIds, phaseColorMap, movedSet,
  onClickRoom, onClickEmployee, overlayColor, overlayBorder,
}) {
  const floorRooms = useMemo(() => {
    return Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === activePlanId);
  }, [activePlanId]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${titleColor} text-white px-4 py-2.5 flex items-center justify-between`}>
        <h3 className="text-base font-bold">{title}</h3>
        <span className="text-sm text-white/70">{plan?.label}</span>
      </div>

      {/* Floor tabs */}
      <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {allPlans.map(fp => (
          <button
            key={fp.id}
            onClick={() => onChangePlan(fp.id)}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
              activePlanId === fp.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {fp.label}
          </button>
        ))}
      </div>

      {/* Floor plan with overlays */}
      <div className="relative overflow-auto" style={{ maxHeight: '65vh' }}>
        <div className="relative inline-block min-w-full">
          <img src={plan?.image} alt={plan?.label} className="w-full h-auto block" style={{ minWidth: '500px' }} draggable={false} />

          {/* Room markers and overlays */}
          {floorRooms.map(([roomId, coords]) => {
            const occs = roomMap[roomId] || [];
            const isHighlighted = highlightedRooms.has(roomId);

            return (
              <div key={roomId}>
                {/* Colored overlay when highlighted */}
                {isHighlighted && (
                  <div
                    className="absolute pointer-events-none transition-all duration-300"
                    style={{
                      left: `${coords.x - OVERLAY_SIZE.w / 2}%`,
                      top: `${coords.y - OVERLAY_SIZE.h / 2}%`,
                      width: `${OVERLAY_SIZE.w}%`,
                      height: `${OVERLAY_SIZE.h}%`,
                      backgroundColor: overlayColor,
                      border: `3px solid ${overlayBorder}`,
                      borderRadius: '8px',
                      zIndex: 20,
                      boxShadow: `0 0 20px ${overlayColor}, 0 0 40px ${overlayColor}`,
                    }}
                  />
                )}

                {/* Room marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    zIndex: isHighlighted ? 25 : occs.length > 0 ? 10 : 5,
                  }}
                  onClick={() => onClickRoom(roomId)}
                >
                  <div
                    className={`rounded-lg px-1 py-0.5 backdrop-blur-sm transition-all ${
                      isHighlighted
                        ? 'bg-white/95 border-2 shadow-xl scale-110'
                        : occs.length > 0
                          ? 'bg-white/80 border border-gray-400/60 hover:bg-white/95 hover:shadow-md hover:scale-105'
                          : 'bg-gray-200/40 border border-gray-300/30'
                    }`}
                    style={isHighlighted ? { borderColor: overlayBorder } : undefined}
                  >
                    <div className={`text-[8px] font-extrabold text-center leading-none mb-0.5 ${isHighlighted ? 'text-gray-900' : 'text-gray-600'}`}>
                      {roomId}
                    </div>
                    {occs.length > 0 && (
                      <div className="flex flex-wrap gap-px justify-center">
                        {occs.map(emp => {
                          const isEmpSelected = selectedEmpIds.has(emp.id);
                          const pc = phaseColorMap[emp.phase] || '#6b7280';
                          const isMoved = movedSet.has(emp.id);
                          return (
                            <button
                              key={emp.id}
                              onClick={(e) => { e.stopPropagation(); onClickEmployee(emp); }}
                              title={`${emp.first} ${emp.last} — ${emp.dept}`}
                              className={`w-[18px] h-[18px] rounded-full text-[7px] font-bold flex items-center justify-center transition-transform ${
                                isEmpSelected ? 'scale-150 ring-2 ring-white shadow-lg z-30' : 'hover:scale-[1.6] hover:z-20'
                              }`}
                              style={{
                                backgroundColor: isMoved ? '#22c55e' : pc,
                                color: 'white',
                                border: isEmpSelected ? `2px solid ${overlayBorder}` : isMoved ? '1.5px solid #16a34a' : '1.5px dashed rgba(255,255,255,0.6)',
                              }}
                            >
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
