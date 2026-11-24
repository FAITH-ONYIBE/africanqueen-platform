'use client';
type Tab<T extends string> = { value: T; label: string; count?: number };

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: Tab<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-white p-1 ring-1 ring-brand-line">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={`flex-none whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active ? 'bg-brand-red text-white' : 'text-brand-ink/80 hover:bg-brand-mist'
            }`}
          >
            {t.label}
            {t.count !== undefined && <span className={`ml-2 text-xs ${active ? 'text-white/80' : 'text-brand-muted'}`}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
