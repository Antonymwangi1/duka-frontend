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
import type { Product } from "@/types";

type MovementType = "RESTOCK" | "ADJUSTMENT" | "DAMAGE";
type Props = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    quantity: number;
    movementType: MovementType;
    notes?: string;
  }) => Promise<void>;
  isSaving: boolean;
  error?: string;
};

export function StockAdjustmentDialog({
  product,
  open,
  onOpenChange,
  onSubmit,
  isSaving,
  error,
}: Props) {
  const [movementType, setMovementType] = useState<MovementType>("RESTOCK");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (open) {
      setMovementType("RESTOCK");
      setQuantity("");
      setNotes("");
      setValidationError("");
    }
  }, [open, product]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Number(quantity);
    if (
      !Number.isInteger(parsed) ||
      parsed === 0 ||
      (movementType !== "ADJUSTMENT" && parsed < 0)
    ) {
      setValidationError(
        movementType === "ADJUSTMENT"
          ? "Enter a non-zero whole number."
          : "Enter a whole number greater than zero.",
      );
      return;
    }
    setValidationError("");
    await onSubmit({
      quantity: movementType === "ADJUSTMENT" ? parsed : Math.abs(parsed),
      movementType,
      ...(notes.trim() && { notes: notes.trim() }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {product?.name} currently has {product?.stockQuantity}{" "}
            {product?.unit ?? "units"}.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={submit}>
          {(validationError || error) && (
            <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {validationError || error}
            </p>
          )}
          <div className="grid gap-2">
            <Label htmlFor="movement-type">Movement type</Label>
            <select
              id="movement-type"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as MovementType)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option className="bg-card" value="RESTOCK">
                Restock (add)
              </option>
              <option className="bg-card" value="DAMAGE">
                Damage (remove)
              </option>
              <option className="bg-card" value="ADJUSTMENT">
                Adjustment (positive or negative)
              </option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock-quantity">Quantity</Label>
            <Input
              id="stock-quantity"
              type="number"
              step="1"
              min={movementType === "ADJUSTMENT" ? undefined : "1"}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={
                movementType === "ADJUSTMENT" ? "e.g. -2 or 10" : "e.g. 10"
              }
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock-notes">Notes (optional)</Label>
            <Input
              id="stock-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for this movement"
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
              {isSaving && <Loader2 className="animate-spin" />}Save adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
