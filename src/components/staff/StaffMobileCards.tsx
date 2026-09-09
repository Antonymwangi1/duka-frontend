"use client";

import {
  Store,
  Mail,
  Phone,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StaffMember } from "@/hooks/useStaff";
import { useAuthStore } from "@/store/auth.store";

interface StaffMobileCardsProps {
  staffList: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
}

export function StaffMobileCards({
  staffList,
  onEdit,
  onDelete,
}: StaffMobileCardsProps) {
  const { shop } = useAuthStore()

  return (
    <div className="grid grid-cols-1 divide-y md:hidden">
      {staffList.map((staff) => (
        <div key={staff.id} className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {staff.fullname.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {staff.fullname}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Store className="w-3 h-3" /> {shop?.shopName ?? "Duka"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(staff)}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(staff.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{staff.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{staff.phone}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <Badge variant="outline" className="text-[10px]">
              {staff.role}
            </Badge>
            <Badge
              variant={staff.isActive ? "secondary" : "outline"}
              className="text-[10px]"
            >
              {staff.isActive ? "Active" : "Disabled"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
