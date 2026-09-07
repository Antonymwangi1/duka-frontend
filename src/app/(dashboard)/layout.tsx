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
    clearShop,
    logout,
    user,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;

    const initAuth = async () => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      let currentToken = accessToken;

      // No token in memory — page was reloaded, refresh first
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

      // Parse JWT to check shopId
      let jwtShopId: string | null = null;
      try {
        const payload = JSON.parse(atob(currentToken!.split(".")[1]));
        jwtShopId = payload.shopId ?? null;
      } catch {}

      // JWT already has shopId — shop is confirmed, render dashboard
      if (jwtShopId) {
        setIsChecking(false);
        return;
      }

      // JWT has no shopId — need to resolve which shop
      // But if shop is already in store it means user already selected
      // Just issue a fresh JWT for that shop
      if (shop) {
        try {
          const switchResponse = await api.post("/api/v1/auth/switch-shop", {
            shopId: shop.id,
          });
          setToken(switchResponse.data.accessToken);
          setIsChecking(false);
          return;
        } catch {
          // Switch failed — clear and re-evaluate
          clearShop();
        }
      }

      // No shop in store and no shopId in JWT
      // Fetch shops to determine what to do
      try {
        const response = await api.get("/api/v1/auth/shops");
        const shops = response.data.shops;

        if (!shops || shops.length === 0) {
          router.push("/login");
          return;
        }

        if (shops.length > 1) {
          // Multiple shops and none selected — go to selector
          clearShop();
          router.push("/select-shop");
          return;
        }

        // Single shop — auto select
        setShop(shops[0]);
        const switchResponse = await api.post("/api/v1/auth/switch-shop", {
          shopId: shops[0].id,
        });
        setToken(switchResponse.data.accessToken);
      } catch {
        // Could not fetch shops — continue anyway
      }

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
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
