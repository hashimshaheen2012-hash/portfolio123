import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { CONFIG } from '@/config';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} from '@/lib/firebase-utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Admin() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    order: 0
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      const unsubProjects = getProjects(setProjects);
      const unsubInquiries = getInquiries(setInquiries);
      return () => {
        unsubProjects();
        unsubInquiries();
      };
    }
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-3xl font-bold text-red-500">Access Denied</h2>
        <p className="text-zinc-500">Please login with the admin password to access this page.</p>
      </div>
    );
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...projectForm,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      order: Number(projectForm.order)
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        toast.success("Project updated successfully!");
      } else {
        await createProject(data);
        toast.success("Project created successfully!");
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({ title: '', description: '', image: '', tags: '', order: 0 });
    } catch (err) {
      toast.error("Failed to save project.");
    }
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      order: project.order
    });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted.");
      } catch (err) {
        toast.error("Failed to delete project.");
      }
    }
  };

  const handleInquiryStatus = async (id: string, status: string) => {
    try {
      await updateInquiryStatus(id, status);
      toast.success(`Inquiry marked as ${status}.`);
    } catch (err) {
      toast.error("Failed to update inquiry.");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm("Delete this inquiry?")) {
      try {
        await deleteInquiry(id);
        toast.success("Inquiry deleted.");
      } catch (err) {
        toast.error("Failed to delete inquiry.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
            <Shield className="text-amber-500" size={40} /> ADMIN COMMAND
          </h1>
          <p className="text-zinc-500 mt-2">Welcome back, Hashim. Control center is online.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', image: '', tags: '', order: 0 }); setIsProjectModalOpen(true); }}
            className="bg-amber-500 text-zinc-950 font-bold hover:bg-amber-600"
          >
            <Plus size={18} className="mr-2" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Users size={20} />} label="Total Visitors" value="1,284" delta="+12%" />
        <StatCard icon={<MessageSquare size={20} />} label="Inquiries" value={inquiries.length.toString()} delta="Live" />
        <StatCard icon={<BarChart3 size={20} />} label="Projects" value={projects.length.toString()} delta="Live" />
        <StatCard icon={<Settings size={20} />} label="System Status" value="Optimal" delta="100%" />
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-8">
          <TabsTrigger value="projects" className="gap-2 px-6">
            Projects
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="gap-2 px-6">
            Inquiries {inquiries.filter(i => i.status === 'new').length > 0 && (
              <Badge className="ml-2 bg-amber-500 text-zinc-950">
                {inquiries.filter(i => i.status === 'new').length} New
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 px-6">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid gap-6">
            {projects.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">No projects found. Add your first one!</p>
              </div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 md:h-auto overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle>{project.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button onClick={() => openEditModal(project)} size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
                            <Edit size={16} />
                          </Button>
                          <Button onClick={() => handleDeleteProject(project.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="text-zinc-500 mb-4">{project.description}</CardDescription>
                      <div className="flex gap-2">
                        {project.tags.map((tag: string, j: number) => (
                          <Badge key={j} variant="outline" className="border-zinc-800 text-zinc-500">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="inquiries">
          <div className="grid gap-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">No inquiries yet.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <InquiryCard 
                  key={inquiry.id}
                  inquiry={inquiry}
                  onStatusChange={handleInquiryStatus}
                  onDelete={handleDeleteInquiry}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
              <CardDescription>Manage your global site configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Display Name</Label>
                  <Input className="bg-zinc-950 border-zinc-800" defaultValue={CONFIG.name} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Age</Label>
                  <Input className="bg-zinc-950 border-zinc-800" defaultValue={CONFIG.age} />
                </div>
              </div>
              <Button onClick={() => toast.success("Settings saved (locally for now)")} className="bg-amber-500 text-zinc-950 font-bold">
                <Save size={18} className="mr-2" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProjectSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                required
                value={projectForm.title}
                onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                required
                value={projectForm.description}
                onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input 
                required
                value={projectForm.image}
                onChange={e => setProjectForm({...projectForm, image: e.target.value})}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input 
                required
                value={projectForm.tags}
                onChange={e => setProjectForm({...projectForm, tags: e.target.value})}
                className="bg-zinc-950 border-zinc-800"
                placeholder="Minecraft, Java, Plugin"
              />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input 
                type="number"
                value={projectForm.order}
                onChange={e => setProjectForm({...projectForm, order: Number(e.target.value)})}
                className="bg-zinc-950 border-zinc-800"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-amber-500 text-zinc-950 font-bold hover:bg-amber-600">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon, label, value, delta }: { icon: React.ReactNode, label: string, value: string, delta: string }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-zinc-800 text-amber-500">
            {icon}
          </div>
          <span className={`text-xs font-bold ${delta.startsWith('+') ? 'text-green-500' : 'text-zinc-500'}`}>
            {delta}
          </span>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black">{value}</h3>
      </CardContent>
    </Card>
  );
}

interface InquiryCardProps {
  key?: React.Key;
  inquiry: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

function InquiryCard({ inquiry, onStatusChange, onDelete }: InquiryCardProps) {
  return (
    <Card className={`bg-zinc-900 border-zinc-800 text-zinc-100 ${inquiry.status === 'new' ? 'border-l-4 border-l-amber-500' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-lg">{inquiry.name}</h4>
            <p className="text-zinc-500 text-sm">{inquiry.email}</p>
          </div>
          <span className="text-xs text-zinc-500">
            {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Just now'}
          </span>
        </div>
        <p className="text-zinc-400 leading-relaxed italic">"{inquiry.message}"</p>
        <div className="flex gap-2 mt-6">
          {inquiry.status === 'new' ? (
            <Button onClick={() => onStatusChange(inquiry.id, 'archived')} size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-800">Archive</Button>
          ) : (
            <Button onClick={() => onStatusChange(inquiry.id, 'new')} size="sm" variant="outline" className="border-zinc-800 hover:bg-zinc-800">Unarchive</Button>
          )}
          <Button onClick={() => onDelete(inquiry.id)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}

