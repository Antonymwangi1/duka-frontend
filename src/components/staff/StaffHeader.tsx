"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StaffHeaderProps {
  totalCount: number;
  onAddClick: () => void;
}

export function StaffHeader({ totalCount, onAddClick }: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Staff Management
          </h1>
          <Badge variant="secondary" className="font-semibold text-xs">
            {totalCount} Total
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee access, register assignments, and store roles.
        </p>
      </div>

      <Button
        onClick={onAddClick}
        className="gap-2 bg-primary text-primary-foreground font-semibold shadow-xs hover:shadow-sm"
      >
        <UserPlus className="h-4 w-4" />
        <span>Add New Staff</span>
      </Button>
    </div>
  );
}
