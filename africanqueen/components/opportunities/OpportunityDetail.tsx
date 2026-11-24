'use client';
import { ArrowLeft, Building2, CalendarClock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { SaveButton } from '@/components/ui/SaveButton';
import { useIdbList } from '@/hooks/useIdbList';
import { useOpportunities } from '@/hooks/useOpportunities';
import type { Submission } from '@/lib/offline/actions';
import { ApplyModal } from './ApplyModal';

export function OpportunityDetail({ id }: { id: string }) {
  const [all, , ready] = useOpportunities();
  const [open, setOpen] = useState(false);
  const { items: subs } = useIdbList<Submission>('submissions');
  const { items: drafts } = useIdbList<{ id: string }>('drafts');
  const o = all.find((x) => x.id === id);

  if (!o) {
    return (
      <div className="container-catalog py-12">
        {ready ? <EmptyState title="Opportunity not found" text="It may have been removed or is not saved on this device." action={<Button size="sm" href="/opportunities">Back to opportunities</Button>} /> : <p className="text-brand-muted">Loading…</p>}
      </div>
    );
  }
  const closed = o.status === 'Closed' || o.deadline < new Date().toISOString().slice(0, 10);
  const applied = subs.find((s) => s.type === 'application' && s.payload.opportunityId === o.id);
  const hasDraft = drafts.some((d) => d.id === `application:${o.id}`);

  return (
    <div className="container-catalog py-8">
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-red"><ArrowLeft size={14} aria-hidden />All opportunities</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{o.category}</Badge>
            {o.amount && <Badge tone="success">{o.amount}</Badge>}
            {closed && <Badge tone="danger">Closed</Badge>}
          </div>
          <h1 className="mt-3 text-[28px] leading-tight text-brand-ink">{o.title}</h1>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-brand-muted">
            <span className="inline-flex items-center gap-1.5"><Building2 size={14} aria-hidden />{o.org}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden />{o.location}{o.remote ? ' · Remote friendly' : ''}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} aria-hidden />Closes {formatDate(o.deadline)}</span>
          </p>
          <h2 className="mt-8 text-lg">About this opportunity</h2>
          <p className="mt-2 leading-relaxed text-brand-ink/90">{o.description}</p>
          <h2 className="mt-8 text-lg">What you need</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-brand-ink/90">{o.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            {applied ? (
              <>
                <Badge tone={applied.status === 'sent' ? 'success' : 'warn'}>{applied.status === 'sent' ? 'Application sent' : 'Queued to send'}</Badge>
                <p className="mt-3 text-sm text-brand-muted">{applied.status === 'sent' ? 'Track it from Saved and offline in your dashboard.' : 'We’ll send it automatically when you’re back online.'}</p>
              </>
            ) : (
              <>
                <Button className="w-full" onClick={() => setOpen(true)} disabled={closed}>{closed ? 'Applications closed' : hasDraft ? 'Continue your draft' : 'Apply now'}</Button>
                {hasDraft && !closed && <p className="mt-2 text-center text-xs text-brand-muted">You have a saved draft on this device.</p>}
              </>
            )}
            <div className="mt-3 flex justify-center">
              <SaveButton item={{ id: `opportunity:${o.id}`, kind: 'opportunity', title: o.title, subtitle: `${o.org} · closes ${formatDate(o.deadline)}`, href: `/opportunities/${o.id}`, body: `${o.description}\n\nRequirements:\n- ${o.requirements.join('\n- ')}` }} />
            </div>
          </Card>
          <Card className="p-5 text-sm text-brand-muted">
            <p className="font-medium text-brand-ink">Skills</p>
            <ul className="mt-2 flex flex-wrap gap-2">{o.tags.map((t) => <li key={t} className="rounded-full border border-brand-line px-2.5 py-0.5 text-xs">{t}</li>)}</ul>
          </Card>
        </aside>
      </div>
      <ApplyModal opp={o} open={open} onClose={() => setOpen(false)} onDone={() => {}} />
    </div>
  );
}
