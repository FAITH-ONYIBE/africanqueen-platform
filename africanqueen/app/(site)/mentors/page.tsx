import type { Metadata } from 'next';
import { MentorsView } from '@/components/mentors/MentorsView';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'Find a mentor' };

export default function MentorsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <PageTitleCard title="Find a mentor" subtitle="Tell us about your skills and goals, and we’ll match you with relevant mentors." />
      <MentorsView />
    </div>
  );
}
