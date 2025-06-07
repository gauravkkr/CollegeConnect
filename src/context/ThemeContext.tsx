import React, { createContext, ReactNode } from 'react';

export const ThemeContext = createContext<{ darkMode: boolean; setDarkMode: (v: boolean) => void }>({ darkMode: false, setDarkMode: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = React.useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
