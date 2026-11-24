'use client';
import { ArrowLeft, Clock, Globe2, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Avatar, Badge, Card, EmptyState } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextArea } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { SaveButton } from '@/components/ui/SaveButton';
import { useToast } from '@/components/ui/Toast';
import { useIdbList } from '@/hooks/useIdbList';
import { useMentors } from '@/hooks/useMentors';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSession } from '@/lib/auth/session';
import { submitAction, type Submission } from '@/lib/offline/actions';

const SLOTS = ['Weekday evenings', 'Weekends', 'Flexible'];

export function MentorProfile({ id }: { id: string }) {
  const [mentors, , ready] = useMentors();
  const m = mentors.find((x) => x.id === id);
  const session = useSession();
  const online = useOnlineStatus();
  const toast = useToast();
  const { items: subs } = useIdbList<Submission>('submissions');
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [slot, setSlot] = useState('');
  const [errors, setErrors] = useState<{ goal?: string; slot?: string }>({});
  const [busy, setBusy] = useState(false);

  if (!m) {
    return <div className="container-catalog py-12">{ready ? <EmptyState title="Mentor not found" text="This profile is not available." action={<Button size="sm" href="/mentors">Back to mentors</Button>} /> : <p className="text-brand-muted">Loading…</p>}</div>;
  }
  const existing = subs.find((s) => s.type === 'mentor-request' && s.payload.mentorId === m.id);

  async function send() {
    const e: typeof errors = {};
    if (goal.trim().length < 30) e.goal = `Tell ${m!.name.split(' ')[0]} what you want help with (at least 30 characters).`;
    if (!slot) e.slot = 'Choose when you are free.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const rec = await submitAction('mentor-request', `Mentorship request: ${m!.name}`, { mentorId: m!.id, mentorName: m!.name, goal, slot }, online);
      toast(rec.status === 'sent' ? `Request sent to ${m!.name}.` : 'You’re offline. Your request is saved and will be sent when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
      setOpen(false);
      setGoal('');
      setSlot('');
    } catch {
      toast('We could not save your request. Try again.', 'info');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-catalog py-8">
      <Link href="/mentors" className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-red"><ArrowLeft size={14} aria-hidden />All mentors</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <Avatar name={m.name} size={80} />
            <div>
              <h1 className="text-[28px] leading-tight text-brand-ink">{m.name}</h1>
              <p className="mt-1 text-brand-muted">{m.title} at {m.company}</p>
              {!m.active && <div className="mt-2"><Badge tone="warn">Not accepting new mentees</Badge></div>}
            </div>
          </div>
          <h2 className="mt-8 text-lg">About</h2>
          <p className="mt-2 leading-relaxed text-brand-ink/90">{m.bio}</p>
          <h2 className="mt-8 text-lg">Can help with</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{m.skills.map((s) => <li key={s} className="rounded-full bg-brand-red/10 px-3 py-1 text-sm font-medium text-brand-red">{s}</li>)}</ul>
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            {existing ? (
              <>
                <Badge tone={existing.status === 'sent' ? 'success' : 'warn'}>{existing.status === 'sent' ? 'Request sent' : 'Request queued'}</Badge>
                <p className="mt-3 text-sm text-brand-muted">{existing.status === 'sent' ? 'You’ll be notified when the mentor replies.' : 'It will be sent automatically when you’re back online.'}</p>
              </>
            ) : (
              <Button className="w-full" disabled={!m.active} onClick={() => setOpen(true)}>Request mentorship</Button>
            )}
            <div className="mt-3 flex justify-center">
              <SaveButton item={{ id: `mentor:${m.id}`, kind: 'mentor', title: m.name, subtitle: `${m.title} · ${m.company}`, href: `/mentors/${m.id}`, body: m.bio }} />
            </div>
          </Card>
          <Card className="space-y-3 p-5 text-sm text-brand-muted">
            <p className="flex items-center gap-2.5"><GraduationCap size={16} aria-hidden />{m.school}</p>
            <p className="flex items-center gap-2.5"><Globe2 size={16} aria-hidden />{m.country} · {m.languages.join(', ')}</p>
            <p className="flex items-center gap-2.5"><Clock size={16} aria-hidden />{m.availability}</p>
            <p className="flex items-center gap-2.5"><Users size={16} aria-hidden />{m.menteesHelped} mentees supported</p>
          </Card>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Request mentorship from ${m.name}`}>
        {!session ? (
          <>
            <p>You need a free member account to send a request.</p>
            <div className="mt-5 flex gap-3"><Button size="sm" href={`/login?next=/mentors/${m.id}`}>Log in</Button><Button size="sm" variant="outline" href="/join">Join free</Button></div>
          </>
        ) : (
          <div className="space-y-4">
            <TextArea id="goal" label="What do you want help with?" value={goal} error={errors.goal} onChange={(e) => setGoal(e.target.value)} />
            <SelectInput id="slot" label="When are you usually free?" placeholder="Choose a time" options={SLOTS} value={slot} error={errors.slot} onChange={(e) => setSlot(e.target.value)} />
            <div className="flex gap-3">
              <Button size="sm" onClick={send} disabled={busy}>{busy ? 'Sending…' : online ? 'Send request' : 'Save to send later'}</Button>
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
