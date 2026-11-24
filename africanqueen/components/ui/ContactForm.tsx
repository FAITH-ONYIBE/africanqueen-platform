'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectInput, TextArea, TextInput } from '@/components/ui/Fields';
import { useToast } from '@/components/ui/Toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { submitAction } from '@/lib/offline/actions';

const TOPICS = ['General question', 'Mentorship', 'Courses and certificates', 'Partnerships', 'Donations'];

export function ContactForm() {
  const online = useOnlineStatus();
  const toast = useToast();
  const [f, setF] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof f, string>>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
    if (!f.topic) e.topic = 'Choose a topic.';
    if (f.message.trim().length < 20) e.message = 'Write at least 20 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const rec = await submitAction('contact-message', `Message: ${f.topic}`, f, online);
      toast(rec.status === 'sent' ? 'Message sent. We reply within two working days.' : 'You’re offline. Your message is saved and will be sent when you reconnect.', rec.status === 'sent' ? 'success' : 'info');
      setF({ name: '', email: '', topic: '', message: '' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border border-brand-line bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="c-name" label="Your name" value={f.name} error={errors.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <TextInput id="c-email" label="Email" type="email" value={f.email} error={errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </div>
      <SelectInput id="c-topic" label="Topic" placeholder="Choose a topic" options={TOPICS} value={f.topic} error={errors.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} />
      <TextArea id="c-message" label="Message" rows={6} value={f.message} error={errors.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={busy}>{busy ? 'Sending…' : online ? 'Send message' : 'Save to send later'}</Button>
        {!online && <p className="text-sm text-brand-muted">Offline: we’ll send it when you reconnect.</p>}
      </div>
    </form>
  );
}
