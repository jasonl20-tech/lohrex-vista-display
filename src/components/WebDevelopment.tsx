
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Globe, Zap, Shield, Palette } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const webServices = [
  {
    icon: Monitor,
    title: "Responsive Webdesign",
    description: "Moderne, benutzerfreundliche Websites die auf allen Geräten perfekt funktionieren."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Entwicklung",
    description: "Optimiert für mobile Endgeräte mit schnellen Ladezeiten und intuitivem Design."
  },
  {
    icon: Globe,
    title: "Web-Anwendungen",
    description: "Komplexe Webanwendungen mit modernsten Technologien und Frameworks."
  },
  {
    icon: Zap,
    title: "Performance-Optimierung",
    description: "Blitzschnelle Ladezeiten und optimale SEO-Performance für bessere Rankings."
  },
  {
    icon: Shield,
    title: "Sichere Entwicklung",
    description: "Höchste Sicherheitsstandards und DSGVO-konforme Umsetzung."
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Individuelle Designs die Ihre Marke perfekt repräsentieren."
  }
];

export const WebDevelopment = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="webdevelopment" className="py-20 bg-black relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 lava-gradient opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="lava-text-gradient">Web</span>entwicklung
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Von der ersten Idee bis zur fertigen Website - wir entwickeln 
            maßgeschneiderte Weblösungen, die Ihre Ziele erreichen und Ihre 
            Besucher begeistern.
          </p>
        </div>

        <div ref={servicesRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 scroll-reveal ${servicesVisible ? 'revealed' : ''}`}>
          {webServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className="border border-gray-800 hover-lift glow-red-hover transition-all duration-300 bg-gray-900/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30 glow-red-soft">
                    <IconComponent className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-center">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={ctaRef} className={`bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-12 glow-red-soft scroll-reveal ${ctaVisible ? 'revealed' : ''}`}>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              Bereit für Ihre neue Website?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Lassen Sie uns gemeinsam Ihre Vision in eine beeindruckende 
              Web-Präsenz verwandeln. Kontaktieren Sie uns für ein 
              unverbindliches Beratungsgespräch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium hover-lift lava-pulse transition-all duration-300"
              >
                Jetzt Kontakt aufnehmen
              </button>
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg font-medium hover-lift bg-transparent backdrop-blur-sm transition-all duration-300"
              >
                Projekte ansehen
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
