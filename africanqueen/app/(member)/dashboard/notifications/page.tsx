'use client';
import { Bell, CalendarDays, Heart, Info, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useKV } from '@/hooks/useKV';
import { notificationsSeed, type Notification } from '@/lib/mock-data/content';

const icons = { mentor: Heart, event: CalendarDays, opportunity: Megaphone, system: Info };

export default function NotificationsPage() {
  const [items, setItems] = useKV<Notification[]>('notifications', notificationsSeed);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const unread = items.filter((n) => !n.read).length;
  const list = items.filter((n) => tab === 'all' || !n.read).sort((a, b) => b.at.localeCompare(a.at));

  return (
    <>
      <PageHead title="Notifications" text="Updates about mentors, events and deadlines." action={<Button size="sm" variant="outline" disabled={!unread} onClick={() => setItems((x) => x.map((n) => ({ ...n, read: true })))}>Mark all as read</Button>} />
      <Tabs label="Filter" value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All', count: items.length }, { value: 'unread', label: 'Unread', count: unread }]} />
      <div className="mt-5 space-y-3">
        {list.length === 0 ? <EmptyState title="You’re all caught up" text="New notifications will appear here." /> : list.map((n) => {
          const Icon = icons[n.kind] ?? Bell;
          return (
            <Card key={n.id} className={`flex items-start gap-4 p-5 ${n.read ? '' : 'border-brand-red/30'}`}>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-red/10 text-brand-red"><Icon size={18} aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="font-medium text-brand-ink">{n.title} {!n.read && <Badge tone="brand">New</Badge>}</p><p className="mt-0.5 text-sm text-brand-muted">{n.text}</p><p className="mt-1 text-xs text-brand-muted">{formatDate(n.at)}</p></div>
              {!n.read && <button onClick={() => setItems((x) => x.map((y) => (y.id === n.id ? { ...y, read: true } : y)))} className="text-sm font-medium text-brand-red hover:underline">Mark read</button>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
