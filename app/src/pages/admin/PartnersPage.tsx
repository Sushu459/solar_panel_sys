import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Star,
  Mail,
  Settings,
  LogOut,
  Sun,
  Upload,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { uploadImage, supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminPartnersPage() {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    if (!supabase) {
      toast.error('Supabase is not configured. Please set your environment variables.');
      return;
    }

    setIsSaving(true);

    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `partners/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const imageUrl = await uploadImage(file, path);

      if (!imageUrl) {
        throw new Error('Image upload failed');
      }

      const { error } = await (supabase.from('partners') as any).insert({
        image_url: imageUrl,
      });

      if (error) {
        throw error;
      }

      toast.success('Partner image added successfully');
      setFile(null);
    } catch (error) {
      console.error('Error creating partner:', error);
      toast.error('Failed to save partner image');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50/50 to-white text-slate-800 font-sans selection:bg-lime-200">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-lime-100/50 fixed left-0 top-0 z-50 hidden lg:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
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

        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-lime-100/50 px-6 py-4 shadow-sm">
            <h1 className="text-xl font-extrabold text-slate-800">Partners</h1>
          </header>

          <div className="p-6 max-w-3xl mx-auto">
            <div className="p-8 rounded-3xl bg-white border border-lime-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Add Partner Image</h2>
              <p className="text-slate-500 font-medium mb-6">Upload an image to save its URL in your partners table.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="partner-image" className="text-slate-700 font-bold">Partner Image</Label>
                  <Input
                    id="partner-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="bg-slate-50 border-slate-200 text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:text-emerald-700 file:px-3 file:py-1.5"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 font-bold shadow-md shadow-emerald-500/20 border-0"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Save
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
