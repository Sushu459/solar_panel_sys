import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Leaf, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';

interface Partner {
  id: string;
  image_url: string;
  created_at: string;
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const partnersContainerRef = useRef<HTMLDivElement>(null);
  const partnersAnimationRef = useRef<number | null>(null);
  const partnersScrollPositionRef = useRef(0);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isPartnersPaused, setIsPartnersPaused] = useState(false);
  const [partnerRepeatCount, setPartnerRepeatCount] = useState(3);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { icon: Zap, value: '500+', label: 'Installations' },
    { icon: Leaf, value: '50MW+', label: 'Solar Capacity' },
    { icon: TrendingUp, value: '₹50Cr+', label: 'Client Savings' },
  ];

  useEffect(() => {
    const fetchPartners = async () => {
      if (!supabase) {
        setPartners([]);
        return;
      }

      try {
        const { data, error } = await (supabase.from('partners') as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPartners((data as Partner[]) || []);
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
      }
    };

    fetchPartners();
  }, []);

  const validPartners = partners.filter((partner) => Boolean(partner.image_url));
  const duplicatedPartners = Array.from({ length: partnerRepeatCount }, () => validPartners).flat();

  useEffect(() => {
    if (validPartners.length === 0) {
      setPartnerRepeatCount(3);
      return;
    }

    const updateRepeatCount = () => {
      const cardWidth = window.innerWidth < 640 ? 56 : 68;
      const gap = window.innerWidth < 640 ? 18 : 24;
      const singleSetWidth = (cardWidth + gap) * validPartners.length;
      const neededSets = Math.ceil((window.innerWidth * 2) / singleSetWidth) + 1;
      setPartnerRepeatCount(Math.max(3, neededSets));
    };

    updateRepeatCount();
    window.addEventListener('resize', updateRepeatCount);
    return () => window.removeEventListener('resize', updateRepeatCount);
  }, [validPartners.length]);

  useEffect(() => {
    if (validPartners.length === 0 || !partnersContainerRef.current) return;

    const container = partnersContainerRef.current;
    const cardWidth = window.innerWidth < 640 ? 56 : 68;
    const gap = window.innerWidth < 640 ? 18 : 24;
    const singleSetWidth = (cardWidth + gap) * validPartners.length;
    const loopSeconds = 24;
    partnersScrollPositionRef.current = singleSetWidth / 2;
    container.style.transform = `translateX(-${partnersScrollPositionRef.current}px)`;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isPartnersPaused) {
        const deltaTime = currentTime - lastTime;
        const pixelsPerMs = singleSetWidth / (loopSeconds * 1000);
        partnersScrollPositionRef.current += deltaTime * pixelsPerMs;

        if (partnersScrollPositionRef.current >= singleSetWidth) {
          partnersScrollPositionRef.current = partnersScrollPositionRef.current % singleSetWidth;
        }

        container.style.transform = `translateX(-${partnersScrollPositionRef.current}px)`;
      }

      lastTime = currentTime;
      partnersAnimationRef.current = requestAnimationFrame(animate);
    };

    partnersAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (partnersAnimationRef.current) {
        cancelAnimationFrame(partnersAnimationRef.current);
      }
    };
  }, [validPartners.length, isPartnersPaused]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[88vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white selection:bg-amber-200 font-sans"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://www.alder-energy.com/wp-content/uploads/2022/12/Solar-Energy-Industry-Trends_SolarPower_Alder-Energy-scaled.jpg"
          alt="Solar Energy Background"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: 'scaleX(-1)' }}
        />
        
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs (Warm Sun Colors) */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle, #fbbf24 0%, #f97316 40%, transparent 70%)',
            transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle, #fde047 0%, #f59e0b 50%, transparent 70%)',
            transform: 'translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))',
            transition: 'transform 0.3s ease-out',
          }}
        />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 158, 11, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 text-center mt-2 lg:mt-0">
        {/* Badge */}
        

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight tracking-tight drop-shadow-sm">
          Your Future with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 drop-shadow-none block sm:inline mt-1 sm:mt-0">
            Solar Energy
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg font-medium text-slate-200 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto mb-5 sm:mb-7 leading-relaxed px-2 sm:px-0">
          Transform your energy consumption with our cutting-edge solar installations. 
          Save money, reduce your carbon footprint, and join India&apos;s green revolution.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 px-6 sm:px-0">
          <Link to="/projects" className="w-full max-w-xs sm:max-w-none sm:w-auto">
            <Button 
              size="default" 
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 rounded-full px-6 sm:px-8 py-2.5 sm:py-5 text-sm sm:text-base font-bold group shadow-lg shadow-orange-500/25 border-0 transition-all hover:-translate-y-0.5"
            >
              Explore Projects
              <ArrowRight className="ml-2 w-3 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/calculator" className="w-full max-w-xs sm:max-w-none sm:w-auto">
            <Button 
              size="default" 
              variant="outline"
              className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 rounded-full px-6 sm:px-8 py-2.5 sm:py-5 text-sm sm:text-base font-bold shadow-sm transition-all"
            >
              Calculate Savings
            </Button>
          </Link>
        </div>

        {/* Partners Strip */}
        {validPartners.length > 0 && (
          <div className="mb-10 sm:mb-12 relative py-2 overflow-hidden"
            onMouseEnter={() => setIsPartnersPaused(true)}
            onMouseLeave={() => setIsPartnersPaused(false)}
            onTouchStart={() => setIsPartnersPaused(true)}
            onTouchEnd={() => setIsPartnersPaused(false)}
          >
            <div className="max-w-[760px] mx-auto overflow-hidden">
              <div
                ref={partnersContainerRef}
                className="flex items-center gap-[18px] sm:gap-6"
                style={{ willChange: 'transform' }}
              >
                {duplicatedPartners.map((partner, index) => (
                  <div
                    key={`${partner.id}-${index}`}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/80 backdrop-blur-md border border-amber-100 shadow-sm flex items-center justify-center p-2 overflow-hidden shrink-0"
                  >
                    <img
                      src={partner.image_url}
                      alt="Partner"
                      className="h-full w-full rounded-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider text-center">
              Trusted Partners
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 max-w-md sm:max-w-3xl mx-auto px-3 sm:px-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="w-[46%] min-w-[140px] max-w-[170px] sm:w-[31%] sm:min-w-[170px] sm:max-w-[220px] text-center p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] bg-white/90 backdrop-blur-md border border-amber-100 shadow-xl shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1">{stat.value}</div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}