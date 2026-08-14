"use client";

import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSearch } from "@/components/pos/ProductSearch";
import { Cart } from "@/components/pos/Cart";
import { CartItemType } from "@/components/pos/CartItem";
import { Product } from "@/types";

export default function NewSalePage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);

      if (existing) {
        // Check stock limit
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const handleIncrease = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.quantity < i.product.stockQuantity
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    );
  }, []);

  const handleDecrease = useCallback((productId: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.product.id === productId && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const handleRemove = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleClear = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/sales"
          className={buttonVariants({
            variant: "ghost",
            size: "icon",
          })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">New Sale</h1>
          <p className="text-sm text-muted-foreground">
            Search products and build your cart
          </p>
        </div>
      </div>

      {/* POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-180px)]">
        {/* Left — Product search */}
        <Card className="border-border flex flex-col overflow-hidden">
          <CardHeader className="pb-3 shrink-0">
            <CardTitle className="text-base">Products</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <ProductSearch onAddToCart={handleAddToCart} />
          </CardContent>
        </Card>

        {/* Right — Cart */}
        <Card className="border-border flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-hidden p-4 flex flex-col">
            <Cart
              items={cartItems}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onClear={handleClear}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
