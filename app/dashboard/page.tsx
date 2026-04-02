'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Plus,
  Search,
  Server,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Edit,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Activity,
  Clock,
  Folder,
  BarChart3,
  Filter,
  PauseCircle,
  Sparkles,
} from 'lucide-react';

interface FunctionItem {
  _id: string;
  uuid: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  runtime?: string;
  lastModified?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  totalFunctions: number;
  totalPages: number;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchFunctions = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams({ page: page.toString(), limit: '9' });
        if (filterStatus !== 'all') {
          params.append('isActive', filterStatus === 'active' ? 'true' : 'false');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setFunctions(data.data);
          setPagination(data.pagination);

          const activeCount = data.data.filter((f: FunctionItem) => f.status === 'active').length;
          setStats({
            total: data.pagination?.totalFunctions || 0,
            active: activeCount,
            inactive: data.data.length - activeCount,
          });
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) fetchFunctions();
  }, [user, authLoading, page, filterStatus]);

  const handleEdit = (uuid: string) => router.push(`/editor?id=${uuid}`);
  const handleNew = () => router.push('/editor');

  const requestDelete = (uuid: string) => {
    setItemToDelete(uuid);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_UR}L/api/functions/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFunctions((prev) => prev.filter((f) => f.uuid !== itemToDelete));
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        console.error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFunctions = functions.filter((func) =>
    func.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f2] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-[#e4d7be] border-t-[#d4a11e] animate-spin" />
            <Sparkles className="absolute -top-2 -right-2 animate-pulse text-[#d4a11e]" size={20} />
          </div>
          <p className="mt-4 font-medium text-[#65594b]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f5f2] text-[#171717]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,_rgba(255,90,31,0.08),_transparent_24%),radial-gradient(circle_at_88%_16%,_rgba(79,89,217,0.10),_transparent_28%)]" />

      <Navbar />

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[rgba(246,240,227,0.72)] backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalOpen(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#e7e7e0] bg-white shadow-[0_24px_60px_rgba(20,20,20,0.08)]">
            <div className="p-8 text-center">
              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#efcf95] bg-[#fff1c7]">
                <AlertTriangle className="text-[#b77908]" size={32} />
                <div className="absolute inset-0 bg-[#f4d36b]/20 blur-xl" />
              </div>

              <h3 className="mb-3 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.025em] bg-gradient-to-r from-[#241d16] to-[#7a6d5f] bg-clip-text text-transparent">
                Delete Function?
              </h3>
              <p className="mb-8 text-sm leading-7 text-[#65594b]">
                This action cannot be undone. The function will be permanently deleted and all associated endpoints will stop working immediately.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-xl border border-[#dbc9ab] bg-white/80 py-3.5 text-sm font-medium text-[#4d4235] transition-all duration-300 hover:border-[#d4a11e] hover:bg-[#fff6df]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4f59d9] py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-all duration-300 hover:bg-[#444fd0]"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={16} /> : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-[#ffd7c7] bg-[#fff1ea] p-2.5 shadow-[0_12px_24px_rgba(255,90,31,0.10)]">
              <Zap className="text-[#221c15]" size={24} />
            </div>
            <div>
              <h1 className="font-[family:var(--font-display)] text-4xl font-semibold tracking-[-0.03em] text-[#221c15]">
                Function Dashboard
              </h1>
              <p className="mt-2 font-medium text-[#65594b]">Manage and monitor your serverless functions</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start gap-6 lg:flex-row lg:items-center">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard title="Total Functions" value={stats.total} icon={<Folder size={20} />} color="gold" />
              <StatCard title="Active" value={stats.active} icon={<Activity size={20} />} color="green" />
              <StatCard title="Inactive" value={stats.inactive} icon={<PauseCircle size={20} />} color="amber" />
            </div>

            <button
              onClick={handleNew}
              className="group flex items-center gap-3 rounded-full bg-[#4f59d9] px-6 py-3.5 font-semibold text-white shadow-[0_18px_40px_rgba(79,89,217,0.18)] transition-all duration-300 hover:bg-[#444fd0]"
            >
              <Plus size={20} />
              Create New Function
              <Sparkles className="transition-transform duration-500 group-hover:rotate-180" size={16} />
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-[1.75rem] border border-[#e7e7e0] bg-white p-6 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative flex-1">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#8b7d6e]">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search functions by name..."
                className="w-full rounded-xl border border-[#dbc9ab] bg-[#fffdfa] py-3.5 pr-4 pl-12 text-[#221c15] placeholder:text-[#8b7d6e] transition-all duration-300 focus:border-[#d4a11e] focus:outline-none focus:ring-2 focus:ring-[#f3cd62]/40"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter size={18} className="text-[#65594b]" />
              <div className="flex gap-2 rounded-xl border border-[#e5d8be] bg-[#fffdfa] p-1.5">
                <FilterButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} label="All" />
                <FilterButton active={filterStatus === 'active'} onClick={() => setFilterStatus('active')} label="Active" />
                <FilterButton active={filterStatus === 'inactive'} onClick={() => setFilterStatus('inactive')} label="Inactive" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="h-14 w-14 rounded-full border-4 border-[#e4d7be] border-t-[#d4a11e] animate-spin" />
              <div className="absolute inset-0 bg-[#f4d36b]/20 blur-xl" />
            </div>
            <p className="font-medium tracking-[0.01em] text-[#65594b]">Loading functions...</p>
            <p className="mt-2 text-sm text-[#8b7d6e]">Fetching your serverless functions</p>
          </div>
        ) : filteredFunctions.length === 0 ? (
          <EmptyState onNew={handleNew} hasSearch={searchQuery !== ''} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFunctions.map((func) => (
              <FunctionCard
                key={func.uuid}
                func={func}
                onEdit={() => handleEdit(func.uuid)}
                onDelete={() => requestDelete(func.uuid)}
              />
            ))}
          </div>
        )}

        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 border-t border-[#e4d7be] pt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-[#65594b]">
                Showing <span className="font-semibold text-[#221c15]">{(page - 1) * 9 + 1}-{Math.min(page * 9, pagination.totalFunctions)}</span> of{' '}
                <span className="font-semibold text-[#221c15]">{pagination.totalFunctions}</span> functions
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-[#dbc9ab] bg-white/80 p-3 text-[#65594b] transition-all duration-300 hover:border-[#d4a11e] hover:bg-[#fff6df] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="mx-4 flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`h-10 w-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-[#4f59d9] text-white shadow-[0_12px_28px_rgba(79,89,217,0.16)]'
                            : 'text-[#65594b] hover:bg-[#fff6df] hover:text-[#221c15]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="rounded-xl border border-[#dbc9ab] bg-white/80 p-3 text-[#65594b] transition-all duration-300 hover:border-[#d4a11e] hover:bg-[#fff6df] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FunctionCard({
  func,
  onEdit,
  onDelete,
}: {
  func: FunctionItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isActive = func.status === 'active';
  const runtime = func.runtime ? func.runtime.split(':')[0] : 'Node.js';

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#e7e7e0] bg-white p-5 shadow-[0_18px_40px_rgba(20,20,20,0.05)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#d9d9d3] hover:shadow-[0_24px_50px_rgba(20,20,20,0.08)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,211,107,0.24),_transparent_42%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className={`absolute left-0 top-0 h-1.5 w-full ${isActive ? 'bg-gradient-to-r from-[#2f7a5a] via-[#5ea681] to-[#2f7a5a]' : 'bg-gradient-to-r from-[#cdbfa8] to-[#e6d9c1]'}`} />

      <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] border border-[#ffd7c7] bg-[#fff1ea] transition-colors duration-300 group-hover:border-[#ffb89a]">
          {runtime === 'node' ? (
            <div className="text-[#2f7a5a]">
              <Server size={24} />
            </div>
          ) : (
            <Zap className="text-[#9f7b26]" size={24} />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#eadfcb] bg-[#fffaf0]/90 p-1 shadow-[0_10px_24px_rgba(110,84,29,0.05)]">
          <ActionButton onClick={onEdit} icon={<Edit size={16} />} label="Edit" color="gold" />
          <ActionButton onClick={() => {}} icon={<ExternalLink size={16} />} label="Logs" color="warm" />
          <ActionButton onClick={onDelete} icon={<Trash2 size={16} />} label="Delete" color="danger" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <h3 className="mb-3 line-clamp-2 min-h-[3.5rem] pr-3 font-[family:var(--font-display)] text-[1.7rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#241d16] transition-colors duration-300 group-hover:text-[#9a7017]">
          {func.name}
        </h3>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${isActive ? 'border-[#bfd5c4] bg-[#edf7f1] text-[#2f7a5a]' : 'border-[#e5d8be] bg-[#f7f0df] text-[#8b7d6e]'}`}>
            <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-[#2f7a5a]' : 'bg-[#bba98f]'}`} />
            {isActive ? 'Running' : 'Stopped'}
          </span>

          <span className="rounded-full border border-[#e5d8be] bg-[#f7f0df] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-[#8b7d6e]">
            {runtime}
          </span>
        </div>

        <div className="rounded-[1.35rem] border border-[#eadfcb] bg-[#fffaf2]/92 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9a7017]">Endpoint</p>
          <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-[#5d5143]">
            Serverless function endpoint for {func.name.toLowerCase().replace(/\s+/g, '-')}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 border-t border-[#eadfcb] pt-4">
        <div className="flex flex-col gap-3 text-xs text-[#8b7d6e] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Created {new Date(func.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>Last modified {func.lastModified ? new Date(func.lastModified).toLocaleDateString() : 'Recently'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'gold' | 'green' | 'amber';
}) {
  const colorClasses = {
    gold: 'from-[#f7e7ad] to-[#fff4cf] border-[#ead498] text-[#a07110]',
    green: 'from-[#e3f4ea] to-[#edf7f1] border-[#bfd5c4] text-[#2f7a5a]',
    amber: 'from-[#fff1c7] to-[#fff6df] border-[#efcf95] text-[#b77908]',
  };

  return (
    <div className="rounded-[1.5rem] border border-[#e7e7e0] bg-white p-5 shadow-[0_12px_28px_rgba(20,20,20,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-[#d9d9d3]">
      <div className="mb-4 flex items-center justify-between">
        <div className={`rounded-xl border bg-gradient-to-br p-3 ${colorClasses[color]}`}>{icon}</div>
        <BarChart3 size={18} className="text-[#8b7d6e]" />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium text-[#65594b]">{title}</p>
        <p className="font-[family:var(--font-display)] text-3xl font-semibold tracking-[-0.02em] text-[#241d16]">{value}</p>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-[#4f59d9] text-white shadow-[0_12px_28px_rgba(79,89,217,0.16)]'
          : 'text-[#65594b] hover:bg-[#fff6df] hover:text-[#221c15]'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: 'gold' | 'warm' | 'danger';
}) {
  const colorClasses = {
    gold: 'hover:text-[#9a7017] hover:bg-[#fff4cf]',
    warm: 'hover:text-[#7f6118] hover:bg-[#fff4cf]',
    danger: 'hover:text-[#b85c38] hover:bg-[#fff1e8]',
  };

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-full border border-transparent p-2.5 text-[#65594b] transition-all duration-300 ${colorClasses[color]}`}
      title={label}
    >
      {icon}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#4f59d9] px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

function EmptyState({ onNew, hasSearch }: { onNew: () => void; hasSearch: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center px-4 py-20">
      <div className="relative mb-8">
        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#ead498] bg-[#fff4cf]">
          <Zap className="text-[#d4a11e]/60" size={48} />
        </div>
        <div className="absolute inset-0 bg-[#f4d36b]/20 blur-2xl" />
      </div>

      <h3 className="mb-3 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.025em] text-[#241d16]">
        {hasSearch ? 'No Functions Found' : 'No Functions Yet'}
      </h3>
      <p className="mb-8 max-w-md text-center leading-7 text-[#65594b]">
        {hasSearch
          ? 'No functions match your search query. Try different keywords.'
          : 'Get started by creating your first serverless function. Deploy instantly with our platform.'}
      </p>

      <button
        onClick={onNew}
        className="group flex items-center gap-3 rounded-full bg-[#4f59d9] px-8 py-4 font-semibold text-white shadow-[0_18px_40px_rgba(79,89,217,0.18)] transition-all duration-300 hover:bg-[#444fd0]"
      >
        <Plus size={20} />
        Create Your First Function
        <Sparkles className="transition-transform duration-500 group-hover:rotate-180" size={18} />
      </button>
    </div>
  );
}
