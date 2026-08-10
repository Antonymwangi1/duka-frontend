"use client";

import { Boxes, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types";

type ProductsTableProps = {
  products: Product[];
  currency: string;
  isLoading: boolean;
  canManage: boolean;
  isOwner: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
};

export function ProductsTable({
  products,
  currency,
  isLoading,
  canManage,
  isOwner,
  onEdit,
  onDelete,
  onAdjustStock,
}: ProductsTableProps) {
  const money = (value: number) =>
    `${currency} ${Number(value).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (isLoading)
    return (
      <Card>
        <CardContent className="space-y-3 pt-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  if (!products.length)
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="font-medium">No products found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first product or try a different search.
          </p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="h-11 pl-5 text-[11px] uppercase tracking-wide text-muted-foreground">
                Product
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                Barcode
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                SKU
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                Category
              </TableHead>
              {isOwner && (
                <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Buying price
                </TableHead>
              )}
              <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                Selling price
              </TableHead>
              <TableHead className="h-11 text-[11px] uppercase tracking-wide text-muted-foreground">
                Inventory
              </TableHead>
              {canManage && (
                <TableHead className="h-11 pr-5 text-right text-[11px] uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const threshold = product.lowStockThreshold ?? 0;
              const isLowStock = product.stockQuantity <= threshold;
              return (
                <TableRow key={product.id} className="group">
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                        {product.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[180px] truncate font-semibold">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.unit ?? "unit"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {product.barcode ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {product.sku ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category ? (
                      <Badge variant="secondary">{product.category.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  {isOwner && (
                    <TableCell>
                      <p className="font-medium">
                        {money(product.buyingPrice)}
                      </p>
                    </TableCell>
                  )}
                  <TableCell>
                    <p className="font-semibold text-primary">
                      {money(product.sellingPrice)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${isLowStock ? "bg-destructive" : "bg-primary"}`}
                      />
                      <div>
                        <p
                          className={`font-semibold ${isLowStock ? "text-destructive" : ""}`}
                        >
                          {product.stockQuantity}{" "}
                          <span className="font-normal text-muted-foreground">
                            {product.unit ?? "units"}
                          </span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isLowStock ? "Low stock" : "In stock"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {canManage && (
                    <TableCell className="pr-5">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden gap-1.5 text-primary hover:text-primary sm:inline-flex"
                          onClick={() => onAdjustStock(product)}
                        >
                          <Boxes /> Stock
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-primary hover:text-primary sm:hidden"
                          onClick={() => onAdjustStock(product)}
                          aria-label={`Adjust stock for ${product.name}`}
                        >
                          <Boxes />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(product)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
