'use client';
import { RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { useToast } from '@/components/ui/Toast';
import { useIdbList } from '@/hooks/useIdbList';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSaved, type SavedItem } from '@/hooks/useSaved';
import { sendQueuedAction } from '@/lib/api/client';
import { markSent, type Submission } from '@/lib/offline/actions';
import { idb } from '@/lib/offline/db';
import { flushOutbox } from '@/lib/offline/outbox';

type Draft = { id: string; title: string; updatedAt: number };
const time = (t: number) => new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function SavedPage() {
  const [tab, setTab] = useState<'saved' | 'drafts' | 'activity'>('saved');
  const { items: saved, remove } = useSaved();
  const { items: drafts } = useIdbList<Draft>('drafts');
  const { items: subs } = useIdbList<Submission>('submissions');
  const online = useOnlineStatus();
  const toast = useToast();
  const [read, setRead] = useState<SavedItem | null>(null);
  const [syncing, setSyncing] = useState(false);
  const queued = subs.filter((s) => s.status === 'queued').length;

  async function syncNow() {
    setSyncing(true);
    const n = await flushOutbox(sendQueuedAction, markSent);
    setSyncing(false);
    toast(n ? `${n} action${n === 1 ? '' : 's'} synced.` : 'Nothing was waiting to sync.', n ? 'success' : 'info');
  }

  return (
    <>
      <PageHead title="Saved and offline" text="Everything here is stored on this device, so you can read it without a connection." />
      <Tabs label="Saved and offline" value={tab} onChange={setTab} tabs={[{ value: 'saved', label: 'Saved items', count: saved.length }, { value: 'drafts', label: 'Drafts', count: drafts.length }, { value: 'activity', label: 'Activity and sync', count: queued || undefined }]} />

      <div className="mt-5 space-y-3">
        {tab === 'saved' && (saved.length === 0 ? <EmptyState title="Nothing saved yet" text="Use the Save button on opportunities, events, resources and mentors." action={<Button href="/opportunities" size="sm">Browse opportunities</Button>} /> : saved.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="min-w-0"><Badge tone="brand">{s.kind}</Badge><p className="mt-2 font-medium text-brand-ink">{s.title}</p><p className="text-sm text-brand-muted">{s.subtitle}</p></div>
            <div className="flex gap-2"><Button size="md" variant="outline" onClick={() => setRead(s)}>Read offline</Button><button onClick={() => remove(s.id)} aria-label={`Remove ${s.title}`} className="rounded-md border border-brand-line p-2 text-brand-muted hover:bg-brand-mist"><Trash2 size={16} /></button></div>
          </Card>
        )))}

        {tab === 'drafts' && (drafts.length === 0 ? <EmptyState title="No drafts" text="Application drafts save automatically while you type." /> : drafts.map((d) => (
          <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div><p className="font-medium text-brand-ink">{d.title}</p><p className="text-sm text-brand-muted">Last edited {time(d.updatedAt)}</p></div>
            <div className="flex gap-2"><Button size="md" variant="outline" href={`/opportunities/${d.id.replace('application:', '')}`}>Continue</Button><button onClick={() => idb.remove('drafts', d.id)} aria-label={`Delete ${d.title}`} className="rounded-md border border-brand-line p-2 text-brand-muted hover:bg-brand-mist"><Trash2 size={16} /></button></div>
          </Card>
        )))}

        {tab === 'activity' && (
          <>
            <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-sm text-brand-muted">{queued ? `${queued} action${queued === 1 ? ' is' : 's are'} waiting to send.` : 'All actions are up to date.'}</p>
              <Button size="sm" variant="outline" className="gap-2" onClick={syncNow} disabled={!online || syncing || !queued}><RefreshCw size={14} aria-hidden />{syncing ? 'Syncing…' : online ? 'Sync now' : 'Offline'}</Button>
            </Card>
            {subs.length === 0 ? <EmptyState title="No activity yet" text="Registrations, applications and requests you make appear here." /> : subs.sort((a, b) => b.createdAt - a.createdAt).map((s) => (
              <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-sm font-medium text-brand-ink">{s.title}</p><p className="text-xs text-brand-muted">{time(s.createdAt)}</p></div><Badge tone={s.status === 'sent' ? 'success' : 'warn'}>{s.status === 'sent' ? 'Sent' : 'Queued'}</Badge></Card>
            ))}
          </>
        )}
      </div>

      <Modal open={!!read} onClose={() => setRead(null)} title={read?.title ?? ''}>
        {read && <><p className="text-xs text-brand-muted">{read.subtitle}</p><p className="mt-3 whitespace-pre-line leading-relaxed">{read.body || 'No offline text was stored for this item.'}</p><div className="mt-5"><Link href={read.href} className="text-sm font-medium text-brand-red hover:underline">Open the full page (needs a connection if not cached)</Link></div></>}
      </Modal>
    </>
  );
}
