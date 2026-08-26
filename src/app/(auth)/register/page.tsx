"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  Store,
  MapPin,
  AlertCircle,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

const RegisterSchema = z.object({
  // Owner details
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(\+254|0)[17]\d{8}$/,
      "Invalid Kenyan phone number (e.g. 0712345678)",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  // Shop details
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  address: z.string().min(2, "Address is required"),
  shopPhone: z
    .string()
    .regex(
      /^(\+254|0)[17]\d{8}$/,
      "Invalid Kenyan phone number (e.g. 0712345678)",
    ),
  currency: z.enum(["KES", "USD"]).default("KES"),
});

type RegisterInput = z.input<typeof RegisterSchema>;
type RegisterOutput = z.output<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput, any, RegisterOutput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      currency: "KES",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const response = await api.post("/api/v1/auth/register", data);

      const { accessToken, user, shop } = response.data;
      setAuth(user, shop, accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Registration failed. Please check your inputs.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Setup your Duka workspace and store details in minutes
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-2.5 bg-destructive/10 text-destructive border border-destructive/20 text-sm rounded-xl p-3.5 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* SECTION 1: Personal Details */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <User className="h-3.5 w-3.5" />
            <span>Owner Credentials</span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="fullname"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullname"
                placeholder="John Doe"
                className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                {...register("fullname")}
              />
            </div>
            {errors.fullname && (
              <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
                {errors.fullname.message}
              </p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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

            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="0712345678"
                  className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Password
            </Label>
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
        </div>

        <div className="h-px bg-border/60 my-2" />

        {/* SECTION 2: Shop Details */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Store className="h-3.5 w-3.5" />
            <span>Store Profile</span>
          </div>

          {/* Shop Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="shopName"
              className="text-xs font-semibold uppercase text-muted-foreground"
            >
              Shop Name
            </Label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="shopName"
                placeholder="Main Street Store"
                className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                {...register("shopName")}
              />
            </div>
            {errors.shopName && (
              <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
                {errors.shopName.message}
              </p>
            )}
          </div>

          {/* Location & Shop Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label
                htmlFor="address"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  placeholder="Nairobi Town"
                  className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("address")}
                />
              </div>
              {errors.address && (
                <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="shopPhone"
                className="text-xs font-semibold uppercase text-muted-foreground"
              >
                Shop Contact
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="shopPhone"
                  placeholder="0712345678"
                  className="pl-10 h-11 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("shopPhone")}
                />
              </div>
              {errors.shopPhone && (
                <p className="text-destructive text-xs font-medium pl-1 animate-in fade-in">
                  {errors.shopPhone.message}
                </p>
              )}
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Primary Currency
            </Label>
            <div className="relative">
              <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Select
                value={watch("currency")}
                onValueChange={(val) => {
                  if (val) setValue("currency", val);
                }}
              >
                <SelectTrigger className="pl-10 h-11 rounded-xl transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <Button
          type="submit"
          className="w-full h-11 rounded-xl font-semibold shadow-xs transition-all hover:opacity-95 active:scale-[0.99] mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating your shop...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </Button>

        {/* Sign In Redirect */}
        <div className="pt-1 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
