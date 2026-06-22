import { useState, useEffect, useMemo, useCallback } from 'react';
import { PHASES, EMPLOYEES, DEPARTMENTS } from './data/moveData.js';
import StatsBar from './components/StatsBar';
import FloorMap from './components/FloorMap';
import Timeline from './components/Timeline';
import Checklist from './components/Checklist';
import Comparison from './components/Comparison';
import EmployeeModal from './components/EmployeeModal';

const LS_KEY = 'officeMoveProgress';

function loadMovedSet() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore corrupt data */ }
  return new Set();
}

function saveMovedSet(set) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]));
}

export default function App() {
  const [movedSet, setMovedSet] = useState(() => loadMovedSet());
  const [activeTab, setActiveTab] = useState('checklist');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState(null);

  // Persist movedSet to localStorage on every change
  useEffect(() => {
    saveMovedSet(movedSet);
  }, [movedSet]);

  const toggleMoved = useCallback((empId) => {
    setMovedSet((prev) => {
      const next = new Set(prev);
      if (next.has(empId)) {
        next.delete(empId);
      } else {
        next.add(empId);
      }
      return next;
    });
  }, []);

  const getPhaseStatus = useCallback((phaseId) => {
    const phase = PHASES.find((p) => p.id === phaseId);
    if (!phase) return 'locked';

    // Check if all previous phases are complete
    const prevPhases = PHASES.filter((p) => p.id < phaseId);
    for (const prev of prevPhases) {
      const prevEmps = EMPLOYEES.filter((e) => e.phase === prev.id);
      const allPrevMoved = prevEmps.length > 0 && prevEmps.every((e) => movedSet.has(e.id));
      if (!allPrevMoved) return 'locked';
    }

    const phaseEmps = EMPLOYEES.filter((e) => e.phase === phaseId);
    if (phaseEmps.length === 0) return 'ready';

    const movedCount = phaseEmps.filter((e) => movedSet.has(e.id)).length;
    if (movedCount === phaseEmps.length) return 'complete';
    if (movedCount > 0) return 'in_progress';
    return 'ready';
  }, [movedSet]);

  const markPhaseComplete = useCallback((phaseId) => {
    const phaseEmps = EMPLOYEES.filter((e) => e.phase === phaseId);
    setMovedSet((prev) => {
      const next = new Set(prev);
      phaseEmps.forEach((e) => next.add(e.id));
      return next;
    });
  }, []);

  // Filter employees based on search and day
  const filteredEmployees = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      // Day filter
      if (dayFilter !== null) {
        const phase = PHASES.find((p) => p.id === emp.phase);
        if (phase && phase.day !== dayFilter) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const fullName = `${emp.first} ${emp.last}`.toLowerCase();
        const dept = emp.dept.toLowerCase();
        const rooms = `${emp.oldRoom} ${emp.newRoom}`.toLowerCase();
        if (!fullName.includes(q) && !dept.includes(q) && !rooms.includes(q)) {
          return false;
        }
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
