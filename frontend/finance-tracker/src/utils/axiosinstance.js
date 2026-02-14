import axios from 'axios';
import { persistence } from './persistence';

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    // Check if we are in production mode
    if (import.meta.env.PROD) {
        // In production, force using the specific env var or relative path 
        // to avoid incorrect localhost defaults.
        if (!import.meta.env.VITE_API_BASE_URL) {
            console.error("VITE_API_BASE_URL is not set! API calls will fail.");
        }
        return '';
    }
    return 'http://localhost:5000';
};

const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 60000, // Increased to 60 seconds for AI processing
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth accessToken
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = persistence.getToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                // We let the app handle the redirect to login via context/hooks
                // rather than forcing a hard page reload here
                console.warn("Unauthorized request detected (401)");
            } else if (error.response.status === 500) {
                console.error("Internal Server Error:", error.response.data);
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
