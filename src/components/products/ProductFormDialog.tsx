"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, Product } from "@/types";
import type { ProductInput } from "@/hooks/useProducts";

type ProductFormDialogProps = {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductInput) => Promise<void>;
  isSaving: boolean;
  error?: string;
};

const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
  sku: "",
  barcode: "",
  unit: "piece",
  buyingPrice: "",
  sellingPrice: "",
  stockQuantity: "0",
  lowStockThreshold: "",
  imageUrl: "",
};

export function ProductFormDialog({
  open,
  product,
  categories,
  onOpenChange,
  onSubmit,
  isSaving,
  error,
}: ProductFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");
  const isEditing = !!product;

  // Reset the draft whenever the controlled dialog opens for a product.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!open) return;
    setValidationError("");
    setForm(
      product
        ? {
            name: product.name,
            description: product.description ?? "",
            categoryId: product.categoryId ?? "",
            sku: product.sku ?? "",
            barcode: product.barcode ?? "",
            unit: product.unit ?? "piece",
            buyingPrice: String(product.buyingPrice),
            sellingPrice: String(product.sellingPrice),
            stockQuantity: String(product.stockQuantity),
            lowStockThreshold:
              product.lowStockThreshold == null
                ? ""
                : String(product.lowStockThreshold),
            imageUrl: "",
          }
        : emptyForm,
    );
  }, [open, product]);

  const setValue = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const buyingPrice = Number(form.buyingPrice);
    const sellingPrice = Number(form.sellingPrice);

    if (
      !form.name.trim() ||
      !Number.isFinite(buyingPrice) ||
      buyingPrice <= 0 ||
      !Number.isFinite(sellingPrice) ||
      sellingPrice <= 0
    ) {
      setValidationError(
        "Enter a product name, buying price, and selling price greater than zero.",
      );
      return;
    }
    if (sellingPrice < buyingPrice) {
      setValidationError(
        "Selling price must be greater than or equal to buying price.",
      );
      return;
    }

    setValidationError("");
    await onSubmit({
      name: form.name.trim(),
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(form.categoryId && { categoryId: form.categoryId }),
      ...(form.sku.trim() && { sku: form.sku.trim() }),
      ...(form.barcode.trim() && { barcode: form.barcode.trim() }),
      ...(form.unit.trim() && { unit: form.unit.trim() }),
      buyingPrice,
      sellingPrice,
      ...(!isEditing && { stockQuantity: Number(form.stockQuantity) || 0 }),
      ...(form.lowStockThreshold !== "" && {
        lowStockThreshold: Number(form.lowStockThreshold),
      }),
      ...(form.imageUrl.trim() && { imageUrl: form.imageUrl.trim() }),
    });
  };

  const displayedError = validationError || error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit product" : "Add product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details below."
              : "Add a product to your shop inventory."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {displayedError && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {displayedError}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="product-name">Product name</Label>
            <Input
              id="product-name"
              value={form.name}
              onChange={(e) => setValue("name", e.target.value)}
              placeholder="e.g. Bread 400g"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="product-category">Category</Label>
              <select
                id="product-category"
                value={form.categoryId}
                onChange={(e) => setValue("categoryId", e.target.value)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" className="bg-card">
                  No category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-card"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-unit">Unit</Label>
              <Input
                id="product-unit"
                value={form.unit}
                onChange={(e) => setValue("unit", e.target.value)}
                placeholder="piece, kg, litre"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="product-buying-price">Buying price</Label>
              <Input
                id="product-buying-price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.buyingPrice}
                onChange={(e) => setValue("buyingPrice", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-selling-price">Selling price</Label>
              <Input
                id="product-selling-price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.sellingPrice}
                onChange={(e) => setValue("sellingPrice", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {!isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="product-stock">Opening stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={(e) => setValue("stockQuantity", e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="product-threshold">Low-stock threshold</Label>
              <Input
                id="product-threshold"
                type="number"
                min="0"
                step="1"
                value={form.lowStockThreshold}
                onChange={(e) => setValue("lowStockThreshold", e.target.value)}
                placeholder="Uses shop default if blank"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="product-sku">SKU</Label>
              <Input
                id="product-sku"
                value={form.sku}
                onChange={(e) => setValue("sku", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-barcode">Barcode</Label>
              <Input
                id="product-barcode"
                value={form.barcode}
                onChange={(e) => setValue("barcode", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product-description">Description</Label>
            <Input
              id="product-description"
              value={form.description}
              onChange={(e) => setValue("description", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              {isEditing ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
