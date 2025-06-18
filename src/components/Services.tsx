
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Code, Smartphone, Palette, Search, ShoppingCart, Database,
  Cloud, Shield, Zap, Headphones, Globe, BarChart, 
  Camera, Megaphone, Users, Cog, Rocket, Brain,
  Mail, Video, FileText, Monitor, Cpu, Lock
} from "lucide-react";

export const Services = () => {
  const { ref, isVisible } = useScrollAnimation();
  const navigate = useNavigate();

  const services = [
    { id: 'webdesign', title: 'Webdesign', icon: Palette, description: 'Moderne und ansprechende Website-Designs' },
    { id: 'webentwicklung', title: 'Webentwicklung', icon: Code, description: 'Professionelle Website-Entwicklung' },
    { id: 'app-entwicklung', title: 'App-Entwicklung', icon: Smartphone, description: 'Mobile Apps für iOS und Android' },
    { id: 'seo', title: 'SEO Optimierung', icon: Search, description: 'Suchmaschinenoptimierung für bessere Rankings' },
    { id: 'e-commerce', title: 'E-Commerce', icon: ShoppingCart, description: 'Online-Shops und Verkaufsplattformen' },
    { id: 'datenbank', title: 'Datenbank-Design', icon: Database, description: 'Effiziente Datenbanklösungen' },
    { id: 'cloud-services', title: 'Cloud Services', icon: Cloud, description: 'Cloud-basierte Lösungen und Migration' },
    { id: 'cybersecurity', title: 'Cybersecurity', icon: Shield, description: 'Sicherheitslösungen für Ihr Unternehmen' },
    { id: 'performance', title: 'Performance-Optimierung', icon: Zap, description: 'Website-Geschwindigkeit optimieren' },
    { id: 'support', title: 'Technical Support', icon: Headphones, description: '24/7 technischer Support' },
    { id: 'hosting', title: 'Web Hosting', icon: Globe, description: 'Zuverlässige Hosting-Lösungen' },
    { id: 'analytics', title: 'Web Analytics', icon: BarChart, description: 'Datenanalyse und Reporting' },
    { id: 'fotografie', title: 'Web-Fotografie', icon: Camera, description: 'Professionelle Fotos für Websites' },
    { id: 'marketing', title: 'Digital Marketing', icon: Megaphone, description: 'Online-Marketing-Strategien' },
    { id: 'social-media', title: 'Social Media', icon: Users, description: 'Social Media Management' },
    { id: 'wartung', title: 'Website-Wartung', icon: Cog, description: 'Regelmäßige Updates und Pflege' },
    { id: 'startup', title: 'Startup-Lösungen', icon: Rocket, description: 'Komplettlösungen für Startups' },
    { id: 'ki-integration', title: 'KI-Integration', icon: Brain, description: 'Künstliche Intelligenz implementieren' },
    { id: 'email-marketing', title: 'E-Mail Marketing', icon: Mail, description: 'Professionelle E-Mail-Kampagnen' },
    { id: 'video-content', title: 'Video Content', icon: Video, description: 'Videoproduktion für Web' },
    { id: 'content-management', title: 'Content Management', icon: FileText, description: 'CMS-Lösungen und Content-Strategie' },
    { id: 'responsive-design', title: 'Responsive Design', icon: Monitor, description: 'Mobile-optimierte Websites' },
    { id: 'api-entwicklung', title: 'API-Entwicklung', icon: Cpu, description: 'Schnittstellen und API-Services' },
    { id: 'ssl-sicherheit', title: 'SSL & Sicherheit', icon: Lock, description: 'Website-Verschlüsselung und Sicherheit' }
  ];

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className={`text-center mb-16 scroll-reveal ${isVisible ? 'revealed' : ''}`}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 modern-lava-text">
            Unsere Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Von der Konzeption bis zur Umsetzung - wir bieten umfassende digitale Lösungen 
            für Ihr Unternehmen. Entdecken Sie unser vollständiges Service-Portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`modern-card rounded-2xl p-8 hover-lift scroll-reveal ${isVisible ? 'revealed' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-4 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl">
                  <service.icon className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                <Button 
                  onClick={() => handleServiceClick(service.id)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white modern-button"
                >
                  Mehr erfahren
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
