import axios from "axios";

// Retrieve key environment variables
const viteApiUrl = import.meta.env.VITE_API_URL;

// Enforce security & environment validation standards
const getValidatedApiUrl = (): string => {
    if (!viteApiUrl) {
        if (import.meta.env.PROD) {
            // In production, do not silently fallback to localhost or unverified hosts
            throw new Error(
                "CRITICAL SECURITY EXCEPTION: The VITE_API_URL environment variable is missing or undefined. " +
                "A valid API base endpoint must be supplied in production to prevent unintended requests."
            );
        }
        console.warn(
            "WARNING: VITE_API_URL is undefined. Falling back to development endpoint (http://localhost:5000)."
        );
        return "http://localhost:5000";
    }

    // Basic validation: ensure the URL starts with http:// or https:// to prevent script/redirect injection
    if (!/^https?:\/\//i.test(viteApiUrl)) {
        throw new Error(
            `CRITICAL SECURITY EXCEPTION: The configured API URL "${viteApiUrl}" is invalid. It must begin with http:// or https://.`
        );
    }

    return viteApiUrl;
};

export const API_URL = getValidatedApiUrl();

// Standard Axios client instance for secure and consistent API interactions
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
