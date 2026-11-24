'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextInput } from '@/components/ui/Fields';
import { useToast } from '@/components/ui/Toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { DEMO_ACCOUNTS, login, register } from '@/lib/auth/session';

type Mode = 'login' | 'join';
type Errors = Partial<Record<'name' | 'email' | 'password' | 'country' | 'form', string>>;
const COUNTRIES = ['Nigeria', 'Kenya', 'Ghana', 'Uganda', 'South Africa', 'Rwanda', 'Tanzania', 'Ethiopia', 'Other'];

export function AuthForm({ mode }: { mode: Mode }) {
  const online = useOnlineStatus();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const join = mode === 'join';
  const [v, setV] = useState({ name: '', email: '', password: '', country: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (join && v.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address.';
    if (v.password.length < 8) e.password = 'Use at least 8 characters.';
    if (join && !v.country) e.country = 'Choose your country.';
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length || !online) return;
    setBusy(true);
    const res = join ? await register(v) : await login(v.email, v.password);
    setBusy(false);
    if (!res.ok) return setErrors({ form: res.error });
    toast(join ? 'Welcome to africanqueen! Your account is ready.' : `Welcome back, ${res.session.name.split(' ')[0]}.`);
    const next = params.get('next');
    router.push(next && next.startsWith('/') ? next : res.session.role === 'admin' ? '/admin' : '/dashboard');
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-brand-line bg-white p-7 sm:p-8">
        <div>
          <h1 className="text-2xl">{join ? 'Join africanqueen' : 'Log in'}</h1>
          <p className="mt-1.5 text-sm text-brand-muted">{join ? 'Free to join. Open to women everywhere.' : 'Welcome back. Pick up where you left off.'}</p>
        </div>
        {errors.form && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {errors.form}
          </p>
        )}
        {join && <TextInput id="name" label="Full name" autoComplete="name" value={v.name} error={errors.name} onChange={(e) => setV({ ...v, name: e.target.value })} />}
        <TextInput id="email" label="Email" type="email" autoComplete="email" value={v.email} error={errors.email} onChange={(e) => setV({ ...v, email: e.target.value })} />
        {join && <SelectInput id="country" label="Country" placeholder="Select your country" options={COUNTRIES} value={v.country} error={errors.country} onChange={(e) => setV({ ...v, country: e.target.value })} />}
        <TextInput id="password" label="Password" type="password" autoComplete={join ? 'new-password' : 'current-password'} value={v.password} error={errors.password} hint={join ? 'At least 8 characters.' : undefined} onChange={(e) => setV({ ...v, password: e.target.value })} />
        <Button type="submit" className="w-full" disabled={!online || busy}>
          {busy ? 'Please wait…' : join ? 'Join free' : 'Log in'}
        </Button>
        {!online && <p className="text-center text-sm text-brand-muted">{join ? 'Registration' : 'Logging in'} needs an internet connection. Reconnect to continue.</p>}
        <p className="text-center text-sm text-brand-muted">
          {join ? 'Already a member? ' : 'New here? '}
          <Link href={join ? '/login' : '/join'} className="font-medium text-brand-red hover:underline">
            {join ? 'Log in' : 'Join free'}
          </Link>
        </p>
      </form>

      {!join && (
        <div className="mt-5 rounded-2xl border border-dashed border-brand-line bg-white/70 p-5">
          <p className="text-sm font-semibold text-brand-ink">Demo accounts</p>
          <p className="mt-1 text-xs text-brand-muted">This project has no backend yet. Use one of these to explore each area.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button key={a.label} type="button" onClick={() => setV({ ...v, email: a.email, password: a.password })} className="rounded-md border border-brand-line bg-white px-3 py-1.5 text-sm font-medium hover:bg-brand-mist">
                Fill {a.label.toLowerCase()} login
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
