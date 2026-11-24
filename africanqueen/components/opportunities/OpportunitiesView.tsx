'use client';
import { Building2, CalendarClock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Pagination } from '@/components/ui/Pagination';
import { SaveButton } from '@/components/ui/SaveButton';
import { Tabs } from '@/components/ui/Tabs';
import { useOpportunities } from '@/hooks/useOpportunities';
import { usePaged } from '@/hooks/usePaged';
import { OPP_CATEGORIES, type OppCategory, type Opportunity } from '@/lib/mock-data/opportunities';

const SORTS = ['Closing soon', 'Newest first'];
const LOCATIONS = ['Any location', 'Remote friendly', 'On-site only'];
const todayIso = () => new Date().toISOString().slice(0, 10);

export function OppCard({ o }: { o: Opportunity }) {
  const closed = o.status === 'Closed' || o.deadline < todayIso();
  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{o.category}</Badge>
          {o.amount && <Badge tone="success">{o.amount}</Badge>}
          {closed && <Badge tone="danger">Closed</Badge>}
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-normal text-brand-ink">
          <Link href={`/opportunities/${o.id}`} className="hover:text-brand-red">{o.title}</Link>
        </h2>
        <p className="mt-1 text-sm text-brand-muted">{o.summary}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
          <span className="inline-flex items-center gap-1.5"><Building2 size={14} aria-hidden />{o.org}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden />{o.location}{o.remote ? ' · Remote friendly' : ''}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} aria-hidden />Closes {formatDate(o.deadline)}</span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Skills">
          {o.tags.map((t) => <li key={t} className="rounded-full border border-brand-line px-2.5 py-0.5 text-xs text-brand-muted">{t}</li>)}
        </ul>
      </div>
      <div className="flex flex-none gap-2 sm:flex-col">
        <Button size="md" variant="outline" href={`/opportunities/${o.id}`}>View</Button>
        <SaveButton item={{ id: `opportunity:${o.id}`, kind: 'opportunity', title: o.title, subtitle: `${o.org} · closes ${formatDate(o.deadline)}`, href: `/opportunities/${o.id}`, body: `${o.description}\n\nRequirements:\n- ${o.requirements.join('\n- ')}` }} />
      </div>
    </Card>
  );
}

export function OpportunitiesView() {
  const [all] = useOpportunities();
  const [tab, setTab] = useState<'All' | OppCategory>('All');
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState(LOCATIONS[0]);
  const [sort, setSort] = useState(SORTS[0]);

  const published = useMemo(() => all.filter((o) => o.status !== 'Draft'), [all]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return published
      .filter((o) => tab === 'All' || o.category === tab)
      .filter((o) => loc === LOCATIONS[0] || (loc === LOCATIONS[1] ? o.remote : !o.remote))
      .filter((o) => !t || `${o.title} ${o.org} ${o.summary} ${o.tags.join(' ')}`.toLowerCase().includes(t))
      .sort((a, b) => {
        const ac = a.status === 'Closed' || a.deadline < todayIso() ? 1 : 0;
        const bc = b.status === 'Closed' || b.deadline < todayIso() ? 1 : 0;
        if (ac !== bc) return ac - bc;
        return sort === SORTS[0] ? a.deadline.localeCompare(b.deadline) : b.postedAt.localeCompare(a.postedAt);
      });
  }, [published, tab, q, loc, sort]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 5);
  const count = (c: OppCategory) => published.filter((o) => o.category === c).length;

  return (
    <div className="container-catalog mt-6">
      <Tabs
        label="Opportunity type"
        value={tab}
        onChange={(v) => { setTab(v); setPage(1); }}
        tabs={[{ value: 'All', label: 'All', count: published.length }, ...OPP_CATEGORIES.map((c) => ({ value: c, label: `${c}s`, count: count(c) }))]}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="Search roles, organisations or skills" label="Search opportunities" />
        <FilterSelect label="Location" value={loc} onChange={setLoc} options={LOCATIONS} />
        <FilterSelect label="Sort" value={sort} onChange={setSort} options={SORTS} />
      </div>
      <p className="mt-4 text-sm text-brand-muted">Save any listing to read it later without a connection.</p>
      <div className="mt-4 space-y-4">
        {pageItems.length === 0 ? (
          <EmptyState title="No opportunities match" text="Try another category or clear your search." action={<Button size="sm" variant="outline" onClick={() => { setQ(''); setLoc(LOCATIONS[0]); setTab('All'); }}>Clear filters</Button>} />
        ) : (
          pageItems.map((o) => <OppCard key={o.id} o={o} />)
        )}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={5} />
    </div>
  );
}
