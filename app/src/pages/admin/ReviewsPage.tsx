import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Star, 
  CheckCircle, 
  Trash2, 
  MessageSquare,
  Search,
  Loader2,
  LayoutDashboard,
  FolderOpen,
  Mail,
  Users,
  Settings,
  LogOut,
  Sun
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

// Sidebar Configuration
const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Star Rating Display
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-lime-400 text-lime-400'
              : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { reviews, fetchReviews, approveReview, deleteReview } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchReviews(true);
  }, [fetchReviews]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.project?.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'pending'
        ? !review.is_approved
        : review.is_approved;

    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const result = await approveReview(id, responseText || undefined);
    if (result) {
      toast.success('Review approved successfully');
      setRespondingTo(null);
      setResponseText('');
    } else {
      toast.error('Failed to approve review');
    }
    setIsProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setIsProcessing(id);
    const success = await deleteReview(id);
    if (success) {
      toast.success('Review deleted successfully');
    } else {
      toast.error('Failed to delete review');
    }
    setIsProcessing(null);
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.filter((r) => r.is_approved).length;

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
              <h1 className="text-xl font-extrabold text-slate-800">Reviews Management</h1>
              <div className="flex items-center gap-3">
                {pendingCount > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-lime-100 text-lime-700 border border-lime-200 text-xs font-bold shadow-sm">
                    {pendingCount} Pending
                  </span>
                )}
                {approvedCount > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-sm">
                    {approvedCount} Approved
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
                  placeholder="Search reviews by name, comment, or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 bg-white border-lime-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-2xl font-medium w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center bg-white p-2 rounded-2xl border border-lime-100 shadow-sm">
                {(['all', 'pending', 'approved'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      filter === f
                        ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-transparent text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
                    review.is_approved
                      ? 'bg-white border-lime-100 shadow-sm hover:shadow-md'
                      : 'bg-gradient-to-br from-lime-50 to-emerald-50/30 border-lime-200 shadow-md shadow-lime-500/5 relative overflow-hidden'
                  }`}
                >
                  {/* Status Indicator Stripe for Pending */}
                  {!review.is_approved && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-lime-400" />
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Avatar & Info */}
                    <div className="flex items-start gap-4 lg:w-1/4 shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-xl shadow-sm">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800">{review.reviewer_name}</h3>
                        <div className="mt-1.5 mb-1">
                          <StarRating rating={review.rating} />
                        </div>
                        {review.project && (
                          <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {review.project.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 lg:px-4">
                      <p className="text-slate-700 font-medium text-lg leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <p className="text-sm font-semibold text-slate-400 mt-3">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>

                      {/* Admin Response Display */}
                      {review.admin_response && (
                        <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 relative">
                          <div className="absolute -top-2.5 left-6 w-5 h-5 bg-slate-50 border-t border-l border-slate-100 transform rotate-45" />
                          <p className="text-xs text-emerald-600 font-extrabold mb-1.5 uppercase tracking-wider relative z-10">
                            Your Response
                          </p>
                          <p className="text-slate-600 font-medium relative z-10">{review.admin_response}</p>
                        </div>
                      )}

                      {/* Response Form */}
                      {respondingTo === review.id && !review.is_approved && (
                        <div className="mt-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          <Textarea
                            placeholder="Write a public response to this review..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={3}
                            className="bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 resize-none mb-3 shadow-sm rounded-xl"
                          />
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(review.id)}
                              disabled={isProcessing === review.id}
                              className="bg-emerald-500 text-white hover:bg-emerald-500 shadow-sm font-bold flex-1 md:flex-none"
                            >
                              {isProcessing === review.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve & Post Response
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponseText('');
                              }}
                              className="bg-white border-slate-200 text-slate-600 hover:bg-white font-bold"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 shrink-0 lg:w-36 mt-4 lg:mt-0">
                      {!review.is_approved && respondingTo !== review.id && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(review.id)}
                            disabled={isProcessing === review.id}
                            className="bg-emerald-500 text-white hover:bg-emerald-500 shadow-sm font-bold flex-1"
                          >
                            {isProcessing === review.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1.5" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRespondingTo(review.id)}
                            className="bg-white border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-white font-bold flex-1"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            Respond
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(review.id)}
                        disabled={isProcessing === review.id}
                        className="bg-white border-red-100 text-red-500 hover:bg-white hover:border-red-100 font-bold flex-1 lg:mt-auto"
                      >
                        {isProcessing === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1.5 lg:mr-0" />
                            <span className="lg:hidden">Delete</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border border-lime-100 border-dashed mt-8">
                <div className="w-20 h-20 bg-lime-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-lime-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">No reviews found</h3>
                <p className="text-slate-500 font-medium">
                  {filter === 'pending'
                    ? 'No pending reviews to approve!'
                    : filter === 'approved'
                    ? 'No approved reviews yet.'
                    : 'No reviews match your current filters.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}