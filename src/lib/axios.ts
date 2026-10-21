import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const AUTH_ENDPOINTS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/resend-verification-email",
  "/api/v1/auth/refresh",
];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends HTTP-only cookie automatically
  headers: {
    "Content-Type": "application/json",
  },
});

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;

  return AUTH_ENDPOINTS.some((endpoint) => {
    return url.split("?")[0].endsWith(endpoint);
  });
}

// Request interceptor — attach access token from memory
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle token refresh on 401

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't attempt to refresh the token for auth endpoints, as they may not require a valid token.
   if (isAuthEndpoint(error.config?.url)) {
      return Promise.reject(error);
    }
    const original = error.config;

    // No request config means there is nothing to retry.
    if (!original) {
      return Promise.reject(error);
    }

    // Only refresh a 401 once per original request.
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Use plain axios to avoid triggering this interceptor
        // for the refresh request itself.
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = response.data.accessToken;

        if (typeof newToken !== "string" || !newToken) {
          throw new Error("Refresh response did not include an access token");
        }

        // Keep the access token in memory.
        useAuthStore.getState().setToken(newToken);

        // Retry the original request with the new token.
        original.headers.set
          ? original.headers.set("Authorization", `Bearer ${newToken}`)
          : (original.headers.Authorization = `Bearer ${newToken}`);

        return api(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
