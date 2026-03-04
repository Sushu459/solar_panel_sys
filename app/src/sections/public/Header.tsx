import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, MapPin, Home, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/projects', label: 'Projects', icon: MapPin },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/#hero', label: 'Partners', icon: Users },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      const expectedPath = path || '/';
      return location.pathname === expectedPath && location.hash === `#${hash}`;
    }
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-11 sm:h-13 rounded-2xl bg-white/90 border border-emerald-100 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow overflow-hidden">
              <img
                src="/solar_logo.jpeg"
                alt="Ever Green Solar Systems logo"
                className="w-full h-full object-contain p-0.9"
                loading="eager"
              />
            </div>
            <div>
              <span className="block sm:hidden text-sm font-extrabold text-green-600 tracking-tight drop-shadow-sm leading-tight max-w-[170px] truncate">
                Ever Green Solar Systems
              </span>
              <span className="hidden sm:block text-xl font-extrabold text-green-600 to-lime-500 group-hover:text-emerald-400 transition-colors tracking-tight drop-shadow-sm">
                Ever Green Solar Systems
              </span>
              <span className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-wider">India</span>
            </div>
          </Link>

          {/* Desktop Navigation (Glassmorphism Pill) */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-2 py-2 shadow-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-white/10 text-emerald-400 shadow-sm border border-white/5'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-full px-7 font-bold shadow-lg shadow-emerald-500/25 border-0 transition-all hover:-translate-y-0.5">
                Enquiry Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dark Glassmorphism) */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-300 origin-top ${
          isMobileMenuOpen
            ? 'opacity-100 visible scale-y-100'
            : 'opacity-0 invisible scale-y-95'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                  active
                    ? 'bg-white/10 text-emerald-400 border border-white/5 shadow-sm'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 pt-4 border-t border-white/10 block"
          >
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-xl py-6 font-bold shadow-lg shadow-emerald-500/20 border-0">
              Enquiry Us
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}