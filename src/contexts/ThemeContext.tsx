
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'red' | 'silver' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'amber' | 'emerald' | 'indigo' | 'rose';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('website-theme');
    return (saved as Theme) || 'red';
  });

  useEffect(() => {
    localStorage.setItem('website-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
