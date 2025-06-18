
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
import { QuickActionCards } from './QuickActionCards';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateToSection: (tabName: string) => void;
  setupFirstAdmin: () => void;
}

export const AdminTabs = ({ activeTab, setActiveTab, navigateToSection, setupFirstAdmin }: AdminTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 bg-gray-900/50 mb-6">
        <TabsTrigger value="overview" className="text-white data-[state=active]:bg-red-900/50">
          Übersicht
        </TabsTrigger>
        <TabsTrigger value="users" className="text-white data-[state=active]:bg-red-900/50">
          Benutzer
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-red-900/50">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="invoicing" className="text-white data-[state=active]:bg-red-900/50">
          Rechnungen
        </TabsTrigger>
        <TabsTrigger value="transactions" className="text-white data-[state=active]:bg-red-900/50">
          Buchungen
        </TabsTrigger>
        <TabsTrigger value="tasks" className="text-white data-[state=active]:bg-red-900/50">
          Aufgaben
        </TabsTrigger>
        <TabsTrigger value="backups" className="text-white data-[state=active]:bg-red-900/50">
          Backups
        </TabsTrigger>
        <TabsTrigger value="newsletter" className="text-white data-[state=active]:bg-red-900/50">
          Newsletter
        </TabsTrigger>
        <TabsTrigger value="files" className="text-white data-[state=active]:bg-red-900/50">
          Dateien
        </TabsTrigger>
        <TabsTrigger value="notes" className="text-white data-[state=active]:bg-red-900/50">
          Notizen
        </TabsTrigger>
        <TabsTrigger value="logs" className="text-white data-[state=active]:bg-red-900/50">
          Logs
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-white data-[state=active]:bg-red-900/50">
          Einstellungen
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <QuickActionCards 
          navigateToSection={navigateToSection} 
          setupFirstAdmin={setupFirstAdmin} 
        />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <UserManagement />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <Analytics />
      </TabsContent>

      <TabsContent value="invoicing" className="mt-6">
        <InvoiceManagement />
      </TabsContent>

      <TabsContent value="transactions" className="mt-6">
        <TransactionManagement />
      </TabsContent>

      <TabsContent value="tasks" className="mt-6">
        <TaskManagement />
      </TabsContent>

      <TabsContent value="backups" className="mt-6">
        <BackupManagement />
      </TabsContent>

      <TabsContent value="newsletter" className="mt-6">
        <NewsletterManagement />
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        <FileManager />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesManagement />
      </TabsContent>

      <TabsContent value="logs" className="mt-6">
        <SystemLogs />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ThemeSettings />
          <ContactSettings />
        </div>
      </TabsContent>
    </Tabs>
  );
};
