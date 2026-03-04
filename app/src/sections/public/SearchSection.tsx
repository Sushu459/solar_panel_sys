import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Zap, X, ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useData } from '../../contexts/DataContext';
import type { Project } from '../../types';

export default function SearchSection() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Project[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { projects, fetchProjects } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = projects
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.capacity_kw.toString().includes(query)
      )
      .slice(0, 5);
    setSuggestions(filtered);
  }, [query, projects]);

  const handleSearch = useCallback(() => {
    setShowSuggestions(false);
    navigate(`/projects?search=${encodeURIComponent(query)}`);
  }, [query, navigate]);

  const handleSuggestionClick = useCallback((project: Project) => {
    setShowSuggestions(false);
    navigate(`/projects/${project.id}`);
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get unique cities for quick filters
  const uniqueCities = [...new Set(projects.map((p) => p.city))].slice(0, 5);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-lime-50/40 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-500">Solar Solution</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Search by project name, city, or installation capacity
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="relative rounded-[2rem] border border-lime-100 bg-white p-3 shadow-xl shadow-emerald-500/5">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-100 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-400/10 transition-all duration-300">
            <Search className="w-6 h-6 text-emerald-500 ml-3 shrink-0" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1 bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 rounded-xl px-8 py-6 text-base font-bold shadow-md shadow-emerald-500/20 border-0 transition-transform hover:-translate-y-0.5"
            >
              Search
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-lime-100 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 z-50">
              {suggestions.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSuggestionClick(project)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-emerald-50/50 transition-colors text-left border-b border-slate-50 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-slate-800 truncate text-lg group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {project.city}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-lime-600 font-bold">{project.capacity_kw} kW</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                </button>
              ))}
              <button
                onClick={handleSearch}
                className="w-full p-4 text-center font-bold text-emerald-600 hover:bg-emerald-50 transition-colors bg-white"
              >
                View all results
              </button>
            </div>
          )}
        </div>

        {/* Quick City Filters */}
        {uniqueCities.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Popular locations:</span>
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setQuery(city);
                  navigate(`/projects?city=${encodeURIComponent(city)}`);
                }}
                className="px-4 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all hover:-translate-y-0.5"
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}