import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export type Period = "daily" | "weekly" | "monthly";

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  totalDiscount: number;
  totalItems: number;
  paymentMethods: {
    cash: { count: number; revenue: number };
    mpesa: { count: number; revenue: number };
  };
  averageTransactionValue: number;
}

export interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  totalDiscount: number;
  grossProfit: number;
  profitMargin: number;
  totalSales: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  unit: string | null;
  unitsSold: number;
  revenue: number;
  profit: number;
}

export interface StaffPerformance {
  staffId: string;
  name: string;
  role: string;
  salesCount: number;
  totalRevenue: number;
  totalItems: number;
  averageTransactionValue: number;
}

export function useReports() {
  const { shop, user } = useAuthStore();
  const [period, setPeriod] = useState<Period>("daily");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );

  const queryParams = {
    period,
    ...(period === "monthly" ? { month } : { date }),
  };

  const isOwner = user?.role === "OWNER";

  // 1. Sales Summary
  const summaryQuery = useQuery({
    queryKey: ["reports", "summary", shop?.id, queryParams],
    queryFn: async (): Promise<SalesSummary> => {
      const res = await api.get("/api/v1/reports/summary", {
        params: queryParams,
      });
      return res.data.data;
    },
    enabled: !!shop?.id,
  });

  // 2. Profit Report
  const profitQuery = useQuery({
    queryKey: ["reports", "profit", shop?.id, queryParams],
    queryFn: async (): Promise<ProfitReport> => {
      const res = await api.get("/api/v1/reports/profit", {
        params: queryParams,
      });
      return res.data.data;
    },
    enabled: !!shop?.id,
  });

  // 3. Top Products
  const topProductsQuery = useQuery({
    queryKey: ["reports", "top-products", shop?.id, queryParams],
    queryFn: async (): Promise<TopProduct[]> => {
      const res = await api.get("/api/v1/reports/top-products", {
        params: { ...queryParams, limit: 5 },
      });
      return res.data.data;
    },
    enabled: !!shop?.id,
  });

  // 4. Staff Performance (Owner Only)
  const staffQuery = useQuery({
    queryKey: ["reports", "staff", shop?.id, queryParams],
    queryFn: async (): Promise<StaffPerformance[]> => {
      const res = await api.get("/api/v1/reports/staff", {
        params: queryParams,
      });
      return res.data.data;
    },
    enabled: !!shop?.id && isOwner,
  });

  return {
    period,
    setPeriod,
    date,
    setDate,
    month,
    setMonth,
    currency: shop?.currency || "KES",
    isOwner,
    summary: summaryQuery.data,
    profit: profitQuery.data,
    topProducts: topProductsQuery.data ?? [],
    staffPerformance: staffQuery.data ?? [],
    isLoading:
      summaryQuery.isLoading ||
      profitQuery.isLoading ||
      topProductsQuery.isLoading ||
      (isOwner && staffQuery.isLoading),
  };
}
