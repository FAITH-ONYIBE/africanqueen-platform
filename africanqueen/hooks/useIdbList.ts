'use client';
import { useCallback, useEffect, useState } from 'react';
import { idb, STORE_EVENT, type StoreName } from '@/lib/offline/db';

/** Live list of everything in an IndexedDB store; refreshes on writes. */
export function useIdbList<T extends { id: string }>(store: StoreName) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(() => {
    idb
      .getAll<T>(store)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setReady(true));
  }, [store]);

  useEffect(() => {
    load();
    const h = (e: Event) => (e as CustomEvent).detail === store && load();
    window.addEventListener(STORE_EVENT, h);
    return () => window.removeEventListener(STORE_EVENT, h);
  }, [load, store]);

  return { items, ready };
}
