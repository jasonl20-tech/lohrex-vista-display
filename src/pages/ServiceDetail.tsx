import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useEffect } from "react";

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

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restoreScrollPosition } = useScrollPosition('homepage');

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Service ID is required');
      
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Database error:', error);
        // Fallback to hardcoded service if database fails
        return getFallbackService(id);
      }
      
      return data as ServiceItem || getFallbackService(id);
    },
    enabled: !!id
  });

  const getFallbackService = (serviceId: string): ServiceItem | null => {
    const fallbackServices: { [key: string]: ServiceItem } = {
      'web-dev': {
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
      'mobile-dev': {
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
      'design': {
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
    };
    
    return fallbackServices[serviceId] || null;
  };

  // Default features based on category
  const getDefaultFeatures = (category: string, title: string) => {
    const featureMap: { [key: string]: string[] } = {
      'Design': ['Responsive Design', 'UX/UI Optimierung', 'Markenkonformität', 'Performance-optimiert'],
      'Development': ['Moderne Technologien', 'Skalierbare Architektur', 'SEO-optimiert', 'Performance-optimiert'],
      'Marketing': ['Zielgruppenanalyse', 'ROI-optimiert', 'Multi-Channel', 'Analytics & Reporting'],
      'Security': ['Compliance-konform', 'Penetration Testing', 'Kontinuierliches Monitoring', '24/7 Support'],
      'Infrastructure': ['99.9% Uptime', 'Automatisches Backup', 'Skalierbar', 'Monitoring'],
      'AI': ['Machine Learning', 'Datenanalyse', 'Automatisierung', 'Integration'],
      'Support': ['24/7 Verfügbarkeit', 'Schnelle Reaktionszeiten', 'Expertenwissen', 'Proaktive Überwachung'],
      'Media': ['Professionelle Qualität', 'Web-Optimierung', 'Verschiedene Formate', 'Nachbearbeitung']
    };

    return featureMap[category] || ['Professionelle Umsetzung', 'Individuelle Beratung', 'Qualitätsgarantie', 'Support inklusive'];
  };

  const getDefaultDuration = (category: string) => {
    const durationMap: { [key: string]: string } = {
      'Design': '2-4 Wochen',
      'Development': '3-8 Wochen',
      'Marketing': 'Laufend',
      'Security': '2-4 Wochen',
      'Infrastructure': '1-3 Wochen',
      'AI': '4-8 Wochen',
      'Support': 'Laufend',
      'Media': '1-2 Wochen'
    };

    return durationMap[category] || '2-4 Wochen';
  };

  const handleBackClick = () => {
    navigate('/', { replace: false });
    // Restore scroll position immediately after navigation
    setTimeout(() => {
      restoreScrollPosition();
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service nicht gefunden</h1>
          <Button onClick={() => navigate('/')} className="modern-button">
            Zurück zur Startseite
          </Button>
        </div>
      </div>
    );
  }

  const features = getDefaultFeatures(service.category || 'Development', service.title);
  const duration = getDefaultDuration(service.category || 'Development');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Button 
          onClick={handleBackClick}
          variant="outline"
          className="mb-8 modern-button-outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        <div className="modern-card rounded-3xl p-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-6 modern-lava-text">
              {service.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {service.description}
            </p>
            {service.category && (
              <div className="mt-4">
                <span className="inline-block bg-gradient-to-r from-red-600/20 to-red-800/20 border border-red-500/30 rounded-full px-4 py-2 text-red-400 text-sm font-medium">
                  {service.category}
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Leistungen im Detail</h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              {service.price && (
                <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl p-6 border border-red-500/20">
                  <h4 className="text-xl font-bold text-white mb-2">Investition</h4>
                  <p className="text-3xl font-black text-red-400">ab {service.price}€</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Projektdauer</h4>
                <p className="text-xl font-semibold text-red-400">{duration}</p>
              </div>

              {service.featured && (
                <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 rounded-2xl p-6 border border-yellow-500/20">
                  <h4 className="text-xl font-bold text-white mb-2">Featured Service</h4>
                  <p className="text-yellow-400">Besonders empfohlen</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="flex justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-400 text-lg mb-8">
              Über 100 zufriedene Kunden vertrauen bereits auf unsere Expertise
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                size="lg"
                onClick={() => {
                  navigate('/', { replace: false });
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg modern-button"
              >
                Projekt starten
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  navigate('/', { replace: false });
                  setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="px-10 py-4 text-lg modern-button-outline"
              >
                Kostenlose Beratung
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
