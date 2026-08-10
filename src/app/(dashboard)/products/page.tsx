"use client";

import { useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Package, Plus, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProductFormDialog } from "@/components/products/ProductFormDialog";
import { ProductsTable } from "@/components/products/ProductsTable";
import { StockAdjustmentDialog } from "@/components/products/StockAdjustmentDialog";
import { CategoryDialog } from "@/components/products/CategoryDialog";
import { CsvImportDialog } from "@/components/products/CsvImportDialog";
import {
  useProductCategories,
  useProductMutations,
  useProducts,
  useCategoryMutations,
  type ProductInput,
} from "@/hooks/useProducts";
import type { Product } from "@/types";

export default function ProductsPage() {
  const { user, shop } = useAuthStore();
  const canManage = user?.role === "OWNER" || user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const productsQuery = useProducts(page, search);
  const categoriesQuery = useProductCategories();
  const { create, update, remove, adjustStock } = useProductMutations();
  const categoryMutations = useCategoryMutations();
  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;

  const handleSave = async (data: ProductInput) => {
    setActionError("");
    try {
      if (editingProduct)
        await update.mutateAsync({ id: editingProduct.id, data });
      else await create.mutateAsync(data);
      setDialogOpen(false);
    } catch (error: unknown) {
      setActionError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ??
              "Could not save this product. Please try again.")
          : "Could not save this product. Please try again.",
      );
    }
  };

  const handleDelete = async (product: Product) => {
    if (
      !window.confirm(
        `Delete ${product.name}? This will hide it from your active products.`,
      )
    )
      return;
    try {
      await remove.mutateAsync(product.id);
    } catch (error: unknown) {
      setActionError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ??
              "Could not delete this product. Please try again.")
          : "Could not delete this product. Please try again.",
      );
    }
  };

  const handleStockAdjustment = async (data: {
    quantity: number;
    movementType: "RESTOCK" | "ADJUSTMENT" | "DAMAGE";
    notes?: string;
  }) => {
    if (!stockProduct) return;
    try {
      await adjustStock.mutateAsync({ id: stockProduct.id, ...data });
      setStockProduct(null);
    } catch (error: unknown) {
      setActionError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Could not adjust stock.")
          : "Could not adjust stock.",
      );
    }
  };

  const handleCategoryCreate = async (name: string) => {
    try {
      await categoryMutations.create.mutateAsync(name);
    } catch (error: unknown) {
      setActionError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Could not create category.")
          : "Could not create category.",
      );
    }
  };

  const handleCategoryDelete = async (category: import("@/types").Category) => {
    try {
      await categoryMutations.remove.mutateAsync(category.id);
    } catch (error: unknown) {
      setActionError(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Could not delete category.")
          : "Could not delete category.",
      );
    }
  };

  const handleCsvImport = async (rows: ProductInput[]) => {
    let imported = 0;
    let failed = 0;
    for (const row of rows) {
      try { await create.mutateAsync(row); imported += 1; }
      catch { failed += 1; }
    }
    if (failed) setActionError(`${imported} imported, ${failed} failed. Check duplicate SKUs or barcodes.`);
    return { imported, failed };
  };

  const openCreate = () => {
    setActionError("");
    setEditingProduct(null);
    setDialogOpen(true);
  };
  const openEdit = (product: Product) => {
    setActionError("");
    setEditingProduct(product);
    setDialogOpen(true);
  };
  const total = pagination?.total ?? products.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your inventory, prices, and stock levels.
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCategoriesOpen(true)}>
              Manage categories
            </Button>
            <Button variant="outline" onClick={() => setCsvOpen(true)}>Import CSV</Button>
            <Button onClick={openCreate}>
              <Plus /> Add product
            </Button>
          </div>
        )}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {total} product{total === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
      {actionError && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {actionError}
        </p>
      )}
      {productsQuery.isError && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Could not load products. Please refresh and try again.
        </p>
      )}
      {!productsQuery.isLoading &&
      !productsQuery.isError &&
      products.length === 0 &&
      !search ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="mb-3 size-10 text-muted-foreground" />
            <p className="font-medium">Your inventory is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first product to start tracking stock.
            </p>
            {canManage && (
              <Button className="mt-4" onClick={openCreate}>
                <Plus /> Add product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ProductsTable
          products={products}
          currency={shop?.currency ?? "KES"}
          isLoading={productsQuery.isLoading}
          canManage={canManage}
          isOwner={user?.role === "OWNER"}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdjustStock={setStockProduct}
        />
      )}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || productsQuery.isFetching}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasMore || productsQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}
      <ProductFormDialog
        open={dialogOpen}
        product={editingProduct}
        categories={categoriesQuery.data ?? []}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
        isSaving={create.isPending || update.isPending}
        error={actionError}
      />
      <StockAdjustmentDialog
        product={stockProduct}
        open={!!stockProduct}
        onOpenChange={(open) => !open && setStockProduct(null)}
        onSubmit={handleStockAdjustment}
        isSaving={adjustStock.isPending}
        error={actionError}
      />
      <CategoryDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        categories={categoriesQuery.data ?? []}
        onCreate={handleCategoryCreate}
        onDelete={handleCategoryDelete}
        isSaving={
          categoryMutations.create.isPending ||
          categoryMutations.remove.isPending
        }
        error={actionError}
      />
      <CsvImportDialog open={csvOpen} onOpenChange={setCsvOpen} onImport={handleCsvImport} isImporting={create.isPending} />
    </div>
  );
}
