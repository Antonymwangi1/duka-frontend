// src/app/page.tsx
"use client";

import Link from "next/link";
import {
  Store,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function LandingPage() {
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  // Determine target path and label based on user role
  const isCashier = user?.role === "CASHIER";
  const dashboardPath = isCashier ? "/pos" : "/dashboard";
  const dashboardLabel = isCashier ? "Go to POS" : "Go to Dashboard";
  const DashboardIcon = isCashier ? ShoppingCart : LayoutDashboard;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl flex items-center justify-center shadow-xs">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Duka</span>
          </div>

          <div className="flex items-center gap-3">
            {!_hasHydrated ? (
              // Loading Skeleton while Zustand hydratation finishes
              <div className="h-10 w-28 bg-muted animate-pulse rounded-xl" />
            ) : isAuthenticated ? (
              /* Authenticated User Actions */
              <Link
                href={dashboardPath}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 rounded-xl font-semibold gap-2"
              >
                <DashboardIcon className="h-4 w-4" />
                <span>{dashboardLabel}</span>
              </Link>
            ) : (
              /* Guest Actions */
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 rounded-xl font-semibold"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide">
          <Zap className="h-3.5 w-3.5" /> Simple, Powerful Shop Management
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl text-balance">
          Run your shop with speed, clarity, and control.
        </h1>

        <p className="text-muted-foreground text-base sm:text-xl max-w-2xl text-balance leading-relaxed">
          Track sales, monitor stock, manage multiple branch locations, and view
          real-time inventory reports from one straightforward workspace.
        </p>

        {/* Dynamic Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
          {_hasHydrated && isAuthenticated ? (
            <Link
              href={dashboardPath}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-base shadow-sm gap-2"
            >
              <DashboardIcon className="h-5 w-5" />
              <span>{dashboardLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-base shadow-sm gap-2"
              >
                Start Managing Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-base"
              >
                Log into Workspace
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 w-full max-w-5xl text-left">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Real-Time Inventory</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Always know what stock is running low before you run out of
              fast-selling items.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Sales & Profit Reports</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track daily revenue, margins, and cashier performance with clean
              analytics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Multi-Store & Roles</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assign cashier roles or owner permissions across single or
              multiple shop locations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 px-4 text-center text-xs text-muted-foreground">
        <p>© 2026 Duka. All rights reserved.</p>
      </footer>
    </div>
  );
}
