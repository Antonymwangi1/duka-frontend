"use client";

import { useState, useCallback } from "react";
import { Search, Barcode, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { Product } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
}

export function ProductSearch({ onAddToCart }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"name" | "barcode">("name");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["pos-search", mode, debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return null;

      if (mode === "barcode") {
        const res = await api.get(
          `/api/v1/products/search?barcode=${debouncedQuery}`,
        );
        return { products: [res.data.product], pagination: null };
      }

      const res = await api.get(`/api/v1/products/search?q=${debouncedQuery}`);
      return res.data;
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 0,
  });

  const products = data?.products ?? [];

  return (
    <div className="space-y-3">
      {/* Search mode toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={mode === "name" ? "default" : "outline"}
          onClick={() => {
            setMode("name");
            setQuery("");
          }}
          className="flex-1"
        >
          <Search className="h-4 w-4 mr-2" />
          Search by name
        </Button>
        <Button
          size="sm"
          variant={mode === "barcode" ? "default" : "outline"}
          onClick={() => {
            setMode("barcode");
            setQuery("");
          }}
          className="flex-1"
        >
          <Barcode className="h-4 w-4 mr-2" />
          Scan barcode
        </Button>
      </div>

      {/* Search input */}
      <div className="relative">
        <Input
          placeholder={
            mode === "barcode"
              ? "Scan or type barcode..."
              : "Search product name..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
          autoFocus
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results */}
      {products.length > 0 && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {products.map((product: Product) => (
            <Card
              key={product.id}
              className={`border-border cursor-pointer hover:border-primary transition-colors ${
                product.stockQuantity === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (product.stockQuantity > 0) {
                  onAddToCart(product);
                  if (mode === "barcode") setQuery("");
                }
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sku && `SKU: ${product.sku}`}
                      {product.category?.name && ` · ${product.category.name}`}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="font-bold text-sm text-primary">
                      KES {Number(product.sellingPrice).toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        product.stockQuantity === 0
                          ? "destructive"
                          : product.stockQuantity <= 5
                            ? "outline"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {product.stockQuantity === 0
                        ? "Out of stock"
                        : `${product.stockQuantity} ${product.unit ?? "units"}`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {debouncedQuery && !isLoading && products.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No products found
        </p>
      )}
    </div>
  );
}
