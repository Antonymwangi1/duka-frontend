"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartItem, CartItemType } from "./CartItem";
import api from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrency } from "@/hooks/useCurrency";

interface CartProps {
  items: CartItemType[];
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function Cart({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: CartProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { money } = useCurrency();

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "MPESA">("CASH");
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.sellingPrice) * item.quantity,
    0,
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await api.post("/api/v1/sales", {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        paymentMethod,
        discount,
        notes: notes || undefined,
      });

      // Invalidate relevant caches
      await queryClient.invalidateQueries({
        queryKey: ["reports"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });

      // Clear cart
      onClear();

      // Go to receipt
      router.push(`/sales/${response.data.sale.id}/receipt`);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to process sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-3">
        <div className="bg-muted rounded-full p-6">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium text-muted-foreground">Cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Search for a product to add it
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cart header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Cart</span>
          <Badge variant="secondary">
            {items.reduce((sum, i) => sum + i.quantity, 0)} items
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive text-xs"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>

      <Separator />

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto py-2">
        {items.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        ))}
      </div>

      <Separator />

      {/* Totals and payment */}
      <div className="pt-4 space-y-4">
        {/* Discount */}
        <div className="flex items-center gap-3">
          <Label className="text-sm shrink-0 w-20">Discount %</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="h-8 text-sm"
            placeholder="0"
          />
        </div>

        {/* Payment method */}
        <div className="flex items-center gap-3">
          <Label className="text-sm shrink-0 w-20">Payment</Label>
          <Select
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as "CASH" | "MPESA")}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="MPESA">M-Pesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="flex items-center gap-3">
          <Label className="text-sm shrink-0 w-20">Notes</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-8 text-sm"
            placeholder="Optional..."
          />
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>
              {money(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Discount ({discount}%)</span>
              <span>- {money(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>Total</span>
            <span className="text-primary">{money(total)}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Checkout button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Charge ${money(total)}`
          )}
        </Button>
      </div>
    </div>
  );
}
