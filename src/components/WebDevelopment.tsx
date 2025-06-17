
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Globe, Zap, Shield, Palette, Code, Database, Rocket, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const webServices = [
  {
    icon: Monitor,
    title: "Responsive Design",
    description: "Perfekte Darstellung auf allen Geräten - von Desktop bis Mobile."
  },
  {
    icon: Code,
    title: "Frontend Development",
    description: "React, Vue, Angular - moderne Frameworks für beste Performance."
  },
  {
    icon: Database,
    title: "Backend Solutions",
    description: "Skalierbare APIs und Datenbank-Architekturen für Ihre Anwendung."
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Blitzschnelle Ladezeiten und optimierte User Experience."
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Höchste Sicherheitsstandards und DSGVO-konforme Entwicklung."
  },
  {
    icon: Users,
    title: "UX/UI Design",
    description: "Intuitive Benutzerführung und ästhetisches Design."
  }
];

const technologies = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker"
];

export const WebDevelopment = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: techRef, isVisible: techVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <section id="webdevelopment" className="py-24 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-700 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-20 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <div className="inline-block px-6 py-2 bg-red-900/30 rounded-full border border-red-500/30 mb-6">
            <span className="text-red-300 font-semibold">Web Development</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="modern-lava-text">Digitale</span>
            <br />
            <span className="text-white font-light">Lösungen</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Von der Vision zur Realität - wir entwickeln maßgeschneiderte Web-Anwendungen, 
            die Ihre Geschäftsziele erreichen und Ihre Nutzer begeistern.
          </p>
        </div>

        <div ref={servicesRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 scroll-reveal ${servicesVisible ? 'revealed' : ''}`}>
          {webServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className="modern-card hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30 group-hover:border-red-400/50 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-red-400 group-hover:text-red-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={techRef} className={`text-center mb-16 scroll-reveal ${techVisible ? 'revealed' : ''}`}>
          <h3 className="text-2xl font-bold text-white mb-8">Unsere Technologien</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-lg rounded-full text-gray-200 border border-gray-600/30 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div ref={ctaRef} className={`glass-effect rounded-3xl p-12 border border-red-500/20 hover:border-red-500/40 transition-all duration-500 scroll-reveal ${ctaVisible ? 'revealed' : ''}`}>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              Bereit für Ihr nächstes Projekt?
            </h3>
            <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-light">
              Lassen Sie uns gemeinsam eine außergewöhnliche digitale Erfahrung schaffen, 
              die Ihre Nutzer begeistert und Ihr Unternehmen voranbringt.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl font-semibold modern-button shadow-2xl"
              >
                Projekt starten
              </button>
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-red-500/60 text-red-300 hover:bg-red-600/20 hover:border-red-400 px-10 py-4 rounded-xl font-semibold modern-button-outline"
              >
                Portfolio ansehen
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
