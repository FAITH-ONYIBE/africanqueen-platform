/**
 * Minimal promise wrapper over IndexedDB.
 * Stores:
 *  outbox       queued server actions waiting for a connection
 *  submissions  local record of everything the user sent (queued or sent)
 *  saved        items bookmarked for offline reading
 *  drafts       unfinished forms (e.g. job applications)
 *  kv           small app state (profile, preferences, local copies of content)
 */
const DB_NAME = 'africanqueen';
const DB_VERSION = 2;
export type StoreName = 'outbox' | 'submissions' | 'saved' | 'drafts' | 'kv';
const STORES: StoreName[] = ['outbox', 'submissions', 'saved', 'drafts', 'kv'];

export const STORE_EVENT = 'aq:store-changed';
const notify = (store: StoreName) => window.dispatchEvent(new CustomEvent(STORE_EVENT, { detail: store }));

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(store, mode);
    const req = fn(tx.objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

export const idb = {
  async put<T extends { id: string }>(store: StoreName, value: T) {
    const r = await run(store, 'readwrite', (s) => s.put(value));
    if (store !== 'kv') notify(store);
    return r;
  },
  get: <T>(store: StoreName, id: string) => run<T | undefined>(store, 'readonly', (s) => s.get(id)),
  getAll: <T>(store: StoreName) => run<T[]>(store, 'readonly', (s) => s.getAll()),
  async remove(store: StoreName, id: string) {
    const r = await run(store, 'readwrite', (s) => s.delete(id));
    if (store !== 'kv') notify(store);
    return r;
  },
  async clearAll() {
    for (const s of STORES) {
      await run(s, 'readwrite', (st) => st.clear());
      notify(s);
    }
  },
};
