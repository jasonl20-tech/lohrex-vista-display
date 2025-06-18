
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAutoCarousel } from "@/hooks/useAutoCarousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Weber",
    company: "TechStart GmbH",
    role: "CEO",
    text: "Lohrex hat unsere Vision perfekt umgesetzt. Die Zusammenarbeit war professionell und das Ergebnis übertrifft unsere Erwartungen.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Michael Schmidt",
    company: "Digital Solutions AG",
    role: "CTO",
    text: "Innovative Lösungen und exzellente technische Umsetzung. Lohrex versteht es, komplexe Anforderungen elegant zu lösen.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Lisa Müller",
    company: "CreativeHub",
    role: "Marketing Director",
    text: "Das Design ist atemberaubend und die Performance hervorragend. Unsere Conversion-Rate hat sich verdoppelt!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Thomas Fischer",
    company: "E-Commerce Pro",
    role: "Founder",
    text: "Der Support ist außergewöhnlich und die Lösungen sind maßgeschneidert. Wir haben unsere Ziele schneller erreicht als erwartet.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Anna Becker",
    company: "StartupLab",
    role: "Product Manager",
    text: "Kreative Ansätze und technische Exzellenz in einem. Die Zusammenarbeit mit Lohrex war ein voller Erfolg.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face"
  }
];

export const Testimonials = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();
  const [api, setApi] = useState<CarouselApi>();

  // Use auto-carousel hook
  useAutoCarousel(api, 4000);

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900/20 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-full border border-red-500/30 mb-6">
            <span className="text-red-300 font-semibold">Kundenstimmen</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="text-white font-light">Was unsere</span>
            <br />
            <span className="modern-lava-text">Kunden sagen</span>
          </h2>
        </div>

        <div ref={testimonialsRef} className={`scroll-reveal ${testimonialsVisible ? 'revealed' : ''}`}>
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="modern-card hover-lift group relative overflow-hidden h-full transition-all duration-300"
                  >
                    <CardContent className="pt-8 pb-6 relative z-10 h-full flex flex-col">
                      <div className="absolute top-4 right-4 text-red-500/30 group-hover:text-red-500/50 transition-colors">
                        <Quote size={32} />
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full border-2 border-red-500/30 mr-4 transition-all duration-300 group-hover:border-red-500/50"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>

                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>

                      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors flex-grow">
                        "{testimonial.text}"
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-gray-800/80 border-red-500/30 text-white hover:bg-red-600/20 transition-all duration-300" />
            <CarouselNext className="hidden md:flex -right-12 bg-gray-800/80 border-red-500/30 text-white hover:bg-red-600/20 transition-all duration-300" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
