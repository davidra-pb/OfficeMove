import { useState, useEffect, useMemo, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase.js';
import { PHASES, EMPLOYEES, DEPARTMENTS } from './data/moveData.js';
import { getStoredSession, logout, seedUsersIfNeeded } from './auth.js';
import LoginScreen from './components/LoginScreen';
import StatsBar from './components/StatsBar';
import FloorMap from './components/FloorMap';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import Comparison from './components/Comparison';
import AdminPanel from './components/AdminPanel';
import EmployeeModal from './components/EmployeeModal';

const PROGRESS_REF = () => doc(db, 'officeMove', 'progress');

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [movedSet, setMovedSet] = useState(new Set());
  const [activeTab, setActiveTab] = useState('checklist');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState(null);
  const [compareEmployee, setCompareEmployee] = useState(null);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => { seedUsersIfNeeded(); }, []);

  useEffect(() => {
    const ref = PROGRESS_REF();
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMovedSet(new Set(snap.data().movedIds ?? []));
      } else {
        setDoc(ref, { movedIds: [] });
      }
    });
    return unsub;
  }, []);

  const handleLogin = useCallback((user) => { setCurrentUser(user); }, []);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentUser(null);
    setActiveTab('checklist');
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  const toggleMoved = useCallback((empId) => {
    const ref = PROGRESS_REF();
    if (movedSet.has(empId)) {
      updateDoc(ref, { movedIds: arrayRemove(empId) });
    } else {
      updateDoc(ref, { movedIds: arrayUnion(empId) });
    }
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
    const phaseEmpIds = EMPLOYEES.filter((e) => e.phase === phaseId).map((e) => e.id);
    updateDoc(PROGRESS_REF(), { movedIds: arrayUnion(...phaseEmpIds) });
  }, []);

  const unmarkPhase = useCallback((phaseId) => {
    const phaseEmpIds = EMPLOYEES.filter((e) => e.phase === phaseId).map((e) => e.id);
    updateDoc(PROGRESS_REF(), { movedIds: arrayRemove(...phaseEmpIds) });
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

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'checklist', label: "צ'קליסט" },
    { id: 'comparison', label: 'ישן ↔ חדש' },
    { id: 'floor', label: 'מפת קומות' },
    { id: 'timeline', label: 'ציר זמן' },
    ...(isAdmin ? [{ id: 'admin', label: 'ניהול' }] : []),
  ];

  const dayButtons = [
    { value: null, label: 'הכל' },
    { value: 1, label: "יום א' 28.06" },
    { value: 2, label: "יום ב' 29.06" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              מעבר משרדים — ישראל קנדה ואקרו
            </h1>
            <p className="mt-0.5 text-gray-400 text-sm">28-29.06.2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              {currentUser.username}
              {isAdmin && <span className="text-xs text-indigo-400 mr-1">(מנהל)</span>}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <StatsBar employees={EMPLOYEES} phases={PHASES} movedSet={movedSet} departments={DEPARTMENTS} />
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex gap-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-gray-900 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'admin' && (
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
                    }} className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                      <span className="text-sm font-medium text-gray-900">{emp.first} {emp.last}</span>
                      <span className="text-xs text-gray-400">{emp.dept}</span>
                      <span className="text-xs text-gray-300 mr-auto font-mono">{emp.oldRoom} → {emp.newRoom}</span>
                    </button>
                  ))}
                </div>
              )}
              {showAutocomplete && <div className="fixed inset-0 z-40" onClick={() => setShowAutocomplete(false)} />}
            </div>
          </>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-6 pb-8">
        {activeTab === 'checklist' && (
          <Checklist phases={PHASES} employees={filteredEmployees} movedSet={movedSet}
            toggleMoved={toggleMoved} markPhaseComplete={markPhaseComplete} unmarkPhase={unmarkPhase}
            getPhaseStatus={getPhaseStatus} dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} />
        )}
        {activeTab === 'comparison' && (
          <Comparison movedSet={movedSet} onSelectEmployee={setSelectedEmployee}
            searchQuery={searchQuery} compareEmployee={compareEmployee} />
        )}
        {activeTab === 'floor' && (
          <FloorMap employees={filteredEmployees} movedSet={movedSet} toggleMoved={toggleMoved}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} isAdmin={isAdmin} />
        )}
        {activeTab === 'timeline' && (
          <Timeline phases={PHASES} employees={filteredEmployees} movedSet={movedSet}
            getPhaseStatus={getPhaseStatus} dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee} departments={DEPARTMENTS} />
        )}
        {activeTab === 'admin' && isAdmin && <AdminPanel />}
      </main>

      {selectedEmployee && (
        <EmployeeModal employee={selectedEmployee} isMoved={movedSet.has(selectedEmployee.id)}
          toggleMoved={toggleMoved} onClose={() => setSelectedEmployee(null)} departments={DEPARTMENTS} />
      )}
    </div>
  );
}
