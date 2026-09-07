"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

interface Shop {
  id: string;
  shopName: string;
  address: string;
  currency: string;
  isActive: boolean;
}

export default function SelectShopPage() {
  const router = useRouter();
  const { setAuth, setShop, setToken, user } = useAuthStore();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get("/api/v1/auth/shops");
        setShops(response.data.shops);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleSelectShop = async (shopId: string) => {
    try {
      setSelecting(shopId);
      const response = await api.post("/api/v1/auth/switch-shop", { shopId });
      const { accessToken, shop } = response.data;

      // Store both token and shop
      setToken(accessToken);
      setShop(shop);

      // Get user role to redirect correctly
      const { user } = useAuthStore.getState();
      if (user?.role === "CASHIER") {
        router.push("/pos");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select a shop</h2>
        <p className="text-muted-foreground mt-1">
          Choose which shop you want to manage
        </p>
      </div>

      <div className="space-y-3">
        {shops.map((shop) => (
          <button
            key={shop.id}
            onClick={() => handleSelectShop(shop.id)}
            disabled={!!selecting}
            className="w-full text-left"
          >
            <Card className="border-border hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{shop.shopName}</p>
                    <p className="text-sm text-muted-foreground">
                      {shop.address}
                    </p>
                  </div>
                </div>

                {selecting === shop.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {shop.currency}
                  </div>
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/dashboard/shops/new")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Open a new shop
      </Button>
    </div>
  );
}
