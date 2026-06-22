import { useState, useMemo } from 'react';
import { PHASES } from '../data/moveData.js';

const FLOOR_PLANS = [
  { id: 'floor8_ic', building: 'ישראל קנדה', floor: 8, image: '/floors/floor8_ic.jpeg', label: 'קומה 8 — ישראל קנדה' },
  { id: 'floor6_ic', building: 'ישראל קנדה', floor: 6, image: '/floors/floor6_ic.jpeg', label: 'קומה 6 — ישראל קנדה' },
  { id: 'floor8_acro', building: 'אקרו', floor: 8, image: '/floors/floor8_acro.jpeg', label: 'קומה 8 — אקרו' },
  { id: 'floor7_acro', building: 'אקרו', floor: 7, image: '/floors/floor7_acro.jpeg', label: 'קומה 7 — אקרו' },
];

// Room coordinates (x%, y%) mapped from the AutoCAD floor plans.
// Position = center of the room on the floor plan image.
const ROOM_COORDS = {
  // ── Floor 8, Israel Canada (A rooms) ──
  // Top row left to right
  '01A': { x: 4, y: 16, floor: 'floor8_ic' },
  '02A': { x: 13, y: 6, floor: 'floor8_ic' },
  '03A': { x: 17, y: 6, floor: 'floor8_ic' },
  '04A': { x: 24, y: 6, floor: 'floor8_ic' },
  '05A': { x: 34, y: 6, floor: 'floor8_ic' },
  '06A': { x: 38, y: 6, floor: 'floor8_ic' },
  '07A': { x: 49, y: 6, floor: 'floor8_ic' },
  '08A': { x: 56, y: 6, floor: 'floor8_ic' },
  // Right side top to bottom
  '09A': { x: 88, y: 5, floor: 'floor8_ic' },
  '10A': { x: 93, y: 5, floor: 'floor8_ic' },
  '11A': { x: 93, y: 14, floor: 'floor8_ic' },
  '12A': { x: 93, y: 22, floor: 'floor8_ic' },
  '13A': { x: 93, y: 30, floor: 'floor8_ic' },
  '14A': { x: 93, y: 40, floor: 'floor8_ic' },
  '15A': { x: 93, y: 52, floor: 'floor8_ic' },
  '16A': { x: 93, y: 62, floor: 'floor8_ic' },
  // Bottom row right to left
  '17A': { x: 80, y: 62, floor: 'floor8_ic' },
  '18A': { x: 70, y: 62, floor: 'floor8_ic' },
  '19A': { x: 60, y: 62, floor: 'floor8_ic' },
  '20A': { x: 52, y: 58, floor: 'floor8_ic' },
  '21A': { x: 44, y: 58, floor: 'floor8_ic' },
  '22A': { x: 18, y: 58, floor: 'floor8_ic' },
  '23A': { x: 8, y: 58, floor: 'floor8_ic' },
  // Left side bottom to top
  '24A': { x: 4, y: 58, floor: 'floor8_ic' },
  '25A': { x: 4, y: 48, floor: 'floor8_ic' },
  '26A': { x: 4, y: 38, floor: 'floor8_ic' },
  '27A': { x: 4, y: 30, floor: 'floor8_ic' },
  '28A': { x: 4, y: 22, floor: 'floor8_ic' },

  // ── Floor 6, Israel Canada (B rooms — left/top area) ──
  '1B': { x: 52, y: 6, floor: 'floor6_ic' },
  '2B': { x: 42, y: 6, floor: 'floor6_ic' },
  '3B': { x: 30, y: 6, floor: 'floor6_ic' },
  '4B': { x: 22, y: 12, floor: 'floor6_ic' },
  '5B': { x: 14, y: 12, floor: 'floor6_ic' },
  '6B': { x: 6, y: 8, floor: 'floor6_ic' },
  '7B': { x: 4, y: 22, floor: 'floor6_ic' },
  '8B': { x: 4, y: 32, floor: 'floor6_ic' },
  '9B': { x: 4, y: 42, floor: 'floor6_ic' },
  '10B': { x: 4, y: 52, floor: 'floor6_ic' },
  '11B': { x: 14, y: 80, floor: 'floor6_ic' },
  '12B': { x: 24, y: 80, floor: 'floor6_ic' },
  '13B': { x: 34, y: 80, floor: 'floor6_ic' },
  '14B': { x: 44, y: 80, floor: 'floor6_ic' },

  // ── Floor 6, Israel Canada (C rooms — right area) ──
  '1C': { x: 90, y: 10, floor: 'floor6_ic' },
  '2C': { x: 90, y: 18, floor: 'floor6_ic' },
  '3C': { x: 90, y: 28, floor: 'floor6_ic' },
  '4C': { x: 90, y: 38, floor: 'floor6_ic' },
  '5C': { x: 90, y: 48, floor: 'floor6_ic' },
  '8C': { x: 90, y: 56, floor: 'floor6_ic' },
  '9C': { x: 90, y: 64, floor: 'floor6_ic' },
  '10C': { x: 62, y: 18, floor: 'floor6_ic' },

  // ── Floor 8, Acro (D rooms) ──
  // Top row right to left
  '22D': { x: 92, y: 7, floor: 'floor8_acro' },
  '23D': { x: 82, y: 7, floor: 'floor8_acro' },
  '24D': { x: 68, y: 7, floor: 'floor8_acro' },
  '25D': { x: 60, y: 7, floor: 'floor8_acro' },
  '26D': { x: 50, y: 7, floor: 'floor8_acro' },
  '27D': { x: 40, y: 7, floor: 'floor8_acro' },
  '29D': { x: 20, y: 7, floor: 'floor8_acro' },
  // Left side top to bottom
  '30D': { x: 5, y: 15, floor: 'floor8_acro' },
  '31D': { x: 5, y: 23, floor: 'floor8_acro' },
  '32D': { x: 5, y: 31, floor: 'floor8_acro' },
  '33D': { x: 5, y: 39, floor: 'floor8_acro' },
  '34D': { x: 5, y: 45, floor: 'floor8_acro' },
  '35D': { x: 5, y: 53, floor: 'floor8_acro' },
  '36D': { x: 5, y: 60, floor: 'floor8_acro' },
  // Bottom row left to right
  '2D': { x: 5, y: 72, floor: 'floor8_acro' },
  '3D': { x: 14, y: 82, floor: 'floor8_acro' },
  '4D': { x: 22, y: 82, floor: 'floor8_acro' },
  '5D': { x: 30, y: 82, floor: 'floor8_acro' },
  '6D': { x: 38, y: 82, floor: 'floor8_acro' },
  '7D': { x: 46, y: 82, floor: 'floor8_acro' },
  '8D': { x: 54, y: 82, floor: 'floor8_acro' },
  '9D': { x: 62, y: 82, floor: 'floor8_acro' },
  '10D': { x: 70, y: 82, floor: 'floor8_acro' },
  '11D': { x: 78, y: 82, floor: 'floor8_acro' },
  '12D': { x: 86, y: 82, floor: 'floor8_acro' },
  // Right side bottom to top
  '13D': { x: 95, y: 70, floor: 'floor8_acro' },
  '14D': { x: 95, y: 60, floor: 'floor8_acro' },
  '16D': { x: 95, y: 50, floor: 'floor8_acro' },
  '17D': { x: 95, y: 40, floor: 'floor8_acro' },
  '18D': { x: 95, y: 30, floor: 'floor8_acro' },
  '19D': { x: 95, y: 20, floor: 'floor8_acro' },
  '20D': { x: 95, y: 12, floor: 'floor8_acro' },
  '21D': { x: 95, y: 12, floor: 'floor8_acro' },

  // ── Floor 7, Acro (E rooms) ──
  // Top row right to left
  '1E': { x: 93, y: 7, floor: 'floor7_acro' },
  '2E': { x: 84, y: 7, floor: 'floor7_acro' },
  '3E': { x: 76, y: 7, floor: 'floor7_acro' },
  '4E': { x: 62, y: 7, floor: 'floor7_acro' },
  '5E': { x: 54, y: 7, floor: 'floor7_acro' },
  '6E': { x: 46, y: 7, floor: 'floor7_acro' },
  '7E': { x: 38, y: 7, floor: 'floor7_acro' },
  '8E': { x: 30, y: 7, floor: 'floor7_acro' },
  '9E': { x: 22, y: 7, floor: 'floor7_acro' },
  '10E': { x: 14, y: 7, floor: 'floor7_acro' },
  '11E': { x: 6, y: 7, floor: 'floor7_acro' },
  '13E': { x: 6, y: 24, floor: 'floor7_acro' },
  '14E': { x: 93, y: 24, floor: 'floor7_acro' },
};

export default function FloorMap({
  employees,
  phases = PHASES,
  movedSet,
  onSelectEmployee,
  searchQuery = '',
  dayFilter = null,
}) {
  const [activeFloor, setActiveFloor] = useState('floor8_ic');
  const [viewMode, setViewMode] = useState('new');

  const phaseColorMap = useMemo(() => {
    const map = {};
    phases.forEach(p => { map[p.id] = p.color; });
    return map;
  }, [phases]);

  const phaseDayMap = useMemo(() => {
    const map = {};
    phases.forEach(p => { map[p.id] = p.day; });
    return map;
  }, [phases]);

  const visibleEmployees = useMemo(() => {
    let emps = employees;
    if (dayFilter !== null) {
      emps = emps.filter(e => phaseDayMap[e.phase] === dayFilter);
    }
    return emps;
  }, [employees, dayFilter, phaseDayMap]);

  const roomOccupants = useMemo(() => {
    const map = {};
    visibleEmployees.forEach(emp => {
      const room = viewMode === 'new' ? emp.newRoom : emp.oldRoom;
      if (!room || room === 'חדש' || room === 'מזכירות') return;
      if (!map[room]) map[room] = [];
      map[room].push(emp);
    });
    return map;
  }, [visibleEmployees, viewMode]);

  const matchingRooms = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return null;
    const set = new Set();
    Object.keys(ROOM_COORDS).forEach(roomId => {
      if (roomId.toLowerCase().includes(q)) set.add(roomId);
      (roomOccupants[roomId] || []).forEach(emp => {
        const name = `${emp.first} ${emp.last}`.toLowerCase();
        if (name.includes(q) || (emp.dept || '').toLowerCase().includes(q)) set.add(roomId);
      });
    });
    return set;
  }, [searchQuery, roomOccupants]);

  const getInitials = (emp) => (emp.first?.[0] || '') + (emp.last?.[0] || '');

  const currentPlan = FLOOR_PLANS.find(f => f.id === activeFloor);

  const floorRooms = useMemo(() => {
    return Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === activeFloor);
  }, [activeFloor]);

  const floorStats = useMemo(() => {
    let total = 0, moved = 0;
    floorRooms.forEach(([roomId]) => {
      const occs = roomOccupants[roomId] || [];
      total += occs.length;
      moved += occs.filter(e => movedSet.has(e.id)).length;
    });
    return { total, moved };
  }, [floorRooms, roomOccupants, movedSet]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {FLOOR_PLANS.map(fp => {
            const isActive = activeFloor === fp.id;
            const floorRoomIds = Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === fp.id).map(([id]) => id);
            const empCount = floorRoomIds.reduce((sum, rid) => sum + (roomOccupants[rid]?.length || 0), 0);
            return (
              <button
                key={fp.id}
                onClick={() => setActiveFloor(fp.id)}
                className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {fp.label}
                {empCount > 0 && (
                  <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-gray-300 text-gray-600'}`}>
                    {empCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setViewMode('new')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'new' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
            מיקום יעד (חדש)
          </button>
          <button onClick={() => setViewMode('old')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'old' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>
            מיקום נוכחי (ישן)
          </button>
        </div>

        <div className="mr-auto text-sm text-gray-500">
          <span className="font-bold text-gray-700">{floorStats.moved}</span> / {floorStats.total} הועברו בקומה זו
        </div>
      </div>

      {/* Phase legend */}
      <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] font-bold text-gray-400 ml-2">שלבים:</span>
        {phases.map(p => (
          <span key={p.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: p.color }}>
            {p.id}
          </span>
        ))}
        <span className="mx-2 text-gray-300">|</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-3 rounded border-2 border-green-500 bg-green-100 inline-block" /> הכל הועברו
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-3 rounded border-2 border-yellow-400 bg-yellow-50 inline-block" /> חלק
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <span className="w-3 h-3 rounded-full bg-green-500 text-white text-[7px] inline-flex items-center justify-center" style={{ width: 12, height: 12 }}>✓</span> הועבר
        </span>
      </div>

      {/* Floor plan image with overlays */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{currentPlan?.label}</h2>
          <span className="text-indigo-200 text-sm">{viewMode === 'new' ? '🎯 יעד' : '📍 נוכחי'}</span>
        </div>

        <div className="relative overflow-auto" style={{ maxHeight: '78vh' }}>
          <div className="relative inline-block min-w-full">
            <img src={currentPlan?.image} alt={currentPlan?.label} className="w-full h-auto block" style={{ minWidth: '900px' }} draggable={false} />

            {floorRooms.map(([roomId, coords]) => {
              const occs = roomOccupants[roomId] || [];
              const isHighlighted = matchingRooms?.has(roomId);
              const allMoved = occs.length > 0 && occs.every(e => movedSet.has(e.id));
              const someMoved = occs.some(e => movedSet.has(e.id));

              return (
                <div
                  key={roomId}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: isHighlighted ? 30 : occs.length > 0 ? 15 : 5 }}
                >
                  <div
                    className={`rounded-lg px-1 py-0.5 backdrop-blur-sm transition-all ${
                      occs.length === 0
                        ? 'bg-gray-300/40 border border-gray-400/30'
                        : allMoved
                          ? 'bg-green-100/95 border-2 border-green-500 shadow-lg shadow-green-200/50'
                          : someMoved
                            ? 'bg-yellow-50/95 border-2 border-yellow-400 shadow-md'
                            : 'bg-white/95 border-2 border-indigo-300 shadow-md'
                    } ${isHighlighted ? 'ring-3 ring-indigo-500 ring-offset-1 scale-125' : ''}`}
                    style={{ minWidth: occs.length > 2 ? '50px' : '36px' }}
                  >
                    <div className="text-[8px] font-extrabold text-gray-700 text-center leading-none mb-0.5">{roomId}</div>
                    {occs.length > 0 && (
                      <div className="flex flex-wrap gap-px justify-center">
                        {occs.map(emp => {
                          const isMoved = movedSet.has(emp.id);
                          const pc = phaseColorMap[emp.phase] || '#6b7280';
                          return (
                            <button
                              key={emp.id}
                              onClick={() => onSelectEmployee(emp)}
                              title={`${emp.first} ${emp.last} — ${emp.dept}`}
                              className="w-[18px] h-[18px] rounded-full text-[7px] font-bold flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.8] hover:z-30"
                              style={{
                                backgroundColor: isMoved ? '#22c55e' : pc,
                                color: 'white',
                                border: isMoved ? '1.5px solid #16a34a' : `1.5px dashed rgba(255,255,255,0.6)`,
                              }}
                            >
                              {isMoved ? '✓' : getInitials(emp)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
