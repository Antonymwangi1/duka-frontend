import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  fullname: string;
  email: string;
  role: "OWNER" | "ADMIN" | "CASHIER";
  shopId: string | null;
}

interface Shop {
  id: string;
  shopName: string;
  address: string;
  currency: string;
}

interface AuthState {
  user: User | null;
  shop: Shop | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, shop: Shop | null, token: string) => void;
  setShop: (shop: Shop) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      shop: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, shop, token) =>
        set({
          user,
          shop,
          accessToken: token,
          isAuthenticated: true,
        }),

      setShop: (shop) => set({ shop }),

      setToken: (token) => set({ accessToken: token }),

      logout: () =>
        set({
          user: null,
          shop: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "duka-auth",
      // Only persist user info and auth state
      // Never persist accessToken
      partialize: (state) => ({
        user: state.user,
        shop: state.shop,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
