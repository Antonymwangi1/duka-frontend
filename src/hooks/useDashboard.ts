import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export const useDailySummary = () => {
  const { accessToken, shop } = useAuthStore();
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["reports", "summary", "daily", today],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/reports/summary?period=daily&date=${today}`,
      );
      return response.data.data;
    },
    enabled: !!accessToken && !!shop?.id, // only run when token and shop exist
    staleTime: 5 * 60 * 1000,
  });
};

export const useDailyProfit = () => {
  const { accessToken, shop } = useAuthStore();
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["reports", "profit", "daily", today],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/reports/profit?period=daily&date=${today}`,
      );
      return response.data.data;
    },
    enabled: !!accessToken && !!shop?.id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLowStockProducts = () => {
  const { accessToken, shop } = useAuthStore();

  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: async () => {
      const response = await api.get("/api/v1/products/low-stock");
      return response.data.products;
    },
    enabled: !!accessToken && !!shop?.id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopProducts = () => {
  const { accessToken, shop } = useAuthStore();
  const today = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ["reports", "top-products", "daily", today],
    queryFn: async () => {
      const response = await api.get(
        `/api/v1/reports/top-products?period=daily&date=${today}&limit=5`,
      );
      return response.data.data;
    },
    enabled: !!accessToken && !!shop?.id,
    staleTime: 5 * 60 * 1000,
  });
};
