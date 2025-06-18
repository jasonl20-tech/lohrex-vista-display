
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { ProjectForm } from './ProjectForm';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  category: string;
  image_url: string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const ProjectManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      return data as Project[];
    }
  });

  const toggleProjectMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from('projects')
        .update({ active, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projekt Status aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projekt gelöscht');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen: ' + error.message);
    }
  });

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Abgeschlossen":
        return "bg-green-900/50 text-green-400 border-green-500/30";
      case "In Entwicklung":
        return "bg-blue-900/50 text-blue-400 border-blue-500/30";
      case "Planung":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-900/50 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Projekte verwalten</h2>
          <p className="text-gray-400">Erstellen, bearbeiten und verwalten Sie Ihre Projekte</p>
        </div>
        <Button onClick={handleAddNew} className="modern-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          <Plus className="w-4 h-4 mr-2" />
          Neues Projekt
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="modern-card">
            <div className="relative">
              <img 
                src={project.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'} 
                alt={project.title}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {!project.active && (
                  <Badge variant="secondary" className="bg-red-900/50 text-red-400 border-red-500/30">
                    Deaktiviert
                  </Badge>
                )}
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">{project.title}</CardTitle>
              <CardDescription className="text-gray-400 line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {project.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-800/50 text-gray-300">
                    {tag}
                  </Badge>
                ))}
                {project.tags?.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-800/50 text-gray-300">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(project)}
                  className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Bearbeiten
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleProjectMutation.mutate({ id: project.id, active: !project.active })}
                  className={`border-gray-500/30 ${project.active ? 'text-yellow-400 hover:bg-yellow-900/20' : 'text-green-400 hover:bg-green-900/20'}`}
                >
                  {project.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteProjectMutation.mutate(project.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          onClose={handleFormClose}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
            queryClient.invalidateQueries({ queryKey: ['projects'] });
          }}
        />
      )}
    </div>
  );
};
