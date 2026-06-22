import { useEffect } from 'react';
import { PHASES, DEPARTMENTS } from '../data/moveData.js';

export default function EmployeeModal({ employee, isMoved, toggleMoved, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!employee) return null;

  const phase = PHASES.find(p => p.id === employee.phase);
  const dept = DEPARTMENTS.find(d => d.name === employee.dept);
  const deptColor = dept?.color || '#6B7280';

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors z-10" aria-label="סגור">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="h-2 w-full" style={{ backgroundColor: phase?.color || '#6B7280' }} />

        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">{employee.first} {employee.last}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: deptColor }} />
              <span className="text-sm text-gray-600">{employee.dept}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-xs font-semibold text-red-400 mb-2">מיקום נוכחי</div>
              <div className="text-3xl font-bold text-red-700 mb-1">{employee.oldRoom}</div>
              <div className="text-xs text-red-500 space-y-0.5">
                <div>בניין {employee.oldBld}</div>
                {employee.oldFloor && <div>קומה {employee.oldFloor}</div>}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-xs font-semibold text-green-400 mb-2">מיקום חדש</div>
              <div className="text-3xl font-bold text-green-700 mb-1">{employee.newRoom}</div>
              <div className="text-xs text-green-500 space-y-0.5">
                <div>בניין {employee.newBld}</div>
                {employee.newFloor && <div>קומה {employee.newFloor}</div>}
              </div>
            </div>
          </div>

          {employee.replaces && (
            <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              <span className="text-sm text-gray-600">מחליף את: <span className="font-semibold text-gray-800">{employee.replaces}</span></span>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: phase?.color || '#6B7280' }}>
                {phase?.name || `שלב ${employee.phase}`}
              </span>
              {phase && <span className="text-xs text-gray-500">יום {phase.day === 1 ? "א' 28.06" : "ב' 29.06"} | {phase.time}</span>}
              {phase?.type === 'scc' && <span className="text-xs text-purple-500 font-bold animate-pulse">סיבוב מסונכרן</span>}
            </div>
            <span className="text-xs text-gray-400">#{employee.id}</span>
          </div>

          <button
            onClick={() => toggleMoved(employee.id)}
            className={`w-full py-3.5 rounded-xl text-lg font-bold transition-all duration-200 ${
              isMoved ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200'
            }`}
          >
            {isMoved ? '↩ בטל סימון' : '✓ סמן כהועבר'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(30px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .animate-slide-in { animation: slideIn 0.25s ease-out forwards; }
      `}</style>
    </div>
  );
}
