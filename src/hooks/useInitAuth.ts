import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const useInitAuth = () => {
  const { isAuthenticated, setToken, logout } = useAuthStore();

  useEffect(() => {
    // If user was previously authenticated
    // silently get a new access token using the cookie
    if (isAuthenticated) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true },
        )
        .then((res) => {
          setToken(res.data.accessToken);
        })
        .catch(() => {
          // Cookie expired — logout cleanly
          logout();
        });
    }
  }, []);
};
