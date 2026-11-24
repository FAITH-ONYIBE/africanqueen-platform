'use client';
import { CalendarDays, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { useIdbList } from '@/hooks/useIdbList';
import { useKV } from '@/hooks/useKV';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSaved } from '@/hooks/useSaved';
import { useSession } from '@/lib/auth/session';
import { announcementsSeed, type Announcement } from '@/lib/mock-data/content';
import { events } from '@/lib/mock-data/events';
import type { Submission } from '@/lib/offline/actions';

const today = () => new Date().toISOString().slice(0, 10);

export default function DashboardHome() {
  const session = useSession();
  const online = useOnlineStatus();
  const { items: saved } = useSaved();
  const { items: subs } = useIdbList<Submission>('submissions');
  const [opps] = useOpportunities();
  const [announcements] = useKV<Announcement[]>('announcements', announcementsSeed);

  const upcoming = events.filter((e) => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const picks = opps.filter((o) => o.status === 'Published' && o.deadline >= today()).sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
  const queued = subs.filter((s) => s.status === 'queued').length;
  const stats = [
    { label: 'Saved items', value: saved.length, href: '/dashboard/saved' },
    { label: 'Waiting to sync', value: queued, href: '/dashboard/saved' },
    { label: 'Mentor requests', value: subs.filter((s) => s.type === 'mentor-request').length, href: '/dashboard/mentorship' },
    { label: 'Applications', value: subs.filter((s) => s.type === 'application').length, href: '/dashboard/saved' },
  ];

  return (
    <>
      <PageHead title={`Hello, ${session?.name.split(' ')[0] ?? 'member'}`} text="Here’s what’s happening in your community today." action={<Button href="/opportunities" size="sm">Browse opportunities</Button>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}><Card className="p-5 transition-colors hover:border-brand-red"><p className="text-3xl font-bold tracking-heading text-brand-red">{s.value}</p><p className="mt-1 text-sm text-brand-muted">{s.label}</p></Card></Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><h2 className="text-lg">Up next</h2><Link href="/events" className="text-sm font-medium text-brand-red hover:underline">All events</Link></div>
          <ul className="mt-4 divide-y divide-brand-line">
            {upcoming.map((e) => (
              <li key={e.id} className="flex items-center gap-4 py-3.5">
                <CalendarDays size={18} className="flex-none text-brand-red" aria-hidden />
                <div className="min-w-0 flex-1"><p className="truncate font-medium text-brand-ink">{e.title}</p><p className="text-sm text-brand-muted">{formatDate(e.date)} · {e.time} · {e.location}</p></div>
                <Badge tone="brand">{e.type}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg">Connection</h2>
          <p className={`mt-3 flex items-center gap-2 text-sm font-medium ${online ? 'text-emerald-700' : 'text-amber-700'}`}>{online ? <Wifi size={16} aria-hidden /> : <WifiOff size={16} aria-hidden />}{online ? 'Online' : 'Offline'}</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">{online ? 'Everything you do syncs right away. Save items to keep them for later.' : `You can keep browsing saved pages. ${queued} action${queued === 1 ? '' : 's'} will send when you reconnect.`}</p>
          <Button href="/dashboard/saved" variant="outline" size="sm" className="mt-4">Saved and offline</Button>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between"><h2 className="text-lg">Closing soon</h2><Link href="/opportunities" className="text-sm font-medium text-brand-red hover:underline">All opportunities</Link></div>
          <ul className="mt-4 divide-y divide-brand-line">
            {picks.map((o) => (
              <li key={o.id} className="flex items-center gap-4 py-3.5">
                <div className="min-w-0 flex-1"><Link href={`/opportunities/${o.id}`} className="block truncate font-medium text-brand-ink hover:text-brand-red">{o.title}</Link><p className="text-sm text-brand-muted">{o.org} · closes {formatDate(o.deadline)}</p></div>
                <Badge tone="brand">{o.category}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between"><h2 className="text-lg">Announcements</h2><Link href="/dashboard/announcements" className="text-sm font-medium text-brand-red hover:underline">View all</Link></div>
          <ul className="mt-4 space-y-4">
            {announcements.slice(0, 3).map((a) => (
              <li key={a.id}><p className="text-sm font-medium text-brand-ink">{a.title}</p><p className="mt-0.5 text-xs text-brand-muted">{formatDate(a.at)}</p></li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <h2 className="text-lg">Your learning</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {[['Networking Certification', 45], ['Partner Online Courses', 20]].map(([t, p]) => (
              <div key={t as string}>
                <div className="flex justify-between text-sm"><span className="font-medium text-brand-ink">{t}</span><span className="text-brand-muted">{p}%</span></div>
                <div className="mt-2 h-2 rounded-full bg-brand-mist" role="progressbar" aria-valuenow={p as number} aria-valuemin={0} aria-valuemax={100} aria-label={`${t} progress`}><div className="h-full rounded-full bg-brand-red" style={{ width: `${p}%` }} /></div>
              </div>
            ))}
          </div>
          <Button href="/courses" variant="outline" size="sm" className="mt-5">Continue learning</Button>
        </Card>
      </div>
    </>
  );
}
