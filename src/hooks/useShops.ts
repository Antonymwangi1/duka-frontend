// src/hooks/useShops.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { z } from "zod";

// Define Zod validation schema directly inside the hook file
export const CreateShopSchema = z.object({
  shopName: z
    .string({ error: "Shop name is required" })
    .min(2, "Shop name must be at least 2 characters")
    .max(100, "Shop name must not exceed 100 characters")
    .trim(),

  address: z
    .string({ error: "Address is required" })
    .min(2, "Address must be at least 2 characters")
    .trim(),

  shopPhone: z
    .string({ error: "Shop phone is required" })
    .regex(/^(\+254|0)[17]\d{8}$/, "Invalid Kenyan phone number")
    .trim(),

  currency: z.enum(["KES", "USD"]),
});

// Infer input type from local schema
export type CreateShopInput = z.infer<typeof CreateShopSchema>;

export interface Shop {
  id: string;
  shopName: string;
  address: string;
  phone: string;
  currency: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
}

export function useShops() {
  const queryClient = useQueryClient();
  const { accessToken, setShop, setToken, shop: currentShop } = useAuthStore();

  // Fetch all shops owned by user
  const shopsQuery = useQuery({
    queryKey: ["shops"],
    queryFn: async (): Promise<Shop[]> => {
      const response = await api.get("/api/v1/auth/shops");
      return response.data.shops;
    },
    enabled: !!accessToken,
  });

  // Switch Active Shop
  const switchShopMutation = useMutation({
    mutationFn: async (targetShop: Shop) => {
      const response = await api.post("/api/v1/auth/switch-shop", {
        shopId: targetShop.id,
      });
      return { shop: targetShop, token: response.data.accessToken };
    },
    onSuccess: ({ shop, token }) => {
      setShop(shop);
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  // Create New Shop
  const createShopMutation = useMutation({
    mutationFn: async (data: CreateShopInput) => {
      const response = await api.post("/api/v1/auth/shops", data);
      return response.data;
    },
    onSuccess: (data) => {
      setShop(data.shop);
      if (data.accessToken) setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  return {
    shops: shopsQuery.data ?? [],
    isLoading: shopsQuery.isLoading,
    currentShop,
    switchShop: switchShopMutation.mutateAsync,
    isSwitching: switchShopMutation.isPending,
    createShop: createShopMutation.mutateAsync,
    isCreating: createShopMutation.isPending,
  };
}
