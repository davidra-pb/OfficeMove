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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors z-10" aria-label="סגור">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-6">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: phase?.color || '#6B7280' }} />
              <h2 className="text-lg font-semibold text-gray-900">{employee.first} {employee.last}</h2>
            </div>
            <div className="flex items-center gap-1.5 mt-1 mr-4">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: deptColor }} />
              <span className="text-sm text-gray-500">{employee.dept}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-2">מיקום נוכחי</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{employee.oldRoom}</div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>בניין {employee.oldBld}</div>
                {employee.oldFloor && <div>קומה {employee.oldFloor}</div>}
              </div>
            </div>
            <span className="text-gray-300 text-lg shrink-0">&rarr;</span>
            <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-400 mb-2">מיקום חדש</div>
              <div className="text-xl font-bold text-gray-900 mb-1">{employee.newRoom}</div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>בניין {employee.newBld}</div>
                {employee.newFloor && <div>קומה {employee.newFloor}</div>}
              </div>
            </div>
          </div>

          {employee.replaces && (
            <div className="bg-gray-50 rounded-lg p-3 mb-5">
              <span className="text-sm text-gray-500">מחליף את: <span className="font-semibold text-gray-700">{employee.replaces}</span></span>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: phase?.color || '#6B7280' }} />
              <span className="text-xs text-gray-400">
                {phase?.name || `שלב ${employee.phase}`}
              </span>
              {phase && <span className="text-xs text-gray-400">יום {phase.day === 1 ? "א' 28.06" : "ב' 29.06"} | {phase.time}</span>}
              {phase?.type === 'scc' && <span className="text-xs text-purple-500 font-bold">סיבוב מסונכרן</span>}
            </div>
            <span className="text-xs text-gray-400">#{employee.id}</span>
          </div>

          <button
            onClick={() => toggleMoved(employee.id)}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isMoved ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {isMoved ? 'בטל סימון' : 'סמן כהועבר'}
          </button>
        </div>
      </div>
    </div>
  );
}
