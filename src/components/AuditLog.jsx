import { useState, useEffect, useCallback } from 'react';
import { getAuditLog, ACTIONS } from '../auditLog.js';

const ACTION_COLORS = {
  'כניסה למערכת':          'bg-green-100 text-green-700',
  'יציאה מהמערכת':         'bg-gray-100 text-gray-600',
  'יציאה אוטומטית (חוסר פעילות)': 'bg-amber-100 text-amber-700',
  'סימון כהועבר':           'bg-blue-100 text-blue-700',
  'ביטול סימון':            'bg-red-100 text-red-600',
  'סימון שלב כהושלם':       'bg-indigo-100 text-indigo-700',
  'ביטול שלב':              'bg-orange-100 text-orange-600',
  'יצירת משתמש':            'bg-purple-100 text-purple-700',
  'עדכון תפקיד':            'bg-purple-100 text-purple-600',
  'שינוי סיסמה':            'bg-purple-100 text-purple-600',
  'שחרור חסימה':            'bg-teal-100 text-teal-700',
  'מעבר בין מסכים':         'bg-gray-100 text-gray-500',
  'השוואת עובד':            'bg-sky-100 text-sky-700',
};

function formatTime(date) {
  if (!date) return '—';
  return date.toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function formatDetails(details) {
  if (!details || Object.keys(details).length === 0) return null;
  return Object.entries(details)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ');
}

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAuditLog(300);
    setLogs(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const users = [...new Set(logs.map(l => l.username))].sort();
  const actions = [...new Set(logs.map(l => l.action))].sort();

  const filtered = logs.filter(l => {
    if (filterUser && l.username !== filterUser) return false;
    if (filterAction && l.action !== filterAction) return false;
    return true;
  });

  return (
    <div dir="rtl" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-gray-900">יומן פעולות</h2>
        <div className="flex gap-2 flex-wrap">
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-gray-300">
            <option value="">כל המשתמשים</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-gray-100 border-0 text-xs focus:outline-none focus:ring-1 focus:ring-gray-300">
            <option value="">כל הפעולות</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={load}
            className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition-colors">
            רענן
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">טוען...</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">תאריך ושעה</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">משתמש</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">פעולה</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">פרטים</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">אין רשומות</td></tr>
                ) : (
                  filtered.map(log => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap tabular-nums">{formatTime(log.timestamp)}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">{log.username}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{formatDetails(log.details)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-left">
            {filtered.length} רשומות
          </div>
        </div>
      )}
    </div>
  );
}
