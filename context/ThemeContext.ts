import { createContext, useContext } from "react";

type ThemeContextType = {
  toggleTheme: () => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDark: false,
});

export const useThemeToggle = () => useContext(ThemeContext);
