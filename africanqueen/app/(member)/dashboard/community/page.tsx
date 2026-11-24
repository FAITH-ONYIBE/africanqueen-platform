'use client';
import { MessageSquare, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { FilterSelect, SearchBox, SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePaged } from '@/hooks/usePaged';
import { useSession } from '@/lib/auth/session';
import { THREAD_CATEGORIES, threadsSeed, type Thread } from '@/lib/mock-data/community';
import { submitAction } from '@/lib/offline/actions';

export default function CommunityPage() {
  const session = useSession();
  const online = useOnlineStatus();
  const toast = useToast();
  const [threads, setThreads] = useKV<Thread[]>('community', threadsSeed);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState(THREAD_CATEGORIES[0]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', category: '', body: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof draft, string>>>({});
  const [reply, setReply] = useState('');
  const [replyErr, setReplyErr] = useState('');

  // Clear "pending" flags once queued posts reach the server.
  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      setThreads((ts) => ts.map((t) => ({ ...t, pendingId: t.pendingId === id ? undefined : t.pendingId, replies: t.replies.map((r) => (r.pendingId === id ? { ...r, pendingId: undefined } : r)) })));
    };
    window.addEventListener('aq:action-synced', h);
    return () => window.removeEventListener('aq:action-synced', h);
  }, [setThreads]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return threads
      .filter((x) => cat === THREAD_CATEGORIES[0] || x.category === cat)
      .filter((x) => !t || `${x.title} ${x.body}`.toLowerCase().includes(t))
      .sort((a, b) => b.at.localeCompare(a.at));
  }, [threads, q, cat]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 5);
  const open = threads.find((t) => t.id === openId) ?? null;
  const me = session?.name ?? 'Member';

  async function createThread() {
    const e: typeof errors = {};
    if (draft.title.trim().length < 8) e.title = 'Give your topic a clear title (8+ characters).';
    if (!draft.category) e.category = 'Choose a category.';
    if (draft.body.trim().length < 20) e.body = 'Write at least 20 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const rec = await submitAction('community-post', `Discussion: ${draft.title}`, draft, online);
    const t: Thread = { id: `t-${Date.now()}`, title: draft.title.trim(), category: draft.category, author: me, body: draft.body.trim(), at: new Date().toISOString().slice(0, 10), replies: [], pendingId: rec.status === 'queued' ? rec.outboxId : undefined };
    setThreads((ts) => [t, ...ts]);
    setComposeOpen(false);
    setDraft({ title: '', category: '', body: '' });
    toast(rec.status === 'sent' ? 'Discussion posted.' : 'You’re offline. Your post is saved and will be published when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
  }

  async function postReply() {
    if (!open) return;
    if (reply.trim().length < 2) return setReplyErr('Write a reply first.');
    setReplyErr('');
    const rec = await submitAction('community-post', `Reply in: ${open.title}`, { threadId: open.id, body: reply }, online);
    setThreads((ts) => ts.map((t) => (t.id === open.id ? { ...t, replies: [...t.replies, { id: `r-${Date.now()}`, author: me, body: reply.trim(), at: new Date().toISOString().slice(0, 10), pendingId: rec.status === 'queued' ? rec.outboxId : undefined }] } : t)));
    setReply('');
    if (rec.status === 'queued') toast('You’re offline. Your reply will be posted when you reconnect.', 'info');
  }

  return (
    <>
      <PageHead title="Community" text="Ask questions, share what you’ve learned and support other members." action={<Button size="sm" className="gap-2" onClick={() => setComposeOpen(true)}><Plus size={16} aria-hidden />New discussion</Button>} />
      <div className="flex flex-wrap gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="Search discussions" label="Search discussions" />
        <FilterSelect label="Topic" value={cat} onChange={(v) => { setCat(v); setPage(1); }} options={THREAD_CATEGORIES} />
      </div>
      <div className="mt-4 space-y-3">
        {pageItems.length === 0 ? <EmptyState title="No discussions yet" text="Be the first to start one." action={<Button size="sm" onClick={() => setComposeOpen(true)}>New discussion</Button>} /> : pageItems.map((t) => (
          <button key={t.id} onClick={() => setOpenId(t.id)} className="block w-full text-left">
            <Card className="p-5 transition-colors hover:border-brand-red">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="brand">{t.category}</Badge>{t.pendingId && <Badge tone="warn">Waiting to post</Badge>}</div>
              <h2 className="mt-2 text-base font-semibold tracking-normal text-brand-ink">{t.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-brand-muted">{t.body}</p>
              <p className="mt-3 flex items-center gap-4 text-xs text-brand-muted"><span>{t.author}</span><span>{formatDate(t.at)}</span><span className="inline-flex items-center gap-1"><MessageSquare size={12} aria-hidden />{t.replies.length}</span></p>
            </Card>
          </button>
        ))}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={5} />

      <Modal open={!!open} onClose={() => setOpenId(null)} title={open?.title ?? ''}>
        {open && (
          <div>
            <p className="text-xs text-brand-muted">{open.author} · {formatDate(open.at)}</p>
            <p className="mt-3 leading-relaxed">{open.body}</p>
            <h3 className="mt-6 text-sm font-semibold tracking-normal">{open.replies.length} {open.replies.length === 1 ? 'reply' : 'replies'}</h3>
            <ul className="mt-3 max-h-60 space-y-4 overflow-y-auto">
              {open.replies.map((r) => (
                <li key={r.id} className="flex gap-3"><Avatar name={r.author} size={32} /><div><p className="text-sm font-medium">{r.author} <span className="font-normal text-brand-muted">· {formatDate(r.at)}</span> {r.pendingId && <Badge tone="warn">Waiting to post</Badge>}</p><p className="text-sm text-brand-ink/90">{r.body}</p></div></li>
              ))}
            </ul>
            <div className="mt-5">
              <TextArea id="reply" label="Your reply" rows={3} value={reply} error={replyErr} onChange={(e) => setReply(e.target.value)} />
              <Button size="sm" className="mt-3" onClick={postReply}>{online ? 'Post reply' : 'Save reply'}</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="New discussion">
        <div className="space-y-4">
          <TextInput id="d-title" label="Title" value={draft.title} error={errors.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <SelectInput id="d-cat" label="Category" placeholder="Choose a category" options={THREAD_CATEGORIES.slice(1)} value={draft.category} error={errors.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
          <TextArea id="d-body" label="Your message" value={draft.body} error={errors.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <div className="flex gap-3"><Button size="sm" onClick={createThread}>{online ? 'Post discussion' : 'Save to post later'}</Button><Button size="sm" variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button></div>
        </div>
      </Modal>
    </>
  );
}
