
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, BarChart3, FileText, CreditCard, Calendar, 
  HardDrive, Mail, FolderOpen, StickyNote, FileType,
  Settings, Shield, Briefcase, Globe, Database, Activity
} from 'lucide-react';

interface QuickActionCardsProps {
  navigateToSection: (tabName: string) => void;
  setupFirstAdmin: () => void;
}

export const QuickActionCards = ({ navigateToSection, setupFirstAdmin }: QuickActionCardsProps) => {
  const quickActionsCategories = [
    {
      title: 'Content Management',
      description: 'Verwalten Sie Ihre Website-Inhalte',
      icon: Database,
      color: 'blue',
      actions: [
        {
          title: 'Services',
          description: 'Website-Services verwalten',
          icon: Briefcase,
          action: () => navigateToSection('content'),
          subAction: () => navigateToSection('services')
        },
        {
          title: 'Projekte',
          description: 'Portfolio-Projekte verwalten',
          icon: Globe,
          action: () => navigateToSection('content'),
          subAction: () => navigateToSection('projects')
        },
        {
          title: 'Dateien',
          description: 'Upload-Dateien organisieren',
          icon: FolderOpen,
          action: () => navigateToSection('content'),
          subAction: () => navigateToSection('files')
        },
        {
          title: 'Notizen',
          description: 'Persönliche Notizen verwalten',
          icon: StickyNote,
          action: () => navigateToSection('content'),
          subAction: () => navigateToSection('notes')
        }
      ]
    },
    {
      title: 'Business Management',
      description: 'Geschäftsprozesse und Kunden',
      icon: Activity,
      color: 'green',
      actions: [
        {
          title: 'Benutzer',
          description: 'Benutzerkonten und Rollen',
          icon: Users,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('users')
        },
        {
          title: 'Analytics',
          description: 'Website-Statistiken ansehen',
          icon: BarChart3,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('analytics')
        },
        {
          title: 'Rechnungen',
          description: 'Rechnungen erstellen',
          icon: FileText,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('invoicing')
        },
        {
          title: 'Buchungen',
          description: 'Transaktionen verfolgen',
          icon: CreditCard,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('transactions')
        },
        {
          title: 'Aufgaben',
          description: 'To-Do-Liste organisieren',
          icon: Calendar,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('tasks')
        },
        {
          title: 'Newsletter',
          description: 'E-Mail-Kampagnen verwalten',
          icon: Mail,
          action: () => navigateToSection('business'),
          subAction: () => navigateToSection('newsletter')
        }
      ]
    },
    {
      title: 'System & Settings',
      description: 'Systemverwaltung und Konfiguration',
      icon: Settings,
      color: 'purple',
      actions: [
        {
          title: 'Backups',
          description: 'Daten sichern',
          icon: HardDrive,
          action: () => navigateToSection('system'),
          subAction: () => navigateToSection('backups')
        },
        {
          title: 'System-Logs',
          description: 'Systemereignisse überprüfen',
          icon: FileType,
          action: () => navigateToSection('system'),
          subAction: () => navigateToSection('logs')
        },
        {
          title: 'Einstellungen',
          description: 'Website-Einstellungen',
          icon: Settings,
          action: () => navigateToSection('settings')
        },
        {
          title: 'Admin-Setup',
          description: 'Ersten Admin einrichten',
          icon: Shield,
          action: setupFirstAdmin
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {quickActionsCategories.map((category, categoryIndex) => {
        const CategoryIcon = category.icon;
        return (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 bg-${category.color}-900/20 rounded-lg border border-${category.color}-500/30`}>
                <CategoryIcon className={`h-6 w-6 text-${category.color}-400`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.actions.map((action, actionIndex) => {
                const ActionIcon = action.icon;
                return (
                  <Card 
                    key={actionIndex} 
                    className="modern-card hover-lift cursor-pointer group" 
                    onClick={() => {
                      action.action();
                      if (action.subAction) {
                        setTimeout(() => action.subAction(), 100);
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-${category.color}-900/20 rounded-lg border border-${category.color}-500/30 group-hover:bg-${category.color}-800/30 transition-colors`}>
                          <ActionIcon className={`h-5 w-5 text-${category.color}-400`} />
                        </div>
                        <CardTitle className="text-base text-white">{action.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-400 text-sm mb-4">
                        {action.description}
                      </CardDescription>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full border-${category.color}-500/30 text-${category.color}-400 hover:bg-${category.color}-900/20 group-hover:border-${category.color}-400/50 transition-all`}
                      >
                        Öffnen
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
