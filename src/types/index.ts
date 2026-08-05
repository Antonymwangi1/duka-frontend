export type Role = "OWNER" | "ADMIN" | "CASHIER";
export type PaymentMethod = "CASH" | "MPESA";
export type MovementType = "RESTOCK" | "ADJUSTMENT" | "DAMAGE";
export type Period = "daily" | "weekly" | "monthly";

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: Role;
  shopId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Shop {
  id: string;
  shopName: string;
  address: string;
  phone: string;
  currency: string;
  plan: string;
  isActive: boolean;
  defaultLowStockThreshold: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  _count: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  unit: string | null;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number | null;
  isActive: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  buyingPrice: number;
  subtotal: number;
  product: { id: string; name: string; unit: string | null };
}

export interface Sale {
  id: string;
  shopId: string;
  servedById: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  saleItems: SaleItem[];
  servedBy: { id: string; fullname: string };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}
