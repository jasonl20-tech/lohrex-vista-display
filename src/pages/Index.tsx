
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { WebDevelopment } from "@/components/WebDevelopment";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

const Index = () => {
  const { theme, isLoading } = useTheme();

  useEffect(() => {
    console.log('Homepage loaded with theme:', theme);
  }, [theme]);

  // Show loading spinner while theme is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <WebDevelopment />
      <Services />
      <Projects />
      <Testimonials />
      <About />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Index;
