import type { Metadata } from 'next';
import { EventsView } from '@/components/events/EventsView';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'Events' };

export default function EventsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <PageTitleCard title="Events" subtitle="Webinars, workshops, meetups and Data Mondays across Africa and online." />
      <EventsView />
    </div>
  );
}
