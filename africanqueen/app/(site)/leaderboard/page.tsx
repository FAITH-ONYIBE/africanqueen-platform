import type { Metadata } from 'next';
import { LeaderboardView } from '@/components/events/LeaderboardView';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'Leaderboard' };

export default function LeaderboardPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <PageTitleCard title="Leaderboard" subtitle="Members ranked by points from learning, events and community activity." />
      <LeaderboardView />
    </div>
  );
}
