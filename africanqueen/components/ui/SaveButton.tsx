'use client';
import { SaveIcon } from './Bits';
import { useToast } from './Toast';
import { useSaved, type SavedItem } from '@/hooks/useSaved';

export function SaveButton({ item, compact = false }: { item: Omit<SavedItem, 'savedAt'>; compact?: boolean }) {
  const { isSaved, toggle } = useSaved();
  const toast = useToast();
  const saved = isSaved(item.id);
  return (
    <button
      onClick={async () => {
        const nowSaved = await toggle(item);
        toast(nowSaved ? 'Saved on this device. You can read it offline.' : 'Removed from saved items.', nowSaved ? 'success' : 'info');
      }}
      aria-pressed={saved}
      aria-label={saved ? `Unsave ${item.title}` : `Save ${item.title} for offline`}
      className={`inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors ${
        saved ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-brand-line bg-white text-brand-ink hover:bg-brand-mist'
      }`}
    >
      <SaveIcon saved={saved} />
      {!compact && (saved ? 'Saved' : 'Save')}
    </button>
  );
}
