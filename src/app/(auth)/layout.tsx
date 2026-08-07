"use client"
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [_hasHydrated, isAuthenticated]);

  // Don't render anything until hydration is complete
  if (!_hasHydrated) return null;

  // Don't render auth pages if already logged in
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div>
          <h1 className="text-4xl font-bold text-primary-foreground">Duka</h1>
          <p className="text-primary-foreground/70 mt-2 text-lg">
            Shop Management System
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-foreground/10 rounded-2xl p-6">
            <p className="text-primary-foreground text-lg leading-relaxed">
              "Built specifically for Kenyan shops — track your stock, sales,
              and profit from one simple dashboard."
            </p>
            <div className="mt-4">
              <p className="text-primary-foreground font-semibold">Duka</p>
              <p className="text-primary-foreground/70 text-sm">
                Built for Kenyan businesses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Setup time", value: "5 minutes" },
              { label: "M-Pesa", value: "✓" },
              { label: "Free", value: "always" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 rounded-xl p-4 text-center"
              >
                <p className="text-primary-foreground text-2xl font-bold">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/50 text-sm">
          © 2026 Duka. Built for Kenyan businesses.
        </p>
      </div>

      {/* Right side — auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Duka</h1>
            <p className="text-muted-foreground mt-1">Shop Management System</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
