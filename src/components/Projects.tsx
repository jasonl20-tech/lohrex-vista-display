import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Smartphone, Globe, Database, Cpu } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Vollständige E-Commerce-Lösung mit modernem Design und erweiterten Funktionen für Online-Händler.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    icon: Globe,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    status: "Abgeschlossen"
  },
  {
    id: 2,
    title: "Mobile App Suite",
    description: "Cross-Platform Mobile App für iOS und Android mit Cloud-Integration und Real-time Features.",
    tags: ["React Native", "Firebase", "TypeScript", "Redux"],
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    status: "In Entwicklung"
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Interaktives Dashboard für Business Intelligence mit Echtzeitdaten und erweiterten Visualisierungen.",
    tags: ["Python", "React", "D3.js", "MongoDB"],
    icon: Database,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    status: "Abgeschlossen"
  },
  {
    id: 4,
    title: "IoT Management System",
    description: "Umfassende IoT-Lösung zur Überwachung und Steuerung von Smart Devices in Unternehmen.",
    tags: ["Vue.js", "MQTT", "InfluxDB", "Docker"],
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
    status: "Planung"
  },
  {
    id: 5,
    title: "Enterprise Software",
    description: "Maßgeschneiderte Enterprise-Lösung für Workflow-Management und Prozessoptimierung.",
    tags: ["Angular", "Java", "Spring", "Oracle"],
    icon: Code,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
    status: "In Entwicklung"
  },
  {
    id: 6,
    title: "Cloud Infrastructure",
    description: "Skalierbare Cloud-Infrastruktur mit automatischer Bereitstellung und Monitoring.",
    tags: ["AWS", "Kubernetes", "Terraform", "Prometheus"],
    icon: Globe,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    status: "Abgeschlossen"
  }
];

export const Projects = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

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

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Unsere <span className="text-gradient">Projekte</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Von Web-Anwendungen bis hin zu mobilen Apps - wir entwickeln 
            maßgeschneiderte Lösungen für verschiedenste Anforderungen.
          </p>
        </div>

        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-reveal ${gridVisible ? 'revealed' : ''}`}>
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card 
                key={project.id} 
                className="group hover-lift transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-blue-500/50 hover-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 filter brightness-50 group-hover:brightness-75"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(project.status)} font-medium border`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="text-white h-8 w-8" />
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-900/50 p-2 rounded-lg border border-blue-500/30">
                      <IconComponent className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-300 mb-4 leading-relaxed">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-gray-800/50 text-gray-300 hover:bg-blue-900/50 hover:text-blue-400 transition-colors border border-gray-700 hover:border-blue-500/30"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
