import { Bookmark } from 'lucide-react';
import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'success' | 'warn' | 'danger' }) {
  const tones = {
    neutral: 'bg-brand-mist text-brand-muted ring-brand-line',
    brand: 'bg-brand-red/10 text-brand-red ring-brand-red/20',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warn: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-red-50 text-red-700 ring-red-200',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return (
    <span aria-hidden style={{ width: size, height: size, fontSize: size * 0.36 }} className="inline-flex flex-none items-center justify-center rounded-full bg-brand-red/10 font-semibold text-brand-red">
      {initials}
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-line bg-white px-6 py-12 text-center">
      <p className="font-semibold text-brand-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-brand-muted">{text}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function SaveIcon({ saved }: { saved: boolean }) {
  return <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden />;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-brand-line bg-white ${className}`}>{children}</div>;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', opts);
}
