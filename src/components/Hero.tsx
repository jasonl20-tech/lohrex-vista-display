
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
      {/* Lava-Style Animated Background */}
      <div className="absolute inset-0 lava-gradient opacity-80"></div>
      
      {/* Animated Background with darker overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2) contrast(1.5)'
        }}
      ></div>

      {/* Parallax Particles with red glow */}
      <div className="absolute inset-0 parallax">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full opacity-70 animate-pulse glow-red"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
              boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)'
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <div className="flex items-center space-x-2 bg-black/80 backdrop-blur-sm text-red-400 px-4 py-2 rounded-full text-sm font-medium border border-red-500/30 glow-red-soft">
              <Sparkles size={16} className="animate-pulse" />
              <span>Innovation & Exzellenz</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="lava-text-gradient">Lohrex</span>
            <br />
            <span className="text-white">Projekte</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Wir realisieren innovative Projekte mit modernster Technologie und 
            kreativem Design. Entdecken Sie unsere vielfältigen Lösungen.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={scrollToProjects}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-medium group hover-lift lava-pulse"
            >
              Projekte entdecken
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 text-lg font-medium border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white hover-lift bg-transparent backdrop-blur-sm"
            >
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
