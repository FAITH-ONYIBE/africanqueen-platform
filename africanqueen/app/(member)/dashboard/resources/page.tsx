'use client';
import { Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, EmptyState } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { SaveButton } from '@/components/ui/SaveButton';
import { RESOURCE_TYPES, resources, type Resource } from '@/lib/mock-data/content';

export default function ResourcesPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState(RESOURCE_TYPES[0]);
  const [open, setOpen] = useState<Resource | null>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return resources.filter((r) => type === RESOURCE_TYPES[0] || r.type === type).filter((r) => !t || `${r.title} ${r.summary} ${r.topic}`.toLowerCase().includes(t));
  }, [q, type]);
  const asItem = (r: Resource) => ({ id: `resource:${r.id}`, kind: 'resource' as const, title: r.title, subtitle: `${r.type} · ${r.minutes} min`, href: '/dashboard/resources', body: r.body });

  return (
    <>
      <PageHead title="Resources" text="Guides, templates and cheat sheets. Save any of them to read offline." />
      <div className="flex flex-wrap gap-3"><SearchBox value={q} onChange={setQ} placeholder="Search resources" label="Search resources" /><FilterSelect label="Type" value={type} onChange={setType} options={RESOURCE_TYPES} /></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {list.length === 0 ? <div className="sm:col-span-2"><EmptyState title="No resources found" text="Try a different search or type." /></div> : list.map((r) => (
          <Card key={r.id} className="flex flex-col p-5">
            <div className="flex items-center gap-2"><Badge tone="brand">{r.type}</Badge><Badge>{r.topic}</Badge></div>
            <h2 className="mt-3 text-base font-semibold tracking-normal">{r.title}</h2>
            <p className="mt-1 text-sm text-brand-muted">{r.summary}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-muted"><Clock size={12} aria-hidden />{r.minutes} min</p>
            <div className="mt-auto flex gap-2 pt-4"><Button size="md" variant="outline" onClick={() => setOpen(r)}>Read</Button><SaveButton item={asItem(r)} /></div>
          </Card>
        ))}
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title ?? ''}>
        {open && <><p className="text-xs text-brand-muted">{open.type} · {open.minutes} min</p><p className="mt-3 leading-relaxed">{open.body}</p><div className="mt-5"><SaveButton item={asItem(open)} /></div></>}
      </Modal>
    </>
  );
}
