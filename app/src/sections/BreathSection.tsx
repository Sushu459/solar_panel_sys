import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { breathSectionConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const BreathSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const text = textRef.current;
    const subtitle = subtitleRef.current;

    if (!section || !container || !text || !subtitle) return;

    // Initial state
    gsap.set(container, { scale: 0.92, borderRadius: '48px' });
    gsap.set(text, { opacity: 0, scale: 1.1 });
    gsap.set(subtitle, { opacity: 0, y: 20 });

    // Scale up animation on scroll
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Container scale and border radius (smoothly transitions to a slightly sharper border)
        gsap.set(container, {
          scale: 0.92 + progress * 0.08,
          borderRadius: `${48 - progress * 24}px`, // transitions from 48px to 24px
        });

        // Text reveal
        gsap.set(text, {
          opacity: progress,
          scale: 1.1 - progress * 0.1,
        });

        // Subtitle reveal
        if (progress > 0.5) {
          const subtitleProgress = (progress - 0.5) * 2;
          gsap.set(subtitle, {
            opacity: subtitleProgress,
            y: 20 - subtitleProgress * 20,
          });
        }
      },
    });

    triggerRef.current = trigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, []);

  if (!breathSectionConfig.title && !breathSectionConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-32 bg-white font-sans overflow-hidden"
    >
      <div className="px-4 md:px-8">
        <div
          ref={containerRef}
          className="relative w-full max-w-7xl mx-auto overflow-hidden shadow-2xl shadow-emerald-900/10 border border-lime-100"
          style={{ willChange: 'transform, border-radius' }}
        >
          {/* Background Image (simulating video) */}
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <img
              src={breathSectionConfig.backgroundImage}
              alt={breathSectionConfig.backgroundAlt}
              className="w-full h-full object-cover"
            />

            {/* Dark overlay for text contrast combined with a warm sunlit tint */}
            <div className="absolute inset-0 bg-slate-900/40" />
            <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/20 to-emerald-500/10 mix-blend-overlay" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2
                ref={textRef}
                className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight drop-shadow-xl"
                style={{
                  willChange: 'transform, opacity',
                }}
              >
                {breathSectionConfig.title}
              </h2>
              <p
                ref={subtitleRef}
                className="font-bold text-lime-400 text-sm md:text-base lg:text-lg uppercase tracking-[0.25em] mt-6 drop-shadow-md"
                style={{ willChange: 'transform, opacity' }}
              >
                {breathSectionConfig.subtitle}
              </p>
            </div>

            {/* Subtle gradient edges to blend shadows internally */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Decorative Text Elements */}
      {breathSectionConfig.description && (
        <div className="max-w-3xl mx-auto px-6 md:px-8 mt-16 md:mt-24 text-center">
          <p className="text-lg md:text-xl font-medium text-slate-500 leading-relaxed">
            {breathSectionConfig.description}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full mx-auto mt-8 opacity-50" />
        </div>
      )}
    </section>
  );
};

export default BreathSection;