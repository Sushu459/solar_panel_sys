import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Mail, 
  Settings, 
  LogOut,
  Sun,
  TrendingUp,
  Users,
  Star,
  Zap,
  Lightbulb
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  href 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  href: string;
}) {
  return (
    <Link to={href} className="block group">
      <div className="p-6 rounded-2xl bg-white border border-lime-100 shadow-sm hover:border-lime-300 hover:shadow-xl hover:shadow-lime-500/10 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-emerald-500" />
          </div>
          {trend && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-extrabold text-slate-800 mb-1">{value}</div>
        {subtitle && <p className="text-slate-400 text-sm font-medium">{subtitle}</p>}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { stats, fetchStats } = useData();
  const location = useLocation();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

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
              onClick={handleSignOut}
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
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-lime-100/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold text-slate-800">Dashboard Overview</h1>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-500 hidden sm:inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-lime-100 shadow-sm">
                  <Sun className="w-4 h-4 text-emerald-400" />
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 max-w-7xl mx-auto space-y-8">

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Projects"
                value={stats?.totalProjects || 0}
                subtitle={`${stats?.totalCapacity ? (stats.totalCapacity / 1000).toFixed(1) : 0} MW total capacity`}
                icon={FolderOpen}
                href="/admin/projects"
              />
              <StatCard
                title="Pending Inquiries"
                value={stats?.pendingInquiries || 0}
                subtitle={`${stats?.totalInquiries || 0} total inquiries`}
                icon={Mail}
                href="/admin/inquiries"
              />
              <StatCard
                title="Pending Reviews"
                value={stats?.pendingReviews || 0}
                subtitle={`${stats?.approvedReviews || 0} approved reviews`}
                icon={Star}
                href="/admin/reviews"
              />
            </div>

            {/* Quick Actions & Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* System Status - Takes up 2 columns */}
              <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-lime-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">System Status</h3>
                  <div className="flex gap-2">
                    <Link to="/admin/projects">
                      <Button className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 font-bold shadow-md shadow-emerald-500/20 border-0">
                        <FolderOpen className="w-4 h-4 mr-2" />
                        New Project
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-bold">Database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-600 font-bold">Connected</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-bold">Auth System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-600 font-bold">Active</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-slate-600 font-bold">Website</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-emerald-600 font-bold">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-lime-100/50 to-emerald-100/50 border border-lime-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Admin Tips</h3>
                  </div>
                  <ul className="space-y-4 text-slate-600 font-medium">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Regularly check and respond to customer inquiries to maintain good relations.
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Approve genuine reviews to build public trust in your solar solutions.
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      Update your calculator settings as local market rates and incentives change.
                    </li>
                  </ul>
                </div>
                {/* Background decorative circles */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}