'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ShellItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };

export function DashboardShell({ title, items, children }: { title: string; items: ShellItem[]; children: ReactNode }) {
  const path = usePathname();
  const isActive = (i: ShellItem) => (i.exact ? path === i.href : path === i.href || path.startsWith(`${i.href}/`));
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="lg:w-60 lg:flex-none">
          <p className="mb-3 hidden px-3 text-xs font-semibold uppercase tracking-wide text-brand-muted lg:block">{title}</p>
          <nav aria-label={title} className="flex gap-1 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
            {items.map((i) => {
              const Icon = i.icon;
              const active = isActive(i);
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-none items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? 'bg-brand-red text-white' : 'bg-white text-brand-ink/80 ring-1 ring-brand-line hover:text-brand-red lg:bg-transparent lg:ring-0 lg:hover:bg-white'
                  }`}
                >
                  <Icon size={17} aria-hidden />
                  {i.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function PageHead({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl text-brand-ink">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-sm text-brand-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
