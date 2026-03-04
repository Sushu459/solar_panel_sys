import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Zap, Calendar, ArrowLeft, ArrowRight, CheckCircle, Mail, Phone, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import { getOptimizedImageUrl } from '../lib/image';
import type { Project } from '../types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, projects, settings, fetchSettings } = useData();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await getProjectById(id);
      if (data) {
        setProject(data);
      }
      setIsLoading(false);
    };

    loadProject();
  }, [id, getProjectById]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Get related projects
  const relatedProjects = projects
    .filter((p) => p.id !== id && p.city === project?.city)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white">
        <Header />
        <main className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-slate-200 rounded mb-8" />
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                <div className="h-[400px] bg-slate-200 rounded-[2rem]" />
                <div className="space-y-4">
                  <div className="h-10 w-3/4 bg-slate-200 rounded-lg" />
                  <div className="h-6 w-1/2 bg-slate-200 rounded-lg" />
                  <div className="h-40 w-full bg-slate-200 rounded-2xl mt-8" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white">
        <Header />
        <main className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 bg-white rounded-[3rem] border border-lime-100 border-dashed shadow-sm">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Project Not Found</h1>
            <p className="text-slate-500 font-medium mb-8">The solar installation you are looking for does not exist or has been removed.</p>
            <Link to="/projects">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 font-bold transition-transform hover:-translate-y-1">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Portfolio
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-lime-100 text-lime-700 border-lime-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white text-slate-800 selection:bg-lime-200">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          {/* Hero Section: Image + Title Card */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12 items-start">
            
            {/* Constrained Image Gallery (Smaller and clearer) */}
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 border border-lime-100 shadow-xl shadow-emerald-900/5 aspect-square sm:aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <img
                // Using 1200 width for a balance of high clarity without massive file size
                src={getOptimizedImageUrl(project.images[currentImageIndex], { width: 1200, quality: 90 })}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              
              {/* Status Badge Over Image */}
              <div className="absolute top-6 right-6">
                 <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm backdrop-blur-md ${statusColors[project.status as keyof typeof statusColors]}`}>
                  {project.status}
                </span>
              </div>
              
              {/* Image Navigation */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-lg hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-slate-200"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-lg hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-slate-200"
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-slate-900/50 backdrop-blur-md">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-emerald-400 w-6' : 'bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title & Quick Stats Card */}
            <div className="flex flex-col justify-center h-full">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {project.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 font-medium mb-10">
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  {project.address}, {project.city}
                </span>
              </div>

              {/* Highlight Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-lime-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2 text-slate-500">
                    <Zap className="w-5 h-5 text-lime-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Capacity</span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800">{project.capacity_kw} kW</div>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-lime-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2 text-slate-500">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Installed</span>
                  </div>
                  <div className="text-xl font-extrabold text-slate-800 mt-1">
                    {project.installation_date
                      ? new Date(project.installation_date).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Description */}
              <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-lime-100 shadow-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                  <Sun className="w-6 h-6 text-emerald-500" />
                  About This Project
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                  {project.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-lime-100 shadow-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    'High-efficiency Tier-1 solar panels',
                    'Smart inverter & monitoring system',
                    '25-year performance warranty',
                    'Professional maintenance support',
                    'Significant monthly cost savings',
                    'Reduced carbon footprint',
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-600 font-bold">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Call to Action */}
              <div className="bg-gradient-to-br from-emerald-50 to-lime-100 rounded-[2rem] p-8 border border-emerald-200 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 relative z-10">
                  Ready for Solar?
                </h3>
                <p className="text-slate-600 font-medium mb-6 relative z-10">
                  Get a setup just like this one. Request a free consultation and quote today.
                </p>
                <Link to={`/contact?project=${project.id}`} className="block relative z-10">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 py-6 text-lg font-bold rounded-xl shadow-md border-0 transition-transform hover:-translate-y-0.5">
                    <Mail className="w-5 h-5 mr-2" />
                    Get Free Quote
                  </Button>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-[2rem] p-8 border border-lime-100 shadow-sm">
                <h3 className="text-xl font-extrabold text-slate-900 mb-6">Contact Us</h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${settings?.contact_phone || '+9118001234567'}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-bold transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Phone className="w-5 h-5 text-emerald-500" />
                    </div>
                    {settings?.contact_phone || '+91 1800 123 4567'}
                  </a>
                  <a
                    href={`mailto:${settings?.contact_email || 'info@solarsystems.in'}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-bold transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Mail className="w-5 h-5 text-emerald-500" />
                    </div>
                    {settings?.contact_email || 'info@solarsystems.in'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
                More in <span className="text-emerald-500">{project.city}</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    to={`/projects/${relatedProject.id}`}
                    className="group block rounded-[2rem] overflow-hidden bg-white border border-lime-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1.5"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(relatedProject.images[0], { width: 800, quality: 85 })}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {relatedProject.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm font-bold pt-4 border-t border-slate-50">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          {relatedProject.city}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <Zap className="w-4 h-4 text-lime-500" />
                          {relatedProject.capacity_kw} kW
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}