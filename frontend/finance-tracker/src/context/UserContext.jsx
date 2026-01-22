import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

const UserContext = createContext();
export { UserContext };

const UserProvider = ({ children }) => {
    // Initialize from localStorage so reloads/dev helper keep the user visible
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [isAuthChecking, setIsAuthChecking] = useState(() => {
        // Optimistic check: If we have a user and token, don't block the UI
        const hasToken = !!localStorage.getItem('token');
        const hasUser = !!localStorage.getItem('user');
        return hasToken && !hasUser;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!(localStorage.getItem('token') && localStorage.getItem('user'));
    });

    // Auto-login: Verify token and restore session on app load
    useEffect(() => {
        const verifyAndRestoreSession = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (!token) {
                    setIsAuthChecking(false);
                    setIsAuthenticated(false);
                    return;
                }

                // If we have data, we might be verifying in background. 
                // Only block if we truly needed to (which we handled in init state)

                try {
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                    if (response.data && response.data.user) {
                        const userData = response.data.user;
                        setUser(userData);
                        setIsAuthenticated(true);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } else {
                        clearSession();
                    }
                } catch (error) {
                    console.log('Token verification failed, clearing session');
                    clearSession();
                }
            } catch (error) {
                console.error('Session restoration error:', error);
                clearSession();
            } finally {
                setIsAuthChecking(false);
            }
        };

        verifyAndRestoreSession();
    }, []); // Run only once on mount

    // Helper to clear session
    const clearSession = () => {
        setUser(null);
        setIsAuthenticated(false);
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch {
            // Ignore localStorage errors
        }
    };

    // keep localStorage in sync with context
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            }
        } catch {
            // Ignore localStorage errors
        }
    }, [user]);

    // Memoize functions to prevent unnecessary re-renders
    const updateUser = useCallback((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const clearUser = useCallback(() => {
        clearSession();
    }, []);

    // Login function
    const login = useCallback((userData, token) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        clearSession();
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        updateUser,
        clearUser,
        login,
        logout,
        isAuthChecking,
        isAuthenticated
    }), [user, updateUser, clearUser, login, logout, isAuthChecking, isAuthenticated]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;