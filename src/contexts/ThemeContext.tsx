
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type Theme = 'red' | 'silver' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'amber' | 'emerald' | 'indigo' | 'rose';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('red');
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  // Load global theme from database
  useEffect(() => {
    const loadGlobalTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'global_theme')
          .single();

        if (!error && data) {
          const savedTheme = data.value as Theme;
          setThemeState(savedTheme);
          document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
          // Fallback to localStorage if no global setting
          const saved = localStorage.getItem('website-theme');
          const fallbackTheme = (saved as Theme) || 'red';
          setThemeState(fallbackTheme);
          document.documentElement.setAttribute('data-theme', fallbackTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('website-theme');
        const fallbackTheme = (saved as Theme) || 'red';
        setThemeState(fallbackTheme);
        document.documentElement.setAttribute('data-theme', fallbackTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadGlobalTheme();
  }, []);

  // Set theme function (only admins can change global theme)
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('website-theme', newTheme);

    // If user is admin, save to database as global setting
    if (isAdmin) {
      try {
        await supabase
          .from('site_settings')
          .upsert({ 
            key: 'global_theme', 
            value: newTheme 
          }, { 
            onConflict: 'key' 
          });
        console.log('Global theme saved:', newTheme);
      } catch (error) {
        console.error('Error saving global theme:', error);
      }
    }
  };

  // Listen for real-time theme changes
  useEffect(() => {
    const channel = supabase
      .channel('theme_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.global_theme'
        },
        (payload) => {
          if (payload.new && 'value' in payload.new) {
            const newTheme = payload.new.value as Theme;
            setThemeState(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('website-theme', newTheme);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
