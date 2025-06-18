
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Settings, Database, Activity, BarChart3, Shield, FolderOpen, Mail, FileText, CreditCard, Calendar, HardDrive, BookOpen, Send, Upload, StickyNote, Globe, Phone, Palette, MessageSquare, Search, Target, TrendingUp, Clock, Archive, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { ProjectManagement } from '@/components/admin/ProjectManagement';
import { ServiceManagement } from '@/components/admin/ServiceManagement';
import { ContactMessages } from '@/components/admin/ContactMessages';
import { PageManagement } from '@/components/admin/PageManagement';
import { ThemeSettings } from '@/components/admin/ThemeSettings';
import { ContactSettings } from '@/components/admin/ContactSettings';
import { UserManagement } from '@/components/admin/UserManagement';
import { Analytics } from '@/components/admin/Analytics';
import { InvoiceManagement } from '@/components/admin/InvoiceManagement';
import { TransactionManagement } from '@/components/admin/TransactionManagement';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalImages: 0,
    totalProjects: 0,
    unreadMessages: 0,
    totalInvoices: 0,
    totalTransactions: 0,
    pendingTasks: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  console.log('🎯 AdminDashboard render - User:', user?.id, 'isAdmin:', isAdmin, 'loading:', loading);

  useEffect(() => {
    console.log('🎯 AdminDashboard useEffect triggered:', { loading, hasUser: !!user, isAdmin });
    
    if (loading) {
      console.log('🎯 Still loading auth, waiting...');
      return;
    }

    if (!user) {
      console.log('🎯 No user found, redirecting to auth');
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      console.log('🎯 User is not admin, redirecting to home');
      toast.error('Sie haben keine Berechtigung für das Admin Dashboard');
      navigate('/');
      return;
    }

    console.log('🎯 User is admin, loading dashboard stats');
    loadStats();
  }, [user, isAdmin, loading, navigate]);

  const loadStats = async () => {
    try {
      console.log('🎯 Loading dashboard stats...');
      setDashboardLoading(true);
      
      const getProfilesCount = async () => {
        try {
          const { count, error } = await supabase.from('profiles').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Profiles table not accessible:', err);
          return 0;
        }
      };
      
      const getServicesCount = async () => {
        try {
          const { count, error } = await supabase.from('service_items').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Service items table not accessible:', err);
          return 0;
        }
      };
      
      const getImagesCount = async () => {
        try {
          const { count, error } = await supabase.from('gallery_images').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Gallery images table not accessible:', err);
          return 0;
        }
      };

      const getProjectsCount = async () => {
        try {
          const { count, error } = await supabase.from('projects').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Projects table not accessible:', err);
          return 0;
        }
      };

      const getUnreadMessagesCount = async () => {
        try {
          const { count, error } = await supabase.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'unread');
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Contact messages table not accessible:', err);
          return 0;
        }
      };

      const getInvoicesCount = async () => {
        try {
          const { count, error } = await supabase.from('invoices').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Invoices table not accessible:', err);
          return 0;
        }
      };

      const getTransactionsCount = async () => {
        try {
          const { count, error } = await supabase.from('transactions').select('id', { count: 'exact' });
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Transactions table not accessible:', err);
          return 0;
        }
      };

      const getPendingTasksCount = async () => {
        try {
          const { count, error } = await supabase.from('tasks').select('id', { count: 'exact' }).neq('status', 'done');
          if (error) throw error;
          return count || 0;
        } catch (err) {
          console.log('Tasks table not accessible:', err);
          return 0;
        }
      };

      const [totalUsers, totalServices, totalImages, totalProjects, unreadMessages, totalInvoices, totalTransactions, pendingTasks] = await Promise.all([
        getProfilesCount(),
        getServicesCount(),
        getImagesCount(),
        getProjectsCount(),
        getUnreadMessagesCount(),
        getInvoicesCount(),
        getTransactionsCount(),
        getPendingTasksCount()
      ]);

      console.log('🎯 Stats loaded:', { totalUsers, totalServices, totalImages, totalProjects, unreadMessages, totalInvoices, totalTransactions, pendingTasks });

      setStats({
        totalUsers,
        totalServices,
        totalImages,
        totalProjects,
        unreadMessages,
        totalInvoices,
        totalTransactions,
        pendingTasks,
      });
    } catch (error) {
      console.error('🎯 Error loading stats:', error);
      toast.error('Fehler beim Laden der Statistiken');
    } finally {
      setDashboardLoading(false);
    }
  };

  const setupFirstAdmin = async () => {
    try {
      console.log('🎯 Setting up first admin...');
      const { error } = await supabase.rpc('setup_first_admin');
      if (error) {
        console.error('🎯 RPC error:', error);
        throw error;
      }
      toast.success('Admin-Setup abgeschlossen!');
    } catch (error) {
      console.error('🎯 Error setting up admin:', error);
      toast.error('Fehler beim Admin-Setup: ' + error.message);
    }
  };

  if (loading) {
    console.log('🎯 Showing loading screen');
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Lade Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('🎯 User check failed, should redirect');
    return null;
  }

  console.log('🎯 Rendering admin dashboard for user:', user.email);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold modern-lava-text">Admin Dashboard</h1>
            </div>
            <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-500/30">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Willkommen zurück, {user.email}
          </h2>
          <p className="text-gray-400">
            Verwalten Sie Ihre Website und überwachen Sie wichtige Metriken.
          </p>
        </div>

        {dashboardLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Benutzer</CardTitle>
                  <Users className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Projekte</CardTitle>
                  <FolderOpen className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Services</CardTitle>
                  <Settings className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalServices}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Galerie</CardTitle>
                  <Database className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalImages}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Nachrichten</CardTitle>
                  <Mail className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.unreadMessages}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Rechnungen</CardTitle>
                  <FileText className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalInvoices}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Transaktionen</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Aufgaben</CardTitle>
                  <CheckCircle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.pendingTasks}</div>
                </CardContent>
              </Card>
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-gray-900/50 mb-6">
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
                <TabsTrigger value="messages" className="text-white data-[state=active]:bg-red-900/50">
                  Nachrichten
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-white data-[state=active]:bg-red-900/50">
                  Projekte
                </TabsTrigger>
                <TabsTrigger value="services" className="text-white data-[state=active]:bg-red-900/50">
                  Services
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-white data-[state=active]:bg-red-900/50">
                  Kontakt
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-white data-[state=active]:bg-red-900/50">
                  Einstellungen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {/* Weitere Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Aufgabenverwaltung wird bald verfügbar sein')}
                      >
                        Aufgaben verwalten
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Backup-Funktion wird bald verfügbar sein')}
                      >
                        Backup erstellen
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Newsletter-Funktion wird bald verfügbar sein')}
                      >
                        Newsletter senden
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Datei-Manager wird bald verfügbar sein')}
                      >
                        Dateien verwalten
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Notizen-Funktion wird bald verfügbar sein')}
                      >
                        Notizen erstellen
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('SEO Tools werden bald verfügbar sein')}
                      >
                        SEO optimieren
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
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
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('System Logs werden bald verfügbar sein')}
                      >
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

              <TabsContent value="messages" className="mt-6">
                <ContactMessages />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <ProjectManagement />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <ServiceManagement />
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <ContactSettings />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <ThemeSettings />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
