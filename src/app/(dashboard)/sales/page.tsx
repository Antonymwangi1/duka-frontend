"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Sale } from "@/types";
import {
  Receipt,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function SalesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { shop } = useAuthStore();
  const currency = shop?.currency ?? "KES";

  const [page, setPage] = useState(1);
  const [date, setDate] = useState("");
  const [staffId, setStaffId] = useState("");
  const [reverseId, setReverseId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [reversing, setReversing] = useState(false);
  const [reverseErr, setReverseErr] = useState<string | null>(null);

  // Build query params
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "15");
  if (date) params.set("date", date);
  if (staffId) params.set("staff_id", staffId);

  const { data, isLoading } = useQuery({
    queryKey: ["sales", page, date, staffId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/sales?${params.toString()}`);
      return res.data;
    },
  });

  const sales: Sale[] = data?.sales ?? [];
  const pagination = data?.pagination;

  const handleReverse = async () => {
    if (!reverseId || !reason.trim()) return;
    try {
      setReversing(true);
      setReverseErr(null);
      await api.post(`/api/v1/sales/${reverseId}/reverse`, { reason });
      setReverseId(null);
      setReason("");

      // Invalidate sales, reports, and products globally across React Query
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      setReverseErr(err.response?.data?.message ?? "Failed to reverse sale");
    } finally {
      setReversing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Sales History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all transactions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setDate("");
            setStaffId("");
            setPage(1);
          }}
          className="shrink-0"
        >
          Clear filters
        </Button>
      </div>

      {/* Sales list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-muted rounded-full p-6 w-fit mx-auto mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium">No sales found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {date
              ? "No sales on this date"
              : "Make your first sale from the POS"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map((sale: any) => {
            const isReversed = sale.isReversed || sale.status === "REVERSED";

            return (
              <Card
                key={sale.id}
                className={`border-border ${
                  isReversed ? "bg-muted/50 opacity-75" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Sale info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-sm font-medium">
                          #{sale.id.slice(0, 8).toUpperCase()}
                        </p>
                        <Badge
                          variant={
                            sale.paymentMethod === "MPESA"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {sale.paymentMethod}
                        </Badge>
                        {sale.discount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {sale.discount}% off
                          </Badge>
                        )}
                        {isReversed && (
                          <Badge variant="destructive" className="text-xs">
                            Reversed
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}{" "}
                          {new Date(sale.createdAt).toLocaleTimeString(
                            "en-KE",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cashier: {sale.servedBy?.fullname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sale.saleItems?.length ?? 0} items
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <p
                        className={`font-bold ${
                          isReversed
                            ? "line-through text-muted-foreground"
                            : "text-primary"
                        }`}
                      >
                        {currency} {Number(sale.totalAmount).toLocaleString()}
                      </p>
                      {sale.discount > 0 && (
                        <p className="text-xs text-muted-foreground line-through">
                          {currency} {Number(sale.subtotal).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/sales/${sale.id}/receipt`)}
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                      {!isReversed && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setReverseId(sale.id);
                            setReverseErr(null);
                            setReason("");
                          }}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reverse
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 15 + 1}–
            {Math.min(page * 15, pagination.total)} of {pagination.total} sales
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reverse sale dialog */}
      <Dialog
        open={!!reverseId}
        onOpenChange={(open) => {
          if (!open) {
            setReverseId(null);
            setReason("");
            setReverseErr(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reverse Sale</DialogTitle>
            <DialogDescription>
              This will restore the stock for all items in this sale and flag
              this transaction as reversed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Reason for reversal</p>
              <Input
                placeholder="e.g. Customer returned items"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {reverseErr && (
              <p className="text-sm text-destructive">{reverseErr}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReverseId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!reason.trim() || reversing}
              onClick={handleReverse}
            >
              {reversing ? "Reversing..." : "Reverse sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
