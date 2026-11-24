import type { Metadata } from 'next';
import { OpportunityDetail } from '@/components/opportunities/OpportunityDetail';
import { opportunitiesSeed } from '@/lib/mock-data/opportunities';

export function generateStaticParams() {
  return opportunitiesSeed.map((o) => ({ id: o.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const o = opportunitiesSeed.find((x) => x.id === params.id);
  return { title: o ? o.title : 'Opportunity' };
}

export default function OpportunityPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <OpportunityDetail id={params.id} />
    </div>
  );
}
