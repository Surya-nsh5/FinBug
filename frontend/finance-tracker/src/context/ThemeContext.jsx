import React, { createContext, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Always use dark mode
    const isDarkMode = true;

    useEffect(() => {
        // Always apply dark mode
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }, []);

    // Toggle function kept for compatibility but does nothing
    const toggleTheme = () => {
        // Dark mode is forced, no toggle
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
