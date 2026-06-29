import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, collection, deleteDoc, deleteField, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';
import { PHASES, EMPLOYEES, DEPARTMENTS } from './data/moveData.js';
import { getStoredSession, logout, seedUsersIfNeeded } from './auth.js';
import { logAction, clearAuditLog, ACTIONS } from './auditLog.js';
import LoginScreen from './components/LoginScreen';
import StatsBar from './components/StatsBar';
import FloorMap from './components/FloorMap';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import Comparison from './components/Comparison';
import AdminPanel from './components/AdminPanel';
import AuditLog from './components/AuditLog';
import HomePage from './components/HomePage';
import EmployeeModal from './components/EmployeeModal';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const PROGRESS_REF = () => doc(db, 'officeMove', 'progress');

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [movedSet, setMovedSet] = useState(new Set());
  const [activeTab, setActiveTab] = useState('home');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState(null);
  const [compareEmployee, setCompareEmployee] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [employeeStatuses, setEmployeeStatuses] = useState({});
  const [employeeNotes, setEmployeeNotes] = useState({});
  const idleTimer = useRef(null);
  const currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  useEffect(() => { seedUsersIfNeeded(); }, []);

  useEffect(() => {
    const ref = PROGRESS_REF();
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMovedSet(new Set(snap.data().movedIds ?? []));
        setEmployeeStatuses(snap.data().employeeStatuses ?? {});
        setEmployeeNotes(snap.data().employeeNotes ?? {});
      } else {
        setDoc(ref, { movedIds: [], employeeStatuses: {} });
      }
    });
    return unsub;
  }, []);

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    logAction(user.username, ACTIONS.LOGIN, { role: user.role });
  }, []);

  const handleLogout = useCallback((reason = 'manual') => {
    const user = currentUserRef.current;
    if (user) {
      logAction(user.username, reason === 'idle' ? ACTIONS.IDLE_LOGOUT : ACTIONS.LOGOUT);
    }
    // Remove presence
    if (currentUserRef.current) {
      deleteDoc(doc(db, 'presence', currentUserRef.current.username)).catch(() => {});
    }
    logout();
    setCurrentUser(null);
    setActiveTab('checklist');
  }, []);

  // Presence — write on login, heartbeat every 30s, update on tab change, cleanup on logout/unload
  useEffect(() => {
    if (!currentUser) return;
    const ref = doc(db, 'presence', currentUser.username);
    const write = (tab) => setDoc(ref, {
      username: currentUser.username,
      role: currentUser.role,
      lastSeen: serverTimestamp(),
      online: true,
      screen: tab || activeTab,
    });
    write(activeTab);
    const heartbeat = setInterval(() => write(activeTab), 30_000);
    const onUnload = () => { deleteDoc(ref).catch(() => {}); };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', onUnload);
      deleteDoc(ref).catch(() => {});
    };
  }, [currentUser, activeTab]);

  // Idle timeout — 30 min
  useEffect(() => {
    if (!currentUser) return;
    const reset = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => handleLogout('idle'), IDLE_TIMEOUT_MS);
    };
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      clearTimeout(idleTimer.current);
    };
  }, [currentUser, handleLogout]);

  const isAdmin = currentUser?.role === 'admin';
  const canEdit = currentUser?.role !== 'viewer';

  const toggleMoved = useCallback((empId) => {
    const ref = PROGRESS_REF();
    const emp = EMPLOYEES.find(e => e.id === empId);
    const empName = emp ? `${emp.first} ${emp.last}` : String(empId);
    const update = {};
    if (movedSet.has(empId)) {
      // Unmark: remove from movedIds AND clear status
      update.movedIds = arrayRemove(empId);
      update[`employeeStatuses.${empId}`] = deleteField();
      logAction(currentUserRef.current?.username, ACTIONS.UNMARK_MOVED, { employee: empName });
    } else {
      // Mark: add to movedIds AND set status to 'settled'
      update.movedIds = arrayUnion(empId);
      update[`employeeStatuses.${empId}`] = 'settled';
      logAction(currentUserRef.current?.username, ACTIONS.MARK_MOVED, { employee: empName });
    }
    updateDoc(ref, update);
  }, [movedSet]);

  const getPhaseStatus = useCallback((phaseId) => {
    const phaseEmps = EMPLOYEES.filter((e) => e.phase === phaseId);
    if (phaseEmps.length === 0) return 'ready';
    const movedCount = phaseEmps.filter((e) => movedSet.has(e.id)).length;
    if (movedCount === phaseEmps.length) return 'complete';
    if (movedCount > 0) return 'in_progress';
    return 'ready';
  }, [movedSet]);

  const markPhaseComplete = useCallback((phaseId) => {
    const phase = PHASES.find(p => p.id === phaseId);
    const phaseEmps = EMPLOYEES.filter((e) => e.phase === phaseId);
    const phaseEmpIds = phaseEmps.map((e) => e.id);
    // Mark as moved AND set status to 'settled' for all
    const statusUpdates = {};
    phaseEmps.forEach(e => { statusUpdates[`employeeStatuses.${e.id}`] = 'settled'; });
    updateDoc(PROGRESS_REF(), { movedIds: arrayUnion(...phaseEmpIds), ...statusUpdates });
    logAction(currentUserRef.current?.username, ACTIONS.MARK_PHASE_COMPLETE, { phase: phase?.name || phaseId });
  }, []);

  const unmarkPhase = useCallback((phaseId) => {
    const phase = PHASES.find(p => p.id === phaseId);
    const phaseEmps = EMPLOYEES.filter((e) => e.phase === phaseId);
    const phaseEmpIds = phaseEmps.map((e) => e.id);
    // Remove moved AND clear statuses
    const statusUpdates = {};
    phaseEmps.forEach(e => { statusUpdates[`employeeStatuses.${e.id}`] = deleteField(); });
    updateDoc(PROGRESS_REF(), { movedIds: arrayRemove(...phaseEmpIds), ...statusUpdates });
    logAction(currentUserRef.current?.username, ACTIONS.UNMARK_PHASE, { phase: phase?.name || phaseId });
  }, []);

  // Employee status: null | 'packing' | 'transit' | 'settled'
  const STATUS_CYCLE = [null, 'packing', 'transit', 'settled'];
  const setEmployeeStatus = useCallback((empId, status) => {
    const update = {};
    update[`employeeStatuses.${empId}`] = status ?? deleteField();
    // 'settled' = moved. Any other status (including null) = not moved.
    update.movedIds = status === 'settled' ? arrayUnion(empId) : arrayRemove(empId);
    updateDoc(PROGRESS_REF(), update);
  }, []);

  const advanceStatus = useCallback((empId) => {
    const current = employeeStatuses[empId] ?? null;
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setEmployeeStatus(empId, next);
    return next;
  }, [employeeStatuses, setEmployeeStatus]);

  const regressStatus = useCallback((empId) => {
    const current = employeeStatuses[empId] ?? null;
    const idx = STATUS_CYCLE.indexOf(current);
    const prev = STATUS_CYCLE[(idx - 1 + STATUS_CYCLE.length) % STATUS_CYCLE.length];
    setEmployeeStatus(empId, prev);
    return prev;
  }, [employeeStatuses, setEmployeeStatus]);

  const settleDirect = useCallback((empId) => {
    setEmployeeStatus(empId, 'settled');
  }, [setEmployeeStatus]);

  const setEmployeeNote = useCallback((empId, note) => {
    const update = {};
    update[`employeeNotes.${empId}`] = note ? note : deleteField();
    updateDoc(PROGRESS_REF(), update);
  }, []);

  const [resetting, setResetting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Real-time presence listener (admin only)
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = onSnapshot(collection(db, 'presence'), snap => {
      const now = Date.now();
      const users = snap.docs
        .map(d => ({ ...d.data(), id: d.id }))
        .filter(u => {
          // Consider online if lastSeen within 2 minutes
          const ts = u.lastSeen?.toDate?.()?.getTime?.();
          return ts && (now - ts) < 120_000;
        })
        .sort((a, b) => (a.username > b.username ? 1 : -1));
      setOnlineUsers(users);
    });
    return unsub;
  }, [isAdmin]);
  const resetAll = useCallback(async () => {
    const confirmed = window.prompt(
      'פעולה זו תמחק את כל הסימונים, סטטוסים והערות ויומן הפעולות.\n\nלאישור הקלד: אפס'
    );
    if (confirmed?.trim() !== 'אפס') return;
    setResetting(true);
    try {
      await setDoc(doc(db, 'officeMove', 'progress'), { movedIds: [], employeeStatuses: {}, employeeNotes: {} });
      await clearAuditLog();
      await logAction(currentUserRef.current?.username, 'איפוס מערכת');
      setSideMenuOpen(false);
      setActiveTab('home');
    } finally {
      setResetting(false);
    }
  }, []);

  const filteredEmployees = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      if (dayFilter !== null) {
        const phase = PHASES.find((p) => p.id === emp.phase);
        if (phase && phase.day !== dayFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const fullName = `${emp.first} ${emp.last}`.toLowerCase();
        const dept = emp.dept.toLowerCase();
        const rooms = `${emp.oldRoom} ${emp.newRoom}`.toLowerCase();
        if (!fullName.includes(q) && !dept.includes(q) && !rooms.includes(q)) return false;
      }
      return true;
    });
  }, [searchQuery, dayFilter]);

  const autocompleteSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return EMPLOYEES.filter(e => {
      const name = `${e.first} ${e.last}`.toLowerCase();
      return name.includes(q);
    }).slice(0, 8);
  }, [searchQuery]);

  const switchTab = useCallback((tabId) => {
    setActiveTab(tabId);
    logAction(currentUserRef.current?.username, ACTIONS.TAB_SWITCH, { tab: tabId });
  }, []);

  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'home', label: 'בית' },
    { id: 'checklist', label: "צ'קליסט" },
    { id: 'comparison', label: 'ישן ↔ חדש' },
    { id: 'floor', label: 'מפת קומות' },
    { id: 'timeline', label: 'ציר זמן' },
  ];

  const dayButtons = [
    { value: null, label: 'הכל' },
    { value: 1, label: "יום א' 28.06" },
    { value: 2, label: "יום ב' 29.06" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              מעבר משרדים — ישראל קנדה ואקרו
            </h1>
            <p className="mt-0.5 text-gray-400 text-sm">28-29.06.2026</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-sm text-gray-300">
              {currentUser.username}
              {isAdmin && <span className="text-xs text-indigo-400 mr-1">(מנהל)</span>}
              {!canEdit && <span className="text-xs text-gray-400 mr-1">(צופה)</span>}
            </span>
            {isAdmin && (
              <button onClick={() => setSideMenuOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                ניהול
              </button>
            )}
            <button onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-6">
        <StatsBar employees={EMPLOYEES} phases={PHASES} movedSet={movedSet} departments={DEPARTMENTS} />
      </div>

      {/* Kanban status buckets — above tabs */}
      {(() => {
        // Floor managers — color by destination floor
        const FLOOR_MANAGERS = [
          { name: 'רוני שלום',  bld: 'ישראל קנדה', floor: 8, bg: '#ede9fe', border: '#8b5cf6', text: '#6d28d9' },
          { name: 'עמית פרדו', bld: 'ישראל קנדה', floor: 6, bg: '#ccfbf1', border: '#14b8a6', text: '#0f766e' },
          { name: 'שיר ארמנדו', bld: 'אקרו',        floor: 8, bg: '#ffedd5', border: '#f97316', text: '#c2410c' },
          { name: 'שלי לוי',   bld: 'אקרו',        floor: 7, bg: '#ffe4e6', border: '#f43f5e', text: '#be123c' },
        ];
        const getManagerColor = (emp) => {
          const m = FLOOR_MANAGERS.find(m => m.bld === emp.newBld && m.floor === emp.newFloor);
          return m || { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280' };
        };

        // Find current active phase (first non-complete)
        const activePhaseId = PHASES.find(p => {
          const phaseEmps = EMPLOYEES.filter(e => e.phase === p.id);
          return phaseEmps.length > 0 && phaseEmps.some(e => !movedSet.has(e.id));
        })?.id;
        const activePhase = PHASES.find(p => p.id === activePhaseId);

        const buckets = [
          { key: null,       label: 'ממתין',  border: '#e5e7eb', bg: '#f9fafb', dot: '#9ca3af', text: '#6b7280' },
          { key: 'packing',  label: 'אריזה',  border: '#fde68a', bg: '#fffbeb', dot: '#f59e0b', text: '#d97706' },
          { key: 'transit',  label: 'במעבר',  border: '#bfdbfe', bg: '#eff6ff', dot: '#3b82f6', text: '#2563eb' },
          { key: 'settled',  label: 'התמקם', border: '#bbf7d0', bg: '#f0fdf4', dot: '#22c55e', text: '#16a34a' },
        ];
        return (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {buckets.map(bucket => {
                const emps = bucket.key === null
                  // Waiting: only show employees from the current active phase with no status
                  ? EMPLOYEES.filter(e => e.phase === activePhaseId && !employeeStatuses[e.id])
                  : EMPLOYEES.filter(e => employeeStatuses[e.id] === bucket.key);
                return (
                  <div key={String(bucket.key)} className="rounded-xl border flex flex-col"
                    style={{ borderColor: bucket.border, backgroundColor: bucket.bg, minHeight: bucket.key === 'transit' ? '260px' : '120px' }}>
                    {/* Bucket header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: bucket.border }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bucket.key === null && activePhase ? activePhase.color : bucket.dot }} />
                        <span className="text-xs font-semibold truncate" style={{ color: bucket.text }}>{bucket.label}</span>
                        {bucket.key === null && activePhase && (
                          <span className="text-[9px] text-gray-400 truncate hidden sm:inline">· {activePhase.name.split('—')[0].trim()}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: bucket.text }}>{emps.length}</span>
                    </div>
                    {/* Employee content */}
                    <div className="px-2 py-2 overflow-y-auto flex-1">
                      {/* Transit bucket: show ONLY per-manager breakdown, no flat list */}
                      {bucket.key === 'transit' ? (
                        <div className="space-y-2">
                          {FLOOR_MANAGERS.map(m => {
                            const mEmps = EMPLOYEES.filter(e => employeeStatuses[e.id] === 'transit' && e.newBld === m.bld && e.newFloor === m.floor);
                            return (
                              <div key={m.name}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.border }} />
                                    <span className="text-[10px] font-semibold" style={{ color: m.text }}>{m.name}</span>
                                    <span className="text-[9px] opacity-60" style={{ color: m.text }}>{m.bld === 'ישראל קנדה' ? 'י"ק' : 'אקרו'} ק{m.floor}</span>
                                  </div>
                                  <span className="text-[10px] font-bold tabular-nums" style={{ color: m.text }}>{mEmps.length}</span>
                                </div>
                                {mEmps.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {mEmps.map(emp => (
                                      <div key={emp.id} className="flex flex-col items-center px-1.5 py-0.5 rounded border text-center"
                                        style={{ backgroundColor: 'white', borderColor: m.border }}>
                                        <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: m.text }}>{emp.first} {emp.last}</span>
                                        <span className="text-[9px] font-mono opacity-60" style={{ color: m.text }}>{emp.newRoom}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-gray-300 pr-2">—</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : emps.length === 0 ? (
                        <span className="text-[10px] text-gray-300 px-1">{bucket.key === null ? 'כולם יצאו מהשלב' : 'ריק'}</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {emps.map(emp => (
                            <span key={emp.id}
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md border whitespace-nowrap bg-white border-gray-200 text-gray-600">
                              {emp.first} {emp.last}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-wrap gap-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => switchTab(tab.id)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-gray-900 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'admin' && activeTab !== 'auditlog' && activeTab !== 'home' && (
          <>
            <div className="flex gap-2">
              {dayButtons.map((btn) => (
                <button key={String(btn.value)} onClick={() => setDayFilter(btn.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    dayFilter === btn.value ? 'bg-gray-900 text-white border border-gray-900' : 'border border-gray-300 text-gray-600 hover:text-gray-900'
                  }`}>
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-w-0 relative">
              <input type="text" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowAutocomplete(true); }}
                onFocus={() => setShowAutocomplete(true)}
                placeholder="חיפוש עובד, מחלקה, חדר..."
                className="w-full px-4 py-2 rounded-lg bg-gray-100 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
              {showAutocomplete && autocompleteSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
                  {autocompleteSuggestions.map(emp => (
                    <button key={emp.id} onClick={() => {
                      if (activeTab === 'comparison') setCompareEmployee(emp);
                      else setSelectedEmployee(emp);
                      setSearchQuery(`${emp.first} ${emp.last}`);
                      setShowAutocomplete(false);
                    }} className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                      <span className="text-sm font-medium text-gray-900">{emp.first} {emp.last}</span>
                      <span className="text-xs text-gray-400">{emp.dept}</span>
                      <span className="text-xs text-gray-300 mr-auto font-mono">{emp.oldRoom} ← {emp.newRoom}</span>
                    </button>
                  ))}
                </div>
              )}
              {showAutocomplete && <div className="fixed inset-0 z-40" onClick={() => setShowAutocomplete(false)} />}
            </div>
          </>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 mt-6 pb-8">
        {!canEdit && (
          <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700">
            <span>👁️</span>
            <span>מצב צפייה בלבד — לא ניתן לבצע שינויים</span>
          </div>
        )}
        {activeTab === 'home' && (
          <HomePage movedSet={movedSet}
            employeeStatuses={employeeStatuses}
            advanceStatus={canEdit ? advanceStatus : undefined}
            regressStatus={canEdit ? regressStatus : undefined}
            settleDirect={canEdit ? settleDirect : undefined}
            employeeNotes={employeeNotes}
            setEmployeeNote={canEdit ? setEmployeeNote : undefined}
            onViewOnMap={(emp) => { setCompareEmployee(emp); switchTab('comparison'); }}
            toggleMoved={canEdit ? toggleMoved : undefined}
            markPhaseComplete={isAdmin ? markPhaseComplete : undefined} />
        )}
        {activeTab === 'checklist' && (
          <Checklist phases={PHASES} employees={filteredEmployees} movedSet={movedSet}
            toggleMoved={canEdit ? toggleMoved : undefined}
            markPhaseComplete={isAdmin ? markPhaseComplete : undefined}
            unmarkPhase={isAdmin ? unmarkPhase : undefined}
            getPhaseStatus={getPhaseStatus} dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} />
        )}
        {activeTab === 'comparison' && (
          <Comparison movedSet={movedSet} onSelectEmployee={setSelectedEmployee}
            toggleMoved={canEdit ? toggleMoved : undefined}
            searchQuery={searchQuery} compareEmployee={compareEmployee} />
        )}
        {activeTab === 'floor' && (
          <FloorMap employees={filteredEmployees} movedSet={movedSet}
            toggleMoved={canEdit ? toggleMoved : undefined}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} isAdmin={isAdmin && canEdit} />
        )}
        {activeTab === 'timeline' && (
          <Timeline phases={PHASES} employees={filteredEmployees} movedSet={movedSet}
            getPhaseStatus={getPhaseStatus} dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} />
        )}
      </main>

      <footer className="text-center py-4 text-[11px] text-gray-300 select-none">
        V3.3
      </footer>

      {/* Admin Side Menu */}
      {isAdmin && (
        <>
          {/* Backdrop */}
          {sideMenuOpen && (
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
              onClick={() => setSideMenuOpen(false)} />
          )}
          {/* Drawer — slides in from left (RTL = left side is "far" side) */}
          <div className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            sideMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Drawer header */}
            <div className="bg-gray-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div>
                <div className="text-sm font-semibold">ניהול מערכת</div>
                <div className="text-xs text-gray-400 mt-0.5">{currentUser.username} · מנהל</div>
              </div>
              <button onClick={() => setSideMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">

              {/* Online users — real-time */}
              <div className="mb-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">מחוברים כעת</div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-gray-400">{onlineUsers.length}</span>
                  </div>
                </div>
                {onlineUsers.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400">אין משתמשים מחוברים</div>
                ) : (
                  <div className="space-y-1">
                    {onlineUsers.map(u => {
                      const screenLabels = { home: 'בית', checklist: "צ'קליסט", comparison: 'ישן ↔ חדש', floor: 'מפת קומות', timeline: 'ציר זמן', admin: 'ניהול', auditlog: 'יומן' };
                      const screenLabel = screenLabels[u.screen] || u.screen || '—';
                      return (
                      <div key={u.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                        <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800">{u.username}</div>
                          <div className="text-[10px] text-gray-400">{screenLabel}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                          u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {u.role === 'admin' ? 'מנהל' : u.role === 'viewer' ? 'צופה' : 'משתמש'}
                        </span>
                      </div>
                    );})}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mb-3" />
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">ניהול</div>
              {[
                { id: 'admin', label: 'משתמשים', desc: 'הוספה, עריכה, חסימה' },
                { id: 'auditlog', label: 'יומן פעולות', desc: 'מעקב אחר כל הפעולות' },
              ].map(item => (
                <button key={item.id}
                  onClick={() => { setActiveTab(item.id); setSideMenuOpen(false); switchTab(item.id); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-right transition-colors ${
                    activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === item.id ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </button>
              ))}

              <div className="border-t border-gray-100 my-3" />
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">מפת קומות — עריכה</div>
              <button onClick={() => { setActiveTab('floor'); setSideMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-right transition-colors ${
                  activeTab === 'floor' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === 'floor' ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">עריכת מיקומי חדרים</div>
                  <div className="text-xs text-gray-400">גרור חדרים על המפה</div>
                </div>
              </button>
            </div>

            {/* Drawer footer */}
            <div className="border-t border-gray-100 p-4 shrink-0 space-y-2">
              <button onClick={resetAll} disabled={resetting}
                className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-red-700 text-white hover:bg-red-800 disabled:opacity-50 transition-colors text-center">
                {resetting ? 'מאפס...' : 'איפוס כל הנתונים'}
              </button>
              <p className="text-[10px] text-gray-400 text-center">מחיקת כל הסימונים, סטטוסים ויומן הפעולות</p>
              <button onClick={() => { setSideMenuOpen(false); handleLogout(); }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors text-center">
                התנתק
              </button>
            </div>
          </div>
        </>
      )}

      {/* Admin/AuditLog content — rendered outside main when active */}
      {activeTab === 'admin' && isAdmin && (
        <div dir="rtl" className="max-w-7xl mx-auto px-3 sm:px-4 pb-8">
          <AdminPanel />
        </div>
      )}
      {activeTab === 'auditlog' && isAdmin && (
        <div dir="rtl" className="max-w-7xl mx-auto px-3 sm:px-4 pb-8">
          <AuditLog />
        </div>
      )}

      {selectedEmployee && (
        <EmployeeModal employee={selectedEmployee} isMoved={movedSet.has(selectedEmployee.id)}
          toggleMoved={canEdit ? toggleMoved : undefined}
          onClose={() => setSelectedEmployee(null)} departments={DEPARTMENTS} />
      )}
    </div>
  );
}
