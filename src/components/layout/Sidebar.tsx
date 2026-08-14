"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Store,
  LogOut,
  X,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";

const navItems = [
  {
    label: "POS",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["OWNER", "ADMIN", "CASHIER"],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    roles: ["OWNER", "ADMIN", "CASHIER"],
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ClipboardList,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "Staff",
    href: "/staff",
    icon: Users,
    roles: ["OWNER"],
  },
  {
    label: "Shops",
    href: "/shops",
    icon: Store,
    roles: ["OWNER"],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, shop, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } finally {
      logout();
      router.push("/login");
    }
  };

  const filteredNav = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Duka</h1>
          {shop && (
            <p className="text-sm text-muted-foreground mt-1 truncate max-w-[160px]">
              {shop.shopName}
            </p>
          )}
        </div>

        {/* Close button — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User info and logout */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
            <span className="text-primary text-sm font-semibold">
              {user?.fullname?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.fullname}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — drawer overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!open}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
