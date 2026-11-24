import Link from 'next/link';
import { Avatar, Card } from '@/components/ui/Bits';
import { Button } from '@/components/ui/Button';
import type { Mentor } from '@/lib/mock-data/mentors';

export function MentorCard({ m }: { m: Mentor }) {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center gap-4">
        <Avatar name={m.name} size={56} />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-normal text-brand-ink">
            <Link href={`/mentors/${m.id}`} className="hover:text-brand-red">{m.name}</Link>
          </h2>
          <p className="truncate text-sm text-brand-muted">{m.title}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-brand-muted">{m.company} · {m.school}</p>
      <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-brand-ink/90">{m.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
        {m.skills.map((s) => <li key={s} className="rounded-full bg-brand-red/10 px-2.5 py-1 text-xs font-medium text-brand-red">{s}</li>)}
      </ul>
      <div className="mt-auto pt-5">
        <Button href={`/mentors/${m.id}`} variant="outline" size="sm" className="w-full">View profile and request</Button>
      </div>
    </Card>
  );
}
