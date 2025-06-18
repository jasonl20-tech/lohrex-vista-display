
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, HardDrive, Send, Upload, StickyNote, Search, BookOpen, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionCardsProps {
  navigateToSection: (tabName: string) => void;
  setupFirstAdmin: () => void;
}

export const QuickActionCards = ({ navigateToSection, setupFirstAdmin }: QuickActionCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('tasks')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Calendar className="w-5 h-5 mr-2 text-red-400" />
            Aufgaben
          </CardTitle>
          <CardDescription className="text-gray-400">
            Aufgabenverwaltung und Terminplanung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Aufgaben verwalten
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('backups')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <HardDrive className="w-5 h-5 mr-2 text-red-400" />
            Backups
          </CardTitle>
          <CardDescription className="text-gray-400">
            Datensicherung und Wiederherstellung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Backup erstellen
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('newsletter')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Send className="w-5 h-5 mr-2 text-red-400" />
            Newsletter
          </CardTitle>
          <CardDescription className="text-gray-400">
            E-Mail Marketing und Newsletter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Newsletter senden
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('files')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Upload className="w-5 h-5 mr-2 text-red-400" />
            Dateien
          </CardTitle>
          <CardDescription className="text-gray-400">
            Datei-Management und Upload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Dateien verwalten
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('notes')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <StickyNote className="w-5 h-5 mr-2 text-red-400" />
            Notizen
          </CardTitle>
          <CardDescription className="text-gray-400">
            Admin-Notizen und Kommentare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Notizen erstellen
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => toast.info('SEO Tools werden bald verfügbar sein')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Search className="w-5 h-5 mr-2 text-red-400" />
            SEO Tools
          </CardTitle>
          <CardDescription className="text-gray-400">
            Suchmaschinenoptimierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            SEO optimieren
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift cursor-pointer" onClick={() => navigateToSection('logs')}>
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <BookOpen className="w-5 h-5 mr-2 text-red-400" />
            System Logs
          </CardTitle>
          <CardDescription className="text-gray-400">
            System-Protokolle einsehen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20">
            Logs anzeigen
          </Button>
        </CardContent>
      </Card>

      <Card className="modern-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Shield className="w-5 h-5 mr-2 text-red-400" />
            Admin Setup
          </CardTitle>
          <CardDescription className="text-gray-400">
            Admin-Berechtigung einrichten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full modern-button bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            onClick={setupFirstAdmin}
          >
            Admin einrichten
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
