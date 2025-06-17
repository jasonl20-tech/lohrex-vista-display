
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

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
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kontakt <span className="text-blue-600">aufnehmen</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Haben Sie ein spannendes Projekt im Kopf? Lassen Sie uns darüber sprechen 
            und gemeinsam die beste Lösung entwickeln.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kontakt-Informationen */}
          <div className="lg:col-span-1">
            <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Sprechen wir miteinander
                </CardTitle>
                <p className="text-blue-100">
                  Wir freuen uns auf Ihr Projekt und stehen Ihnen gerne zur Verfügung.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-blue-100">kontakt@lohrex.de</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Telefon</h4>
                    <p className="text-blue-100">+49 (0) 123 456 789</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Adresse</h4>
                    <p className="text-blue-100">
                      Musterstraße 123<br />
                      12345 Musterstadt
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-blue-500">
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Projekt besprechen
                </CardTitle>
                <p className="text-gray-600">
                  Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium group"
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
        <div className="mt-20 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © 2024 Lohrex. Alle Rechte vorbehalten. | 
            <span className="text-blue-600 ml-1">Datenschutz</span> | 
            <span className="text-blue-600 ml-1">Impressum</span>
          </p>
        </div>
      </div>
    </section>
  );
};
