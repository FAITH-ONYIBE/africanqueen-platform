'use client';
import { useCallback } from 'react';
import { idb } from '@/lib/offline/db';
import { useIdbList } from './useIdbList';

export type SavedItem = {
  id: string; // e.g. "opportunity:job-1"
  kind: 'opportunity' | 'event' | 'resource' | 'mentor';
  title: string;
  subtitle: string;
  href: string;
  savedAt: number;
  /** Snapshot so the item can still be read with no connection. */
  body?: string;
};

export function useSaved() {
  const { items, ready } = useIdbList<SavedItem>('saved');
  const isSaved = useCallback((id: string) => items.some((i) => i.id === id), [items]);
  const toggle = useCallback(
    async (item: Omit<SavedItem, 'savedAt'>) => {
      if (items.some((i) => i.id === item.id)) {
        await idb.remove('saved', item.id);
        return false;
      }
      await idb.put('saved', { ...item, savedAt: Date.now() });
      return true;
    },
    [items]
  );
  const remove = useCallback((id: string) => idb.remove('saved', id), []);
  return { items: items.sort((a, b) => b.savedAt - a.savedAt), ready, isSaved, toggle, remove };
}
