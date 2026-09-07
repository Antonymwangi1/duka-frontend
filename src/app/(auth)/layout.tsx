"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, user } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  if (!_hasHydrated) return null;
  if (isAuthenticated && user) return null;

  return (
    <div className="min-h-screen w-full bg-zinc-50/60 dark:bg-zinc-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl flex items-center justify-center shadow-xs">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Duka
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>© 2026 Duka. All rights reserved.</p>
      </footer>
    </div>
  );
}
