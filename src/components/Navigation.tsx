
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gradient">Lohrex</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['home', 'projects', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {section === 'home' ? 'Home' : section === 'projects' ? 'Projekte' : section === 'about' ? 'Über uns' : 'Kontakt'}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-blue-400 hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-lg border-t border-gray-800 rounded-b-lg">
              {['home', 'projects', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 text-base font-medium w-full text-left transition-all duration-300 hover:bg-gray-800 rounded"
                >
                  {section === 'home' ? 'Home' : section === 'projects' ? 'Projekte' : section === 'about' ? 'Über uns' : 'Kontakt'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
