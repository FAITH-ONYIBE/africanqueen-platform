'use client';
import { Award, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, Card, EmptyState } from '@/components/ui/Bits';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Pagination } from '@/components/ui/Pagination';
import { Tabs } from '@/components/ui/Tabs';
import { usePaged } from '@/hooks/usePaged';
import { useSession } from '@/lib/auth/session';
import { MEMBER_COUNTRIES, members } from '@/lib/mock-data/members';

type Period = 'month' | 'year' | 'all';
const medal = ['text-amber-500', 'text-slate-400', 'text-orange-600'];

export function LeaderboardView() {
  const [period, setPeriod] = useState<Period>('month');
  const [q, setQ] = useState('');
  const [country, setCountry] = useState(MEMBER_COUNTRIES[0]);
  const session = useSession();

  const ranked = useMemo(
    () => members.filter((m) => m.status === 'Active').sort((a, b) => b.points[period] - a.points[period]).map((m, i) => ({ ...m, rank: i + 1 })),
    [period]
  );
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ranked.filter((m) => (country === MEMBER_COUNTRIES[0] || m.country === country) && (!t || m.name.toLowerCase().includes(t)));
  }, [ranked, q, country]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(filtered, 8);
  const top3 = ranked.slice(0, 3);

  return (
    <div className="container-catalog mt-6">
      <Tabs
        label="Leaderboard period"
        value={period}
        onChange={(v) => { setPeriod(v); setPage(1); }}
        tabs={[{ value: 'month', label: 'This month' }, { value: 'year', label: 'This year' }, { value: 'all', label: 'All time' }]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {top3.map((m, i) => (
          <Card key={m.id} className="flex items-center gap-4 p-5">
            <Trophy className={medal[i]} size={28} aria-label={`Rank ${i + 1}`} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-brand-ink">{m.name}</p>
              <p className="text-sm text-brand-muted">{m.country}</p>
              <p className="mt-1 text-xl font-bold text-brand-red">{m.points[period].toLocaleString()} <span className="text-xs font-medium text-brand-muted">pts</span></p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="Search members" label="Search members" />
        <FilterSelect label="Country" value={country} onChange={setCountry} options={MEMBER_COUNTRIES} />
      </div>

      <Card className="mt-4 overflow-hidden">
        {pageItems.length === 0 ? (
          <div className="p-6"><EmptyState title="No members found" text="Try a different name or country." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Member leaderboard</caption>
              <thead className="border-b border-brand-line bg-brand-mist text-xs font-semibold text-brand-muted">
                <tr>
                  <th scope="col" className="w-16 px-5 py-3">Rank</th>
                  <th scope="col" className="px-3 py-3">Member</th>
                  <th scope="col" className="px-3 py-3">Country</th>
                  <th scope="col" className="px-3 py-3">Badges</th>
                  <th scope="col" className="px-5 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((m) => (
                  <tr key={m.id} className="border-b border-brand-line last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-brand-ink">{m.rank}</td>
                    <td className="px-3 py-3.5">
                      <span className="flex items-center gap-3"><Avatar name={m.name} size={36} /><span><span className="block font-medium text-brand-ink">{m.name}</span><span className="block text-xs text-brand-muted">{m.headline}</span></span></span>
                    </td>
                    <td className="px-3 py-3.5 text-brand-muted">{m.country}</td>
                    <td className="px-3 py-3.5"><span className="inline-flex items-center gap-1.5 text-brand-muted"><Award size={14} aria-hidden />{m.badges}</span></td>
                    <td className="px-5 py-3.5 text-right font-semibold text-brand-ink">{m.points[period].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={8} />
      <p className="mt-6 text-sm text-brand-muted">
        {session ? 'Earn points by completing courses, attending events and helping others in the community.' : 'Join free to appear on the leaderboard and earn points for learning and community activity.'}
      </p>
    </div>
  );
}
