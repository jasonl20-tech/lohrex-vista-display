import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Code, Smartphone, Palette, Search, ShoppingCart, Database,
  Cloud, Shield, Zap, Headphones, Globe, BarChart, 
  Camera, Megaphone, Users, Cog, Rocket, Brain,
  Mail, Video, FileText, Monitor, Cpu, Lock,
  Eye, Link, Mic, Layers, MessageSquare, Wifi,
  TrendingUp, Accessibility, Leaf
} from "lucide-react";

const iconMap = {
  Code, Smartphone, Palette, Search, ShoppingCart, Database,
  Cloud, Shield, Zap, Headphones, Globe, BarChart, 
  Camera, Megaphone, Users, Cog, Rocket, Brain,
  Mail, Video, FileText, Monitor, Cpu, Lock,
  Eye, Link, Mic, Layers, MessageSquare, Wifi,
  TrendingUp, Accessibility, Leaf
};

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price: number | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  button_text: string;
  service_url: string | null;
  created_at: string;
  updated_at: string;
}

export const Services = () => {
  const { ref, isVisible } = useScrollAnimation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['service-items'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('service_items')
          .select('*')
          .eq('active', true)
          .order('sort_order', { ascending: true });
        
        if (error) {
          console.error('Error fetching services:', error);
          return [];
        }
        
        return data as ServiceItem[] || [];
      } catch (err) {
        console.error('Service fetch error:', err);
        return [];
      }
    },
    retry: 3,
    retryDelay: 1000
  });

  console.log('Services component rendered with:', { servicesCount: services.length, theme, isLoading, error });

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  // Fallback services if database is empty or fails
  const fallbackServices = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Moderne Websites und Web-Anwendungen',
      icon: 'Globe',
      category: 'Development',
      price: 500,
      active: true,
      featured: false,
      sort_order: 1,
      button_text: 'Mehr erfahren',
      service_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Apps',
      description: 'Native und Cross-Platform Apps',
      icon: 'Smartphone',
      category: 'Development',
      price: 800,
      active: true,
      featured: false,
      sort_order: 2,
      button_text: 'Mehr erfahren',
      service_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'design',
      title: 'UI/UX Design',
      description: 'Benutzerfreundliche Designs',
      icon: 'Palette',
      category: 'Design',
      price: 300,
      active: true,
      featured: false,
      sort_order: 3,
      button_text: 'Mehr erfahren',
      service_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayServices = services.length > 0 ? services : fallbackServices;

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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: 'hsl(var(--theme-primary))' }}
            ></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayServices.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || iconMap.Code;
              return (
                <div 
                  key={service.id}
                  className={`modern-card rounded-2xl p-8 hover-lift scroll-reveal cursor-pointer ${isVisible ? 'revealed' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div 
                      className="p-4 rounded-xl border"
                      style={{ 
                        background: 'hsl(var(--theme-primary) / 0.2)',
                        borderColor: 'hsl(var(--theme-primary) / 0.3)'
                      }}
                    >
                      <IconComponent 
                        className="h-8 w-8"
                        style={{ color: 'hsl(var(--theme-primary))' }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                    {service.price && (
                      <div 
                        className="text-lg font-semibold"
                        style={{ color: 'hsl(var(--theme-primary))' }}
                      >
                        ab {service.price}€
                      </div>
                    )}
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service.id);
                      }}
                      className="w-full text-white border-0"
                      style={{ 
                        background: `linear-gradient(to right, hsl(var(--theme-primary)), hsl(var(--theme-secondary)))`,
                      }}
                    >
                      {service.button_text}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && services.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">Services werden geladen oder sind temporär nicht verfügbar.</p>
          </div>
        )}
      </div>
    </section>
  );
};
