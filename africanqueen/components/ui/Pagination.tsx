'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, pageCount, onChange, total, pageSize }: { page: number; pageCount: number; onChange: (p: number) => void; total: number; pageSize: number }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = 'flex h-9 min-w-9 items-center justify-center rounded-md border border-brand-line bg-white px-2 text-sm hover:bg-brand-mist disabled:cursor-not-allowed disabled:opacity-40';
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Pagination" className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-brand-muted">
        Showing {from}-{to} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <button className={btn} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-brand-muted">…</span>}
            <button
              className={`${btn} ${p === page ? '!border-brand-red !bg-brand-red !text-white' : ''}`}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          </span>
        ))}
        <button className={btn} disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
