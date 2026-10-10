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
  FileCode2,
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions/${itemToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFunctions((prev) => prev.filter((f) => f.uuid !== itemToDelete));
        setDeleteModalOpen(false);
        setItemToDelete(null);
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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <Loader2 className="animate-spin text-[#3b5bdb]" size={20} />
          <p className="font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalOpen(false)}
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5f5] dark:bg-[#341717] text-[#e03131]">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--foreground)]">Delete Function?</h3>
                <p className="text-xs text-[var(--muted)]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-6 text-[var(--muted)]">
              The function will be permanently removed from OpenWhisk and all associated endpoints will stop working immediately.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#e03131] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c92a2a] transition-colors"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={15} /> : 'Delete Function'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
                Functions Dashboard
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Manage and monitor your serverless deployments</p>
            </div>

            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 rounded-lg bg-[#3b5bdb] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3451c7]"
            >
              <Plus size={16} />
              Create Function
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard title="Total Functions" value={stats.total} icon={<Folder size={18} className="text-[#3b5bdb]" />} />
            <StatCard title="Active" value={stats.active} icon={<Activity size={18} className="text-[#2f9e44]" />} />
            <StatCard title="Inactive" value={stats.inactive} icon={<PauseCircle size={18} className="text-[var(--muted)]" />} />
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search functions by name..."
              className="w-full rounded-lg border border-transparent bg-[var(--surface-2)] py-2 pr-4 pl-9 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:border-[#3b5bdb] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <FilterButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} label="All" />
            <FilterButton active={filterStatus === 'active'} onClick={() => setFilterStatus('active')} label="Active" />
            <FilterButton active={filterStatus === 'inactive'} onClick={() => setFilterStatus('inactive')} label="Inactive" />
          </div>
        </div>

        {/* Function Cards */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)]">
            <Loader2 className="animate-spin text-[#3b5bdb]" size={24} />
            <p className="mt-3 text-sm font-medium">Loading functions…</p>
          </div>
        ) : filteredFunctions.length === 0 ? (
          <EmptyState onNew={handleNew} hasSearch={searchQuery !== ''} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
            <div>
              Showing <span className="font-semibold text-[var(--foreground)]">{(page - 1) * 9 + 1}–{Math.min(page * 9, pagination.totalFunctions)}</span> of{' '}
              <span className="font-semibold text-[var(--foreground)]">{pagination.totalFunctions}</span> functions
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="px-2 font-medium text-[var(--foreground)]">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
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
  const runtime = func.runtime || 'nodejs:18';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--border-2)] hover:shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--muted)]">
              <FileCode2 size={16} />
            </div>
            <div>
              <span className="font-mono text-[11px] text-[var(--muted)]">{runtime}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] transition-colors"
              title="Edit code"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={onDelete}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[#fff5f5] dark:hover:bg-[#341717] hover:text-[#e03131] transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <h3 className="text-base font-semibold tracking-[-0.01em] text-[var(--foreground)] line-clamp-1 mb-2" title={func.name}>
          {func.name}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ${
            isActive
              ? 'bg-[#ebfbee] dark:bg-[#132b1b] text-[#2f9e44] dark:text-[#40c057]'
              : 'bg-[var(--surface-2)] text-[var(--muted)]'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#2f9e44]' : 'bg-[var(--muted-2)]'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="font-mono text-[11px] text-[var(--muted-2)] truncate max-w-[120px]">{func.uuid}</span>
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-3 text-[11px] text-[var(--muted-2)] flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {new Date(func.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={onEdit}
          className="font-medium text-[#3b5bdb] dark:text-[#748ffc] hover:underline"
        >
          Open Editor →
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[var(--muted)]">{title}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-2)]">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'bg-[#3b5bdb] text-white shadow-xs'
          : 'bg-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState({ onNew, hasSearch }: { onNew: () => void; hasSearch: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--muted)]">
        <Zap size={22} />
      </div>

      <h3 className="mb-1 text-base font-semibold text-[var(--foreground)]">
        {hasSearch ? 'No functions found' : 'No functions yet'}
      </h3>
      <p className="mb-6 max-w-sm text-xs leading-5 text-[var(--muted)]">
        {hasSearch
          ? 'No functions match your search query. Try another search.'
          : 'Create your first serverless function to write code, test executions, and deploy.'}
      </p>

      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-lg bg-[#3b5bdb] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#3451c7]"
      >
        <Plus size={15} />
        Create Function
      </button>
    </div>
  );
}
