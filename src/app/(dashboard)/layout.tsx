
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

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );
  const shop = useAuthStore((state) => state.shop);
  const hasHydrated = useAuthStore(
    (state) => state._hasHydrated,
  );
  const isAuthReady = useAuthStore(
    (state) => state.isAuthReady,
  );

  const setToken = useAuthStore((state) => state.setToken);
  const setShop = useAuthStore((state) => state.setShop);
  const clearShop = useAuthStore((state) => state.clearShop);
  const logout = useAuthStore((state) => state.logout);

  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!hasHydrated || !isAuthReady) return;

    let cancelled = false;

    async function initAuth() {
      setIsChecking(true);

      // Session restoration is handled by AuthInitializer.
      if (!isAuthenticated || !accessToken) {
        logout();
        router.replace("/login");
        return;
      }

      const currentToken = accessToken;

      // Read shopId from the current access token.
      let jwtShopId: string | null = null;

      try {
        const payload = JSON.parse(
          atob(currentToken.split(".")[1]),
        );

        jwtShopId = payload.shopId ?? null;
      } catch {
        // If the token cannot be parsed, resolve the shop
        // using the existing shop-selection flow below.
      }

      // Token already identifies the active shop.
      if (jwtShopId) {
        if (!cancelled) setIsChecking(false);
        return;
      }

      // Try the previously selected shop first.
      if (shop) {
        try {
          const response = await api.post(
            "/api/v1/auth/switch-shop",
            { shopId: shop.id },
          );

          if (cancelled) return;

          const newToken = response.data?.accessToken;

          if (
            typeof newToken !== "string" ||
            newToken.length === 0
          ) {
            throw new Error(
              "Switch-shop response did not contain an access token",
            );
          }

          setToken(newToken);
          setIsChecking(false);
          return;
        } catch {
          if (cancelled) return;
          clearShop();
        }
      }

      // Resolve the shops associated with this user.
      try {
        const response = await api.get("/api/v1/auth/shops");

        if (cancelled) return;

        const shops = response.data?.shops;

        if (!Array.isArray(shops) || shops.length === 0) {
          logout();
          router.replace("/login");
          return;
        }

        if (shops.length > 1) {
          clearShop();
          router.replace("/select-shop");
          return;
        }

        // Exactly one shop: select it automatically.
        const selectedShop = shops[0];

        const switchResponse = await api.post(
          "/api/v1/auth/switch-shop",
          { shopId: selectedShop.id },
        );

        if (cancelled) return;

        const newToken = switchResponse.data?.accessToken;

        if (
          typeof newToken !== "string" ||
          newToken.length === 0
        ) {
          throw new Error(
            "Switch-shop response did not contain an access token",
          );
        }

        setShop(selectedShop);
        setToken(newToken);
      } catch {
        // Do not redirect or log out on every transient error.
        // The user can retry if the API is temporarily unavailable.
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    void initAuth();

    return () => {
      cancelled = true;
    };
  }, [
    hasHydrated,
    isAuthReady,
    isAuthenticated,
    accessToken,
    shop,
    setToken,
    setShop,
    clearShop,
    logout,
    router,
  ]);

  if (!hasHydrated || !isAuthReady || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-primary/10 p-4">
              <h1 className="text-2xl font-bold text-primary">
                Duka
              </h1>
            </div>
          </div>

          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading your shop...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
