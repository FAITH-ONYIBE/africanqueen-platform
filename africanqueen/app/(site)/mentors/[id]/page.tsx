import type { Metadata } from 'next';
import { MentorProfile } from '@/components/mentors/MentorProfile';
import { mentorsSeed } from '@/lib/mock-data/mentors';

export function generateStaticParams() {
  return mentorsSeed.map((m) => ({ id: m.id }));
}
export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const m = mentorsSeed.find((x) => x.id === params.id);
  return { title: m ? m.name : 'Mentor' };
}
export default function MentorPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <MentorProfile id={params.id} />
    </div>
  );
}
