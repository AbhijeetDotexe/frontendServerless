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
  X,
  Activity,
  Clock,
  Folder,
  BarChart3,
  Filter,
  MoreVertical,
  PlayCircle,
  PauseCircle,
  Sparkles
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

  // --- Data State ---
  const [functions, setFunctions] = useState<FunctionItem[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Deletion State ---
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
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
        if (filterStatus !== 'all') params.append('isActive', filterStatus === 'active' ? 'true' : 'false');

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (data.success) {
          setFunctions(data.data);
          setPagination(data.pagination);
          
          // Calculate stats
          const activeCount = data.data.filter((f: FunctionItem) => f.status === 'active').length;
          setStats({
            total: data.pagination?.totalFunctions || 0,
            active: activeCount,
            inactive: data.data.length - activeCount
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) fetchFunctions();
  }, [user, authLoading, page, filterStatus]);

  // --- Handlers ---
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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setFunctions(prev => prev.filter(f => f.uuid !== itemToDelete));
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFunctions = functions.filter(func =>
    func.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute -top-2 -right-2 text-indigo-400 animate-pulse" size={20} />
        </div>
        <p className="mt-4 text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent"></div>
      
      <Navbar />

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteModalOpen(false)}
          ></div>
          
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-red-400" size={32} />
                <div className="absolute inset-0 bg-red-500/10 blur-xl"></div>
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                Delete Function?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                This action cannot be undone. The function will be permanently deleted and all associated endpoints will stop working immediately.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-300 text-sm font-medium hover:border-slate-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-900/30 transition-all duration-300 text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Delete Forever"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/20 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
              <Zap className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                Function Dashboard
              </h1>
              <p className="text-slate-400 mt-2">Manage and monitor your serverless functions</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <StatCard
                title="Total Functions"
                value={stats.total}
                icon={<Folder size={20} />}
                color="blue"
              />
              <StatCard
                title="Active"
                value={stats.active}
                icon={<Activity size={20} />}
                color="green"
              />
              <StatCard
                title="Inactive"
                value={stats.inactive}
                icon={<PauseCircle size={20} />}
                color="amber"
              />
            </div>

            <button 
              onClick={handleNew}
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center gap-3"
            >
              <Plus size={20} />
              Create New Function
              <Sparkles className="group-hover:rotate-180 transition-transform duration-500" size={16} />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/10 to-indigo-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 p-6 bg-gradient-to-b from-slate-900/50 to-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={20} />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search functions by name..."
                className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter size={18} className="text-slate-400" />
              <div className="flex gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
                <FilterButton active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} label="All" />
                <FilterButton active={filterStatus === 'active'} onClick={() => setFilterStatus('active')} label="Active" />
                <FilterButton active={filterStatus === 'inactive'} onClick={() => setFilterStatus('inactive')} label="Inactive" />
              </div>
            </div>
          </div>
        </div>

        {/* Functions Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl"></div>
            </div>
            <p className="text-slate-400 font-medium">Loading functions...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching your serverless functions</p>
          </div>
        ) : filteredFunctions.length === 0 ? (
          <EmptyState onNew={handleNew} hasSearch={searchQuery !== ''} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mt-12 pt-8 border-t border-slate-800/50">
            <div className="flex justify-between items-center">
              <div className="text-slate-400 text-sm">
                Showing <span className="text-white font-semibold">{(page - 1) * 9 + 1}-{Math.min(page * 9, pagination.totalFunctions)}</span> of{' '}
                <span className="text-white font-semibold">{pagination.totalFunctions}</span> functions
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2 mx-4">
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
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
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

// --- Sub Components ---

function FunctionCard({ 
  func, 
  onEdit, 
  onDelete
}: { 
  func: FunctionItem, 
  onEdit: () => void, 
  onDelete: () => void
}) {
  const isActive = func.status === 'active';
  const runtime = func.runtime ? func.runtime.split(':')[0] : 'Node.js';
  
  return (
    <div className="group relative bg-gradient-to-b from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex flex-col h-full overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${
        isActive 
          ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-pulse' 
          : 'bg-gradient-to-r from-slate-600 to-slate-700'
      }`}></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="p-3 bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl border border-slate-700/50 group-hover:border-indigo-500/30 transition-colors duration-300">
          {runtime === 'node' ? (
            <div className="text-green-400">
              <Server size={22} />
            </div>
          ) : (
            <Zap className="text-indigo-400" size={22} />
          )}
        </div>
        
        <div className="flex gap-1">
          <ActionButton onClick={onEdit} icon={<Edit size={16} />} label="Edit" color="blue" />
          <ActionButton onClick={() => {}} icon={<ExternalLink size={16} />} label="Logs" color="purple" />
          <ActionButton onClick={onDelete} icon={<Trash2 size={16} />} label="Delete" color="red" />
        </div>
      </div>
      
      {/* Function Info */}
      <div className="mb-6 flex-1 relative z-10">
        <h3 className="text-xl font-bold text-white mb-3 truncate group-hover:text-indigo-200 transition-colors duration-300">
          {func.name}
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isActive
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-ping' : 'bg-slate-500'}`}></span>
            {isActive ? 'Running' : 'Stopped'}
          </span>
          
          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-800/30 rounded-lg border border-slate-700/50">
            {runtime}
          </span>
        </div>
        
        <p className="text-sm text-slate-400 line-clamp-2">
          Serverless function endpoint for {func.name.toLowerCase().replace(/\s+/g, '-')}
        </p>
      </div>
      
      {/* Footer */}
      <div className="pt-5 border-t border-slate-800/50 relative z-10">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Created {new Date(func.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Last modified {func.lastModified ? new Date(func.lastModified).toLocaleDateString() : 'Recently'}</span>
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: 'blue' | 'green' | 'amber' }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-5 transition-all duration-300 hover:border-slate-700/70 hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border`}>
          {icon}
        </div>
        <BarChart3 size={18} className="text-slate-500" />
      </div>
      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({ onClick, icon, label, color }: { onClick: () => void, icon: React.ReactNode, label: string, color: 'blue' | 'purple' | 'red' }) {
  const colorClasses = {
    blue: 'hover:text-blue-400 hover:bg-blue-500/10',
    purple: 'hover:text-purple-400 hover:bg-purple-500/10',
    red: 'hover:text-red-400 hover:bg-red-500/10'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2.5 rounded-xl text-slate-400 transition-all duration-300 ${colorClasses[color]} group relative`}
      title={label}
    >
      {icon}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-xs text-slate-300 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function EmptyState({ onNew, hasSearch }: { onNew: () => void, hasSearch: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-500/20 flex items-center justify-center">
          <Zap className="text-indigo-400/50" size={48} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-2xl"></div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">
        {hasSearch ? 'No Functions Found' : 'No Functions Yet'}
      </h3>
      <p className="text-slate-400 text-center max-w-md mb-8">
        {hasSearch 
          ? 'No functions match your search query. Try different keywords.'
          : 'Get started by creating your first serverless function. Deploy instantly with our platform.'
        }
      </p>
      
      <button 
        onClick={onNew}
        className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center gap-3"
      >
        <Plus size={20} />
        Create Your First Function
        <Sparkles className="group-hover:rotate-180 transition-transform duration-500" size={18} />
      </button>
    </div>
  );
}