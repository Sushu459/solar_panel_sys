import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { narrativeTextConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

// 4-Point Star SVG Component
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
  </svg>
);

const NarrativeText = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    const star = starRef.current;

    if (!section || !line1 || !line2 || !line3 || !star) return;

    // Set initial states
    gsap.set([line1, line2, line3], { opacity: 0, y: 30 });
    gsap.set(star, { opacity: 0, scale: 0.5 });

    const triggers: ScrollTrigger[] = [];

    // Star animation
    const starTrigger = ScrollTrigger.create({
      trigger: star,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(star, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      },
    });
    triggers.push(starTrigger);

    // Line animations with stagger
    const lines = [line1, line2, line3];
    lines.forEach((line, index) => {
      const trigger = ScrollTrigger.create({
        trigger: line,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(line, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out',
          });
        },
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  if (!narrativeTextConfig.line1 && !narrativeTextConfig.line2 && !narrativeTextConfig.line3) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-48 lg:py-56 bg-white font-sans overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center">
        {/* Spinning Star */}
        <div
          ref={starRef}
          className="flex justify-center mb-16"
          style={{ willChange: 'transform, opacity' }}
        >
          <StarIcon className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-spin-slow" />
        </div>

        {/* Narrative Text */}
        <div className="space-y-8 md:space-y-10">
          <p
            ref={line1Ref}
            className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line1}
          </p>

          <p
            ref={line2Ref}
            className="text-2xl md:text-3xl text-slate-600 italic font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line2}
          </p>

          <p
            ref={line3Ref}
            className="text-base md:text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed tracking-wide"
            style={{ willChange: 'transform, opacity' }}
          >
            {narrativeTextConfig.line3}
          </p>
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex flex-col items-center justify-center mt-16 gap-4">
          <div className="w-px h-12 bg-gradient-to-b from-emerald-500/50 to-transparent" />
          <StarIcon className="w-4 h-4 text-emerald-400/40" />
        </div>
      </div>
    </section>
  );
};

export default NarrativeText;