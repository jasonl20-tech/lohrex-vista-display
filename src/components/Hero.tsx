
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
      {/* Modern Lava-Style Animated Background */}
      <div className="absolute inset-0 modern-lava-gradient opacity-90"></div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 border border-red-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-red-400/30 rounded-lg rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-red-900/20 rounded-full animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-lg text-red-300 px-6 py-3 rounded-full text-sm font-medium border border-red-500/40 glow-red-subtle modern-badge">
              <Sparkles size={18} className="animate-pulse text-red-400" />
              <span className="font-semibold">Digitale Innovation & Exzellenz</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fade-in-up leading-tight" style={{ animationDelay: '0.2s' }}>
            <span className="modern-lava-text">Lohrex</span>
            <br />
            <span className="text-white font-light">Projekte</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.4s' }}>
            Wir schaffen innovative digitale Erlebnisse mit modernster Technologie, 
            kreativem Design und einer Vision für die Zukunft. Entdecken Sie unsere 
            außergewöhnlichen Lösungen.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={scrollToProjects}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 text-lg font-semibold group modern-button shadow-2xl border border-red-500/30"
            >
              Projekte entdecken
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-all duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 text-lg font-semibold border-2 border-red-400/60 text-red-300 hover:bg-red-600/90 hover:text-white hover:border-red-500 modern-button-outline bg-black/40 backdrop-blur-lg shadow-xl"
            >
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
