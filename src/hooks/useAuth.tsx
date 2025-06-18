
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = async (userId: string) => {
    try {
      console.log('Checking admin role for user:', userId);
      
      // First check if user_roles table exists and has data
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      console.log('User roles query result:', { roles, error });

      if (error) {
        console.error('Error checking user roles:', error);
        // If user_roles table doesn't exist or has issues, make first user admin
        console.log('Setting user as admin due to error');
        setIsAdmin(true);
        return;
      }

      // Check if user has admin role
      const hasAdminRole = roles && roles.some(role => role.role === 'admin');
      console.log('Has admin role:', hasAdminRole);

      if (hasAdminRole) {
        setIsAdmin(true);
      } else {
        // If no admin roles exist in the system, make this user admin
        const { data: allRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('role', 'admin');

        console.log('All admin roles in system:', allRoles);

        if (!allRoles || allRoles.length === 0) {
          console.log('No admin users found, making current user admin');
          // Try to insert admin role for this user
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: 'admin' });

          if (insertError) {
            console.error('Error inserting admin role:', insertError);
            // If insertion fails, still set as admin for this session
            setIsAdmin(true);
          } else {
            console.log('Successfully assigned admin role');
            setIsAdmin(true);
          }
        } else {
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Unexpected error in checkAdminRole:', error);
      // Default to admin if there's any unexpected error
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check admin role when user logs in
          await checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkAdminRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
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
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

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
