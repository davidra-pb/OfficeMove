import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION = 'auditLog';

export async function logAction(username, action, details = {}) {
  try {
    await addDoc(collection(db, COLLECTION), {
      username: username || 'unknown',
      action,
      details,
      timestamp: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Audit log write failed:', e);
  }
}

export async function getAuditLog(limitCount = 200) {
  const q = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp?.toDate?.() || null }));
}

export const ACTIONS = {
  LOGIN:               'כניסה למערכת',
  LOGOUT:              'יציאה מהמערכת',
  IDLE_LOGOUT:         'יציאה אוטומטית (חוסר פעילות)',
  MARK_MOVED:          'סימון כהועבר',
  UNMARK_MOVED:        'ביטול סימון',
  MARK_PHASE_COMPLETE: 'סימון שלב כהושלם',
  UNMARK_PHASE:        'ביטול שלב',
  CREATE_USER:         'יצירת משתמש',
  UPDATE_ROLE:         'עדכון תפקיד',
  UPDATE_PASSWORD:     'שינוי סיסמה',
  UNBLOCK_USER:        'שחרור חסימה',
  TAB_SWITCH:          'מעבר בין מסכים',
  COMPARE_EMPLOYEE:    'השוואת עובד',
  FULLSCREEN:          'מסך מלא',
};
