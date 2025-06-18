import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Settings, Database, Activity, BarChart3, Shield, FolderOpen, Mail, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { ProjectManagement } from '@/components/admin/ProjectManagement';
import { ServiceManagement } from '@/components/admin/ServiceManagement';
import { ContactMessages } from '@/components/admin/ContactMessages';
import { PageManagement } from '@/components/admin/PageManagement';
import { ThemeSettings } from '@/components/admin/ThemeSettings';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalImages: 0,
    totalProjects: 0,
    unreadMessages: 0,
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  console.log('🎯 AdminDashboard render - User:', user?.id, 'isAdmin:', isAdmin, 'loading:', loading);

  useEffect(() => {
    console.log('🎯 AdminDashboard useEffect triggered:', { loading, hasUser: !!user, isAdmin });
    
    // If still loading auth, wait
    if (loading) {
      console.log('🎯 Still loading auth, waiting...');
      return;
    }

    // If no user after auth is loaded, redirect to auth
    if (!user) {
      console.log('🎯 No user found, redirecting to auth');
      navigate('/auth');
      return;
    }
    
    // If user but not admin, redirect to home
    if (!isAdmin) {
      console.log('🎯 User is not admin, redirecting to home');
      toast.error('Sie haben keine Berechtigung für das Admin Dashboard');
      navigate('/');
      return;
    }

    // User is admin, load stats
    console.log('🎯 User is admin, loading dashboard stats');
    loadStats();
  }, [user, isAdmin, loading, navigate]);

  const loadStats = async () => {
    try {
      console.log('🎯 Loading dashboard stats...');
      setDashboardLoading(true);
      
      // Load stats with proper async/await error handling
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

      const [totalUsers, totalServices, totalImages, totalProjects, unreadMessages] = await Promise.all([
        getProfilesCount(),
        getServicesCount(),
        getImagesCount(),
        getProjectsCount(),
        getUnreadMessagesCount()
      ]);

      console.log('🎯 Stats loaded:', { totalUsers, totalServices, totalImages, totalProjects, unreadMessages });

      setStats({
        totalUsers,
        totalServices,
        totalImages,
        totalProjects,
        unreadMessages,
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

  // Show loading screen while auth is still loading
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

  // Don't render anything if redirecting (user will be null or not admin)
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Benutzer</CardTitle>
                  <Users className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-400">Registrierte Benutzer</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Projekte</CardTitle>
                  <FolderOpen className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
                  <p className="text-xs text-gray-400">Projekte gesamt</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Services</CardTitle>
                  <Settings className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalServices}</div>
                  <p className="text-xs text-gray-400">Verfügbare Services</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Galerie</CardTitle>
                  <Database className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalImages}</div>
                  <p className="text-xs text-gray-400">Galerie Bilder</p>
                </CardContent>
              </Card>

              <Card className="modern-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Nachrichten</CardTitle>
                  <Mail className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.unreadMessages}</div>
                  <p className="text-xs text-gray-400">Ungelesen</p>
                </CardContent>
              </Card>
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-900/50">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-red-900/50">
                  Übersicht
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
                <TabsTrigger value="pages" className="text-white data-[state=active]:bg-red-900/50">
                  Seiten
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-white data-[state=active]:bg-red-900/50">
                  Einstellungen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="modern-card hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Users className="w-5 h-5 mr-2 text-red-400" />
                        Benutzerverwaltung
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Verwalten Sie Benutzerkonten und Berechtigungen
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Benutzerverwaltung wird bald verfügbar sein')}
                      >
                        Benutzer verwalten
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="modern-card hover-lift">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <BarChart3 className="w-5 h-5 mr-2 text-red-400" />
                        Analytics
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Website-Statistiken und Berichte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                        onClick={() => toast.info('Analytics wird bald verfügbar sein')}
                      >
                        Berichte anzeigen
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

              <TabsContent value="messages" className="mt-6">
                <ContactMessages />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <ProjectManagement />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <ServiceManagement />
              </TabsContent>

              <TabsContent value="pages" className="mt-6">
                <PageManagement />
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
