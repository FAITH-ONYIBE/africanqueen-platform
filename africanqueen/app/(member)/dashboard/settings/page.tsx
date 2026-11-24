'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Card } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { TextInput } from '@/components/ui/Fields';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { logout, useSession } from '@/lib/auth/session';
import { idb } from '@/lib/offline/db';

type Prefs = { news: boolean; reminders: boolean; mentor: boolean };
const PREF_LABELS: [keyof Prefs, string, string][] = [
  ['news', 'Programme news', 'Announcements and new opportunities.'],
  ['reminders', 'Event reminders', 'A reminder the day before events you registered for.'],
  ['mentor', 'Mentorship updates', 'When a mentor replies to your request.'],
];

export default function SettingsPage() {
  const session = useSession();
  const online = useOnlineStatus();
  const toast = useToast();
  const router = useRouter();
  const [prefs, setPrefs] = useKV<Prefs>('prefs', { news: true, reminders: true, mentor: true });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof pw, string>>>({});
  const [confirmClear, setConfirmClear] = useState(false);

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    const er: typeof errors = {};
    if (!pw.current) er.current = 'Enter your current password.';
    if (pw.next.length < 8) er.next = 'Use at least 8 characters.';
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match.';
    setErrors(er);
    if (Object.keys(er).length) return;
    if (!online) return toast('Changing your password needs an internet connection.', 'info');
    setPw({ current: '', next: '', confirm: '' });
    toast('Password change validated. It will be saved once a backend is connected.', 'info');
  }

  return (
    <>
      <PageHead title="Account settings" />
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg">Account</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-brand-muted">Name</dt><dd className="mt-0.5 font-medium text-brand-ink">{session?.name}</dd></div>
            <div><dt className="text-brand-muted">Email</dt><dd className="mt-0.5 font-medium text-brand-ink">{session?.email}</dd></div>
            <div><dt className="text-brand-muted">Country</dt><dd className="mt-0.5 font-medium text-brand-ink">{session?.country}</dd></div>
            <div><dt className="text-brand-muted">Member since</dt><dd className="mt-0.5 font-medium text-brand-ink">{session?.joinedAt}</dd></div>
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg">Change password</h2>
          <form onSubmit={changePassword} noValidate className="mt-4 grid max-w-md gap-4">
            <TextInput id="pw-cur" label="Current password" type="password" autoComplete="current-password" value={pw.current} error={errors.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
            <TextInput id="pw-new" label="New password" type="password" autoComplete="new-password" value={pw.next} error={errors.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            <TextInput id="pw-con" label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} error={errors.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
            <div><Button type="submit" size="sm" disabled={!online}>Update password</Button>{!online && <p className="mt-2 text-xs text-brand-muted">Needs an internet connection.</p>}</div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg">Notifications</h2>
          <ul className="mt-4 divide-y divide-brand-line">
            {PREF_LABELS.map(([k, t, d]) => (
              <li key={k} className="flex items-center justify-between gap-4 py-3.5">
                <div><p className="text-sm font-medium text-brand-ink">{t}</p><p className="text-xs text-brand-muted">{d}</p></div>
                <button role="switch" aria-checked={prefs[k]} aria-label={t} onClick={() => setPrefs((p) => ({ ...p, [k]: !p[k] }))} className={`relative h-6 w-11 flex-none rounded-full transition-colors ${prefs[k] ? 'bg-brand-red' : 'bg-brand-line'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${prefs[k] ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg">This device</h2>
          <p className="mt-2 text-sm text-brand-muted">Saved items, drafts and queued actions are stored here. Clearing removes them permanently.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="sm" variant="outline" onClick={() => setConfirmClear(true)}>Clear offline data</Button>
            <Button size="sm" variant="outline" onClick={() => { logout(); router.push('/'); }}>Log out</Button>
          </div>
        </Card>
      </div>
      <ConfirmModal open={confirmClear} danger title="Clear offline data?" text="This removes saved items, drafts, queued actions and local preferences from this device. Your account is not affected." confirmLabel="Clear data" onClose={() => setConfirmClear(false)} onConfirm={async () => { await idb.clearAll(); toast('Offline data cleared.', 'info'); }} />
    </>
  );
}
