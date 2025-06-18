
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
  // Alle verfügbaren Tabs in einer flachen Struktur
  const allTabs = [
    // Hauptkategorien
    { id: 'overview', label: 'Übersicht', category: 'main' },
    
    // Content Tabs
    { id: 'services', label: 'Services', category: 'content' },
    { id: 'projects', label: 'Projekte', category: 'content' },
    { id: 'files', label: 'Dateien', category: 'content' },
    { id: 'notes', label: 'Notizen', category: 'content' },
    
    // Business Tabs
    { id: 'users', label: 'Benutzer', category: 'business' },
    { id: 'analytics', label: 'Analytics', category: 'business' },
    { id: 'invoicing', label: 'Rechnungen', category: 'business' },
    { id: 'transactions', label: 'Buchungen', category: 'business' },
    { id: 'tasks', label: 'Aufgaben', category: 'business' },
    { id: 'newsletter', label: 'Newsletter', category: 'business' },
    
    // System Tabs
    { id: 'backups', label: 'Backups', category: 'system' },
    { id: 'logs', label: 'System-Logs', category: 'system' },
    
    // Settings
    { id: 'settings', label: 'Einstellungen', category: 'main' }
  ];

  const getCurrentCategory = () => {
    const currentTab = allTabs.find(tab => tab.id === activeTab);
    if (!currentTab) return 'main';
    
    if (currentTab.category === 'content') return 'content';
    if (currentTab.category === 'business') return 'business';
    if (currentTab.category === 'system') return 'system';
    return 'main';
  };

  const currentCategory = getCurrentCategory();

  const handleMainTabChange = (value: string) => {
    if (value === 'content') {
      setActiveTab('services'); // Standard Content Tab
    } else if (value === 'business') {
      setActiveTab('users'); // Standard Business Tab
    } else if (value === 'system') {
      setActiveTab('backups'); // Standard System Tab
    } else {
      setActiveTab(value);
    }
  };

  const renderSubTabs = () => {
    if (currentCategory === 'content') {
      const contentTabs = allTabs.filter(tab => tab.category === 'content');
      return (
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {contentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-900/50 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentCategory === 'business') {
      const businessTabs = allTabs.filter(tab => tab.category === 'business');
      return (
        <div className="mb-6">
          <div className="flex flex-wrap gap-1 bg-gray-800/50 rounded-lg p-1">
            {businessTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-900/50 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentCategory === 'system') {
      const systemTabs = allTabs.filter(tab => tab.category === 'system');
      return (
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
            {systemTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-900/50 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      {/* Haupt-Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => handleMainTabChange('overview')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-red-900/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => handleMainTabChange('content')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              currentCategory === 'content'
                ? 'bg-red-900/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Inhalte
          </button>
          <button
            onClick={() => handleMainTabChange('business')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              currentCategory === 'business'
                ? 'bg-red-900/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => handleMainTabChange('system')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              currentCategory === 'system'
                ? 'bg-red-900/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            System
          </button>
          <button
            onClick={() => handleMainTabChange('settings')}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-red-900/50 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Einstellungen
          </button>
        </div>
      </div>

      {/* Sub-Navigation */}
      {renderSubTabs()}

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <QuickActionCards 
            navigateToSection={navigateToSection} 
            setupFirstAdmin={setupFirstAdmin} 
          />
        )}

        {/* Content Tabs */}
        {activeTab === 'services' && <ServiceManagement />}
        {activeTab === 'projects' && <ProjectManagement />}
        {activeTab === 'files' && <FileManager />}
        {activeTab === 'notes' && <NotesManagement />}

        {/* Business Tabs */}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'invoicing' && <InvoiceManagement />}
        {activeTab === 'transactions' && <TransactionManagement />}
        {activeTab === 'tasks' && <TaskManagement />}
        {activeTab === 'newsletter' && <NewsletterManagement />}

        {/* System Tabs */}
        {activeTab === 'backups' && <BackupManagement />}
        {activeTab === 'logs' && <SystemLogs />}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemeSettings />
            <ContactSettings />
          </div>
        )}
      </div>
    </div>
  );
};
