import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Search,
  Phone,
  MessageSquare,
  Loader2,
  LayoutDashboard,
  FolderOpen,
  Star,
  Users,
  Settings,
  LogOut,
  Sun,
  X
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';
import type { Inquiry } from '../../types';

const statusColors = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-lime-50 text-lime-700 border-lime-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-50 text-slate-700 border-slate-200',
};

const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  archived: 'Archived',
};

// Sidebar Configuration
const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminInquiriesPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { inquiries, fetchInquiries, updateInquiry } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === 'all' ? true : inquiry.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    setIsProcessing(true);
    const result = await updateInquiry(id, { status: newStatus });
    if (result) {
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } else {
      toast.error('Failed to update status');
    }
    setIsProcessing(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;

    setIsProcessing(true);
    const result = await updateInquiry(selectedInquiry.id, { notes });
    if (result) {
      toast.success('Notes saved successfully');
      setSelectedInquiry({ ...selectedInquiry, notes });
    } else {
      toast.error('Failed to save notes');
    }
    setIsProcessing(false);
  };

  const openInquiryDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
  };

  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50/50 to-white text-slate-800 font-sans selection:bg-lime-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-lime-100/50 fixed left-0 top-0 z-50 hidden lg:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          {/* Logo */}
          <div className="p-6 border-b border-lime-100/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg tracking-tight">Solar Systems</span>
                <span className="block text-xs font-bold text-emerald-500 uppercase tracking-wider">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-100 to-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-lime-100/50 bg-white/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase">
                {user?.email?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                <p className="text-xs font-medium text-slate-500">{isAdmin ? 'Administrator' : 'User'}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-lime-100 z-50 pb-safe shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.1)]">
          <nav className="flex justify-around p-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-lime-100/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <h1 className="text-xl font-extrabold text-slate-800">Inquiries</h1>
              <div className="flex items-center gap-3">
                {newCount > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold shadow-sm">
                    {newCount} New
                  </span>
                )}
                {inProgressCount > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-lime-50 text-lime-700 border border-lime-200 text-xs font-bold shadow-sm">
                    {inProgressCount} In Progress
                  </span>
                )}
              </div>
            </div>
          </header>

          <div className="p-6 max-w-6xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search inquiries by name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 bg-white border-lime-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-2xl font-medium w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center bg-white p-2 rounded-2xl border border-lime-100 shadow-sm">
                {(['all', 'new', 'in_progress', 'resolved', 'archived'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      filter === f
                        ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-transparent text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {f === 'all' ? 'All' : statusLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => openInquiryDetails(inquiry)}
                  className="p-5 rounded-3xl bg-white border border-lime-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Icon & Info */}
                    <div className="flex items-center gap-4 lg:w-1/3 shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-slate-800 truncate">{inquiry.name}</h3>
                        <div className="flex flex-col text-sm text-slate-500 mt-1 space-y-0.5">
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{inquiry.email}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            {inquiry.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-600 text-sm line-clamp-2 font-medium">
                        &ldquo;{inquiry.message}&rdquo;
                      </p>
                      {inquiry.project && (
                        <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Re: {inquiry.project.title}
                        </p>
                      )}
                    </div>

                    {/* Status & Date */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 lg:w-32">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${statusColors[inquiry.status]}`}>
                        {statusLabels[inquiry.status]}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredInquiries.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-lime-100 border-dashed mt-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">No inquiries found</h3>
                <p className="text-slate-500 font-medium">
                  {filter === 'new'
                    ? 'You are all caught up on new inquiries!'
                    : filter === 'in_progress'
                    ? 'No inquiries currently in progress.'
                    : 'No inquiries match your current filters.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-lime-100 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-lime-100/50 bg-white/90 backdrop-blur-md">
              <h2 className="text-xl font-extrabold text-slate-800">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Contact Info */}
              <div className="flex items-start gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-2xl shadow-sm shrink-0">
                  {selectedInquiry.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">{selectedInquiry.name}</h3>
                  <div className="space-y-2 mt-3">
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-slate-400" />
                      {selectedInquiry.email}
                    </a>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-slate-400" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  Client Message
                </h4>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-slate-600 whitespace-pre-wrap font-medium leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Project Reference */}
              {selectedInquiry.project && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <h4 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Interested in Project
                  </h4>
                  <p className="text-emerald-600 font-medium">{selectedInquiry.project.title}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Update Status</h4>
                <div className="flex gap-3 flex-wrap bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  {(['new', 'in_progress', 'resolved', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedInquiry.id, status)}
                      disabled={isProcessing || selectedInquiry.status === status}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 text-center border ${
                        selectedInquiry.status === status
                          ? `${statusColors[status]} shadow-sm`
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Internal Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add private notes about this inquiry..."
                  rows={4}
                  className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none mb-3 shadow-sm rounded-2xl p-4"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={isProcessing}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold px-6 shadow-md shadow-emerald-500/20 border-0"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Notes
                </Button>
              </div>

              {/* Date Footer */}
              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 text-center">
                  Inquiry received on{' '}
                  {new Date(selectedInquiry.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}