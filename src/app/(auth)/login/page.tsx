"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      const response = await api.post("/api/v1/auth/login", data);
      const { accessToken, user, requiresShopSelection } = response.data;

      // Fetch shop details
      try {
        const shopsResponse = await api.get("/api/v1/auth/shops", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const shops = shopsResponse.data.shops;
        const shop = shops.length > 0 ? shops[0] : null;
        setAuth(user, shop, accessToken);
      } catch {
        setAuth(user, null, accessToken);
      }

      // Redirect based on role
      if (requiresShopSelection) {
        router.push("/select-shop");
      } else if (user.role === "CASHIER") {
        router.push("/pos");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Invalid email or password");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your store
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Global Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 bg-destructive/10 text-destructive border border-destructive/20 text-sm rounded-xl p-3.5 transition-all animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 rounded-xl font-semibold shadow-xs transition-all hover:opacity-95 active:scale-[0.99] mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Register Redirect */}
        <div className="pt-2 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            Create store
          </Link>
        </div>
      </form>
    </div>
  );
}
