'use client';
import { useSyncExternalStore } from 'react';

/**
 * FRONTEND-ONLY authentication used for demonstration.
 * Real authentication (hashing, tokens, sessions) belongs on the server;
 * replace login/register below with API calls when a backend exists.
 */
export type Role = 'member' | 'admin';
export type Session = { id: string; name: string; email: string; role: Role; country: string; joinedAt: string };

const SESSION_KEY = 'aq:session';
const USERS_KEY = 'aq:users';
const EVT = 'aq:session-changed';

export const DEMO_ACCOUNTS = [
  { label: 'Member', email: 'amara@africanqueen.demo', password: 'member1234' },
  { label: 'Admin', email: 'admin@africanqueen.demo', password: 'admin1234' },
];

const DEMO_USERS: (Session & { password: string })[] = [
  { id: 'u-demo-member', name: 'Amara Eze', email: 'amara@africanqueen.demo', password: 'member1234', role: 'member', country: 'Nigeria', joinedAt: '2026-01-14' },
  { id: 'u-demo-admin', name: 'Programme Admin', email: 'admin@africanqueen.demo', password: 'admin1234', role: 'admin', country: 'Nigeria', joinedAt: '2025-06-02' },
];

type StoredUser = Session & { hash: string };

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
const readUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};
const strip = ({ hash: _h, ...s }: StoredUser): Session => s;
const setSession = (s: Session | null) => {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(EVT));
};

export async function login(email: string, password: string): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const e = email.trim().toLowerCase();
  const demo = DEMO_USERS.find((u) => u.email === e && u.password === password);
  if (demo) {
    const { password: _p, ...s } = demo;
    setSession(s);
    return { ok: true, session: s };
  }
  const hash = await sha256(password);
  const user = readUsers().find((u) => u.email === e && u.hash === hash);
  if (!user) return { ok: false, error: 'Email or password is incorrect.' };
  const s = strip(user);
  setSession(s);
  return { ok: true, session: s };
}

export async function register(input: { name: string; email: string; password: string; country: string }) {
  const email = input.email.trim().toLowerCase();
  if (DEMO_USERS.some((u) => u.email === email) || readUsers().some((u) => u.email === email)) {
    return { ok: false as const, error: 'An account with this email already exists.' };
  }
  const user: StoredUser = {
    id: `u-${Date.now()}`,
    name: input.name.trim(),
    email,
    role: 'member',
    country: input.country,
    joinedAt: new Date().toISOString().slice(0, 10),
    hash: await sha256(input.password),
  };
  localStorage.setItem(USERS_KEY, JSON.stringify([...readUsers(), user]));
  const s = strip(user);
  setSession(s);
  return { ok: true as const, session: s };
}

export const logout = () => setSession(null);

export const updateSession = (patch: Partial<Pick<Session, 'name' | 'country'>>) => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw) setSession({ ...JSON.parse(raw), ...patch });
};

let cacheRaw: string | null | undefined;
let cacheVal: Session | null = null;
function snapshot(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cacheVal = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      cacheVal = null;
    }
  }
  return cacheVal;
}
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener('storage', cb);
  };
}

export const useSession = () => useSyncExternalStore(subscribe, snapshot, () => null);
export const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);
