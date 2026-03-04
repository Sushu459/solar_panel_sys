import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Zap, ArrowRight, Filter, X, Search, Grid3X3, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useData } from '../contexts/DataContext';
import Header from '../sections/public/Header';
import Footer from '../sections/public/Footer';
import { getOptimizedImageUrl } from '../lib/image';
import type { Project } from '../types';

// Project Card Component
function ProjectCard({ project, viewMode }: { project: Project; viewMode: 'grid' | 'list' }) {
  const badgeClasses = `px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border shadow-sm backdrop-blur-md`;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/projects/${project.id}`}
        className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-3xl bg-white border border-lime-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 transition-all duration-300 group"
      >
        {/* Smaller Image for List View */}
        <div className="w-full sm:w-56 h-48 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0">
          <img
            src={getOptimizedImageUrl(project.images[0], { width: 800, quality: 85 })}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-2 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-500" />
              {project.city}, {project.state}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-lime-500" />
              {project.capacity_kw} kW
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden sm:flex items-center pr-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-[2rem] overflow-hidden bg-white border border-lime-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* Smaller, Framed Image Top */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getOptimizedImageUrl(project.images[0], { width: 1000, quality: 85 })}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`${badgeClasses} ${
            project.status === 'active'
              ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200'
              : 'bg-lime-100/90 text-lime-700 border-lime-200'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content Bottom */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-50 text-slate-600 border border-slate-200">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">{project.description}</p>

        <div className="flex items-center justify-between text-sm font-bold pt-4 border-t border-slate-50">
          <span className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-4 h-4 text-emerald-500" />
            {project.city}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <Zap className="w-4 h-4 text-lime-500" />
            {project.capacity_kw} kW
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const { projects, fetchProjects } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [maxCapacity, setMaxCapacity] = useState<string>('');

  const cities = [...new Set(projects.map((p) => p.city))].sort();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    if (search) setSearchQuery(search);
    if (city) setSelectedCity(city);
  }, [searchParams]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.capacity_kw.toString().includes(searchQuery);

    const matchesCity = !selectedCity || project.city === selectedCity;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    const matchesMinCapacity = !minCapacity || project.capacity_kw >= parseFloat(minCapacity);
    const matchesMaxCapacity = !maxCapacity || project.capacity_kw <= parseFloat(maxCapacity);

    return matchesSearch && matchesCity && matchesStatus && matchesMinCapacity && matchesMaxCapacity;
  });

  const applyFilters = useCallback(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCity) params.city = selectedCity;
    if (selectedStatus) params.status = selectedStatus;
    if (minCapacity) params.minCapacity = minCapacity;
    if (maxCapacity) params.maxCapacity = maxCapacity;
    setSearchParams(params);
  }, [searchQuery, selectedCity, selectedStatus, minCapacity, maxCapacity, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedStatus('');
    setMinCapacity('');
    setMaxCapacity('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedStatus || minCapacity || maxCapacity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-white text-slate-800 selection:bg-lime-200">
      <Header />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Solar Portfolio</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              Explore our diverse installations across India, ranging from residential rooftops to massive industrial solar farms.
            </p>
          </div>

          {/* Action Bar */}
          <div className="mb-10 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search projects by name, city, or kW..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="pl-12 py-7 bg-white border-lime-100 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/10 shadow-sm rounded-2xl font-medium"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`py-7 px-6 rounded-2xl border-lime-100 font-bold ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-3 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shadow-md">
                      {[selectedCity, selectedStatus, minCapacity, maxCapacity].filter(Boolean).length + (searchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>

                <div className="flex p-1 bg-white border border-lime-100 rounded-2xl shadow-sm h-14 my-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 w-12 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-500'}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 w-12 rounded-xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-500'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="p-8 rounded-3xl bg-white border border-lime-100 shadow-xl shadow-emerald-900/5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Location</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-bold focus:border-emerald-400 focus:outline-none transition-all"
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Project Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-bold focus:border-emerald-400 focus:outline-none transition-all"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Min Capacity (kW)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(e.target.value)}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-800 font-bold rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Max Capacity (kW)</label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-800 font-bold rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  <Button onClick={applyFilters} className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold px-8 h-12 rounded-xl shadow-md shadow-emerald-500/20 border-0">
                    Apply Filters
                  </Button>
                  <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-red-500 font-bold px-6 h-12 rounded-xl">
                    <X className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-8 flex items-center justify-between px-2">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
              Showing <span className="text-emerald-600">{filteredProjects.length}</span> verified projects
            </p>
          </div>

          {/* Project List */}
          {filteredProjects.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-lime-100 border-dashed">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">No projects matched</h3>
              <p className="text-slate-500 font-medium mb-8">Try adjusting your filters or search terms</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold rounded-full px-8 py-6 h-auto border-0">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}