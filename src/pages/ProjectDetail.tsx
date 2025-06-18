
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Code, Globe, Smartphone, Database, Cpu, Monitor, Shield, Cloud, Camera, Palette, Rocket, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const iconMap = {
  Code,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Monitor,
  Shield,
  Cloud,
  Camera,
  Palette,
  Rocket,
  Heart
};

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
  icon: string;
  project_url: string;
}

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('active', true)
        .single();
      
      if (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
      
      return data as Project;
    },
    enabled: !!projectId
  });

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
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Projekt nicht gefunden</h1>
            <Button onClick={() => navigate('/')} className="modern-button">
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[project.icon as keyof typeof iconMap] || Code;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline"
          className="mb-8 modern-button-outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <div className="modern-card rounded-3xl overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-80 bg-gradient-to-r from-red-600/20 to-red-800/20">
            <img 
              src={project.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop'} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-900/50 p-3 rounded-xl border border-blue-500/30">
                  <IconComponent className="h-8 w-8 text-blue-400" />
                </div>
                <Badge className={`${getStatusColor(project.status)} text-lg px-4 py-2`}>
                  {project.status}
                </Badge>
              </div>
              <h1 className="text-5xl font-black text-white mb-2">{project.title}</h1>
              {project.category && (
                <p className="text-xl text-red-400 font-semibold">{project.category}</p>
              )}
            </div>
          </div>

          <div className="p-12">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Projektbeschreibung</h2>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Verwendete Technologien</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag: string) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-gray-800/50 text-gray-300 hover:bg-red-900/50 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-500/30 text-sm px-4 py-2"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl p-6 border border-red-500/20">
                  <h4 className="text-xl font-bold text-white mb-4">Projekt Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-white font-semibold">{project.status}</span>
                    </div>
                    {project.category && (
                      <div>
                        <span className="text-gray-400">Kategorie:</span>
                        <span className="ml-2 text-white font-semibold">{project.category}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Erstellt:</span>
                      <span className="ml-2 text-white font-semibold">
                        {new Date(project.created_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>

                {project.project_url && (
                  <div className="text-center">
                    <Button 
                      size="lg"
                      onClick={() => window.open(project.project_url, '_blank')}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg modern-button"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Projekt ansehen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
