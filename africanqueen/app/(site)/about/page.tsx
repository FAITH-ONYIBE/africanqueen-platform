import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { StatsBand } from '@/components/home/StatsBand';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'About' };

const values = [
  ['Access first', 'Everything is free to join and built to work on slow or unreliable connections.'],
  ['Practical learning', 'Certificates, projects and mentors tied to real jobs and funding.'],
  ['Community', 'Women helping women: members mentor, review CVs and share opportunities.'],
  ['Transparency', 'We publish what we do and how donations are used.'],
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="bg-brand-mist pb-10"><PageTitleCard title="About africanqueen" subtitle="An online community helping African women build careers in technology." /></div>
      <section className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h2 className="text-[28px] leading-tight text-brand-navy">Our mission</h2>
          <p className="mt-5 leading-relaxed text-brand-ink/90">We connect African women with the training, mentorship and opportunities they need to lead in technology. Too many talented women never get the introduction, the certificate or the first role that opens the door. We exist to change that.</p>
          <ul className="mt-6 space-y-3">
            {['Free certifications and skills training', 'Mentors who have done it before', 'Grants, scholarships and jobs shared every week'].map((t) => (
              <li key={t} className="flex items-start gap-3"><span className="mt-1 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-brand-red text-white"><Check size={11} strokeWidth={3.5} aria-hidden /></span>{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3"><Button href="/join">Join the community</Button><Button href="/contact" variant="outline-red">Contact us</Button></div>
        </div>
        <Photo alt="Members at a community event" hint="Replace with /public/images/about.jpg" tone="warm" className="aspect-[4/3] w-full rounded-3xl" />
      </section>
      <StatsBand />
      <section className="container-page py-14 md:py-20">
        <h2 className="text-center text-[28px] text-brand-navy">What we stand for</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {values.map(([t, d]) => (
            <div key={t} className="rounded-3xl border border-brand-line p-7"><h3 className="text-xl text-brand-navy">{t}</h3><p className="mt-3 text-[15px] leading-relaxed text-brand-ink/90">{d}</p></div>
          ))}
        </div>
      </section>
    </div>
  );
}
