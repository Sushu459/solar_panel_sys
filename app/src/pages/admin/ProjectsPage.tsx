import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  Zap,
  Upload,
  Loader2,
  Image as ImageIcon,
  LayoutDashboard,
  Star,
  Mail,
  Users,
  Settings,
  LogOut,
  Sun
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { toast } from 'sonner';
import type { Project, ProjectInsert, ProjectUpdate } from '../../types';

// Sidebar Configuration
const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Project Form Modal
function ProjectModal({
  project,
  isOpen,
  onClose,
  onSave,
}: {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectInsert | ProjectUpdate) => void;
}) {
  const [formData, setFormData] = useState<Partial<Project> & { installation_date?: string }>({
    title: '',
    description: '',
    capacity_kw: 0,
    address: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    images: [],
    installation_date: '',
    status: 'active',
    tags: [],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        installation_date: project.installation_date
          ? new Date(project.installation_date).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        capacity_kw: 0,
        address: '',
        city: '',
        state: '',
        latitude: 0,
        longitude: 0,
        images: [],
        installation_date: '',
        status: 'active',
        tags: [],
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ProjectInsert);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  };

  const inputClasses = "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all shadow-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-lime-100 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-lime-100/50 bg-white/90 backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-slate-800">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold">Project Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              className={inputClasses}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description"
              rows={4}
              className={`${inputClasses} resize-none`}
              required
            />
          </div>

          {/* Capacity & Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Capacity (kW)</Label>
              <Input
                type="number"
                value={formData.capacity_kw}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity_kw: parseFloat(e.target.value) }))}
                placeholder="e.g., 500"
                className={inputClasses}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'pending' }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 shadow-sm focus:border-emerald-400 focus:ring-emerald-400/20 focus:outline-none transition-all font-medium"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Street address"
                className={inputClasses}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className={inputClasses}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">State</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Latitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                placeholder="e.g., 19.0760"
                className={inputClasses}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Longitude</Label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                placeholder="e.g., 72.8777"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Installation Date */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold">Installation Date</Label>
            <Input
              type="date"
              value={formData.installation_date}
              onChange={(e) => setFormData((prev) => ({ ...prev, installation_date: e.target.value }))}
              className={inputClasses}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold">Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className={inputClasses}
              />
              <Button type="button" onClick={addImage} variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative group rounded-xl shadow-sm border border-slate-200 p-1 bg-white">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className={inputClasses}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-bold hover:from-emerald-600 hover:to-lime-600 shadow-md shadow-emerald-500/20">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const { user, signOut, isAdmin } = useAuth();
  const { projects, fetchProjects, createProject, updateProject, deleteProject } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (data: ProjectInsert | ProjectUpdate) => {
    if (editingProject) {
      const result = await updateProject(editingProject.id, data as ProjectUpdate);
      if (result) {
        toast.success('Project updated successfully');
        setIsModalOpen(false);
        setEditingProject(null);
      } else {
        toast.error('Failed to update project');
      }
    } else {
      const result = await createProject(data as ProjectInsert);
      if (result) {
        toast.success('Project created successfully');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to create project');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsDeleting(id);
    const success = await deleteProject(id);
    if (success) {
      toast.success('Project deleted successfully');
    } else {
      toast.error('Failed to delete project');
    }
    setIsDeleting(null);
  };

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
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold text-slate-800">Projects Management</h1>
              <Button
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 font-bold shadow-md shadow-emerald-500/20 border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </header>

          <div className="p-6 max-w-7xl mx-auto">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search projects by title or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white border-lime-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm rounded-2xl font-medium"
              />
            </div>

            {/* Projects Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl overflow-hidden border border-lime-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 shrink-0">
                    <img
                      src={project.images[0] || '/placeholder-project.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm border ${
                          project.status === 'active'
                            ? 'bg-emerald-100/90 text-emerald-700 border-emerald-200 backdrop-blur-sm'
                            : 'bg-lime-100/90 text-lime-700 border-lime-200 backdrop-blur-sm'
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-slate-800 mb-3 line-clamp-1">{project.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mb-6">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        {project.city}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        <Zap className="w-4 h-4 text-lime-500" />
                        {project.capacity_kw} kW
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProject(project);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 font-bold transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        disabled={isDeleting === project.id}
                        className="bg-white border-red-100 text-red-500 hover:bg-white hover:border-red-100 font-bold transition-colors w-12 px-0"
                      >
                        {isDeleting === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-lime-100 border-dashed mt-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">No projects found</h3>
                <p className="text-slate-500 font-medium mb-6">Create your first project to get started</p>
                <Button
                  onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-bold hover:from-emerald-600 hover:to-lime-600 shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}