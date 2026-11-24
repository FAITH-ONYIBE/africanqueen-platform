import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/nav';
import { Logo } from './Logo';

const columns = [
  { title: 'Explore', links: NAV_ITEMS.map((n) => ({ label: n.label, href: n.href })) },
  { title: 'Programmes', links: [{ label: 'Opportunities', href: '/opportunities' }, { label: 'Find a mentor', href: '/mentors' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Account', links: [{ label: 'Log in', href: '/login' }, { label: 'Join free', href: '/join' }, { label: 'Dashboard', href: '/dashboard' }] },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-line bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-muted">Free tech training, mentorship, grants and jobs for African women.</p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold tracking-normal text-brand-navy">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-brand-muted hover:text-brand-red">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-brand-line">
        <p className="container-page py-5 text-xs text-brand-muted">© {new Date().getFullYear()} africanqueen. Academic project.</p>
      </div>
    </footer>
  );
}
