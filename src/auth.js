import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const INITIAL_USERS = [
  { username: 'david', password: 'David@2026', role: 'admin' },
  { username: 'galit', password: 'Galit@2026', role: 'user' },
  { username: 'noa', password: 'Noa@2026', role: 'user' },
];

const FLOOR_MANAGER_USERS = [
  { username: 'roni', password: 'Roni@2026', role: 'user', displayName: 'רוני שלום' },
  { username: 'amit', password: 'Amit@2026', role: 'user', displayName: 'עמית פרדו' },
  { username: 'shir', password: 'Shir@2026', role: 'user', displayName: 'שיר ארמנדו' },
  { username: 'sheli', password: 'Sheli@2026', role: 'user', displayName: 'שלי לוי' },
];

export async function seedUsersIfNeeded() {
  const snap = await getDocs(collection(db, 'users'));
  if (snap.size > 0) {
    // Also ensure floor managers exist (added later)
    await seedFloorManagers();
    return;
  }
  for (const u of INITIAL_USERS) {
    const hash = await hashPassword(u.password);
    await setDoc(doc(db, 'users', u.username), {
      username: u.username,
      passwordHash: hash,
      role: u.role,
      blocked: false,
      disabled: false,
      failedAttempts: 0,
    });
  }
  await seedFloorManagers();
}

export async function seedFloorManagers() {
  for (const u of FLOOR_MANAGER_USERS) {
    const existing = await getDoc(doc(db, 'users', u.username));
    if (!existing.exists()) {
      const hash = await hashPassword(u.password);
      await setDoc(doc(db, 'users', u.username), {
        username: u.username,
        passwordHash: hash,
        displayName: u.displayName,
        role: u.role,
        blocked: false,
        disabled: false,
        failedAttempts: 0,
      });
    }
  }
}

export async function loginUser(username, password) {
  const normalized = username.trim().toLowerCase();
  const ref = doc(db, 'users', normalized);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { success: false, error: 'משתמש לא נמצא' };
  }

  const userData = snap.data();

  if (userData.disabled) {
    return { success: false, error: 'החשבון הושבת. פנה למנהל המערכת.' };
  }

  if (userData.blocked) {
    return { success: false, error: 'החשבון נחסם. פנה למנהל המערכת.' };
  }

  const hash = await hashPassword(password);

  if (hash !== userData.passwordHash) {
    const newAttempts = (userData.failedAttempts || 0) + 1;
    const updates = { failedAttempts: newAttempts };
    if (newAttempts >= 3) updates.blocked = true;
    await updateDoc(ref, updates);
    if (newAttempts >= 3) {
      return { success: false, error: 'החשבון נחסם לאחר 3 ניסיונות כושלים.' };
    }
    return { success: false, error: `סיסמה שגויה (ניסיון ${newAttempts}/3)` };
  }

  await updateDoc(ref, { failedAttempts: 0 });

  const session = { username: normalized, role: userData.role, displayName: userData.displayName || null };
  localStorage.setItem('officeMoveSession', JSON.stringify(session));
  return { success: true, user: session };
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem('officeMoveSession');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function logout() {
  localStorage.removeItem('officeMoveSession');
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function unblockUser(username) {
  await updateDoc(doc(db, 'users', username), { blocked: false, failedAttempts: 0 });
}

export async function disableUser(username) {
  await updateDoc(doc(db, 'users', username), { disabled: true });
}

export async function enableUser(username) {
  await updateDoc(doc(db, 'users', username), { disabled: false });
}

export async function createUser(username, password, role) {
  const normalized = username.trim().toLowerCase();
  const existing = await getDoc(doc(db, 'users', normalized));
  if (existing.exists()) {
    return { success: false, error: 'שם משתמש כבר קיים' };
  }
  const hash = await hashPassword(password);
  await setDoc(doc(db, 'users', normalized), {
    username: normalized,
    passwordHash: hash,
    role: role || 'user',
    blocked: false,
    disabled: false,
    failedAttempts: 0,
  });
  return { success: true };
}

export async function updateUserPassword(username, newPassword) {
  const hash = await hashPassword(newPassword);
  await updateDoc(doc(db, 'users', username), { passwordHash: hash });
}

export async function updateUserRole(username, newRole) {
  await updateDoc(doc(db, 'users', username), { role: newRole });
}
