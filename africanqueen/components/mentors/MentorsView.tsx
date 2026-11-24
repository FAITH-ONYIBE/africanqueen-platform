'use client';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextInput } from '@/components/ui/Fields';
import { Pagination } from '@/components/ui/Pagination';
import { useMentors } from '@/hooks/useMentors';
import { usePaged } from '@/hooks/usePaged';
import { matchMentors, MENTOR_DOMAINS } from '@/lib/mock-data/mentors';
import { MentorCard } from './MentorCard';

export function MentorsView() {
  const [mentors] = useMentors();
  const [form, setForm] = useState({ skills: '', goal: '', domain: MENTOR_DOMAINS[0] });
  const [applied, setApplied] = useState(form);

  const results = useMemo(() => matchMentors(mentors, applied.skills, applied.goal, applied.domain), [mentors, applied]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(results, 6);
  const searching = applied.skills || applied.goal || applied.domain !== MENTOR_DOMAINS[0];

  return (
    <div className="container-catalog mt-6">
      <form
        onSubmit={(e) => { e.preventDefault(); setApplied(form); setPage(1); }}
        className="rounded-2xl border border-brand-line bg-white p-5 sm:p-6"
        aria-label="Find a mentor"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput id="skills" label="Your skills" placeholder="python, sql, react" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <TextInput id="goal" label="Career goal" placeholder="data scientist" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
          <SelectInput id="domain" label="Domain" options={MENTOR_DOMAINS} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="submit" size="sm" className="gap-2"><Search size={16} aria-hidden />Find mentors</Button>
          {searching && <Button type="button" size="sm" variant="outline" onClick={() => { const c = { skills: '', goal: '', domain: MENTOR_DOMAINS[0] }; setForm(c); setApplied(c); setPage(1); }}>Show all mentors</Button>}
        </div>
      </form>

      <h2 className="mb-4 mt-8 text-xl" aria-live="polite">{total} {total === 1 ? 'mentor' : 'mentors'} {searching ? 'found' : 'available'}</h2>
      {pageItems.length === 0 ? (
        <EmptyState title="No mentors match yet" text="Try fewer skills or a broader domain. New mentors join every month." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{pageItems.map((m) => <MentorCard key={m.id} m={m} />)}</div>
      )}
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={6} />
    </div>
  );
}
