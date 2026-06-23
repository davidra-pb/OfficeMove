import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, unblockUser, createUser, updateUserPassword, updateUserRole } from '../auth.js';
import { logAction, ACTIONS } from '../auditLog.js';
import { getStoredSession } from '../auth.js';

const getUsername = () => getStoredSession()?.username || 'admin';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [editingPassword, setEditingPassword] = useState(null);
  const [editPass, setEditPass] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const list = await getAllUsers();
    setUsers(list);
    setLoading(false);
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const showMsg = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3000); };

  const handleUnblock = async (username) => {
    await unblockUser(username);
    logAction(getUsername(), ACTIONS.UNBLOCK_USER, { target: username });
    showMsg(`${username} שוחרר`);
    loadUsers();
  };

  const handleRoleToggle = async (username, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(username, newRole);
    logAction(getUsername(), ACTIONS.UPDATE_ROLE, { target: username, newRole });
    showMsg(`${username} עודכן ל-${newRole}`);
    loadUsers();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPass) return;
    const result = await createUser(newName, newPass, newRole);
    if (result.success) {
      logAction(getUsername(), ACTIONS.CREATE_USER, { target: newName, role: newRole });
      showMsg(`${newName} נוצר בהצלחה`);
      setNewName(''); setNewPass(''); setNewRole('user'); setShowAdd(false);
      loadUsers();
    } else {
      showMsg(result.error);
    }
  };

  const handlePasswordUpdate = async (username) => {
    if (!editPass) return;
    await updateUserPassword(username, editPass);
    logAction(getUsername(), ACTIONS.UPDATE_PASSWORD, { target: username });
    showMsg(`סיסמה עודכנה עבור ${username}`);
    setEditingPassword(null); setEditPass('');
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400 text-sm">טוען...</div>;
  }

  return (
    <div dir="rtl" className="space-y-4">
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700 animate-fade-in">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">ניהול משתמשים</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          {showAdd ? 'ביטול' : '+ משתמש חדש'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddUser} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">שם משתמש</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">סיסמה</label>
              <input type="text" value={newPass} onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">תפקיד</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300">
                <option value="user">משתמש</option>
                <option value="admin">מנהל</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={!newName.trim() || !newPass}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
            צור משתמש
          </button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">משתמש</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">תפקיד</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">סטטוס</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">ניסיונות</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">{user.username}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {user.blocked ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-red-600">
                      <span className="w-2 h-2 rounded-full bg-red-500" />חסום
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />פעיל
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-400 tabular-nums">{user.failedAttempts || 0}/3</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {user.blocked && (
                      <button onClick={() => handleUnblock(user.username)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        שחרר
                      </button>
                    )}
                    <button onClick={() => handleRoleToggle(user.username, user.role)}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                      {user.role === 'admin' ? 'הסר מנהל' : 'הגדר מנהל'}
                    </button>
                    {editingPassword === user.username ? (
                      <div className="flex items-center gap-1">
                        <input type="text" value={editPass} onChange={(e) => setEditPass(e.target.value)} placeholder="סיסמה חדשה"
                          className="px-2 py-1 rounded border border-gray-200 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-gray-300" />
                        <button onClick={() => handlePasswordUpdate(user.username)}
                          className="text-xs font-medium text-green-600 hover:text-green-800">שמור</button>
                        <button onClick={() => { setEditingPassword(null); setEditPass(''); }}
                          className="text-xs font-medium text-gray-400 hover:text-gray-600">ביטול</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingPassword(user.username)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                        שנה סיסמה
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
