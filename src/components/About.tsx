
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: Users,
    title: "Erfahrenes Team",
    description: "Unser Team besteht aus erfahrenen Entwicklern und Designern mit jahrelanger Expertise."
  },
  {
    icon: Target,
    title: "Zielorientiert",
    description: "Wir fokussieren uns auf messbare Ergebnisse und den langfristigen Erfolg unserer Kunden."
  },
  {
    icon: Lightbulb,
    title: "Innovative Lösungen",
    description: "Modernste Technologien und kreative Ansätze für einzigartige Projektumsetzungen."
  },
  {
    icon: Award,
    title: "Qualitätsstandards",
    description: "Höchste Qualitätsansprüche in allen Projektphasen von der Planung bis zur Umsetzung."
  }
];

export const About = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Über <span className="text-gradient">Lohrex</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Seit Jahren entwickeln wir innovative Softwarelösungen und digitale Produkte. 
            Unser Fokus liegt auf qualitativ hochwertigen, maßgeschneiderten Lösungen, 
            die echten Mehrwert schaffen.
          </p>
        </div>

        <div ref={featuresRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 scroll-reveal ${featuresVisible ? 'revealed' : ''}`}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="text-center border border-gray-800 hover-lift hover-glow transition-all duration-300 bg-black/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <IconComponent className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={contentRef} className={`bg-black/70 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 md:p-12 hover-glow scroll-reveal ${contentVisible ? 'revealed' : ''}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Warum Lohrex wählen?
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Umfassende Expertise:",
                    text: "Von Frontend bis Backend, von Mobile Apps bis Cloud-Infrastruktur."
                  },
                  {
                    title: "Agile Entwicklung:",
                    text: "Schnelle Prototypen, iterative Verbesserungen und enge Zusammenarbeit."
                  },
                  {
                    title: "Langfristige Partnerschaft:",
                    text: "Support und Weiterentwicklung auch nach Projektabschluss."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300">
                      <strong className="text-blue-400">{item.title}</strong> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="animated-gradient rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Unsere Mission</h4>
              <p className="text-blue-100 leading-relaxed mb-6">
                Wir glauben daran, dass Technologie das Leben und die Arbeit von Menschen 
                verbessern kann. Deshalb entwickeln wir Lösungen, die nicht nur funktional, 
                sondern auch benutzerfreundlich und zukunftssicher sind.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-blue-200 text-sm">Projekte</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-blue-200 text-sm">Jahre Erfahrung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
