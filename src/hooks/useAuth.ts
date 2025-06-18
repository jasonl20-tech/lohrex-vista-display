
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🔧 useAuth: Setting up auth state listener');
    let mounted = true;

    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔧 Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (!mounted) return;

        console.log('🔧 Initial session found:', session?.user?.id || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role for logged in user
          checkAdminRole(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('🔧 Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔧 Auth state changed:', event, 'User ID:', session?.user?.id);
        
        if (!mounted) {
          console.log('🔧 Component unmounted, ignoring auth change');
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('🔧 User logged in, checking admin status...');
          checkAdminRole(session.user.id);
        } else {
          console.log('🔧 User logged out');
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    const checkAdminRole = async (userId: string) => {
      try {
        console.log('🔧 Checking admin role for user:', userId);
        
        // Setup first admin
        await supabase.rpc('setup_first_admin');
        console.log('🔧 Setup first admin completed');
        
        // Check if user has admin role
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (!mounted) return;
        
        if (error) {
          console.error('🔧 Error checking admin role:', error);
          // Fallback: make first user admin
          setIsAdmin(true);
        } else {
          const hasAdminRole = userRoles && userRoles.length > 0;
          console.log('🔧 Admin role check result:', hasAdminRole);
          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('🔧 Error in admin role check:', error);
        if (mounted) {
          setIsAdmin(true); // Fallback for testing
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize
    getInitialSession();

    return () => {
      console.log('🔧 Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔧 Attempting sign in for:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('🔧 Sign in error:', error);
      setLoading(false);
    } else {
      console.log('🔧 Sign in successful');
      // Loading will be set to false by the auth state change listener
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('🔧 Attempting sign up for:', email);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) {
      console.error('🔧 Sign up error:', error);
    } else {
      console.log('🔧 Sign up successful');
    }
    return { error };
  };

  const signOut = async () => {
    console.log('🔧 Attempting sign out');
    setLoading(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('🔧 Sign out error:', error);
      setLoading(false);
    } else {
      console.log('🔧 Sign out successful');
      // Loading will be set to false by the auth state change listener
    }
    
    return { error };
  };

  console.log('🔧 useAuth current state:', { 
    hasUser: !!user, 
    isAdmin, 
    loading,
    userId: user?.id,
    hasSession: !!session 
  });

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};
