"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
  currency: string;
}

export function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  currency,
}: CartItemProps) {
  const subtotal = Number(item.product.sellingPrice) * item.quantity;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">
          {currency} {Number(item.product.sellingPrice).toLocaleString()} each
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onDecrease(item.product.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={item.quantity >= item.product.stockQuantity}
          onClick={() => onIncrease(item.product.id)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Subtotal */}
      <div className="text-right shrink-0 w-20">
        <p className="text-sm font-semibold">
          {currency} {subtotal.toLocaleString()}
        </p>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
        onClick={() => onRemove(item.product.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
