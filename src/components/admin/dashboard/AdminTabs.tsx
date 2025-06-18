
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/admin/UserManagement';
import { Analytics } from '@/components/admin/Analytics';
import { InvoiceManagement } from '@/components/admin/InvoiceManagement';
import { TransactionManagement } from '@/components/admin/TransactionManagement';
import { TaskManagement } from '@/components/admin/TaskManagement';
import { BackupManagement } from '@/components/admin/BackupManagement';
import { NewsletterManagement } from '@/components/admin/NewsletterManagement';
import { FileManager } from '@/components/admin/FileManager';
import { NotesManagement } from '@/components/admin/NotesManagement';
import { SystemLogs } from '@/components/admin/SystemLogs';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { ContactSettings } from '@/components/admin/ContactSettings';
import { ServiceManagement } from '@/components/admin/ServiceManagement';
import { ProjectManagement } from '@/components/admin/ProjectManagement';
import { QuickActionCards } from './QuickActionCards';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateToSection: (tabName: string) => void;
  setupFirstAdmin: () => void;
}

export const AdminTabs = ({ activeTab, setActiveTab, navigateToSection, setupFirstAdmin }: AdminTabsProps) => {
  const mainTabs = [
    { id: 'overview', label: 'Übersicht', category: 'main' },
    { id: 'content', label: 'Inhalte', category: 'main' },
    { id: 'business', label: 'Business', category: 'main' },
    { id: 'system', label: 'System', category: 'main' },
    { id: 'settings', label: 'Einstellungen', category: 'main' }
  ];

  const contentTabs = [
    { id: 'services', label: 'Services', parent: 'content' },
    { id: 'projects', label: 'Projekte', parent: 'content' },
    { id: 'files', label: 'Dateien', parent: 'content' },
    { id: 'notes', label: 'Notizen', parent: 'content' }
  ];

  const businessTabs = [
    { id: 'users', label: 'Benutzer', parent: 'business' },
    { id: 'analytics', label: 'Analytics', parent: 'business' },
    { id: 'invoicing', label: 'Rechnungen', parent: 'business' },
    { id: 'transactions', label: 'Buchungen', parent: 'business' },
    { id: 'tasks', label: 'Aufgaben', parent: 'business' },
    { id: 'newsletter', label: 'Newsletter', parent: 'business' }
  ];

  const systemTabs = [
    { id: 'backups', label: 'Backups', parent: 'system' },
    { id: 'logs', label: 'System-Logs', parent: 'system' }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Haupt-Navigation */}
      <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 mb-6">
        {mainTabs.map((tab) => (
          <TabsTrigger 
            key={tab.id}
            value={tab.id} 
            className="text-white data-[state=active]:bg-red-900/50"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Übersicht */}
      <TabsContent value="overview" className="mt-6">
        <QuickActionCards 
          navigateToSection={navigateToSection} 
          setupFirstAdmin={setupFirstAdmin} 
        />
      </TabsContent>

      {/* Inhalte */}
      <TabsContent value="content" className="mt-6">
        <Tabs value={contentTabs.find(tab => tab.id === activeTab)?.id || 'services'} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-4">
            {contentTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="text-white data-[state=active]:bg-red-900/50"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="services" className="mt-4">
            <ServiceManagement />
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <FileManager />
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <NotesManagement />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* Business */}
      <TabsContent value="business" className="mt-6">
        <Tabs value={businessTabs.find(tab => tab.id === activeTab)?.id || 'users'} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 mb-4">
            {businessTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="text-white data-[state=active]:bg-red-900/50"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Analytics />
          </TabsContent>

          <TabsContent value="invoicing" className="mt-4">
            <InvoiceManagement />
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <TransactionManagement />
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <TaskManagement />
          </TabsContent>

          <TabsContent value="newsletter" className="mt-4">
            <NewsletterManagement />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* System */}
      <TabsContent value="system" className="mt-6">
        <Tabs value={systemTabs.find(tab => tab.id === activeTab)?.id || 'backups'} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 mb-4">
            {systemTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="text-white data-[state=active]:bg-red-900/50"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="backups" className="mt-4">
            <BackupManagement />
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <SystemLogs />
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* Einstellungen */}
      <TabsContent value="settings" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeSettings />
          <ContactSettings />
        </div>
      </TabsContent>
    </Tabs>
  );
};
