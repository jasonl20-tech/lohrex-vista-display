import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Smartphone, Palette, Database, Shield, Cloud, Code, Monitor, Cpu, Camera, Rocket, Heart, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const iconMap = {
  'Web Development': Globe,
  'Mobile App Development': Smartphone,
  'UI/UX Design': Palette,
  'Data Solutions': Database,
  'Cybersecurity': Shield,
  'Cloud Services': Cloud,
  'Software Development': Code,
  Monitor,
  Cpu,
  Camera,
  Rocket,
  Heart,
  Code,
  Globe: Globe,
  Smartphone: Smartphone,
  default: Code
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
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { saveScrollPosition } = useScrollPosition('homepage');

  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }

      return data as ServiceItem[];
    },
    retry: 3,
    retryDelay: 1000
  });

  const fallbackServices: ServiceItem[] = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Moderne Websites und Web-Anwendungen mit neuesten Technologien',
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
      description: 'Native und Cross-Platform Apps für iOS und Android',
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
      description: 'Benutzerfreundliche Designs und optimale User Experience',
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

  const handleServiceClick = (serviceId: string) => {
    // Save current scroll position before navigating
    saveScrollPosition();
    navigate(`/service/${serviceId}`);
  };

  const handleButtonClick = (service: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (service.service_url && service.service_url !== '#') {
      window.open(service.service_url, '_blank');
    } else {
      handleServiceClick(service.id);
    }
  };

  const displayServices = services.length > 0 ? services : fallbackServices;

  return (
    <section id="webdevelopment" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Unsere <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Wir bieten ein breites Spektrum an Dienstleistungen, um Ihre Visionen zu verwirklichen.
          </p>
        </div>

        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-reveal ${gridVisible ? 'revealed' : ''}`}>
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
              <p className="text-gray-400">Services werden geladen...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-400">Fehler beim Laden der Services: {error.message}</p>
            </div>
          ) : displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || iconMap[service.category as keyof typeof iconMap] || iconMap.default;

            return (
              <Card
                key={service.id}
                className="group hover-lift transition-all duration-300 border border-gray-800 bg-gray-900/50 backdrop-blur-sm cursor-pointer hover:shadow-lg"
                style={{
                  animationDelay: `${index * 100}ms`,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'hsl(var(--theme-primary) / 0.5)';
                  e.currentTarget.style.boxShadow = `0 20px 40px hsl(var(--theme-primary) / 0.2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => handleServiceClick(service.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg border border-gray-600"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <IconComponent
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    <CardTitle
                      className="text-xl font-bold text-white group-hover:transition-colors"
                      style={{
                        '--hover-color': 'hsl(var(--theme-primary))'
                      } as React.CSSProperties}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'hsl(var(--theme-primary))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                    {service.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    {service.price && (
                      <Badge variant="outline">
                        ab {service.price}€
                      </Badge>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => handleButtonClick(service, e)}
                      className="modern-button-secondary"
                    >
                      {service.button_text || 'Mehr erfahren'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
