'use client';
import { useCallback, useEffect, useState } from 'react';
import { idb } from '@/lib/offline/db';

/**
 * useState that persists to IndexedDB (kv store). One owner per key.
 * `ready` is false until the stored value (if any) has been loaded.
 */
export function useKV<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    idb
      .get<{ id: string; value: T }>('kv', key)
      .then((r) => alive && r && setValue(r.value))
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        idb.put('kv', { id: key, value: v }).catch(() => {});
        return v;
      });
    },
    [key]
  );

  return [value, update, ready] as const;
}
