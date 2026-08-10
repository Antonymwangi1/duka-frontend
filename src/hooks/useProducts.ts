import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { Category, Pagination, Product } from "@/types";

export type ProductInput = {
  name: string;
  description?: string;
  categoryId?: string;
  sku?: string;
  barcode?: string;
  unit?: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  imageUrl?: string;
};

type ProductsResponse = { products: Product[]; pagination: Pagination };

export function useProducts(page: number, search: string) {
  const { accessToken, shop } = useAuthStore();

  return useQuery({
    queryKey: ["products", { page, search }],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = search.trim()
        ? await api.get("/api/v1/products/search", {
            params: { q: search.trim(), page, limit: 20 },
          })
        : await api.get("/api/v1/products", { params: { page, limit: 20 } });
      return response.data;
    },
    enabled: !!accessToken && !!shop?.id,
  });
}

export function useProductCategories() {
  const { accessToken, shop } = useAuthStore();

  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get("/api/v1/products/categories");
      return response.data.categories;
    },
    enabled: !!accessToken && !!shop?.id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const refreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const create = useMutation({
    mutationFn: async (data: ProductInput) => {
      const response = await api.post("/api/v1/products", data);
      return response.data.product as Product;
    },
    onSuccess: refreshProducts,
  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductInput }) => {
      const response = await api.patch(`/api/v1/products/${id}`, data);
      return response.data.product as Product;
    },
    onSuccess: refreshProducts,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/products/${id}`),
    onSuccess: refreshProducts,
  });

  const adjustStock = useMutation({
    mutationFn: async ({ id, quantity, movementType, notes }: { id: string; quantity: number; movementType: "RESTOCK" | "ADJUSTMENT" | "DAMAGE"; notes?: string }) => {
      const response = await api.patch(`/api/v1/products/${id}/stock`, { quantity, movementType, notes });
      return response.data.product as Product;
    },
    onSuccess: refreshProducts,
  });

  return { create, update, remove, adjustStock };
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["product-categories"] });
  const create = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post("/api/v1/products/categories", { name });
      return response.data.category as Category;
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/products/categories/${id}`),
    onSuccess: refresh,
  });
  return { create, remove };
}
