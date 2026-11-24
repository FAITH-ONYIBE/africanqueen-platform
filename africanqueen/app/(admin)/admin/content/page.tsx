g'use client';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { announcementsSeed, type Announcement } from '@/lib/mock-data/content';

const CATS = ['Programme', 'Event', 'Opportunity', 'Community'];
type Form = { title: string; body: string; category: string; pinned: boolean };
const empty: Form = { title: '', body: '', category: '', pinned: false };

export default function AdminContent() {
  const [items, setItems] = useKV<Announcement[]>('announcements', announcementsSeed);
  const toast = useToast();
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [del, setDel] = useState<Announcement | null>(null);

  function save() {
    const e: typeof errors = {};
    if (form.title.trim().length < 5) e.title = 'Enter a title (5+ characters).';
    if (!form.category) e.category = 'Choose a category.';
    if (form.body.trim().length < 20) e.body = 'Write at least 20 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const base = { title: form.title.trim(), body: form.body.trim(), category: form.category as Announcement['category'], pinned: form.pinned };
    if (editing === 'new') setItems((xs) => [{ id: `a-${Date.now()}`, at: new Date().toISOString().slice(0, 10), ...base }, ...xs]);
    else setItems((xs) => xs.map((x) => (x.id === editing ? { ...x, ...base } : x)));
    toast(editing === 'new' ? 'Announcement published.' : 'Changes saved.');
    setEditing(null);
  }

  return (
    <>
      <PageHead title="Content" text="Announcements shown to members on their dashboard." action={<Button size="sm" className="gap-2" onClick={() => { setForm(empty); setErrors({}); setEditing('new'); }}><Plus size={16} aria-hidden />New announcement</Button>} />
      <div className="space-y-3">
        {items.length === 0 ? <EmptyState title="No announcements" text="Publish one to inform members." /> : items.map((a) => (
          <Card key={a.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge tone="brand">{a.category}</Badge>{a.pinned && <Badge tone="warn">Pinned</Badge>}<span className="text-xs text-brand-muted">{formatDate(a.at)}</span></div><p className="mt-2 font-medium">{a.title}</p><p className="mt-1 line-clamp-2 text-sm text-brand-muted">{a.body}</p></div>
            <div className="flex gap-2"><button onClick={() => { setForm({ title: a.title, body: a.body, category: a.category, pinned: !!a.pinned }); setErrors({}); setEditing(a.id); }} aria-label={`Edit ${a.title}`} className="rounded-md border border-brand-line p-2 hover:bg-brand-mist"><Pencil size={14} /></button><button onClick={() => setDel(a)} aria-label={`Delete ${a.title}`} className="rounded-md border border-brand-line p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></div>
          </Card>
        ))}
      </div>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'New announcement' : 'Edit announcement'}>
        <div className="space-y-4">
          <TextInput id="an-title" label="Title" value={form.title} error={errors.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <SelectInput id="an-cat" label="Category" placeholder="Choose" options={CATS} value={form.category} error={errors.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <TextArea id="an-body" label="Message" value={form.body} error={errors.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="h-4 w-4 accent-brand-red" />Pin to the top</label>
          <div className="flex gap-3"><Button size="sm" onClick={save}>Publish</Button><Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
        </div>
      </Modal>
      <ConfirmModal open={!!del} danger title="Delete this announcement?" text={del ? `“${del.title}” will be removed for all members.` : ''} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={() => { setItems((xs) => xs.filter((x) => x.id !== del?.id)); toast('Announcement deleted.', 'info'); }} />
    </>
  );
}
