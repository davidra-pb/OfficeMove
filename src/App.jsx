import { useState, useEffect, useMemo, useCallback } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase.js';
import { PHASES, EMPLOYEES, DEPARTMENTS } from './data/moveData.js';
import StatsBar from './components/StatsBar';
import FloorMap from './components/FloorMap';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import Comparison from './components/Comparison';
import EmployeeModal from './components/EmployeeModal';

const PROGRESS_REF = () => doc(db, 'officeMove', 'progress');

export default function App() {
  const [movedSet, setMovedSet] = useState(new Set());
  const [activeTab, setActiveTab] = useState('checklist');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState(null);

  // Subscribe to Firestore — all users get live updates
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

  const tabs = [
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
      {/* Header */}
      <header className="bg-gradient-to-l from-indigo-700 via-purple-700 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            מעבר משרדים — ישראל קנדה ואקרו
          </h1>
          <p className="mt-1 text-indigo-200 text-sm md:text-base">28-29.06.2026</p>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <StatsBar
          employees={EMPLOYEES}
          phases={PHASES}
          movedSet={movedSet}
          departments={DEPARTMENTS}
        />
      </div>

      {/* Controls bar */}
      <div className="max-w-7xl mx-auto px-4 mt-4 flex flex-col md:flex-row md:items-center gap-3">
        {/* Tab buttons */}
        <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Day filter */}
        <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
          {dayButtons.map((btn) => (
            <button
              key={String(btn.value)}
              onClick={() => setDayFilter(btn.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                dayFilter === btn.value
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חיפוש עובד, מחלקה, חדר..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Active tab content */}
      <main className="max-w-7xl mx-auto px-4 mt-4 pb-8">
        {activeTab === 'checklist' && (
          <Checklist
            phases={PHASES}
            employees={filteredEmployees}
            movedSet={movedSet}
            toggleMoved={toggleMoved}
            markPhaseComplete={markPhaseComplete}
            getPhaseStatus={getPhaseStatus}
            dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee}
            departments={DEPARTMENTS}
          />
        )}
        {activeTab === 'comparison' && (
          <Comparison
            movedSet={movedSet}
            onSelectEmployee={setSelectedEmployee}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === 'floor' && (
          <FloorMap
            employees={filteredEmployees}
            movedSet={movedSet}
            toggleMoved={toggleMoved}
            onSelectEmployee={setSelectedEmployee}
            departments={DEPARTMENTS}
          />
        )}
        {activeTab === 'timeline' && (
          <Timeline
            phases={PHASES}
            employees={filteredEmployees}
            movedSet={movedSet}
            getPhaseStatus={getPhaseStatus}
            dayFilter={dayFilter}
            onSelectEmployee={setSelectedEmployee}
            departments={DEPARTMENTS}
          />
        )}
      </main>

      {/* Employee modal */}
      {selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          isMoved={movedSet.has(selectedEmployee.id)}
          toggleMoved={toggleMoved}
          onClose={() => setSelectedEmployee(null)}
          departments={DEPARTMENTS}
        />
      )}
    </div>
  );
}
