import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Save, 
  Building2, 
  MapPin,
  Calculator,
  Sun,
  Loader2,
  CheckCircle,
  LayoutDashboard,
  FolderOpen,
  Star,
  Mail,
  Users,
  LogOut
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';

// Sidebar Configuration
const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSettingsPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { settings, fetchSettings, updateSettings } = useData();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const location = useLocation();

  const [formData, setFormData] = useState({
    org_name: '',
    contact_email: '',
    contact_phone: '',
    org_address: '',
    kwh_per_kw_per_month: 130,
    tariff_per_kwh: 8.5,
    system_cost_per_kw: 45000,
    subsidy_percentage: 30,
    maintenance_cost_per_kw_year: 500,
    carousel_speed: 30,
    map_center_lat: 21.0,
    map_center_lng: 78.0,
    map_zoom: 5,
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        org_name: settings.org_name,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        org_address: settings.org_address,
        kwh_per_kw_per_month: settings.kwh_per_kw_per_month,
        tariff_per_kwh: settings.tariff_per_kwh,
        system_cost_per_kw: settings.system_cost_per_kw,
        subsidy_percentage: settings.subsidy_percentage,
        maintenance_cost_per_kw_year: settings.maintenance_cost_per_kw_year,
        carousel_speed: settings.carousel_speed,
        map_center_lat: settings.map_center_lat,
        map_center_lng: settings.map_center_lng,
        map_zoom: settings.map_zoom,
      });
    }
  }, [settings]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSettings({
      org_name: formData.org_name,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      org_address: formData.org_address,
      kwh_per_kw_per_month: formData.kwh_per_kw_per_month,
      tariff_per_kwh: formData.tariff_per_kwh,
      system_cost_per_kw: formData.system_cost_per_kw,
      subsidy_percentage: formData.subsidy_percentage,
      maintenance_cost_per_kw_year: formData.maintenance_cost_per_kw_year,
      carousel_speed: formData.carousel_speed,
      map_center_lat: formData.map_center_lat,
      map_center_lng: formData.map_center_lng,
      map_zoom: formData.map_zoom,
    });

    if (result) {
      toast.success('Settings saved successfully');
      setIsSaved(true);
    } else {
      toast.error('Failed to save settings');
    }
    setIsSaving(false);
  };

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all shadow-sm rounded-xl py-2.5";
  const labelClasses = "text-slate-700 font-bold text-sm mb-1.5 block";

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-emerald-50/50 to-white text-slate-800 font-sans selection:bg-lime-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-lime-100/50 fixed left-0 top-0 z-50 hidden lg:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
          {/* Logo */}
          <div className="p-6 border-b border-lime-100/50">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg tracking-tight">Solar Systems</span>
                <span className="block text-xs font-bold text-emerald-500 uppercase tracking-wider">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-100 to-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-lime-100/50 bg-white/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold uppercase">
                {user?.email?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                <p className="text-xs font-medium text-slate-500">{isAdmin ? 'Administrator' : 'User'}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-lime-100 z-50 pb-safe shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.1)]">
          <nav className="flex justify-around p-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-lime-100/50 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <h1 className="text-xl font-extrabold text-slate-800">Global Settings</h1>
              <Button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={`font-bold shadow-md ${
                  isSaved
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 shadow-emerald-500/20 border-0'
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isSaved ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaved ? 'Settings Saved' : 'Save Changes'}
              </Button>
            </div>
          </header>

          <div className="p-6 max-w-5xl mx-auto space-y-10 mt-4">
            
            {/* Organization Settings */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center shadow-sm border border-emerald-200">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Organization Info</h2>
                  <p className="text-sm font-medium text-slate-500">Public company information and contact details</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-white border border-lime-100 shadow-sm">
                <div>
                  <Label className={labelClasses}>Organization Name</Label>
                  <Input
                    value={formData.org_name}
                    onChange={(e) => handleChange('org_name', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <Label className={labelClasses}>Contact Email</Label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <Label className={labelClasses}>Contact Phone</Label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className={labelClasses}>Physical Address</Label>
                  <Input
                    value={formData.org_address}
                    onChange={(e) => handleChange('org_address', e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
            </section>

            {/* Calculator Settings */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-sm border border-emerald-200">
                  <Calculator className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Calculator Parameters</h2>
                  <p className="text-sm font-medium text-slate-500">Variables used for customer savings predictions</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 rounded-3xl bg-white border border-lime-100 shadow-sm">
                <div>
                  <Label className={labelClasses}>kWh per kW per Month</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.kwh_per_kw_per_month}
                    onChange={(e) => handleChange('kwh_per_kw_per_month', parseFloat(e.target.value))}
                    className={inputClasses}
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">Avg generation per kW capacity</p>
                </div>
                <div>
                  <Label className={labelClasses}>Tariff per kWh (₹)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.tariff_per_kwh}
                    onChange={(e) => handleChange('tariff_per_kwh', parseFloat(e.target.value))}
                    className={inputClasses}
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">Current grid electricity rate</p>
                </div>
                <div>
                  <Label className={labelClasses}>System Cost per kW (₹)</Label>
                  <Input
                    type="number"
                    value={formData.system_cost_per_kw}
                    onChange={(e) => handleChange('system_cost_per_kw', parseFloat(e.target.value))}
                    className={inputClasses}
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">Average installation base cost</p>
                </div>
                <div>
                  <Label className={labelClasses}>Subsidy Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.subsidy_percentage}
                    onChange={(e) => handleChange('subsidy_percentage', parseFloat(e.target.value))}
                    className={inputClasses}
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">Applicable government subsidy rate</p>
                </div>
                <div className="lg:col-span-2">
                  <Label className={labelClasses}>Maintenance Cost per kW/Year (₹)</Label>
                  <Input
                    type="number"
                    value={formData.maintenance_cost_per_kw_year}
                    onChange={(e) => handleChange('maintenance_cost_per_kw_year', parseFloat(e.target.value))}
                    className={inputClasses}
                  />
                  <p className="text-xs font-medium text-slate-400 mt-2">Annual expected maintenance costs</p>
                </div>
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Carousel Settings */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm border border-blue-200">
                    <Sun className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Interface</h2>
                    <p className="text-sm font-medium text-slate-500">Website display tweaks</p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-lime-100 shadow-sm h-[calc(100%-88px)]">
                  <div className="max-w-xs">
                    <Label className={labelClasses}>Carousel Speed (seconds)</Label>
                    <Input
                      type="number"
                      value={formData.carousel_speed}
                      onChange={(e) => handleChange('carousel_speed', parseInt(e.target.value))}
                      className={inputClasses}
                    />
                    <p className="text-xs font-medium text-slate-400 mt-2">Time for one complete home page cycle</p>
                  </div>
                </div>
              </section>

              {/* Map Settings */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center shadow-sm border border-rose-200">
                    <MapPin className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800">Map Defaults</h2>
                    <p className="text-sm font-medium text-slate-500">Initial map center and zoom level</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 p-8 rounded-3xl bg-white border border-lime-100 shadow-sm">
                  <div>
                    <Label className={labelClasses}>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.map_center_lat}
                      onChange={(e) => handleChange('map_center_lat', parseFloat(e.target.value))}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <Label className={labelClasses}>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.map_center_lng}
                      onChange={(e) => handleChange('map_center_lng', parseFloat(e.target.value))}
                      className={inputClasses}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className={labelClasses}>Default Zoom Level</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.map_zoom}
                      onChange={(e) => handleChange('map_zoom', parseInt(e.target.value))}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </section>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}