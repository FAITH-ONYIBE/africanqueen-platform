'use client';
import { Bell, BookOpen, Bookmark, Heart, LayoutDashboard, Megaphone, MessagesSquare, Settings, Users, UserCircle } from 'lucide-react';
import { DashboardShell, type ShellItem } from '@/components/dashboard/DashboardShell';
import { RequireAuth } from '@/components/dashboard/RequireAuth';
import { FloatingDonate } from '@/components/layout/FloatingDonate';
import { Header } from '@/components/layout/Header';

const ITEMS: ShellItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'My profile', href: '/dashboard/profile', icon: UserCircle },
  { label: 'Community', href: '/dashboard/community', icon: MessagesSquare },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
  { label: 'Member directory', href: '/dashboard/directory', icon: Users },
  { label: 'Resources', href: '/dashboard/resources', icon: BookOpen },
  { label: 'Mentorship', href: '/dashboard/mentorship', icon: Heart },
  { label: 'Saved and offline', href: '/dashboard/saved', icon: Bookmark },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">
        <RequireAuth>
          <DashboardShell title="Member area" items={ITEMS}>{children}</DashboardShell>
        </RequireAuth>
      </main>
      <FloatingDonate />
    </>
  );
}
