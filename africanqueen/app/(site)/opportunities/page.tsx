import type { Metadata } from 'next';
import { OpportunitiesView } from '@/components/opportunities/OpportunitiesView';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'Opportunities' };

export default function OpportunitiesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <PageTitleCard title="Opportunities" subtitle="Jobs, internships, scholarships and grants for women in technology." />
      <OpportunitiesView />
    </div>
  );
}
