/**
 * Persistence utility for managing authentication tokens and user data.
 * Uses both localStorage and Cookies for maximum persistence across mobile PWA and web.
 */

// Simple cookie helper
const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const persistence = {
    setToken: (token) => {
        try {
            localStorage.setItem('token', token);
            // Also set as cookie for better PWA persistence on some mobile OSs
            setCookie('auth_token', token, 365);
        } catch (e) {
            console.warn('LocalStorage not available, using cookies only');
            setCookie('auth_token', token, 365);
        }
    },
    getToken: () => {
        try {
            return localStorage.getItem('token') || getCookie('auth_token');
        } catch (e) {
            return getCookie('auth_token');
        }
    },
    clearToken: () => {
        try {
            localStorage.removeItem('token');
        } catch (e) { }
        removeCookie('auth_token');
    },
    setUser: (user) => {
        try {
            localStorage.setItem('user', JSON.stringify(user));
        } catch (e) { }
    },
    getUser: () => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },
    clearUser: () => {
        try {
            localStorage.removeItem('user');
        } catch (e) { }
    }
};
