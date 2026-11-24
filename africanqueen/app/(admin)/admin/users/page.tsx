'use client';
import { useMemo, useState } from 'react';
import { PageHead } from '@/components/dashboard/DashboardShell';
import { Avatar, Badge, Card, EmptyState, formatDate } from '@/components/ui/Bits';
import { FilterSelect, SearchBox } from '@/components/ui/Fields';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { useKV } from '@/hooks/useKV';
import { usePaged } from '@/hooks/usePaged';
import { members as seed, type Member } from '@/lib/mock-data/members';

export default function UsersPage() {
  const [users, setUsers] = useKV<Member[]>('admin-users', seed);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('All roles');
  const [status, setStatus] = useState('All statuses');
  const toast = useToast();
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return users.filter((u) => (role === 'All roles' || u.role === role.toLowerCase()) && (status === 'All statuses' || u.status === status) && (!t || `${u.name} ${u.country}`.toLowerCase().includes(t)));
  }, [users, q, role, status]);
  const { page, setPage, pageCount, pageItems, total } = usePaged(list, 8);
  const patch = (id: string, p: Partial<Member>, msg: string) => { setUsers((us) => us.map((u) => (u.id === id ? { ...u, ...p } : u))); toast(msg, 'info'); };

  return (
    <>
      <PageHead title="Users" text={`${users.length} members. Changes are stored on this device for the demo.`} />
      <div className="flex flex-wrap gap-3">
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search by name or country" label="Search users" />
        <FilterSelect label="Role" value={role} onChange={(v) => { setRole(v); setPage(1); }} options={['All roles', 'Member', 'Admin']} />
        <FilterSelect label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={['All statuses', 'Active', 'Suspended']} />
      </div>
      <Card className="mt-4 overflow-hidden">
        {pageItems.length === 0 ? <div className="p-6"><EmptyState title="No users found" text="Adjust your filters." /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Users</caption>
              <thead className="border-b border-brand-line bg-brand-mist text-xs font-semibold text-brand-muted"><tr><th scope="col" className="px-5 py-3">Member</th><th scope="col" className="px-3 py-3">Joined</th><th scope="col" className="px-3 py-3">Role</th><th scope="col" className="px-3 py-3">Status</th><th scope="col" className="px-5 py-3 text-right">Action</th></tr></thead>
              <tbody>
                {pageItems.map((u) => (
                  <tr key={u.id} className="border-b border-brand-line last:border-0">
                    <td className="px-5 py-3"><span className="flex items-center gap-3"><Avatar name={u.name} size={34} /><span><span className="block font-medium">{u.name}</span><span className="block text-xs text-brand-muted">{u.country}</span></span></span></td>
                    <td className="px-3 py-3 text-brand-muted">{formatDate(u.joinedAt)}</td>
                    <td className="px-3 py-3"><select aria-label={`Role for ${u.name}`} value={u.role} onChange={(e) => patch(u.id, { role: e.target.value as Member['role'] }, `${u.name} is now ${e.target.value}.`)} className="rounded-md border border-brand-line bg-white px-2 py-1.5 text-sm"><option value="member">member</option><option value="admin">admin</option></select></td>
                    <td className="px-3 py-3"><Badge tone={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge></td>
                    <td className="px-5 py-3 text-right"><button onClick={() => patch(u.id, { status: u.status === 'Active' ? 'Suspended' : 'Active' }, `${u.name} ${u.status === 'Active' ? 'suspended' : 'reactivated'}.`)} className="text-sm font-medium text-brand-red hover:underline">{u.status === 'Active' ? 'Suspend' : 'Reactivate'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Pagination page={page} pageCount={pageCount} onChange={setPage} total={total} pageSize={8} />
    </>
  );
}
