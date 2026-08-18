"use client";

import Link from "next/link";
import {
  Plus,
  TrendingUp,
  Receipt,
  CreditCard,
  ArrowUpRight,
  ShoppingBag,
  History,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDailySummary } from "@/hooks/useDashboard";
import { useCurrency } from "@/hooks/useCurrency";

export default function SalesPage() {
  const { data: summary, isLoading: summaryLoading } = useDailySummary();
  console.log(summary);

  const { money } = useCurrency();

  return (
    <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sales History
            </h1>
            <Badge variant="secondary" className="font-medium text-xs">
              Live POS
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor transaction records, print receipts, and track daily store
            activity.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/pos"
          className={buttonVariants({
            variant: "default",
            size: "lg",
            className:
              "shadow-md hover:shadow-lg transition-all gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold",
          })}
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>New Transaction</span>
        </Link>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border-border/60 shadow-sm relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(summary?.totalRevenue ?? 0)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +0%
              </span>{" "}
              vs yesterday
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-border/60 shadow-sm relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Transactions
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalSales ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to process checkout
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-border/60 shadow-sm relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg. Ticket Value
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-border/60 shadow-sm relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Items Sold
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Units today</p>
          </CardContent>
        </Card>
      </div>

      {/* Styled Placeholder / Empty State for Sales History */}
      <Card className="border-dashed border-2 border-border/80 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm mb-4">
            <History className="h-8 w-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No Sales History Found
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            You haven&apos;t recorded any sales transactions yet today. Start a
            new checkout to fill this table.
          </p>
          <Link
            href="/pos"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "gap-2",
            })}
          >
            <Plus className="h-4 w-4" />
            Start First Sale
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
