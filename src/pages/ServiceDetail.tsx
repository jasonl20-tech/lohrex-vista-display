
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const serviceDetails = {
    'webdesign': {
      title: 'Webdesign',
      description: 'Moderne und ansprechende Website-Designs, die Ihre Marke perfekt repräsentieren.',
      features: ['Responsive Design', 'UX/UI Optimierung', 'Markenkonformität', 'Performance-optimiert'],
      price: 'ab 2.500€',
      duration: '2-4 Wochen'
    },
    'webentwicklung': {
      title: 'Webentwicklung',
      description: 'Professionelle Website-Entwicklung mit modernsten Technologien.',
      features: ['React/Next.js', 'TypeScript', 'SEO-optimiert', 'Skalierbar'],
      price: 'ab 3.500€',
      duration: '3-6 Wochen'
    },
    'app-entwicklung': {
      title: 'App-Entwicklung',
      description: 'Native und Cross-Platform Apps für iOS und Android.',
      features: ['React Native', 'Native Performance', 'App Store Optimierung', 'Backend Integration'],
      price: 'ab 8.000€',
      duration: '8-12 Wochen'
    },
    'seo': {
      title: 'SEO Optimierung',
      description: 'Verbessern Sie Ihre Sichtbarkeit in Suchmaschinen.',
      features: ['Keyword-Analyse', 'On-Page SEO', 'Technical SEO', 'Content-Optimierung'],
      price: 'ab 1.500€/Monat',
      duration: 'Laufend'
    },
    'e-commerce': {
      title: 'E-Commerce',
      description: 'Vollständige Online-Shop Lösungen für Ihr Business.',
      features: ['Payment Integration', 'Inventory Management', 'Mobile Shopping', 'Analytics'],
      price: 'ab 5.000€',
      duration: '4-8 Wochen'
    },
    'datenbank': {
      title: 'Datenbank-Design',
      description: 'Effiziente und skalierbare Datenbanklösungen.',
      features: ['PostgreSQL/MySQL', 'Datenmodellierung', 'Performance-Optimierung', 'Backup-Strategien'],
      price: 'ab 2.000€',
      duration: '2-3 Wochen'
    },
    'cloud-services': {
      title: 'Cloud Services',
      description: 'Migration und Management von Cloud-Infrastrukturen.',
      features: ['AWS/Azure/GCP', 'Containerisierung', 'Auto-Scaling', 'Monitoring'],
      price: 'ab 3.000€',
      duration: '3-5 Wochen'
    },
    'cybersecurity': {
      title: 'Cybersecurity',
      description: 'Umfassende Sicherheitslösungen für Ihr Unternehmen.',
      features: ['Security Audit', 'Penetration Testing', 'SSL/TLS', 'GDPR Compliance'],
      price: 'ab 4.000€',
      duration: '2-4 Wochen'
    },
    'performance': {
      title: 'Performance-Optimierung',
      description: 'Maximieren Sie die Geschwindigkeit Ihrer Website.',
      features: ['Core Web Vitals', 'Image Optimization', 'Caching', 'CDN Setup'],
      price: 'ab 1.800€',
      duration: '1-2 Wochen'
    },
    'support': {
      title: 'Technical Support',
      description: '24/7 technischer Support für Ihre digitalen Projekte.',
      features: ['24/7 Verfügbarkeit', 'Incident Management', 'Monitoring', 'Updates'],
      price: 'ab 500€/Monat',
      duration: 'Laufend'
    },
    'hosting': {
      title: 'Web Hosting',
      description: 'Zuverlässige und sichere Hosting-Lösungen.',
      features: ['99.9% Uptime', 'SSL Zertifikate', 'Daily Backups', 'German Servers'],
      price: 'ab 50€/Monat',
      duration: 'Laufend'
    },
    'analytics': {
      title: 'Web Analytics',
      description: 'Datengetriebene Insights für Ihr Business.',
      features: ['Google Analytics', 'Custom Dashboards', 'Conversion Tracking', 'Reports'],
      price: 'ab 800€',
      duration: '1-2 Wochen'
    },
    'fotografie': {
      title: 'Web-Fotografie',
      description: 'Professionelle Produktfotografie für Websites.',
      features: ['Produktfotografie', 'Lifestyle Shots', 'Bildbearbeitung', 'Web-Optimierung'],
      price: 'ab 1.200€',
      duration: '1 Woche'
    },
    'marketing': {
      title: 'Digital Marketing',
      description: 'Strategisches Online-Marketing für mehr Reichweite.',
      features: ['Google Ads', 'Social Media Marketing', 'Content Marketing', 'Email Campaigns'],
      price: 'ab 2.000€/Monat',
      duration: 'Laufend'
    },
    'social-media': {
      title: 'Social Media',
      description: 'Professionelles Social Media Management.',
      features: ['Content Creation', 'Community Management', 'Social Media Strategy', 'Analytics'],
      price: 'ab 1.500€/Monat',
      duration: 'Laufend'
    },
    'wartung': {
      title: 'Website-Wartung',
      description: 'Regelmäßige Updates und Pflege Ihrer Website.',
      features: ['Security Updates', 'Content Updates', 'Performance Monitoring', 'Backup Service'],
      price: 'ab 300€/Monat',
      duration: 'Laufend'
    },
    'startup': {
      title: 'Startup-Lösungen',
      description: 'Komplettlösungen für Startups und junge Unternehmen.',
      features: ['MVP Development', 'Branding', 'Go-to-Market Strategy', 'Scaling Solutions'],
      price: 'ab 10.000€',
      duration: '6-12 Wochen'
    },
    'ki-integration': {
      title: 'KI-Integration',
      description: 'Integration von künstlicher Intelligenz in Ihre Systeme.',
      features: ['Machine Learning', 'Chatbots', 'Automation', 'Data Analysis'],
      price: 'ab 6.000€',
      duration: '4-8 Wochen'
    },
    'email-marketing': {
      title: 'E-Mail Marketing',
      description: 'Professionelle E-Mail-Marketing-Kampagnen.',
      features: ['Newsletter Design', 'Automation', 'A/B Testing', 'Analytics'],
      price: 'ab 800€/Monat',
      duration: 'Laufend'
    },
    'video-content': {
      title: 'Video Content',
      description: 'Professionelle Videoproduktion für Web und Social Media.',
      features: ['Konzeption', 'Produktion', 'Post-Production', 'Web-Optimierung'],
      price: 'ab 3.000€',
      duration: '2-4 Wochen'
    },
    'content-management': {
      title: 'Content Management',
      description: 'CMS-Lösungen und Content-Strategien.',
      features: ['WordPress/Headless CMS', 'Content Strategy', 'SEO Content', 'Migration'],
      price: 'ab 2.500€',
      duration: '2-3 Wochen'
    },
    'responsive-design': {
      title: 'Responsive Design',
      description: 'Mobile-optimierte Websites für alle Geräte.',
      features: ['Mobile-First Design', 'Cross-Browser Testing', 'Touch Optimization', 'Progressive Web Apps'],
      price: 'ab 2.000€',
      duration: '2-3 Wochen'
    },
    'api-entwicklung': {
      title: 'API-Entwicklung',
      description: 'Entwicklung von RESTful APIs und Microservices.',
      features: ['REST/GraphQL APIs', 'Microservices', 'API Documentation', 'Rate Limiting'],
      price: 'ab 4.000€',
      duration: '3-5 Wochen'
    },
    'ssl-sicherheit': {
      title: 'SSL & Sicherheit',
      description: 'Verschlüsselung und Sicherheitsmaßnahmen für Websites.',
      features: ['SSL Zertifikate', 'Security Headers', 'Firewall Setup', 'Vulnerability Scanning'],
      price: 'ab 800€',
      duration: '1 Woche'
    }
  };

  const service = serviceDetails[serviceId as keyof typeof serviceDetails];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Button 
          onClick={() => navigate('/')} 
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
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Leistungen im Detail</h3>
              <ul className="space-y-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Investition</h4>
                <p className="text-3xl font-black text-red-400">{service.price}</p>
              </div>

              <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-xl font-bold text-white mb-2">Projektdauer</h4>
                <p className="text-xl font-semibold text-red-400">{service.duration}</p>
              </div>
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
                onClick={() => navigate('/#contact')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg modern-button"
              >
                Projekt starten
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/#contact')}
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
