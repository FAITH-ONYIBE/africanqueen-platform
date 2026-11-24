'use client';
import { ChevronDown, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@/components/ui/Bits';
import { logout, type Session } from '@/lib/auth/session';

export function AccountMenu({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, []);

  const item = 'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-brand-ink hover:bg-brand-mist';
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 hover:bg-brand-mist">
        <Avatar name={session.name} size={32} />
        <ChevronDown size={14} className="text-brand-muted" aria-hidden />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-brand-line bg-white p-1.5 shadow-lg">
          <div className="border-b border-brand-line px-3 pb-2.5 pt-1.5">
            <p className="truncate text-sm font-semibold text-brand-ink">{session.name}</p>
            <p className="truncate text-xs text-brand-muted">{session.email}</p>
          </div>
          <div className="pt-1.5">
            <Link role="menuitem" href="/dashboard" className={item} onClick={() => setOpen(false)}>
              <LayoutDashboard size={16} aria-hidden /> Dashboard
            </Link>
            <Link role="menuitem" href="/dashboard/profile" className={item} onClick={() => setOpen(false)}>
              <User size={16} aria-hidden /> My profile
            </Link>
            {session.role === 'admin' && (
              <Link role="menuitem" href="/admin" className={item} onClick={() => setOpen(false)}>
                <ShieldCheck size={16} aria-hidden /> Admin
              </Link>
            )}
            <button
              role="menuitem"
              className={`${item} w-full`}
              onClick={() => {
                logout();
                setOpen(false);
                router.push('/');
              }}
            >
              <LogOut size={16} aria-hidden /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
