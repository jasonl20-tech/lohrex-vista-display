
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const Hero = () => {
  const { theme } = useTheme();
  
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getThemeAccent = () => {
    const themeColors = {
      red: 'text-red-400',
      silver: 'text-gray-600',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      orange: 'text-orange-400',
      pink: 'text-pink-400',
      cyan: 'text-cyan-400',
      amber: 'text-amber-400',
      emerald: 'text-emerald-400',
      indigo: 'text-indigo-400',
      rose: 'text-rose-400',
      teal: 'text-teal-400',
      violet: 'text-violet-400',
      lime: 'text-lime-400',
      slate: 'text-slate-400',
      fuchsia: 'text-fuchsia-400',
      yellow: 'text-yellow-400',
      sky: 'text-sky-400',
      emeraldDark: 'text-emerald-400',
      crimson: 'text-red-400',
      midnight: 'text-gray-400'
    };
    return themeColors[theme] || 'text-red-400';
  };

  const getThemeButtonStyles = () => {
    const themeStyles = {
      red: 'border-red-500/50 bg-black/80 text-white hover:bg-red-500/20 hover:border-red-400',
      silver: 'border-gray-400/50 bg-white/20 text-white hover:bg-gray-400/20 hover:border-gray-300',
      blue: 'border-blue-500/50 bg-black/80 text-white hover:bg-blue-500/20 hover:border-blue-400',
      purple: 'border-purple-500/50 bg-black/80 text-white hover:bg-purple-500/20 hover:border-purple-400',
      green: 'border-green-500/50 bg-black/80 text-white hover:bg-green-500/20 hover:border-green-400',
      orange: 'border-orange-500/50 bg-black/80 text-white hover:bg-orange-500/20 hover:border-orange-400',
      pink: 'border-pink-500/50 bg-black/80 text-white hover:bg-pink-500/20 hover:border-pink-400',
      cyan: 'border-cyan-500/50 bg-black/80 text-white hover:bg-cyan-500/20 hover:border-cyan-400',
      amber: 'border-amber-500/50 bg-black/80 text-white hover:bg-amber-500/20 hover:border-amber-400',
      emerald: 'border-emerald-500/50 bg-black/80 text-white hover:bg-emerald-500/20 hover:border-emerald-400',
      indigo: 'border-indigo-500/50 bg-black/80 text-white hover:bg-indigo-500/20 hover:border-indigo-400',
      rose: 'border-rose-500/50 bg-black/80 text-white hover:bg-rose-500/20 hover:border-rose-400',
      teal: 'border-teal-500/50 bg-black/80 text-white hover:bg-teal-500/20 hover:border-teal-400',
      violet: 'border-violet-500/50 bg-black/80 text-white hover:bg-violet-500/20 hover:border-violet-400',
      lime: 'border-lime-500/50 bg-black/80 text-white hover:bg-lime-500/20 hover:border-lime-400',
      slate: 'border-slate-400/50 bg-black/80 text-white hover:bg-slate-400/20 hover:border-slate-300',
      fuchsia: 'border-fuchsia-500/50 bg-black/80 text-white hover:bg-fuchsia-500/20 hover:border-fuchsia-400',
      yellow: 'border-yellow-500/50 bg-black/80 text-white hover:bg-yellow-500/20 hover:border-yellow-400',
      sky: 'border-sky-500/50 bg-black/80 text-white hover:bg-sky-500/20 hover:border-sky-400',
      emeraldDark: 'border-emerald-500/50 bg-black/80 text-white hover:bg-emerald-500/20 hover:border-emerald-400',
      crimson: 'border-red-500/50 bg-black/80 text-white hover:bg-red-500/20 hover:border-red-400',
      midnight: 'border-gray-400/50 bg-black/80 text-white hover:bg-gray-400/20 hover:border-gray-300'
    };
    return themeStyles[theme] || 'border-red-500/50 bg-black/80 text-white hover:bg-red-500/20 hover:border-red-400';
  };

  return (
    <section id="home" className="relative pt-16 min-h-screen flex items-center overflow-hidden">
      {/* Modern Lava-Style Animated Background */}
      <div className="absolute inset-0 modern-lava-gradient opacity-90"></div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Floating geometric shapes with theme colors */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-10 w-32 h-32 border border-current opacity-20 rounded-full animate-pulse-slow ${getThemeAccent()}`}></div>
        <div className={`absolute top-40 right-20 w-24 h-24 border border-current opacity-30 rounded-lg rotate-45 animate-spin-slow ${getThemeAccent()}`}></div>
        <div className={`absolute bottom-32 left-1/4 w-16 h-16 bg-current opacity-20 rounded-full animate-bounce-slow ${getThemeAccent()}`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-3 modern-badge px-6 py-3 rounded-full text-sm font-medium">
              <Sparkles size={18} className={`animate-pulse ${getThemeAccent()}`} />
              <span className={`font-semibold ${getThemeAccent()}`}>Digitale Innovation & Exzellenz</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fade-in-up leading-tight" style={{ animationDelay: '0.2s' }}>
            <span className="modern-lava-text">Lohrex</span>
            <br />
            <span className="text-foreground font-light">Projekte</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.4s' }}>
            Wir schaffen innovative digitale Erlebnisse mit modernster Technologie, 
            kreativem Design und einer Vision für die Zukunft. Entdecken Sie unsere 
            außergewöhnlichen Lösungen.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={scrollToProjects}
              className="modern-button text-white px-10 py-4 text-lg font-semibold group shadow-2xl"
            >
              Projekte entdecken
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-all duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className={`px-10 py-4 text-lg font-semibold shadow-xl backdrop-blur-sm transition-all duration-300 ${getThemeButtonStyles()}`}
            >
              Kontakt aufnehmen
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
