'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { useHydrated, useSession, type Role } from '@/lib/auth/session';

export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const hydrated = useHydrated();
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (hydrated && !session) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [hydrated, session, router, path]);

  if (!hydrated || !session) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-brand-muted">Checking your session…</div>;
  }
  if (role && session.role !== role) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="text-2xl">Access restricted</h1>
        <p className="mt-3 text-brand-muted">This area is for administrators only.</p>
        <Button href="/dashboard" className="mt-6" size="sm">Back to your dashboard</Button>
      </div>
    );
  }
  return <>{children}</>;
}
