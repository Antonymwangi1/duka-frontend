"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    isAuthenticated,
    accessToken,
    shop,
    _hasHydrated,
    setToken,
    setShop,
    setAuth,
    user,
    logout,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;

    const initAuth = async () => {
      if (!isAuthenticated) {
        router.push("/login");
        setIsChecking(false);
        return;
      }

      // Token in memory — just logged in
      if (accessToken) {
        // But shop might not be set yet — fetch it
        if (!shop && user) {
          try {
            const response = await api.get("/api/v1/auth/shops");
            const shops = response.data.shops;
            if (shops.length === 1) {
              setShop(shops[0]);
            } else if (shops.length > 1) {
              // Multiple shops — go to selector
              router.push("/select-shop");
              return;
            }
          } catch {
            // Not critical — continue
          }
        }
        setIsChecking(false);
        return;
      }

      // No token — page was reloaded, try refresh
      try {
        const response = await api.post("/api/v1/auth/refresh");
        const newToken = response.data.accessToken;
        setToken(newToken);

        // Fetch shop if not set
        if (!shop && user) {
          try {
            const shopsResponse = await api.get("/api/v1/auth/shops", {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            const shops = shopsResponse.data.shops;
            if (shops.length === 1) {
              setShop(shops[0]);
            } else if (shops.length > 1) {
              router.push("/select-shop");
              return;
            }
          } catch {
            // Not critical
          }
        }

        setIsChecking(false);
      } catch {
        logout();
        router.push("/login");
      }
    };

    initAuth();
  }, [_hasHydrated]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
