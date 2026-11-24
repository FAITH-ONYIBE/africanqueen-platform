import { sendQueuedAction } from '@/lib/api/client';
import { idb } from './db';
import { enqueue, type ActionType } from './outbox';

export type Submission = {
  id: string;
  type: ActionType;
  title: string;
  status: 'queued' | 'sent';
  createdAt: number;
  outboxId?: string;
  payload: Record<string, unknown>;
};

/**
 * Single entry point for every server-dependent user action.
 * Online  -> sent straight away (stub today, real fetch later).
 * Offline -> queued in IndexedDB and replayed when the connection returns.
 */
export async function submitAction(
  type: ActionType,
  title: string,
  payload: Record<string, unknown>,
  online: boolean
): Promise<Submission> {
  const base = { id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, title, createdAt: Date.now(), payload };
  if (online) {
    await sendQueuedAction({ id: base.id, type, payload, createdAt: base.createdAt });
    const rec: Submission = { ...base, status: 'sent' };
    await idb.put('submissions', rec);
    return rec;
  }
  const action = await enqueue(type, { ...payload, submissionId: base.id });
  const rec: Submission = { ...base, status: 'queued', outboxId: action.id };
  await idb.put('submissions', rec);
  return rec;
}

/** Called by the sync loop after a queued action reaches the server. */
export async function markSent(action: { id: string }) {
  const all = await idb.getAll<Submission>('submissions');
  const hit = all.find((s) => s.outboxId === action.id);
  if (hit) await idb.put('submissions', { ...hit, status: 'sent' });
}
