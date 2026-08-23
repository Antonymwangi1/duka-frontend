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
      // 1. Check basic authentication
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      let currentToken = accessToken;

      // 2. Refresh token if missing from memory on page reload
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

      // Extract user role from store or JWT payload
      const userRole = user?.role;

      // -------------------------------------------------------------
      // PATH A: CASHIER / STAFF FLOW
      // -------------------------------------------------------------
      if (userRole === "CASHIER" || userRole === "ADMIN") {
        // Cashier/Staff are permanently assigned to one shop via user.shopId
        if (!shop && user?.shopId) {
          // If shop object is missing in state, fetch current shop or construct fallback
          try {
            const response = await api.get("/api/v1/auth/shops");
            setShop(response.data.shop);
          } catch {
            // Fallback minimal shop context so queries can fire
            setShop({ id: user.shopId, name: "Store" } as any);
          }
        }
        setIsChecking(false);
        return;
      }

      // -------------------------------------------------------------
      // PATH B: OWNER FLOW
      // -------------------------------------------------------------
      if (!shop) {
        try {
          const response = await api.get("/api/v1/auth/shops");
          const shops = response.data.shops;

          if (!shops || shops.length === 0) {
            router.push("/login");
            return;
          }

          if (shops.length === 1) {
            setShop(shops[0]);

            // Get fresh JWT with shopId populated
            const switchResponse = await api.post("/api/v1/auth/switch-shop", {
              shopId: shops[0].id,
            });

            setToken(switchResponse.data.accessToken);
          } else {
            router.push("/select-shop");
            return;
          }
        } catch {
          // Error loading owner shops
        }
      } else {
        // Check if current JWT contains shopId claim
        try {
          const payload = JSON.parse(atob(currentToken!.split(".")[1]));
          if (!payload.shopId) {
            const switchResponse = await api.post("/api/v1/auth/switch-shop", {
              shopId: shop.id,
            });
            setToken(switchResponse.data.accessToken);
          }
        } catch {
          // Could not parse JWT
        }
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
