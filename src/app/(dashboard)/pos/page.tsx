"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Search,
  Barcode,
  Trash2,
  Tag,
  ShoppingCart,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Cart } from "@/components/pos/Cart";
import { CartItemType } from "@/components/pos/CartItem";
import { Product } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/auth.store";
import { useCurrency } from "@/hooks/useCurrency";

export default function NewSalePage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { money } = useCurrency();

  const debounceSearch = useDebounce(searchQuery, 300);

  // fetch products
  const { data, isLoading, isError } = useProducts(page, debounceSearch);
  const products = data?.products ?? [];

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
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

  const totalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1600px] mx-auto p-2 sm:p-4 gap-3 overflow-hidden bg-background">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 bg-card px-4 py-2.5 rounded-xl border border-border/60 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/sales"
            className={buttonVariants({
              variant: "ghost",
              size: "icon-sm",
              className: "rounded-lg",
            })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Terminal 01
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] bg-accent/10 text-accent font-semibold border-accent/20"
              >
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Cart</span>
            </Button>
          )}
          <div className="bg-secondary/80 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-secondary-foreground">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span>
              {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden">
        {/* Left Side: Product Search & Grid */}
        <div className="lg:col-span-7 flex flex-col gap-3 h-full overflow-hidden">
          {/* Search Input */}
          <div className="bg-card p-3 rounded-xl border border-border/60 shadow-sm flex items-center gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or scan barcode..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset page to 1 when typing new search
                }}
                className="pl-9 bg-background/50 border-border/80 focus-visible:ring-primary h-10"
                autoFocus
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 h-10 w-10"
            >
              <Barcode className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 bg-card rounded-xl border border-border/60 shadow-sm p-3 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm">Loading products...</span>
              </div>
            ) : isError ? (
              <div className="h-full flex items-center justify-center text-destructive text-sm">
                Failed to load products. Please check connection.
              </div>
            ) : products.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2.5">
                {products.map((product) => {
                  const isOutOfStock = product.stockQuantity === 0;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(product)}
                      className={`group relative flex flex-col justify-between p-3 h-28 bg-background border border-border/60 rounded-xl text-left transition-all shadow-xs active:scale-[0.98] ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary/5 hover:border-primary/40"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary line-clamp-2">
                            {product.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          {product.category?.name ?? "General"}
                        </span>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <span className="text-sm font-bold text-foreground">
                          {money(product.sellingPrice)}
                        </span>
                        <Badge
                          variant={isOutOfStock ? "destructive" : "secondary"}
                          className="text-[10px] px-1.5 py-0 font-medium"
                        >
                          {isOutOfStock
                            ? "Out"
                            : `${product.stockQuantity} left`}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Cart Section */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <Card className="h-full border-border/60 shadow-sm flex flex-col overflow-hidden bg-card p-4">
            <CardHeader className="py-3 px-4 border-b border-border/60 shrink-0">
              <CardTitle className="text-sm font-bold">Current Order</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
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
    </div>
  );
}
