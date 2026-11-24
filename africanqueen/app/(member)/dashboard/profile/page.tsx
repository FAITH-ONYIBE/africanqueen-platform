'use client';
import { useEffect, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Card } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { updateSession, useSession } from '@/lib/auth/session';

type Profile = { name: string; headline: string; bio: string; country: string; skills: string; link: string };
const COUNTRIES = ['Nigeria', 'Kenya', 'Ghana', 'Uganda', 'South Africa', 'Rwanda', 'Tanzania', 'Ethiopia', 'Other'];

export default function ProfilePage() {
  const session = useSession();
  const toast = useToast();
  const [stored, setStored, ready] = useKV<Profile | null>('profile', null);
  const [p, setP] = useState<Profile>({ name: '', headline: '', bio: '', country: '', skills: '', link: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>({});

  useEffect(() => {
    if (!ready || !session) return;
    setP(stored ?? { name: session.name, headline: '', bio: '', country: session.country, skills: '', link: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const fields = [p.name, p.headline, p.bio, p.country, p.skills, p.link];
  const completeness = Math.round((fields.filter((f) => f.trim()).length / fields.length) * 100);

  function save(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (p.name.trim().length < 2) er.name = 'Enter your name.';
    if (p.bio.length > 400) er.bio = 'Keep your bio under 400 characters.';
    if (p.link && !/^https?:\/\/\S+\.\S+/.test(p.link)) er.link = 'Enter a full link starting with http:// or https://.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setStored(p);
    updateSession({ name: p.name.trim(), country: p.country || session?.country || '' });
    toast('Profile saved on this device.');
  }

  return (
    <>
      <PageHead title="My profile" text="A complete profile helps mentors and employers understand your goals." />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit p-6 text-center">
          <div className="flex justify-center"><Avatar name={p.name || 'Member'} size={80} /></div>
          <p className="mt-4 font-semibold text-brand-ink">{p.name || 'Your name'}</p>
          <p className="text-sm text-brand-muted">{p.headline || 'Add a headline'}</p>
          <div className="mt-5 text-left">
            <div className="flex justify-between text-xs text-brand-muted"><span>Profile completeness</span><span>{completeness}%</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-brand-mist" role="progressbar" aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness"><div className="h-full rounded-full bg-brand-red" style={{ width: `${completeness}%` }} /></div>
          </div>
        </Card>
        <Card className="p-6">
          <form onSubmit={save} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput id="p-name" label="Full name" value={p.name} error={errors.name} onChange={(e) => setP({ ...p, name: e.target.value })} />
              <TextInput id="p-head" label="Headline" placeholder="e.g. Data analyst" value={p.headline} onChange={(e) => setP({ ...p, headline: e.target.value })} />
            </div>
            <TextArea id="p-bio" label="Short bio" value={p.bio} error={errors.bio} hint={`${p.bio.length}/400`} onChange={(e) => setP({ ...p, bio: e.target.value })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectInput id="p-country" label="Country" placeholder="Select country" options={COUNTRIES} value={p.country} onChange={(e) => setP({ ...p, country: e.target.value })} />
              <TextInput id="p-skills" label="Skills" placeholder="python, sql, figma" hint="Separate with commas. Used for mentor matching." value={p.skills} onChange={(e) => setP({ ...p, skills: e.target.value })} />
            </div>
            <TextInput id="p-link" label="Portfolio or LinkedIn (optional)" placeholder="https://" value={p.link} error={errors.link} onChange={(e) => setP({ ...p, link: e.target.value })} />
            <Button type="submit" size="sm">Save profile</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
