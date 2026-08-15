"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Printer, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { shop } = useAuthStore();

  const { data: receipt, isLoading } = useQuery({
    queryKey: ["receipt", id],
    queryFn: async () => {
      const response = await api.get(`/api/v1/sales/${id}/receipt`);
      return response.data.receipt;
    },
  });

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto space-y-4 p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Receipt not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/pos")}
        >
          Back to POS
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Actions — hidden when printing */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/pos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            New sale
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Link href="/pos">
            <Button size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Receipt */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 print:border-none print:shadow-none">
        {/* Shop header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-primary">{receipt.shopName}</h1>
          <p className="text-sm text-muted-foreground">{receipt.shopAddress}</p>
          {receipt.shopPhone && (
            <p className="text-sm text-muted-foreground">{receipt.shopPhone}</p>
          )}
        </div>

        <Separator />

        {/* Receipt meta */}
        <div className="grid grid-cols-2 gap-1 text-sm">
          <p className="text-muted-foreground">Receipt #</p>
          <p className="text-right font-mono font-medium">
            {receipt.receiptNumber}
          </p>

          <p className="text-muted-foreground">Date</p>
          <p className="text-right">
            {new Date(receipt.date).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <p className="text-muted-foreground">Time</p>
          <p className="text-right">
            {new Date(receipt.date).toLocaleTimeString("en-KE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="text-muted-foreground">Cashier</p>
          <p className="text-right">{receipt.cashier}</p>

          <p className="text-muted-foreground">Payment</p>
          <p className="text-right">
            <Badge variant="outline" className="text-xs">
              {receipt.paymentMethod}
            </Badge>
          </p>
        </div>

        <Separator />

        {/* Items */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Items
          </p>
          {receipt.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} {item.unit ?? "pcs"} × {receipt.currency}{" "}
                  {item.unitPrice.toLocaleString()}
                </p>
              </div>
              <p className="font-medium ml-4">
                {receipt.currency} {item.subtotal.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>
              {receipt.currency} {receipt.subtotal.toLocaleString()}
            </span>
          </div>

          {receipt.discount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Discount</span>
              <span>
                - {receipt.currency} {receipt.discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-primary">
              {receipt.currency} {receipt.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Thank you for your business!</p>
          <p className="text-xs text-muted-foreground">Powered by Duka</p>
        </div>
      </div>
    </div>
  );
}
