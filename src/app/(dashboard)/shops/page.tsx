"use client";

import { useState } from "react";
import { useShops, Shop } from "@/hooks/useShops";
import { CreateShopModal } from "@/components/shops/CreateShopModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Store,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ShopsPage() {
  const { shops, isLoading, currentShop, switchShop, isSwitching } = useShops();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleSwitch = async (targetShop: Shop) => {
    setSwitchingId(targetShop.id);
    try {
      await switchShop(targetShop);
      queryClient.clear();
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to switch shop:", error);
      setSwitchingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shops Management
          </h1>
          <p className="text-muted-foreground">
            Manage your outlets, switch locations, or add a new branch.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Shop
        </Button>
      </div>

      {/* Shops Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((s) => {
          const isCurrent = currentShop?.id === s.id;

          return (
            <Card
              key={s.id}
              className={`relative flex flex-col justify-between transition-all ${isCurrent ? "border-primary shadow-sm ring-1 ring-primary" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2.5 rounded-xl ${isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {s.shopName}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {s.currency}
                      </CardDescription>
                    </div>
                  </div>
                  {isCurrent ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge variant={s.isActive ? "outline" : "secondary"}>
                      {s.isActive ? "Inactive" : "Disabled"}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm flex-1">
                <div className="flex items-center text-muted-foreground gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.address}</span>
                </div>
                <div className="flex items-center text-muted-foreground gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{s.phone}</span>
                </div>
              </CardContent>

              <div className="p-6 pt-0 mt-auto">
                {isCurrent ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Currently Operating Here
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={isSwitching}
                    onClick={() => handleSwitch(s)}
                  >
                    {switchingId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ArrowRightLeft className="mr-2 h-4 w-4" /> Switch to
                        this Shop
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <CreateShopModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
