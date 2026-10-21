"use client";

import { useEffect } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export default function AuthInitializer() {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    if (!hasHydrated) return;

    let cancelled = false;

    async function restoreSession() {
      // No previous authenticated session: remain logged out.
      if (!isAuthenticated) {
        setAuthReady(true);
        return;
      }

      try {
        const response = await api.post("/api/v1/auth/refresh", {});

        const accessToken = response.data?.accessToken;

        if (typeof accessToken !== "string" || accessToken.length === 0) {
          throw new Error("Refresh response did not contain an access token");
        }

        if (!cancelled) {
          setToken(accessToken);
        }
      } catch {
        // An expired or invalid session should not block the UI.
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setAuthReady(true);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isAuthenticated, setToken, logout, setAuthReady]);

  return null;
}
