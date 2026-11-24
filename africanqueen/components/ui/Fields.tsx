'use client';
import { Search } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const control =
  'w-full rounded-lg border border-brand-line bg-white px-3 text-[15px] text-brand-ink outline-none transition-colors placeholder:text-brand-muted/80 focus:border-brand-red disabled:bg-brand-mist';

type FieldProps = { label: string; error?: string; hint?: string; children: ReactNode; htmlFor: string };
export function Field({ label, error, hint, children, htmlFor }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-brand-ink">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-err`} role="alert" className="mt-1 text-sm text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

type TIn = InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string; hint?: string };
export function TextInput({ label, id, error, hint, className = '', ...rest }: TIn) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${control} h-11 ${className}`} {...rest} />
    </Field>
  );
}

type TArea = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string; error?: string; hint?: string };
export function TextArea({ label, id, error, hint, className = '', ...rest }: TArea) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <textarea id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${control} py-2.5 ${className}`} rows={4} {...rest} />
    </Field>
  );
}

type TSel = SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; options: string[]; error?: string; placeholder?: string };
export function SelectInput({ label, id, options, error, placeholder, className = '', ...rest }: TSel) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <select id={id} aria-invalid={!!error} className={`${control} h-11 ${className}`} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Compact search box used above lists. */
export function SearchBox({ value, onChange, placeholder, label = 'Search' }: { value: string; onChange: (v: string) => void; placeholder: string; label?: string }) {
  return (
    <label className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-brand-line bg-white px-3 focus-within:border-brand-red">
      <Search size={16} className="text-brand-muted" aria-hidden />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} className="w-full bg-transparent text-[15px] outline-none placeholder:text-brand-muted/80" />
    </label>
  );
}

/** Compact filter dropdown used above lists. */
export function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="h-11 rounded-lg border border-brand-line bg-white px-3 text-[15px] outline-none focus:border-brand-red">
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
