
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { WebDevelopment } from "@/components/WebDevelopment";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <WebDevelopment />
      <Projects />
      <About />
      <Contact />
    </div>
  );
};

export default Index;
