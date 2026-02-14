import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';
import { persistence } from '../utils/persistence';

const UserContext = createContext();
export { UserContext };

const UserProvider = ({ children }) => {
    // Initial state from persistent storage
    const [user, setUser] = useState(() => persistence.getUser());

    // Initial auth check status: 
    // If we have a token but no user object, we must check.
    // If we have both, we assume authenticated but verify in background.
    const [isAuthChecking, setIsAuthChecking] = useState(() => {
        const hasToken = !!persistence.getToken();
        const hasUser = !!persistence.getUser();
        return hasToken && !hasUser;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!(persistence.getToken() && persistence.getUser());
    });

    // Consolidate session clearing
    const clearSession = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        persistence.clearToken();
        persistence.clearUser();
    }, []);

    // Auto-login: Verify token and restore session on app load
    useEffect(() => {
        const verifyAndRestoreSession = async () => {
            try {
                // Request persistent storage for PWA longevity
                if (navigator.storage && navigator.storage.persist) {
                    navigator.storage.persist().catch(() => { });
                }

                const token = persistence.getToken();
                if (!token) {
                    setIsAuthChecking(false);
                    setIsAuthenticated(false);
                    return;
                }

                try {
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                    let userData = null;
                    if (response.data) {
                        userData = response.data.user || (response.data._id ? response.data : null);
                    }

                    if (userData) {
                        setUser(userData);
                        setIsAuthenticated(true);
                        persistence.setUser(userData);
                    }
                } catch (error) {
                    // ONLY clear session if it's an auth error (401/403)
                    // If it's a network error or 500, keep the existing session data
                    if (error.response && [401, 403].includes(error.response.status)) {
                        console.warn('Authentication expired or invalid, clearing session');
                        clearSession();
                    } else {
                        console.log('Network error or server down, keeping existing session');
                        // If we have local data, we remain authenticated even if offline
                        if (persistence.getToken() && persistence.getUser()) {
                            setIsAuthenticated(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Session restoration error:', error);
            } finally {
                setIsAuthChecking(false);
            }
        };

        verifyAndRestoreSession();
    }, [clearSession]);

    // Update user state and persistence
    const updateUser = useCallback((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        if (userData) {
            persistence.setUser(userData);
        } else {
            persistence.clearUser();
        }
    }, []);

    // Login helper
    const login = useCallback((userData, token) => {
        persistence.setToken(token);
        persistence.setUser(userData);
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    // Logout helper
    const logout = useCallback(() => {
        clearSession();
    }, [clearSession]);

    const contextValue = useMemo(() => ({
        user,
        updateUser,
        clearUser: logout,
        login,
        logout,
        isAuthChecking,
        isAuthenticated
    }), [user, updateUser, logout, login, isAuthChecking, isAuthenticated]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;