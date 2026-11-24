'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { useMentors } from '@/hooks/useMentors';
import { adminRequestsSeed, type MentorRequestAdmin } from '@/lib/mock-data/content';
import { MENTOR_DOMAINS, type Mentor } from '@/lib/mock-data/mentors';

const tone = { Pending: 'warn', Accepted: 'success', Declined: 'danger' } as const;
type Form = { name: string; title: string; company: string; domain: string; skills: string; bio: string };
const empty: Form = { name: '', title: '', company: '', domain: '', skills: '', bio: '' };

export default function AdminMentorship() {
  const [tab, setTab] = useState<'requests' | 'mentors'>('requests');
  const [reqs, setReqs] = useKV<MentorRequestAdmin[]>('admin-requests', adminRequestsSeed);
  const [mentors, setMentors] = useMentors();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const pending = reqs.filter((r) => r.status === 'Pending').length;

  const decide = (id: string, status: 'Accepted' | 'Declined') => { setReqs((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r))); toast(`Request ${status.toLowerCase()}.`, 'info'); };

  function addMentor() {
    const e: typeof errors = {};
    if (form.name.trim().length < 3) e.name = 'Enter a name.';
    if (!form.title.trim()) e.title = 'Enter a job title.';
    if (!form.company.trim()) e.company = 'Enter a company.';
    if (!form.domain) e.domain = 'Choose a domain.';
    if (form.bio.trim().length < 20) e.bio = 'Write at least 20 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const m: Mentor = { id: `m-${Date.now()}`, name: form.name.trim(), title: form.title.trim(), company: form.company.trim(), school: 'Not provided', country: 'Nigeria', domain: form.domain, bio: form.bio.trim(), skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean), languages: ['English'], availability: 'To be confirmed', menteesHelped: 0, active: true };
    setMentors((ms) => [m, ...ms]);
    setOpen(false); setForm(empty);
    toast('Mentor added.');
  }

  return (
    <>
      <PageHead title="Mentorship" text="Review requests and manage the mentor roster." action={tab === 'mentors' ? <Button size="sm" className="gap-2" onClick={() => { setForm(empty); setErrors({}); setOpen(true); }}><Plus size={16} aria-hidden />Add mentor</Button> : undefined} />
      <Tabs label="Mentorship" value={tab} onChange={setTab} tabs={[{ value: 'requests', label: 'Requests', count: pending }, { value: 'mentors', label: 'Mentors', count: mentors.length }]} />
      <div className="mt-5 space-y-3">
        {tab === 'requests' && (reqs.length === 0 ? <EmptyState title="No requests" text="New mentorship requests appear here." /> : reqs.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div><p className="font-medium">{r.mentee} <span className="font-normal text-brand-muted">→ {r.mentor}</span></p><p className="mt-0.5 text-sm text-brand-muted">{r.goal}</p><p className="mt-1 text-xs text-brand-muted">{formatDate(r.at)}</p></div>
            <div className="flex items-center gap-3"><Badge tone={tone[r.status]}>{r.status}</Badge>{r.status === 'Pending' && <><Button size="md" variant="outline" onClick={() => decide(r.id, 'Accepted')}>Accept</Button><Button size="md" variant="outline" onClick={() => decide(r.id, 'Declined')}>Decline</Button></>}</div>
          </Card>
        )))}
        {tab === 'mentors' && mentors.map((m) => (
          <Card key={m.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4"><Avatar name={m.name} size={44} /><div><p className="font-medium">{m.name}</p><p className="text-sm text-brand-muted">{m.title} · {m.company}</p></div></div>
            <div className="flex items-center gap-3"><Badge tone={m.active ? 'success' : 'neutral'}>{m.active ? 'Accepting mentees' : 'Paused'}</Badge><Button size="md" variant="outline" onClick={() => { setMentors((ms) => ms.map((x) => (x.id === m.id ? { ...x, active: !x.active } : x))); toast(`${m.name} ${m.active ? 'paused' : 'activated'}.`, 'info'); }}>{m.active ? 'Pause' : 'Activate'}</Button></div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add mentor">
        <div className="space-y-4">
          <TextInput id="mn-name" label="Full name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2"><TextInput id="mn-title" label="Job title" value={form.title} error={errors.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><TextInput id="mn-co" label="Company" value={form.company} error={errors.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
          <SelectInput id="mn-dom" label="Domain" placeholder="Choose" options={MENTOR_DOMAINS.slice(1)} value={form.domain} error={errors.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          <TextInput id="mn-skills" label="Skills" hint="Comma separated" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <TextArea id="mn-bio" label="Bio" value={form.bio} error={errors.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="flex gap-3"><Button size="sm" onClick={addMentor}>Add mentor</Button><Button size="sm" variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div>
        </div>
      </Modal>
    </>
  );
}
