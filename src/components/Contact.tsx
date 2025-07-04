
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useContactSettings } from "@/hooks/useContactSettings";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { contactData, loading } = useContactSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message
        }]);

      if (error) throw error;

      toast.success("Nachricht gesendet! Vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.");
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      toast.error("Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                  </div>
                ) : (
                  <>
                    {[
                      { icon: Mail, title: "Email", value: contactData.email },
                      { icon: Phone, title: "Telefon", value: contactData.phone },
                      { icon: MapPin, title: "Adresse", value: contactData.address }
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
                      <p className="text-blue-100 text-sm whitespace-pre-line">
                        {contactData.hours}
                      </p>
                    </div>
                  </>
                )}
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
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium group hover-lift animate-pulse-glow"
                    >
                      {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
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
            <a href="/datenschutz" className="text-blue-400 ml-1 hover:text-blue-300 cursor-pointer">Datenschutz</a> | 
            <a href="/impressum" className="text-blue-400 ml-1 hover:text-blue-300 cursor-pointer">Impressum</a>
          </p>
        </div>
      </div>
    </section>
  );
};
