
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Kontaktformular abgesendet:', formData);
    
    toast({
      title: "Nachricht gesendet!",
      description: "Vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.",
    });
    
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Kontakt <span className="text-gradient">aufnehmen</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Haben Sie ein spannendes Projekt im Kopf? Lassen Sie uns darüber sprechen 
            und gemeinsam die beste Lösung entwickeln.
          </p>
        </div>

        <div ref={contentRef} className={`grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-reveal ${contentVisible ? 'revealed' : ''}`}>
          {/* Kontakt-Informationen */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-gray-800 bg-gradient-to-br from-blue-900 to-purple-900 text-white hover-glow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Sprechen wir miteinander
                </CardTitle>
                <p className="text-blue-100">
                  Wir freuen uns auf Ihr Projekt und stehen Ihnen gerne zur Verfügung.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { icon: Mail, title: "Email", value: "kontakt@lohrex.de" },
                  { icon: Phone, title: "Telefon", value: "+49 (0) 123 456 789" },
                  { icon: MapPin, title: "Adresse", value: "Musterstraße 123\n12345 Musterstadt" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="bg-blue-600/30 p-3 rounded-lg border border-blue-400/30">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-blue-100 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-blue-500/30">
                  <h4 className="font-semibold mb-2">Geschäftszeiten</h4>
                  <p className="text-blue-100 text-sm">
                    Montag - Freitag: 9:00 - 18:00<br />
                    Samstag: 10:00 - 14:00
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kontakt-Formular */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover-glow">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Projekt besprechen
                </CardTitle>
                <p className="text-gray-300">
                  Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ihr vollständiger Name"
                        className="border-gray-700 bg-gray-800/50 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ihre.email@beispiel.de"
                        className="border-gray-700 bg-gray-800/50 text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Nachricht *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."
                      rows={6}
                      className="border-gray-700 bg-gray-800/50 text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium group hover-lift animate-pulse-glow"
                    >
                      Nachricht senden
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © 2024 Lohrex. Alle Rechte vorbehalten. | 
            <span className="text-blue-400 ml-1 hover:text-blue-300 cursor-pointer">Datenschutz</span> | 
            <span className="text-blue-400 ml-1 hover:text-blue-300 cursor-pointer">Impressum</span>
          </p>
        </div>
      </div>
    </section>
  );
};
