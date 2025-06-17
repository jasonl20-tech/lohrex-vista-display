
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Megaphone, BarChart3, Smartphone, Cloud, Lock, Lightbulb, Target, Zap, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Brain,
    title: "KI & Machine Learning",
    description: "Intelligente Automatisierung und datengetriebene Entscheidungen für Ihr Unternehmen.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "SEO, Social Media Marketing und Performance-Kampagnen für maximale Reichweite.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BarChart3,
    title: "Analytics & BI",
    description: "Umfassende Datenanalyse und Business Intelligence für strategische Entscheidungen.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Native und Cross-Platform Apps für iOS und Android mit perfekter User Experience.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Skalierbare Cloud-Infrastrukturen und Migration bestehender Systeme.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Lock,
    title: "Cybersecurity",
    description: "Umfassende Sicherheitslösungen zum Schutz Ihrer digitalen Assets.",
    color: "from-red-500 to-pink-500"
  }
];

const additionalIdeas = [
  {
    icon: Lightbulb,
    title: "Innovation Lab",
    description: "Experimentelle Technologien und Prototyping für zukunftsweisende Lösungen."
  },
  {
    icon: Target,
    title: "Strategie & Beratung",
    description: "Digitale Transformation und strategische Technologie-Beratung."
  },
  {
    icon: Zap,
    title: "Automation",
    description: "Prozessoptimierung durch intelligente Automatisierungslösungen."
  },
  {
    icon: Heart,
    title: "User Experience",
    description: "Nutzerzentrierte Designs, die Emotionen wecken und begeistern."
  }
];

export const Services = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: ideasRef, isVisible: ideasVisible } = useScrollAnimation();

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900/30 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-20 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-red-900/30 to-purple-900/30 rounded-full border border-red-500/30 mb-6">
            <span className="text-red-300 font-semibold">Unsere Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="modern-lava-text">Vollservice</span>
            <br />
            <span className="text-white font-light">Digitalagentur</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Von der ersten Idee bis zur erfolgreichen Umsetzung - wir bieten das komplette 
            Spektrum digitaler Dienstleistungen aus einer Hand.
          </p>
        </div>

        <div ref={servicesRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 scroll-reveal ${servicesVisible ? 'revealed' : ''}`}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className="modern-card hover-lift group overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-8 pb-6 text-center relative">
                  <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    {service.description}
                  </p>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-all duration-500`}></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={ideasRef} className={`scroll-reveal ${ideasVisible ? 'revealed' : ''}`}>
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Weitere <span className="modern-lava-text">Innovationen</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalIdeas.map((idea, index) => {
              const IconComponent = idea.icon;
              return (
                <div 
                  key={index}
                  className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{idea.title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{idea.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
