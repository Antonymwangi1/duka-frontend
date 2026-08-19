"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export function StaffFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: StaffFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/60 shadow-xs">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Select
          value={roleFilter}
          onValueChange={(value) => onRoleFilterChange(value ?? "ALL")}
        >
          <SelectTrigger className="w-full sm:w-[150px] h-9 text-xs">
            <SelectValue placeholder="Role Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="OWNER">Owners</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
            <SelectItem value="CASHIER">Cashiers</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
