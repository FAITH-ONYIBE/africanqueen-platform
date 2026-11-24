import type { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/ui/ContactForm';
import { PageTitleCard } from '@/components/ui/PageTitleCard';

export const metadata: Metadata = { title: 'Contact' };

const faqs = [
  ['Is it really free to join?', 'Yes. Membership, courses and community access are free.'],
  ['Can I use the site with a poor connection?', 'Yes. Pages you have visited stay available offline, and messages or requests you send offline are delivered when you reconnect.'],
  ['How do I get a mentor?', 'Create a profile, open Find a mentor and send a request. Mentors reply within a week.'],
];

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist pb-24">
      <PageTitleCard title="Contact us" subtitle="Questions about membership, mentorship or partnerships? Send us a message." />
      <div className="container-catalog mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-brand-line bg-white p-6 text-sm text-brand-muted">
            <p className="flex items-center gap-3"><Mail size={16} aria-hidden />hello@africanqueen.example</p>
            <p className="flex items-center gap-3"><MapPin size={16} aria-hidden />Aba, Abia State, Nigeria</p>
            <p className="flex items-center gap-3"><Clock size={16} aria-hidden />Replies within two working days</p>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h2 className="text-lg">Common questions</h2>
            <div className="mt-3 divide-y divide-brand-line">
              {faqs.map(([q, a]) => (
                <details key={q} className="py-3"><summary className="cursor-pointer list-none text-[15px] font-medium text-brand-ink marker:hidden">{q}</summary><p className="mt-2 text-sm leading-relaxed text-brand-muted">{a}</p></details>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
