'use client';
import { Pin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Badge, Card, formatDate } from '@/components/ui/Bits';
import { FilterSelect } from '@/components/ui/Fields';
import { useKV } from '@/hooks/useKV';
import { announcementsSeed, type Announcement } from '@/lib/mock-data/content';

const CATS = ['All categories', 'Programme', 'Event', 'Opportunity', 'Community'];

export default function AnnouncementsPage() {
  const [items] = useKV<Announcement[]>('announcements', announcementsSeed);
  const [read, setRead] = useKV<string[]>('announcements-read', []);
  const [cat, setCat] = useState(CATS[0]);
  const list = useMemo(() => items.filter((a) => cat === CATS[0] || a.category === cat).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.localeCompare(a.at)), [items, cat]);

  return (
    <>
      <PageHead title="Announcements" text="News from the programme team." action={<FilterSelect label="Category" value={cat} onChange={setCat} options={CATS} />} />
      <div className="space-y-4">
        {list.map((a) => {
          const isRead = read.includes(a.id);
          return (
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                {a.pinned && <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-red"><Pin size={12} aria-hidden />Pinned</span>}
                <Badge tone="brand">{a.category}</Badge>
                {!isRead && <Badge tone="warn">New</Badge>}
                <span className="text-xs text-brand-muted">{formatDate(a.at)}</span>
              </div>
              <h2 className="mt-2 text-lg font-semibold tracking-normal">{a.title}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-brand-ink/90">{a.body}</p>
              {!isRead && <button onClick={() => setRead((r) => [...r, a.id])} className="mt-3 text-sm font-medium text-brand-red hover:underline">Mark as read</button>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
