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
    logout,
    user,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    const initAuth = async () => {
      // Not authenticated at all
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      let currentToken = accessToken;

      // No token in memory page was reloaded, refresh first
      if (!currentToken) {
        try {
          const response = await api.post("/api/v1/auth/refresh");
          currentToken = response.data.accessToken;
          setToken(currentToken!);
        } catch {
          logout();
          router.push("/login");
          return;
        }
      }

      // Token confirmed now ensure shop is loaded
      if (!shop) {
        try {
          const response = await api.get("/api/v1/auth/shops");
          const shops = response.data.shops;

          if (shops.length === 0) {
            // Owner has no shops somehow
            router.push("/login");
            return;
          }

          if (shops.length === 1) {
            setShop(shops[0]);

            // Get fresh jWT with shopId populated
            const switchResponse = await api.post("/api/v1/auth/switch-shop", {
              shopId: shops[0].id,
            });

            setToken(switchResponse.data.accessToken);
          } else {
            // Multiple shops needs selection
            router.push("/select-shop");
            return;
          }
        } catch {
          // Not critical continue without shop
          // but queries will be disabled
        }
      } else {
        // shop exists but check if JWT has shopId
        // Parse JWT payload to check
        try {
          const payload = JSON.parse(atob(currentToken!.split(".")[1]));
          if (!payload.shopId) {
            // JWT missing shopId get fresh one
            const switchResponse = await api.post("/api/v1/auth/switch-shop", {
              shopId: shop.id,
            });
            setToken(switchResponse.data.accessToken);
          }
        } catch {
          // Could not parse JWT continue
        }
      }

      // Everything confirmed render dashboard
      setIsChecking(false);
    };

    initAuth();
  }, [_hasHydrated]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 rounded-2xl p-4">
              <h1 className="text-2xl font-bold text-primary">Duka</h1>
            </div>
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your shop...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
