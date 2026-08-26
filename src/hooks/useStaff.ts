import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import type { Pagination } from "@/types";

export type StaffRole = "ADMIN" | "CASHIER";

export interface StaffMember {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  role: StaffRole;
  shopId: string;
  isActive: boolean;
  createdAt?: string;
}

export type StaffInput = {
  fullname: string;
  email: string;
  phone: string;
  role: StaffRole;
  password?: string;
  shopId?: string;
  isActive?: boolean;
};

type StaffResponse = {
  staff: StaffMember[];
  pagination: Pagination;
};

// fetch paginated and filtered staff list
export function useStaff(
  page: number = 1,
  search: string = "",
  role: string = "ALL",
) {
  const { accessToken, shop } = useAuthStore();

  return useQuery({
    queryKey: ["staff", { page, search, role }],
    queryFn: async (): Promise<StaffResponse> => {
      const response = await api.get("/api/v1/auth/staff", {
        params: {
          page,
          limit: 20,
          ...(search.trim() && { q: search.trim() }),
          ...(role !== "ALL" && { role }),
        },
      });
      return response.data;
    },
    enabled: !!accessToken && !!shop?.id,
  });
}

// mutations:; create, update and delete staff
export function useStaffMutations() {
  const queryClient = useQueryClient();

  const refreshStaff = () => {
    queryClient.invalidateQueries({ queryKey: ["staff"] });
  };

  const create = useMutation({
    mutationFn: async (data: StaffInput) => {
      // Strip out fields backend does not expect
      const payload = {
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      };
      const response = await api.post("/api/v1/auth/staff", payload);
      return response.data.staff as StaffMember;
    },
    onSuccess: refreshStaff,
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<StaffInput>;
    }) => {
      const response = await api.patch(`/api/v1/auth/staff/${id}`, data);
      return response.data.staff as StaffMember;
    },
    onSuccess: refreshStaff,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/auth/staff/${id}`),
    onSuccess: refreshStaff,
  });

  return { create, update, remove };
}
