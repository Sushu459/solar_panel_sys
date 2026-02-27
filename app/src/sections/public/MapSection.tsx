import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import isoImg from './iso.jpeg';
import iesImg from './iec.jpeg';
import bisImg from './bis.jpeg';
import AllmImg from './Allm.jpeg';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapSection() {
  const { projects, fetchProjects } = useData();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const indiaBounds: L.LatLngBoundsExpression = [
    [6.0, 68.0],
    [37.5, 97.5],
  ];

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const mapProjects = projects.filter(
    (p) => p.latitude && p.longitude && p.status === 'active'
  );
  const projectBounds = L.latLngBounds(
    mapProjects.map((project) => [project.latitude, project.longitude])
  );

  const cities = [...new Set(mapProjects.map((p) => p.city))].slice(0, 8);

  if (mapProjects.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-32 bg-white overflow-hidden font-sans">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE CONTENT */}
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Our Projects <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Across India
              </span>
            </h2>

            <p className="text-lg text-slate-600 font-medium mb-10 leading-relaxed">
              Find our verified solar installations in {cities.length}+ cities.
              Click on a city to view specific projects.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {cities.map((city) => (
                <button
                  key={city}
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                    activeCity === city
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {city}
                </button>
              ))}

              <Link
                to="/projects"
                className="px-5 py-2.5 rounded-full text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {mapProjects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 truncate text-sm">
                      {project.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {project.city} • {project.capacity_kw}kW
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE MAP (Leaflet) */}
          <div className="relative flex items-center justify-center min-h-[500px]">
            <div className="relative w-full max-w-[550px] h-[500px] rounded-xl overflow-hidden shadow-xl">
              <MapContainer
                bounds={projectBounds}
                boundsOptions={{ padding: [30, 30], maxZoom: 6 }}
                minZoom={5}
                scrollWheelZoom={true}
                maxBounds={indiaBounds}
                maxBoundsViscosity={1.0}
                className="w-full h-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapProjects.map((project) => (
                  <Marker
                    key={project.id}
                    position={[project.latitude, project.longitude]}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{project.title}</strong>
                        <br />
                        {project.city} • {project.capacity_kw}kW
                        <br />
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-orange-600 font-bold"
                        >
                          View Project →
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

        </div>

        {/* Certifications Section */}
        <div className="mt-20 pt-12 border-t border-slate-100">
          <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-8">
            Certified & Compliant
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[iesImg, isoImg, AllmImg, bisImg].map((img, i) => (
              <div
                key={i}
                className="h-16 w-24 sm:h-20 sm:w-28 flex items-center justify-center p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={img}
                  alt="Certification"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}