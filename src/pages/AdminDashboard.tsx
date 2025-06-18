import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { AdminHeader } from '@/components/admin/dashboard/AdminHeader';
import { WelcomeSection } from '@/components/admin/dashboard/WelcomeSection';
import { StatsCards } from '@/components/admin/dashboard/StatsCards';
import { AdminTabs } from '@/components/admin/dashboard/AdminTabs';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
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

  const navigateToSection = (tabName: string) => {
    setActiveTab(tabName);
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
      <AdminHeader userEmail={user.email || ''} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection userEmail={user.email || ''} />

        {dashboardLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} navigateToSection={navigateToSection} />
            <AdminTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navigateToSection={navigateToSection}
              setupFirstAdmin={setupFirstAdmin}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
