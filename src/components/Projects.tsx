
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, Smartphone, Globe, Database, Cpu } from "lucide-react";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Abgeschlossen":
        return "bg-green-100 text-green-800";
      case "In Entwicklung":
        return "bg-blue-100 text-blue-800";
      case "Planung":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Unsere <span className="text-blue-600">Projekte</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von Web-Anwendungen bis hin zu mobilen Apps - wir entwickeln 
            maßgeschneiderte Lösungen für verschiedenste Anforderungen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card 
                key={project.id} 
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2 bg-white"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(project.status)} font-medium`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="text-white h-8 w-8" />
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
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
