import { useState, useMemo } from 'react';
import { PHASES } from '../data/moveData.js';
import { FLOOR_PLANS, ROOM_COORDS } from '../data/roomCoords.js';

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
    const m = {};
    phases.forEach(p => { m[p.id] = p.color; });
    return m;
  }, [phases]);

  const phaseDayMap = useMemo(() => {
    const m = {};
    phases.forEach(p => { m[p.id] = p.day; });
    return m;
  }, [phases]);

  const visibleEmployees = useMemo(() => {
    if (dayFilter === null) return employees;
    return employees.filter(e => phaseDayMap[e.phase] === dayFilter);
  }, [employees, dayFilter, phaseDayMap]);

  const roomOccupants = useMemo(() => {
    const m = {};
    visibleEmployees.forEach(emp => {
      const room = viewMode === 'new' ? emp.newRoom : emp.oldRoom;
      if (!room || room === 'חדש' || room === 'מזכירות') return;
      if (!m[room]) m[room] = [];
      m[room].push(emp);
    });
    return m;
  }, [visibleEmployees, viewMode]);

  const matchingRooms = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return null;
    const set = new Set();
    Object.keys(ROOM_COORDS).forEach(rid => {
      if (rid.toLowerCase().includes(q)) set.add(rid);
      (roomOccupants[rid] || []).forEach(emp => {
        const name = `${emp.first} ${emp.last}`.toLowerCase();
        if (name.includes(q) || (emp.dept || '').toLowerCase().includes(q)) set.add(rid);
      });
    });
    return set;
  }, [searchQuery, roomOccupants]);

  const getInitials = (emp) => (emp.first?.[0] || '') + (emp.last?.[0] || '');
  const currentPlan = FLOOR_PLANS.find(f => f.id === activeFloor);
  const imageSrc = viewMode === 'new' ? currentPlan?.newImage : currentPlan?.oldImage;

  const floorRooms = useMemo(() => {
    return Object.entries(ROOM_COORDS).filter(([, c]) => c.floor === activeFloor);
  }, [activeFloor]);

  const floorStats = useMemo(() => {
    let total = 0, moved = 0;
    floorRooms.forEach(([rid]) => {
      const occs = roomOccupants[rid] || [];
      total += occs.length;
      moved += occs.filter(e => movedSet.has(e.id)).length;
    });
    return { total, moved };
  }, [floorRooms, roomOccupants, movedSet]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {FLOOR_PLANS.map(fp => {
            const isActive = activeFloor === fp.id;
            const count = Object.entries(ROOM_COORDS)
              .filter(([, c]) => c.floor === fp.id)
              .reduce((s, [rid]) => s + (roomOccupants[rid]?.length || 0), 0);
            return (
              <button key={fp.id} onClick={() => setActiveFloor(fp.id)}
                className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                {fp.label}
                {count > 0 && <span className={`mr-1 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-indigo-500 text-indigo-100' : 'bg-gray-300 text-gray-600'}`}>{count}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setViewMode('new')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'new' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>מיקום יעד (חדש)</button>
          <button onClick={() => setViewMode('old')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'old' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>מיקום נוכחי (ישן)</button>
        </div>
        <div className="mr-auto text-sm text-gray-500">
          <span className="font-bold text-gray-700">{floorStats.moved}</span> / {floorStats.total} הועברו בקומה זו
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm px-4 py-2.5 flex flex-wrap gap-1.5 items-center">
        <span className="text-[10px] font-bold text-gray-400 ml-2">שלבים:</span>
        {phases.map(p => <span key={p.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: p.color }}>{p.id}</span>)}
        <span className="mx-2 text-gray-300">|</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-3 rounded border-2 border-green-500 bg-green-100 inline-block" />הכל הועברו</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-3 rounded border-2 border-yellow-400 bg-yellow-50 inline-block" />חלק</span>
        <span className="flex items-center gap-1 text-[10px] text-gray-500"><span className="w-3 h-3 rounded-full bg-green-500 text-white text-[7px] inline-flex items-center justify-center" style={{ width: 12, height: 12 }}>✓</span>הועבר</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white px-5 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">{currentPlan?.label}</h2>
          <span className="text-indigo-200 text-sm">{viewMode === 'new' ? '🎯 יעד' : '📍 נוכחי'}</span>
        </div>
        <div className="relative overflow-auto" style={{ maxHeight: '78vh' }}>
          <div className="relative inline-block min-w-full">
            <img src={imageSrc} alt={currentPlan?.label} className="w-full h-auto block" style={{ minWidth: '900px' }} draggable={false} />
            {floorRooms.map(([roomId, coords]) => {
              const occs = roomOccupants[roomId] || [];
              const isHighlighted = matchingRooms?.has(roomId);
              const allMoved = occs.length > 0 && occs.every(e => movedSet.has(e.id));
              const someMoved = occs.some(e => movedSet.has(e.id));
              return (
                <div key={roomId} className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: isHighlighted ? 30 : occs.length > 0 ? 15 : 5 }}>
                  <div className={`rounded-lg px-1 py-0.5 backdrop-blur-sm transition-all ${
                    occs.length === 0 ? 'bg-gray-300/40 border border-gray-400/30'
                    : allMoved ? 'bg-green-100/95 border-2 border-green-500 shadow-lg shadow-green-200/50'
                    : someMoved ? 'bg-yellow-50/95 border-2 border-yellow-400 shadow-md'
                    : 'bg-white/95 border-2 border-indigo-300 shadow-md'
                  } ${isHighlighted ? 'ring-3 ring-indigo-500 ring-offset-1 scale-125' : ''}`}
                    style={{ minWidth: occs.length > 2 ? '50px' : '36px' }}>
                    <div className="text-[8px] font-extrabold text-gray-700 text-center leading-none mb-0.5">{roomId}</div>
                    {occs.length > 0 && (
                      <div className="flex flex-wrap gap-px justify-center">
                        {occs.map(emp => {
                          const isMoved = movedSet.has(emp.id);
                          const pc = phaseColorMap[emp.phase] || '#6b7280';
                          return (
                            <button key={emp.id} onClick={() => onSelectEmployee(emp)}
                              title={`${emp.first} ${emp.last} — ${emp.dept}`}
                              className="w-[18px] h-[18px] rounded-full text-[7px] font-bold flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.8] hover:z-30"
                              style={{ backgroundColor: isMoved ? '#22c55e' : pc, color: 'white', border: isMoved ? '1.5px solid #16a34a' : '1.5px dashed rgba(255,255,255,0.6)' }}>
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
