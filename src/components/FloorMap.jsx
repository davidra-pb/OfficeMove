import { useState, useMemo, useRef, useCallback } from 'react';
import { PHASES } from '../data/moveData.js';
import { FLOOR_PLANS, ROOM_COORDS } from '../data/roomCoords.js';

export default function FloorMap({
  employees,
  phases = PHASES,
  movedSet,
  onSelectEmployee,
  searchQuery = '',
  dayFilter = null,
  isAdmin = false,
}) {
  const [activeFloor, setActiveFloor] = useState('floor8_ic');
  const [viewMode, setViewMode] = useState('new');
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState({});
  const [dragging, setDragging] = useState(null);
  const imageRef = useRef(null);

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

  const getRoomCoords = useCallback((roomId, originalCoords) => {
    if (overrides[roomId]) {
      return { ...originalCoords, x: overrides[roomId].x, y: overrides[roomId].y };
    }
    return originalCoords;
  }, [overrides]);

  const handleMouseDown = useCallback((e, roomId) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(roomId);
  }, [editMode]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, Math.round(x)));
    const clampedY = Math.max(0, Math.min(100, Math.round(y)));
    setOverrides(prev => ({ ...prev, [dragging]: { x: clampedX, y: clampedY } }));
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const exportCoords = useCallback(() => {
    const allCoords = {};
    floorRooms.forEach(([roomId, orig]) => {
      const c = getRoomCoords(roomId, orig);
      allCoords[roomId] = { x: c.x, y: c.y, w: orig.w, h: orig.h, floor: orig.floor };
    });
    const lines = Object.entries(allCoords)
      .map(([id, c]) => `  '${id}': { x: ${c.x}, y: ${c.y}, w: ${c.w}, h: ${c.h}, floor: '${c.floor}' },`)
      .join('\n');
    const text = `// ${currentPlan?.label}\n${lines}`;
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!')).catch(() => {});
    console.log(text);
  }, [floorRooms, getRoomCoords, currentPlan]);

  const exportAllFloors = useCallback(() => {
    const allCoords = {};
    Object.entries(ROOM_COORDS).forEach(([roomId, orig]) => {
      const c = overrides[roomId] ? { ...orig, x: overrides[roomId].x, y: overrides[roomId].y } : orig;
      allCoords[roomId] = c;
    });
    const lines = Object.entries(allCoords)
      .map(([id, c]) => `  '${id}': { x: ${c.x}, y: ${c.y}, w: ${c.w}, h: ${c.h}, floor: '${c.floor}' },`)
      .join('\n');
    const text = `export const ROOM_COORDS = {\n${lines}\n};`;
    navigator.clipboard.writeText(text).then(() => alert('All floors copied to clipboard!')).catch(() => {});
    console.log(text);
  }, [overrides]);

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

      {/* Edit mode controls */}
      <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
        {isAdmin && <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            editMode
              ? 'bg-red-500 text-white shadow-md ring-2 ring-red-300'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {editMode ? '🔧 מצב עריכה פעיל — גרור חדרים' : '🔧 מצב עריכת מיקום'}
        </button>}
        {editMode && (
          <>
            <button onClick={exportCoords}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600">
              Export קומה נוכחית
            </button>
            <button onClick={exportAllFloors}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-purple-500 text-white hover:bg-purple-600">
              Export כל הקומות
            </button>
            <span className="text-xs text-gray-400">גרור כל תגית חדר למיקום הנכון על התוכנית</span>
          </>
        )}

        {!editMode && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold text-gray-400 ml-2">שלבים:</span>
            {phases.map(p => <span key={p.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: p.color }}>{p.id}</span>)}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className={`${editMode ? 'bg-gradient-to-l from-red-600 to-orange-600' : 'bg-gradient-to-l from-indigo-600 to-purple-600'} text-white px-5 py-3 flex items-center justify-between`}>
          <h2 className="text-lg font-bold">{currentPlan?.label}</h2>
          <span className="text-white/70 text-sm">{editMode ? '🔧 EDIT MODE — drag rooms' : viewMode === 'new' ? '🎯 יעד' : '📍 נוכחי'}</span>
        </div>
        <div
          className="relative overflow-auto"
          style={{ maxHeight: '78vh', cursor: dragging ? 'grabbing' : undefined }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative inline-block min-w-full" ref={imageRef}>
            <img src={imageSrc} alt={currentPlan?.label} className="w-full h-auto block" style={{ minWidth: '900px' }} draggable={false} />
            {floorRooms.map(([roomId, origCoords]) => {
              const coords = getRoomCoords(roomId, origCoords);
              const occs = roomOccupants[roomId] || [];
              const isHighlighted = matchingRooms?.has(roomId);
              const allMoved = occs.length > 0 && occs.every(e => movedSet.has(e.id));
              const someMoved = occs.some(e => movedSet.has(e.id));
              const isDragging = dragging === roomId;
              const wasOverridden = !!overrides[roomId];

              return (
                <div key={roomId}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${editMode ? '' : 'transition-all'}`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    zIndex: isDragging ? 100 : isHighlighted ? 30 : occs.length > 0 ? 15 : 5,
                    cursor: editMode ? (isDragging ? 'grabbing' : 'grab') : undefined,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, roomId)}
                >
                  <div className={`rounded-lg px-1 py-0.5 backdrop-blur-sm ${editMode ? '' : 'transition-all'} ${
                    editMode
                      ? `border-2 ${wasOverridden ? 'border-green-500 bg-green-50/90' : 'border-orange-400 bg-orange-50/90'} shadow-lg ${isDragging ? 'scale-125 shadow-xl' : 'hover:scale-110'}`
                      : occs.length === 0
                        ? 'bg-gray-300/40 border border-gray-400/30'
                        : allMoved ? 'bg-green-100/95 border-2 border-green-500 shadow-lg shadow-green-200/50'
                        : someMoved ? 'bg-yellow-50/95 border-2 border-yellow-400 shadow-md'
                        : 'bg-white/95 border-2 border-indigo-300 shadow-md'
                  } ${isHighlighted && !editMode ? 'ring-3 ring-indigo-500 ring-offset-1 scale-125' : ''}`}
                    style={{ minWidth: editMode ? '40px' : occs.length > 2 ? '50px' : '36px' }}>
                    <div className={`text-[8px] font-extrabold text-center leading-none mb-0.5 ${editMode ? 'text-orange-700' : 'text-gray-700'}`}>
                      {roomId}
                      {editMode && <span className="block text-[7px] text-gray-400 font-normal">{coords.x},{coords.y}</span>}
                    </div>
                    {!editMode && occs.length > 0 && (
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
