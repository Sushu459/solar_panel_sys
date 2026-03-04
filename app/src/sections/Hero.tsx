import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;

    if (!section || !title || !subtitle || !image || !overlay) return;

    // Initial animation on load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      image,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2 }
    )
    .fromTo(
      title,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5 },
      '-=1.5'
    )
    .fromTo(
      subtitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.8'
    );

    // Scroll-driven parallax
    const parallaxTriggers: ScrollTrigger[] = [];

    const imageTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(image, { y: self.progress * 150 });
      },
    });
    parallaxTriggers.push(imageTrigger);

    const titleTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '50% top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(title, {
          opacity: 1 - self.progress * 1.5,
          y: self.progress * -50
        });
        gsap.set(subtitle, {
          opacity: 1 - self.progress * 2,
          y: self.progress * -30
        });
      },
    });
    parallaxTriggers.push(titleTrigger);

    // Darkens the overlay as you scroll down to keep text legible
    const overlayTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        gsap.set(overlay, { opacity: self.progress * 0.5 });
      },
    });
    parallaxTriggers.push(overlayTrigger);

    return () => {
      parallaxTriggers.forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, []);

  if (!heroConfig.title && !heroConfig.backgroundImage) return null;

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-slate-900 font-sans"
    >
      {/* Background Image with Ken Burns */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <img
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover ken-burns"
        />
      </div>

      {/* Sunlit warm overlay to match the theme's vibe */}
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/20 to-emerald-500/10 mix-blend-overlay pointer-events-none" />

      {/* Gradient overlay for depth (GSAP controlled) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-slate-950 opacity-0"
        style={{ willChange: 'opacity' }}
      />

      {/* Subtle fog effect overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-white/10 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10">
        
        {/* Main Title */}
        <h1
          ref={titleRef}
          className="font-extrabold text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight select-none drop-shadow-xl"
          style={{
            willChange: 'transform, opacity'
          }}
        >
          {heroConfig.title}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lime-400 text-sm sm:text-base md:text-lg uppercase tracking-[0.25em] font-bold mt-6 drop-shadow-md"
          style={{ willChange: 'transform, opacity' }}
        >
          {heroConfig.subtitle}
        </p>
      </div>

      {/* Bottom gradient for seamless transition into the white background sections below */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero;