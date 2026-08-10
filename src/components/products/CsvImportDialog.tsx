"use client";

import { useEffect, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
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
import type { ProductInput } from "@/hooks/useProducts";

type ParsedRow = ProductInput & { row: number; error?: string };
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (
    rows: ProductInput[],
  ) => Promise<{ imported: number; failed: number }>;
  isImporting: boolean;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else value += char;
  }
  values.push(value.trim());
  return values;
}

function parseCsv(text: string): ParsedRow[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((header) =>
    header.toLowerCase().replace(/[\s-]+/g, "_"),
  );
  const get = (values: string[], name: string) =>
    values[headers.indexOf(name)] ?? "";
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const name = get(values, "name");
    const buyingPrice = Number(get(values, "buying_price"));
    const sellingPrice = Number(get(values, "selling_price"));
    const stockQuantity = Number(get(values, "stock_quantity") || 0);
    let error = "";
    if (!name) error = "Name is required";
    else if (!Number.isFinite(buyingPrice) || buyingPrice <= 0)
      error = "Invalid buying_price";
    else if (!Number.isFinite(sellingPrice) || sellingPrice <= 0)
      error = "Invalid selling_price";
    else if (sellingPrice < buyingPrice)
      error = "Selling price is below buying price";
    else if (!Number.isInteger(stockQuantity) || stockQuantity < 0)
      error = "Invalid stock_quantity";
    return {
      row: index + 2,
      name,
      buyingPrice,
      sellingPrice,
      stockQuantity,
      ...(get(values, "description") && {
        description: get(values, "description"),
      }),
      ...(get(values, "category_id") && {
        categoryId: get(values, "category_id"),
      }),
      ...(get(values, "sku") && { sku: get(values, "sku") }),
      ...(get(values, "barcode") && { barcode: get(values, "barcode") }),
      ...(get(values, "unit") && { unit: get(values, "unit") }),
      ...(get(values, "low_stock_threshold") && {
        lowStockThreshold: Number(get(values, "low_stock_threshold")),
      }),
      error: error || undefined,
    };
  });
}

export function CsvImportDialog({
  open,
  onOpenChange,
  onImport,
  isImporting,
}: Props) {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileError, setFileError] = useState("");
  useEffect(() => {
    if (!open) {
      setRows([]);
      setFileError("");
    }
  }, [open]);
  const validRows = rows.filter((row) => !row.error);
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Please choose a .csv file.");
      return;
    }
    setFileError("");
    setRows(parseCsv(await file.text()));
  };
  const importRows = async () => {
    const result = await onImport(validRows);
    if (result.failed === 0) onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import products from CSV</DialogTitle>
          <DialogDescription>
            Use columns: name, buying_price, selling_price, stock_quantity.
            Optional: description, category_id, sku, barcode, unit,
            low_stock_threshold.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Input type="file" accept=".csv,text/csv" onChange={handleFile} />
          {fileError && <p className="text-sm text-destructive">{fileError}</p>}
          {rows.length > 0 && (
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-sm">
                <span>{rows.length} rows found</span>
                <span
                  className={
                    validRows.length === rows.length
                      ? "text-primary"
                      : "text-destructive"
                  }
                >
                  {validRows.length} ready to import
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y">
                {rows.map((row) => (
                  <div
                    key={row.row}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span>
                      Row {row.row}: {row.name || "Unnamed product"}
                    </span>
                    {row.error ? (
                      <span className="text-destructive">{row.error}</span>
                    ) : (
                      <span className="text-primary">Ready</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Rows with errors will be skipped. Categories must use an existing
            category ID.
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={importRows}
            disabled={!validRows.length || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="animate-spin" /> Importing...
              </>
            ) : (
              <>
                <FileUp /> Import {validRows.length || ""} products
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
