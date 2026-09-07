import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  _hasHydrated: boolean;

  setAuth: (user: User, shop: Shop | null, token: string) => void;
  setShop: (shop: Shop) => void;
  clearShop: () => void;
  setToken: (token: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      shop: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setAuth: (user, shop, token) =>
        set({
          user,
          shop,
          accessToken: token,
          isAuthenticated: true,
        }),

      setShop: (shop) => set({ shop }),
      clearShop: () => set({ shop: null }),
      setToken: (token) => set({ accessToken: token }),

      logout: () => {
        // Clear localStorage completely
        if (typeof window !== "undefined") {
          localStorage.removeItem("duka-auth");
        }
        set({
          user: null,
          shop: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "duka-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        shop: state.shop,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
