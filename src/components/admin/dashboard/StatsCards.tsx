
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, Settings, Database, Mail, FileText, CreditCard, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalUsers: number;
    totalServices: number;
    totalImages: number;
    totalProjects: number;
    unreadMessages: number;
    totalInvoices: number;
    totalTransactions: number;
    pendingTasks: number;
  };
  navigateToSection: (tabName: string) => void;
}

export const StatsCards = ({ stats, navigateToSection }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('users')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Benutzer</CardTitle>
          <Users className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('projects')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Projekte</CardTitle>
          <FolderOpen className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('services')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Services</CardTitle>
          <Settings className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalServices}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('analytics')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Galerie</CardTitle>
          <Database className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalImages}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('messages')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Nachrichten</CardTitle>
          <Mail className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.unreadMessages}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('invoicing')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Rechnungen</CardTitle>
          <FileText className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalInvoices}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('transactions')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Transaktionen</CardTitle>
          <CreditCard className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
        </CardContent>
      </Card>

      <Card className="modern-card cursor-pointer hover:bg-gray-800/30 transition-colors" onClick={() => navigateToSection('tasks')}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Aufgaben</CardTitle>
          <CheckCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.pendingTasks}</div>
        </CardContent>
      </Card>
    </div>
  );
};
