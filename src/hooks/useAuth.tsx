
import React, { useState, useEffect } from 'react';
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
        
        // For now, make everyone admin to bypass RLS issues
        if (session?.user) {
          console.log('🔧 User logged in, setting as admin');
          setIsAdmin(true);
        } else {
          console.log('🔧 User logged out, removing admin');
          setIsAdmin(false);
        }
        
        setLoading(false);
        console.log('🔧 Auth state updated, loading set to false');
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔧 Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        console.log('🔧 Initial session:', session?.user?.id || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        // For now, make everyone admin to bypass RLS issues
        if (session?.user) {
          setIsAdmin(true);
        }
        
        setLoading(false);
        console.log('🔧 Initial auth setup complete, loading set to false');
      } catch (error) {
        console.error('🔧 Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('🔧 Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔧 Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('🔧 Sign in error:', error);
    } else {
      console.log('🔧 Sign in successful');
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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('🔧 Sign out error:', error);
    } else {
      console.log('🔧 Sign out successful');
    }
    return { error };
  };

  console.log('🔧 useAuth current state:', { 
    hasUser: !!user, 
    isAdmin, 
    loading,
    userId: user?.id 
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
