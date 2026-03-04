import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardStackConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const CardStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const cards = cardStackConfig.cards;

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const cardElements = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !wrapper || cardElements.length === 0) return;

    // Set initial positions - cards start at screen center
    cardElements.forEach((card, index) => {
      gsap.set(card, {
        y: index === 0 ? 0 : window.innerHeight * 0.5,
        rotation: cards[index].rotation,
        opacity: index === 0 ? 1 : 0,
      });
    });

    // Create pinned scroll animation
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${cardElements.length * 100}%`,
      pin: wrapper,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const segmentSize = 1 / cardElements.length;

        cardElements.forEach((card, index) => {
          const cardStart = index * segmentSize;
          const cardProgress = gsap.utils.clamp(0, 1, (progress - cardStart) / segmentSize);

          if (index === 0) {
            // First card - fade out as user scrolls
            gsap.set(card, {
              opacity: 1 - cardProgress * 0.3,
              scale: 1 - cardProgress * 0.05,
            });
          } else {
            // Other cards - slide up from bottom
            const prevCardEnd = index * segmentSize;
            const prevProgress = gsap.utils.clamp(0, 1, (progress - prevCardEnd + segmentSize) / segmentSize);

            gsap.set(card, {
              y: (1 - prevProgress) * window.innerHeight * 0.8,
              opacity: prevProgress,
              zIndex: index,
            });
          }
        });
      },
    });

    triggerRef.current = trigger;

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
  }, [cards]);

  if (!cardStackConfig.sectionTitle && cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-lime-50/30"
      style={{ minHeight: `${(cards.length + 1) * 100}vh` }}
    >
      {/* Section Header */}
      <div className="absolute top-0 left-0 right-0 py-16 md:py-24 text-center z-10 px-4">
        <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight">
          {cardStackConfig.sectionTitle}
        </h2>
        <p className="font-bold text-sm md:text-base text-emerald-600 uppercase tracking-[0.2em] mt-4">
          {cardStackConfig.sectionSubtitle}
        </p>
      </div>

      {/* Pinned Card Wrapper */}
      <div
        ref={wrapperRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative w-full max-w-4xl mx-auto px-6 md:px-8 aspect-[4/3] sm:aspect-video lg:aspect-[21/9]">
          {cards.map((card, index) => (
            <div
              key={card.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute inset-0"
              style={{
                willChange: 'transform, opacity',
                zIndex: index,
              }}
            >
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-lime-100 bg-white h-full group">
                
                {/* Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Image Overlay - Updated for better contrast with white text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <h3 className="font-extrabold text-3xl md:text-4xl text-white mb-3 tracking-tight drop-shadow-sm">
                    {card.title}
                  </h3>
                  <p className="font-medium text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Card Number Badge */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                  <span className="font-extrabold text-lg text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-24" />
    </section>
  );
};

export default CardStack;