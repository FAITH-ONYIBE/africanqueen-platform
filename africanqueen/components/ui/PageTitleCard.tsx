import type { ReactNode } from 'react';

export function PageTitleCard({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="border-x border-b border-brand-line bg-white sm:rounded-b-3xl">
      <div className="container-catalog flex flex-wrap items-center justify-between gap-4 py-7 sm:py-8">
        <div>
          <h1 className="text-[26px] font-semibold text-brand-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-brand-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
