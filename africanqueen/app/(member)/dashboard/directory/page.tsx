'use client';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, EmptyState } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useIdbList } from '@/hooks/useIdbList';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePaged } from '@/hooks/usePaged';
import { MEMBER_COUNTRIES, members } from '@/lib/mock-data/members';
import { submitAction, type Submission } from '@/lib/offline/actions';

export default function DirectoryPage() {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState(MEMBER_COUNTRIES[0]);
  const online = useOnlineStatus();
  const toast = useToast();
  const { items: subs } = useIdbList<Submission>('submissions');

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return members.filter((m) => m.status === 'Active').filter((m) => country === MEMBER_COUNTRIES[0] || m.country === country).filter((m) => !t || `${m.name} ${m.headline} ${m.skills.join(' ')}`.toLowerCase().includes(t));
  }, [q, country]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 9);
  const statusOf = (id: string) => subs.find((s) => s.type === 'connection-request' && s.payload.memberId === id)?.status;

  async function connect(id: string, name: string) {
    const rec = await submitAction('connection-request', `Connection request: ${name}`, { memberId: id }, online);
    toast(rec.status === 'sent' ? `Connection request sent to ${name}.` : 'You’re offline. The request will be sent when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
  }

  return (
    <>
      <PageHead title="Member directory" text="Find members by name, skill or country and send a connection request." />
      <div className="flex flex-wrap gap-3">
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name, role or skill" label="Search members" />
        <FilterSelect label="Country" value={country} onChange={(v) => { setCountry(v); setPage(1); }} options={MEMBER_COUNTRIES} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pageItems.length === 0 ? <div className="sm:col-span-2 xl:col-span-3"><EmptyState title="No members found" text="Try another name, skill or country." /></div> : pageItems.map((m) => {
          const s = statusOf(m.id);
          return (
            <Card key={m.id} className="flex flex-col p-5">
              <div className="flex items-center gap-3"><Avatar name={m.name} size={48} /><div className="min-w-0"><p className="truncate font-semibold text-brand-ink">{m.name}</p><p className="truncate text-sm text-brand-muted">{m.headline} · {m.country}</p></div></div>
              <ul className="mt-4 flex flex-wrap gap-1.5">{m.skills.map((k) => <li key={k} className="rounded-full bg-brand-red/10 px-2.5 py-0.5 text-xs font-medium text-brand-red">{k}</li>)}</ul>
              <div className="mt-auto pt-4">{s ? <Badge tone={s === 'sent' ? 'success' : 'warn'}>{s === 'sent' ? 'Request sent' : 'Queued'}</Badge> : <Button size="md" variant="outline" onClick={() => connect(m.id, m.name)}>Connect</Button>}</div>
            </Card>
          );
        })}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={9} />
    </>
  );
}
