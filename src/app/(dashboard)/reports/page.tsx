// src/app/(dashboard)/reports/page.tsx
"use client";

import { useReports } from "@/hooks/useReports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  Users,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export default function ReportsPage() {
  const {
    period,
    setPeriod,
    date,
    setDate,
    month,
    setMonth,
    isOwner,
    summary,
    profit,
    topProducts,
    staffPerformance,
    isLoading,
  } = useReports();

  const { money } = useCurrency();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Track business performance, profit margins, and sales channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          {period === "monthly" ? (
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-[160px]"
            />
          ) : (
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-[160px]"
            />
          )}
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {money(summary?.totalRevenue ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.totalSales ?? 0} sales transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {money(profit?.grossProfit ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cost of goods: {money(profit?.totalCost ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profit?.profitMargin ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Net margin on total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {money(summary?.averageTransactionValue ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.totalItems ?? 0} total units sold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Channels Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" /> M-Pesa Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {money(summary?.paymentMethods.mpesa.revenue ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary?.paymentMethods.mpesa.count ?? 0} transactions
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-200 bg-emerald-50"
            >
              Mobile Money
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Banknote className="h-5 w-5 text-blue-600" /> Cash Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {money(summary?.paymentMethods.cash.revenue ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summary?.paymentMethods.cash.count ?? 0} transactions
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-blue-600 border-blue-200 bg-blue-50"
            >
              Cash Drawer
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Top Selling Products
            </CardTitle>
            <CardDescription>
              Highest performing products by volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No sales data available for this period.
                    </TableCell>
                  </TableRow>
                ) : (
                  topProducts.map((p) => (
                    <TableRow key={p.productId}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">
                        {p.unitsSold} {p.unit ?? ""}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        {p.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Staff Performance (Owner Exclusive) */}
        {isOwner && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Staff Performance
                </CardTitle>
                <CardDescription>Sales processed per cashier</CardDescription>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead className="text-right">Sales Count</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Avg / Sale</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No staff activity recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffPerformance.map((s) => (
                      <TableRow key={s.staffId}>
                        <TableCell>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {s.role}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {s.salesCount}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {s.totalRevenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {s.averageTransactionValue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
