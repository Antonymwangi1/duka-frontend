"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";

const RegisterSchema = z.object({
  // Owner details
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(\+254|0)[17]\d{8}$/, "Invalid Kenyan phone number"),
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
    .regex(/^(\+254|0)[17]\d{8}$/, "Invalid Kenyan phone number"),
});

type RegisterInput = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const response = await api.post("/api/v1/auth/register", {
        ...data,
        currency: "KES",
      });

      const { accessToken, user, shop } = response.data;
      setAuth(user, shop, accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription>Set up Duka for your shop in minutes</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Owner Details */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Your Details
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="John Doe"
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <p className="text-destructive text-sm">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="0712345678"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Shop Details */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Your Shop Details
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input
                  id="shopName"
                  placeholder="John General Store"
                  {...register("shopName")}
                />
                {errors.shopName && (
                  <p className="text-destructive text-sm">
                    {errors.shopName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="address">Location</Label>
                  <Input
                    id="address"
                    placeholder="Nairobi City"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-destructive text-sm">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopPhone">Shop Phone</Label>
                  <Input
                    id="shopPhone"
                    placeholder="0712345678"
                    {...register("shopPhone")}
                  />
                  {errors.shopPhone && (
                    <p className="text-destructive text-sm">
                      {errors.shopPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
