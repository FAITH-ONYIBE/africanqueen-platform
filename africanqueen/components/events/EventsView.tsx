'use client';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { SaveButton } from '@/components/ui/SaveButton';
import { Tabs } from '@/components/ui/Tabs';
import { useToast } from '@/components/ui/Toast';
import { useIdbList } from '@/hooks/useIdbList';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePaged } from '@/hooks/usePaged';
import { useSession } from '@/lib/auth/session';
import { EVENT_COUNTRIES, EVENT_TYPES, events, type EventItem } from '@/lib/mock-data/events';
import { submitAction, type Submission } from '@/lib/offline/actions';

const today = () => new Date().toISOString().slice(0, 10);

function EventCard({ ev, status, onOpen }: { ev: EventItem; status?: Submission['status']; onOpen: () => void }) {
  const d = new Date(ev.date + 'T00:00:00');
  const full = ev.registered >= ev.capacity;
  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <div className="flex h-[72px] w-[72px] flex-none flex-col items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red" aria-hidden>
        <span className="text-2xl font-bold leading-none">{d.getDate()}</span>
        <span className="mt-1 text-xs font-semibold uppercase">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{ev.type}</Badge>
          {status === 'sent' && <Badge tone="success">Registered</Badge>}
          {status === 'queued' && <Badge tone="warn">Queued, will send when online</Badge>}
          {full && !status && <Badge tone="danger">Full</Badge>}
        </div>
        <h2 className="mt-2 text-lg font-semibold tracking-normal text-brand-ink">{ev.title}</h2>
        <p className="mt-1 text-sm text-brand-muted">{ev.summary}</p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
          <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden />{ev.time}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden />{ev.location}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} aria-hidden />{ev.registered}/{ev.capacity}</span>
        </p>
      </div>
      <div className="flex flex-none gap-2 sm:flex-col">
        <Button size="md" variant="outline" onClick={onOpen}>Details</Button>
        <SaveButton item={{ id: `event:${ev.id}`, kind: 'event', title: ev.title, subtitle: `${formatDate(ev.date)} · ${ev.location}`, href: '/events', body: ev.description }} />
      </div>
    </Card>
  );
}

export function EventsView() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [q, setQ] = useState('');
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [where, setWhere] = useState(EVENT_COUNTRIES[0]);
  const [open, setOpen] = useState<EventItem | null>(null);
  const online = useOnlineStatus();
  const session = useSession();
  const toast = useToast();
  const { items: subs } = useIdbList<Submission>('submissions');
  const [busy, setBusy] = useState(false);

  const upcomingCount = events.filter((e) => e.date >= today()).length;
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return events
      .filter((e) => (tab === 'upcoming' ? e.date >= today() : e.date < today()))
      .filter((e) => type === EVENT_TYPES[0] || e.type === type)
      .filter((e) => where === EVENT_COUNTRIES[0] || e.country === where)
      .filter((e) => !t || `${e.title} ${e.summary} ${e.location}`.toLowerCase().includes(t))
      .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [tab, q, type, where]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 5);

  const statusFor = (id: string) => subs.find((s) => s.type === 'event-registration' && s.payload.eventId === id)?.status;

  async function register(ev: EventItem) {
    setBusy(true);
    try {
      const rec = await submitAction('event-registration', `Registration: ${ev.title}`, { eventId: ev.id }, online);
      toast(rec.status === 'sent' ? `You’re registered for ${ev.title}.` : 'You’re offline. Your registration is saved and will be sent when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
      setOpen(null);
    } catch {
      toast('Could not save your registration. Please try again.', 'info');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-catalog mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Event period"
          value={tab}
          onChange={(v) => { setTab(v); setPage(1); }}
          tabs={[{ value: 'upcoming', label: 'Upcoming', count: upcomingCount }, { value: 'past', label: 'Past', count: events.length - upcomingCount }]}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="Search events" label="Search events" />
        <FilterSelect label="Event type" value={type} onChange={setType} options={EVENT_TYPES} />
        <FilterSelect label="Location" value={where} onChange={setWhere} options={EVENT_COUNTRIES} />
      </div>

      <div className="mt-5 space-y-4">
        {pageItems.length === 0 ? (
          <EmptyState title="No events match" text="Try a different type or location, or clear your search." action={<Button size="sm" variant="outline" onClick={() => { setQ(''); setType(EVENT_TYPES[0]); setWhere(EVENT_COUNTRIES[0]); }}>Clear filters</Button>} />
        ) : (
          pageItems.map((ev) => <EventCard key={ev.id} ev={ev} status={statusFor(ev.id)} onOpen={() => setOpen(ev)} />)
        )}
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={5} />

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title ?? ''}>
        {open && (
          <>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-muted">
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden />{formatDate(open.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden />{open.time}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden />{open.location}</span>
            </p>
            <p className="mt-4">{open.description}</p>
            <p className="mt-3 text-sm text-brand-muted"><strong className="text-brand-ink">Speakers:</strong> {open.speakers.join(', ')}</p>
            <div className="mt-6">
              {open.date < today() ? (
                <p className="text-sm text-brand-muted">This event has ended.</p>
              ) : statusFor(open.id) ? (
                <Badge tone={statusFor(open.id) === 'sent' ? 'success' : 'warn'}>{statusFor(open.id) === 'sent' ? 'You are registered' : 'Registration queued'}</Badge>
              ) : !session ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" href="/login?next=/events">Log in to register</Button>
                  <Button size="sm" variant="outline" href="/join">Join free</Button>
                </div>
              ) : (
                <>
                  <Button size="sm" onClick={() => register(open)} disabled={busy || open.registered >= open.capacity}>
                    {open.registered >= open.capacity ? 'Event full' : busy ? 'Saving…' : 'Register'}
                  </Button>
                  {!online && <p className="mt-2 text-xs text-brand-muted">You’re offline. We’ll save your registration and send it when you reconnect.</p>}
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
