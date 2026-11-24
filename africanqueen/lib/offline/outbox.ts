import { idb } from './db';

export type ActionType =
  | 'course-interest'
  | 'event-registration'
  | 'mentor-request'
  | 'application'
  | 'contact-message'
  | 'community-post'
  | 'connection-request';

export type OutboxAction = {
  id: string;
  type: ActionType;
  payload: Record<string, unknown>;
  createdAt: number;
};

export const OUTBOX_EVENT = 'aq:outbox-changed';
const notify = () => window.dispatchEvent(new Event(OUTBOX_EVENT));

export async function enqueue(type: ActionType, payload: Record<string, unknown>) {
  const action: OutboxAction = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    payload,
    createdAt: Date.now(),
  };
  await idb.put('outbox', action);
  notify();
  return action;
}

export const pendingActions = () => idb.getAll<OutboxAction>('outbox');

/**
 * Replays queued actions in order through `send`. A failed action stays queued
 * and stops the run so ordering is preserved. `onSent` lets callers update UI state.
 */
export async function flushOutbox(send: (a: OutboxAction) => Promise<void>, onSent?: (a: OutboxAction) => Promise<void> | void) {
  const items = (await pendingActions()).sort((a, b) => a.createdAt - b.createdAt);
  let done = 0;
  for (const item of items) {
    try {
      await send(item);
      await idb.remove('outbox', item.id);
      await onSent?.(item);
      window.dispatchEvent(new CustomEvent('aq:action-synced', { detail: item.id }));
      done++;
    } catch {
      break;
    }
  }
  notify();
  return done;
}
