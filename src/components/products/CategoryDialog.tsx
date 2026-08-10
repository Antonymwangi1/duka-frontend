"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
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
import type { Category } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCreate: (name: string) => Promise<void>;
  onDelete: (category: Category) => Promise<void>;
  isSaving: boolean;
  error?: string;
};

export function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onCreate,
  onDelete,
  isSaving,
  error,
}: Props) {
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setValidationError("Category name is required.");
      return;
    }
    setValidationError("");
    await onCreate(name.trim());
    setName("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage categories</DialogTitle>
          <DialogDescription>
            Create categories to organize your products.
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={submit}>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="category-name">New category</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Beverages"
            />
          </div>
          <Button className="mt-6" type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : "Add"}
          </Button>
        </form>
        {(validationError || error) && (
          <p className="text-sm text-destructive">{validationError || error}</p>
        )}
        <div className="max-h-60 space-y-2 overflow-y-auto border-t pt-4">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="text-sm">{category.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete ${category.name}? Products will be uncategorized.`,
                      )
                    )
                      void onDelete(category);
                  }}
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 />
                </Button>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
