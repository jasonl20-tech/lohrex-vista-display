
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb, Award } from "lucide-react";

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
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Über <span className="text-blue-600">Lohrex</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Seit Jahren entwickeln wir innovative Softwarelösungen und digitale Produkte. 
            Unser Fokus liegt auf qualitativ hochwertigen, maßgeschneiderten Lösungen, 
            die echten Mehrwert schaffen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Warum Lohrex wählen?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Umfassende Expertise:</strong> Von Frontend bis Backend, 
                    von Mobile Apps bis Cloud-Infrastruktur.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Agile Entwicklung:</strong> Schnelle Prototypen, 
                    iterative Verbesserungen und enge Zusammenarbeit.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Langfristige Partnerschaft:</strong> Support und 
                    Weiterentwicklung auch nach Projektabschluss.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white">
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
