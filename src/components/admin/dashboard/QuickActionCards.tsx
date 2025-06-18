
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, BarChart3, FileText, CreditCard, Calendar, 
  HardDrive, Mail, FolderOpen, StickyNote, FileType,
  Settings, Shield, Briefcase, Globe
} from 'lucide-react';

interface QuickActionCardsProps {
  navigateToSection: (tabName: string) => void;
  setupFirstAdmin: () => void;
}

export const QuickActionCards = ({ navigateToSection, setupFirstAdmin }: QuickActionCardsProps) => {
  const quickActions = [
    {
      title: 'Services verwalten',
      description: 'Erstellen und bearbeiten Sie Ihre Website-Services',
      icon: Briefcase,
      action: () => navigateToSection('services'),
      color: 'blue'
    },
    {
      title: 'Projekte verwalten',
      description: 'Verwalten Sie Ihre Portfolio-Projekte',
      icon: Globe,
      action: () => navigateToSection('projects'),
      color: 'green'
    },
    {
      title: 'Benutzer verwalten',
      description: 'Verwalten Sie Benutzerkonten und Rollen',
      icon: Users,
      action: () => navigateToSection('users'),
      color: 'purple'
    },
    {
      title: 'Analytics ansehen',
      description: 'Überprüfen Sie Website-Statistiken und Metriken',
      icon: BarChart3,
      action: () => navigateToSection('analytics'),
      color: 'yellow'
    },
    {
      title: 'Rechnungen erstellen',
      description: 'Erstellen und verwalten Sie Rechnungen',
      icon: FileText,
      action: () => navigateToSection('invoicing'),
      color: 'red'
    },
    {
      title: 'Buchungen verwalten',
      description: 'Verfolgen Sie Transaktionen und Zahlungen',
      icon: CreditCard,
      action: () => navigateToSection('transactions'),
      color: 'indigo'
    },
    {
      title: 'Aufgaben verwalten',
      description: 'Organisieren Sie Ihre To-Do-Liste',
      icon: Calendar,
      action: () => navigateToSection('tasks'),
      color: 'pink'
    },
    {
      title: 'Backup erstellen',
      description: 'Sichern Sie Ihre wichtigen Daten',
      icon: HardDrive,
      action: () => navigateToSection('backups'),
      color: 'gray'
    },
    {
      title: 'Newsletter senden',
      description: 'Verwalten Sie E-Mail-Kampagnen',
      icon: Mail,
      action: () => navigateToSection('newsletter'),
      color: 'cyan'
    },
    {
      title: 'Dateien verwalten',
      description: 'Organisieren Sie Ihre Upload-Dateien',
      icon: FolderOpen,
      action: () => navigateToSection('files'),
      color: 'orange'
    },
    {
      title: 'Notizen erstellen',
      description: 'Verwalten Sie Ihre persönlichen Notizen',
      icon: StickyNote,
      action: () => navigateToSection('notes'),
      color: 'lime'
    },
    {
      title: 'System-Logs',
      description: 'Überprüfen Sie Systemereignisse und Logs',
      icon: FileType,
      action: () => navigateToSection('logs'),
      color: 'slate'
    },
    {
      title: 'Einstellungen',
      description: 'Konfigurieren Sie Website-Einstellungen',
      icon: Settings,
      action: () => navigateToSection('settings'),
      color: 'emerald'
    },
    {
      title: 'Admin-Setup',
      description: 'Richten Sie den ersten Admin ein',
      icon: Shield,
      action: setupFirstAdmin,
      color: 'red'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card key={index} className="modern-card hover-lift cursor-pointer" onClick={action.action}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-${action.color}-900/20 rounded-lg border border-${action.color}-500/30`}>
                  <Icon className={`h-5 w-5 text-${action.color}-400`} />
                </div>
                <CardTitle className="text-lg text-white">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-gray-400 mb-4">
                {action.description}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full border-${action.color}-500/30 text-${action.color}-400 hover:bg-${action.color}-900/20`}
              >
                Öffnen
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
