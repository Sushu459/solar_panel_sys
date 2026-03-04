import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { getOptimizedImageUrl } from '../../lib/image';
import type { Project } from '../../types';

// Project Card Component
function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] group block"
    >
      <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-lime-100 shadow-lg shadow-lime-900/5 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/10 group-hover:border-emerald-200 group-hover:-translate-y-1.5">
        
        {/* Smaller Image Top Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
          <img
            src={getOptimizedImageUrl(project.images[0], { width: 800, quality: 85 })}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {/* Subtle inner shadow for image depth */}
          <div className="absolute inset-0 border-b border-black/5 pointer-events-none" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm backdrop-blur-md border ${
              project.status === 'active'
                ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200'
                : project.status === 'completed'
                ? 'bg-blue-100/90 text-blue-700 border-blue-200'
                : 'bg-lime-100/90 text-lime-700 border-lime-200'
            }`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Content Bottom Section */}
        <div className="p-6 flex flex-col flex-1 relative">
          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {project.title}
          </h3>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-6 mt-auto pt-2">
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-500" />
              {project.city}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              <Zap className="w-4 h-4 text-lime-500" />
              {project.capacity_kw} kW
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold opacity-80 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
            View Project Details
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Infinite Carousel Component
export default function ProjectsCarousel() {
  const { projects, settings, fetchProjects, fetchSettings } = useData();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    fetchProjects();
    fetchSettings();
  }, [fetchProjects, fetchSettings]);

  // Filter active projects for carousel
  const activeProjects = projects.filter(p => p.status === 'active');
  
  // Duplicate projects for seamless loop
  const duplicatedProjects = [...activeProjects, ...activeProjects, ...activeProjects];

  // Carousel speed from settings (default 30 seconds for full cycle)
  const carouselSpeed = settings?.carousel_speed || 30;

  useEffect(() => {
    if (activeProjects.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 320 : 380;
    const gap = 24;
    const singleSetWidth = (cardWidth + gap) * activeProjects.length;

    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!isPaused) {
        const deltaTime = currentTime - lastTime;
        // Calculate pixels to move per frame for smooth continuous motion
        const pixelsPerMs = singleSetWidth / (carouselSpeed * 1000);
        scrollPositionRef.current += deltaTime * pixelsPerMs;

        // Reset position for seamless loop
        if (scrollPositionRef.current >= singleSetWidth) {
          scrollPositionRef.current = scrollPositionRef.current % singleSetWidth;
        }

        container.style.transform = `translateX(-${scrollPositionRef.current}px)`;
      }
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeProjects.length, carouselSpeed, isPaused]);

  if (activeProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-lime-50/40 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Projects</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-xl">
              Explore our portfolio of successful solar installations across India, powering homes and businesses.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition-all hover:translate-x-1"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="relative py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Gradient Overlays for smooth fade out at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div
          ref={containerRef}
          className="flex gap-6 pl-4 sm:pl-8"
          style={{ willChange: 'transform' }}
        >
          {duplicatedProjects.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} />
          ))}
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold tracking-wider uppercase text-white z-20 shadow-lg animate-fade-in">
            Paused
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Active Projects', value: activeProjects.length },
            { label: 'Total Capacity', value: `${activeProjects.reduce((sum, p) => sum + p.capacity_kw, 0)} kW` },
            { label: 'Cities Covered', value: new Set(activeProjects.map(p => p.city)).size },
            { label: 'States', value: new Set(activeProjects.map(p => p.state)).size },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-3xl bg-white border border-lime-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}