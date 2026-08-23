"use client";

import { useAuthStore } from "@/store/auth.store";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import {
  useDailySummary,
  useDailyProfit,
  useLowStockProducts,
  useTopProducts,
} from "@/hooks/useDashboard";
import { useAuthStore as useAuth } from "@/store/auth.store";
import { useCurrency } from "@/hooks/useCurrency";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-border">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, shop } = useAuthStore();

  // Redirect cashiers away from dashboard
  useEffect(() => {
    if (user?.role == "CASHIER") {
      router.replace("/pos");
    }
  }, [user]);

  // don't render for cashiers
  if (user?.role == "CASHIER") return null;

  const { data: summary, isLoading: summaryLoading } = useDailySummary();
  const { data: profit, isLoading: profitLoading } = useDailyProfit();
  const { data: lowStock } = useLowStockProducts();
  const { data: topProducts } = useTopProducts();

  const isLoading = summaryLoading || profitLoading;

  const { money } = useCurrency();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {user?.fullname?.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is what is happening at {shop?.shopName} today
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-KE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Sales"
            value={summary?.totalSales ?? 0}
            subtitle="transactions"
            icon={ShoppingCart}
            color="primary"
          />
          <StatsCard
            title="Today's Revenue"
            value={money(summary?.totalRevenue ?? 0)}
            subtitle={`${
              summary?.totalDiscount > 0
                ? `KES ${summary.totalDiscount} discounted`
                : "No discounts"
            }`}
            icon={Banknote}
            color="accent"
          />
          <StatsCard
            title="Gross Profit"
            value={money(profit?.grossProfit ?? 0)}
            subtitle={`${profit?.profitMargin ?? 0}% margin`}
            icon={TrendingUp}
            color="accent"
            trend={profit?.grossProfit > 0 ? "up" : "neutral"}
            trendValue={`${profit?.profitMargin ?? 0}% margin`}
          />
          <StatsCard
            title="Low Stock"
            value={lowStock?.length ?? 0}
            subtitle="products need restocking"
            icon={AlertTriangle}
            color={lowStock?.length > 0 ? "destructive" : "muted"}
          />
        </div>
      )}

      {/* Payment methods breakdown */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Cash</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {money(summary.paymentMethods.cash.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {summary.paymentMethods.cash.count} transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <span className="text-sm">M-Pesa</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {money(summary.paymentMethods.mpesa.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {summary.paymentMethods.mpesa.count} transactions
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm font-bold">
                  {money(summary.totalRevenue)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top products today */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Top Products Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!topProducts || topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sales yet today
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product: any, index: number) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[160px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.unitsSold} {product.unit ?? "units"} sold
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-accent">
                        {money(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Low stock alert */}
      {lowStock && lowStock.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alert ({lowStock.length} products)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.slice(0, 5).map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <Badge variant="destructive">
                    {product.stockQuantity} left
                  </Badge>
                </div>
              ))}

              {lowStock.length > 5 && (
                <p className="text-sm text-muted-foreground pt-1">
                  +{lowStock.length - 5} more products low on stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
