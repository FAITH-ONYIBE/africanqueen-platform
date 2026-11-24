'use client';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FilterSelect, SearchBox, SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useOpportunities } from '@/hooks/useOpportunities';
import { usePaged } from '@/hooks/usePaged';
import { OPP_CATEGORIES, type Opportunity, type OppCategory, type OppStatus } from '@/lib/mock-data/opportunities';

type Form = { title: string; org: string; category: OppCategory | ''; location: string; remote: boolean; deadline: string; amount: string; tags: string; summary: string; description: string; requirements: string; status: OppStatus };
const empty: Form = { title: '', org: '', category: '', location: '', remote: false, deadline: '', amount: '', tags: '', summary: '', description: '', requirements: '', status: 'Draft' };
const tone = { Published: 'success', Draft: 'neutral', Closed: 'danger' } as const;

export default function AdminOpportunities() {
  const [opps, setOpps] = useOpportunities();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [del, setDel] = useState<Opportunity | null>(null);

  const list = useMemo(() => { const t = q.trim().toLowerCase(); return opps.filter((o) => (status === 'All statuses' || o.status === status) && (!t || `${o.title} ${o.org}`.toLowerCase().includes(t))); }, [opps, q, status]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 6);

  const openNew = () => { setForm(empty); setErrors({}); setEditing('new'); };
  const openEdit = (o: Opportunity) => { setForm({ title: o.title, org: o.org, category: o.category, location: o.location, remote: o.remote, deadline: o.deadline, amount: o.amount ?? '', tags: o.tags.join(', '), summary: o.summary, description: o.description, requirements: o.requirements.join('\n'), status: o.status }); setErrors({}); setEditing(o.id); };

  function save() {
    const e: typeof errors = {};
    if (form.title.trim().length < 4) e.title = 'Enter a title.';
    if (!form.org.trim()) e.org = 'Enter the organisation.';
    if (!form.category) e.category = 'Choose a category.';
    if (!form.location.trim()) e.location = 'Enter a location.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) e.deadline = 'Choose a deadline.';
    if (form.summary.trim().length < 10) e.summary = 'Write a short summary.';
    if (form.description.trim().length < 20) e.description = 'Write at least 20 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const base = { title: form.title.trim(), org: form.org.trim(), category: form.category as OppCategory, location: form.location.trim(), remote: form.remote, deadline: form.deadline, amount: form.amount.trim() || undefined, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), summary: form.summary.trim(), description: form.description.trim(), requirements: form.requirements.split('\n').map((r) => r.trim()).filter(Boolean), status: form.status };
    if (editing === 'new') setOpps((os) => [{ id: `opp-${Date.now()}`, postedAt: new Date().toISOString().slice(0, 10), ...base }, ...os]);
    else setOpps((os) => os.map((o) => (o.id === editing ? { ...o, ...base } : o)));
    toast(editing === 'new' ? 'Opportunity created.' : 'Changes saved.');
    setEditing(null);
  }

  return (
    <>
      <PageHead title="Opportunities" text="Create, edit and publish listings. Published listings appear on the public Opportunities page." action={<Button size="sm" className="gap-2" onClick={openNew}><Plus size={16} aria-hidden />New opportunity</Button>} />
      <div className="flex flex-wrap gap-3"><SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search listings" label="Search listings" /><FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={['All statuses', 'Published', 'Draft', 'Closed']} /></div>
      <Card className="mt-4 overflow-hidden">
        {pageItems.length === 0 ? <div className="p-6"><EmptyState title="No listings" text="Create your first opportunity." action={<Button size="sm" onClick={openNew}>New opportunity</Button>} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Opportunities</caption>
            <thead className="border-b border-brand-line bg-brand-mist text-xs font-semibold text-brand-muted"><tr><th scope="col" className="px-5 py-3">Title</th><th scope="col" className="px-3 py-3">Category</th><th scope="col" className="px-3 py-3">Deadline</th><th scope="col" className="px-3 py-3">Status</th><th scope="col" className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody>{pageItems.map((o) => (
              <tr key={o.id} className="border-b border-brand-line last:border-0">
                <td className="px-5 py-3"><span className="block font-medium">{o.title}</span><span className="block text-xs text-brand-muted">{o.org}</span></td>
                <td className="px-3 py-3 text-brand-muted">{o.category}</td><td className="px-3 py-3 text-brand-muted">{formatDate(o.deadline)}</td>
                <td className="px-3 py-3"><Badge tone={tone[o.status]}>{o.status}</Badge></td>
                <td className="px-5 py-3"><span className="flex justify-end gap-2"><button onClick={() => openEdit(o)} aria-label={`Edit ${o.title}`} className="rounded-md border border-brand-line p-2 hover:bg-brand-mist"><Pencil size={14} /></button><button onClick={() => setDel(o)} aria-label={`Delete ${o.title}`} className="rounded-md border border-brand-line p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></span></td>
              </tr>))}</tbody></table></div>
        )}
      </Card>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={6} />

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'New opportunity' : 'Edit opportunity'}>
        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          <TextInput id="o-title" label="Title" value={form.title} error={errors.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2"><TextInput id="o-org" label="Organisation" value={form.org} error={errors.org} onChange={(e) => setForm({ ...form, org: e.target.value })} /><SelectInput id="o-cat" label="Category" placeholder="Choose" options={OPP_CATEGORIES} value={form.category} error={errors.category} onChange={(e) => setForm({ ...form, category: e.target.value as OppCategory })} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><TextInput id="o-loc" label="Location" value={form.location} error={errors.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /><TextInput id="o-dead" label="Deadline" type="date" value={form.deadline} error={errors.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} className="h-4 w-4 accent-brand-red" />Remote friendly</label>
          <div className="grid gap-4 sm:grid-cols-2"><TextInput id="o-amt" label="Amount (optional)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /><TextInput id="o-tags" label="Tags" hint="Comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
          <TextInput id="o-sum" label="Summary" value={form.summary} error={errors.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          <TextArea id="o-desc" label="Description" value={form.description} error={errors.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextArea id="o-req" label="Requirements" rows={3} hint="One per line" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <SelectInput id="o-status" label="Status" options={['Draft', 'Published', 'Closed']} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OppStatus })} />
        </div>
        <div className="mt-5 flex gap-3"><Button size="sm" onClick={save}>Save</Button><Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
      </Modal>
      <ConfirmModal open={!!del} danger title="Delete this opportunity?" text={del ? `“${del.title}” will be removed from the public listings.` : ''} confirmLabel="Delete" onClose={() => setDel(null)} onConfirm={() => { setOpps((os) => os.filter((o) => o.id !== del?.id)); toast('Opportunity deleted.', 'info'); }} />
    </>
  );
}
