import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Colors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDark: boolean;
  theme: typeof Colors.dark;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  theme: Colors.dark,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Cargar preferencia al iniciar
    AsyncStorage.getItem('@isDark').then(val => {
      if (val !== null) setIsDark(val === 'true');
    });
  }, []);

  const toggleTheme = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    AsyncStorage.setItem('@isDark', newVal.toString());
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    AsyncStorage.setItem('@isDark', dark.toString());
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme: isDark ? Colors.dark : Colors.light, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
