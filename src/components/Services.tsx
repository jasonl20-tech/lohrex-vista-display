
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['service-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      return data as ServiceItem[];
    }
  });

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    );
  }

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
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || iconMap.Code;
            return (
              <div 
                key={service.id}
                className={`modern-card rounded-2xl p-8 hover-lift scroll-reveal ${isVisible ? 'revealed' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-4 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-xl">
                    <IconComponent className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                  {service.price && (
                    <div className="text-lg font-semibold text-red-400">
                      ab {service.price}€
                    </div>
                  )}
                  <Button 
                    onClick={() => handleServiceClick(service.id)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white modern-button"
                  >
                    {service.button_text}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
