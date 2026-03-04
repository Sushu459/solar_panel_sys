import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, user, isAdmin, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect only after role is confirmed as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Invalid credentials. Please check your email and password.');
      setIsSubmitting(false);
      return;
    }

    toast.success('Login successful!');
    setIsSubmitting(false);
    navigate('/admin', { replace: true });
  };

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all shadow-sm rounded-xl py-6";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50/50 to-white flex items-center justify-center p-4 font-sans selection:bg-lime-200">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-40 blur-3xl bg-lime-300/40 mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-40 blur-3xl bg-emerald-300/40 mix-blend-multiply" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute -top-16 left-0 flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </button>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-lime-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Admin Login</h1>
            <p className="text-slate-500 text-sm font-medium">Solar Systems Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@solarsystems.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 shadow-md shadow-emerald-500/20 py-6 font-bold rounded-xl border-0 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
            <p className="text-sm text-emerald-800 text-center font-medium leading-relaxed">
              <strong className="block text-emerald-900 mb-1">Demo Credentials:</strong>
              Email: admin@solarsystems.in
              <br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}