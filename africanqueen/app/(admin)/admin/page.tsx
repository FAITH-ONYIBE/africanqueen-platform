'use client';
import Link from 'next/link';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, formatDate } from '@/components/ui/Bits';
import { useKV } from '@/hooks/useKV';
import { useMentors } from '@/hooks/useMentors';
import { useOpportunities } from '@/hooks/useOpportunities';
import { adminRequestsSeed, type MentorRequestAdmin } from '@/lib/mock-data/content';
import { members } from '@/lib/mock-data/members';

const signups = [['Jun', 38], ['Jul', 52], ['Aug', 47], ['Sep', 66], ['Oct', 81], ['Nov', 74]] as const;

export default function AdminHome() {
  const [opps] = useOpportunities();
  const [mentors] = useMentors();
  const [reqs] = useKV<MentorRequestAdmin[]>('admin-requests', adminRequestsSeed);
  const max = Math.max(...signups.map((s) => s[1]));
  const stats = [
    { label: 'Members', value: members.length, href: '/admin/users' },
    { label: 'Published opportunities', value: opps.filter((o) => o.status === 'Published').length, href: '/admin/opportunities' },
    { label: 'Active mentors', value: mentors.filter((m) => m.active).length, href: '/admin/mentorship' },
    { label: 'Pending requests', value: reqs.filter((r) => r.status === 'Pending').length, href: '/admin/mentorship' },
  ];
  const recent = [...members].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 5);

  return (
    <>
      <PageHead title="Administration" text="An overview of members, content and mentorship activity." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => <Link key={s.label} href={s.href}><Card className="p-5 transition-colors hover:border-brand-red"><p className="text-3xl font-bold tracking-heading text-brand-red">{s.value}</p><p className="mt-1 text-sm text-brand-muted">{s.label}</p></Card></Link>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg">New members per month</h2>
          <div className="mt-6 flex h-44 items-end gap-3" role="img" aria-label={`Bar chart of new members per month: ${signups.map((s) => `${s[0]} ${s[1]}`).join(', ')}`}>
            {signups.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs text-brand-muted">{v}</span><div className="w-full rounded-t-md bg-brand-red" style={{ height: `${(v / max) * 100}%` }} /><span className="text-xs text-brand-muted">{m}</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg">Recent members</h2>
          <ul className="mt-4 divide-y divide-brand-line">
            {recent.map((m) => <li key={m.id} className="flex items-center gap-3 py-3"><Avatar name={m.name} size={36} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{m.name}</p><p className="text-xs text-brand-muted">{m.country} · joined {formatDate(m.joinedAt)}</p></div><Badge tone={m.status === 'Active' ? 'success' : 'danger'}>{m.status}</Badge></li>)}
          </ul>
        </Card>
      </div>
    </>
  );
}
