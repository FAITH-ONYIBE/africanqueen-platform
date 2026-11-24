import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthForm } from '@/components/ui/AuthForm';

export const metadata: Metadata = { title: 'Log in' };

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-mist px-5 py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
