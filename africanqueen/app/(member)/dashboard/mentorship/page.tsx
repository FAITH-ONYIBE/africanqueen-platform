'use client';
import Link from 'next/link';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { useIdbList } from '@/hooks/useIdbList';
import { useKV } from '@/hooks/useKV';
import { useMentors } from '@/hooks/useMentors';
import type { Submission } from '@/lib/offline/actions';

export default function MentorshipPage() {
  const { items: subs } = useIdbList<Submission>('submissions');
  const [mentors] = useMentors();
  const [profile] = useKV<{ skills: string } | null>('profile', null);
  const requests = subs.filter((s) => s.type === 'mentor-request').sort((a, b) => b.createdAt - a.createdAt);
  const skills = (profile?.skills ?? '').toLowerCase();
  const suggested = mentors.filter((m) => m.active && (!skills || m.skills.some((s) => skills.includes(s.toLowerCase())))).slice(0, 3);

  return (
    <>
      <PageHead title="Mentorship" text="Track your requests and find new mentors." action={<Button href="/mentors" size="sm">Find a mentor</Button>} />
      <h2 className="text-lg">Your requests</h2>
      <div className="mt-3 space-y-3">
        {requests.length === 0 ? <EmptyState title="No requests yet" text="Find a mentor whose experience matches your goals and send a short request." action={<Button href="/mentors" size="sm">Find a mentor</Button>} /> : requests.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div><p className="font-medium text-brand-ink">{String(r.payload.mentorName ?? r.title)}</p><p className="mt-0.5 line-clamp-1 text-sm text-brand-muted">{String(r.payload.goal ?? '')}</p><p className="mt-1 text-xs text-brand-muted">{formatDate(new Date(r.createdAt).toISOString().slice(0, 10))}</p></div>
            <Badge tone={r.status === 'sent' ? 'success' : 'warn'}>{r.status === 'sent' ? 'Sent, awaiting reply' : 'Queued, will send when online'}</Badge>
          </Card>
        ))}
      </div>
      <h2 className="mt-10 text-lg">Suggested for you</h2>
      <p className="mt-1 text-sm text-brand-muted">{skills ? 'Based on the skills in your profile.' : 'Add skills to your profile for better matches.'}</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {suggested.map((m) => (
          <Card key={m.id} className="p-5"><Avatar name={m.name} size={44} /><p className="mt-3 font-semibold"><Link href={`/mentors/${m.id}`} className="hover:text-brand-red">{m.name}</Link></p><p className="text-sm text-brand-muted">{m.title}</p></Card>
        ))}
      </div>
    </>
  );
}
