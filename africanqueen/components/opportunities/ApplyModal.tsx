'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextArea, TextInput } from '@/components/ui/Fields';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSession } from '@/lib/auth/session';
import type { Opportunity } from '@/lib/mock-data/opportunities';
import { submitAction } from '@/lib/offline/actions';
import { idb } from '@/lib/offline/db';

type Form = { name: string; email: string; link: string; note: string };
type Draft = { id: string; title: string; data: Form; updatedAt: number };

export function ApplyModal({ opp, open, onClose, onDone }: { opp: Opportunity; open: boolean; onClose: () => void; onDone: () => void }) {
  const session = useSession();
  const online = useOnlineStatus();
  const toast = useToast();
  const draftId = `application:${opp.id}`;
  const [f, setF] = useState<Form>({ name: '', email: '', link: '', note: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saved, setSaved] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const loaded = useRef(false);

  // Load an existing draft (or prefill from the session) each time the form opens.
  useEffect(() => {
    if (!open) return;
    loaded.current = false;
    idb.get<Draft>('drafts', draftId).then((d) => {
      if (d) {
        setF(d.data);
        setSaved(d.updatedAt);
      } else setF({ name: session?.name ?? '', email: session?.email ?? '', link: '', note: '' });
      loaded.current = true;
    }).catch(() => (loaded.current = true));
  }, [open, draftId, session]);

  // Autosave the draft locally as the user types.
  useEffect(() => {
    if (!open || !loaded.current) return;
    if (!f.note && !f.link) return;
    const t = setTimeout(() => {
      const updatedAt = Date.now();
      idb.put('drafts', { id: draftId, title: `Application: ${opp.title}`, data: f, updatedAt }).then(() => setSaved(updatedAt)).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
  }, [f, open, draftId, opp.title]);

  function validate() {
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
    if (f.link && !/^https?:\/\/\S+\.\S+/.test(f.link)) e.link = 'Enter a full link starting with http:// or https://.';
    if (f.note.trim().length < 50) e.note = `Write at least 50 characters (${f.note.trim().length} so far).`;
    return e;
  }

  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const rec = await submitAction('application', `Application: ${opp.title}`, { opportunityId: opp.id, ...f }, online);
      await idb.remove('drafts', draftId);
      toast(rec.status === 'sent' ? 'Application sent. Good luck!' : 'You’re offline. Your application is saved and will be sent when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
      onDone();
      onClose();
    } catch {
      toast('We could not save your application. Try again.', 'info');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Apply: ${opp.title}`}>
      {!session ? (
        <>
          <p>You need a free member account to apply.</p>
          <div className="mt-5 flex gap-3">
            <Button size="sm" href={`/login?next=/opportunities/${opp.id}`}>Log in</Button>
            <Button size="sm" variant="outline" href="/join">Join free</Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <TextInput id="a-name" label="Full name" value={f.name} error={errors.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <TextInput id="a-email" label="Email" type="email" value={f.email} error={errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <TextInput id="a-link" label="Link to CV or portfolio (optional)" value={f.link} error={errors.link} placeholder="https://" onChange={(e) => setF({ ...f, link: e.target.value })} />
          <TextArea id="a-note" label="Why are you a good fit?" value={f.note} error={errors.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
          <p className="text-xs text-brand-muted" aria-live="polite">
            {saved ? `Draft saved on this device at ${new Date(saved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.` : 'Your draft saves automatically on this device.'}
          </p>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={submit} disabled={busy}>{busy ? 'Sending…' : online ? 'Submit application' : 'Save to send later'}</Button>
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
