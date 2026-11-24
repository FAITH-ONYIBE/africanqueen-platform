'use client';
import { Briefcase, Heart, LayoutDashboard, Megaphone, Users } from 'lucide-react';
import { DashboardShell, type ShellItem } from '@/components/dashboard/DashboardShell';
import { RequireAuth } from '@/components/dashboard/RequireAuth';
import { Header } from '@/components/layout/Header';

const ITEMS: ShellItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Opportunities', href: '/admin/opportunities', icon: Briefcase },
  { label: 'Content', href: '/admin/content', icon: Megaphone },
  { label: 'Mentorship', href: '/admin/mentorship', icon: Heart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">
        <RequireAuth role="admin">
          <DashboardShell title="Administration" items={ITEMS}>{children}</DashboardShell>
        </RequireAuth>
      </main>
    </>
  );
}
