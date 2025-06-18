
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Users, Settings, Database, Activity, BarChart3, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalImages: 0,
  });

  console.log('AdminDashboard render:', { user: user?.id, isAdmin, loading });

  useEffect(() => {
    console.log('AdminDashboard useEffect:', { loading, user: user?.id, isAdmin });
    
    if (!loading) {
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      if (!isAdmin) {
        console.log('User is not admin, redirecting to home');
        toast.error('Sie haben keine Berechtigung für das Admin Dashboard');
        navigate('/');
        return;
      }

      // User is admin, load stats
      console.log('User is admin, loading stats');
      loadStats();
    }
  }, [user, isAdmin, loading, navigate]);

  const loadStats = async () => {
    try {
      console.log('Loading dashboard stats...');
      
      // Try to load stats from tables that might exist
      const promises = [];
      
      // Check if tables exist before querying
      try {
        promises.push(supabase.from('profiles').select('id', { count: 'exact' }));
      } catch (e) {
        console.log('profiles table not accessible');
        promises.push(Promise.resolve({ count: 0 }));
      }
      
      try {
        promises.push(supabase.from('services').select('id', { count: 'exact' }));
      } catch (e) {
        console.log('services table not accessible');
        promises.push(Promise.resolve({ count: 0 }));
      }
      
      try {
        promises.push(supabase.from('gallery_images').select('id', { count: 'exact' }));
      } catch (e) {
        console.log('gallery_images table not accessible');
        promises.push(Promise.resolve({ count: 0 }));
      }

      const [usersResult, servicesResult, imagesResult] = await Promise.allSettled(promises);

      console.log('Stats query results:', { usersResult, servicesResult, imagesResult });

      setStats({
        totalUsers: usersResult.status === 'fulfilled' ? (usersResult.value.count || 0) : 0,
        totalServices: servicesResult.status === 'fulfilled' ? (servicesResult.value.count || 0) : 0,
        totalImages: imagesResult.status === 'fulfilled' ? (imagesResult.value.count || 0) : 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Fehler beim Laden der Statistiken');
    }
  };

  const setupFirstAdmin = async () => {
    try {
      console.log('Setting up first admin...');
      const { error } = await supabase.rpc('setup_first_admin');
      if (error) {
        console.error('RPC error:', error);
        // Fallback: try to insert directly
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: user?.id, role: 'admin' });
        
        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
      }
      toast.success('Admin-Setup abgeschlossen!');
      window.location.reload();
    } catch (error) {
      console.error('Error setting up admin:', error);
      toast.error('Fehler beim Admin-Setup: ' + error.message);
    }
  };

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, should redirect');
    return null;
  }

  if (!isAdmin) {
    console.log('Not admin, should redirect');
    return null;
  }

  console.log('Rendering admin dashboard');

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

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
                <Settings className="w-5 h-5 mr-2 text-red-400" />
                Service Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Services hinzufügen, bearbeiten oder entfernen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                onClick={() => toast.info('Service Management wird bald verfügbar sein')}
              >
                Services verwalten
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
                <Activity className="w-5 h-5 mr-2 text-red-400" />
                System Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Überwachen Sie die Systemleistung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full modern-button-outline border-red-500/30 text-red-400 hover:bg-red-900/20"
                onClick={() => toast.info('System Status wird bald verfügbar sein')}
              >
                Status prüfen
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
      </div>
    </div>
  );
};

export default AdminDashboard;
